import { FiGrid, FiPlus, FiDownload, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { PageHeader, Btn, FilterBar, TextInput, DataTable, Badge } from '../../components/PageLayout'

const services = [
  { id: 'SRV-001', name: 'Moto Taxi', icon: '🏍️', type: 'Taxi', country: 'Sénégal', zones: 5, drivers: 12, basePrice: '300 FCFA', status: 'Actif' },
  { id: 'SRV-002', name: 'Livraison Express', icon: '🚚', type: 'Livraison', country: 'Sénégal', zones: 5, drivers: 7, basePrice: '500 FCFA', status: 'Actif' },
  { id: 'SRV-003', name: 'Taxi Premium', icon: '🚖', type: 'Taxi', country: 'Sénégal', zones: 3, drivers: 4, basePrice: '800 FCFA', status: 'Actif' },
  { id: 'SRV-004', name: 'Livraison Alimentaire', icon: '🍔', type: 'Livraison', country: 'Sénégal', zones: 2, drivers: 3, basePrice: '400 FCFA', status: 'Inactif' },
]

const statusStyle = {
  'Actif': { color: '#2ed8a3', bg: '#e6faf4' },
  'Inactif': { color: '#ff5370', bg: '#fff0f3' },
}

export default function ServicesPage() {
  const data = services.map((s, i) => [
    i + 1,
    <span style={{ fontSize: 20 }}>{s.icon}</span>,
    <strong style={{ color: '#2d3748' }}>{s.name}</strong>,
    <Badge color="#4680ff" bg="#ebf4ff">{s.type}</Badge>,
    s.country,
    s.zones,
    s.drivers,
    <strong>{s.basePrice}</strong>,
    <Badge color={statusStyle[s.status].color} bg={statusStyle[s.status].bg}>{s.status}</Badge>,
    <div style={{ display: 'flex', gap: 5 }}>
      <button style={{ padding: '4px 8px', background: '#2ed8a3', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer' }}><FiEdit2 size={12} /></button>
      <button style={{ padding: '4px 8px', background: '#ff5370', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer' }}><FiTrash2 size={12} /></button>
    </div>,
  ])

  return (
    <div>
      <PageHeader title="Prestations de service" icon={<FiGrid />}>
        <Btn color="#2ed8a3"><FiPlus size={14} /> Ajouter</Btn>
        <Btn color="#4680ff"><FiDownload size={14} /></Btn>
      </PageHeader>

      <FilterBar>
        <TextInput placeholder="Rechercher un service..." value="" onChange={() => {}} />
        <Btn color="#4680ff">Rechercher</Btn>
      </FilterBar>

      <DataTable
        columns={['S.No', 'Icône', 'Nom', 'Type', 'Pays', 'Zones', 'Conducteurs', 'Prix de base', 'Statut', 'Actions']}
        data={data}
      />
    </div>
  )
}
