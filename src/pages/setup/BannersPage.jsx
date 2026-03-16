import { FiImage, FiPlus, FiDownload, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { PageHeader, Btn, FilterBar, Select, DataTable, Badge } from '../../components/PageLayout'

const banners = [
  { id: 'BAN-001', title: 'Promotion Ramadan', position: 'Accueil haut', type: 'Image', target: 'Tous', startDate: '01/03/2024', endDate: '10/04/2024', clicks: 1240, status: 'Actif' },
  { id: 'BAN-002', title: 'Nouveau service taxi', position: 'Accueil milieu', type: 'Texte', target: 'Utilisateurs', startDate: '15/02/2024', endDate: '15/04/2024', clicks: 890, status: 'Actif' },
  { id: 'BAN-003', title: 'Offre conducteur', position: 'Inscription', type: 'Image', target: 'Conducteurs', startDate: '01/01/2024', endDate: '31/12/2024', clicks: 345, status: 'Inactif' },
]

const statusStyle = {
  'Actif': { color: '#2ed8a3', bg: '#e6faf4' },
  'Inactif': { color: '#718096', bg: '#f7f9fb' },
}

export default function BannersPage() {
  const data = banners.map((b, i) => [
    i + 1,
    <strong style={{ color: '#2d3748' }}>{b.title}</strong>,
    b.position,
    <Badge color="#6f42c1" bg="#f3eeff">{b.type}</Badge>,
    b.target,
    b.startDate,
    b.endDate,
    <strong style={{ color: '#4680ff' }}>{b.clicks.toLocaleString()}</strong>,
    <Badge color={statusStyle[b.status].color} bg={statusStyle[b.status].bg}>{b.status}</Badge>,
    <div style={{ display: 'flex', gap: 5 }}>
      <button style={{ padding: '4px 8px', background: '#2ed8a3', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer' }}><FiEdit2 size={12} /></button>
      <button style={{ padding: '4px 8px', background: '#ff5370', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer' }}><FiTrash2 size={12} /></button>
    </div>,
  ])

  return (
    <div>
      <PageHeader title="Gestion des bannières" icon={<FiImage />}>
        <Btn color="#2ed8a3"><FiPlus size={14} /> Ajouter</Btn>
        <Btn color="#4680ff"><FiDownload size={14} /></Btn>
      </PageHeader>

      <FilterBar>
        <Select value="Tous statuts" onChange={() => {}} options={['Tous statuts', 'Actif', 'Inactif']} />
        <Select value="Toutes positions" onChange={() => {}} options={['Toutes positions', 'Accueil haut', 'Accueil milieu', 'Inscription']} />
        <Btn color="#4680ff">Filtrer</Btn>
      </FilterBar>

      <DataTable
        columns={['S.No', 'Titre', 'Position', 'Type', 'Cible', 'Début', 'Fin', 'Clics', 'Statut', 'Actions']}
        data={data}
      />
    </div>
  )
}
