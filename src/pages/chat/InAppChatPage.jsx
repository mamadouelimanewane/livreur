import { useState, useRef, useEffect } from 'react'
import { FiSend, FiSearch, FiMessageSquare, FiCircle, FiCheck, FiCheckCircle } from 'react-icons/fi'
import { PageHeader } from '../../components/PageLayout'

const QUICK_REPLIES = ["Je suis en route", "J'arrive dans 2 min", "Où êtes-vous ?", "Veuillez patienter", "Course terminée"]

const NOW = Date.now()
const CONVERSATIONS = [
  { id: 1, driverName: 'Moussa Diallo', clientName: 'Fatou Ba', rideId: 'R-4521', status: 'active', unread: 2,
    messages: [
      { id: 1, from: 'driver', text: 'Bonjour, je suis en route vers vous.', time: NOW - 300000 },
      { id: 2, from: 'client', text: 'Merci, je suis devant l\'immeuble bleu.', time: NOW - 240000 },
      { id: 3, from: 'driver', text: "D'accord, j'arrive dans 3 minutes.", time: NOW - 180000 },
      { id: 4, from: 'client', text: 'Parfait, je vous attends.', time: NOW - 120000 },
      { id: 5, from: 'driver', text: "Je suis arrivé. Je suis garé devant l'entrée.", time: NOW - 60000 },
      { id: 6, from: 'client', text: 'Je descends !', time: NOW - 30000 },
    ]
  },
  { id: 2, driverName: 'Cheikh Ndiaye', clientName: 'Aminata Diop', rideId: 'R-4520', status: 'active', unread: 0,
    messages: [
      { id: 1, from: 'client', text: 'Bonjour, vous êtes loin ?', time: NOW - 600000 },
      { id: 2, from: 'driver', text: "5 minutes maximum.", time: NOW - 540000 },
      { id: 3, from: 'client', text: 'OK merci', time: NOW - 480000 },
    ]
  },
  { id: 3, driverName: 'Abdou Mbaye', clientName: 'Rokhaya Ciss', rideId: 'R-4519', status: 'active', unread: 1,
    messages: [
      { id: 1, from: 'driver', text: 'Course démarrée, direction Médina.', time: NOW - 900000 },
      { id: 2, from: 'client', text: 'Pouvez-vous aller plus vite ?', time: NOW - 600000 },
    ]
  },
  { id: 4, driverName: 'Mamadou Sy', clientName: 'Ndèye Sarr', rideId: 'R-4518', status: 'active', unread: 3,
    messages: [
      { id: 1, from: 'client', text: 'Je suis à l\'arrêt de bus Total.', time: NOW - 1200000 },
      { id: 2, from: 'driver', text: 'Je vous vois, j\'arrive.', time: NOW - 1080000 },
      { id: 3, from: 'client', text: 'Dépêchez-vous svp.', time: NOW - 900000 },
      { id: 4, from: 'client', text: 'Toujours là ?', time: NOW - 120000 },
    ]
  },
  { id: 5, driverName: 'Ibrahima Sow', clientName: 'Seydou Niang', rideId: 'R-4515', status: 'ended', unread: 0,
    messages: [
      { id: 1, from: 'driver', text: 'Course terminée. Merci !', time: NOW - 3600000 },
      { id: 2, from: 'client', text: 'Merci bonne continuation.', time: NOW - 3540000 },
    ]
  },
  { id: 6, driverName: 'Lamine Gaye', clientName: 'Marème Fall', rideId: 'R-4514', status: 'ended', unread: 0,
    messages: [
      { id: 1, from: 'client', text: 'Merci beaucoup pour la course.', time: NOW - 7200000 },
      { id: 2, from: 'driver', text: 'Avec plaisir, bonne journée !', time: NOW - 7140000 },
    ]
  },
]

function timeAgo(ts) {
  const diff = Math.floor((NOW - ts) / 1000)
  if (diff < 60) return `${diff}s`
  if (diff < 3600) return `${Math.floor(diff/60)}min`
  return `${Math.floor(diff/3600)}h`
}

function initials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

