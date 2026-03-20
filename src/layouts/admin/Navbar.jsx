import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiChevronDown, FiBell, FiLogOut,
  FiUser, FiArrowLeft, FiMaximize2, FiMinimize2,
  FiGlobe, FiSettings, FiSearch, FiX, FiMoon, FiSun,
} from 'react-icons/fi'
import { useAuth } from '../../context/useAuth'
import { BRAND_GRADIENT, NAVBAR_H, SIDEBAR_W } from './constants'
import { getAdminNotifications, subscribeToAdminAlerts } from '../../services/api/notificationsService'

/* ─── Couleurs type notification ─── */
const NOTIF_COLORS = {
  danger:  { bg: '#fff0f3', border: '#ffcdd5', text: '#c53030' },
  warning: { bg: '#fff8ee', border: '#ffd77a', text: '#7a5200' },
  info:    { bg: '#ebf4ff', border: '#bed4ff', text: '#1d4ed8' },
}

/* ─── Données pour la recherche globale (simulées) ─── */
const SEARCH_ROUTES = [
  { label: 'Tableau de bord',                path: '/dashboard',                   section: 'Navigation' },
  { label: 'Tous les conducteurs',            path: '/drivers/all',                 section: 'Conducteurs' },
  { label: 'Conducteurs en attente',          path: '/drivers/pending',             section: 'Conducteurs' },
  { label: 'Carte des conducteurs',           path: '/drivers/map',                 section: 'Conducteurs' },
  { label: 'Courses taxi actives',            path: '/taxi/rides/active',           section: 'Taxi' },
  { label: 'Toutes les courses taxi',         path: '/taxi/rides/all',              section: 'Taxi' },
  { label: 'Livraisons actives',              path: '/delivery/rides/active',       section: 'Livraison' },
  { label: 'Dispatch manuel',                 path: '/dispatch/manual',             section: 'Dispatch' },
  { label: 'Service client',                  path: '/support/customer-service',    section: 'Support' },
  { label: 'Alertes SOS',                     path: '/support/sos-requests',        section: 'Support' },
  { label: 'Demandes de retrait',             path: '/transactions/cashout',        section: 'Transactions' },
  { label: 'Rapports financiers',             path: '/reports/financial',           section: 'Rapports' },
  { label: 'Rapports opérationnels',          path: '/reports/operations',          section: 'Rapports' },
  { label: 'Rapport conducteurs',             path: '/reports/drivers',             section: 'Rapports' },
  { label: 'Tableau de bord live',            path: '/reports/live',                section: 'Rapports' },
  { label: 'Paramètres généraux',             path: '/settings/general',            section: 'Paramètres' },
  { label: 'Méthodes de paiement',            path: '/settings/payment-method',     section: 'Paramètres' },
  { label: 'Codes promo',                     path: '/setup/promo-codes',           section: 'Setup' },
  { label: 'Zones de service',                path: '/setup/zones',                 section: 'Setup' },
  { label: 'Grilles tarifaires',              path: '/setup/pricecards',            section: 'Setup' },
]

