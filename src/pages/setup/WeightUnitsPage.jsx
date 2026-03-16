import { FiSliders, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { PageHeader, Btn, DataTable, Badge } from '../../components/PageLayout'

const units = [
  { id: 'WU-001', name: 'Kilogramme', symbol: 'kg', baseUnit: true, conversionRate: 1, status: 'Actif' },
  { id: 'WU-002', name: 'Gramme', symbol: 'g', baseUnit: false, conversionRate: 0.001, status: 'Actif' },
  { id: 'WU-003', name: 'Tonne', symbol: 't', baseUnit: false, conversionRate: 1000, status: 'Actif' },
  { id: 'WU-004', name: 'Livre', symbol: 'lb', baseUnit: false, conversionRate: 0.453592, status: 'Inactif' },
]

const statusStyle = {
  'Actif': { color: '#2ed8a3', bg: '#e6faf4' },
  'Inactif': { color: '#718096', bg: '#f7f9fb' },
}

export default function WeightUnitsPage() {
  const data = units.map((u, i) => [
    i + 1,
    <strong style={{ color: '#2d3748' }}>{u.name}</strong>,
    <code style={{ background: '#f0f0f0', padding: '2px 8px', borderRadius: 4 }}>{u.symbol}</code>,
    u.baseUnit ? <Badge color="#2ed8a3" bg="#e6faf4">Unité de base</Badge> : <span style={{ color: '#a0aec0', fontSize: 12 }}>—</span>,
    u.conversionRate,
    <Badge color={statusStyle[u.status].color} bg={statusStyle[u.status].bg}>{u.status}</Badge>,
    <div style={{ display: 'flex', gap: 5 }}>
      <button style={{ padding: '4px 8px', background: '#2ed8a3', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer' }}><FiEdit2 size={12} /></button>
      <button style={{ padding: '4px 8px', background: u.baseUnit ? '#ccc' : '#ff5370', border: 'none', borderRadius: 4, color: '#fff', cursor: u.baseUnit ? 'not-allowed' : 'pointer' }} disabled={u.baseUnit}><FiTrash2 size={12} /></button>
    </div>,
  ])

  return (
    <div>
      <PageHeader title="Unités de poids" icon={<FiSliders />}>
        <Btn color="#2ed8a3"><FiPlus size={14} /> Ajouter</Btn>
      </PageHeader>

      <DataTable
        columns={['S.No', 'Nom', 'Symbole', 'Type', 'Taux de conversion', 'Statut', 'Actions']}
        data={data}
      />
    </div>
  )
}
