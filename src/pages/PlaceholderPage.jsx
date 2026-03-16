import { FiLayers } from 'react-icons/fi'

export default function PlaceholderPage({ title = 'Page' }) {
  return (
    <div>
      {/* Breadcrumb-style header */}
      <div style={{
        background: '#fff',
        borderRadius: 12,
        padding: '20px 24px',
        marginBottom: 24,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: '#2d3748', margin: 0 }}>
            {title}
          </h1>
          <p style={{ fontSize: 12, color: '#a0aec0', marginTop: 4 }}>
            Tableau de bord / {title}
          </p>
        </div>
      </div>

      {/* Placeholder content */}
      <div style={{
        background: '#fff',
        borderRadius: 12,
        padding: '60px 24px',
        textAlign: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      }}>
        <div style={{
          width: 64,
          height: 64,
          borderRadius: 16,
          background: 'linear-gradient(135deg,#f0f4ff,#e8edff)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
        }}>
          <FiLayers size={28} color="#8f94fb" />
        </div>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#4a5568', margin: 0 }}>
          {title}
        </h2>
        <p style={{ fontSize: 13, color: '#a0aec0', marginTop: 8 }}>
          Cette section est en cours de développement.
        </p>
      </div>
    </div>
  )
}
