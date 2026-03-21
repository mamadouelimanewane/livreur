/**
 * LiviCommunity - Communauté et Analytics Pro
 * Forum, événements, insights, parrainage
 */

class LiviCommunityService {
  constructor() {
    this.posts = []
    this.events = []
    this.referrals = new Map()
    this.achievements = new Map()
  }
  
  /**
   * Crée un post dans le forum
   */
  createPost(userId, userName, content, category = 'general') {
    const post = {
      id: `POST-${Date.now()}`,
      userId,
      userName,
      content,
      category,
      likes: 0,
      comments: [],
      createdAt: new Date(),
      isPinned: false
    }
    
    this.posts.unshift(post)
    return post
  }
  
  /**
   * Récupère les posts du forum
   */
  getPosts(category = null, limit = 20) {
    let filtered = this.posts
    if (category) {
      filtered = this.posts.filter(p => p.category === category)
    }
    return filtered.slice(0, limit)
  }
  
  /**
   * Crée un événement communautaire
   */
  createEvent(title, description, date, location, type = 'meetup') {
    const event = {
      id: `EVENT-${Date.now()}`,
      title,
      description,
      date,
      location,
      type,
      attendees: [],
      maxAttendees: type === 'training' ? 30 : 100,
      status: 'upcoming'
    }
    
    this.events.push(event)
    return event
  }
  
