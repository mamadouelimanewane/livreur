/**
 * Hook useLiviInnovations - Intègre toutes les innovations LiviGo
 * IA, Gamification, Éco, Voix, Assurance, Crédit, Communauté
 */

import { useState, useEffect, useCallback } from 'react'
import liviBrainService from '../services/api/livibrainService'
import liviStarsService from '../services/api/livistarsService'
import liviGreenService from '../services/api/livigreenService'
import liviVoiceService from '../services/api/livivoiceService'
import liviProtectService from '../services/api/liviprotectService'
import liviFlexService from '../services/api/liviflexService'
import liviShareService from '../services/api/livishareService'
import liviCommunityService from '../services/api/livicommunityService'

export function useLiviInnovations(userId, userType = 'driver') {
  // États
  const [innovations, setInnovations] = useState({
    brain: null,
    stars: null,
    green: null,
    voice: null,
    protect: null,
    flex: null,
    share: null,
    community: null
  })
  const [loading, setLoading] = useState(true)
  const [activeFeatures, setActiveFeatures] = useState({
    ecoMode: false,
    creditEnabled: false,
    insuranceEnabled: false
  })

  // Initialise les innovations
  useEffect(() => {
    const initInnovations = async () => {
      setLoading(true)
      
      // Données utilisateur simulées
      const mockStats = {
        totalRides: 150,
        rating: 4.7,
        totalPoints: 3500,
        avgDailyRides: 7,
        avgDailyEarnings: 15000,
        monthlyEarnings: 450000,
        badges: ['early_bird', 'perfect_5'],
        earlyRides: 15,
        nightRides: 25,
        weekendRides: 30,
        perfectRatings: 60,
        deliveries: 0,
        ecoRides: 0,
        monthsActive: 6,
        referrals: 2,
        ridesToday: 3,
        ridesThisWeek: 21,
        earningsToday: 12000,
        earningsThisWeek: 85000,
        onlineHours: 5,
        completionRate: 98
      }

      // Initialise tous les services
      const brain = {
        predictDemand: (zone) => liviBrainService.predictDemand(zone),
        suggestPosition: (location) => liviBrainService.suggestPosition(location, mockStats),
        estimateArrival: (from, to) => liviBrainService.estimateArrival(from, to),
        detectFraud: (ride) => liviBrainService.detectFraudPatterns(ride),
        insights: liviBrainService.generateDriverInsights(mockStats)
      }

      const stars = {
        summary: liviStarsService.generateDashboardSummary(mockStats),
        currentLevel: liviStarsService.getCurrentLevel(mockStats.totalPoints),
        progress: liviStarsService.getProgress(mockStats.totalPoints),
        badges: liviStarsService.checkBadges(mockStats, mockStats.badges),
        challenges: liviStarsService.getActiveChallenges(mockStats),
        leaderboard: liviStarsService.generateLeaderboard([
          { name: 'Amadou D.', ridesToday: 8, ridesThisWeek: 35, totalPoints: 4200, rating: 4.9, initials: 'AD' },
          { name: 'Fatou N.', ridesToday: 6, ridesThisWeek: 28, totalPoints: 3800, rating: 4.8, initials: 'FN' },
          { name: 'Vous', ridesToday: mockStats.ridesToday, ridesThisWeek: mockStats.ridesThisWeek, totalPoints: mockStats.totalPoints, rating: mockStats.rating, initials: 'VO', isCurrentUser: true }
        ]),
        awardPoints: (action) => liviStarsService.awardPoints(action, { isWeekend: false })
      }

      const green = {
        enabled: activeFeatures.ecoMode,
        toggle: (enabled) => {
          setActiveFeatures(prev => ({ ...prev, ecoMode: enabled }))
          return liviGreenService.toggleEcoMode(userId, enabled)
        },
        stats: activeFeatures.ecoMode ? liviGreenService.getDetailedStats(userId, []) : null,
        widget: liviGreenService.getDashboardWidget(userId, [])
      }

      const voice = {
        widget: liviVoiceService.getVoiceWidget(),
        process: (text) => liviVoiceService.processCommand(text),
        speak: (text, lang) => liviVoiceService.speak(text, lang),
        listen: (onResult, onError) => liviVoiceService.startListening(onResult, onError),
        stop: () => liviVoiceService.stopListening(),
        translate: (key, lang) => liviVoiceService.translate(key, lang)
      }

      const protect = {
        enabled: activeFeatures.insuranceEnabled,
        plans: liviProtectService.comparePlans(),
        subscribe: (planId) => liviProtectService.subscribe(userId, planId),
        coverage: liviProtectService.checkCoverage(userId),
        widget: liviProtectService.getDashboardWidget(userId),
        simulate: (scenario, planId) => liviProtectService.simulateScenario(scenario, planId)
      }

      const flex = {
        enabled: activeFeatures.creditEnabled,
        eligibility: liviFlexService.checkEligibility(userId, mockStats),
        apply: (amount, purpose) => liviFlexService.applyForCredit(userId, amount, purpose),
        summary: liviFlexService.getLoanSummary(userId),
        projections: (amount, duration) => liviFlexService.calculateProjections(amount, duration),
        widget: liviFlexService.getDashboardWidget(userId, mockStats)
      }

      const share = {
        createRequest: (data) => liviShareService.createPackageRequest(data),
        calculatePrice: (data) => liviShareService.calculateSharedPrice(data),
        stats: liviShareService.getSharingStats(userId),
        widget: liviShareService.getShareWidget(userId),
        ecoImpact: (count) => liviShareService.calculateEcoImpact(count)
      }

      const community = {
        analytics: liviCommunityService.generateAnalyticsDashboard(userId, mockStats),
        widget: liviCommunityService.getCommunityWidget(userId),
        createPost: (content, category) => liviCommunityService.createPost(userId, 'Vous', content, category),
        getPosts: (category) => liviCommunityService.getPosts(category),
        events: liviCommunityService.getUpcomingEvents(),
        referral: () => liviCommunityService.createReferralCode(userId, 'Vous')
      }

      setInnovations({ brain, stars, green, voice, protect, flex, share, community })
      setLoading(false)
    }

    initInnovations()
  }, [userId, activeFeatures.ecoMode, activeFeatures.creditEnabled, activeFeatures.insuranceEnabled])

  // Actions
  const toggleEcoMode = useCallback((enabled) => {
    setActiveFeatures(prev => ({ ...prev, ecoMode: enabled }))
    return liviGreenService.toggleEcoMode(userId, enabled)
  }, [userId])

  const toggleCredit = useCallback((enabled) => {
    setActiveFeatures(prev => ({ ...prev, creditEnabled: enabled }))
    liviFlexService.isEnabled = enabled
    return enabled
  }, [])

  const toggleInsurance = useCallback((enabled) => {
    setActiveFeatures(prev => ({ ...prev, insuranceEnabled: enabled }))
    return enabled
  }, [])

  const getFeatureStatus = useCallback(() => ({
    ...activeFeatures,
    available: {
      brain: true,
      stars: true,
      green: true,
      voice: true,
      protect: true,
      flex: true,
      share: true,
      community: true
    }
  }), [activeFeatures])

  return {
    innovations,
    loading,
    activeFeatures,
    toggleEcoMode,
    toggleCredit,
    toggleInsurance,
    getFeatureStatus
  }
}

export default useLiviInnovations
