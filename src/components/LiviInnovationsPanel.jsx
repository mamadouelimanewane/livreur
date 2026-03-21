/**
 * LiviInnovationsPanel - Panneau des innovations LiviGo
 * Affiche toutes les fonctionnalités avancées
 */

import React, { useState } from 'react'
import { useLiviInnovations } from '../hooks/useLiviInnovations'
import { 
  FiZap, FiTrendingUp, FiAward, FiMic, FiShield, 
  FiCreditCard, FiShare2, FiUsers, FiLeaf, FiX 
} from 'react-icons/fi'

const INNOVATION_CARDS = [
  { id: 'brain', name: 'LiviBrain', icon: FiZap, color: '#8b5cf6', desc: 'IA Prédictive' },
  { id: 'stars', name: 'LiviStars', icon: FiAward, color: '#f59e0b', desc: 'Gamification' },
  { id: 'share', name: 'LiviShare', icon: FiShare2, color: '#06b6d4', desc: 'Covoiturage Colis' },
  { id: 'voice', name: 'LiviVoice', icon: FiMic, color: '#ec4899', desc: 'Assistant Vocal' },
  { id: 'protect', name: 'LiviProtect', icon: FiShield, color: '#10b981', desc: 'Micro-Assurance' },
  { id: 'community', name: 'LiviCommunity', icon: FiUsers, color: '#f97316', desc: 'Communauté' },
  { id: 'green', name: 'LiviGreen', icon: FiLeaf, color: '#22c55e', desc: 'Éco (Option)' },
  { id: 'flex', name: 'LiviFlex', icon: FiCreditCard, color: '#3b82f6', desc: 'Crédit (Option)' },
]

