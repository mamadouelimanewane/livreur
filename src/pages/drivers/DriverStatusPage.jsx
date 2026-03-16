import { FiTruck, FiDownload, FiInfo } from 'react-icons/fi'
import { PageHeader, Btn, FilterBar, Select, TextInput, DataTable, Badge } from '../../components/PageLayout'

const statuses = [
  { id: 'ST-001', name: 'Oumar Sall', phone: '+221 77 100 22 33', zone: 'Dakar Centre', vehicle: 'Moto', status: 'En ligne', lastSeen: 'Il y a 2 min' },
  { id: 'ST-002', name: 'Cheikh Fall', phone: '+221 76 200 33 44', zone: 'Plateau', vehicle: 'Voiture', status: 'Hors ligne', lastSeen: 'Il y a 3h' },
  { id: 'ST-003', name: 'Ibrahima Ba', phone: '+221 70 300 44 55', zone: 'Parcelles', vehicle: 'Moto', status: 'En course', lastSeen: 'Actif maintenant' },
  { id: 'ST-004', name: 'Seydou Diop', phone: '+221 77 400 55 66', zone: 'Guédiawaye', vehicle: 'Vélo', status: 'Hors ligne', lastSeen: 'Il y a 1 jour' },
  { id: 'ST-005', name: 'Abdoulaye Mbaye', phone: '+221 76 500 66 77', zone: 'Dakar Sud', vehicle: 'Voiture', status: 'En ligne', lastSeen: 'Il y a 10 min' },
]

const statusStyle = {
  'En ligne': { color: '#2ed8a3', bg: '#e6faf4' },
  'Hors ligne': { color: '#718096', bg: '#f7f9fb' },
  'En course': { color: '#4680ff', bg: '#ebf4ff' },
}

export default function DriverStatusPage() {
  const data = statuses.map((d, i) => [
    i + 1,
    <span style={{ color: '#4680ff', fontWeight: 600 }}>{d.id}</span>,
    <div>
      <div style={{ fontWeight: 600, color: '#2d3748' }}>{d.name}</div>
      <div style={{ fontSize: 12, color: '#718096' }}>{d.phone}</div>
    </div>,
    d.zone,
    d.vehicle,
    <Badge color={statusStyle[d.status].color} bg={statusStyle[d.status].bg}>{d.status}</Badge>,
    <span style={{ fontSize: 12, color: '#a0aec0' }}>{d.lastSeen}</span>,
  ])

  return (
    <div>
      <PageHeader title="Conducteur Statuts" icon={<FiTruck />}>
        <Btn color="#4680ff"><FiDownload size={14} /></Btn>
        <Btn color="#4680ff"><FiInfo size={14} /></Btn>
      </PageHeader>

      <FilterBar>
        <Select value="Tous" onChange={() => {}} options={['Tous', 'En ligne', 'Hors ligne', 'En course']} />
        <Select value="Toutes zones" onChange={() => {}} options={['Toutes zones', 'Dakar Centre', 'Plateau', 'Parcelles', 'Guédiawaye']} />
        <TextInput placeholder="Rechercher un conducteur..." value="" onChange={() => {}} />
        <Btn color="#4680ff">Rechercher</Btn>
        <Btn outline color="#6c757d">Réinitialiser</Btn>
      </FilterBar>

      <DataTable
        columns={['S.No', 'ID', 'Détails du conducteur', 'Zone', 'Véhicule', 'Statut', 'Dernière activité']}
        data={data}
      />
    </div>
  )
}
