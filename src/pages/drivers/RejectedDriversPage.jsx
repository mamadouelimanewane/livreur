import { FiTruck, FiDownload } from 'react-icons/fi'
import { PageHeader, Btn, FilterBar, Select, TextInput, DataTable, Badge } from '../../components/PageLayout'

const drivers = [
  { id: 'DRV-030', name: 'Demba Sow', phone: '+221 77 888 11 22', email: 'demba.sow@gmail.com', zone: 'Dakar', reason: 'Documents invalides', rejectedDate: '08/03/2024' },
  { id: 'DRV-031', name: 'Astou Dieye', phone: '+221 76 999 22 33', email: 'astou.dieye@yahoo.fr', zone: 'Thiès', reason: 'Antécédents négatifs', rejectedDate: '09/03/2024' },
]

export default function RejectedDriversPage() {
  const data = drivers.map((d, i) => [
    i + 1,
    <span style={{ color: '#4680ff', fontWeight: 600 }}>{d.id}</span>,
    <div>
      <div style={{ fontWeight: 600, color: '#2d3748' }}>{d.name}</div>
      <div style={{ fontSize: 12, color: '#718096' }}>{d.phone}</div>
      <div style={{ fontSize: 12, color: '#718096' }}>{d.email}</div>
    </div>,
    d.zone,
    <span style={{ fontSize: 12, color: '#ff5370' }}>{d.reason}</span>,
    d.rejectedDate,
    <Badge color="#ff5370" bg="#fff0f3">Rejeté</Badge>,
  ])

  return (
    <div>
      <PageHeader title="Conducteurs rejetés" icon={<FiTruck />}>
        <Btn color="#4680ff"><FiDownload size={14} /></Btn>
      </PageHeader>

      <FilterBar>
        <Select value="Toutes zones" onChange={() => {}} options={['Toutes zones', 'Dakar', 'Thiès']} />
        <TextInput placeholder="Rechercher..." value="" onChange={() => {}} />
        <Btn color="#4680ff">Rechercher</Btn>
        <Btn outline color="#6c757d">Réinitialiser</Btn>
      </FilterBar>

      {drivers.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 8, padding: 40, textAlign: 'center', color: '#a0aec0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          Aucun conducteur rejeté
        </div>
      ) : (
        <DataTable
          columns={['S.No', 'ID', 'Conducteur', 'Zone', 'Raison du rejet', 'Date de rejet', 'Statut']}
          data={data}
        />
      )}
    </div>
  )
}
