import { useState } from 'react'
import { FiSettings, FiSave } from 'react-icons/fi'
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

const tabs = ['Général', 'Monnaie', 'Email', 'Sécurité', 'Maintenance']

export default function GeneralSettingsPage() {
  const [activeTab, setActiveTab] = useState('Général')

  return (
    <div>
      <PageHeader title="Paramètres généraux" icon={<FiSettings />}>
        <Btn color="#2ed8a3"><FiSave size={14} /> Enregistrer</Btn>
      </PageHeader>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 16, background: '#fff', borderRadius: 8, padding: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{
            padding: '8px 16px',
            border: 'none',
            borderRadius: 6,
            background: activeTab === t ? '#4680ff' : 'transparent',
            color: activeTab === t ? '#fff' : '#718096',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
          }}>{t}</button>
        ))}
      </div>

      {activeTab === 'Général' && (
        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#2d3748', marginTop: 0, marginBottom: 20 }}>Configuration générale</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Nom de la plateforme</label>
              <input defaultValue="SÛR" style={inputStyle} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Email de contact</label>
              <input defaultValue="contact@sur.sn" style={inputStyle} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Téléphone de contact</label>
              <input defaultValue="+221 33 820 00 00" style={inputStyle} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Site web</label>
              <input defaultValue="https://sur.sn" style={inputStyle} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Fuseau horaire</label>
              <select defaultValue="Africa/Dakar" style={inputStyle}>
                <option value="Africa/Dakar">Africa/Dakar (GMT+0)</option>
                <option value="Africa/Abidjan">Africa/Abidjan</option>
                <option value="Europe/Paris">Europe/Paris</option>
              </select>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Langue par défaut</label>
              <select defaultValue="fr" style={inputStyle}>
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="wo">Wolof</option>
              </select>
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Adresse du siège</label>
            <input defaultValue="Dakar, Sénégal" style={inputStyle} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Logo de la plateforme</label>
            <div style={{ border: '2px dashed #ddd', borderRadius: 8, padding: 20, textAlign: 'center', color: '#a0aec0', fontSize: 13 }}>
              Glisser-déposer le logo ou <span style={{ color: '#4680ff', cursor: 'pointer' }}>parcourir</span>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'Monnaie' && (
        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#2d3748', marginTop: 0, marginBottom: 20 }}>Configuration monétaire</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Devise</label>
              <input defaultValue="FCFA" style={inputStyle} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Symbole</label>
              <input defaultValue="CFA" style={inputStyle} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Position du symbole</label>
              <select defaultValue="after" style={inputStyle}>
                <option value="before">Avant le montant</option>
                <option value="after">Après le montant</option>
              </select>
            </div>
          </div>
        </Card>
      )}

      {activeTab !== 'Général' && activeTab !== 'Monnaie' && (
        <Card>
          <p style={{ color: '#718096', fontSize: 13 }}>Paramètres de la section "{activeTab}" — à configurer</p>
        </Card>
      )}
    </div>
  )
}
