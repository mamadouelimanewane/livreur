import { FiTruck, FiDownload } from 'react-icons/fi'
import { PageHeader, Btn, FilterBar, Select, TextInput, DataTable, Badge } from '../../components/PageLayout'

const drivers = [
  { id: 'DRV-040', name: 'Yaye Mbodj', phone: '+221 77 010 11 22', zone: 'Dakar', reason: 'Document expiré', until: '30/03/2024', rejectedDate: '01/03/2024' },
  { id: 'DRV-041', name: 'Alioune Dione', phone: '+221 76 020 22 33', zone: 'Saint-Louis', reason: 'Vérification en cours', until: '25/03/2024', rejectedDate: '05/03/2024' },
]

export default function TempRejectedDriversPage() {
  const data = drivers.map((d, i) => [
    i + 1,
    <span style={{ color: '#4680ff', fontWeight: 600 }}>{d.id}</span>,
    <div>
      <div style={{ fontWeight: 600, color: '#2d3748' }}>{d.name}</div>
      <div style={{ fontSize: 12, color: '#718096' }}>{d.phone}</div>
    </div>,
    d.zone,
    <span style={{ fontSize: 12, color: '#ffb64d' }}>{d.reason}</span>,
    <span style={{ fontSize: 12, color: '#ff5370' }}>Jusqu'au {d.until}</span>,
    d.rejectedDate,
    <Badge color="#ffb64d" bg="#fff8ee">Temporaire</Badge>,
  ])

  return (
    <div>
      <PageHeader title="Temporairement rejetés" icon={<FiTruck />}>
        <Btn color="#4680ff"><FiDownload size={14} /></Btn>
      </PageHeader>

      <div style={{
        background: '#fff8ee',
        border: '1px solid #ffb64d',
        borderRadius: 8,
        padding: '10px 16px',
        marginBottom: 16,
        fontSize: 13,
        color: '#7a5200',
      }}>
        Ces conducteurs ont été temporairement suspendus. Ils pourront être réactivés après la date indiquée.
      </div>

      <FilterBar>
        <TextInput placeholder="Rechercher..." value="" onChange={() => {}} />
        <Btn color="#4680ff">Rechercher</Btn>
        <Btn outline color="#6c757d">Réinitialiser</Btn>
      </FilterBar>

      <DataTable
        columns={['S.No', 'ID', 'Conducteur', 'Zone', 'Raison', 'Suspendu jusqu\'au', 'Date', 'Statut']}
        data={data}
      />
    </div>
  )
}