/* ─── Barre de Recherche Globale ─── */
function GlobalSearch({ onClose }) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const inputRef = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const results = query.length >= 2
    ? SEARCH_ROUTES.filter(r =>
        r.label.toLowerCase().includes(query.toLowerCase()) ||
        r.section.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : []

  const handleSelect = (path) => { navigate(path); onClose() }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      paddingTop: 80,
    }} onClick={onClose}>
      <div style={{
        background: '#fff', borderRadius: 16, width: 560, maxWidth: '90vw',
        boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
        overflow: 'hidden',
      }} onClick={e => e.stopPropagation()}>
        {/* Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
          <FiSearch size={20} color="#94a3b8" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Rechercher une page, un conducteur, une course…"
            style={{ border: 'none', outline: 'none', flex: 1, fontSize: 15, color: '#1e293b' }}
          />
          <kbd style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 6, padding: '2px 8px', fontSize: 11, color: '#64748b' }}>Échap</kbd>
        </div>

        {/* Résultats */}
        {results.length > 0 && (
          <div style={{ maxHeight: 360, overflowY: 'auto' }}>
            {results.map((r, i) => (
              <button key={i} onClick={() => handleSelect(r.path)} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                width: '100%', padding: '12px 20px', border: 'none', background: 'transparent',
                cursor: 'pointer', textAlign: 'left', transition: 'background 0.1s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
              >
                <span style={{ fontSize: 14, color: '#1e293b', fontWeight: 500 }}>{r.label}</span>
                <span style={{ fontSize: 11, color: '#94a3b8', background: '#f1f5f9', padding: '2px 8px', borderRadius: 10 }}>{r.section}</span>
              </button>
            ))}
          </div>
        )}

        {query.length >= 2 && results.length === 0 && (
          <div style={{ padding: 32, textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
            Aucun résultat pour « {query} »
          </div>
        )}

        {query.length < 2 && (
          <div style={{ padding: '12px 20px 16px' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Accès rapides</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {[
                { label: 'Dashboard', path: '/dashboard' },
                { label: 'Conducteurs', path: '/drivers/all' },
                { label: 'Dispatch', path: '/dispatch/manual' },
                { label: 'Rapports', path: '/reports/financial' },
              ].map((s, i) => (
                <button key={i} onClick={() => handleSelect(s.path)} style={{
                  padding: '6px 14px', borderRadius: 20, border: '1px solid #e2e8f0',
                  background: '#f8fafc', fontSize: 13, cursor: 'pointer', color: '#475569', fontWeight: 500,
                }}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ════════════════════════════════════
   Composant Navbar principal
════════════════════════════════════ */
export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [fullscreen, setFullscreen] = useState(false)
  const [userDropOpen, setUserDropOpen] = useState(false)
  const [langDropOpen, setLangDropOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('livi_dark') === '1')

  // Notifications
  const [notifications, setNotifications] = useState([])
  const [notifLoading, setNotifLoading] = useState(true)

  const userDropRef = useRef(null)
  const langDropRef = useRef(null)
  const notifRef    = useRef(null)

  // Fermeture des dropdowns au clic extérieur
  useEffect(() => {
    const handler = (e) => {
      if (userDropRef.current && !userDropRef.current.contains(e.target)) setUserDropOpen(false)
      if (langDropRef.current && !langDropRef.current.contains(e.target)) setLangDropOpen(false)
      if (notifRef.current    && !notifRef.current.contains(e.target))    setNotifOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Raccourci Ctrl+K → Recherche globale
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  // Chargement des notifications
  useEffect(() => {
    let mounted = true
    setNotifLoading(true)
    getAdminNotifications()
      .then(data => { if (mounted) setNotifications(data) })
      .finally(() => { if (mounted) setNotifLoading(false) })

    const cleanup = subscribeToAdminAlerts((newNotif) => {
      setNotifications(prev => [newNotif, ...prev].slice(0, 10))
    })
    return () => { mounted = false; cleanup() }
  }, [])

  // Dark mode
  useEffect(() => {
    document.body.style.setProperty('--livi-bg', darkMode ? '#0f1117' : '#f4f6f9')
    document.body.style.setProperty('--livi-card', darkMode ? '#1a1d2e' : '#ffffff')
    document.body.style.background = darkMode ? '#0f1117' : '#f4f6f9'
    localStorage.setItem('livi_dark', darkMode ? '1' : '0')
  }, [darkMode])

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
      setFullscreen(true)
    } else {
      document.exitFullscreen().catch(() => {})
      setFullscreen(false)
    }
  }

  const initials = (user?.name ?? 'A').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  const unreadCount = notifications.length

  const iconBtn = {
    width: 36, height: 36, borderRadius: 8,
    background: 'transparent', color: '#666',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    border: 'none', cursor: 'pointer', transition: 'background 0.15s',
    position: 'relative',
  }

  return (
    <>
      {searchOpen && <GlobalSearch onClose={() => setSearchOpen(false)} />}

      <header style={{
        position: 'fixed', top: 0, left: SIDEBAR_W, right: 0,
        height: NAVBAR_H, background: '#fff',
        borderBottom: '1px solid #e8ecf0',
        display: 'flex', alignItems: 'center',
        padding: '0 20px', gap: 8, zIndex: 90,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      }}>
        {/* Retour */}
        <button title="Retour" onClick={() => navigate(-1)} style={iconBtn}
          onMouseEnter={e => { e.currentTarget.style.background = '#f0f2f5' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
        >
          <FiArrowLeft size={17} />
        </button>

        {/* Plein écran */}
        <button title={fullscreen ? 'Quitter plein écran' : 'Plein écran'} onClick={toggleFullscreen} style={iconBtn}
          onMouseEnter={e => { e.currentTarget.style.background = '#f0f2f5' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
        >
          {fullscreen ? <FiMinimize2 size={17} /> : <FiMaximize2 size={17} />}
        </button>

        {/* Barre de recherche cliquable */}
        <button onClick={() => setSearchOpen(true)} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '7px 16px', borderRadius: 8,
          border: '1px solid #e8ecf0', background: '#f8fafc',
          cursor: 'pointer', color: '#94a3b8', fontSize: 13,
          transition: 'all 0.2s', minWidth: 220,
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#4680ff'; e.currentTarget.style.background = '#fff' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8ecf0'; e.currentTarget.style.background = '#f8fafc' }}
        >
          <FiSearch size={14} />
          <span style={{ flex: 1, textAlign: 'left' }}>Rechercher…</span>
          <kbd style={{ background: '#e2e8f0', borderRadius: 4, padding: '1px 6px', fontSize: 10, color: '#64748b' }}>Ctrl K</kbd>
        </button>

        <div style={{ flex: 1 }} />

        {/* Dark mode toggle */}
        <button title={darkMode ? 'Mode clair' : 'Mode sombre'} onClick={() => setDarkMode(d => !d)} style={iconBtn}
          onMouseEnter={e => { e.currentTarget.style.background = '#f0f2f5' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
        >
          {darkMode ? <FiSun size={17} color="#f59e0b" /> : <FiMoon size={17} />}
        </button>

        {/* Notifications */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button title="Notifications" onClick={() => setNotifOpen(o => !o)}
            style={{ ...iconBtn, position: 'relative' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#f0f2f5' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
          >
            <FiBell size={18} color="#555" />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: 4, right: 4,
                minWidth: 16, height: 16, borderRadius: 8,
                background: '#ff4d4f', border: '2px solid #fff',
                fontSize: 10, fontWeight: 700, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '0 3px',
              }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div style={{
              position: 'absolute', top: 44, right: 0, width: 340,
              background: '#fff', borderRadius: 14,
              boxShadow: '0 8px 32px rgba(0,0,0,0.14)',
              border: '1px solid #e8ecf0', zIndex: 200, overflow: 'hidden',
            }}>
              <div style={{
                padding: '14px 18px', borderBottom: '1px solid #f0f0f0',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span style={{ fontWeight: 700, fontSize: 14, color: '#1e293b' }}>Notifications</span>
                {unreadCount > 0 && (
                  <span style={{ fontSize: 11, background: '#ff4d4f', color: '#fff', borderRadius: 10, padding: '2px 8px', fontWeight: 600 }}>
                    {unreadCount}
                  </span>
                )}
              </div>

              {notifLoading ? (
                <div style={{ padding: 24, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>Chargement…</div>
              ) : notifications.length === 0 ? (
                <div style={{ padding: 32, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
                  <FiBell size={32} style={{ opacity: 0.2, display: 'block', margin: '0 auto 8px' }} />
                  Aucune notification
                </div>
              ) : (
                <>
                  {notifications.map((n, i) => {
                    const c = NOTIF_COLORS[n.type] || NOTIF_COLORS.info
                    return (
                      <div key={n.id}
                        onClick={() => { navigate(n.link); setNotifOpen(false) }}
                        style={{
                          padding: '13px 18px',
                          borderBottom: i < notifications.length - 1 ? '1px solid #f5f5f5' : 'none',
                          cursor: 'pointer', transition: 'background 0.12s',
                          borderLeft: `3px solid ${c.text}`,
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = c.bg }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                          <span style={{ fontSize: 18, lineHeight: 1 }}>{n.icon}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', lineHeight: 1.4 }}>{n.title}</div>
                            <div style={{ fontSize: 11, color: n.type === 'danger' ? '#ef4444' : '#94a3b8', marginTop: 3, fontWeight: n.type === 'danger' ? 700 : 400 }}>{n.time}</div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  <div style={{ padding: '10px 18px', borderTop: '1px solid #f0f0f0' }}>
                    <button onClick={() => { navigate('/support/customer-service'); setNotifOpen(false) }}
                      style={{ width: '100%', padding: '8px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer', fontSize: 12, color: '#4680ff', fontWeight: 600 }}>
                      Voir tout
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Langue */}
        <div ref={langDropRef} style={{ position: 'relative' }}>
          <button onClick={() => setLangDropOpen(o => !o)} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 10px', borderRadius: 8, background: 'transparent',
            border: '1px solid #e8ecf0', cursor: 'pointer', color: '#444',
            fontSize: 13, fontWeight: 500, transition: 'background 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#f5f6f8' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
          >
            <FiGlobe size={14} color="#666" />
            <span>Français</span>
            <FiChevronDown size={13} color="#999" style={{ transition: 'transform 0.2s', transform: langDropOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
          </button>

          {langDropOpen && (
            <div style={{
              position: 'absolute', top: 44, right: 0, background: '#fff',
              borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
              border: '1px solid #e8ecf0', zIndex: 200, minWidth: 140, overflow: 'hidden',
            }}>
              {[
                { code: 'fr', label: 'Français', active: true },
                { code: 'en', label: 'English', active: false },
                { code: 'wo', label: 'Wolof', active: false },
              ].map(lang => (
                <button key={lang.code} style={{
                  display: 'block', width: '100%', padding: '9px 16px', textAlign: 'left',
                  fontSize: 13, fontWeight: lang.active ? 600 : 400,
                  color: lang.active ? '#4680ff' : '#444',
                  background: lang.active ? '#f0f4ff' : 'transparent',
                  border: 'none', cursor: 'pointer', transition: 'background 0.12s',
                }}>
                  {lang.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{ width: 1, height: 24, background: '#e8ecf0' }} />

        {/* Menu utilisateur */}
        <div ref={userDropRef} style={{ position: 'relative' }}>
          <button onClick={() => setUserDropOpen(o => !o)} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px',
            borderRadius: 8, background: 'transparent', border: 'none',
            cursor: 'pointer', transition: 'background 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#f5f6f8' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
          >
            <div style={{
              width: 34, height: 34, borderRadius: '50%', background: BRAND_GRADIENT,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 13, fontWeight: 700, flexShrink: 0,
            }}>
              {initials}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#2d3748', lineHeight: 1.2 }}>{user?.name ?? 'Admin'}</div>
              <div style={{ fontSize: 11, color: '#999' }}>{user?.role ?? 'superadmin'}</div>
            </div>
            <FiChevronDown size={13} color="#999" style={{ transition: 'transform 0.2s', transform: userDropOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
          </button>

          {userDropOpen && (
            <div style={{
              position: 'absolute', top: 46, right: 0, background: '#fff',
              borderRadius: 10, boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              border: '1px solid #e8ecf0', zIndex: 200, minWidth: 200, overflow: 'hidden',
            }}>
              <div style={{ padding: '14px 16px', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{user?.name}</div>
                <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>{user?.email}</div>
              </div>

              {[
                { icon: <FiUser size={14} />, label: 'Mon profil', action: () => navigate('/settings/admins') },
                { icon: <FiSettings size={14} />, label: 'Paramètres', action: () => navigate('/settings/general') },
              ].map((item, i) => (
                <button key={i} onClick={() => { item.action(); setUserDropOpen(false) }} style={{
                  display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                  padding: '10px 16px', border: 'none', background: 'transparent',
                  cursor: 'pointer', fontSize: 13, color: '#444', transition: 'background 0.12s', textAlign: 'left',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#f5f6f8' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                >
                  <span style={{ color: '#888' }}>{item.icon}</span>
                  {item.label}
                </button>
              ))}

              <div style={{ borderTop: '1px solid #f0f0f0' }}>
                <button onClick={() => { logout(); navigate('/login') }} style={{
                  display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                  padding: '10px 16px', border: 'none', background: 'transparent',
                  cursor: 'pointer', fontSize: 13, color: '#ff4d4f', transition: 'background 0.12s', textAlign: 'left',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#fff1f0' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                >
                  <FiLogOut size={14} />
                  Déconnexion
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  )
}
