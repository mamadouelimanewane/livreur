import { FiGlobe, FiPlus, FiDownload, FiInfo, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { PageHeader, Btn, FilterBar, TextInput, DataTable, Badge } from '../../components/PageLayout'

const countries = [
  { id: 'CTR-001', flag: '🇸🇳', name: 'Sénégal', code: 'SN', dial: '+221', currency: 'FCFA', zones: 7, drivers: 19, status: 'Actif' },
  { id: 'CTR-002', flag: '🇨🇮', name: 'Côte d\'Ivoire', code: 'CI', dial: '+225', currency: 'FCFA', zones: 3, drivers: 0, status: 'Inactif' },
  { id: 'CTR-003', flag: '🇲🇱', name: 'Mali', code: 'ML', dial: '+223', currency: 'FCFA', zones: 2, drivers: 0, status: 'Inactif' },
]

const statusStyle = {
  'Actif': { color: '#2ed8a3', bg: '#e6faf4' },
  'Inactif': { color: '#718096', bg: '#f7f9fb' },
}

export default function CountriesPage() {
  const data = countries.map((c, i) => [
    i + 1,
    <span style={{ fontSize: 22 }}>{c.flag}</span>,
    <strong style={{ color: '#2d3748' }}>{c.name}</strong>,
    <code style={{ background: '#f0f0f0', padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>{c.code}</code>,
    c.dial,
    c.currency,
    c.zones,
    c.drivers,
    <Badge color={statusStyle[c.status].color} bg={statusStyle[c.status].bg}>{c.status}</Badge>,
    <div style={{ display: 'flex', gap: 5 }}>
      <button style={{ padding: '4px 8px', background: '#2ed8a3', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer' }}><FiEdit2 size={12} /></button>
      <button style={{ padding: '4px 8px', background: '#ff5370', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer' }}><FiTrash2 size={12} /></button>
    </div>,
  ])

  return (
    <div>
      <PageHeader title="Pays" icon={<FiGlobe />}>
        <Btn color="#2ed8a3"><FiPlus size={14} /> Ajouter</Btn>
        <Btn color="#4680ff"><FiDownload size={14} /></Btn>
        <Btn color="#4680ff"><FiInfo size={14} /></Btn>
      </PageHeader>

      <FilterBar>
        <TextInput placeholder="Rechercher un pays..." value="" onChange={() => {}} />
        <Btn color="#4680ff">Rechercher</Btn>
      </FilterBar>

      <DataTable
        columns={['S.No', 'Drapeau', 'Pays', 'Code ISO', 'Indicatif', 'Devise', 'Zones', 'Conducteurs', 'Statut', 'Actions']}
        data={data}
      />
    </div>
  )
}
