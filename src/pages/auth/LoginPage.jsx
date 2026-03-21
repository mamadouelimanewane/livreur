import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import { FiShield, FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiTruck } from 'react-icons/fi'

// Configuration par type d'application
const APP_CONFIG = {
  admin: {
    title: 'Panneau d\'administration',
    gradient: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)', // Bleu profond
    accentColor: '#2563eb',
    placeholder: 'admin@livigo.com',
    redirect: '/dashboard',
    icon: FiShield,
    role: 'Administrateur'
  },
  user: {
    title: 'Application Client',
    gradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', // Vert
    accentColor: '#10b981',
    placeholder: 'user@livigo.com',
    redirect: '/mobile/user',
    icon: FiUser,
    role: 'Client'
  },
  driver: {
    title: 'Application Conducteur',
    gradient: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)', // Rouge
    accentColor: '#ef4444',
    placeholder: 'driver@livigo.com',
    redirect: '/mobile/driver',
    icon: FiTruck,
    role: 'Conducteur'
  }
}

// Détecter le type d'application
const APP_TARGET = import.meta.env.VITE_APP_TARGET || 'admin'
const config = APP_CONFIG[APP_TARGET] || APP_CONFIG.admin

export default function LoginPage() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (user) return <Navigate to={config.redirect} replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Veuillez remplir tous les champs.')
      return
    }
    setLoading(true)
    try {
      await login({ email, password })
      navigate(config.redirect, { replace: true })
    } catch {
      setError('Identifiants invalides.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f4f6f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 8px 40px rgba(78,84,200,0.12)',
          width: '100%',
          maxWidth: 420,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            background: config.gradient,
            padding: '36px 40px 28px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: 'rgba(255,255,255,0.2)',
              margin: '0 auto 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <config.icon size={30} color="#fff" />
          </div>
          <h1
            style={{
              color: '#fff',
              fontSize: 26,
              fontWeight: 800,
              letterSpacing: '0.04em',
              margin: 0,
            }}
          >
            {'LiviGo'}
          </h1>
          <p
            style={{
              color: 'rgba(255,255,255,0.85)',
              fontSize: 13,
              marginTop: 6,
              fontWeight: 600,
            }}
          >
            {config.title}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '32px 40px 36px' }}>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: '#2d3748',
              marginBottom: 24,
            }}
          >
            Connexion
          </h2>

          {error && (
            <div
              style={{
                background: APP_TARGET === 'driver' ? '#fef2f2' : APP_TARGET === 'user' ? '#ecfdf5' : '#fff5f5',
                border: `1px solid ${APP_TARGET === 'driver' ? '#fecaca' : APP_TARGET === 'user' ? '#a7f3d0' : '#fed7d7'}`,
                borderRadius: 8,
                padding: '10px 14px',
                color: APP_TARGET === 'driver' ? '#dc2626' : APP_TARGET === 'user' ? '#059669' : '#c53030',
                fontSize: 13,
                marginBottom: 18,
                fontWeight: 500,
              }}
            >
              {error}
            </div>
          )}

          <div style={{ marginBottom: 18 }}>
            <label
              style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 600,
                color: '#4a5568',
                marginBottom: 6,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              Adresse e-mail
            </label>
            <div style={{ position: 'relative' }}>
              <span
                style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#999',
                }}
              >
                <FiMail size={15} />
              </span>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={config.placeholder}
                autoComplete="email"
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 38px',
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  fontSize: 14,
                  color: '#2d3748',
                  outline: 'none',
                  transition: 'border-color 0.15s',
                  boxSizing: 'border-box',
                }}
                onFocus={e => { e.target.style.borderColor = config.accentColor }}
                onBlur={e => { e.target.style.borderColor = '#e2e8f0' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 26 }}>
            <label
              style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 600,
                color: '#4a5568',
                marginBottom: 6,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              Mot de passe
            </label>
            <div style={{ position: 'relative' }}>
              <span
                style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#999',
                }}
              >
                <FiLock size={15} />
              </span>
              <input
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={'\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022'}
                autoComplete="current-password"
                style={{
                  width: '100%',
                  padding: '10px 40px 10px 38px',
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  fontSize: 14,
                  color: '#2d3748',
                  outline: 'none',
                  transition: 'border-color 0.15s',
                  boxSizing: 'border-box',
                }}
                onFocus={e => { e.target.style.borderColor = config.accentColor }}
                onBlur={e => { e.target.style.borderColor = '#e2e8f0' }}
              />
              <button
                type="button"
                onClick={() => setShowPwd(s => !s)}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#999',
                  padding: 0,
                  display: 'flex',
                }}
              >
                {showPwd ? <FiEyeOff size={15} /> : <FiEye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 10,
              background: loading ? '#a0aec0' : config.gradient,
              color: '#fff',
              fontWeight: 700,
              fontSize: 15,
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'opacity 0.15s, transform 0.1s',
              letterSpacing: '0.02em',
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = '0.92' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
          >
            {loading ? 'Connexion en cours\u2026' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )
}
