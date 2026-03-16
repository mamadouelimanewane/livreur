import { FiAlertTriangle, FiDownload } from 'react-icons/fi'
import { PageHeader, Btn, FilterBar, Select, TextInput, DataTable, Badge } from '../../components/PageLayout'

const docs = [
  { driverId: 'DRV-001', name: 'Oumar Sall', phone: '+221 77 100 22 33', zone: 'Dakar Centre', docType: 'Permis de conduire', docNum: 'SN-2021-001', expiresOn: '31/03/2024', daysLeft: 15 },
  { driverId: 'DRV-003', name: 'Ibrahima Ba', phone: '+221 70 300 44 55', zone: 'Parcelles', docType: 'Carte grise', docNum: 'CG-2022-003', expiresOn: '10/04/2024', daysLeft: 25 },
  { driverId: 'DRV-005', name: 'Abdoulaye Mbaye', phone: '+221 76 500 66 77', zone: 'Dakar Sud', docType: 'Assurance véhicule', docNum: 'ASS-2023-005', expiresOn: '05/04/2024', daysLeft: 20 },
]

const urgencyColor = (days) => {
  if (days <= 7) return { color: '#ff5370', bg: '#fff0f3' }
  if (days <= 15) return { color: '#ffb64d', bg: '#fff8ee' }
  return { color: '#4680ff', bg: '#ebf4ff' }
}

export default function ExpiringDocsPage() {
  const data = docs.map((d, i) => {
    const urg = urgencyColor(d.daysLeft)
    return [
      i + 1,
      <span style={{ color: '#4680ff', fontWeight: 600 }}>{d.driverId}</span>,
      <div>
        <div style={{ fontWeight: 600, color: '#2d3748' }}>{d.name}</div>
        <div style={{ fontSize: 12, color: '#718096' }}>{d.phone}</div>
      </div>,
      d.zone,
      d.docType,
      d.docNum,
      d.expiresOn,
      <Badge color={urg.color} bg={urg.bg}>Dans {d.daysLeft} jours</Badge>,
    ]
  })

  return (
    <div>
      <PageHeader title="Documents proche d'expiration" icon={<FiAlertTriangle />}>
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
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <FiAlertTriangle color="#ffb64d" />
        <strong>{docs.length} document(s)</strong> expirent dans moins de 30 jours. Veuillez contacter les conducteurs concernés.
      </div>

      <FilterBar>
        <Select value="30 jours" onChange={() => {}} options={['7 jours', '15 jours', '30 jours', '60 jours']} />
        <Select value="Tous types" onChange={() => {}} options={['Tous types', 'Permis de conduire', 'Carte grise', 'Assurance']} />
        <TextInput placeholder="Rechercher un conducteur..." value="" onChange={() => {}} />
        <Btn color="#4680ff">Filtrer</Btn>
      </FilterBar>

      <DataTable
        columns={['S.No', 'ID conducteur', 'Conducteur', 'Zone', 'Type document', 'N° document', 'Expire le', 'Délai']}
        data={data}
      />
    </div>
  )
}
