import { useState } from 'react'
import { FiTag, FiPlus, FiDownload, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { PageHeader, Btn, FilterBar, Select, TextInput, DataTable, Badge } from '../../components/PageLayout'

const codes = [
  { id: 'PRO-001', code: 'DAKAR2024', type: 'Pourcentage', value: '15%', minOrder: '500 FCFA', uses: 124, maxUses: 500, expiresOn: '31/03/2024', status: 'Actif' },
  { id: 'PRO-002', code: 'BIENVENUE', type: 'Montant fixe', value: '1000 FCFA', minOrder: '2000 FCFA', uses: 89, maxUses: 200, expiresOn: '30/06/2024', status: 'Actif' },
  { id: 'PRO-003', code: 'RAMADAN24', type: 'Pourcentage', value: '20%', minOrder: '1000 FCFA', uses: 200, maxUses: 200, expiresOn: '10/04/2024', status: 'Épuisé' },
  { id: 'PRO-004', code: 'NOEL2023', type: 'Montant fixe', value: '500 FCFA', minOrder: '1500 FCFA', uses: 156, maxUses: 300, expiresOn: '31/12/2023', status: 'Expiré' },
  { id: 'PRO-005', code: 'LIVRAISON5', type: 'Pourcentage', value: '5%', minOrder: '0 FCFA', uses: 12, maxUses: 1000, expiresOn: '31/12/2024', status: 'Actif' },
]

const statusStyle = {
  'Actif': { color: '#2ed8a3', bg: '#e6faf4' },
  'Épuisé': { color: '#ffb64d', bg: '#fff8ee' },
  'Expiré': { color: '#ff5370', bg: '#fff0f3' },
  'Inactif': { color: '#718096', bg: '#f7f9fb' },
}

export default function PromoCodesPage() {
  const [search, setSearch] = useState('')

  const data = codes.filter(c => !search || c.code.includes(search.toUpperCase())).map((c, i) => [
    i + 1,
    <code style={{ background: '#f0f0f0', padding: '3px 8px', borderRadius: 4, fontWeight: 700, letterSpacing: 1 }}>{c.code}</code>,
    <Badge color="#6f42c1" bg="#f3eeff">{c.type}</Badge>,
    <strong style={{ color: '#2d3748' }}>{c.value}</strong>,
    c.minOrder,
    `${c.uses} / ${c.maxUses}`,
    c.expiresOn,
    <Badge color={statusStyle[c.status].color} bg={statusStyle[c.status].bg}>{c.status}</Badge>,
    <div style={{ display: 'flex', gap: 5 }}>
      <button style={{ padding: '4px 8px', background: '#2ed8a3', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer' }}><FiEdit2 size={12} /></button>
      <button style={{ padding: '4px 8px', background: '#ff5370', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer' }}><FiTrash2 size={12} /></button>
    </div>,
  ])

  return (
    <div>
      <PageHeader title="Codes promo" icon={<FiTag />}>
        <Btn color="#2ed8a3"><FiPlus size={14} /> Ajouter</Btn>
        <Btn color="#4680ff"><FiDownload size={14} /></Btn>
      </PageHeader>

      <FilterBar>
        <Select value="Tous statuts" onChange={() => {}} options={['Tous statuts', 'Actif', 'Épuisé', 'Expiré']} />
        <TextInput placeholder="Chercher un code..." value={search} onChange={e => setSearch(e.target.value)} />
        <Btn color="#4680ff">Rechercher</Btn>
        <Btn outline color="#6c757d" onClick={() => setSearch('')}>Réinitialiser</Btn>
      </FilterBar>

      <DataTable
        columns={['S.No', 'Code', 'Type', 'Valeur', 'Commande min', 'Utilisations', 'Expire le', 'Statut', 'Actions']}
        data={data}
      />
    </div>
  )
}
