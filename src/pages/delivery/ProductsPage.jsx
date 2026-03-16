import { FiPackage, FiPlus, FiDownload, FiInfo, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { PageHeader, Btn, FilterBar, Select, TextInput, DataTable, Badge } from '../../components/PageLayout'

const products = [
  { id: 'PRD-001', name: 'Colis Standard', category: 'Livraison', maxWeight: '5 kg', maxDim: '40x30x20 cm', price: '500 FCFA', status: 'Actif' },
  { id: 'PRD-002', name: 'Colis Express', category: 'Livraison Express', maxWeight: '2 kg', maxDim: '30x20x15 cm', price: '800 FCFA', status: 'Actif' },
  { id: 'PRD-003', name: 'Courrier Document', category: 'Documents', maxWeight: '0.5 kg', maxDim: '35x25x5 cm', price: '300 FCFA', status: 'Actif' },
  { id: 'PRD-004', name: 'Grand Colis', category: 'Livraison', maxWeight: '20 kg', maxDim: '80x60x50 cm', price: '1500 FCFA', status: 'Inactif' },
  { id: 'PRD-005', name: 'Alimentaire', category: 'Nourriture', maxWeight: '3 kg', maxDim: '40x40x40 cm', price: '600 FCFA', status: 'Actif' },
]

const statusStyle = {
  'Actif': { color: '#2ed8a3', bg: '#e6faf4' },
  'Inactif': { color: '#ff5370', bg: '#fff0f3' },
}

export default function ProductsPage() {
  const data = products.map((p, i) => [
    i + 1,
    <span style={{ color: '#4680ff', fontWeight: 600 }}>{p.id}</span>,
    <strong style={{ color: '#2d3748' }}>{p.name}</strong>,
    p.category,
    p.maxWeight,
    p.maxDim,
    <strong style={{ color: '#2d3748' }}>{p.price}</strong>,
    <Badge color={statusStyle[p.status].color} bg={statusStyle[p.status].bg}>{p.status}</Badge>,
    <div style={{ display: 'flex', gap: 5 }}>
      <button style={{ padding: '4px 8px', background: '#2ed8a3', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer' }}><FiEdit2 size={12} /></button>
      <button style={{ padding: '4px 8px', background: '#ff5370', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer' }}><FiTrash2 size={12} /></button>
    </div>,
  ])

  return (
    <div>
      <PageHeader title="Produits de livraison" icon={<FiPackage />}>
        <Btn color="#2ed8a3"><FiPlus size={14} /> Ajouter</Btn>
        <Btn color="#4680ff"><FiDownload size={14} /></Btn>
        <Btn color="#4680ff"><FiInfo size={14} /></Btn>
      </PageHeader>

      <FilterBar>
        <Select value="Toutes catégories" onChange={() => {}} options={['Toutes catégories', 'Livraison', 'Documents', 'Nourriture']} />
        <TextInput placeholder="Rechercher un produit..." value="" onChange={() => {}} />
        <Btn color="#4680ff">Rechercher</Btn>
        <Btn outline color="#6c757d">Réinitialiser</Btn>
      </FilterBar>

      <DataTable
        columns={['S.No', 'ID', 'Nom', 'Catégorie', 'Poids max', 'Dimensions max', 'Prix base', 'Statut', 'Actions']}
        data={data}
      />
    </div>
  )
}
