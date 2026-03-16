import { FiMapPin, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { PageHeader, Btn, DataTable, Badge } from '../../components/PageLayout'

const markers = [
  { id: 'MK-001', name: 'Marqueur conducteur en ligne', type: 'Conducteur', color: '#2ed8a3', icon: '🟢', usedIn: 'Carte principale', status: 'Actif' },
  { id: 'MK-002', name: 'Marqueur conducteur hors ligne', type: 'Conducteur', color: '#718096', icon: '⚫', usedIn: 'Carte principale', status: 'Actif' },
  { id: 'MK-003', name: 'Marqueur conducteur en course', type: 'Conducteur', color: '#4680ff', icon: '🔵', usedIn: 'Carte principale', status: 'Actif' },
  { id: 'MK-004', name: 'Point de départ', type: 'Course', color: '#2ed8a3', icon: '🟩', usedIn: 'Course active', status: 'Actif' },
  { id: 'MK-005', name: 'Point d\'arrivée', type: 'Course', color: '#ff5370', icon: '🟥', usedIn: 'Course active', status: 'Actif' },
]

export default function MapMarkersPage() {
  const data = markers.map((m, i) => [
    i + 1,
    <span style={{ fontSize: 20 }}>{m.icon}</span>,
    <strong style={{ color: '#2d3748' }}>{m.name}</strong>,
    <Badge color="#6f42c1" bg="#f3eeff">{m.type}</Badge>,
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 20, height: 20, borderRadius: '50%', background: m.color }} />
      <code style={{ fontSize: 11 }}>{m.color}</code>
    </div>,
    m.usedIn,
    <div style={{ display: 'flex', gap: 5 }}>
      <button style={{ padding: '4px 8px', background: '#2ed8a3', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer' }}><FiEdit2 size={12} /></button>
      <button style={{ padding: '4px 8px', background: '#ff5370', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer' }}><FiTrash2 size={12} /></button>
    </div>,
  ])

  return (
    <div>
      <PageHeader title="Marqueurs de carte" icon={<FiMapPin />}>
        <Btn color="#2ed8a3"><FiPlus size={14} /> Ajouter</Btn>
      </PageHeader>

      <DataTable
        columns={['S.No', 'Aperçu', 'Nom', 'Type', 'Couleur', 'Utilisé dans', 'Actions']}
        data={data}
      />
    </div>
  )
}
