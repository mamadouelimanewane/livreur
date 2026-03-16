import { FiTruck, FiDownload, FiClock } from 'react-icons/fi'
import { PageHeader, Btn, FilterBar, Select, Badge } from '../../components/PageLayout'

const reports = [
  { id: 'DRV-001', name: 'Oumar Sall', zone: 'Dakar Centre', loginTime: '07:30', logoutTime: '19:45', totalHours: '12h 15min', rides: 8, status: 'Hors ligne' },
  { id: 'DRV-002', name: 'Cheikh Fall', zone: 'Plateau', loginTime: '08:00', logoutTime: '-', totalHours: '9h 20min', rides: 5, status: 'En ligne' },
  { id: 'DRV-003', name: 'Ibrahima Ba', zone: 'Parcelles', loginTime: '06:15', logoutTime: '18:00', totalHours: '11h 45min', rides: 12, status: 'Hors ligne' },
  { id: 'DRV-005', name: 'Abdoulaye Mbaye', zone: 'Dakar Sud', loginTime: '09:00', logoutTime: '-', totalHours: '7h 05min', rides: 4, status: 'En ligne' },
]

const statusStyle = {
  'En ligne': { color: '#2ed8a3', bg: '#e6faf4' },
  'Hors ligne': { color: '#718096', bg: '#f7f9fb' },
}

export default function OnlineReportPage() {
  return (
    <div>
      <PageHeader title="Rapport en ligne du conducteur" icon={<FiClock />}>
        <Btn color="#4680ff"><FiDownload size={14} /></Btn>
      </PageHeader>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
        {[
          { label: 'Conducteurs en ligne', value: 2, color: '#2ed8a3', bg: '#e6faf4' },
          { label: 'Conducteurs hors ligne', value: 2, color: '#718096', bg: '#f7f9fb' },
          { label: 'Total heures aujourd\'hui', value: '40h 25min', color: '#4680ff', bg: '#ebf4ff' },
        ].map((s, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 8, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <FiClock color={s.color} size={20} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#a0aec0', fontWeight: 600, textTransform: 'uppercase' }}>{s.label}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#2d3748' }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      <FilterBar>
        <Select value="Aujourd'hui" onChange={() => {}} options={["Aujourd'hui", 'Hier', 'Cette semaine', 'Ce mois']} />
        <Select value="Toutes zones" onChange={() => {}} options={['Toutes zones', 'Dakar Centre', 'Plateau', 'Parcelles']} />
        <Btn color="#4680ff">Filtrer</Btn>
      </FilterBar>

      <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f6f7fb' }}>
              {['S.No', 'ID', 'Conducteur', 'Zone', 'Connexion', 'Déconnexion', 'Total heures', 'Courses', 'Statut'].map((h, i) => (
                <th key={i} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#718096', borderBottom: '1px solid #edf2f7', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reports.map((r, i) => (
              <tr key={r.id} style={{ borderBottom: '1px solid #f7f9fb' }}
                onMouseEnter={e => e.currentTarget.style.background = '#fafbff'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '10px 14px', fontSize: 13, color: '#718096' }}>{i + 1}</td>
                <td style={{ padding: '10px 14px' }}><span style={{ color: '#4680ff', fontWeight: 600 }}>{r.id}</span></td>
                <td style={{ padding: '10px 14px', fontWeight: 600, color: '#2d3748', fontSize: 13 }}>{r.name}</td>
                <td style={{ padding: '10px 14px', fontSize: 13 }}>{r.zone}</td>
                <td style={{ padding: '10px 14px', fontSize: 13 }}>{r.loginTime}</td>
                <td style={{ padding: '10px 14px', fontSize: 13, color: r.logoutTime === '-' ? '#a0aec0' : '#4a5568' }}>{r.logoutTime}</td>
                <td style={{ padding: '10px 14px' }}><span style={{ background: '#ebf4ff', color: '#4680ff', borderRadius: 12, padding: '3px 10px', fontSize: 12, fontWeight: 600 }}>{r.totalHours}</span></td>
                <td style={{ padding: '10px 14px', fontSize: 13, textAlign: 'center' }}>{r.rides}</td>
                <td style={{ padding: '10px 14px' }}>
                  <Badge color={statusStyle[r.status].color} bg={statusStyle[r.status].bg}>{r.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
