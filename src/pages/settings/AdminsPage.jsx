import { FiUsers, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { PageHeader, Btn, FilterBar, TextInput, DataTable, Badge } from '../../components/PageLayout'

const admins = [
  { id: 'ADM-001', name: 'Super Admin', email: 'admin@sur.sn', role: 'Super Administrateur', lastLogin: '15/03/2024 08:00', status: 'Actif' },
  { id: 'ADM-002', name: 'Aminata Sow', email: 'aminata@sur.sn', role: 'Administrateur', lastLogin: '15/03/2024 09:30', status: 'Actif' },
  { id: 'ADM-003', name: 'Mamadou Diallo', email: 'mamadou@sur.sn', role: 'Support', lastLogin: '14/03/2024 18:00', status: 'Actif' },
  { id: 'ADM-004', name: 'Khadija Ndiaye', email: 'khadija@sur.sn', role: 'Finance', lastLogin: '10/03/2024 10:00', status: 'Inactif' },
]

const roleStyle = {
  'Super Administrateur': { color: '#ff5370', bg: '#fff0f3' },
  'Administrateur': { color: '#4680ff', bg: '#ebf4ff' },
  'Support': { color: '#2ed8a3', bg: '#e6faf4' },
  'Finance': { color: '#ffb64d', bg: '#fff8ee' },
}

export default function AdminsPage() {
  const data = admins.map((a, i) => [
    i + 1,
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#4680ff', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
        {a.name.charAt(0)}
      </div>
      <strong style={{ color: '#2d3748' }}>{a.name}</strong>
    </div>,
    a.email,
    <Badge color={roleStyle[a.role]?.color || '#4680ff'} bg={roleStyle[a.role]?.bg || '#ebf4ff'}>{a.role}</Badge>,
    a.lastLogin,
    <Badge color={a.status === 'Actif' ? '#2ed8a3' : '#718096'} bg={a.status === 'Actif' ? '#e6faf4' : '#f7f9fb'}>{a.status}</Badge>,
    <div style={{ display: 'flex', gap: 5 }}>
      <button style={{ padding: '4px 8px', background: '#2ed8a3', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer' }}><FiEdit2 size={12} /></button>
      <button style={{ padding: '4px 8px', background: a.id === 'ADM-001' ? '#ccc' : '#ff5370', border: 'none', borderRadius: 4, color: '#fff', cursor: a.id === 'ADM-001' ? 'not-allowed' : 'pointer' }} disabled={a.id === 'ADM-001'}><FiTrash2 size={12} /></button>
    </div>,
  ])

  return (
    <div>
      <PageHeader title="Liste des administrateurs" icon={<FiUsers />}>
        <Btn color="#2ed8a3"><FiPlus size={14} /> Ajouter</Btn>
      </PageHeader>
      <FilterBar>
        <TextInput placeholder="Rechercher un admin..." value="" onChange={() => {}} />
        <Btn color="#4680ff">Rechercher</Btn>
      </FilterBar>
      <DataTable columns={['S.No', 'Nom', 'Email', 'Rôle', 'Dernière connexion', 'Statut', 'Actions']} data={data} />
    </div>
  )
}