  /**
   * Récupère les événements à venir
   */
  getUpcomingEvents() {
    const now = new Date()
    return this.events
      .filter(e => new Date(e.date) > now)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5)
  }
  
  /**
   * Parrainage - Crée un code
   */
  createReferralCode(userId, userName) {
    const code = `LIVI-${userName.substring(0, 3).toUpperCase()}${Math.random().toString(36).substring(2, 5).toUpperCase()}`
    
    const referral = {
      code,
      userId,
      userName,
      createdAt: new Date(),
      referrals: [],
      totalEarned: 0,
      rewards: {
        perReferral: 1000, // FCFA
        bonus5: 5000,
        bonus10: 15000
      }
    }
    
    this.referrals.set(userId, referral)
    return referral
  }
  
  /**
   * Enregistre un parrainage
   */
  registerReferral(referralCode, newUserId, newUserName) {
    // Trouve le parrain
    let referrer = null
    for (const [userId, ref] of this.referrals) {
      if (ref.code === referralCode) {
        referrer = ref
        break
      }
    }
    
    if (!referrer) return { success: false, error: 'Code invalide' }
    
    const referral = {
      userId: newUserId,
      name: newUserName,
      date: new Date(),
      status: 'active',
      earnings: 0
    }
    
    referrer.referrals.push(referral)
    referrer.totalEarned += referrer.rewards.perReferral
    
    // Vérifie les bonus
    const bonus = this.calculateReferralBonus(referrer)
    
    return {
      success: true,
      referrer: referrer.userName,
      reward: referrer.rewards.perReferral,
      bonus
    }
  }
  
  /**
   * Calcule les bonus de parrainage
   */
  calculateReferralBonus(referral) {
    const count = referral.referrals.length
    let bonus = 0
    
    if (count === 5) bonus = referral.rewards.bonus5
    if (count === 10) bonus = referral.rewards.bonus10
    
    if (bonus > 0) {
      referral.totalEarned += bonus
    }
    
    return bonus
  }
  
  /**
   * Analytics Pro - Heures optimales
   */
  getOptimalHours(driverStats) {
    const hourlyData = driverStats.hourlyEarnings || {}
    
    const optimal = Object.entries(hourlyData)
      .map(([hour, earnings]) => ({ hour: parseInt(hour), earnings }))
      .sort((a, b) => b.earnings - a.earnings)
      .slice(0, 3)
    
    return {
      bestHours: optimal,
      recommendation: `Travaillez entre ${optimal[0]?.hour}h et ${optimal[0]?.hour + 2}h pour maximiser vos revenus`,
      potentialIncrease: '+35%'
    }
  }
  
  /**
   * Analytics Pro - Zones rentables
   */
  getProfitableZones(driverStats) {
    const zoneData = driverStats.zoneEarnings || {}
    
    const zones = Object.entries(zoneData)
      .map(([zone, data]) => ({
        name: zone,
        avgEarnings: data.earnings / data.rides,
        demand: data.demand,
        score: (data.earnings / data.rides) * data.demand
      }))
      .sort((a, b) => b.score - a.score)
    
    return {
      topZones: zones.slice(0, 3),
      heatmapData: zones,
      suggestion: zones[0] ? `Positionnez-vous à ${zones[0].name} pour +${Math.round(zones[0].score)}% de gains` : null
    }
  }
  
  /**
   * Analytics Pro - Comparaison
   */
  getPerformanceComparison(driverStats) {
    const avgDriver = {
      dailyRides: 8,
      dailyEarnings: 12000,
      rating: 4.5
    }
    
    const comparison = {
      rides: {
        you: driverStats.avgDailyRides,
        average: avgDriver.dailyRides,
        diff: ((driverStats.avgDailyRides - avgDriver.dailyRides) / avgDriver.dailyRides * 100).toFixed(0)
      },
      earnings: {
        you: driverStats.avgDailyEarnings,
        average: avgDriver.dailyEarnings,
        diff: ((driverStats.avgDailyEarnings - avgDriver.dailyEarnings) / avgDriver.dailyEarnings * 100).toFixed(0)
      },
      rating: {
        you: driverStats.rating,
        average: avgDriver.rating,
        diff: (driverStats.rating - avgDriver.rating).toFixed(1)
      }
    }
    
    return {
      comparison,
      percentile: this.calculatePercentile(driverStats),
      trend: driverStats.earningsTrend || 'stable'
    }
  }
  
  /**
   * Calcule le percentile
   */
  calculatePercentile(driverStats) {
    // Simulation - en prod basé sur vraies données
    const score = (driverStats.rating * 10) + (driverStats.avgDailyRides * 2)
    if (score > 70) return 95
    if (score > 60) return 80
    if (score > 50) return 60
    return 40
  }
  
  /**
   * Prédictions ML simulées
   */
  getPredictions(driverStats) {
    const today = new Date()
    const dayOfWeek = today.getDay()
    
    const predictions = []
    
    // Prédiction basée sur le jour
    if (dayOfWeek === 5 || dayOfWeek === 6) { // Vendredi/Samedi
      predictions.push({
        type: 'demand',
        icon: '📈',
        message: 'Forte demande attendue ce soir',
        confidence: 85,
        action: 'Positionnez-vous vers 20h'
      })
    }
    
    // Prédiction météo (simulée)
    predictions.push({
      type: 'weather',
      icon: '🌧️',
      message: 'Pluie prévue demain = +40% de demande',
      confidence: 70,
      action: 'Préparez-vous pour une journée chargée'
    })
    
    // Prédiction personnelle
    if (driverStats.avgDailyRides < 5) {
      predictions.push({
        type: 'personal',
        icon: '💡',
        message: 'Vous pourriez gagner +5000 FCFA en ajoutant 2 courses',
        confidence: 90,
        action: 'Objectif: 7 courses aujourd\'hui'
      })
    }
    
    return predictions
  }
  
  /**
   * Génère le résumé complet analytics
   */
  generateAnalyticsDashboard(driverId, driverStats) {
    return {
      overview: {
        today: {
          rides: driverStats.ridesToday || 0,
          earnings: driverStats.earningsToday || 0,
          onlineHours: driverStats.onlineHours || 0
        },
        thisWeek: {
          rides: driverStats.ridesThisWeek || 0,
          earnings: driverStats.earningsThisWeek || 0,
          vsLastWeek: driverStats.weeklyGrowth || 0
        },
        rating: driverStats.rating || 4.5,
        completionRate: driverStats.completionRate || 95
      },
      insights: {
        optimalHours: this.getOptimalHours(driverStats),
        profitableZones: this.getProfitableZones(driverStats),
        comparison: this.getPerformanceComparison(driverStats),
        predictions: this.getPredictions(driverStats)
      },
      community: {
        forum: this.getPosts('tips', 5),
        events: this.getUpcomingEvents(),
        referral: this.referrals.get(driverId)
      }
    }
  }
  
  /**
   * Widget communauté pour dashboard
   */
  getCommunityWidget(userId) {
    const referral = this.referrals.get(userId)
    const events = this.getUpcomingEvents()
    
    return {
      referral: referral || {
        code: null,
        teaser: 'Gagnez 1000 FCFA par ami parrainé'
      },
      events: events.slice(0, 2),
      forum: {
        trending: this.posts.filter(p => p.likes > 10).slice(0, 3),
        newPosts: this.posts.slice(0, 3)
      },
      quickActions: [
        { label: 'Forum', icon: '💬', action: 'forum' },
        { label: 'Parrainer', icon: '🎁', action: 'referral' },
        { label: 'Événements', icon: '📅', action: 'events' }
      ]
    }
  }
}

export default new LiviCommunityService()