export default function LiviInnovationsPanel({ userId, isOpen, onClose }) {
  const { innovations, loading, activeFeatures, toggleEcoMode, toggleCredit, toggleInsurance } = useLiviInnovations(userId, 'driver')
  const [activeTab, setActiveTab] = useState('brain')
  
  if (!isOpen) return null
  
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des innovations...</p>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'brain':
        return <BrainContent data={innovations.brain} />
      case 'stars':
        return <StarsContent data={innovations.stars} />
      case 'share':
        return <ShareContent data={innovations.share} />
      case 'voice':
        return <VoiceContent data={innovations.voice} />
      case 'protect':
        return <ProtectContent data={innovations.protect} enabled={activeFeatures.insuranceEnabled} onToggle={toggleInsurance} />
      case 'community':
        return <CommunityContent data={innovations.community} />
      case 'green':
        return <GreenContent data={innovations.green} enabled={activeFeatures.ecoMode} onToggle={toggleEcoMode} />
      case 'flex':
        return <FlexContent data={innovations.flex} enabled={activeFeatures.creditEnabled} onToggle={toggleCredit} />
      default:
        return <BrainContent data={innovations.brain} />
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 flex justify-between items-center">
          <h2 className="text-white text-xl font-bold flex items-center gap-2">
            <FiZap /> LiviGo Innovations
          </h2>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-full">
            <FiX size={24} />
          </button>
        </div>
        
        {/* Navigation */}
        <div className="flex overflow-x-auto bg-gray-50 border-b p-2 gap-2">
          {INNOVATION_CARDS.map(card => (
            <button
              key={card.id}
              onClick={() => setActiveTab(card.id)}
              className={`flex flex-col items-center p-3 rounded-xl min-w-[80px] transition-all ${
                activeTab === card.id 
                  ? 'bg-white shadow-md ring-2' 
                  : 'hover:bg-white/50'
              }`}
              style={{ 
                ringColor: activeTab === card.id ? card.color : 'transparent',
                color: activeTab === card.id ? card.color : '#6b7280'
              }}
            >
              <card.icon size={24} />
              <span className="text-xs mt-1 font-medium">{card.name}</span>
            </button>
          ))}
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

// === CONTENU LIVIBRAIN ===
function BrainContent({ data }) {
  const [zone, setZone] = useState('dakar_centre')
  const predictions = data?.predictDemand(zone)
  
  return (
    <div className="space-y-6">
      <div className="bg-purple-50 rounded-xl p-4">
        <h3 className="font-bold text-purple-800 flex items-center gap-2">
          <FiZap /> Prédictions IA
        </h3>
        <p className="text-sm text-purple-600 mt-1">Optimisez vos revenus avec l'intelligence artificielle</p>
      </div>
      
      {/* Prédictions demande */}
      <div>
        <label className="text-sm font-medium text-gray-700">Zone</label>
        <select 
          value={zone} 
          onChange={(e) => setZone(e.target.value)}
          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm"
        >
          <option value="dakar_centre">Dakar Centre</option>
          <option value="almadies">Almadies</option>
          <option value="medina">Médina</option>
          <option value="pikine">Pikine</option>
        </select>
        
        <div className="mt-4 grid grid-cols-3 gap-3">
          {predictions?.map((pred, i) => (
            <div key={i} className={`p-3 rounded-xl text-center ${
              pred.level === 'high' ? 'bg-red-100 text-red-800' :
              pred.level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              <div className="text-2xl font-bold">{pred.hour}h</div>
              <div className="text-sm">{pred.demand}% demande</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Suggestions position */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 text-white">
        <h4 className="font-bold flex items-center gap-2">
          <FiTrendingUp /> Position optimale
        </h4>
        <p className="mt-2 text-sm opacity-90">
          🔮 Forte demande prévue à Almadies dans 15 min
        </p>
        <p className="text-sm opacity-75">
          💰 Bonus potentiel: +2,500 FCFA/heure
        </p>
      </div>
      
      {/* Insights */}
      <div className="space-y-2">
        <h4 className="font-medium text-gray-800">Insights personnalisés</h4>
        {data?.insights?.map((insight, i) => (
          <div key={i} className={`p-3 rounded-lg flex items-center gap-3 ${
            insight.type === 'success' ? 'bg-green-50 text-green-800' :
            insight.type === 'warning' ? 'bg-yellow-50 text-yellow-800' :
            'bg-blue-50 text-blue-800'
          }`}>
            <span className="text-2xl">{insight.icon}</span>
            <span className="text-sm">{insight.message}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// === CONTENU LIVISTARS ===
function StarsContent({ data }) {
  const level = data?.currentLevel
  const progress = data?.progress
  
  return (
    <div className="space-y-6">
      <div className="bg-amber-50 rounded-xl p-4">
        <h3 className="font-bold text-amber-800 flex items-center gap-2">
          <FiAward /> LiviStars Gamification
        </h3>
        <p className="text-sm text-amber-600 mt-1">Gagnez des points, débloquez des récompenses!</p>
      </div>
      
      {/* Niveau actuel */}
      <div className="text-center p-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl text-white">
        <div className="text-6xl mb-2">{level?.icon}</div>
        <div className="text-2xl font-bold">Niveau {level?.name}</div>
        <div className="text-sm opacity-90">Commission: {level?.commission}%</div>
      </div>
      
      {/* Progression */}
      <div>
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progression vers {data?.nextLevel?.name || 'Max'}</span>
          <span>{progress?.percent}%</span>
        </div>
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all"
            style={{ width: `${progress?.percent || 0}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {progress?.remaining} points restants
        </p>
      </div>
      
      {/* Défis actifs */}
      <div>
        <h4 className="font-medium text-gray-800 mb-3">Défis en cours</h4>
        <div className="space-y-2">
          {data?.challenges?.slice(0, 3).map((challenge, i) => (
            <div key={i} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium text-sm">{challenge.name}</div>
                  <div className="text-xs text-gray-500">{challenge.desc}</div>
                </div>
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                  +{challenge.reward.value} {challenge.reward.type === 'points' ? 'pts' : 'FCFA'}
                </span>
              </div>
              <div className="mt-2">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>{challenge.progress} / {challenge.target}</span>
                  <span>{Math.round((challenge.progress / challenge.target) * 100)}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-full bg-purple-500 rounded-full"
                    style={{ width: `${(challenge.progress / challenge.target) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Leaderboard */}
      <div>
        <h4 className="font-medium text-gray-800 mb-3">Classement</h4>
        <div className="space-y-2">
          {data?.leaderboard?.slice(0, 5).map((user, i) => (
            <div 
              key={i} 
              className={`flex items-center gap-3 p-3 rounded-lg ${
                user.isCurrentUser ? 'bg-purple-100 border-2 border-purple-300' : 'bg-gray-50'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                i === 0 ? 'bg-yellow-400 text-yellow-900' :
                i === 1 ? 'bg-gray-300 text-gray-800' :
                i === 2 ? 'bg-amber-600 text-white' :
                'bg-gray-200 text-gray-600'
              }`}>
                {user.rank}
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm">{user.name}</div>
                <div className="text-xs text-gray-500">{user.rides} courses</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-sm">{user.points} pts</div>
                <div className="text-xs text-yellow-600">{'⭐'.repeat(Math.floor(user.rating))}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// === CONTENU LIVISHARE ===
function ShareContent({ data }) {
  const [showCalculator, setShowCalculator] = useState(false)
  const [packageSize, setPackageSize] = useState('small')
  const [distance, setDistance] = useState(5)
  
  const priceEstimate = data?.calculatePrice({ size: packageSize, distance })
  
  return (
    <div className="space-y-6">
      <div className="bg-cyan-50 rounded-xl p-4">
        <h3 className="font-bold text-cyan-800 flex items-center gap-2">
          <FiShare2 /> LiviShare - Covoiturage Colis
        </h3>
        <p className="text-sm text-cyan-600 mt-1">Partagez votre trajet, économisez jusqu'à 30%!</p>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl p-4 text-white text-center">
          <div className="text-3xl font-bold">{data?.stats?.sharedDeliveries || 0}</div>
          <div className="text-sm opacity-90">Livraisons partagées</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-4 text-white text-center">
          <div className="text-3xl font-bold">{data?.stats?.totalSavings || 0} FCFA</div>
          <div className="text-sm opacity-90">Économies réalisées</div>
        </div>
      </div>
      
      {/* Calculateur */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h4 className="font-medium text-gray-800 mb-3">Estimer le prix</h4>
        
        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-600">Taille du colis</label>
            <div className="flex gap-2 mt-1">
              {['small', 'medium', 'large'].map(size => (
                <button
                  key={size}
                  onClick={() => setPackageSize(size)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium ${
                    packageSize === size 
                      ? 'bg-cyan-500 text-white' 
                      : 'bg-white border hover:bg-gray-50'
                  }`}
                >
                  {size === 'small' ? 'Petit' : size === 'medium' ? 'Moyen' : 'Grand'}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="text-sm text-gray-600">Distance: {distance} km</label>
            <input
              type="range"
              min="1"
              max="20"
              value={distance}
              onChange={(e) => setDistance(parseInt(e.target.value))}
              className="w-full mt-1"
            />
          </div>
          
          {priceEstimate && (
            <div className="bg-white rounded-lg p-4 mt-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 line-through">{priceEstimate.standard} FCFA</span>
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm">
                  -{priceEstimate.discountPercent}%
                </span>
              </div>
              <div className="text-3xl font-bold text-cyan-600 mt-1">
                {priceEstimate.shared} FCFA
              </div>
              <div className="text-sm text-green-600 mt-1">
                💰 Vous économisez {priceEstimate.savings} FCFA
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Impact éco */}
      <div className="bg-green-50 rounded-xl p-4">
        <h4 className="font-medium text-green-800 mb-2">🌱 Impact écologique</h4>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-xl font-bold text-green-700">{data?.ecoImpact?.(5).co2SavedKg} kg</div>
            <div className="text-xs text-green-600">CO2 évité</div>
          </div>
          <div>
            <div className="text-xl font-bold text-green-700">{data?.ecoImpact?.(5).treesEquivalent}</div>
            <div className="text-xs text-green-600">Arbres</div>
          </div>
          <div>
            <div className="text-xl font-bold text-green-700">{data?.ecoImpact?.(5).fuelSavedLiters} L</div>
            <div className="text-xs text-green-600">Essence</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// === CONTENU LIVIVOICE ===
function VoiceContent({ data }) {
  const [isListening, setIsListening] = useState(false)
  const [lastCommand, setLastCommand] = useState(null)
  
  const handleListen = () => {
    setIsListening(true)
    // Simule l'écoute
    setTimeout(() => {
      setIsListening(false)
      setLastCommand({
        text: 'Commander taxi',
        action: 'book_ride',
        response: 'Votre course est confirmée. Un chauffeur arrivera dans 5 minutes.'
      })
    }, 2000)
  }
  
  return (
    <div className="space-y-6">
      <div className="bg-pink-50 rounded-xl p-4">
        <h3 className="font-bold text-pink-800 flex items-center gap-2">
          <FiMic /> LiviVoice - Assistant Vocal
        </h3>
        <p className="text-sm text-pink-600 mt-1">Parlez en Français ou Wolof!</p>
      </div>
      
      {/* Bouton micro */}
      <div className="text-center">
        <button
          onClick={handleListen}
          disabled={isListening}
          className={`w-32 h-32 rounded-full flex items-center justify-center text-white text-4xl transition-all ${
            isListening 
              ? 'bg-red-500 animate-pulse' 
              : 'bg-gradient-to-br from-pink-500 to-purple-500 hover:scale-105'
          }`}
        >
          <FiMic />
        </button>
        <p className="mt-4 text-gray-600">
          {isListening ? 'Écoute en cours...' : 'Appuyez et parlez'}
        </p>
      </div>
      
      {/* Dernière commande */}
      {lastCommand && (
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="text-sm text-gray-500">Vous avez dit:</div>
          <div className="font-medium text-lg">"{lastCommand.text}"</div>
          <div className="mt-3 p-3 bg-purple-100 rounded-lg text-purple-800">
            🤖 {lastCommand.response}
          </div>
        </div>
      )}
      
      {/* Commandes rapides */}
      <div>
        <h4 className="font-medium text-gray-800 mb-3">Commandes disponibles</h4>
        <div className="grid grid-cols-2 gap-2">
          {['Commander taxi', 'Prix course', 'Où chauffeur', 'Aide'].map((cmd, i) => (
            <div key={i} className="p-3 bg-gray-50 rounded-lg text-sm flex items-center gap-2">
              <FiMic size={14} className="text-pink-500" />
              {cmd}
            </div>
          ))}
        </div>
      </div>
      
      {/* Traduction */}
      <div className="bg-amber-50 rounded-xl p-4">
        <h4 className="font-medium text-amber-800 mb-2">🌍 Wolof / Français</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-amber-700">"Am na taxi"</span>
            <span className="text-gray-600">→ Commander un taxi</span>
          </div>
          <div className="flex justify-between">
            <span className="text-amber-700">"Natt price bi"</span>
            <span className="text-gray-600">→ Combien ça coûte?</span>
          </div>
          <div className="flex justify-between">
            <span className="text-amber-700">"Ndimbal"</span>
            <span className="text-gray-600">→ Aide</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// === CONTENU LIVIPROTECT ===
function ProtectContent({ data, enabled, onToggle }) {
  const [selectedPlan, setSelectedPlan] = useState('standard')
  
  return (
    <div className="space-y-6">
      <div className="bg-emerald-50 rounded-xl p-4">
        <h3 className="font-bold text-emerald-800 flex items-center gap-2">
          <FiShield /> LiviProtect - Assurance
        </h3>
        <p className="text-sm text-emerald-600 mt-1">Protégez vos courses dès 100 FCFA</p>
      </div>
      
      {/* Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
        <div>
          <div className="font-medium">Activer l'assurance</div>
          <div className="text-sm text-gray-500">Couverture automatique sur chaque course</div>
        </div>
        <button
          onClick={() => onToggle(!enabled)}
          className={`w-14 h-8 rounded-full transition-colors relative ${
            enabled ? 'bg-emerald-500' : 'bg-gray-300'
          }`}
        >
          <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${
            enabled ? 'left-7' : 'left-1'
          }`} />
        </button>
      </div>
      
      {enabled && (
        <>
          {/* Plans */}
          <div className="space-y-3">
            {data?.plans?.map(plan => (
              <div 
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedPlan === plan.id 
                    ? 'border-emerald-500 bg-emerald-50' 
                    : 'border-gray-200 hover:border-emerald-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold" style={{ color: plan.color }}>{plan.name}</div>
                    <div className="text-2xl font-bold mt-1">{plan.price} FCFA</div>
                    <div className="text-xs text-gray-500">par course</div>
                  </div>
                  {plan.recommended && (
                    <span className="bg-emerald-500 text-white text-xs px-2 py-1 rounded-full">
                      Recommandé
                    </span>
                  )}
                </div>
                <div className="mt-3 space-y-1">
                  {plan.features.map((feat, i) => (
                    <div key={i} className="text-sm text-gray-600 flex items-center gap-2">
                      <FiShield size={12} className="text-emerald-500" />
                      {feat}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {/* Simulation */}
          <div className="bg-amber-50 rounded-xl p-4">
            <h4 className="font-medium text-amber-800 mb-2">💡 Exemple de couverture</h4>
            <p className="text-sm text-gray-600">
              Accident avec {selectedPlan === 'basic' ? '50 000' : selectedPlan === 'standard' ? '100 000' : '250 000'} FCFA de frais médicaux
            </p>
            <div className="mt-2 text-lg font-bold text-emerald-600">
              ✅ Couvert à 100% - Vous payez 0 FCFA
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// === CONTENU LIVICOMMUNITY ===
function CommunityContent({ data }) {
  return (
    <div className="space-y-6">
      <div className="bg-orange-50 rounded-xl p-4">
        <h3 className="font-bold text-orange-800 flex items-center gap-2">
          <FiUsers /> LiviCommunity
        </h3>
        <p className="text-sm text-orange-600 mt-1">Forum, événements, parrainage</p>
      </div>
      
      {/* Analytics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-purple-100 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-purple-700">{data?.analytics?.overview?.thisWeek?.earnings || 0} FCFA</div>
          <div className="text-xs text-purple-600">Cette semaine</div>
        </div>
        <div className="bg-blue-100 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-blue-700">{data?.analytics?.overview?.rating || 4.5}★</div>
          <div className="text-xs text-blue-600">Votre note</div>
        </div>
      </div>
      
      {/* Prédictions */}
      <div>
        <h4 className="font-medium text-gray-800 mb-3">🔮 Prédictions</h4>
        <div className="space-y-2">
          {data?.analytics?.insights?.predictions?.slice(0, 2).map((pred, i) => (
            <div key={i} className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-xl">{pred.icon}</span>
                <span className="font-medium text-sm">{pred.message}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{pred.action}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Parrainage */}
      <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl p-4 text-white">
        <h4 className="font-bold flex items-center gap-2">
          <FiUsers /> Parrainez vos amis
        </h4>
        <p className="text-sm mt-1 opacity-90">
          Gagnez 1 000 FCFA pour chaque chauffeur parrainé!
        </p>
        <div className="mt-3 bg-white/20 rounded-lg p-2 text-center font-mono">
          {data?.widget?.referral?.code || 'LIVI-VOU123'}
        </div>
      </div>
      
      {/* Événements */}
      <div>
        <h4 className="font-medium text-gray-800 mb-3">📅 Événements à venir</h4>
        <div className="space-y-2">
          {data?.widget?.events?.slice(0, 2).map((evt, i) => (
            <div key={i} className="p-3 bg-gray-50 rounded-lg flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-2xl">
                📅
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm">{evt.title}</div>
                <div className="text-xs text-gray-500">{evt.location}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// === CONTENU LIVIGREEN (Option) ===
function GreenContent({ data, enabled, onToggle }) {
  return (
    <div className="space-y-6">
      <div className="bg-green-50 rounded-xl p-4">
        <h3 className="font-bold text-green-800 flex items-center gap-2">
          <FiLeaf /> LiviGreen - Mode Éco
        </h3>
        <p className="text-sm text-green-600 mt-1">Suivez votre impact environnemental (Option)</p>
      </div>
      
      {/* Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
        <div>
          <div className="font-medium">Activer le mode Éco</div>
          <div className="text-sm text-gray-500">Suivi carbone et compensation</div>
        </div>
        <button
          onClick={() => onToggle(!enabled)}
          className={`w-14 h-8 rounded-full transition-colors relative ${
            enabled ? 'bg-green-500' : 'bg-gray-300'
          }`}
        >
          <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${
            enabled ? 'left-7' : 'left-1'
          }`} />
        </button>
      </div>
      
      {!enabled ? (
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🌱</div>
          <h4 className="font-medium text-gray-800">Mode Éco désactivé</h4>
          <p className="text-sm text-gray-500 mt-2">
            Activez pour suivre vos économies de CO2 et participer à la reforestation
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-100 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-green-700">12.5 kg</div>
              <div className="text-sm text-green-600">CO2 évité</div>
            </div>
            <div className="bg-green-100 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-green-700">3 🌳</div>
              <div className="text-sm text-green-600">Arbres équivalent</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-4 text-white">
            <h4 className="font-bold">🌍 Votre impact</h4>
            <p className="text-sm mt-1 opacity-90">
              Grâce à vous, nous avons planté 3 arbres au Sénégal!
            </p>
            <button className="mt-3 bg-white text-green-600 px-4 py-2 rounded-lg text-sm font-medium">
              Voir certificat
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// === CONTENU LIVIFLEX (Option) ===
function FlexContent({ data, enabled, onToggle }) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 rounded-xl p-4">
        <h3 className="font-bold text-blue-800 flex items-center gap-2">
          <FiCreditCard /> LiviFlex - Crédit
        </h3>
        <p className="text-sm text-blue-600 mt-1">Avance sur gains instantanée (Option)</p>
      </div>
      
      {/* Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
        <div>
          <div className="font-medium">Activer LiviFlex</div>
          <div className="text-sm text-gray-500">Crédit et paiement fractionné</div>
        </div>
        <button
          onClick={() => onToggle(!enabled)}
          className={`w-14 h-8 rounded-full transition-colors relative ${
            enabled ? 'bg-blue-500' : 'bg-gray-300'
          }`}
        >
          <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${
            enabled ? 'left-7' : 'left-1'
          }`} />
        </button>
      </div>
      
      {!enabled ? (
        <div className="text-center p-8">
          <div className="text-6xl mb-4">💳</div>
          <h4 className="font-medium text-gray-800">LiviFlex désactivé</h4>
          <p className="text-sm text-gray-500 mt-2">
            Activez pour accéder aux avances sur gains jusqu'à 50 000 FCFA
          </p>
        </div>
      ) : (
        <>
          {/* Éligibilité */}
          <div className={`p-4 rounded-xl ${
            data?.eligibility?.eligible ? 'bg-green-50' : 'bg-yellow-50'
          }`}>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                data?.eligibility?.eligible ? 'bg-green-500' : 'bg-yellow-500'
              }`} />
              <span className="font-medium">
                {data?.eligibility?.eligible ? 'Éligible au crédit' : 'Vérifiez votre éligibilité'}
              </span>
            </div>
            {data?.eligibility?.eligible && (
              <div className="mt-2">
                <div className="text-2xl font-bold text-green-700">
                  Jusqu'à {data?.eligibility?.maxAmount?.toLocaleString()} FCFA
                </div>
                <div className="text-sm text-green-600">
                  Palier: {data?.eligibility?.tier?.label}
                </div>
              </div>
            )}
          </div>
          
          {/* Simulation */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-medium text-gray-800 mb-3">Simulateur</h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Montant demandé</span>
                <span className="font-medium">25 000 FCFA</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Intérêts (2%)</span>
                <span className="font-medium">500 FCFA</span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="font-medium">Total à rembourser</span>
                <span className="font-bold text-blue-600">25 500 FCFA</span>
              </div>
              <div className="text-xs text-gray-500">
                4 paiements hebdomadaires de 6 375 FCFA
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
