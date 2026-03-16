import { FiCreditCard, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { PageHeader, Btn, FilterBar, Select, DataTable, Badge } from '../../components/PageLayout'

const cards = [
  { id: 'PC-001', name: 'Forfait Économique', service: 'Moto Taxi', target: 'Utilisateur', price: '25 000 FCFA/mois', rides: 50, discount: '10%', status: 'Actif' },
  { id: 'PC-002', name: 'Forfait Standard', service: 'Moto Taxi', target: 'Utilisateur', price: '45 000 FCFA/mois', rides: 100, discount: '15%', status: 'Actif' },
  { id: 'PC-003', name: 'Forfait Premium', service: 'Tous', target: 'Utilisateur', price: '80 000 FCFA/mois', rides: 200, discount: '20%', status: 'Actif' },
  { id: 'PC-004', name: 'Pack Conducteur Base', service: 'Tous', target: 'Conducteur', price: '5 000 FCFA/mois', rides: null, discount: '5%', status: 'Actif' },
  { id: 'PC-005', name: 'Pack Conducteur Pro', service: 'Tous', target: 'Conducteur', price: '10 000 FCFA/mois', rides: null, discount: '10%', status: 'Inactif' },
]

const targetStyle = {
  'Utilisateur': { color: '#4680ff', bg: '#ebf4ff' },
  'Conducteur': { color: '#6f42c1', bg: '#f3eeff' },
}

export default function PriceCardsPage() {
  const data = cards.map((c, i) => [
    i + 1,
    <strong style={{ color: '#2d3748' }}>{c.name}</strong>,
    c.service,
    <Badge color={targetStyle[c.target].color} bg={targetStyle[c.target].bg}>{c.target}</Badge>,
    <strong>{c.price}</strong>,
    c.rides ? `${c.rides} courses` : '∞ Illimité',
    <Badge color="#ffb64d" bg="#fff8ee">{c.discount}</Badge>,
    <Badge color={c.status === 'Actif' ? '#2ed8a3' : '#718096'} bg={c.status === 'Actif' ? '#e6faf4' : '#f7f9fb'}>{c.status}</Badge>,
    <div style={{ display: 'flex', gap: 5 }}>
      <button style={{ padding: '4px 8px', background: '#2ed8a3', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer' }}><FiEdit2 size={12} /></button>
      <button style={{ padding: '4px 8px', background: '#ff5370', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer' }}><FiTrash2 size={12} /></button>
    </div>,
  ])

  return (
    <div>
      <PageHeader title="Cartes tarifaires" icon={<FiCreditCard />}>
        <Btn color="#2ed8a3"><FiPlus size={14} /> Ajouter</Btn>
      </PageHeader>

      <FilterBar>
        <Select value="Tous" onChange={() => {}} options={['Tous', 'Utilisateur', 'Conducteur']} />
        <Select value="Tous services" onChange={() => {}} options={['Tous services', 'Moto Taxi', 'Livraison Express', 'Taxi Premium']} />
        <Btn color="#4680ff">Filtrer</Btn>
      </FilterBar>

      <DataTable
        columns={['S.No', 'Nom', 'Service', 'Cible', 'Prix', 'Courses incluses', 'Remise', 'Statut', 'Actions']}
        data={data}
      />
    </div>
  )
}
