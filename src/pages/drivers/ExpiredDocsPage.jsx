import { FiAlertOctagon, FiDownload } from 'react-icons/fi'
import { PageHeader, Btn, FilterBar, Select, TextInput, DataTable, Badge } from '../../components/PageLayout'

const docs = [
  { driverId: 'DRV-004', name: 'Seydou Diop', phone: '+221 77 400 55 66', zone: 'Guédiawaye', docType: 'Permis de conduire', docNum: 'SN-2020-004', expiredOn: '15/02/2024', daysSince: 29 },
  { driverId: 'DRV-008', name: 'Pape Diallo', phone: '+221 76 800 88 99', zone: 'Rufisque', docType: 'Carte grise', docNum: 'CG-2021-008', expiredOn: '28/02/2024', daysSince: 16 },
]

export default function ExpiredDocsPage() {
  const data = docs.map((d, i) => [
    i + 1,
    <span style={{ color: '#4680ff', fontWeight: 600 }}>{d.driverId}</span>,
    <div>
      <div style={{ fontWeight: 600, color: '#2d3748' }}>{d.name}</div>
      <div style={{ fontSize: 12, color: '#718096' }}>{d.phone}</div>
    </div>,
    d.zone,
    d.docType,
    d.docNum,
    d.expiredOn,
    <Badge color="#ff5370" bg="#fff0f3">Expiré il y a {d.daysSince}j</Badge>,
    <button style={{ padding: '4px 10px', background: '#4680ff', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer', fontSize: 12 }}>Notifier</button>,
  ])

  return (
    <div>
      <PageHeader title="Documents expirés" icon={<FiAlertOctagon />}>
        <Btn color="#4680ff"><FiDownload size={14} /></Btn>
      </PageHeader>

      <div style={{
        background: '#fff0f3',
        border: '1px solid #ff5370',
        borderRadius: 8,
        padding: '10px 16px',
        marginBottom: 16,
        fontSize: 13,
        color: '#c53030',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <FiAlertOctagon color="#ff5370" />
        <strong>{docs.length} document(s) expirés</strong> — Ces conducteurs ne peuvent pas effectuer de courses jusqu'au renouvellement.
      </div>

      <FilterBar>
        <Select value="Tous types" onChange={() => {}} options={['Tous types', 'Permis de conduire', 'Carte grise', 'Assurance']} />
        <TextInput placeholder="Rechercher un conducteur..." value="" onChange={() => {}} />
        <Btn color="#4680ff">Filtrer</Btn>
      </FilterBar>

      <DataTable
        columns={['S.No', 'ID conducteur', 'Conducteur', 'Zone', 'Type document', 'N° document', 'Expiré le', 'Délai', 'Action']}
        data={data}
      />
    </div>
  )
}
