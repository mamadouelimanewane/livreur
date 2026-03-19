import { useEffect, useState } from 'react'
import { FiTruck, FiDownload, FiInfo } from 'react-icons/fi'
import { PageHeader, Btn, FilterBar, Select, TextInput, DataTable, Badge } from '../../components/PageLayout'
import { getBasicSignupDrivers } from '../../services/api/driversService'

export default function BasicSignupPage() {
  const [drivers, setDrivers] = useState([])
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
        const nextDrivers = await getBasicSignupDrivers()
        if (isMounted) {
          setDrivers(nextDrivers)
        }
      } catch {
        if (isMounted) {
          setError('Impossible de charger les inscriptions de base.')
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

  const zones = ['Toutes zones', ...new Set(drivers.map(driver => driver.zone))]
  const normalizedSearch = search.trim().toLowerCase()
  const filteredDrivers = drivers.filter(driver => {
    const matchesZone = zone === 'Toutes zones' || driver.zone === zone
    const matchesSearch = !normalizedSearch || [
      driver.id,
      driver.name,
      driver.phone,
      driver.email,
    ].some(value => value.toLowerCase().includes(normalizedSearch))

    return matchesZone && matchesSearch
  })

  const data = filteredDrivers.map((driver, index) => [
    index + 1,
    <span key={`${driver.id}-id`} style={{ color: '#4680ff', fontWeight: 600 }}>{driver.id}</span>,
    <div key={`${driver.id}-details`}>
      <div style={{ fontWeight: 600, color: '#2d3748' }}>{driver.name}</div>
      <div style={{ fontSize: 12, color: '#718096' }}>{driver.phone}</div>
      <div style={{ fontSize: 12, color: '#718096' }}>{driver.email}</div>
    </div>,
    driver.zone,
    driver.signupDate,
    <Badge key={`${driver.id}-status`} color="#ffb64d" bg="#fff8ee">Inscription de base</Badge>,
  ])

  return (
    <div>
      <PageHeader title="Inscription de base terminée" icon={<FiTruck />}>
        <Btn color="#4680ff"><FiDownload size={14} /></Btn>
        <Btn color="#4680ff"><FiInfo size={14} /></Btn>
      </PageHeader>

      <div style={{
        background: '#e6faf4',
        border: '1px solid #2ed8a3',
        borderRadius: 8,
        padding: '10px 16px',
        marginBottom: 16,
        fontSize: 13,
        color: '#1a7a56',
        fontWeight: 600,
      }}>
        Inscription de base terminée ({drivers.length}) - Ces conducteurs ont complété leur inscription initiale mais n'ont pas encore soumis leurs documents.
      </div>

      <FilterBar>
        <Select value={zone} onChange={event => setZone(event.target.value)} options={zones} />
        <TextInput placeholder="Rechercher un conducteur..." value={search} onChange={event => setSearch(event.target.value)} />
        <Btn color="#4680ff">Rechercher</Btn>
        <Btn outline color="#6c757d" onClick={() => { setZone('Toutes zones'); setSearch('') }}>Réinitialiser</Btn>
      </FilterBar>

      {loading ? (
        <div style={{ background: '#fff', borderRadius: 8, padding: 40, textAlign: 'center', color: '#718096', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          Chargement des conducteurs...
        </div>
      ) : error ? (
        <div style={{ background: '#fff0f3', border: '1px solid #ff5370', borderRadius: 8, padding: 16, color: '#c53030' }}>
          {error}
        </div>
      ) : (
        <DataTable
          columns={['S.No', 'ID', 'Détails du conducteur', 'Zone', 'Date inscription', 'Statut']}
          data={data}
        />
      )}
    </div>
  )
}
