/**
 * Service d'intégration du Chatbot LiviGo
 * Connecte l'application au backend Rasa
 */

const RASA_URL = import.meta.env.VITE_RASA_URL || 'http://localhost:5005'

class ChatbotService {
  constructor() {
    this.conversationId = this.generateConversationId()
  }

  generateConversationId() {
    return 'livigo-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)
  }

  /**
   * Envoie un message au chatbot et reçoit la réponse
   */
  async sendMessage(message, sender = this.conversationId) {
    try {
      const response = await fetch(`${RASA_URL}/webhooks/rest/webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender,
          message,
        }),
      })

      if (!response.ok) {
        throw new Error('Erreur de communication avec le chatbot')
      }

      const data = await response.json()
      return this.formatResponse(data)
    } catch (error) {
      console.error('Chatbot error:', error)
      return this.getFallbackResponse(message)
    }
  }

  /**
   * Formate la réponse du chatbot
   */
  formatResponse(responses) {
    return responses.map(response => ({
      text: response.text,
      buttons: response.buttons || [],
      image: response.image || null,
      attachment: response.attachment || null,
    }))
  }

  /**
   * Réponse de fallback si le chatbot est indisponible
   */
  getFallbackResponse(message) {
    const lowerMessage = message.toLowerCase()
    
    // Détection basique des intentions
    if (lowerMessage.includes('taxi') || lowerMessage.includes('course')) {
      return [{
        text: "🚕 Pour commander un taxi, ouvrez l'application LiviGo et cliquez sur 'Commander'. Un chauffeur sera disponible en quelques minutes !",
        buttons: [
          { title: 'Commander un taxi', payload: '/commander_taxi' },
          { title: 'Voir les tarifs', payload: '/prix_course' }
        ]
      }]
    }
    
    if (lowerMessage.includes('livraison') || lowerMessage.includes('colis')) {
      return [{
        text: "📦 Pour une livraison, utilisez l'onglet 'Livraison' dans l'app LiviGo. Prix à partir de 500 FCFA !",
        buttons: [
          { title: 'Commander une livraison', payload: '/commander_livraison' }
        ]
      }]
    }
    
    if (lowerMessage.includes('prix') || lowerMessage.includes('tarif') || lowerMessage.includes('combien')) {
      return [{
        text: "💰 **Tarifs LiviGo**\n\n🚕 Moto Taxi : 500 - 2 000 FCFA\n🚗 Taxi Premium : 1 000 - 5 000 FCFA\n📦 Livraison : 500 - 3 000 FCFA\n\nLes prix varient selon la distance.",
        buttons: [
          { title: 'Commander', payload: '/commander_taxi' }
        ]
      }]
    }
    
    if (lowerMessage.includes('orange') || lowerMessage.includes('wave') || lowerMessage.includes('paiement')) {
      return [{
        text: "💳 **Modes de paiement acceptés**\n\n• Orange Money\n• Wave\n• Free Money\n• Espèces\n• LiviWallet",
        buttons: [
          { title: 'Commander', payload: '/commander_taxi' }
        ]
      }]
    }
    
    // Wolof detection
    if (lowerMessage.includes('jàmm') || lowerMessage.includes('naka') || lowerMessage.includes('bëgg')) {
      return [{
        text: "Jàmm nga am ! 👋 Maangi LiviGo assistant.\n\nBëgg taxi ? 🚕\nBëgg yónne ? 📦\n\nMan la helpé !",
        buttons: [
          { title: 'Taxi', payload: '/commander_taxi' },
          { title: 'Livraison', payload: '/commander_livraison' }
        ]
      }]
    }
    
    // Réponse par défaut
    return [{
      text: "👋 Bienvenue sur LiviGo ! Comment puis-je vous aider ?\n\n🚕 Taxi\n📦 Livraison\n💰 Tarifs\n📞 Support",
      buttons: [
        { title: '🚕 Commander Taxi', payload: '/commander_taxi' },
        { title: '📦 Livraison', payload: '/commander_livraison' },
        { title: '💰 Tarifs', payload: '/prix_course' },
        { title: '📞 Support', payload: '/contacter_support' }
      ]
    }]
  }

  /**
   * Obtient les suggestions rapides
   */
  getQuickReplies() {
    return [
      { text: '🚕 Commander Taxi', payload: '/commander_taxi' },
      { text: '📦 Livraison', payload: '/commander_livraison' },
      { text: '💰 Tarifs', payload: '/prix_course' },
      { text: '📍 Suivre course', payload: '/suivre_course' },
      { text: '📞 Support', payload: '/contacter_support' },
    ]
  }
}

export const chatbotService = new ChatbotService()
export default chatbotService
