import { FiShield, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { PageHeader, Btn, DataTable, Badge } from '../../components/PageLayout'

const roles = [
  { id: 'ROL-001', name: 'Super Administrateur', description: 'Accès complet à toutes les fonctionnalités', admins: 1, permissions: 'Toutes', status: 'Actif' },
  { id: 'ROL-002', name: 'Administrateur', description: 'Gestion des conducteurs et courses', admins: 2, permissions: 'Étendu', status: 'Actif' },
  { id: 'ROL-003', name: 'Support', description: 'Gestion des tickets et SOS', admins: 1, permissions: 'Limité', status: 'Actif' },
  { id: 'ROL-004', name: 'Finance', description: 'Gestion des transactions et retraits', admins: 1, permissions: 'Finance', status: 'Actif' },
  { id: 'ROL-005', name: 'Analyste', description: 'Accès aux rapports uniquement', admins: 0, permissions: 'Lecture seule', status: 'Inactif' },
]

const permStyle = {
  'Toutes': { color: '#ff5370', bg: '#fff0f3' },
  'Étendu': { color: '#4680ff', bg: '#ebf4ff' },
  'Limité': { color: '#2ed8a3', bg: '#e6faf4' },
  'Finance': { color: '#ffb64d', bg: '#fff8ee' },
  'Lecture seule': { color: '#718096', bg: '#f7f9fb' },
}

export default function RolesPage() {
  const data = roles.map((r, i) => [
    i + 1,
    <strong style={{ color: '#2d3748' }}>{r.name}</strong>,
    <span style={{ fontSize: 12, color: '#718096' }}>{r.description}</span>,
    r.admins,
    <Badge color={permStyle[r.permissions]?.color || '#4680ff'} bg={permStyle[r.permissions]?.bg || '#ebf4ff'}>{r.permissions}</Badge>,
    <Badge color={r.status === 'Actif' ? '#2ed8a3' : '#718096'} bg={r.status === 'Actif' ? '#e6faf4' : '#f7f9fb'}>{r.status}</Badge>,
    <div style={{ display: 'flex', gap: 5 }}>
      <button style={{ padding: '4px 8px', background: '#2ed8a3', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer' }}><FiEdit2 size={12} /></button>
      {r.id !== 'ROL-001' && <button style={{ padding: '4px 8px', background: '#ff5370', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer' }}><FiTrash2 size={12} /></button>}
    </div>,
  ])

  return (
    <div>
      <PageHeader title="Gestion des rôles" icon={<FiShield />}>
        <Btn color="#2ed8a3"><FiPlus size={14} /> Ajouter</Btn>
      </PageHeader>
      <DataTable columns={['S.No', 'Nom du rôle', 'Description', 'Admins', 'Permissions', 'Statut', 'Actions']} data={data} />
    </div>
  )
}
