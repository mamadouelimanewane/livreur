import { FiTruck, FiDownload, FiInfo } from 'react-icons/fi'
import { PageHeader, Btn, FilterBar, Select, TextInput, DataTable, Badge } from '../../components/PageLayout'

const drivers = [
  { id: 'DRV-010', name: 'Ndeye Sarr', phone: '+221 77 111 22 33', email: 'ndeye.sarr@gmail.com', zone: 'Dakar Centre', signupDate: '10/03/2024' },
  { id: 'DRV-011', name: 'Mamadou Coulibaly', phone: '+221 76 222 33 44', email: 'm.coulibaly@yahoo.fr', zone: 'Plateau', signupDate: '11/03/2024' },
  { id: 'DRV-012', name: 'Aissatou Bah', phone: '+221 70 333 44 55', email: 'aissatou.bah@gmail.com', zone: 'Parcelles', signupDate: '12/03/2024' },
  { id: 'DRV-013', name: 'Moustapha Gaye', phone: '+221 77 444 55 66', email: 'm.gaye@outlook.com', zone: 'Guédiawaye', signupDate: '13/03/2024' },
]

export default function BasicSignupPage() {
  const data = drivers.map((d, i) => [
    i + 1,
    <span style={{ color: '#4680ff', fontWeight: 600 }}>{d.id}</span>,
    <div>
      <div style={{ fontWeight: 600, color: '#2d3748' }}>{d.name}</div>
      <div style={{ fontSize: 12, color: '#718096' }}>{d.phone}</div>
      <div style={{ fontSize: 12, color: '#718096' }}>{d.email}</div>
    </div>,
    d.zone,
    d.signupDate,
    <Badge color="#ffb64d" bg="#fff8ee">Inscription de base</Badge>,
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
        Inscription de base terminée (4) — Ces conducteurs ont complété leur inscription initiale mais n'ont pas encore soumis leurs documents.
      </div>

      <FilterBar>
        <Select value="Toutes zones" onChange={() => {}} options={['Toutes zones', 'Dakar Centre', 'Plateau', 'Parcelles', 'Guédiawaye']} />
        <TextInput placeholder="Rechercher un conducteur..." value="" onChange={() => {}} />
        <Btn color="#4680ff">Rechercher</Btn>
        <Btn outline color="#6c757d">Réinitialiser</Btn>
      </FilterBar>

      <DataTable
        columns={['S.No', 'ID', 'Détails du conducteur', 'Zone', 'Date inscription', 'Statut']}
        data={data}
      />
    </div>
  )
}
