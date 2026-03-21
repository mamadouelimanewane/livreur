/**
 * LiviStars - Système de Gamification pour LiviGo
 * Niveaux, badges, défis, récompenses
 */

const LEVELS = [
  { name: 'Bronze', minPoints: 0, maxPoints: 999, color: '#cd7f32', icon: '🥉', commission: 20 },
  { name: 'Argent', minPoints: 1000, maxPoints: 2999, color: '#c0c0c0', icon: '🥈', commission: 18 },
  { name: 'Or', minPoints: 3000, maxPoints: 5999, color: '#ffd700', icon: '🥇', commission: 15 },
  { name: 'Platine', minPoints: 6000, maxPoints: 9999, color: '#e5e4e2', icon: '💎', commission: 12 },
  { name: 'Diamant', minPoints: 10000, maxPoints: Infinity, color: '#b9f2ff', icon: '👑', commission: 10 },
]

const BADGES = [
  // Badges de performance
  { id: 'early_bird', name: 'Lève-tôt', icon: '🌅', desc: '10 courses avant 7h', points: 100, category: 'performance' },
  { id: 'night_owl', name: 'Roi de la nuit', icon: '🦉', desc: '20 courses après 20h', points: 150, category: 'performance' },
  { id: 'weekend_warrior', name: 'Guerrier du weekend', icon: '💪', desc: '15 courses le weekend', points: 200, category: 'performance' },
  { id: 'perfect_5', name: '5★ Parfait', icon: '⭐', desc: '50 courses avec 5 étoiles', points: 300, category: 'performance' },
  
  // Badges de volume
  { id: 'centurion', name: 'Centurion', icon: '💯', desc: '100 courses complétées', points: 500, category: 'volume' },
  { id: 'marathon', name: 'Marathonien', icon: '🏃', desc: '500 courses complétées', points: 1000, category: 'volume' },
  { id: 'legend', name: 'Légende', icon: '🏆', desc: '1000 courses complétées', points: 2000, category: 'volume' },
  
  // Badges spéciaux
  { id: 'delivery_king', name: 'Roi de la Livraison', icon: '📦', desc: '50 livraisons réussies', points: 250, category: 'specialty' },
  { id: 'eco_warrior', name: 'Éco-guerrier', icon: '🌱', desc: '100 courses en mode éco', points: 200, category: 'specialty' },
  { id: 'safety_first', name: 'Sécurité d\'abord', icon: '🛡️', desc: '6 mois sans incident', points: 400, category: 'specialty' },
  { id: 'community_hero', name: 'Héros Communautaire', icon: '🤝', desc: 'Parrainé 5 chauffeurs', points: 300, category: 'specialty' },
  
  // Badges événements
  { id: 'korite_2024', name: 'Korité 2024', icon: '🌙', desc: 'Travaillé pendant le Korité', points: 150, category: 'event', limited: true },
  { id: 'new_year', name: 'Nouvel An', icon: '🎆', desc: 'Première course de l\'année', points: 100, category: 'event', limited: true },
]

const CHALLENGES = [
  {
    id: 'daily_5',
    name: 'Défi Quotidien',
    desc: 'Effectuez 5 courses aujourd\'hui',
    target: 5,
    reward: { type: 'points', value: 50 },
    duration: 'daily',
    difficulty: 'easy'
  },
  {
    id: 'weekly_30',
    name: 'Marathon Hebdo',
    desc: '30 courses cette semaine',
    target: 30,
    reward: { type: 'cash', value: 2000 },
    duration: 'weekly',
    difficulty: 'medium'
  },
  {
    id: 'perfect_week',
    name: 'Semaine Parfaite',
    desc: 'Note moyenne > 4.8 pendant 7 jours',
    target: 7,
    reward: { type: 'badge', value: 'perfect_week' },
    duration: 'weekly',
    difficulty: 'hard'
  },
  {
    id: 'early_bird_special',
    name: 'Lève-tôt Challenge',
    desc: '10 courses avant 8h ce mois',
    target: 10,
    reward: { type: 'commission_reduction', value: 2 },
    duration: 'monthly',
    difficulty: 'medium'
  },
  {
    id: 'eco_month',
    name: 'Mois Éco',
    desc: '50% des courses en mode éco',
    target: 50,
    unit: 'percent',
    reward: { type: 'points', value: 500 },
    duration: 'monthly',
    difficulty: 'hard'
  },
]

