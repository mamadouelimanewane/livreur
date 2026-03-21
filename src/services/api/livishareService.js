/**
 * LiviShare - Covoiturage Colis
 * Partage de trajet entre passagers et colis
 */

class LiviShareService {
  constructor() {
    this.sharedRides = new Map()
    this.packageRequests = new Map()
  }
  
  /**
   * Crée une demande de livraison partagée
   */
  createPackageRequest(senderData) {
    const request = {
      id: `PKG-${Date.now()}`,
      type: 'package',
      status: 'pending',
      sender: {
        name: senderData.name,
        phone: senderData.phone,
        pickup: senderData.pickup,
        dropoff: senderData.dropoff
      },
      package: {
        size: senderData.size, // small, medium, large
        weight: senderData.weight,
        description: senderData.description,
        fragile: senderData.fragile || false,
        urgent: senderData.urgent || false
      },
      pricing: this.calculateSharedPrice(senderData),
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 min
      potentialMatches: []
    }
    
    this.packageRequests.set(request.id, request)
    
    // Cherche des correspondances
    this.findMatches(request)
    
    return request
  }
  
  /**
   * Calcule le prix pour livraison partagée
   */
  calculateSharedPrice(data) {
    // Prix de base selon taille
    const basePrices = { small: 1000, medium: 2000, large: 3500 }
    const basePrice = basePrices[data.size] || 1500
    
    // Distance
    const distancePrice = (data.distance || 5) * 200
    
    // Options
    const fragileFee = data.fragile ? 500 : 0
    const urgentFee = data.urgent ? 1000 : 0
    
    const totalPrice = basePrice + distancePrice + fragileFee + urgentFee
    
    // Réduction covoiturage
    const sharedDiscount = 0.30 // 30% de réduction
    const sharedPrice = Math.round(totalPrice * (1 - sharedDiscount))
    
    return {
      standard: totalPrice,
      shared: sharedPrice,
      discount: totalPrice - sharedPrice,
      discountPercent: 30,
      savings: totalPrice - sharedPrice
    }
  }
  
  /**
   * Trouve des correspondances passager+colis
   */
  findMatches(packageRequest) {
    // Simule des courses existantes
    const mockRides = [
      { id: 'RIDE-001', from: 'Dakar Centre', to: 'Almadies', time: 15, seats: 2 },
      { id: 'RIDE-002', from: 'Médina', to: 'Yoff', time: 10, seats: 1 },
      { id: 'RIDE-003', from: 'Pikine', to: 'Dakar Centre', time: 20, seats: 3 },
    ]
    
    const matches = mockRides.filter(ride => {
      // Vérifie si le trajet correspond approximativement
      const routeMatch = this.isRouteCompatible(ride, packageRequest)
      const hasSpace = ride.seats > 0
      return routeMatch && hasSpace
    })
    
    packageRequest.potentialMatches = matches.map(m => ({
      ...m,
      matchScore: this.calculateMatchScore(m, packageRequest),
      estimatedDelay: 5 // minutes supplémentaires
    }))
    
    return packageRequest.potentialMatches
  }
  
  /**
   * Vérifie si les routes sont compatibles
   */
  isRouteCompatible(ride, packageRequest) {
    // Simplifié - en prod utiliser géocodage
    const compatibleRoutes = [
      ['Dakar Centre', 'Almadies'],
      ['Médina', 'Yoff'],
      ['Pikine', 'Dakar Centre'],
      ['Almadies', 'Dakar Centre'],
    ]
    
    return compatibleRoutes.some(r => 
      (r[0] === ride.from && r[1] === ride.to) ||
      (r[0] === packageRequest.sender.pickup && r[1] === packageRequest.sender.dropoff)
    )
  }
  
  /**
   * Calcule le score de correspondance
   */
  calculateMatchScore(ride, packageRequest) {
    let score = 0
    
    // Proximité pickup
    if (ride.from === packageRequest.sender.pickup) score += 40
    
    // Proximité dropoff
    if (ride.to === packageRequest.sender.dropoff) score += 40
    
    // Temps (plus c'est court, mieux c'est)
    score += Math.max(0, 20 - ride.time)
    
    return Math.min(100, score)
  }
  
