/**
 * LiviBrain - Service d'IA Prédictive pour LiviGo
 * Optimisation des courses, prix dynamique, détection de fraude
 */

// Données historiques simulées pour prédiction
const HISTORICAL_DATA = {
  // Patterns horaires par zone (0-23h)
  hourlyPatterns: {
    'dakar_centre': [0.2, 0.1, 0.1, 0.1, 0.2, 0.5, 0.8, 1.0, 0.9, 0.7, 0.6, 0.7, 0.8, 0.7, 0.6, 0.7, 0.9, 1.0, 0.9, 0.8, 0.7, 0.6, 0.4, 0.3],
    'almadies': [0.3, 0.2, 0.1, 0.1, 0.2, 0.3, 0.5, 0.7, 0.8, 0.7, 0.6, 0.7, 0.8, 0.8, 0.7, 0.8, 0.9, 1.0, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4],
    'medina': [0.1, 0.1, 0.1, 0.2, 0.3, 0.6, 0.9, 1.0, 0.8, 0.6, 0.5, 0.6, 0.7, 0.6, 0.5, 0.6, 0.8, 1.0, 0.9, 0.7, 0.5, 0.4, 0.3, 0.2],
    'pikine': [0.1, 0.1, 0.1, 0.1, 0.2, 0.4, 0.7, 0.9, 0.8, 0.6, 0.5, 0.5, 0.6, 0.5, 0.5, 0.6, 0.8, 0.9, 0.8, 0.6, 0.4, 0.3, 0.2, 0.1],
  },
  
  // Événements spéciaux
  events: [
    { date: '2024-12-25', name: 'Noël', multiplier: 1.5 },
    { date: '2024-12-31', name: 'Réveillon', multiplier: 2.0 },
    { date: '2025-01-01', name: 'Jour de l\'an', multiplier: 1.3 },
    { date: '2025-04-10', name: 'Korité', multiplier: 1.4 },
  ],
  
  // Météo impact
  weatherImpact: {
    'sunny': 1.0,
    'cloudy': 1.1,
    'rainy': 1.4,
    'stormy': 1.8,
  }
}

class LiviBrainService {
  /**
   * Prédit la demande dans une zone pour les prochaines heures
   */
  predictDemand(zone, hoursAhead = 3) {
    const now = new Date()
    const currentHour = now.getHours()
    const pattern = HISTORICAL_DATA.hourlyPatterns[zone] || HISTORICAL_DATA.hourlyPatterns['dakar_centre']
    
    const predictions = []
    for (let i = 0; i < hoursAhead; i++) {
      const hour = (currentHour + i) % 24
      const baseDemand = pattern[hour]
      
      // Ajoute variation aléatoire réaliste
      const variation = (Math.random() - 0.5) * 0.2
      const demand = Math.max(0, Math.min(1, baseDemand + variation))
      
      predictions.push({
        hour,
        demand: Math.round(demand * 100),
        level: demand > 0.8 ? 'high' : demand > 0.5 ? 'medium' : 'low',
        confidence: 85 + Math.random() * 10
      })
    }
    
    return predictions
  }
  
  /**
   * Calcule le prix dynamique optimal
   */
  calculateDynamicPrice(basePrice, zone, weather = 'sunny') {
    const now = new Date()
    const hour = now.getHours()
    const pattern = HISTORICAL_DATA.hourlyPatterns[zone] || HISTORICAL_DATA.hourlyPatterns['dakar_centre']
    
    // Facteur demande
    const demandFactor = pattern[hour]
    
    // Facteur météo
    const weatherFactor = HISTORICAL_DATA.weatherImpact[weather] || 1.0
    
    // Événement spécial
    const today = now.toISOString().split('T')[0]
    const event = HISTORICAL_DATA.events.find(e => e.date === today)
    const eventFactor = event ? event.multiplier : 1.0
    
    // Calcul prix final
    const multiplier = 1 + (demandFactor * 0.3) + (weatherFactor - 1) * 0.5
    const finalMultiplier = Math.min(2.0, multiplier * eventFactor)
    
    return {
      basePrice,
      finalPrice: Math.round(basePrice * finalMultiplier),
      multiplier: finalMultiplier.toFixed(2),
      factors: {
        demand: demandFactor.toFixed(2),
        weather: weatherFactor.toFixed(2),
        event: eventFactor.toFixed(2)
      },
      event: event ? event.name : null
    }
  }
  
