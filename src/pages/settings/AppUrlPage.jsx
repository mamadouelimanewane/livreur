import { FiLink, FiSave } from 'react-icons/fi'
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

export default function AppUrlPage() {
  return (
    <div>
      <PageHeader title="URLs de l'application" icon={<FiLink />}>
        <Btn color="#2ed8a3"><FiSave size={14} /> Enregistrer</Btn>
      </PageHeader>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#2d3748', marginTop: 0, marginBottom: 16 }}>App Utilisateur</h3>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Google Play Store</label>
                <input defaultValue="https://play.google.com/store/apps/details?id=sn.livigo.user" style={inputStyle} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Apple App Store</label>
                <input defaultValue="https://apps.apple.com/app/livigo/id123456789" style={inputStyle} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>APK Direct (Android)</label>
                <input defaultValue="https://livigo.sn/downloads/user.apk" style={inputStyle} />
          </div>
        </Card>

        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#2d3748', marginTop: 0, marginBottom: 16 }}>App Conducteur</h3>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Google Play Store</label>
                <input defaultValue="https://play.google.com/store/apps/details?id=sn.livigo.driver" style={inputStyle} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Apple App Store</label>
                <input defaultValue="https://apps.apple.com/app/livigo-driver/id987654321" style={inputStyle} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>APK Direct (Android)</label>
                <input defaultValue="https://livigo.sn/downloads/driver.apk" style={inputStyle} />
          </div>
        </Card>
      </div>
    </div>
  )
}
