import { FiType, FiDownload } from 'react-icons/fi'
import { PageHeader, Btn, FilterBar, Select, TextInput } from '../../components/PageLayout'

const strings = [
  { key: 'v2_onboarding_title', en: 'Get Started', fr: 'Commencer' },
  { key: 'v2_onboarding_subtitle', en: 'Your trusted transport partner', fr: 'Votre partenaire de transport de confiance' },
  { key: 'v2_request_ride', en: 'Request a Ride', fr: 'Demander une course' },
  { key: 'v2_track_delivery', en: 'Track Delivery', fr: 'Suivre la livraison' },
  { key: 'v2_driver_earnings', en: 'Today\'s Earnings', fr: 'Gains du jour' },
  { key: 'v2_notifications', en: 'Notifications', fr: 'Notifications' },
  { key: 'v2_wallet_balance', en: 'Wallet Balance', fr: 'Solde portefeuille' },
]

export default function AppStringsV2Page() {
  return (
    <div>
      <PageHeader title="Chaînes d'application v2" icon={<FiType />}>
        <Btn color="#4680ff"><FiDownload size={14} /> Exporter</Btn>
      </PageHeader>

      <div style={{ background: '#ebf4ff', border: '1px solid #4680ff', borderRadius: 8, padding: '10px 16px', marginBottom: 16, fontSize: 13, color: '#2b4ea8' }}>
        Version 2 des chaînes — utilisées dans les nouvelles versions de l'application mobile (v2.0+).
      </div>

      <FilterBar>
        <Select value="Français" onChange={() => {}} options={['Français', 'English', 'Wolof']} />
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
                <td style={{ padding: '10px 14px', fontSize: 13, color: '#4a5568' }}>{s.en}</td>
                <td style={{ padding: '10px 14px', fontSize: 13, color: '#4a5568' }}>{s.fr}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
