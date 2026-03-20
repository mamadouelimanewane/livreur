import { useEffect, useRef, useState } from 'react'
import { FiWifi, FiWifiOff, FiActivity, FiTruck, FiUsers } from 'react-icons/fi'
import { supabase } from '../../services/api/supabaseClient'

/* ─── Compteur animé ─── */
function LiveCounter({ label, value, color, icon }) {
  const [display, setDisplay] = useState(value)
  const prevRef = useRef(value)
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    if (prevRef.current !== value) {
      setPulse(true)
      setTimeout(() => setPulse(false), 600)
      prevRef.current = value
    }
    setDisplay(value)
  }, [value])

  return (
    <div style={{
      background: '#fff', borderRadius: 14, padding: '20px 24px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      transition: 'box-shadow 0.3s',
      boxShadow: pulse ? `0 0 0 4px ${color}30, 0 1px 4px rgba(0,0,0,0.06)` : '0 1px 4px rgba(0,0,0,0.06)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span style={{ color }}>{icon}</span>
        <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      </div>
      <div style={{ fontSize: 36, fontWeight: 900, color, letterSpacing: '-0.03em', transition: 'transform 0.3s', transform: pulse ? 'scale(1.08)' : 'scale(1)' }}>
        {display}
      </div>
    </div>
  )
}

/* ─── Flux d'activité ─── */
function ActivityFeed({ events }) {
  return (
    <div style={{ background: '#fff', borderRadius: 14, padding: '20px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', animation: 'pulse 1.5s infinite' }} />
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#1e293b' }}>Flux d'activité en direct</h3>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: 380, overflowY: 'auto' }}>
        {events.length === 0 ? (
          <div style={{ padding: '32px 16px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>En attente d'événements…</div>
        ) : events.map((ev, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'flex-start', gap: 12,
            padding: '10px 12px', borderRadius: 10,
            background: i === 0 ? '#f0fdf4' : 'transparent',
            transition: 'background 0.5s',
          }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>{ev.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{ev.title}</div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{ev.detail}</div>
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8', flexShrink: 0 }}>{ev.time}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Génère un événement mock ─── */
const NAMES = ['Oumar Sall', 'Ibrahima Ba', 'Fatou Diallo', 'Cheikh Fall', 'Aminata Koné']
const ZONES = ['Dakar Centre', 'Plateau', 'Parcelles', 'Guédiawaye', 'Almadies']
function makeEvent() {
  const types = [
    () => ({ icon: '✅', title: `Course terminée — ${NAMES[Math.floor(Math.random() * NAMES.length)]}`, detail: `${ZONES[Math.floor(Math.random() * ZONES.length)]} → ${ZONES[Math.floor(Math.random() * ZONES.length)]}`, time: 'À l\'instant' }),
    () => ({ icon: '🚗', title: `Nouveau conducteur en ligne`, detail: `${NAMES[Math.floor(Math.random() * NAMES.length)]} · ${ZONES[Math.floor(Math.random() * ZONES.length)]}`, time: 'À l\'instant' }),
    () => ({ icon: '❌', title: `Course annulée`, detail: `Raison : conducteur trop loin`, time: 'À l\'instant' }),
    () => ({ icon: '💸', title: `Demande de retrait soumise`, detail: `${(Math.random() * 50000 + 5000).toFixed(0)} FCFA`, time: 'À l\'instant' }),
    () => ({ icon: '🚨', title: `Alerte SOS reçue`, detail: `${ZONES[Math.floor(Math.random() * ZONES.length)]}`, time: 'À l\'instant' }),
  ]
  return types[Math.floor(Math.random() * types.length)]()
}

/* ════════════════════════════════════
   Page Live
════════════════════════════════════ */
export default function LiveDashboardPage() {
  const [onlineDrivers, setOnlineDrivers] = useState(0)
  const [activeRides, setActiveRides] = useState(0)
  const [onlineUsers, setOnlineUsers] = useState(0)
  const [events, setEvents] = useState([])
  const [connected, setConnected] = useState(false)
  const [tick, setTick] = useState(0)

  // Simulation : données initiales
  useEffect(() => {
    setOnlineDrivers(Math.floor(Math.random() * 12) + 5)
    setActiveRides(Math.floor(Math.random() * 8) + 2)
    setOnlineUsers(Math.floor(Math.random() * 40) + 20)
    // Seed des événements
    const seed = Array.from({ length: 6 }, (_, i) => ({
      ...makeEvent(),
      time: `il y a ${(7 - i) * 2} min`,
    }))
    setEvents(seed)
  }, [])

  // Horloge + simulation temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1)
      // Simuler des variation aléatoires
      setOnlineDrivers(d => Math.max(2, d + Math.round((Math.random() - 0.45) * 2)))
      setActiveRides(r => Math.max(0, r + Math.round((Math.random() - 0.4) * 2)))
      setOnlineUsers(u => Math.max(5, u + Math.round((Math.random() - 0.5) * 5)))

      // Ajouter un événement aléatoire
      if (Math.random() > 0.4) {
        setEvents(prev => [makeEvent(), ...prev].slice(0, 30))
      }
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Tentative de connexion Supabase Realtime
  useEffect(() => {
    try {
      const channel = supabase.channel('live-dashboard')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'rides' }, (payload) => {
          setConnected(true)
          const ev = {
            icon: payload.eventType === 'INSERT' ? '🆕' : payload.new?.status === 'completed' ? '✅' : '🔄',
            title: `Course ${payload.eventType === 'INSERT' ? 'créée' : 'mise à jour'}`,
            detail: `Statut: ${payload.new?.status ?? '—'} · ID: ${payload.new?.id?.slice(0, 8) ?? '—'}`,
            time: 'À l\'instant',
          }
          setEvents(prev => [ev, ...prev].slice(0, 30))
          if (payload.new?.status === 'accepted' || payload.eventType === 'INSERT') {
            setActiveRides(r => r + 1)
          } else if (payload.new?.status === 'completed') {
            setActiveRides(r => Math.max(0, r - 1))
          }
        })
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') setConnected(true)
        })
      return () => supabase.removeChannel(channel)
    } catch {
      // Supabase not configured
    }
  }, [])

  const now = new Date().toLocaleTimeString('fr-FR')

  return (
    <div>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }
      `}</style>

      {/* Bandeau connexion */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20,
        background: connected ? '#f0fdf4' : '#fffbeb',
        border: `1px solid ${connected ? '#86efac' : '#fde68a'}`,
        borderRadius: 10, padding: '10px 16px',
        fontSize: 13, fontWeight: 600,
        color: connected ? '#166534' : '#92400e',
      }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: connected ? '#22c55e' : '#f59e0b', animation: 'pulse 1.5s infinite' }} />
        {connected ? '🟢 Connecté à Supabase Realtime — Données en direct' : '🟡 Simulation locale — Configurez Supabase pour les données réelles'}
        <span style={{ marginLeft: 'auto', fontSize: 11, opacity: 0.7 }}>Mis à jour : {now}</span>
      </div>

      {/* Compteurs live */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
        <LiveCounter label="Conducteurs en ligne"  value={onlineDrivers} color="#22c55e" icon={<FiTruck size={18} />} />
        <LiveCounter label="Courses actives"        value={activeRides}   color="#4680ff" icon={<FiActivity size={18} />} />
        <LiveCounter label="Utilisateurs connectés" value={onlineUsers}   color="#a855f7" icon={<FiUsers size={18} />} />
      </div>

      {/* Flux d'activité */}
      <ActivityFeed events={events} />
    </div>
  )
}
