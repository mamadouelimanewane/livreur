import { FiCreditCard, FiSave } from 'react-icons/fi'
import { PageHeader, Btn, Card } from '../../components/PageLayout'

function ToggleRow({ label, description, defaultChecked, badge }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f7f9fb' }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#2d3748', display: 'flex', alignItems: 'center', gap: 8 }}>
          {label}
          {badge && <span style={{ fontSize: 10, background: '#e6faf4', color: '#2ed8a3', padding: '2px 6px', borderRadius: 10, fontWeight: 700 }}>{badge}</span>}
        </div>
        {description && <div style={{ fontSize: 11, color: '#a0aec0', marginTop: 2 }}>{description}</div>}
      </div>
      <div style={{ width: 44, height: 22, borderRadius: 11, background: defaultChecked ? '#4680ff' : '#ddd', position: 'relative', cursor: 'pointer' }}>
        <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 2, left: defaultChecked ? 24 : 2, boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
      </div>
    </div>
  )
}

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

const labelStyle = { display: 'block', fontSize: 12, fontWeight: 600, color: '#4a5568', marginBottom: 5 }

export default function PaymentMethodPage() {
  return (
    <div>
      <PageHeader title="Méthodes de paiement" icon={<FiCreditCard />}>
        <Btn color="#2ed8a3"><FiSave size={14} /> Enregistrer</Btn>
      </PageHeader>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#2d3748', marginTop: 0, marginBottom: 8 }}>Méthodes activées</h3>
          <ToggleRow label="Cash" description="Paiement en espèces à la livraison" defaultChecked={true} badge="Populaire" />
          <ToggleRow label="Wave" description="Mobile Money - Wave Sénégal" defaultChecked={true} badge="Populaire" />
          <ToggleRow label="Orange Money" description="Mobile Money - Orange Sénégal" defaultChecked={true} />
          <ToggleRow label="Portefeuille LiviGo" description="Solde du compte utilisateur" defaultChecked={true} />
          <ToggleRow label="Carte Bancaire" description="Visa, Mastercard via Stripe" defaultChecked={false} />
          <ToggleRow label="PayPal" description="Paiement international" defaultChecked={false} />
        </Card>

        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#2d3748', marginTop: 0, marginBottom: 16 }}>Configuration Stripe</h3>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Clé publique (Publishable Key)</label>
            <input type="text" defaultValue="pk_test_..." style={inputStyle} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Clé secrète (Secret Key)</label>
            <input type="password" defaultValue="sk_test_..." style={inputStyle} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Mode</label>
            <select defaultValue="test" style={inputStyle}>
              <option value="test">Test</option>
              <option value="live">Production</option>
            </select>
          </div>
          <div style={{ background: '#fff8ee', border: '1px solid #ffb64d', borderRadius: 6, padding: '10px 12px', fontSize: 12, color: '#7a5200' }}>
            Actuellement en mode Test. Activez le mode Production pour accepter de vrais paiements.
          </div>
        </Card>
      </div>
    </div>
  )
}
