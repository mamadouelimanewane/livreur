import { FiCode, FiDownload } from 'react-icons/fi'
import { PageHeader, Btn, FilterBar, Select, TextInput } from '../../components/PageLayout'

const strings = [
  { key: 'admin_dashboard', en: 'Dashboard', fr: 'Tableau de bord' },
  { key: 'admin_drivers', en: 'Drivers', fr: 'Conducteurs' },
  { key: 'admin_rides', en: 'Rides', fr: 'Courses' },
  { key: 'admin_users', en: 'Users', fr: 'Utilisateurs' },
  { key: 'admin_settings', en: 'Settings', fr: 'Paramètres' },
  { key: 'admin_reports', en: 'Reports', fr: 'Rapports' },
  { key: 'admin_approve', en: 'Approve', fr: 'Approuver' },
  { key: 'admin_reject', en: 'Reject', fr: 'Rejeter' },
  { key: 'admin_export', en: 'Export', fr: 'Exporter' },
  { key: 'admin_search', en: 'Search', fr: 'Rechercher' },
]

export default function AdminStringsPage() {
  return (
    <div>
      <PageHeader title="Chaînes administrateur" icon={<FiCode />}>
        <Btn color="#4680ff"><FiDownload size={14} /> Exporter</Btn>
      </PageHeader>

      <FilterBar>
        <Select value="Français" onChange={() => {}} options={['Français', 'English']} />
        <TextInput placeholder="Rechercher..." value="" onChange={() => {}} />
        <Btn color="#4680ff">Rechercher</Btn>
      </FilterBar>

      <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f6f7fb' }}>
              {['S.No', 'Clé', 'English', 'Français'].map((h, i) => (
                <th key={i} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#718096', borderBottom: '1px solid #edf2f7' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {strings.map((s, i) => (
              <tr key={s.key} style={{ borderBottom: '1px solid #f7f9fb' }}
                onMouseEnter={e => e.currentTarget.style.background = '#fafbff'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '10px 14px', fontSize: 13, color: '#718096' }}>{i + 1}</td>
                <td style={{ padding: '10px 14px' }}>
                  <code style={{ background: '#f0f0f0', padding: '2px 8px', borderRadius: 4, fontSize: 12 }}>{s.key}</code>
                </td>
                <td style={{ padding: '10px 14px', fontSize: 13 }}>{s.en}</td>
                <td style={{ padding: '10px 14px', fontSize: 13 }}>{s.fr}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
