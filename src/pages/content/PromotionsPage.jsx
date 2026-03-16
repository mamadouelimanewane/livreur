import { FiBell, FiPlus, FiDownload, FiEdit2, FiTrash2, FiSend } from 'react-icons/fi'
import { PageHeader, Btn, FilterBar, Select, DataTable, Badge } from '../../components/PageLayout'

const promotions = [
  { id: 'PROMO-001', title: 'Promotion Ramadan 2024', message: 'Profitez de 20% de réduction sur vos courses pendant tout le Ramadan!', target: 'Tous', channel: 'Push + SMS', sent: 1240, opened: 890, date: '15/03/2024', status: 'Envoyé' },
  { id: 'PROMO-002', title: 'Offre Nouveau Conducteur', message: 'Rejoignez SÛR et gagnez un bonus de 10 000 FCFA après 50 courses!', target: 'Conducteurs', channel: 'Push', sent: 0, opened: 0, date: '20/03/2024', status: 'Planifié' },
  { id: 'PROMO-003', title: 'Weekend Livraison Gratuite', message: 'Livraison gratuite ce weekend sur toutes vos commandes!', target: 'Utilisateurs', channel: 'Push + Email', sent: 680, opened: 512, date: '10/03/2024', status: 'Envoyé' },
]

const statusStyle = {
  'Envoyé': { color: '#2ed8a3', bg: '#e6faf4' },
  'Planifié': { color: '#4680ff', bg: '#ebf4ff' },
  'Brouillon': { color: '#718096', bg: '#f7f9fb' },
}

export default function PromotionsPage() {
  const data = promotions.map((p, i) => [
    i + 1,
    <strong style={{ color: '#2d3748' }}>{p.title}</strong>,
    <span style={{ fontSize: 12, color: '#718096', maxWidth: 200, display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.message}</span>,
    <Badge color="#6f42c1" bg="#f3eeff">{p.target}</Badge>,
    p.channel,
    p.sent > 0 ? `${p.sent.toLocaleString()} / ${p.opened.toLocaleString()}` : '-',
    p.date,
    <Badge color={statusStyle[p.status].color} bg={statusStyle[p.status].bg}>{p.status}</Badge>,
    <div style={{ display: 'flex', gap: 5 }}>
      {p.status === 'Brouillon' && <button style={{ padding: '4px 8px', background: '#2ed8a3', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer' }}><FiSend size={12} /></button>}
      <button style={{ padding: '4px 8px', background: '#4680ff', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer' }}><FiEdit2 size={12} /></button>
      <button style={{ padding: '4px 8px', background: '#ff5370', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer' }}><FiTrash2 size={12} /></button>
    </div>,
  ])

  return (
    <div>
      <PageHeader title="Notifications promotionnelles" icon={<FiBell />}>
        <Btn color="#2ed8a3"><FiPlus size={14} /> Créer</Btn>
        <Btn color="#4680ff"><FiDownload size={14} /></Btn>
      </PageHeader>

      <FilterBar>
        <Select value="Tous statuts" onChange={() => {}} options={['Tous statuts', 'Envoyé', 'Planifié', 'Brouillon']} />
        <Select value="Toutes cibles" onChange={() => {}} options={['Toutes cibles', 'Tous', 'Utilisateurs', 'Conducteurs']} />
        <Btn color="#4680ff">Filtrer</Btn>
      </FilterBar>

      <DataTable
        columns={['S.No', 'Titre', 'Message', 'Cible', 'Canal', 'Envoi/Ouverture', 'Date', 'Statut', 'Actions']}
        data={data}
      />
    </div>
  )
}
