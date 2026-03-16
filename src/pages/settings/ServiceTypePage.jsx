import { FiGrid, FiSave } from 'react-icons/fi'
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

function ToggleRow({ label, defaultChecked }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f7f9fb' }}>
      <span style={{ fontSize: 13, color: '#2d3748' }}>{label}</span>
      <div style={{
        width: 44, height: 22, borderRadius: 11,
        background: defaultChecked ? '#4680ff' : '#ddd',
        position: 'relative', cursor: 'pointer', flexShrink: 0,
      }}>
        <div style={{
          width: 18, height: 18, borderRadius: '50%', background: '#fff',
          position: 'absolute', top: 2, left: defaultChecked ? 24 : 2,
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }} />
      </div>
    </div>
  )
}

export default function ServiceTypePage() {
  return (
    <div>
      <PageHeader title="Configuration des types de service" icon={<FiGrid />}>
        <Btn color="#2ed8a3"><FiSave size={14} /> Enregistrer</Btn>
      </PageHeader>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#2d3748', marginTop: 0, marginBottom: 16 }}>Moto Taxi</h3>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Nombre max de passagers</label>
            <input type="number" defaultValue={1} style={inputStyle} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Distance max (km)</label>
            <input type="number" defaultValue={50} style={inputStyle} />
          </div>
          <ToggleRow label="Service actif" defaultChecked={true} />
          <ToggleRow label="Réservation à l'avance" defaultChecked={true} />
        </Card>

        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#2d3748', marginTop: 0, marginBottom: 16 }}>Livraison</h3>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Poids maximum (kg)</label>
            <input type="number" defaultValue={20} style={inputStyle} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Distance max (km)</label>
            <input type="number" defaultValue={100} style={inputStyle} />
          </div>
          <ToggleRow label="Service actif" defaultChecked={true} />
          <ToggleRow label="Suivi en temps réel" defaultChecked={true} />
        </Card>
      </div>
    </div>
  )
}
