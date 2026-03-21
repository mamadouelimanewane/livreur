/**
 * LiviProtect - Micro-Assurance Intégrée
 * Couverture accident, perte, retard
 */

const INSURANCE_PLANS = {
  basic: {
    id: 'basic',
    name: 'Essentiel',
    price: 100, // FCFA par course
    coverage: {
      accident: 50000,
      luggage: 0,
      delay: 0,
      cancellation: 0,
    },
    features: ['Accident pendant course'],
    color: '#84cc16'
  },
  standard: {
    id: 'standard',
    name: 'Confort',
    price: 200,
    coverage: {
      accident: 100000,
      luggage: 25000,
      delay: 1000,
      cancellation: 500,
    },
    features: ['Accident', 'Perte bagage', 'Retard >15min'],
    color: '#22c55e'
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 500,
    coverage: {
      accident: 250000,
      luggage: 100000,
      delay: 2000,
      cancellation: 1000,
      medical: 50000,
    },
    features: ['Tout Standard', 'Frais médicaux', 'Assistance 24/7'],
    color: '#16a34a'
  }
}

const CLAIM_TYPES = {
  accident: {
    name: 'Accident',
    documents: ['photo_incident', 'constat', 'certificat_medical'],
    processingTime: '24h',
    icon: '🚑'
  },
  luggage: {
    name: 'Perte bagage',
    documents: ['declaration_perte', 'photo_bagage', 'recu_achat'],
    processingTime: '48h',
    icon: '🧳'
  },
  delay: {
    name: 'Retard',
    documents: ['screenshot_course', 'justificatif'],
    processingTime: 'instant',
    icon: '⏱️'
  },
  cancellation: {
    name: 'Annulation',
    documents: ['screenshot_annulation'],
    processingTime: 'instant',
    icon: '❌'
  }
}

class LiviProtectService {
  constructor() {
    this.activePolicies = new Map()
    this.claims = new Map()
  }
  
  /**
   * Souscrit à une assurance
   */
  subscribe(userId, planId, autoRenew = true) {
    const plan = INSURANCE_PLANS[planId]
    if (!plan) return null
    
    const policy = {
      id: `LIVI-POL-${Date.now()}`,
      userId,
      planId,
      plan,
      status: 'active',
      subscribedAt: new Date(),
      autoRenew,
      ridesCovered: 0,
      claimsMade: 0,
      totalCoverageUsed: 0
    }
    
    const userPolicies = this.activePolicies.get(userId) || []
    userPolicies.push(policy)
    this.activePolicies.set(userId, userPolicies)
    
    return policy
  }
  
  /**
   * Vérifie la couverture pour une course
   */
  checkCoverage(userId, rideId) {
    const policies = this.activePolicies.get(userId) || []
    const active = policies.find(p => p.status === 'active')
    
    if (!active) {
      return {
        covered: false,
        suggestion: INSURANCE_PLANS.basic
      }
    }
    
    return {
      covered: true,
      policy: active,
      coverage: active.plan.coverage,
      remaining: this.calculateRemainingCoverage(active)
    }
  }
  
  /**
   * Calcule la couverture restante
   */
  calculateRemainingCoverage(policy) {
    const remaining = {}
    Object.entries(policy.plan.coverage).forEach(([key, total]) => {
      const used = policy.totalCoverageUsed[key] || 0
      remaining[key] = total - used
    })
    return remaining
  }
  
  /**
   * Dépose une réclamation
   */
  fileClaim(userId, policyId, type, details) {
    const claimType = CLAIM_TYPES[type]
    if (!claimType) return { success: false, error: 'Type de réclamation invalide' }
    
    const claim = {
      id: `LIVI-CLM-${Date.now()}`,
      userId,
      policyId,
      type,
      status: 'pending',
      details,
      documents: [],
      filedAt: new Date(),
      estimatedProcessing: claimType.processingTime,
      amount: details.amount || 0,
      icon: claimType.icon
    }
    
    const userClaims = this.claims.get(userId) || []
    userClaims.push(claim)
    this.claims.set(userId, userClaims)
    
    // Auto-approbation pour petits montants
    if (type === 'delay' || type === 'cancellation') {
      claim.status = 'approved'
      claim.approvedAt = new Date()
      claim.payoutAmount = details.amount
    }
    
    return {
      success: true,
      claim,
      nextSteps: claimType.documents
    }
  }
  
  /**
   * Approuve une réclamation
   */
  approveClaim(claimId, payoutAmount) {
    // Trouve la réclamation
    let claim = null
    for (const [userId, userClaims] of this.claims) {
      claim = userClaims.find(c => c.id === claimId)
      if (claim) break
    }
    
    if (!claim) return null
    
    claim.status = 'approved'
    claim.approvedAt = new Date()
    claim.payoutAmount = payoutAmount
    claim.payoutStatus = 'processing'
    
    return claim
  }
  
