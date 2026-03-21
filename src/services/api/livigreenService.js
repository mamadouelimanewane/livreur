/**
 * LiviGreen - Mode Éco-Responsabilité (OPTIONNEL)
 * Suivi carbone, compensation, véhicules verts
 */

// Données CO2 par type de transport (g CO2/km)
const CO2_EMISSIONS = {
  'moto_essence': 80,
  'moto_electrique': 10,
  'voiture_essence': 180,
  'voiture_diesel': 160,
  'bus': 120,
  'marche': 0,
}

// Prix de compensation (FCFA par kg CO2)
const COMPENSATION_PRICE = 500

// Projets de reforestation au Sénégal
const REFORESTATION_PROJECTS = [
  {
    id: 1,
    name: 'Forêt de Mbao',
    location: 'Dakar',
    trees: 5000,
    description: 'Reforestation de la forêt côtière de Mbao',
    image: '🌳'
  },
  {
    id: 2,
    name: 'Parc de la Langue de Barbarie',
    location: 'Saint-Louis',
    trees: 3000,
    description: 'Protection des dunes et mangroves',
    image: '🌴'
  },
  {
    id: 3,
    name: 'Forêt Classée de Thiès',
    location: 'Thiès',
    trees: 8000,
    description: 'Restauration de la forêt sèche',
    image: '🌲'
  }
]

class LiviGreenService {
  constructor() {
    this.isEnabled = false // Mode optionnel, désactivé par défaut
    this.userPreferences = new Map()
  }
  
  /**
   * Active/désactive le mode éco pour un utilisateur
   */
  toggleEcoMode(userId, enabled) {
    this.userPreferences.set(userId, {
      enabled,
      activatedAt: enabled ? new Date() : null,
      stats: enabled ? { co2Saved: 0, treesPlanted: 0, ecoRides: 0 } : null
    })
    return this.userPreferences.get(userId)
  }
  
  /**
   * Vérifie si le mode éco est actif
   */
  isEcoModeEnabled(userId) {
    return this.userPreferences.get(userId)?.enabled || false
  }
  
  /**
   * Calcule l'empreinte carbone d'une course
   */
  calculateRideEmission(distance, vehicleType = 'moto_essence') {
    const emissionPerKm = CO2_EMISSIONS[vehicleType] || CO2_EMISSIONS['moto_essence']
    const emission = (distance / 1000) * emissionPerKm // en grammes
    
    // Comparaison avec voiture
    const carEmission = (distance / 1000) * CO2_EMISSIONS['voiture_essence']
    const saved = carEmission - emission
    
    return {
      emission: emission.toFixed(0), // g CO2
      emissionKg: (emission / 1000).toFixed(3), // kg CO2
      comparedToCar: saved.toFixed(0), // g CO2 économisé vs voiture
      comparedToCarKg: (saved / 1000).toFixed(3),
      vehicleType,
      isEcoFriendly: vehicleType.includes('electrique') || vehicleType === 'marche'
    }
  }
  
  /**
   * Calcule le total CO2 économisé par un utilisateur
   */
  calculateTotalSavings(userId, rides) {
    if (!this.isEcoModeEnabled(userId)) {
      return { enabled: false, savings: 0 }
    }
    
    let totalSaved = 0
    let totalEmission = 0
    
    rides.forEach(ride => {
      const calc = this.calculateRideEmission(ride.distance, ride.vehicleType)
      totalSaved += parseFloat(calc.comparedToCar)
      totalEmission += parseFloat(calc.emission)
    })
    
    const treesEquivalent = Math.floor(totalSaved / 20000) // 20kg = 1 arbre/an
    
    return {
      enabled: true,
      totalSavedKg: (totalSaved / 1000).toFixed(2),
      totalEmissionKg: (totalEmission / 1000).toFixed(2),
      treesEquivalent,
      ridesCount: rides.length,
      impact: this.getImpactLevel(totalSaved)
    }
  }
  
  /**
   * Calcule la compensation carbone
   */
  calculateCompensation(co2Kg) {
    const cost = Math.ceil(co2Kg * COMPENSATION_PRICE)
    const trees = Math.ceil(co2Kg / 20) // 1 arbre absorbe ~20kg CO2/an
    
    return {
      co2Kg,
      cost,
      trees,
      currency: 'FCFA',
      projects: REFORESTATION_PROJECTS
    }
  }
  
  /**
   * Génère un certificat de compensation
   */
  generateCertificate(userId, compensation) {
    const date = new Date().toLocaleDateString('fr-FR')
    const certId = `LIVI-CERT-${Date.now()}`
    
    return {
      id: certId,
      userId,
      date,
      co2Compensated: compensation.co2Kg,
      treesPlanted: compensation.trees,
      amount: compensation.cost,
      project: REFORESTATION_PROJECTS[0].name,
      valid: true,
      qrCode: `https://livigo.sn/verify/${certId}`
    }
  }
  