  /**
   * Suggère la meilleure position pour un chauffeur
   */
  suggestPosition(driverLocation, driverStats) {
    const zones = Object.keys(HISTORICAL_DATA.hourlyPatterns)
    const predictions = zones.map(zone => {
      const demand = this.predictDemand(zone, 1)[0]
      const distance = this.estimateDistance(driverLocation, zone)
      
      // Score = demande / distance (plus c'est haut, mieux c'est)
      const score = (demand.demand / 100) / (distance + 0.1)
      
      return {
        zone,
        demand: demand.demand,
        distance: distance.toFixed(1),
        score: score.toFixed(2),
        estimatedEarnings: Math.round(demand.demand * 150),
        travelTime: Math.round(distance * 3) // min
      }
    })
    
    // Trie par score
    predictions.sort((a, b) => parseFloat(b.score) - parseFloat(a.score))
    
    return {
      recommendations: predictions.slice(0, 3),
      bestZone: predictions[0],
      reasoning: this.generateReasoning(predictions[0])
    }
  }
  
  /**
   * Détecte les patterns suspects (fraude)
   */
  detectFraudPatterns(rideData) {
    const flags = []
    
    // Course trop courte avec prix élevé
    if (rideData.distance < 500 && rideData.price > 2000) {
      flags.push({ type: 'price_anomaly', severity: 'medium', message: 'Prix élevé pour distance courte' })
    }
    
    // Multiple courses annulées par même client
    if (rideData.clientCancellations > 3) {
      flags.push({ type: 'cancellation_pattern', severity: 'high', message: 'Client avec trop d\'annulations' })
    }
    
    // Chauffeur avec courses trop rapides (bots?)
    if (rideData.avgRideTime < 2 && rideData.totalRides > 10) {
      flags.push({ type: 'speed_anomaly', severity: 'high', message: 'Courses suspectement rapides' })
    }
    
    // Heure inhabituelle
    const hour = new Date().getHours()
    if (hour < 5 && rideData.price > 5000) {
      flags.push({ type: 'time_anomaly', severity: 'low', message: 'Course coûteuse en heure creuse' })
    }
    
    return {
      riskScore: flags.reduce((acc, f) => acc + (f.severity === 'high' ? 30 : f.severity === 'medium' ? 15 : 5), 0),
      flags,
      isSafe: flags.length === 0
    }
  }
  
  /**
   * Estime le temps d'arrivée précis
   */
  estimateArrival(pickup, destination, traffic = 'normal') {
    const distance = this.estimateDistance(pickup, destination)
    const baseTime = distance * 3 // 3 min par km
    
    const trafficMultiplier = {
      'low': 0.8,
      'normal': 1.0,
      'high': 1.5,
      'jam': 2.2
    }[traffic] || 1.0
    
    const estimatedMinutes = Math.round(baseTime * trafficMultiplier)
    const buffer = Math.round(estimatedMinutes * 0.1) // 10% buffer
    
    return {
      min: estimatedMinutes - buffer,
      max: estimatedMinutes + buffer,
      expected: estimatedMinutes,
      confidence: traffic === 'normal' ? 95 : 85
    }
  }
  
  /**
   * Génère des insights personnalisés pour chauffeur
   */
  generateDriverInsights(driverStats) {
    const insights = []
    
    if (driverStats.avgDailyRides < 5) {
      insights.push({
        type: 'tip',
        icon: '💡',
        message: 'Travaillez entre 7h-9h et 17h-19h pour +40% de courses',
        impact: 'high'
      })
    }
    
    if (driverStats.rating < 4.5) {
      insights.push({
        type: 'warning',
        icon: '⚠️',
        message: 'Votre note pourrait affecter vos courses. Conseil: souriez plus!',
        impact: 'medium'
      })
    }
    
    if (driverStats.earningsThisWeek > driverStats.earningsLastWeek * 1.2) {
      insights.push({
        type: 'success',
        icon: '🎉',
        message: `Excellent! +${Math.round((driverStats.earningsThisWeek / driverStats.earningsLastWeek - 1) * 100)}% vs semaine dernière`,
        impact: 'positive'
      })
    }
    
    // Prédiction du jour
    const todayPrediction = this.predictDemand('dakar_centre', 12)
    const bestHours = todayPrediction.filter(p => p.level === 'high').map(p => p.hour)
    
    if (bestHours.length > 0) {
      insights.push({
        type: 'prediction',
        icon: '🔮',
        message: `Forte demande prévue à ${bestHours.slice(0, 2).join('h, ')}h`,
        impact: 'high'
      })
    }
    
    return insights
  }
  
  // Helpers
  estimateDistance(loc1, loc2) {
    // Simulation - en prod utiliser Haversine
    const distances = {
      'dakar_centre-almadies': 8.5,
      'dakar_centre-medina': 2.3,
      'almadies-medina': 10.2,
      'pikine-dakar_centre': 6.1,
    }
    const key = [loc1, loc2].sort().join('-')
    return distances[key] || Math.random() * 5 + 1
  }
  
  generateReasoning(bestZone) {
    const reasons = [
      `Forte demande (${bestZone.demand}%) à seulement ${bestZone.distance}km`,
      `Revenus estimés: ${bestZone.estimatedEarnings} FCFA/heure`,
      `${bestZone.travelTime} min de trajet pour y arriver`
    ]
    return reasons
  }
}

export default new LiviBrainService()