export default function InAppChatPage() {
  const [convs, setConvs] = useState(CONVERSATIONS)
  const [activeId, setActiveId] = useState(1)
  const [message, setMessage] = useState('')
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef(null)

  const active = convs.find(c => c.id === activeId)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [activeId, active?.messages])

  const filteredConvs = convs.filter(c => {
    if (filter === 'active' && c.status !== 'active') return false
    if (filter === 'ended' && c.status !== 'ended') return false
    if (search && !c.driverName.toLowerCase().includes(search.toLowerCase()) &&
        !c.clientName.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const selectConv = (id) => {
    setActiveId(id)
    setConvs(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c))
  }

  const sendMessage = (text) => {
    const msg = text || message.trim()
    if (!msg) return
    setConvs(prev => prev.map(c => c.id === activeId ? {
      ...c, messages: [...c.messages, { id: Date.now(), from: 'admin', text: msg, time: Date.now() }]
    } : c))
    setMessage('')
    // Simulate driver typing reply
    setTyping(true)
    setTimeout(() => setTyping(false), 2000)
  }

  const colors = ['#4680ff','#22c55e','#f59e0b','#ef4444','#a855f7','#0ea5e9']

  return (
    <div style={{ padding: '24px', background: '#f4f6f9', minHeight: '100vh' }}>
      <PageHeader title="💬 Chat In-App" subtitle="Messagerie conducteurs — clients en temps réel" />

      <div style={{ display: 'flex', gap: 0, height: 600, background: '#fff', borderRadius: 16,
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)', overflow: 'hidden' }}>

        {/* Sidebar */}
        <div style={{ width: 300, borderRight: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <div style={{ padding: '16px 14px 10px', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#1e293b', marginBottom: 10 }}>Conversations</div>
            <div style={{ position: 'relative', marginBottom: 8 }}>
              <FiSearch size={13} style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher…"
                style={{ width: '100%', padding: '7px 10px 7px 28px', borderRadius: 8, border: '1px solid #e2e8f0',
                  fontSize: 12, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {[['all','Tous'],['active','Actifs'],['ended','Terminés']].map(([v,l]) => (
                <button key={v} onClick={() => setFilter(v)} style={{
                  flex: 1, padding: '4px 0', borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                  background: filter === v ? '#4680ff' : '#f8fafc', color: filter === v ? '#fff' : '#64748b', border: 'none' }}>{l}</button>
              ))}
            </div>
          </div>
          {/* List */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filteredConvs.map((c, i) => {
              const last = c.messages[c.messages.length - 1]
              return (
                <div key={c.id} onClick={() => selectConv(c.id)} style={{
                  padding: '12px 14px', cursor: 'pointer', borderBottom: '1px solid #f8fafc',
                  background: activeId === c.id ? '#eff6ff' : 'transparent', transition: 'background 0.12s' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <div style={{ width: 38, height: 38, borderRadius: '50%', background: colors[i % colors.length] + '22',
                        color: colors[i % colors.length], display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: 13 }}>{initials(c.driverName)}</div>
                      {c.status === 'active' && <div style={{ position: 'absolute', bottom: 0, right: 0, width: 10, height: 10,
                        borderRadius: '50%', background: '#22c55e', border: '2px solid #fff' }} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                        <div style={{ fontWeight: 700, fontSize: 12, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {c.driverName} ↔ {c.clientName}
                        </div>
                        <div style={{ fontSize: 10, color: '#94a3b8', flexShrink: 0, marginLeft: 4 }}>{timeAgo(last?.time)}</div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: 11, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {last?.text}
                        </div>
                        {c.unread > 0 && <div style={{ background: '#4680ff', color: '#fff', borderRadius: 10, fontSize: 10,
                          fontWeight: 700, padding: '1px 6px', flexShrink: 0, marginLeft: 4 }}>{c.unread}</div>}
                      </div>
                      <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>#{c.rideId}</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Chat Panel */}
        {active ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Chat Header */}
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#4680ff22', color: '#4680ff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>
                {initials(active.driverName)}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#1e293b' }}>{active.driverName} ↔ {active.clientName}</div>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>Course #{active.rideId} · {active.status === 'active' ? '🟢 En cours' : '⚫ Terminée'}</div>
              </div>
            </div>

            {/* Quick Replies */}
            <div style={{ padding: '8px 16px', borderBottom: '1px solid #f8fafc', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {QUICK_REPLIES.map(r => (
                <button key={r} onClick={() => sendMessage(r)} style={{
                  padding: '4px 10px', borderRadius: 16, fontSize: 11, cursor: 'pointer',
                  background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0',
                  transition: 'background 0.1s' }}>{r}</button>
              ))}
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {active.messages.map(m => {
                const isAdmin = m.from === 'admin'
                const isDriver = m.from === 'driver'
                const isRight = isAdmin || isDriver
                return (
                  <div key={m.id} style={{ display: 'flex', justifyContent: isRight ? 'flex-end' : 'flex-start' }}>
                    {!isRight && (
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#f1f5f9',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, marginRight: 8, flexShrink: 0 }}>👤</div>
                    )}
                    <div style={{ maxWidth: '65%' }}>
                      {!isRight && <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 2 }}>{active.clientName}</div>}
                      {isDriver && <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 2, textAlign: 'right' }}>{active.driverName}</div>}
                      <div style={{
                        padding: '9px 14px', borderRadius: isRight ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                        background: isAdmin ? '#4680ff' : isDriver ? '#1e293b' : '#f1f5f9',
                        color: isRight ? '#fff' : '#1e293b', fontSize: 13, lineHeight: 1.4 }}>
                        {m.text}
                      </div>
                      <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2, textAlign: isRight ? 'right' : 'left' }}>{timeAgo(m.time)}</div>
                    </div>
                  </div>
                )
              })}
              {typing && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>🚗</div>
                  <div style={{ background: '#f1f5f9', borderRadius: '4px 16px 16px 16px', padding: '9px 14px', fontSize: 13, color: '#94a3b8' }}>
                    <span style={{ animation: 'blink 1s infinite' }}>En train d'écrire…</span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={{ padding: '12px 16px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: 10, alignItems: 'center' }}>
              <input value={message} onChange={e => setMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Écrire un message…"
                style={{ flex: 1, padding: '10px 14px', borderRadius: 24, border: '1px solid #e2e8f0',
                  fontSize: 13, outline: 'none', background: '#f8fafc' }} />
              <button onClick={() => sendMessage()} style={{
                width: 40, height: 40, borderRadius: '50%', background: '#4680ff', border: 'none',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FiSend size={16} color="#fff" />
              </button>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
            <div style={{ textAlign: 'center' }}>
              <FiMessageSquare size={48} style={{ marginBottom: 12, opacity: 0.3 }} />
              <div>Sélectionnez une conversation</div>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    </div>
  )
}
