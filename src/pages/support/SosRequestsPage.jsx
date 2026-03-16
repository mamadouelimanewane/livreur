import { FiAlertCircle, FiDownload, FiEye } from 'react-icons/fi'
import { PageHeader, Btn, FilterBar, Select, DataTable, Badge } from '../../components/PageLayout'

const requests = [
  { id: 'SOSR-001', requester: 'Fatou Diallo', role: 'Utilisateur', phone: '+221 77 123 45 67', location: 'Plateau, Dakar', type: 'Accident', driver: 'Oumar Sall', date: '15/03/2024 14:32', status: 'Résolu' },
  { id: 'SOSR-002', requester: 'Ibrahima Ba', role: 'Conducteur', phone: '+221 70 300 44 55', location: 'Guédiawaye', type: 'Agression', driver: '-', date: '14/03/2024 22:10', status: 'En cours' },
  { id: 'SOSR-003', requester: 'Moussa Ndiaye', role: 'Utilisateur', phone: '+221 76 234 56 78', location: 'Parcelles Assainies', type: 'Accident', driver: 'Cheikh Fall', date: '13/03/2024 11:45', status: 'Résolu' },
]

const statusStyle = {
  'Résolu': { color: '#2ed8a3', bg: '#e6faf4' },
  'En cours': { color: '#ffb64d', bg: '#fff8ee' },
  'Nouveau': { color: '#ff5370', bg: '#fff0f3' },
}

const typeStyle = {
  'Accident': { color: '#ff5370', bg: '#fff0f3' },
  'Agression': { color: '#6f42c1', bg: '#f3eeff' },
  'Panne': { color: '#ffb64d', bg: '#fff8ee' },
}

export default function SosRequestsPage() {
  const data = requests.map((r, i) => [
    i + 1,
    <span style={{ color: '#4680ff', fontWeight: 600 }}>{r.id}</span>,
    <div>
      <div style={{ fontWeight: 600, color: '#2d3748' }}>{r.requester}</div>
      <div style={{ fontSize: 12, color: '#718096' }}>{r.phone}</div>
      <Badge color="#6f42c1" bg="#f3eeff" style={{ marginTop: 4 }}>{r.role}</Badge>
    </div>,
    r.location,
    <Badge color={typeStyle[r.type]?.color || '#4680ff'} bg={typeStyle[r.type]?.bg || '#ebf4ff'}>{r.type}</Badge>,
    r.driver,
    r.date,
    <Badge color={statusStyle[r.status].color} bg={statusStyle[r.status].bg}>{r.status}</Badge>,
    <button style={{ padding: '4px 8px', background: '#4680ff', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer' }}><FiEye size={12} /></button>,
  ])

  return (
    <div>
      <PageHeader title="Demandes SOS" icon={<FiAlertCircle />}>
        <Btn color="#4680ff"><FiDownload size={14} /></Btn>
      </PageHeader>

      <div style={{
        display: 'flex',
        gap: 12,
        marginBottom: 16,
        flexWrap: 'wrap',
      }}>
        {[
          { label: 'Total', count: requests.length, color: '#4680ff', bg: '#ebf4ff' },
          { label: 'En cours', count: requests.filter(r => r.status === 'En cours').length, color: '#ffb64d', bg: '#fff8ee' },
          { label: 'Résolus', count: requests.filter(r => r.status === 'Résolu').length, color: '#2ed8a3', bg: '#e6faf4' },
        ].map((s, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 8, padding: '10px 16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <FiAlertCircle color={s.color} size={20} />
            <div>
              <div style={{ fontSize: 11, color: '#a0aec0' }}>{s.label}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: s.color }}>{s.count}</div>
            </div>
          </div>
        ))}
      </div>

      <FilterBar>
        <Select value="Tous statuts" onChange={() => {}} options={['Tous statuts', 'Nouveau', 'En cours', 'Résolu']} />
        <Select value="Tous types" onChange={() => {}} options={['Tous types', 'Accident', 'Agression', 'Panne']} />
        <Btn color="#4680ff">Filtrer</Btn>
      </FilterBar>

      <DataTable
        columns={['S.No', 'ID', 'Demandeur', 'Localisation', 'Type', 'Conducteur', 'Date', 'Statut', 'Détail']}
        data={data}
      />
    </div>
  )
}
