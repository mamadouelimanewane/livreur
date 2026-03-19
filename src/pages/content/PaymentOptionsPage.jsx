import { FiCreditCard, FiPlus, FiEdit2 } from 'react-icons/fi'
import { PageHeader, Btn, DataTable, Badge } from '../../components/PageLayout'

const options = [
  { id: 'PAY-001', name: 'Cash', icon: '💵', type: 'Espèces', country: 'Sénégal', forUser: true, forDriver: true, status: 'Actif' },
  { id: 'PAY-002', name: 'Wave', icon: '🌊', type: 'Mobile Money', country: 'Sénégal', forUser: true, forDriver: true, status: 'Actif' },
  { id: 'PAY-003', name: 'Orange Money', icon: '🟠', type: 'Mobile Money', country: 'Sénégal', forUser: true, forDriver: false, status: 'Actif' },
  { id: 'PAY-004', name: 'Carte bancaire', icon: '💳', type: 'Carte', country: 'Sénégal', forUser: true, forDriver: false, status: 'Inactif' },
  { id: 'PAY-005', name: 'Portefeuille LiviGo', icon: '👛', type: 'Portefeuille', country: 'Tous', forUser: true, forDriver: true, status: 'Actif' },
]

const yes = <Badge color="#2ed8a3" bg="#e6faf4">Oui</Badge>
const no = <Badge color="#718096" bg="#f7f9fb">Non</Badge>

export default function PaymentOptionsPage() {
  const data = options.map((p, i) => [
    i + 1,
    <span style={{ fontSize: 22 }}>{p.icon}</span>,
    <strong style={{ color: '#2d3748' }}>{p.name}</strong>,
    <Badge color="#6f42c1" bg="#f3eeff">{p.type}</Badge>,
    p.country,
    p.forUser ? yes : no,
    p.forDriver ? yes : no,
    <Badge color={p.status === 'Actif' ? '#2ed8a3' : '#718096'} bg={p.status === 'Actif' ? '#e6faf4' : '#f7f9fb'}>{p.status}</Badge>,
    <button style={{ padding: '4px 8px', background: '#2ed8a3', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer' }}><FiEdit2 size={12} /></button>,
  ])

  return (
    <div>
      <PageHeader title="Options de paiement" icon={<FiCreditCard />}>
        <Btn color="#2ed8a3"><FiPlus size={14} /> Ajouter</Btn>
      </PageHeader>
      <DataTable
        columns={['S.No', 'Icône', 'Nom', 'Type', 'Pays', 'Utilisateur', 'Conducteur', 'Statut', 'Action']}
        data={data}
      />
    </div>
  )
}
