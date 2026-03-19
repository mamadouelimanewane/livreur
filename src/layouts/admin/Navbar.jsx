import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiChevronDown, FiBell, FiLogOut,
  FiUser, FiArrowLeft, FiMaximize2, FiMinimize2,
  FiGlobe, FiSettings,
} from 'react-icons/fi'
import { useAuth } from '../../context/useAuth'
import { BRAND_GRADIENT, NAVBAR_H, SIDEBAR_W } from './constants'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [fullscreen, setFullscreen] = useState(false)
  const [userDropOpen, setUserDropOpen] = useState(false)
  const [langDropOpen, setLangDropOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const userDropRef = useRef(null)
  const langDropRef = useRef(null)
  const notifRef = useRef(null)

  useEffect(() => {
    function handler(e) {
      if (userDropRef.current && !userDropRef.current.contains(e.target)) setUserDropOpen(false)
      if (langDropRef.current && !langDropRef.current.contains(e.target)) setLangDropOpen(false)
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false)
    }

    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
      setFullscreen(true)
      return
    }

    document.exitFullscreen().catch(() => {})
    setFullscreen(false)
  }

  const initials = (user?.name ?? 'A')
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const iconBtn = {
    width: 36,
    height: 36,
    borderRadius: 8,
    background: 'transparent',
    color: '#666',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    cursor: 'pointer',
    transition: 'background 0.15s',
    position: 'relative',
  }

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: SIDEBAR_W,
        right: 0,
        height: NAVBAR_H,
        background: '#fff',
        borderBottom: '1px solid #e8ecf0',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        gap: 8,
        zIndex: 90,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      }}
    >
      <button
        title="Retour"
        onClick={() => navigate(-1)}
        style={iconBtn}
        onMouseEnter={e => { e.currentTarget.style.background = '#f0f2f5' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
      >
        <FiArrowLeft size={17} />
      </button>

      <button
        title={fullscreen ? 'Quitter le plein \u00e9cran' : 'Plein \u00e9cran'}
        onClick={toggleFullscreen}
        style={iconBtn}
        onMouseEnter={e => { e.currentTarget.style.background = '#f0f2f5' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
      >
        {fullscreen ? <FiMinimize2 size={17} /> : <FiMaximize2 size={17} />}
      </button>

      <div style={{ flex: 1 }} />

      <div ref={notifRef} style={{ position: 'relative' }}>
        <button
          title="Notifications"
          onClick={() => setNotifOpen(o => !o)}
          style={{ ...iconBtn, position: 'relative' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#f0f2f5' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
        >
          <FiBell size={18} color="#555" />
          <span
            style={{
              position: 'absolute',
              top: 5,
              right: 5,
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#ff4d4f',
              border: '2px solid #fff',
            }}
          />
        </button>

        {notifOpen && (
          <div
            style={{
              position: 'absolute',
              top: 44,
              right: 0,
              width: 300,
              background: '#fff',
              borderRadius: 10,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              border: '1px solid #e8ecf0',
              zIndex: 200,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '12px 16px',
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontWeight: 600, fontSize: 14 }}>Notifications</span>
              <span
                style={{
                  fontSize: 11,
                  background: '#ff4d4f',
                  color: '#fff',
                  borderRadius: 10,
                  padding: '2px 7px',
                }}
              >
                3
              </span>
            </div>
            {[
              { title: 'Nouveau conducteur inscrit', time: 'il y a 5 min' },
              { title: 'Demande de retrait en attente', time: 'il y a 12 min' },
              { title: 'Alerte SOS re\u00e7ue', time: 'il y a 30 min' },
            ].map((notification, index) => (
              <div
                key={index}
                style={{
                  padding: '11px 16px',
                  borderBottom: index < 2 ? '1px solid #f5f5f5' : 'none',
                  cursor: 'pointer',
                  transition: 'background 0.12s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#fafbfc' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}
              >
                <div style={{ fontSize: 13, fontWeight: 500 }}>{notification.title}</div>
                <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>{notification.time}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div ref={langDropRef} style={{ position: 'relative' }}>
        <button
          onClick={() => setLangDropOpen(o => !o)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 10px',
            borderRadius: 8,
            background: 'transparent',
            border: '1px solid #e8ecf0',
            cursor: 'pointer',
            color: '#444',
            fontSize: 13,
            fontWeight: 500,
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#f5f6f8' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
        >
          <FiGlobe size={14} color="#666" />
          <span>{'Fran\u00e7ais'}</span>
          <FiChevronDown
            size={13}
            color="#999"
            style={{
              transition: 'transform 0.2s',
              transform: langDropOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
        </button>

        {langDropOpen && (
          <div
            style={{
              position: 'absolute',
              top: 44,
              right: 0,
              background: '#fff',
              borderRadius: 10,
              boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
              border: '1px solid #e8ecf0',
              zIndex: 200,
              minWidth: 140,
              overflow: 'hidden',
            }}
          >
            {[
              { code: 'fr', label: 'Fran\u00e7ais', active: true },
              { code: 'en', label: 'English', active: false },
              { code: 'ar', label: '\u0627\u0644\u0639\u0631\u0628\u064a\u0629', active: false },
            ].map(lang => (
              <button
                key={lang.code}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '9px 16px',
                  textAlign: 'left',
                  fontSize: 13,
                  fontWeight: lang.active ? 600 : 400,
                  color: lang.active ? '#4680ff' : '#444',
                  background: lang.active ? '#f0f4ff' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background 0.12s',
                }}
                onMouseEnter={e => { if (!lang.active) e.currentTarget.style.background = '#f5f6f8' }}
                onMouseLeave={e => { if (!lang.active) e.currentTarget.style.background = 'transparent' }}
              >
                {lang.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={{ width: 1, height: 24, background: '#e8ecf0' }} />

      <div ref={userDropRef} style={{ position: 'relative' }}>
        <button
          onClick={() => setUserDropOpen(o => !o)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '4px 8px',
            borderRadius: 8,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#f5f6f8' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: BRAND_GRADIENT,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 13,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#2d3748', lineHeight: 1.2 }}>
              {user?.name ?? 'Admin'}
            </div>
            <div style={{ fontSize: 11, color: '#999' }}>
              {user?.role ?? 'superadmin'}
            </div>
          </div>
          <FiChevronDown
            size={13}
            color="#999"
            style={{
              transition: 'transform 0.2s',
              transform: userDropOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
        </button>

        {userDropOpen && (
          <div
            style={{
              position: 'absolute',
              top: 46,
              right: 0,
              background: '#fff',
              borderRadius: 10,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              border: '1px solid #e8ecf0',
              zIndex: 200,
              minWidth: 190,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '14px 16px',
                borderBottom: '1px solid #f0f0f0',
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600 }}>{user?.name}</div>
              <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>{user?.email}</div>
            </div>

            {[
              { icon: <FiUser size={14} />, label: 'Mon profil', action: () => navigate('/settings/admins') },
              { icon: <FiSettings size={14} />, label: 'Param\u00e8tres', action: () => navigate('/settings/general') },
            ].map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.action()
                  setUserDropOpen(false)
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  width: '100%',
                  padding: '10px 16px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: 13,
                  color: '#444',
                  transition: 'background 0.12s',
                  textAlign: 'left',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#f5f6f8' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
              >
                <span style={{ color: '#888' }}>{item.icon}</span>
                {item.label}
              </button>
            ))}

            <div style={{ borderTop: '1px solid #f0f0f0' }}>
              <button
                onClick={() => {
                  logout()
                  navigate('/login')
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  width: '100%',
                  padding: '10px 16px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: 13,
                  color: '#ff4d4f',
                  transition: 'background 0.12s',
                  textAlign: 'left',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#fff1f0' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
              >
                <FiLogOut size={14} />
                {'D\u00e9connexion'}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
