import { FiActivity, FiRefreshCw } from 'react-icons/fi'
import { PageHeader, Btn, Select } from '../../components/PageLayout'

const zones = [
  { name: 'Dakar Centre', activity: 95, rides: 34, color: '#ff5370' },
  { name: 'Plateau', activity: 78, rides: 22, color: '#ff8c42' },
  { name: 'Parcelles Assainies', activity: 65, rides: 18, color: '#ffb64d' },
  { name: 'Guédiawaye', activity: 45, rides: 11, color: '#4680ff' },
  { name: 'Dakar Sud', activity: 55, rides: 14, color: '#6f42c1' },
  { name: 'Thiès', activity: 30, rides: 7, color: '#2ed8a3' },
]

export default function HeatmapPage() {
  return (
    <div>
      <PageHeader title="Carte thermique" icon={<FiActivity />}>
        <Select value="Aujourd'hui" onChange={() => {}} options={["Aujourd'hui", 'Hier', 'Cette semaine', 'Ce mois']} />
        <Btn color="#4680ff"><FiRefreshCw size={14} /> Actualiser</Btn>
      </PageHeader>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        {/* Map area */}
        <div style={{
          background: '#1a1a2e',
          borderRadius: 8,
          height: 500,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        }}>
          {/* Grid overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }} />

          {/* Heat spots */}
          {zones.map((z, i) => (
            <div key={z.name} style={{
              position: 'absolute',
              top: `${15 + i * 12}%`,
              left: `${10 + (i % 3) * 30}%`,
              width: `${z.activity * 0.8}px`,
              height: `${z.activity * 0.8}px`,
              borderRadius: '50%',
              background: z.color,
              opacity: 0.4,
              filter: 'blur(20px)',
              transform: 'translate(-50%, -50%)',
            }} />
          ))}

          {/* Map label */}
          <div style={{
            position: 'absolute', bottom: 16, left: 16,
            color: 'rgba(255,255,255,0.5)',
            fontSize: 12,
          }}>
            Heatmap — Dakar, Sénégal
          </div>

          {/* Legend */}
          <div style={{
            position: 'absolute', top: 16, right: 16,
            background: 'rgba(0,0,0,0.6)',
            borderRadius: 8,
            padding: '10px 14px',
          }}>
            <div style={{ fontSize: 11, color: '#fff', fontWeight: 600, marginBottom: 8 }}>Intensité</div>
            <div style={{
              width: 120,
              height: 8,
              borderRadius: 4,
              background: 'linear-gradient(to right, #2ed8a3, #ffb64d, #ff5370)',
            }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ fontSize: 10, color: '#a0aec0' }}>Faible</span>
              <span style={{ fontSize: 10, color: '#a0aec0' }}>Élevé</span>
            </div>
          </div>
        </div>

        {/* Zone stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ background: '#fff', borderRadius: 8, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#2d3748', margin: '0 0 12px 0' }}>Activité par zone</h3>
            {zones.map(z => (
              <div key={z.name} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: '#4a5568', fontWeight: 600 }}>{z.name}</span>
                  <span style={{ fontSize: 12, color: z.color, fontWeight: 700 }}>{z.rides} courses</span>
                </div>
                <div style={{ height: 6, background: '#f0f0f0', borderRadius: 3 }}>
                  <div style={{ height: '100%', width: `${z.activity}%`, background: z.color, borderRadius: 3, transition: 'width 0.3s' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
