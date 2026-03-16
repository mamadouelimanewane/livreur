import { FiMapPin, FiPlus, FiDownload, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { PageHeader, Btn, FilterBar, Select, TextInput, DataTable, Badge } from '../../components/PageLayout'

const zones = [
  { id: 'ZON-001', name: 'Dakar Centre', country: 'Sénégal', type: 'Polygon', drivers: 8, services: ['Moto Taxi', 'Livraison Express'], status: 'Actif' },
  { id: 'ZON-002', name: 'Plateau', country: 'Sénégal', type: 'Circle', drivers: 5, services: ['Moto Taxi', 'Taxi Premium'], status: 'Actif' },
  { id: 'ZON-003', name: 'Parcelles Assainies', country: 'Sénégal', type: 'Polygon', drivers: 4, services: ['Moto Taxi', 'Livraison Express'], status: 'Actif' },
  { id: 'ZON-004', name: 'Guédiawaye', country: 'Sénégal', type: 'Polygon', drivers: 3, services: ['Moto Taxi'], status: 'Actif' },
  { id: 'ZON-005', name: 'Dakar Sud', country: 'Sénégal', type: 'Circle', drivers: 2, services: ['Livraison Express'], status: 'Actif' },
  { id: 'ZON-006', name: 'Thiès', country: 'Sénégal', type: 'Circle', drivers: 1, services: ['Moto Taxi'], status: 'Inactif' },
  { id: 'ZON-007', name: 'Saint-Louis', country: 'Sénégal', type: 'Polygon', drivers: 0, services: [], status: 'Inactif' },
]

const statusStyle = {
  'Actif': { color: '#2ed8a3', bg: '#e6faf4' },
  'Inactif': { color: '#718096', bg: '#f7f9fb' },
}

export default function ZonesPage() {
  const data = zones.map((z, i) => [
    i + 1,
    <span style={{ color: '#4680ff', fontWeight: 600 }}>{z.id}</span>,
    <strong style={{ color: '#2d3748' }}>{z.name}</strong>,
    z.country,
    <Badge color="#6f42c1" bg="#f3eeff">{z.type}</Badge>,
    z.drivers,
    z.services.length > 0
      ? z.services.map((s, j) => <Badge key={j} color="#4680ff" bg="#ebf4ff" style={{ marginRight: 4 }}>{s}</Badge>)
      : <span style={{ color: '#a0aec0', fontSize: 12 }}>Aucun</span>,
    <Badge color={statusStyle[z.status].color} bg={statusStyle[z.status].bg}>{z.status}</Badge>,
    <div style={{ display: 'flex', gap: 5 }}>
      <button style={{ padding: '4px 8px', background: '#2ed8a3', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer' }}><FiEdit2 size={12} /></button>
      <button style={{ padding: '4px 8px', background: '#ff5370', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer' }}><FiTrash2 size={12} /></button>
    </div>,
  ])

  return (
    <div>
      <PageHeader title="Zones de service" icon={<FiMapPin />}>
        <Btn color="#2ed8a3"><FiPlus size={14} /> Ajouter une zone</Btn>
        <Btn color="#4680ff"><FiDownload size={14} /></Btn>
      </PageHeader>

      <FilterBar>
        <Select value="Sénégal" onChange={() => {}} options={['Sénégal', 'Côte d\'Ivoire']} />
        <Select value="Tous statuts" onChange={() => {}} options={['Tous statuts', 'Actif', 'Inactif']} />
        <TextInput placeholder="Rechercher une zone..." value="" onChange={() => {}} />
        <Btn color="#4680ff">Rechercher</Btn>
      </FilterBar>

      <DataTable
        columns={['S.No', 'ID', 'Nom de la zone', 'Pays', 'Type', 'Conducteurs', 'Services', 'Statut', 'Actions']}
        data={data}
      />
    </div>
  )
}
