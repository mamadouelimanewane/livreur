import { useState } from 'react'
import { FiMail, FiSave, FiEdit } from 'react-icons/fi'
import { PageHeader, Btn, Badge } from '../../components/PageLayout'

const templates = [
  { id: 'TPL-001', name: 'Bienvenue - Utilisateur', subject: 'Bienvenue sur LiviGo!', trigger: 'Inscription', status: 'Actif' },
  { id: 'TPL-002', name: 'Bienvenue - Conducteur', subject: 'Votre compte conducteur LiviGo', trigger: 'Inscription conducteur', status: 'Actif' },
  { id: 'TPL-003', name: 'Réinitialisation mot de passe', subject: 'Réinitialisez votre mot de passe', trigger: 'Demande reset', status: 'Actif' },
  { id: 'TPL-004', name: 'Course terminée', subject: 'Votre course a été complétée', trigger: 'Fin de course', status: 'Actif' },
  { id: 'TPL-005', name: 'Documents approuvés', subject: 'Vos documents ont été approuvés', trigger: 'Approbation docs', status: 'Actif' },
  { id: 'TPL-006', name: 'Retrait traité', subject: 'Votre demande de retrait a été traitée', trigger: 'Cashout', status: 'Inactif' },
]

export default function EmailTemplatePage() {
  const [selected, setSelected] = useState(templates[0])

  return (
    <div>
      <PageHeader title="Modèles d'e-mail" icon={<FiMail />}>
        <Btn color="#2ed8a3"><FiSave size={14} /> Enregistrer</Btn>
      </PageHeader>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 16 }}>
        <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <div style={{ padding: '12px 14px', background: '#f6f7fb', fontSize: 12, fontWeight: 700, color: '#718096', borderBottom: '1px solid #edf2f7' }}>
            MODÈLES
          </div>
          {templates.map(t => (
            <div key={t.id} onClick={() => setSelected(t)} style={{
              padding: '12px 14px',
              cursor: 'pointer',
              borderBottom: '1px solid #f7f9fb',
              background: selected.id === t.id ? '#ebf4ff' : 'transparent',
              borderLeft: selected.id === t.id ? '3px solid #4680ff' : '3px solid transparent',
            }}>
              <div style={{ fontSize: 13, fontWeight: selected.id === t.id ? 700 : 400, color: selected.id === t.id ? '#4680ff' : '#2d3748' }}>{t.name}</div>
              <div style={{ fontSize: 11, color: '#a0aec0', marginTop: 2 }}>{t.trigger}</div>
            </div>
          ))}
        </div>

        <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: '#2d3748', margin: 0 }}>{selected.name}</h2>
              <div style={{ fontSize: 11, color: '#a0aec0', marginTop: 2 }}>Déclencheur: {selected.trigger}</div>
            </div>
            <Badge color={selected.status === 'Actif' ? '#2ed8a3' : '#718096'} bg={selected.status === 'Actif' ? '#e6faf4' : '#f7f9fb'}>{selected.status}</Badge>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#4a5568', marginBottom: 5 }}>Sujet de l'e-mail</label>
            <input defaultValue={selected.subject} style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 5, fontSize: 13, color: '#4a5568', boxSizing: 'border-box' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#4a5568', marginBottom: 5 }}>Corps de l'e-mail</label>
            <div style={{ border: '1px solid #ddd', borderRadius: 5, overflow: 'hidden' }}>
              <div style={{ background: '#f6f7fb', padding: '8px 12px', borderBottom: '1px solid #ddd', display: 'flex', gap: 8 }}>
                {['Gras', 'Italique', 'Lien', 'Image'].map(b => (
                  <button key={b} style={{ padding: '3px 8px', background: '#fff', border: '1px solid #ddd', borderRadius: 3, fontSize: 12, cursor: 'pointer' }}>{b}</button>
                ))}
              </div>
              <textarea
defaultValue={`Bonjour {{user_name}},\n\nMerci de votre inscription sur LiviGo!\n\nVotre compte a ete cree avec succes.\n\nCordialement,\nL'equipe LiviGo`}
                style={{ width: '100%', height: 250, padding: 12, border: 'none', fontSize: 13, resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ marginTop: 8, fontSize: 11, color: '#a0aec0' }}>
              Variables disponibles: {'{{user_name}}'}, {'{{user_email}}'}, {'{{app_name}}'}, {'{{support_email}}'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
