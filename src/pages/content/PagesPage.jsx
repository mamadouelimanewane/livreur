import { FiLayout, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { PageHeader, Btn, DataTable, Badge } from '../../components/PageLayout'

const pages = [
  { id: 'PG-001', name: 'Conditions d\'utilisation', slug: 'terms', lang: 'FR', updatedAt: '10/01/2024', status: 'Publié' },
  { id: 'PG-002', name: 'Politique de confidentialité', slug: 'privacy', lang: 'FR', updatedAt: '10/01/2024', status: 'Publié' },
  { id: 'PG-003', name: 'À propos', slug: 'about', lang: 'FR', updatedAt: '05/02/2024', status: 'Publié' },
  { id: 'PG-004', name: 'FAQ', slug: 'faq', lang: 'FR', updatedAt: '15/02/2024', status: 'Brouillon' },
  { id: 'PG-005', name: 'Aide', slug: 'help', lang: 'FR', updatedAt: '01/03/2024', status: 'Publié' },
]

const statusStyle = {
  'Publié': { color: '#2ed8a3', bg: '#e6faf4' },
  'Brouillon': { color: '#718096', bg: '#f7f9fb' },
}

export default function PagesPage() {
  const data = pages.map((p, i) => [
    i + 1,
    <strong style={{ color: '#2d3748' }}>{p.name}</strong>,
    <code style={{ background: '#f0f0f0', padding: '2px 8px', borderRadius: 4, fontSize: 12 }}>/{p.slug}</code>,
    p.lang,
    p.updatedAt,
    <Badge color={statusStyle[p.status].color} bg={statusStyle[p.status].bg}>{p.status}</Badge>,
    <div style={{ display: 'flex', gap: 5 }}>
      <button style={{ padding: '4px 8px', background: '#2ed8a3', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer' }}><FiEdit2 size={12} /></button>
      <button style={{ padding: '4px 8px', background: '#ff5370', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer' }}><FiTrash2 size={12} /></button>
    </div>,
  ])

  return (
    <div>
      <PageHeader title="Types de pages" icon={<FiLayout />}>
        <Btn color="#2ed8a3"><FiPlus size={14} /> Ajouter</Btn>
      </PageHeader>
      <DataTable columns={['S.No', 'Titre', 'Slug', 'Langue', 'Mis à jour', 'Statut', 'Actions']} data={data} />
    </div>
  )
}
