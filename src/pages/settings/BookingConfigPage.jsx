import { FiCalendar, FiSave } from 'react-icons/fi'
import { PageHeader, Btn, Card } from '../../components/PageLayout'

const inputStyle = {
  width: '100%',
  padding: '8px 12px',
  border: '1px solid #ddd',
  borderRadius: 5,
  fontSize: 13,
  color: '#4a5568',
  outline: 'none',
  boxSizing: 'border-box',
}

const labelStyle = {
  display: 'block',
  fontSize: 12,
  fontWeight: 600,
  color: '#4a5568',
  marginBottom: 5,
}

function ToggleRow({ label, description, defaultChecked }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f7f9fb' }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#2d3748' }}>{label}</div>
        {description && <div style={{ fontSize: 11, color: '#a0aec0', marginTop: 2 }}>{description}</div>}
      </div>
      <div style={{
        width: 44, height: 22, borderRadius: 11,
        background: defaultChecked ? '#4680ff' : '#ddd',
        position: 'relative', cursor: 'pointer', flexShrink: 0,
      }}>
        <div style={{
          width: 18, height: 18, borderRadius: '50%', background: '#fff',
          position: 'absolute', top: 2,
          left: defaultChecked ? 24 : 2,
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          transition: 'left 0.2s',
        }} />
      </div>
    </div>
  )
}

export default function BookingConfigPage() {
  return (
    <div>
      <PageHeader title="Configuration des réservations" icon={<FiCalendar />}>
        <Btn color="#2ed8a3"><FiSave size={14} /> Enregistrer</Btn>
      </PageHeader>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#2d3748', marginTop: 0, marginBottom: 16 }}>Paramètres de base</h3>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Rayon de recherche conducteur (km)</label>
            <input type="number" defaultValue={5} style={inputStyle} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Délai d'attente max (minutes)</label>
            <input type="number" defaultValue={10} style={inputStyle} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Tentatives de dispatch auto</label>
            <input type="number" defaultValue={3} style={inputStyle} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Distance min entre départ/arrivée (km)</label>
            <input type="number" defaultValue={0.5} step={0.1} style={inputStyle} />
          </div>
        </Card>

        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#2d3748', marginTop: 0, marginBottom: 8 }}>Options</h3>
          <ToggleRow label="Réservation programmée" description="Permettre aux utilisateurs de planifier des courses" defaultChecked={true} />
          <ToggleRow label="Course partagée" description="Permettre aux utilisateurs de partager une course" defaultChecked={false} />
          <ToggleRow label="Annulation gratuite" description="Annulation sans frais dans les 2 premières minutes" defaultChecked={true} />
          <ToggleRow label="Dispatch automatique" description="Assigner automatiquement le conducteur le plus proche" defaultChecked={true} />
          <ToggleRow label="Tarification dynamique" description="Appliquer un multiplicateur en heure de pointe" defaultChecked={false} />
        </Card>
      </div>
    </div>
  )
}
