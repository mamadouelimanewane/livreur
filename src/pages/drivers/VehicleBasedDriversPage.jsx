import { useEffect, useState } from 'react'
import { FiTruck, FiDownload, FiPlus } from 'react-icons/fi'
import { PageHeader, Btn, FilterBar, Select, TextInput, DataTable, Badge } from '../../components/PageLayout'
import { getDriverStatusStyles, getVehicleDrivers } from '../../services/api/driversService'

export default function VehicleBasedDriversPage() {
  const [drivers, setDrivers] = useState([])
  const [vehicleType, setVehicleType] = useState('Tous types')
  const [zone, setZone] = useState('Toutes zones')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadDrivers() {
      try {
        setLoading(true)
        setError('')
        const nextDrivers = await getVehicleDrivers()
        if (isMounted) {
          setDrivers(nextDrivers)
        }
      } catch {
        if (isMounted) {
          setError('Impossible de charger les conducteurs par véhicule.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadDrivers()

    return () => {
      isMounted = false
    }
  }, [])

  const statusStyle = getDriverStatusStyles()
  const vehicleTypes = ['Tous types', ...new Set(drivers.map(driver => driver.vehicleType))]
  const zones = ['Toutes zones', ...new Set(drivers.map(driver => driver.zone))]
  const normalizedSearch = search.trim().toLowerCase()
  const filteredDrivers = drivers.filter(driver => {
    const matchesVehicleType = vehicleType === 'Tous types' || driver.vehicleType === vehicleType
    const matchesZone = zone === 'Toutes zones' || driver.zone === zone
    const matchesSearch = !normalizedSearch || [
      driver.id,
      driver.name,
      driver.phone,
      driver.vehicleType,
      driver.brand,
      driver.plate,
    ].some(value => String(value).toLowerCase().includes(normalizedSearch))

    return matchesVehicleType && matchesZone && matchesSearch
  })

  const data = filteredDrivers.map((driver, index) => [
    index + 1,
    <span key={`${driver.id}-id`} style={{ color: '#4680ff', fontWeight: 600 }}>{driver.id}</span>,
    <div key={`${driver.id}-details`}>
      <div style={{ fontWeight: 600, color: '#2d3748' }}>{driver.name}</div>
      <div style={{ fontSize: 12, color: '#718096' }}>{driver.phone}</div>
    </div>,
    driver.vehicleType,
    driver.brand,
    driver.plate,
    driver.year,
    driver.rides,
    <Badge key={`${driver.id}-status`} color={statusStyle[driver.status]?.color || '#718096'} bg={statusStyle[driver.status]?.bg || '#edf2f7'}>{driver.status}</Badge>,
  ])

  return (
    <div>
      <PageHeader title="Conducteurs en véhicule" icon={<FiTruck />}>
        <Btn color="#4680ff"><FiDownload size={14} /></Btn>
        <Btn color="#2ed8a3"><FiPlus size={14} /></Btn>
      </PageHeader>

      <FilterBar>
        <Select value={vehicleType} onChange={event => setVehicleType(event.target.value)} options={vehicleTypes} />
        <Select value={zone} onChange={event => setZone(event.target.value)} options={zones} />
        <TextInput placeholder="Rechercher par conducteur..." value={search} onChange={event => setSearch(event.target.value)} />
        <Btn color="#4680ff">Rechercher</Btn>
        <Btn outline color="#6c757d" onClick={() => { setVehicleType('Tous types'); setZone('Toutes zones'); setSearch('') }}>Réinitialiser</Btn>
      </FilterBar>

      {loading ? (
        <div style={{ background: '#fff', borderRadius: 8, padding: 40, textAlign: 'center', color: '#718096', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          Chargement des véhicules...
        </div>
      ) : error ? (
        <div style={{ background: '#fff0f3', border: '1px solid #ff5370', borderRadius: 8, padding: 16, color: '#c53030' }}>
          {error}
        </div>
      ) : (
        <DataTable
          columns={['S.No', 'ID', 'Conducteur', 'Type véhicule', 'Marque', 'Plaque', 'Année', 'Courses', 'Statut']}
          data={data}
        />
      )}
    </div>
  )
}
