import { useState } from 'react'
import { FiType, FiDownload, FiEdit2, FiSave, FiX } from 'react-icons/fi'
import { PageHeader, Btn, FilterBar, Select, TextInput } from '../../components/PageLayout'

const strings = [
  { key: 'app_name', en: 'LiviGo', fr: 'LiviGo' },
  { key: 'welcome_message', en: 'Welcome to LiviGo', fr: 'Bienvenue sur LiviGo' },
  { key: 'find_driver', en: 'Find a driver', fr: 'Trouver un conducteur' },
  { key: 'book_now', en: 'Book Now', fr: 'Réserver maintenant' },
  { key: 'cancel_ride', en: 'Cancel Ride', fr: 'Annuler la course' },
  { key: 'rate_driver', en: 'Rate your driver', fr: 'Évaluez votre conducteur' },
  { key: 'payment_success', en: 'Payment successful', fr: 'Paiement réussi' },
  { key: 'no_driver_found', en: 'No driver found', fr: 'Aucun conducteur trouvé' },
]

export default function AppStringsPage() {
  const [editId, setEditId] = useState(null)
  const [editVal, setEditVal] = useState('')
  const [search, setSearch] = useState('')

  const filtered = strings.filter(s =>
    !search || s.key.includes(search.toLowerCase()) || s.fr.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <PageHeader title="Chaînes d'application" icon={<FiType />}>
        <Btn color="#4680ff"><FiDownload size={14} /> Exporter</Btn>
      </PageHeader>

      <FilterBar>
        <Select value="Français" onChange={() => {}} options={['Français', 'English', 'Wolof']} />
        <TextInput placeholder="Rechercher une clé ou valeur..." value={search} onChange={e => setSearch(e.target.value)} />
        <Btn color="#4680ff">Rechercher</Btn>
      </FilterBar>

      <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f6f7fb' }}>
              {['S.No', 'Clé', 'English', 'Français', 'Actions'].map((h, i) => (
                <th key={i} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#718096', borderBottom: '1px solid #edf2f7' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => (
              <tr key={s.key} style={{ borderBottom: '1px solid #f7f9fb' }}
                onMouseEnter={e => e.currentTarget.style.background = '#fafbff'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '10px 14px', fontSize: 13, color: '#718096' }}>{i + 1}</td>
                <td style={{ padding: '10px 14px' }}>
                  <code style={{ background: '#f0f0f0', padding: '2px 8px', borderRadius: 4, fontSize: 12 }}>{s.key}</code>
                </td>
                <td style={{ padding: '10px 14px', fontSize: 13, color: '#4a5568' }}>{s.en}</td>
                <td style={{ padding: '10px 14px' }}>
                  {editId === s.key ? (
                    <input
                      value={editVal}
                      onChange={e => setEditVal(e.target.value)}
                      style={{ padding: '4px 8px', border: '1px solid #4680ff', borderRadius: 4, fontSize: 13, width: '100%' }}
                    />
                  ) : (
                    <span style={{ fontSize: 13, color: '#4a5568' }}>{s.fr}</span>
                  )}
                </td>
                <td style={{ padding: '10px 14px' }}>
                  {editId === s.key ? (
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button onClick={() => setEditId(null)} style={{ padding: '4px 8px', background: '#2ed8a3', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer' }}><FiSave size={12} /></button>
                      <button onClick={() => setEditId(null)} style={{ padding: '4px 8px', background: '#ff5370', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer' }}><FiX size={12} /></button>
                    </div>
                  ) : (
                    <button onClick={() => { setEditId(s.key); setEditVal(s.fr) }} style={{ padding: '4px 8px', background: '#4680ff', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer' }}><FiEdit2 size={12} /></button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
