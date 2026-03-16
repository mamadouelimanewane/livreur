import { FiTruck, FiDownload, FiPlus, FiInfo } from 'react-icons/fi'
import { PageHeader, Btn, FilterBar, Select, TextInput, DataTable, Badge } from '../../components/PageLayout'

const vehicles = [
  { id: 'VEH-001', driverId: 'DRV-001', driverName: 'Oumar Sall', type: 'Moto', brand: 'Yamaha', model: 'YBR 125', plate: 'DK-1234-AB', year: 2021, color: 'Rouge', status: 'Actif' },
  { id: 'VEH-002', driverId: 'DRV-002', driverName: 'Cheikh Fall', type: 'Voiture', brand: 'Toyota', model: 'Corolla', plate: 'DK-5678-CD', year: 2019, color: 'Blanc', status: 'Actif' },
  { id: 'VEH-003', driverId: 'DRV-003', driverName: 'Ibrahima Ba', type: 'Moto', brand: 'Honda', model: 'CB 150', plate: 'DK-9012-EF', year: 2022, color: 'Noir', status: 'Actif' },
  { id: 'VEH-004', driverId: 'DRV-004', driverName: 'Seydou Diop', type: 'Vélo', brand: 'VTT', model: 'Mountain', plate: '-', year: 2023, color: 'Bleu', status: 'Inactif' },
  { id: 'VEH-005', driverId: 'DRV-005', driverName: 'Abdoulaye Mbaye', type: 'Voiture', brand: 'Renault', model: 'Logan', plate: 'DK-3456-GH', year: 2020, color: 'Gris', status: 'Actif' },
]

const statusStyle = {
  'Actif': { color: '#2ed8a3', bg: '#e6faf4' },
  'Inactif': { color: '#ff5370', bg: '#fff0f3' },
}

export default function VehiclesPage() {
  const data = vehicles.map((v, i) => [
    i + 1,
    <span style={{ color: '#4680ff', fontWeight: 600 }}>{v.id}</span>,
    <div>
      <div style={{ fontWeight: 600, color: '#2d3748' }}>{v.driverName}</div>
      <div style={{ fontSize: 12, color: '#718096' }}>{v.driverId}</div>
    </div>,
    v.type,
    `${v.brand} ${v.model}`,
    v.plate,
    v.year,
    v.color,
    <Badge color={statusStyle[v.status].color} bg={statusStyle[v.status].bg}>{v.status}</Badge>,
  ])

  return (
    <div>
      <PageHeader title="Tous les véhicules" icon={<FiTruck />}>
        <Btn color="#4680ff"><FiDownload size={14} /></Btn>
        <Btn color="#2ed8a3"><FiPlus size={14} /></Btn>
        <Btn color="#4680ff"><FiInfo size={14} /></Btn>
      </PageHeader>

      <FilterBar>
        <Select value="Tous types" onChange={() => {}} options={['Tous types', 'Moto', 'Voiture', 'Vélo', 'Camion']} />
        <TextInput placeholder="Rechercher par plaque ou conducteur..." value="" onChange={() => {}} />
        <Btn color="#4680ff">Rechercher</Btn>
        <Btn outline color="#6c757d">Réinitialiser</Btn>
      </FilterBar>

      <DataTable
        columns={['S.No', 'ID véhicule', 'Conducteur', 'Type', 'Marque / Modèle', 'Plaque', 'Année', 'Couleur', 'Statut']}
        data={data}
      />
    </div>
  )
}