  /**
   * Détermine le niveau d'impact écologique
   */
  getImpactLevel(co2SavedGrams) {
    const kg = co2SavedGrams / 1000
    
    if (kg < 10) return { level: 1, name: 'Débutant', icon: '🌱', color: '#84cc16' }
    if (kg < 50) return { level: 2, name: 'Éco-citoyen', icon: '🌿', color: '#22c55e' }
    if (kg < 100) return { level: 3, name: 'Protecteur', icon: '🌳', color: '#16a34a' }
    if (kg < 500) return { level: 4, name: 'Guardien', icon: '🌲', color: '#15803d' }
    return { level: 5, name: 'Héros Planète', icon: '🌍', color: '#059669' }
  }
  
  /**
   * Génère des suggestions éco
   */
  generateEcoSuggestions(userStats) {
    const suggestions = []
    
    if (userStats.totalRides > 20 && !userStats.hasTriedEcoMode) {
      suggestions.push({
        type: 'try_eco',
        icon: '🌱',
        title: 'Essayez le mode Éco',
        desc: 'Activez pour suivre votre impact carbone',
        action: 'Activer',
        benefit: '+10 points LiviStars'
      })
    }
    
    if (userStats.co2Saved > 50000) { // 50kg
      suggestions.push({
        type: 'compensate',
        icon: '🌳',
        title: 'Compensez votre empreinte',
        desc: `Vous avez économisé ${(userStats.co2Saved / 1000).toFixed(1)}kg CO2`,
        action: 'Planter des arbres',
        benefit: `${Math.ceil(userStats.co2Saved / 20000)} arbres équivalent`
      })
    }
    
    if (userStats.vehicleType === 'moto_essence' && userStats.rides > 50) {
      suggestions.push({
        type: 'upgrade',
        icon: '⚡',
        title: 'Passez à l\'électrique',
        desc: '-87% d\'émissions avec une moto électrique',
        action: 'En savoir plus',
        benefit: 'Éligible crédit vert'
      })
    }
    
    return suggestions
  }
  
  /**
   * Récupère les statistiques éco détaillées
   */
  getDetailedStats(userId, rides) {
    const savings = this.calculateTotalSavings(userId, rides)
    const impact = this.getImpactLevel(savings.totalSavedKg * 1000)
    
    // Comparaison avec objets du quotidien
    const comparisons = [
      { item: 'Charge smartphone', value: 0.005, icon: '📱' },
      { item: 'Douche chaude', value: 2, icon: '🚿' },
      { item: 'Repas avec viande', value: 5, icon: '🍖' },
      { item: 'Trajet Dakar-Thiès', value: 15, icon: '🚗' },
      { item: 'Vol Dakar-Paris', value: 250, icon: '✈️' },
    ]
    
    const savedKg = parseFloat(savings.totalSavedKg)
    const equivalent = comparisons.map(c => ({
      ...c,
      count: Math.floor(savedKg / c.value) || '< 1'
    })).filter(c => c.count > 0 || c.value < savedKg)
    
    return {
      ...savings,
      impact,
      comparisons: equivalent.slice(0, 3),
      monthlyTrend: this.calculateMonthlyTrend(rides),
      ranking: {
        position: 45, // Sur 1000
        percentile: 95 // Top 5%
      }
    }
  }
  
  /**
   * Calcule la tendance mensuelle
   */
  calculateMonthlyTrend(rides) {
    const monthly = {}
    
    rides.forEach(ride => {
      const month = ride.date.substring(0, 7) // YYYY-MM
      if (!monthly[month]) {
        monthly[month] = { rides: 0, co2Saved: 0 }
      }
      const calc = this.calculateRideEmission(ride.distance, ride.vehicleType)
      monthly[month].rides++
      monthly[month].co2Saved += parseFloat(calc.comparedToCar)
    })
    
    return Object.entries(monthly).map(([month, data]) => ({
      month,
      rides: data.rides,
      co2SavedKg: (data.co2Saved / 1000).toFixed(2)
    })).slice(-6) // 6 derniers mois
  }
  
  /**
   * Widget pour le dashboard (affichage optionnel)
   */
  getDashboardWidget(userId, rides) {
    if (!this.isEcoModeEnabled(userId)) {
      return {
        enabled: false,
        teaser: {
          icon: '🌱',
          title: 'Mode Éco disponible',
          desc: 'Suivez votre impact environnemental',
          cta: 'Activer'
        }
      }
    }
    
    const stats = this.calculateTotalSavings(userId, rides)
    const impact = this.getImpactLevel(stats.totalSavedKg * 1000)
    
    return {
      enabled: true,
      stats: {
        co2Saved: stats.totalSavedKg,
        treesEquivalent: stats.treesEquivalent,
        ridesCount: stats.ridesCount
      },
      impact,
      badge: {
        show: stats.treesEquivalent > 0,
        text: `${stats.treesEquivalent} 🌳`
      }
    }
  }
}

export default new LiviGreenService()
