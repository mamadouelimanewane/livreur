import { useState, useEffect, useRef } from 'react'
import { FiSend, FiX, FiMessageSquare } from 'react-icons/fi'
import { supabase } from '../services/api/supabaseClient'

const ACCENT = '#4680ff'

/**
 * Composant de chat flottant en temps réel pour la communication Client-Chauffeur.
 */
export default function ChatOverlay({ rideId, currentUser }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const messagesEndRef = useRef(null)

  // Charger l'historique et écouter les nouveaux messages
  useEffect(() => {
    if (!rideId) return

    const loadMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('ride_id', rideId)
        .order('created_at', { ascending: true })
      
      if (data) setMessages(data)
    }

    loadMessages()

    const subscription = supabase
      .channel(`chat:${rideId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages', 
        filter: `ride_id=eq.${rideId}` 
      }, payload => {
        setMessages(prev => [...prev, payload.new])
      })
      .subscribe()

    return () => supabase.removeChannel(subscription)
  }, [rideId])

  // Défilement automatique vers le dernier message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const newMessage = {
      ride_id: rideId,
      sender_id: currentUser,
      text: input,
      created_at: new Date().toISOString()
    }

    const { error } = await supabase.from('messages').insert(newMessage)
    if (error) console.error("Erreur envoi message:", error)
    else setInput('')
  }

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed', bottom: 85, right: 20,
          width: 56, height: 56, borderRadius: '50%',
          background: ACCENT, color: '#fff', border: 'none',
          boxShadow: '0 4px 16px rgba(70,128,255,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', zIndex: 1000, animation: 'bounce 2s infinite'
        }}
      >
        <FiMessageSquare size={24} />
      </button>
    )
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', zIndex: 2000,
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      padding: '0 16px 20px'
    }}>
      <div style={{
        background: '#fff', borderRadius: 20, height: '70vh',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        boxShadow: '0 -8px 30px rgba(0,0,0,0.2)'
      }}>
        {/* Header Chat */}
        <div style={{
          padding: '16px 20px', borderBottom: '1px solid #f1f5f9',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#1e293b' }}>Discussion Directe</div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>Course #{rideId.substring(0, 6)}</div>
          </div>
          <button onClick={() => setIsOpen(false)} style={{ background: '#f1f5f9', border: 'none', padding: 8, borderRadius: '50%', cursor: 'pointer' }}>
            <FiX size={18} color="#64748b" />
          </button>
        </div>

        {/* Liste des Messages */}
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
          {messages.map((m, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: m.sender_id === currentUser ? 'flex-end' : 'flex-start',
              marginBottom: 12
            }}>
              <div style={{
                maxWidth: '80%', padding: '10px 14px', borderRadius: 16,
                fontSize: 14, lineHeight: 1.4,
                background: m.sender_id === currentUser ? ACCENT : '#f1f5f9',
                color: m.sender_id === currentUser ? '#fff' : '#1e293b',
                borderBottomRightRadius: m.sender_id === currentUser ? 4 : 16,
                borderBottomLeftRadius: m.sender_id === currentUser ? 16 : 4
              }}>
                {m.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Message */}
        <form onSubmit={handleSendMessage} style={{ padding: '16px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: 10 }}>
          <input 
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Écrivez un message..."
            style={{
              flex: 1, padding: '12px 16px', borderRadius: 12, border: '1px solid #e2e8f0',
              outline: 'none', fontSize: 14
            }}
          />
          <button type="submit" style={{
            background: ACCENT, color: '#fff', border: 'none', width: 44, height: 44,
            borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer'
          }}>
            <FiSend size={18} />
          </button>
        </form>
      </div>
    </div>
  )
}
