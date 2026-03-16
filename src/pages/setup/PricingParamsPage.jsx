import { FiDollarSign, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { PageHeader, Btn, FilterBar, Select, DataTable, Badge } from '../../components/PageLayout'

const params = [
  { id: 'PP-001', name: 'Prix de base', service: 'Moto Taxi', zone: 'Dakar Centre', value: '300 FCFA', type: 'Fixe', status: 'Actif' },
  { id: 'PP-002', name: 'Prix par km', service: 'Moto Taxi', zone: 'Dakar Centre', value: '150 FCFA/km', type: 'Variable', status: 'Actif' },
  { id: 'PP-003', name: 'Prix de base', service: 'Livraison Express', zone: 'Dakar Centre', value: '500 FCFA', type: 'Fixe', status: 'Actif' },
  { id: 'PP-004', name: 'Prix par kg', service: 'Livraison Express', zone: 'Dakar Centre', value: '100 FCFA/kg', type: 'Variable', status: 'Actif' },
  { id: 'PP-005', name: 'Surcharge nuit', service: 'Tous', zone: 'Toutes zones', value: '+20%', type: 'Pourcentage', status: 'Actif' },
  { id: 'PP-006', name: 'Surcharge weekend', service: 'Tous', zone: 'Toutes zones', value: '+15%', type: 'Pourcentage', status: 'Inactif' },
]

const typeStyle = {
  'Fixe': { color: '#2ed8a3', bg: '#e6faf4' },
  'Variable': { color: '#4680ff', bg: '#ebf4ff' },
  'Pourcentage': { color: '#ffb64d', bg: '#fff8ee' },
}

export default function PricingParamsPage() {
  const data = params.map((p, i) => [
    i + 1,
    <strong style={{ color: '#2d3748' }}>{p.name}</strong>,
    p.service,
    p.zone,
    <strong style={{ color: '#2d3748' }}>{p.value}</strong>,
    <Badge color={typeStyle[p.type].color} bg={typeStyle[p.type].bg}>{p.type}</Badge>,
    <Badge color={p.status === 'Actif' ? '#2ed8a3' : '#718096'} bg={p.status === 'Actif' ? '#e6faf4' : '#f7f9fb'}>{p.status}</Badge>,
    <div style={{ display: 'flex', gap: 5 }}>
      <button style={{ padding: '4px 8px', background: '#2ed8a3', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer' }}><FiEdit2 size={12} /></button>
      <button style={{ padding: '4px 8px', background: '#ff5370', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer' }}><FiTrash2 size={12} /></button>
    </div>,
  ])

  return (
    <div>
      <PageHeader title="Paramètres de tarification" icon={<FiDollarSign />}>
        <Btn color="#2ed8a3"><FiPlus size={14} /> Ajouter</Btn>
      </PageHeader>

      <FilterBar>
        <Select value="Tous services" onChange={() => {}} options={['Tous services', 'Moto Taxi', 'Livraison Express', 'Taxi Premium']} />
        <Select value="Toutes zones" onChange={() => {}} options={['Toutes zones', 'Dakar Centre', 'Plateau', 'Parcelles']} />
        <Btn color="#4680ff">Filtrer</Btn>
      </FilterBar>

      <DataTable
        columns={['S.No', 'Paramètre', 'Service', 'Zone', 'Valeur', 'Type', 'Statut', 'Actions']}
        data={data}
      />
    </div>
  )
}
