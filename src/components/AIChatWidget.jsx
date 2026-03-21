import { useState, useRef, useEffect } from 'react'
import { FiSend, FiX, FiMessageCircle, FiSmartphone, FiPackage, FiDollarSign, FiHeadphones } from 'react-icons/fi'
import chatbotService from '../services/api/chatbotService'

const ACCENT = '#4680ff'

/**
 * Widget Chatbot IA LiviGo - Assistant en Français et Wolof
 */
export default function AIChatWidget() {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: "👋 Bienvenue sur LiviGo ! Je suis votre assistant.\n\n🚕 Taxi\n📦 Livraison\n💰 Tarifs\n📞 Support\n\nComment puis-je vous aider ?",
      buttons: [
        { title: '🚕 Commander Taxi', payload: '/commander_taxi' },
        { title: '📦 Livraison', payload: '/commander_livraison' },
        { title: '💰 Tarifs', payload: '/prix_course' },
        { title: '📞 Support', payload: '/contacter_support' }
      ]
    }
  ])
  const [input, setInput] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  // Défilement automatique
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Envoyer un message
  const sendMessage = async (text, isButton = false) => {
    if (!text.trim()) return

    // Ajouter le message utilisateur
    const userMessage = { type: 'user', text: isButton ? text.replace(/^[^\s]+\s/, '') : text }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    try {
      // Appeler le chatbot
      const responses = await chatbotService.sendMessage(text)
      
      // Simuler un délai de frappe
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500))
      
      // Ajouter les réponses du bot
      responses.forEach((response, index) => {
        setTimeout(() => {
          setMessages(prev => [...prev, {
            type: 'bot',
            text: response.text,
            buttons: response.buttons || []
          }])
          setIsTyping(false)
        }, index * 300)
      })
    } catch (error) {
      console.error('Erreur chatbot:', error)
      setMessages(prev => [...prev, {
        type: 'bot',
        text: "Désolé, je rencontre un problème. Veuillez réessayer ou contacter le support.",
        buttons: [{ title: '📞 Support', payload: '/contacter_support' }]
      }])
      setIsTyping(false)
    }
  }

  // Gérer le formulaire
  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim()) {
      sendMessage(input)
    }
  }

  // Gérer le clic sur un bouton
  const handleButtonClick = (button) => {
    sendMessage(button.payload, true)
  }

  // Suggestions rapides
  const quickReplies = [
    { icon: <FiSmartphone />, text: 'Taxi', payload: '/commander_taxi' },
    { icon: <FiPackage />, text: 'Livraison', payload: '/commander_livraison' },
    { icon: <FiDollarSign />, text: 'Prix', payload: '/prix_course' },
    { icon: <FiHeadphones />, text: 'Support', payload: '/contacter_support' }
  ]

  // Bouton flottant fermé
  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed', bottom: 20, right: 20,
          width: 60, height: 60, borderRadius: '50%',
          background: `linear-gradient(135deg, ${ACCENT}, #6366f1)`,
          color: '#fff', border: 'none',
          boxShadow: '0 4px 20px rgba(70,128,255,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', zIndex: 9999,
          animation: 'pulse 2s infinite'
        }}
        title="Assistant LiviGo"
      >
        <FiMessageCircle size={28} />
        <span style={{
          position: 'absolute', top: -4, right: -4,
          width: 18, height: 18, borderRadius: '50%',
          background: '#22c55e', border: '2px solid #fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, fontWeight: 'bold'
        }}>IA</span>
      </button>
    )
  }

  // Interface de chat ouverte
  return (
    <div style={{
      position: 'fixed', bottom: 20, right: 20,
      width: 380, height: 550, maxWidth: 'calc(100vw - 40px)',
      maxHeight: 'calc(100vh - 40px)',
      background: '#fff', borderRadius: 20,
      boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden', zIndex: 9999,
      animation: 'slideUp 0.3s ease-out'
    }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${ACCENT}, #6366f1)`,
        padding: '16px 20px',
        color: '#fff',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <FiMessageCircle size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>Assistant LiviGo</div>
            <div style={{ fontSize: 11, opacity: 0.8 }}>Français • Wolof • 24h/24</div>
          </div>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          style={{
            background: 'rgba(255,255,255,0.2)', border: 'none',
            padding: 8, borderRadius: '50%', cursor: 'pointer',
            color: '#fff', display: 'flex', alignItems: 'center'
          }}
        >
          <FiX size={18} />
        </button>
      </div>

      {/* Messages */}
      <div style={{ 
        flex: 1, overflowY: 'auto', padding: '16px',
        background: '#f8fafc'
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
            marginBottom: 12
          }}>
            <div style={{
              maxWidth: '85%',
              padding: '12px 16px',
              borderRadius: 18,
              fontSize: 14, lineHeight: 1.5,
              background: msg.type === 'user' ? ACCENT : '#fff',
              color: msg.type === 'user' ? '#fff' : '#1e293b',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              borderBottomRightRadius: msg.type === 'user' ? 4 : 18,
              borderBottomLeftRadius: msg.type === 'user' ? 18 : 4,
              whiteSpace: 'pre-wrap'
            }}>
              {msg.text}
            </div>
          </div>
        ))}

        {/* Boutons de réponse */}
        {messages.length > 0 && messages[messages.length - 1].buttons?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
            {messages[messages.length - 1].buttons.map((btn, i) => (
              <button
                key={i}
                onClick={() => handleButtonClick(btn)}
                style={{
                  padding: '8px 14px',
                  borderRadius: 16,
                  border: `1px solid ${ACCENT}`,
                  background: '#fff',
                  color: ACCENT,
                  fontSize: 13, fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {btn.title}
              </button>
            ))}
          </div>
        )}

        {/* Indicateur de frappe */}
        {isTyping && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 12 }}>
            <div style={{
              padding: '12px 16px',
              borderRadius: 18,
              background: '#fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <div style={{ display: 'flex', gap: 4 }}>
                <span className="typing-dot" style={{ animation: 'typing 1s infinite' }}>●</span>
                <span className="typing-dot" style={{ animation: 'typing 1s 0.2s infinite' }}>●</span>
                <span className="typing-dot" style={{ animation: 'typing 1s 0.4s infinite' }}>●</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions rapides */}
      <div style={{
        padding: '8px 16px',
        display: 'flex', gap: 8,
        overflowX: 'auto',
        background: '#fff',
        borderTop: '1px solid #f1f5f9'
      }}>
        {quickReplies.map((reply, i) => (
          <button
            key={i}
            onClick={() => sendMessage(reply.payload, true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 12px',
              borderRadius: 16,
              border: '1px solid #e2e8f0',
              background: '#f8fafc',
              color: '#64748b',
              fontSize: 12, fontWeight: 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}
          >
            {reply.icon}
            {reply.text}
          </button>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} style={{
        padding: '12px 16px',
        display: 'flex', gap: 10,
        background: '#fff',
        borderTop: '1px solid #f1f5f9'
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Écrivez votre message..."
          style={{
            flex: 1,
            padding: '12px 16px',
            borderRadius: 24,
            border: '1px solid #e2e8f0',
            outline: 'none',
            fontSize: 14,
            background: '#f8fafc'
          }}
        />
        <button
          type="submit"
          disabled={!input.trim()}
          style={{
            width: 44, height: 44,
            borderRadius: '50%',
            border: 'none',
            background: input.trim() ? ACCENT : '#e2e8f0',
            color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: input.trim() ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s'
          }}
        >
          <FiSend size={18} />
        </button>
      </form>

      {/* Styles d'animation */}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes typing {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
