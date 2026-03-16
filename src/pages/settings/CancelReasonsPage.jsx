import { FiXCircle, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { PageHeader, Btn, FilterBar, Select, DataTable, Badge } from '../../components/PageLayout'

const reasons = [
  { id: 'CR-001', reason: 'Conducteur trop loin', applicableTo: 'Utilisateur', type: 'Moto Taxi', order: 1, status: 'Actif' },
  { id: 'CR-002', reason: 'Attente trop longue', applicableTo: 'Utilisateur', type: 'Tous', order: 2, status: 'Actif' },
  { id: 'CR-003', reason: 'Changement de destination', applicableTo: 'Utilisateur', type: 'Tous', order: 3, status: 'Actif' },
  { id: 'CR-004', reason: 'Commande passée par erreur', applicableTo: 'Utilisateur', type: 'Tous', order: 4, status: 'Actif' },
  { id: 'CR-005', reason: 'Panne de véhicule', applicableTo: 'Conducteur', type: 'Tous', order: 1, status: 'Actif' },
  { id: 'CR-006', reason: 'Adresse introuvable', applicableTo: 'Conducteur', type: 'Livraison', order: 2, status: 'Actif' },
  { id: 'CR-007', reason: 'Urgence personnelle', applicableTo: 'Conducteur', type: 'Tous', order: 3, status: 'Inactif' },
]

const toStyle = {
  'Utilisateur': { color: '#4680ff', bg: '#ebf4ff' },
  'Conducteur': { color: '#6f42c1', bg: '#f3eeff' },
}

export default function CancelReasonsPage() {
  const data = reasons.map((r, i) => [
    i + 1,
    <strong style={{ color: '#2d3748' }}>{r.reason}</strong>,
    <Badge color={toStyle[r.applicableTo].color} bg={toStyle[r.applicableTo].bg}>{r.applicableTo}</Badge>,
    r.type,
    r.order,
    <Badge color={r.status === 'Actif' ? '#2ed8a3' : '#718096'} bg={r.status === 'Actif' ? '#e6faf4' : '#f7f9fb'}>{r.status}</Badge>,
    <div style={{ display: 'flex', gap: 5 }}>
      <button style={{ padding: '4px 8px', background: '#2ed8a3', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer' }}><FiEdit2 size={12} /></button>
      <button style={{ padding: '4px 8px', background: '#ff5370', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer' }}><FiTrash2 size={12} /></button>
    </div>,
  ])

  return (
    <div>
      <PageHeader title="Raisons d'annulation" icon={<FiXCircle />}>
        <Btn color="#2ed8a3"><FiPlus size={14} /> Ajouter</Btn>
      </PageHeader>

      <FilterBar>
        <Select value="Tous" onChange={() => {}} options={['Tous', 'Utilisateur', 'Conducteur']} />
        <Select value="Tous services" onChange={() => {}} options={['Tous services', 'Moto Taxi', 'Livraison', 'Taxi Premium']} />
        <Btn color="#4680ff">Filtrer</Btn>
      </FilterBar>

      <DataTable
        columns={['S.No', 'Raison', 'Applicable à', 'Service', 'Ordre', 'Statut', 'Actions']}
        data={data}
      />
    </div>
  )
}