  /**
   * Effectue le paiement d'une réclamation
   */
  processPayout(claimId) {
    let claim = null
    for (const [userId, userClaims] of this.claims) {
      claim = userClaims.find(c => c.id === claimId)
      if (claim) break
    }
    
    if (!claim || claim.status !== 'approved') return null
    
    claim.payoutStatus = 'completed'
    claim.paidAt = new Date()
    
    return {
      success: true,
      amount: claim.payoutAmount,
      method: 'Wave/OM',
      transactionId: `PAY-${Date.now()}`
    }
  }
  
  /**
   * Calcule le coût pour une période
   */
  calculateCost(planId, ridesCount) {
    const plan = INSURANCE_PLANS[planId]
    if (!plan) return null
    
    const monthlyCost = plan.price * ridesCount
    const yearlyCost = monthlyCost * 12
    
    return {
      perRide: plan.price,
      monthly: monthlyCost,
      yearly: yearlyCost,
      savings: yearlyCost * 0.15 // 15% de réduction si annuel
    }
  }
  
  /**
   * Compare les plans
   */
  comparePlans() {
    return Object.values(INSURANCE_PLANS).map(plan => ({
      ...plan,
      recommended: plan.id === 'standard',
      bestValue: plan.id === 'premium'
    }))
  }
  
  /**
   * Récupère l'historique des réclamations
   */
  getClaimsHistory(userId) {
    const userClaims = this.claims.get(userId) || []
    
    return {
      total: userClaims.length,
      approved: userClaims.filter(c => c.status === 'approved').length,
      pending: userClaims.filter(c => c.status === 'pending').length,
      rejected: userClaims.filter(c => c.status === 'rejected').length,
      totalPayout: userClaims.reduce((sum, c) => sum + (c.payoutAmount || 0), 0),
      claims: userClaims.sort((a, b) => b.filedAt - a.filedAt)
    }
  }
  
  /**
   * Génère un certificat de couverture
   */
  generateCertificate(userId, policyId) {
    const policies = this.activePolicies.get(userId) || []
    const policy = policies.find(p => p.id === policyId)
    
    if (!policy) return null
    
    return {
      id: `CERT-${policyId}`,
      holder: userId,
      plan: policy.plan.name,
      coverage: policy.plan.coverage,
      validFrom: policy.subscribedAt,
      validUntil: new Date(policy.subscribedAt.getTime() + 365 * 24 * 60 * 60 * 1000),
      qrCode: `https://livigo.sn/verify/${policyId}`,
      emergencyNumber: '800-LIVI-PROTECT'
    }
  }
  
  /**
   * Widget pour le dashboard
   */
  getDashboardWidget(userId) {
    const policies = this.activePolicies.get(userId) || []
    const active = policies.find(p => p.status === 'active')
    const claims = this.getClaimsHistory(userId)
    
    if (!active) {
      return {
        hasInsurance: false,
        recommended: INSURANCE_PLANS.standard,
        teaser: {
          icon: '🛡️',
          title: 'Protégez vos courses',
          desc: 'Assurance à partir de 100 FCFA/course',
          cta: 'Souscrire'
        }
      }
    }
    
    return {
      hasInsurance: true,
      plan: active.plan,
      coverage: this.calculateRemainingCoverage(active),
      stats: {
        ridesCovered: active.ridesCovered,
        claims: claims.total,
        totalProtected: active.ridesCovered * active.plan.coverage.accident
      },
      quickActions: [
        { label: 'Déclarer sinistre', icon: '📝', enabled: true },
        { label: 'Voir couverture', icon: '📋', enabled: true },
        { label: 'Urgence', icon: '🚨', enabled: true, urgent: true }
      ]
    }
  }
  
  /**
   * Simulation de scénarios
   */
  simulateScenario(scenario, planId) {
    const plan = INSURANCE_PLANS[planId]
    if (!plan) return null
    
    const scenarios = {
      accident: {
        description: 'Accident mineur pendant course',
        cost: 25000,
        covered: plan.coverage.accident >= 25000,
        payout: Math.min(25000, plan.coverage.accident),
        yourCost: Math.max(0, 25000 - plan.coverage.accident)
      },
      luggage: {
        description: 'Perte de bagage',
        cost: 50000,
        covered: plan.coverage.luggage >= 50000,
        payout: Math.min(50000, plan.coverage.luggage),
        yourCost: Math.max(0, 50000 - plan.coverage.luggage)
      },
      delay: {
        description: 'Chauffeur en retard de 30min',
        cost: 2000,
        covered: plan.coverage.delay >= 2000,
        payout: plan.coverage.delay,
        yourCost: 0
      }
    }
    
    return scenarios[scenario]
  }
}

export default new LiviProtectService()
