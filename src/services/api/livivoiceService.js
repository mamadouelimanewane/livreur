/**
 * LiviVoice - Assistant Vocal Wolof/Français
 * Commandes vocales, navigation, support
 */

// Commandes vocales supportées
const VOICE_COMMANDS = {
  fr: {
    'commander taxi': { action: 'book_ride', type: 'taxi' },
    'commander une course': { action: 'book_ride' },
    'appeler chauffeur': { action: 'call_driver' },
    'où est mon chauffeur': { action: 'track_driver' },
    'annuler course': { action: 'cancel_ride' },
    'prix course': { action: 'estimate_price' },
    'aide': { action: 'show_help' },
    'urgence': { action: 'sos' },
    'mon solde': { action: 'show_balance' },
    'historique': { action: 'show_history' },
    'devenir chauffeur': { action: 'become_driver' },
    'parrainer': { action: 'referral' },
  },
  wo: {
    'am na taxi': { action: 'book_ride', type: 'taxi' },
    'am na course': { action: 'book_ride' },
    'woon chauffeur bi': { action: 'call_driver' },
    'fan moo nekk chauffeur bi': { action: 'track_driver' },
    'bayyi course bi': { action: 'cancel_ride' },
    'natt price bi': { action: 'estimate_price' },
    'ndimbal': { action: 'show_help' },
    'kaadu': { action: 'sos' },
    'samay xaalis': { action: 'show_balance' },
    'lii jiitu': { action: 'show_history' },
    'dindi chauffeur': { action: 'become_driver' },
    'yokku': { action: 'referral' },
  }
}

// Phrases de réponse
const RESPONSES = {
  fr: {
    greeting: 'Bonjour! Je suis LiviVoice. Comment puis-je vous aider?',
    booking_confirmed: 'Votre course est confirmée. Un chauffeur arrivera dans {minutes} minutes.',
    driver_arriving: 'Votre chauffeur {name} est à {distance} mètres.',
    price_estimate: 'Le prix estimé est de {price} FCFA.',
    help: 'Je peux vous aider à commander un taxi, estimer un prix, ou contacter un chauffeur. Dites "commander taxi" ou "aide" pour plus d\'options.',
    sos: 'Alerte envoyée! Le support vous contacte immédiatement.',
    not_understood: 'Je n\'ai pas compris. Pouvez-vous répéter?',
    balance: 'Votre solde est de {balance} FCFA.',
    welcome_driver: 'Bonjour chauffeur! Dites "nouvelle course" pour voir les demandes disponibles.',
  },
  wo: {
    greeting: 'Nanga def! Man degg naa Wolof ak Français. Ndax bëgg nga taxi?',
    booking_confirmed: 'Course bi am na. Chauffeur dina ñëw ci {minutes} minutes.',
    driver_arriving: 'Chauffeur bi {name} am na ci {distance} met.',
    price_estimate: 'Price bi dafa mel ni {price} FCFA.',
    help: 'Mën naa la dimbali am taxi, xay price, walla wax chauffeur. Waxal "am na taxi" walla "ndimbal".',
    sos: 'Alert bi yonnee na! Support dina la wax.',
    not_understood: 'Dégguma. Mën nga waxaat?',
    balance: 'Sa xaalis am na {balance} FCFA.',
    welcome_driver: 'Nanga def chauffeur! Waxal "course bu bees" ngir xool.',
  }
}

class LiviVoiceService {
  constructor() {
    this.currentLang = 'fr'
    this.isListening = false
    this.recognition = null
    this.synthesis = window.speechSynthesis
  }
  
  /**
   * Détecte la langue parlée
   */
  detectLanguage(text) {
    // Mots indicateurs Wolof
    const wolofIndicators = ['na', 'dafa', 'am', 'bu', 'bi', 'yi', 'ñu', 'ma', 'la', 'nga', 'dégg']
    const words = text.toLowerCase().split(' ')
    
    const wolofCount = words.filter(w => wolofIndicators.some(ind => w.includes(ind))).length
    return wolofCount > 0 ? 'wo' : 'fr'
  }
  
  /**
   * Traite une commande vocale
   */
  processCommand(transcript) {
    const lang = this.detectLanguage(transcript)
    this.currentLang = lang
    
    const commands = VOICE_COMMANDS[lang]
    const normalized = transcript.toLowerCase().trim()
    
    // Recherche la commande correspondante
    for (const [phrase, action] of Object.entries(commands)) {
      if (normalized.includes(phrase)) {
        return {
          success: true,
          lang,
          action: action.action,
          params: action,
          original: transcript
        }
      }
    }
    
    // Commande non reconnue
    return {
      success: false,
      lang,
      action: 'unknown',
      original: transcript
    }
  }
  
  /**
   * Génère une réponse vocale
   */
  generateResponse(action, params = {}, lang = 'fr') {
    const responses = RESPONSES[lang] || RESPONSES['fr']
    
    let response = responses[action] || responses.not_understood
    
    // Remplace les variables
    Object.entries(params).forEach(([key, value]) => {
      response = response.replace(`{${key}}`, value)
    })
    
    return {
      text: response,
      lang,
      action
    }
  }
  
