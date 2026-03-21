/**
 * LiviFlex - Paiement Fractionné et Crédit (OPTIONNEL)
 * Pour chauffeurs et clients
 */

const CREDIT_TIERS = [
  { maxAmount: 10000, interest: 0, duration: 7, label: 'Micro' },
  { maxAmount: 25000, interest: 2, duration: 14, label: 'Standard' },
  { maxAmount: 50000, interest: 3.5, duration: 30, label: 'Premium' },
  { maxAmount: 100000, interest: 5, duration: 60, label: 'Business' },
]

const ELIGIBILITY_CRITERIA = {
  minRides: 20,
  minRating: 4.0,
  minMonthsActive: 2,
  maxExistingLoans: 1,
  maxLatePayments: 0,
}

class LiviFlexService {
  constructor() {
    this.isEnabled = false // Optionnel, désactivé par défaut
    this.activeLoans = new Map()
    this.pendingApplications = new Map()
  }
  
  /**
   * Vérifie l'éligibilité au crédit
   */
  checkEligibility(userId, userStats) {
    const checks = {
      rides: { required: ELIGIBILITY_CRITERIA.minRides, actual: userStats.totalRides || 0, passed: (userStats.totalRides || 0) >= ELIGIBILITY_CRITERIA.minRides },
      rating: { required: ELIGIBILITY_CRITERIA.minRating, actual: userStats.rating || 0, passed: (userStats.rating || 0) >= ELIGIBILITY_CRITERIA.minRating },
      months: { required: ELIGIBILITY_CRITERIA.minMonthsActive, actual: userStats.monthsActive || 0, passed: (userStats.monthsActive || 0) >= ELIGIBILITY_CRITERIA.minMonthsActive },
      existingLoans: { required: 0, actual: this.activeLoans.get(userId)?.length || 0, passed: (this.activeLoans.get(userId)?.length || 0) <= ELIGIBILITY_CRITERIA.maxExistingLoans },
      latePayments: { required: 0, actual: userStats.latePayments || 0, passed: (userStats.latePayments || 0) <= ELIGIBILITY_CRITERIA.maxLatePayments },
    }
    
    const allPassed = Object.values(checks).every(c => c.passed)
    const maxEligibleAmount = allPassed ? this.calculateMaxAmount(userStats) : 0
    
    return {
      eligible: allPassed,
      checks,
      maxAmount: maxEligibleAmount,
      tier: this.getCreditTier(maxEligibleAmount),
      reason: allPassed ? null : this.getIneligibilityReason(checks)
    }
  }
  
  /**
   * Calcule le montant maximum de crédit
   */
  calculateMaxAmount(userStats) {
    // Basé sur les revenus moyens
    const avgMonthlyEarnings = userStats.avgMonthlyEarnings || 50000
    const multiplier = userStats.rating > 4.5 ? 0.8 : 0.5
    
    const maxAmount = Math.min(avgMonthlyEarnings * multiplier, 100000)
    
    // Arrondi au palier inférieur
    const tier = CREDIT_TIERS.find(t => maxAmount <= t.maxAmount) || CREDIT_TIERS[CREDIT_TIERS.length - 1]
    return tier.maxAmount
  }
  
  /**
   * Récupère le palier de crédit
   */
  getCreditTier(amount) {
    return CREDIT_TIERS.find(t => amount <= t.maxAmount) || CREDIT_TIERS[0]
  }
  
  /**
   * Crée une demande de crédit
   */
  applyForCredit(userId, amount, purpose, duration = null) {
    const tier = this.getCreditTier(amount)
    const actualDuration = duration || tier.duration
    
    const application = {
      id: `LIVI-APP-${Date.now()}`,
      userId,
      amount,
      purpose,
      duration: actualDuration,
      interestRate: tier.interest,
      status: 'pending',
      createdAt: new Date(),
      estimatedApproval: '2 minutes',
      repaymentSchedule: this.generateRepaymentSchedule(amount, tier.interest, actualDuration)
    }
    
    this.pendingApplications.set(application.id, application)
    
    return application
  }
  