  /**
   * Crée une course partagée
   */
  createSharedRide(rideId, packageRequestId) {
    const packageReq = this.packageRequests.get(packageRequestId)
    if (!packageReq) return null
    
    const sharedRide = {
      id: `SHARED-${Date.now()}`,
      rideId,
      packageId: packageRequestId,
      status: 'confirmed',
      passengers: [],
      packages: [packageReq],
      route: {
        stops: [
          { type: 'pickup', location: packageReq.sender.pickup, for: 'passenger' },
          { type: 'pickup', location: packageReq.sender.pickup, for: 'package' },
          { type: 'dropoff', location: packageReq.sender.dropoff, for: 'passenger' },
          { type: 'dropoff', location: packageReq.sender.dropoff, for: 'package' }
        ]
      },
      pricing: {
        passengerFare: 1500,
        packageFare: packageReq.pricing.shared,
        driverEarnings: 2500,
        platformFee: 200
      },
      createdAt: new Date()
    }
    
    this.sharedRides.set(sharedRide.id, sharedRide)
    
    // Met à jour le statut
    packageReq.status = 'matched'
    packageReq.matchedRideId = sharedRide.id
    
    return sharedRide
  }
  
  /**
   * Suit une livraison partagée
   */
  trackSharedRide(sharedRideId) {
    const ride = this.sharedRides.get(sharedRideId)
    if (!ride) return null
    
    return {
      id: ride.id,
      status: ride.status,
      currentLocation: { lat: 14.7167, lng: -17.4677 }, // Simulé
      nextStop: ride.route.stops.find(s => s.status === 'pending'),
      estimatedArrival: '15 min',
      passengers: ride.passengers.length,
      packages: ride.packages.length,
      driver: {
        name: 'Amadou D.',
        phone: '77 123 45 67',
        rating: 4.8,
        vehicle: 'Moto - DK 1234 AB'
      }
    }
  }
  
  /**
   * Récupère les statistiques de partage
   */
  getSharingStats(userId) {
    const userPackages = Array.from(this.packageRequests.values())
      .filter(p => p.sender.phone === userId)
    
    const sharedRides = Array.from(this.sharedRides.values())
      .filter(r => r.packages.some(p => p.sender.phone === userId))
    
    const totalSavings = sharedRides.reduce((sum, r) => {
      const pkg = r.packages.find(p => p.sender.phone === userId)
      return sum + (pkg?.pricing?.savings || 0)
    }, 0)
    
    return {
      packagesSent: userPackages.length,
      sharedDeliveries: sharedRides.length,
      totalSavings,
      co2Saved: Math.round(sharedRides.length * 0.5), // kg CO2
      averageDeliveryTime: 25, // minutes
      satisfactionRate: 95
    }
  }
  
  /**
   * Génère des suggestions de partage
   */
  generateSuggestions(userId, frequentRoutes) {
    const suggestions = []
    
    // Analyse les routes fréquentes
    frequentRoutes.forEach(route => {
      if (route.count > 5) {
        suggestions.push({
          type: 'regular_share',
          route: `${route.from} → ${route.to}`,
          potentialSavings: route.count * 500,
          message: 'Vous faites souvent ce trajet. Activez le partage automatique?'
        })
      }
    })
    
    // Suggère basé sur l'heure
    const hour = new Date().getHours()
    if (hour >= 17 && hour <= 19) {
      suggestions.push({
        type: 'time_based',
        message: 'Heure de pointe! Le partage peut réduire votre attente.',
        potentialDiscount: 30
      })
    }
    
    return suggestions
  }
  
  /**
   * Widget pour l'interface
   */
  getShareWidget(userId) {
    const stats = this.getSharingStats(userId)
    const hasHistory = stats.packagesSent > 0
    
    return {
      enabled: true,
      hasHistory,
      stats: hasHistory ? stats : null,
      quickActions: [
        { label: 'Envoyer colis', icon: '📦', action: 'create_request' },
        { label: 'Mes livraisons', icon: '📋', action: 'view_history' },
        { label: 'Suivre colis', icon: '📍', action: 'track' }
      ],
      teaser: hasHistory ? null : {
        icon: '🚕📦',
        title: 'Partagez votre trajet',
        desc: 'Jusqu\'à 30% de réduction sur la livraison',
        cta: 'Essayer'
      }
    }
  }
  
  /**
   * Calcule l'impact écologique du partage
   */
  calculateEcoImpact(sharedRidesCount) {
    // Chaque course partagée évite ~0.5kg CO2
    const co2Saved = sharedRidesCount * 0.5
    
    // Équivalent en voitures retirées de la route
    const carsOffRoad = Math.floor(sharedRidesCount * 0.3)
    
    // Essence économisée (litres)
    const fuelSaved = sharedRidesCount * 0.2
    
    return {
      co2SavedKg: co2Saved.toFixed(1),
      carsOffRoad,
      fuelSavedLiters: fuelSaved.toFixed(1),
      treesEquivalent: Math.floor(co2Saved / 20)
    }
  }
}

export default new LiviShareService()