  /**
   * Parle la réponse
   */
  speak(text, lang = 'fr') {
    if (!this.synthesis) return
    
    // Annule la parole précédente
    this.synthesis.cancel()
    
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang === 'wo' ? 'fr-SN' : 'fr-FR'
    utterance.rate = 0.9 // Légèrement plus lent pour clarté
    utterance.pitch = 1
    
    this.synthesis.speak(utterance)
    
    return utterance
  }
  
  /**
   * Démarre l'écoute vocale
   */
  startListening(onResult, onError) {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      onError?.('Speech recognition not supported')
      return false
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    this.recognition = new SpeechRecognition()
    
    this.recognition.continuous = false
    this.recognition.interimResults = false
    this.recognition.lang = 'fr-FR' // Détectera automatiquement Wolof
    
    this.recognition.onstart = () => {
      this.isListening = true
    }
    
    this.recognition.onend = () => {
      this.isListening = false
    }
    
    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      const result = this.processCommand(transcript)
      onResult?.(result)
    }
    
    this.recognition.onerror = (event) => {
      onError?.(event.error)
    }
    
    this.recognition.start()
    return true
  }
  
  /**
   * Arrête l'écoute
   */
  stopListening() {
    if (this.recognition) {
      this.recognition.stop()
      this.isListening = false
    }
  }
  
  /**
   * Commande rapide: Réserver taxi
   */
  quickBookTaxi(destination, lang = 'fr') {
    const responses = RESPONSES[lang]
    
    return {
      action: 'book_ride',
      confirmation: lang === 'wo' 
        ? `Taxi dina ñëw ci ${destination}. Danga bëgg?`
        : `Un taxi va venir à ${destination}. Confirmez?`,
      params: { destination, type: 'taxi' }
    }
  }
  
  /**
   * Commande rapide: Prix estimé
   */
  quickEstimatePrice(from, to, price, lang = 'fr') {
    const responses = RESPONSES[lang]
    
    return {
      action: 'estimate_price',
      response: lang === 'wo'
        ? `Price bi dafa mel ni ${price} FCFA ci diggante ${from} ak ${to}`
        : `Le prix estimé de ${from} à ${to} est de ${price} FCFA`,
      params: { from, to, price }
    }
  }
  
  /**
   * Navigation guidée pour chauffeurs
   */
  navigationInstruction(turn, distance, lang = 'fr') {
    const instructions = {
      fr: {
        'straight': `Continuez tout droit pendant ${distance}`,
        'left': `Tournez à gauche dans ${distance}`,
        'right': `Tournez à droite dans ${distance}`,
        'arrived': `Vous êtes arrivé à destination`,
      },
      wo: {
        'straight': `Yoon wi yéppal ci ${distance}`,
        'left': `Jëfandikoo càmmo ci ${distance}`,
        'right': `Jëfandikoo ndijoor ci ${distance}`,
        'arrived': `Ngeen ñëw`,
      }
    }
    
    return instructions[lang]?.[turn] || instructions['fr'][turn]
  }
  
  /**
   * Guide d'onboarding vocal
   */
  onboardingGuide(step, lang = 'fr') {
    const guides = {
      fr: [
        'Bienvenue sur LiviGo! Je suis votre assistant vocal.',
        'Dites "commander taxi" pour réserver une course.',
        'Dites "prix course" pour estimer le tarif.',
        'Je comprends aussi le Wolof! Dites "am na taxi".',
        'Pour l\'aide, dites simplement "aide".',
      ],
      wo: [
        'Nanga def ci LiviGo! Man maa ngi sa assistant.',
        'Waxal "am na taxi" ngir am course.',
        'Waxal "natt price" ngir xay price bi.',
        'Dégg naa Français itam! Waxal "commander taxi".',
        'Bu la soo bëggo ndimbal, waxal "ndimbal".',
      ]
    }
    
    return guides[lang]?.[step] || guides['fr'][step]
  }
  
  /**
   * Traduction simple Wolof-Français pour l'app
   */
  translate(key, lang = 'fr') {
    const translations = {
      'book_ride': { fr: 'Commander', wo: 'Am' },
      'driver': { fr: 'Chauffeur', wo: 'Chauffeur' },
      'price': { fr: 'Prix', wo: 'Price' },
      'destination': { fr: 'Destination', wo: 'Dëkk' },
      'arrival': { fr: 'Arrivée', wo: 'Ñëw' },
      'cancel': { fr: 'Annuler', wo: 'Bayyi' },
      'confirm': { fr: 'Confirmer', wo: 'Wóoral' },
      'help': { fr: 'Aide', wo: 'Ndimbal' },
      'balance': { fr: 'Solde', wo: 'Xaalis' },
      'earnings': { fr: 'Gains', wo: 'Kàttan' },
    }
    
    return translations[key]?.[lang] || translations[key]?.['fr'] || key
  }
  
  /**
   * Widget pour l'interface
   */
  getVoiceWidget() {
    return {
      isListening: this.isListening,
      currentLang: this.currentLang,
      supportedLangs: [
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
        { code: 'wo', name: 'Wolof', flag: '🇸🇳' },
      ],
      quickCommands: [
        { icon: '🚕', command: 'commander taxi', desc: 'Réserver taxi' },
        { icon: '💰', command: 'prix course', desc: 'Estimer prix' },
        { icon: '📍', command: 'où est mon chauffeur', desc: 'Localiser' },
        { icon: '🆘', command: 'aide', desc: 'Aide' },
      ]
    }
  }
}

export default new LiviVoiceService()