  /**
   * Génère le calendrier de remboursement
   */
  generateRepaymentSchedule(amount, interestRate, duration) {
    const totalInterest = (amount * interestRate) / 100
    const totalRepayment = amount + totalInterest
    const installmentCount = Math.ceil(duration / 7) // Hebdomadaire
    const installmentAmount = Math.ceil(totalRepayment / installmentCount)
    
    const schedule = []
    const startDate = new Date()
    
    for (let i = 1; i <= installmentCount; i++) {
      const dueDate = new Date(startDate)
      dueDate.setDate(dueDate.getDate() + (i * 7))
      
      schedule.push({
        installment: i,
        amount: i === installmentCount ? totalRepayment - (installmentAmount * (installmentCount - 1)) : installmentAmount,
        dueDate: dueDate.toISOString().split('T')[0],
        status: 'pending'
      })
    }
    
    return {
      totalRepayment,
      totalInterest,
      installmentCount,
      installments: schedule
    }
  }
  
  /**
   * Approuve un crédit instantanément
   */
  approveCredit(applicationId) {
    const application = this.pendingApplications.get(applicationId)
    if (!application) return null
    
    const loan = {
      ...application,
      status: 'approved',
      approvedAt: new Date(),
      disbursedAmount: application.amount,
      remainingAmount: application.repaymentSchedule.totalRepayment,
      paidAmount: 0,
      nextPayment: application.repaymentSchedule.installments[0],
      progress: 0
    }
    
    // Ajoute aux crédits actifs
    const userLoans = this.activeLoans.get(application.userId) || []
    userLoans.push(loan)
    this.activeLoans.set(application.userId, userLoans)
    
    // Retire des pending
    this.pendingApplications.delete(applicationId)
    
    return loan
  }
  
  /**
   * Effectue un remboursement
   */
  makePayment(userId, loanId, amount) {
    const userLoans = this.activeLoans.get(userId) || []
    const loan = userLoans.find(l => l.id === loanId)
    
    if (!loan) return { success: false, error: 'Crédit non trouvé' }
    
    loan.paidAmount += amount
    loan.remainingAmount -= amount
    loan.progress = Math.round((loan.paidAmount / loan.repaymentSchedule.totalRepayment) * 100)
    
    // Met à jour le prochain paiement
    const nextInstallment = loan.repaymentSchedule.installments.find(i => i.status === 'pending')
    if (nextInstallment && loan.paidAmount >= nextInstallment.amount) {
      nextInstallment.status = 'paid'
      loan.nextPayment = loan.repaymentSchedule.installments.find(i => i.status === 'pending') || null
    }
    
    // Si remboursé en totalité
    if (loan.remainingAmount <= 0) {
      loan.status = 'completed'
      loan.completedAt = new Date()
    }
    
    return {
      success: true,
      loan,
      payment: {
        amount,
        date: new Date(),
        remaining: loan.remainingAmount,
        progress: loan.progress
      }
    }
  }
  
  /**
   * Paiement différé pour client (pay later)
   */
  createDeferredPayment(userId, rideAmount, dueDate = null) {
    const defaultDueDate = new Date()
    defaultDueDate.setDate(defaultDueDate.getDate() + 30)
    
    const deferred = {
      id: `LIVI-DEF-${Date.now()}`,
      userId,
      amount: rideAmount,
      dueDate: dueDate || defaultDueDate.toISOString().split('T')[0],
      status: 'pending',
      createdAt: new Date(),
      fee: Math.round(rideAmount * 0.02) // 2% de frais
    }
    
    return deferred
  }
  
  /**
   * Épargne automatique
   */
  setupAutoSave(userId, percentage = 10) {
    return {
      userId,
      enabled: true,
      percentage,
      targetAmount: 100000,
      currentSavings: 0,
      rules: [
        { trigger: 'ride_completed', action: 'save_percentage', value: percentage },
        { trigger: 'weekly_bonus', action: 'save_fixed', value: 1000 },
      ]
    }
  }
  
