import { FiBell, FiSave } from 'react-icons/fi'
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
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f7f9fb' }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#2d3748' }}>{label}</div>
        {description && <div style={{ fontSize: 11, color: '#a0aec0' }}>{description}</div>}
      </div>
      <div style={{ width: 44, height: 22, borderRadius: 11, background: defaultChecked ? '#4680ff' : '#ddd', position: 'relative', cursor: 'pointer' }}>
        <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 2, left: defaultChecked ? 24 : 2, boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
      </div>
    </div>
  )
}

export default function PushNotificationsPage() {
  return (
    <div>
      <PageHeader title="Configuration des notifications push" icon={<FiBell />}>
        <Btn color="#2ed8a3"><FiSave size={14} /> Enregistrer</Btn>
      </PageHeader>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#2d3748', marginTop: 0, marginBottom: 16 }}>Firebase FCM</h3>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Clé serveur FCM</label>
            <input type="password" defaultValue="AAAAxxxxxxxxx" style={inputStyle} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>ID expéditeur (Sender ID)</label>
            <input defaultValue="123456789012" style={inputStyle} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Fichier google-services.json</label>
            <div style={{ border: '2px dashed #ddd', borderRadius: 8, padding: 16, textAlign: 'center', color: '#a0aec0', fontSize: 12 }}>
              Déposer le fichier ou <span style={{ color: '#4680ff', cursor: 'pointer' }}>parcourir</span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#2d3748', marginTop: 0, marginBottom: 8 }}>Notifications actives</h3>
          <ToggleRow label="Nouvelle course disponible" description="Notifier les conducteurs proches" defaultChecked={true} />
          <ToggleRow label="Course assignée" description="Notifier le conducteur assigné" defaultChecked={true} />
          <ToggleRow label="Course annulée" description="Notifier conducteur et utilisateur" defaultChecked={true} />
          <ToggleRow label="Course terminée" description="Notifier l'utilisateur" defaultChecked={true} />
          <ToggleRow label="Documents expirés" description="Rappel aux conducteurs" defaultChecked={true} />
          <ToggleRow label="Retrait traité" description="Notification au conducteur" defaultChecked={true} />
          <ToggleRow label="Promotions" description="Notifications marketing" defaultChecked={false} />
        </Card>
      </div>
    </div>
  )
}
