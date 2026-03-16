import { useState } from 'react'
import { FiUserPlus, FiSave } from 'react-icons/fi'
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

function Field({ label, type = 'text', placeholder, value, onChange, required }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={labelStyle}>{label}{required && <span style={{ color: '#ff5370' }}> *</span>}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={inputStyle}
      />
    </div>
  )
}

export default function AddDriverPage() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    countryCode: '+221',
    password: '',
    country: 'Sénégal',
    zone: '',
  })

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  return (
    <div>
      <PageHeader title="Ajouter un conducteur" icon={<FiUserPlus />}>
        <Btn color="#6c757d" outline>Annuler</Btn>
        <Btn color="#2ed8a3"><FiSave size={14} /> Enregistrer</Btn>
      </PageHeader>

      <Card>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#2d3748', marginBottom: 20, marginTop: 0 }}>
          Informations du conducteur
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
          <Field label="Prénom" placeholder="Prénom du conducteur" value={form.firstName} onChange={set('firstName')} required />
          <Field label="Nom de famille" placeholder="Nom de famille" value={form.lastName} onChange={set('lastName')} required />
          <Field label="Adresse e-mail" type="email" placeholder="email@exemple.com" value={form.email} onChange={set('email')} required />

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Numéro de téléphone <span style={{ color: '#ff5370' }}>*</span></label>
            <div style={{ display: 'flex', gap: 8 }}>
              <select
                value={form.countryCode}
                onChange={set('countryCode')}
                style={{ ...inputStyle, width: 100 }}
              >
                {['+221', '+225', '+223', '+224', '+229'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <input
                type="tel"
                placeholder="77 000 00 00"
                value={form.phone}
                onChange={set('phone')}
                style={{ ...inputStyle, flex: 1 }}
              />
            </div>
          </div>

          <Field label="Mot de passe" type="password" placeholder="Mot de passe" value={form.password} onChange={set('password')} required />

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Pays <span style={{ color: '#ff5370' }}>*</span></label>
            <select value={form.country} onChange={set('country')} style={inputStyle}>
              {['Sénégal', 'Côte d\'Ivoire', 'Mali', 'Guinée', 'Bénin'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Zone de service <span style={{ color: '#ff5370' }}>*</span></label>
            <select value={form.zone} onChange={set('zone')} style={inputStyle}>
              <option value="">Sélectionner une zone</option>
              {['Dakar Centre', 'Plateau', 'Parcelles Assainies', 'Guédiawaye', 'Dakar Sud', 'Thiès', 'Saint-Louis'].map(z => (
                <option key={z} value={z}>{z}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ marginTop: 8 }}>
          <label style={labelStyle}>Photo de profil</label>
          <div style={{
            border: '2px dashed #ddd',
            borderRadius: 8,
            padding: 30,
            textAlign: 'center',
            color: '#a0aec0',
            fontSize: 13,
          }}>
            Glisser-déposer une image ou <span style={{ color: '#4680ff', cursor: 'pointer' }}>parcourir</span>
          </div>
        </div>

        <div style={{ marginTop: 20, display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <Btn outline color="#6c757d">Annuler</Btn>
          <Btn color="#2ed8a3"><FiSave size={14} /> Enregistrer le conducteur</Btn>
        </div>
      </Card>
    </div>
  )
}