  /**
   * Calcule les projections de crédit
   */
  calculateProjections(amount, duration) {
    const tier = this.getCreditTier(amount)
    const schedule = this.generateRepaymentSchedule(amount, tier.interest, duration)
    
    return {
      amount,
      duration,
      interestRate: tier.interest,
      totalRepayment: schedule.totalRepayment,
      totalInterest: schedule.totalInterest,
      weeklyPayment: schedule.installments[0]?.amount || 0,
      schedule: schedule.installments.slice(0, 4), // 4 premières semaines
      savings: {
        vsTraditional: Math.round(amount * 0.15), // 15% vs prêt traditionnel
        timeSaved: '2-3 jours'
      }
    }
  }
  
  /**
   * Récupère le résumé des crédits actifs
   */
  getLoanSummary(userId) {
    const loans = this.activeLoans.get(userId) || []
    const active = loans.filter(l => l.status === 'approved')
    const completed = loans.filter(l => l.status === 'completed')
    
    const totalBorrowed = loans.reduce((sum, l) => sum + l.amount, 0)
    const totalRepaid = loans.reduce((sum, l) => sum + l.paidAmount, 0)
    const totalRemaining = loans.reduce((sum, l) => sum + (l.remainingAmount || 0), 0)
    
    return {
      active: {
        count: active.length,
        totalRemaining,
        nextPayment: active[0]?.nextPayment || null,
        urgent: active.filter(l => {
          const next = l.nextPayment
          if (!next) return false
          const daysUntil = Math.ceil((new Date(next.dueDate) - new Date()) / (1000 * 60 * 60 * 24))
          return daysUntil <= 3
        }).length
      },
      completed: {
        count: completed.length,
        totalBorrowed
      },
      stats: {
        totalBorrowed,
        totalRepaid,
        creditScore: this.calculateCreditScore(userId, loans)
      }
    }
  }
  
  /**
   * Calcule le score de crédit interne
   */
  calculateCreditScore(userId, loans) {
    if (loans.length === 0) return 50 // Score de base
    
    let score = 50
    
    // Bonus pour remboursement à temps
    const onTimePayments = loans.filter(l => l.status === 'completed').length
    score += onTimePayments * 10
    
    // Malus pour retards
    const latePayments = loans.filter(l => l.latePayments > 0).length
    score -= latePayments * 15
    
    // Bonus volume
    score += Math.min(20, loans.length * 2)
    
    return Math.min(100, Math.max(0, score))
  }
  
  /**
   * Widget pour dashboard chauffeur
   */
  getDashboardWidget(userId, userStats) {
    if (!this.isEnabled) {
      return {
        enabled: false,
        teaser: {
          icon: '💳',
          title: 'LiviFlex disponible',
          desc: 'Crédit instantané jusqu\'à 50 000 FCFA',
          cta: 'Vérifier éligibilité'
        }
      }
    }
    
    const eligibility = this.checkEligibility(userId, userStats)
    const summary = this.getLoanSummary(userId)
    
    return {
      enabled: true,
      eligible: eligibility.eligible,
      maxAmount: eligibility.maxAmount,
      creditScore: summary.stats.creditScore,
      activeLoans: summary.active.count,
      urgentPayments: summary.active.urgent,
      nextPayment: summary.active.nextPayment,
      quickActions: [
        { label: 'Demander crédit', icon: '💰', enabled: eligibility.eligible },
        { label: 'Rembourser', icon: '💳', enabled: summary.active.count > 0 },
        { label: 'Épargne auto', icon: '🏦', enabled: true }
      ]
    }
  }
  
  /**
   * Raison d'inéligibilité
   */
  getIneligibilityReason(checks) {
    if (!checks.rides.passed) return `Effectuez encore ${checks.rides.required - checks.rides.actual} courses`
    if (!checks.rating.passed) return `Améliorez votre note (${checks.rating.actual}/5)`
    if (!checks.months.passed) return `Ancienneté insuffisante (${checks.months.actual} mois)`
    if (!checks.existingLoans.passed) return 'Remboursez vos crédits en cours'
    if (!checks.latePayments.passed) return 'Régularisez vos paiements en retard'
    return 'Critères non remplis'
  }
}

export default new LiviFlexService()
