import { FiTruck, FiSave } from 'react-icons/fi'
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
        }} />
      </div>
    </div>
  )
}

export default function DriverConfigPage() {
  return (
    <div>
      <PageHeader title="Configuration du conducteur" icon={<FiTruck />}>
        <Btn color="#2ed8a3"><FiSave size={14} /> Enregistrer</Btn>
      </PageHeader>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#2d3748', marginTop: 0, marginBottom: 16 }}>Commissions</h3>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Commission plateforme (%)</label>
            <input type="number" defaultValue={20} style={inputStyle} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Bonus première course (FCFA)</label>
            <input type="number" defaultValue={0} style={inputStyle} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Montant minimum de retrait (FCFA)</label>
            <input type="number" defaultValue={5000} style={inputStyle} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Délai de retrait (jours ouvrables)</label>
            <input type="number" defaultValue={2} style={inputStyle} />
          </div>
        </Card>

        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#2d3748', marginTop: 0, marginBottom: 8 }}>Options conducteur</h3>
          <ToggleRow label="Approbation manuelle requise" description="Approuver manuellement chaque nouveau conducteur" defaultChecked={true} />
          <ToggleRow label="Vérification des documents" description="Vérifier les documents avant d'activer le compte" defaultChecked={true} />
          <ToggleRow label="Conducteur peut choisir ses zones" description="Permettre au conducteur de sélectionner ses zones" defaultChecked={false} />
          <ToggleRow label="Chat en course" description="Permettre la messagerie conducteur/client pendant la course" defaultChecked={true} />
          <ToggleRow label="Appel masqué" description="Masquer les vrais numéros lors des appels" defaultChecked={true} />
        </Card>
      </div>
    </div>
  )
}
