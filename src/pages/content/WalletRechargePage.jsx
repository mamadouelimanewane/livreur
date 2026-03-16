import { FiDollarSign, FiDownload, FiPlus, FiEye } from 'react-icons/fi'
import { PageHeader, Btn, FilterBar, Select, TextInput, DataTable, Badge } from '../../components/PageLayout'

const recharges = [
  { id: 'WR-001', user: 'Fatou Diallo', phone: '+221 77 123 45 67', amount: '5 000 FCFA', method: 'Wave', txRef: 'WV-20240315-001', date: '15/03/2024 10:32', status: 'Réussi' },
  { id: 'WR-002', user: 'Moussa Ndiaye', phone: '+221 76 234 56 78', amount: '10 000 FCFA', method: 'Orange Money', txRef: 'OM-20240315-002', date: '15/03/2024 11:15', status: 'Réussi' },
  { id: 'WR-003', user: 'Ibrahim Touré', phone: '+221 77 456 78 90', amount: '2 500 FCFA', method: 'Wave', txRef: 'WV-20240314-003', date: '14/03/2024 16:45', status: 'Échoué' },
  { id: 'WR-004', user: 'Aminata Koné', phone: '+221 70 345 67 89', amount: '25 000 FCFA', method: 'Carte bancaire', txRef: 'CB-20240314-004', date: '14/03/2024 14:00', status: 'En attente' },
  { id: 'WR-005', user: 'Mariama Balde', phone: '+221 76 567 89 01', amount: '3 000 FCFA', method: 'Wave', txRef: 'WV-20240313-005', date: '13/03/2024 09:30', status: 'Réussi' },
]

const statusStyle = {
  'Réussi': { color: '#2ed8a3', bg: '#e6faf4' },
  'Échoué': { color: '#ff5370', bg: '#fff0f3' },
  'En attente': { color: '#ffb64d', bg: '#fff8ee' },
}

export default function WalletRechargePage() {
  const data = recharges.map((r, i) => [
    i + 1,
    <span style={{ color: '#4680ff', fontWeight: 600 }}>{r.id}</span>,
    <div>
      <div style={{ fontWeight: 600, color: '#2d3748' }}>{r.user}</div>
      <div style={{ fontSize: 12, color: '#718096' }}>{r.phone}</div>
    </div>,
    <strong style={{ color: '#2d3748' }}>{r.amount}</strong>,
    r.method,
    <code style={{ fontSize: 11, background: '#f0f0f0', padding: '2px 6px', borderRadius: 4 }}>{r.txRef}</code>,
    r.date,
    <Badge color={statusStyle[r.status].color} bg={statusStyle[r.status].bg}>{r.status}</Badge>,
    <button style={{ padding: '4px 8px', background: '#4680ff', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer' }}><FiEye size={12} /></button>,
  ])

  return (
    <div>
      <PageHeader title="Recharges de portefeuille" icon={<FiDollarSign />}>
        <Btn color="#2ed8a3"><FiPlus size={14} /> Recharge manuelle</Btn>
        <Btn color="#4680ff"><FiDownload size={14} /></Btn>
      </PageHeader>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
        {[
          { label: 'Total rechargé (aujourd\'hui)', value: '45 500 FCFA', color: '#2ed8a3' },
          { label: 'Transactions réussies', value: 3, color: '#4680ff' },
          { label: 'Transactions échouées', value: 1, color: '#ff5370' },
        ].map((s, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 8, padding: '14px 18px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: 11, color: '#a0aec0', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <FilterBar>
        <Select value="Tous statuts" onChange={() => {}} options={['Tous statuts', 'Réussi', 'Échoué', 'En attente']} />
        <Select value="Tous moyens" onChange={() => {}} options={['Tous moyens', 'Wave', 'Orange Money', 'Carte bancaire']} />
        <TextInput placeholder="Ref. transaction ou utilisateur..." value="" onChange={() => {}} />
        <Btn color="#4680ff">Rechercher</Btn>
      </FilterBar>

      <DataTable
        columns={['S.No', 'ID', 'Utilisateur', 'Montant', 'Méthode', 'Réf. transaction', 'Date', 'Statut', 'Détail']}
        data={data}
      />
    </div>
  )
}
