import { useState } from 'react'
import { FiTruck, FiPlus, FiDownload, FiInfo, FiEye, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { PageHeader, Btn, FilterBar, Select, TextInput, Badge } from '../../components/PageLayout'

const sampleDrivers = [
  {
    id: 'DRV-001',
    name: 'Oumar Sall',
    phone: '+221 77 100 22 33',
    email: 'oumar.sall@gmail.com',
    zone: 'Dakar Centre',
    vehicle: 'Moto',
    rides: 48,
    amount: '24 500 FCFA',
    registered: '05/01/2024',
    status: 'Approuvé',
  },
  {
    id: 'DRV-002',
    name: 'Cheikh Fall',
    phone: '+221 76 200 33 44',
    email: 'cheikh.fall@yahoo.fr',
    zone: 'Plateau',
    vehicle: 'Voiture',
    rides: 32,
    amount: '16 200 FCFA',
    registered: '10/01/2024',
    status: 'En attente',
  },
  {
    id: 'DRV-003',
    name: 'Ibrahima Ba',
    phone: '+221 70 300 44 55',
    email: 'ibrahima.ba@gmail.com',
    zone: 'Parcelles Assainies',
    vehicle: 'Moto',
    rides: 61,
    amount: '30 750 FCFA',
    registered: '15/01/2024',
    status: 'Approuvé',
  },
  {
    id: 'DRV-004',
    name: 'Seydou Diop',
    phone: '+221 77 400 55 66',
    email: 'seydou.diop@gmail.com',
    zone: 'Guédiawaye',
    vehicle: 'Vélo',
    rides: 14,
    amount: '5 600 FCFA',
    registered: '20/01/2024',
    status: 'Rejeté',
  },
  {
    id: 'DRV-005',
    name: 'Abdoulaye Mbaye',
    phone: '+221 76 500 66 77',
    email: 'abdoulaye.mbaye@outlook.com',
    zone: 'Dakar Sud',
    vehicle: 'Voiture',
    rides: 27,
    amount: '13 500 FCFA',
    registered: '28/01/2024',
    status: 'Approuvé',
  },
]

const statusStyle = {
  'Approuvé': { color: '#2ed8a3', bg: '#e6faf4' },
  'En attente': { color: '#ffb64d', bg: '#fff8ee' },
  'Rejeté': { color: '#ff5370', bg: '#fff0f3' },
}

const pillStyle = (color, bg) => ({
  display: 'inline-block',
  padding: '3px 10px',
  borderRadius: 20,
  fontSize: 11,
  fontWeight: 600,
  background: bg,
  color: color,
  whiteSpace: 'nowrap',
  cursor: 'pointer',
})

export default function DriversPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('Tous')
  const [zone, setZone] = useState('Tous')
  const [vehicleType, setVehicleType] = useState('Tous')
  const [entries, setEntries] = useState('50')

  const filtered = sampleDrivers.filter(d => {
    if (status !== 'Tous' && d.status !== status) return false
    if (zone !== 'Tous' && d.zone !== zone) return false
    if (vehicleType !== 'Tous' && d.vehicle !== vehicleType) return false
    if (search && !d.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div>
      <PageHeader title="Tous les conducteurs" icon={<FiTruck />}>
        <Btn color="#4680ff"><FiDownload size={14} /></Btn>
        <Btn color="#2ed8a3"><FiPlus size={14} /> Ajouter</Btn>
        <Btn color="#4680ff"><FiInfo size={14} /></Btn>
      </PageHeader>

      {/* Status pills row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
        <span style={pillStyle('#ffb64d', '#fff8ee')}>Approbation en attente (0)</span>
        <span style={pillStyle('#4680ff', '#ebf4ff')}>Temps d'approbation docs (0)</span>
        <span style={pillStyle('#2ed8a3', '#e6faf4')}>Inscription de base (4)</span>
        <span style={{ ...pillStyle('#6c757d', '#f0f0f0'), border: '1px solid #ddd' }}>Effacé Conducteurs</span>
        <span style={pillStyle('#ff5370', '#fff0f3')}>Conducteurs rejetés (0)</span>
        <span style={pillStyle('#2ed8a3', '#e6faf4')}>En attente d'approbation (3)</span>
      </div>

      <FilterBar>
        <Select
          value={status}
          onChange={e => setStatus(e.target.value)}
          options={['Tous', 'Approuvé', 'En attente', 'Rejeté']}
        />
        <Select
          value="Sénégal"
          onChange={() => {}}
          options={['Sénégal', 'Côte d\'Ivoire', 'Mali']}
        />
        <Select
          value={zone}
          onChange={e => setZone(e.target.value)}
          options={['Tous', 'Dakar Centre', 'Plateau', 'Parcelles Assainies', 'Guédiawaye', 'Dakar Sud']}
        />
        <Select
          value={vehicleType}
          onChange={e => setVehicleType(e.target.value)}
          options={['Tous', 'Moto', 'Voiture', 'Vélo']}
        />
        <Select
          value="Sélectionner par"
          onChange={() => {}}
          options={['Sélectionner par', 'Nom', 'ID']}
        />
        <TextInput
          placeholder="Rechercher..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Select
          value={entries}
          onChange={e => setEntries(e.target.value)}
          options={['10', '25', '50', '100']}
          style={{ width: 70 }}
        />
        <Btn color="#4680ff">Rechercher</Btn>
        <Btn outline color="#6c757d" onClick={() => { setSearch(''); setStatus('Tous') }}>Réinitialiser</Btn>
      </FilterBar>

      <div style={{
        background: '#fff',
        borderRadius: 8,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        overflow: 'hidden',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f6f7fb' }}>
                {['S.No', 'ID', 'Zone de service', 'Détails du conducteur', 'Stats services', 'Transactions', 'Date d\'inscription', 'Actions'].map((h, i) => (
                  <th key={i} style={{
                    padding: '10px 14px',
                    textAlign: 'left',
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#718096',
                    borderBottom: '1px solid #edf2f7',
                    whiteSpace: 'nowrap',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((d, i) => (
                <tr key={d.id}
                  style={{ borderBottom: '1px solid #f7f9fb' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fafbff'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '10px 14px', fontSize: 13, color: '#718096' }}>{i + 1}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ fontSize: 13, color: '#4680ff', fontWeight: 600 }}>{d.id}</span>
                  </td>
                  <td style={{ padding: '10px 14px', fontSize: 13 }}>
                    <div>{d.zone}</div>
                    <div style={{ fontSize: 11, color: '#a0aec0' }}>{d.vehicle}</div>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: '#2d3748' }}>{d.name}</div>
                    <div style={{ fontSize: 12, color: '#718096' }}>{d.phone}</div>
                    <div style={{ fontSize: 12, color: '#718096' }}>{d.email}</div>
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                    <span style={{
                      background: '#ebf4ff',
                      color: '#4680ff',
                      borderRadius: 12,
                      padding: '3px 10px',
                      fontSize: 12,
                      fontWeight: 700,
                    }}>{d.rides} courses</span>
                  </td>
                  <td style={{ padding: '10px 14px', fontSize: 13, fontWeight: 600, color: '#2d3748' }}>
                    {d.amount}
                  </td>
                  <td style={{ padding: '10px 14px', fontSize: 13, color: '#718096', whiteSpace: 'nowrap' }}>
                    {d.registered}
                    <br />
                    <span style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      borderRadius: 12,
                      fontSize: 11,
                      fontWeight: 600,
                      background: statusStyle[d.status].bg,
                      color: statusStyle[d.status].color,
                      marginTop: 4,
                    }}>{d.status}</span>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ display: 'flex', gap: 5 }}>
                      <button style={{ padding: '4px 8px', background: '#4680ff', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer' }}><FiEye size={12} /></button>
                      <button style={{ padding: '4px 8px', background: '#2ed8a3', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer' }}><FiEdit2 size={12} /></button>
                      <button style={{ padding: '4px 8px', background: '#ff5370', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer' }}><FiTrash2 size={12} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{
          padding: '10px 14px',
          borderTop: '1px solid #edf2f7',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 12,
          color: '#718096',
        }}>
          <span>Affichage de {filtered.length} conducteurs</span>
          <div style={{ display: 'flex', gap: 4 }}>
            {['«', '‹', '1', '›', '»'].map((p, i) => (
              <button key={i} style={{
                padding: '3px 8px',
                border: '1px solid #ddd',
                borderRadius: 4,
                background: p === '1' ? '#4680ff' : '#fff',
                color: p === '1' ? '#fff' : '#4a5568',
                cursor: 'pointer',
                fontSize: 12,
              }}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