class LiviStarsService {
  constructor() {
    this.levels = LEVELS
    this.badges = BADGES
    this.challenges = CHALLENGES
  }
  
  /**
   * Récupère le niveau actuel d'un chauffeur
   */
  getCurrentLevel(points) {
    return this.levels.find(l => points >= l.minPoints && points < l.maxPoints) || this.levels[0]
  }
  
  /**
   * Récupère le prochain niveau
   */
  getNextLevel(points) {
    const currentIndex = this.levels.findIndex(l => points >= l.minPoints && points < l.maxPoints)
    return this.levels[currentIndex + 1] || null
  }
  
  /**
   * Calcule la progression vers le niveau suivant
   */
  getProgress(points) {
    const current = this.getCurrentLevel(points)
    const next = this.getNextLevel(points)
    
    if (!next) return { percent: 100, remaining: 0 }
    
    const range = next.minPoints - current.minPoints
    const progress = points - current.minPoints
    const percent = Math.round((progress / range) * 100)
    
    return {
      percent,
      remaining: next.minPoints - points,
      current: current.minPoints,
      next: next.minPoints
    }
  }
  
  /**
   * Attribue des points pour une action
   */
  awardPoints(action, data = {}) {
    const pointsTable = {
      'ride_completed': 10,
      'ride_completed_5star': 15,
      'delivery_completed': 12,
      'perfect_rating': 20,
      'referral': 100,
      'early_ride': 5, // avant 7h
      'night_ride': 5, // après 20h
      'weekend_ride': 3,
      'eco_mode': 8,
      'challenge_completed': 50,
      'badge_earned': 25,
      'login_streak_7': 30,
      'login_streak_30': 100,
    }
    
    const basePoints = pointsTable[action] || 5
    
    // Bonus multiplicateurs
    let multiplier = 1
    if (data.isWeekend) multiplier += 0.2
    if (data.isHoliday) multiplier += 0.5
    if (data.weather === 'rainy') multiplier += 0.3
    
    return Math.round(basePoints * multiplier)
  }
  
  /**
   * Vérifie si un chauffeur mérite un badge
   */
  checkBadges(driverStats, unlockedBadges = []) {
    const newBadges = []
    
    this.badges.forEach(badge => {
      if (unlockedBadges.includes(badge.id)) return
      
      let earned = false
      
      switch (badge.id) {
        case 'early_bird':
          earned = driverStats.earlyRides >= 10
          break
        case 'night_owl':
          earned = driverStats.nightRides >= 20
          break
        case 'weekend_warrior':
          earned = driverStats.weekendRides >= 15
          break
        case 'perfect_5':
          earned = driverStats.perfectRatings >= 50
          break
        case 'centurion':
          earned = driverStats.totalRides >= 100
          break
        case 'marathon':
          earned = driverStats.totalRides >= 500
          break
        case 'legend':
          earned = driverStats.totalRides >= 1000
          break
        case 'delivery_king':
          earned = driverStats.deliveries >= 50
          break
        case 'eco_warrior':
          earned = driverStats.ecoRides >= 100
          break
        case 'safety_first':
          earned = driverStats.monthsWithoutIncident >= 6
          break
        case 'community_hero':
          earned = driverStats.referrals >= 5
          break
      }
      
      if (earned) {
        newBadges.push(badge)
      }
    })
    
    return newBadges
  }
  
