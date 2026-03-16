import { FiTruck, FiDownload, FiPlus } from 'react-icons/fi'
import { PageHeader, Btn, FilterBar, Select, TextInput, DataTable, Badge } from '../../components/PageLayout'

const drivers = [
  { id: 'DRV-001', name: 'Oumar Sall', phone: '+221 77 100 22 33', vehicleType: 'Moto', brand: 'Yamaha', plate: 'DK-1234-AB', year: 2021, rides: 48, status: 'Actif' },
  { id: 'DRV-002', name: 'Cheikh Fall', phone: '+221 76 200 33 44', vehicleType: 'Voiture', brand: 'Toyota', plate: 'DK-5678-CD', year: 2019, rides: 32, status: 'Actif' },
  { id: 'DRV-003', name: 'Ibrahima Ba', phone: '+221 70 300 44 55', vehicleType: 'Moto', brand: 'Honda', plate: 'DK-9012-EF', year: 2022, rides: 61, status: 'Actif' },
  { id: 'DRV-004', name: 'Seydou Diop', phone: '+221 77 400 55 66', vehicleType: 'Vélo', brand: '-', plate: '-', year: 2023, rides: 14, status: 'Inactif' },
  { id: 'DRV-005', name: 'Abdoulaye Mbaye', phone: '+221 76 500 66 77', vehicleType: 'Voiture', brand: 'Renault', plate: 'DK-3456-GH', year: 2020, rides: 27, status: 'Actif' },
]

const statusStyle = {
  'Actif': { color: '#2ed8a3', bg: '#e6faf4' },
  'Inactif': { color: '#ff5370', bg: '#fff0f3' },
}

export default function VehicleBasedDriversPage() {
  const data = drivers.map((d, i) => [
    i + 1,
    <span style={{ color: '#4680ff', fontWeight: 600 }}>{d.id}</span>,
    <div>
      <div style={{ fontWeight: 600, color: '#2d3748' }}>{d.name}</div>
      <div style={{ fontSize: 12, color: '#718096' }}>{d.phone}</div>
    </div>,
    d.vehicleType,
    d.brand,
    d.plate,
    d.year,
    d.rides,
    <Badge color={statusStyle[d.status].color} bg={statusStyle[d.status].bg}>{d.status}</Badge>,
  ])

  return (
    <div>
      <PageHeader title="Conducteurs en véhicule" icon={<FiTruck />}>
        <Btn color="#4680ff"><FiDownload size={14} /></Btn>
        <Btn color="#2ed8a3"><FiPlus size={14} /></Btn>
      </PageHeader>

      <FilterBar>
        <Select value="Tous types" onChange={() => {}} options={['Tous types', 'Moto', 'Voiture', 'Vélo', 'Camion']} />
        <Select value="Toutes zones" onChange={() => {}} options={['Toutes zones', 'Dakar Centre', 'Plateau', 'Parcelles']} />
        <TextInput placeholder="Rechercher par conducteur..." value="" onChange={() => {}} />
        <Btn color="#4680ff">Rechercher</Btn>
        <Btn outline color="#6c757d">Réinitialiser</Btn>
      </FilterBar>

      <DataTable
        columns={['S.No', 'ID', 'Conducteur', 'Type véhicule', 'Marque', 'Plaque', 'Année', 'Courses', 'Statut']}
        data={data}
      />
    </div>
  )
}
