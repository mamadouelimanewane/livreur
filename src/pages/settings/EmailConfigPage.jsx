import { FiMail, FiSave } from 'react-icons/fi'
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

export default function EmailConfigPage() {
  return (
    <div>
      <PageHeader title="Configuration des e-mails" icon={<FiMail />}>
        <Btn color="#2ed8a3"><FiSave size={14} /> Enregistrer</Btn>
        <Btn outline color="#4680ff">Tester la connexion</Btn>
      </PageHeader>

      <Card>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#2d3748', marginTop: 0, marginBottom: 20 }}>Serveur SMTP</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Pilote email</label>
            <select defaultValue="smtp" style={inputStyle}>
              <option value="smtp">SMTP</option>
              <option value="sendgrid">SendGrid</option>
              <option value="mailgun">Mailgun</option>
            </select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Hôte SMTP</label>
            <input defaultValue="smtp.gmail.com" style={inputStyle} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Port SMTP</label>
            <input type="number" defaultValue={587} style={inputStyle} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Chiffrement</label>
            <select defaultValue="tls" style={inputStyle}>
              <option value="tls">TLS</option>
              <option value="ssl">SSL</option>
              <option value="none">Aucun</option>
            </select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Nom d'utilisateur SMTP</label>
            <input defaultValue="noreply@sur.sn" style={inputStyle} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Mot de passe SMTP</label>
            <input type="password" defaultValue="••••••••" style={inputStyle} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Email expéditeur</label>
            <input defaultValue="noreply@sur.sn" style={inputStyle} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Nom expéditeur</label>
            <input defaultValue="SÛR Platform" style={inputStyle} />
          </div>
        </div>
      </Card>
    </div>
  )
}