  /**
   * Récupère les défis actifs pour un chauffeur
   */
  getActiveChallenges(driverStats) {
    return this.challenges.map(challenge => {
      const progress = this.calculateChallengeProgress(challenge, driverStats)
      return {
        ...challenge,
        progress,
        isCompleted: progress >= challenge.target,
        remaining: challenge.target - progress
      }
    })
  }
  
  /**
   * Calcule la progression d'un défi
   */
  calculateChallengeProgress(challenge, driverStats) {
    switch (challenge.id) {
      case 'daily_5':
        return driverStats.ridesToday || 0
      case 'weekly_30':
        return driverStats.ridesThisWeek || 0
      case 'perfect_week':
        return driverStats.daysWithHighRating || 0
      case 'early_bird_special':
        return driverStats.earlyRidesThisMonth || 0
      case 'eco_month':
        const total = driverStats.ridesThisMonth || 1
        const eco = driverStats.ecoRidesThisMonth || 0
        return Math.round((eco / total) * 100)
      default:
        return 0
    }
  }
  
  /**
   * Génère le leaderboard
   */
  generateLeaderboard(drivers, period = 'weekly') {
    const sorted = [...drivers].sort((a, b) => {
      if (period === 'daily') return b.ridesToday - a.ridesToday
      if (period === 'weekly') return b.ridesThisWeek - a.ridesThisWeek
      return b.totalPoints - a.totalPoints
    })
    
    return sorted.slice(0, 10).map((driver, index) => ({
      rank: index + 1,
      name: driver.name,
      avatar: driver.initials,
      points: period === 'all' ? driver.totalPoints : period === 'weekly' ? driver.ridesThisWeek * 10 : driver.ridesToday * 10,
      rides: period === 'daily' ? driver.ridesToday : period === 'weekly' ? driver.ridesThisWeek : driver.totalRides,
      rating: driver.rating,
      isCurrentUser: driver.isCurrentUser
    }))
  }
  
  /**
   * Calcule les récompenses mensuelles
   */
  calculateMonthlyRewards(driverStats) {
    const rewards = []
    
    // Bonus de niveau
    const level = this.getCurrentLevel(driverStats.totalPoints)
    if (level.name !== 'Bronze') {
      rewards.push({
        type: 'commission_discount',
        value: 20 - level.commission,
        desc: `Commission réduite (${level.commission}%) grâce au niveau ${level.name}`
      })
    }
    
    // Bonus de performance
    if (driverStats.rating > 4.8 && driverStats.ridesThisMonth > 100) {
      rewards.push({
        type: 'cash_bonus',
        value: 5000,
        desc: 'Bonus performance exceptionnelle'
      })
    }
    
    // Bonus de fidélité
    if (driverStats.monthsActive >= 6) {
      rewards.push({
        type: 'priority_access',
        value: true,
        desc: 'Accès prioritaire aux courses premium'
      })
    }
    
    return rewards
  }
  
  /**
   * Génère un résumé gamifié pour le dashboard
   */
  generateDashboardSummary(driverData) {
    const level = this.getCurrentLevel(driverData.totalPoints)
    const progress = this.getProgress(driverData.totalPoints)
    const nextLevel = this.getNextLevel(driverData.totalPoints)
    const activeChallenges = this.getActiveChallenges(driverData)
    
    return {
      level,
      progress,
      nextLevel,
      points: driverData.totalPoints,
      badges: {
        total: this.badges.length,
        unlocked: driverData.badges?.length || 0,
        recent: driverData.recentBadges || []
      },
      challenges: {
        active: activeChallenges.filter(c => !c.isCompleted),
        completed: activeChallenges.filter(c => c.isCompleted),
        total: activeChallenges.length
      },
      stats: {
        rank: driverData.leaderboardRank || '-',
        topPercentile: driverData.topPercentile || 50
      }
    }
  }
}

export default new LiviStarsService()
