import { useState, useEffect } from 'react'
import { FiShield } from 'react-icons/fi'

const PURPLE_GRADIENT = 'linear-gradient(135deg, #6b21a8 0%, #a855f7 50%, #c084fc 100%)'

export default function DriverSplashScreen({ onComplete }) {
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    // Afficher le bouton après 2 secondes
    const timer = setTimeout(() => setShowButton(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      style={{
        minHeight: '100vh',
        background: PURPLE_GRADIENT,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Cercles décoratifs */}
      <div
        style={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -150,
          left: -150,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)',
        }}
      />

      {/* Logo */}
      <div
        style={{
          width: 100,
          height: 100,
          borderRadius: 24,
          background: 'rgba(255,255,255,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 24,
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.3)',
          animation: 'pulse 2s infinite',
        }}
      >
        <FiShield size={50} color="#fff" />
      </div>

      {/* Titre */}
      <h1
        style={{
          color: '#fff',
          fontSize: 36,
          fontWeight: 800,
          margin: 0,
          textShadow: '0 2px 10px rgba(0,0,0,0.2)',
        }}
      >
        LiviGo
      </h1>

      <p
        style={{
          color: 'rgba(255,255,255,0.9)',
          fontSize: 16,
          marginTop: 8,
          fontWeight: 500,
        }}
      >
        Application Conducteur
      </p>

      {/* Image placeholder - jeune fille africaine */}
      <div
        style={{
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
          marginTop: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '4px solid rgba(255,255,255,0.3)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
        }}
      >
        <span style={{ fontSize: 80 }}>👧🏾</span>
      </div>

      <p
        style={{
          color: 'rgba(255,255,255,0.8)',
          fontSize: 14,
          marginTop: 16,
          textAlign: 'center',
          maxWidth: 280,
        }}
      >
        Rejoignez la communauté LiviGo et gagnez de l'argent en conduisant
      </p>

      {/* Bouton Commencer */}
      {showButton && (
        <button
          onClick={onComplete}
          style={{
            marginTop: 40,
            padding: '16px 48px',
            borderRadius: 30,
            background: '#fff',
            color: '#6b21a8',
            fontSize: 16,
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            animation: 'slideUp 0.5s ease-out',
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)'
            e.target.style.boxShadow = '0 6px 25px rgba(0,0,0,0.3)'
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)'
            e.target.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)'
          }}
        >
          Commencer
        </button>
      )}

      {/* Animation styles */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes slideUp {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
      `}</style>
    </div>
  )
}
