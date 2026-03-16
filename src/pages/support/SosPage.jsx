import { FiPhoneCall, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { PageHeader, Btn, FilterBar, Select, DataTable, Badge } from '../../components/PageLayout'

const sosNumbers = [
  { id: 'SOS-001', label: 'Police Nationale', number: '17', type: 'Urgence', country: 'Sénégal', status: 'Actif' },
  { id: 'SOS-002', label: 'SAMU', number: '15', type: 'Médical', country: 'Sénégal', status: 'Actif' },
  { id: 'SOS-003', label: 'Pompiers', number: '18', type: 'Incendie', country: 'Sénégal', status: 'Actif' },
  { id: 'SOS-004', label: 'Support SÛR', number: '+221 33 820 00 00', type: 'Support', country: 'Sénégal', status: 'Actif' },
  { id: 'SOS-005', label: 'Assistance routière', number: '+221 77 000 00 00', type: 'Routier', country: 'Sénégal', status: 'Inactif' },
]

const typeStyle = {
  'Urgence': { color: '#ff5370', bg: '#fff0f3' },
  'Médical': { color: '#4680ff', bg: '#ebf4ff' },
  'Incendie': { color: '#ffb64d', bg: '#fff8ee' },
  'Support': { color: '#2ed8a3', bg: '#e6faf4' },
  'Routier': { color: '#6f42c1', bg: '#f3eeff' },
}

export default function SosPage() {
  const data = sosNumbers.map((s, i) => [
    i + 1,
    <strong style={{ color: '#2d3748' }}>{s.label}</strong>,
    <a href={`tel:${s.number}`} style={{ color: '#4680ff', fontWeight: 600, textDecoration: 'none', fontSize: 16 }}>{s.number}</a>,
    <Badge color={typeStyle[s.type].color} bg={typeStyle[s.type].bg}>{s.type}</Badge>,
    s.country,
    <Badge color={s.status === 'Actif' ? '#2ed8a3' : '#718096'} bg={s.status === 'Actif' ? '#e6faf4' : '#f7f9fb'}>{s.status}</Badge>,
    <div style={{ display: 'flex', gap: 5 }}>
      <button style={{ padding: '4px 8px', background: '#2ed8a3', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer' }}><FiEdit2 size={12} /></button>
      <button style={{ padding: '4px 8px', background: '#ff5370', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer' }}><FiTrash2 size={12} /></button>
    </div>,
  ])

  return (
    <div>
      <PageHeader title="Numéros SOS" icon={<FiPhoneCall />}>
        <Btn color="#2ed8a3"><FiPlus size={14} /> Ajouter</Btn>
      </PageHeader>

      <div style={{
        background: '#fff0f3',
        border: '1px solid #ff5370',
        borderRadius: 8,
        padding: '10px 16px',
        marginBottom: 16,
        fontSize: 13,
        color: '#c53030',
      }}>
        Ces numéros sont affichés dans l'application en cas d'urgence. Assurez-vous qu'ils sont à jour.
      </div>

      <FilterBar>
        <Select value="Tous types" onChange={() => {}} options={['Tous types', 'Urgence', 'Médical', 'Incendie', 'Support']} />
        <Select value="Sénégal" onChange={() => {}} options={['Sénégal', 'Côte d\'Ivoire']} />
        <Btn color="#4680ff">Filtrer</Btn>
      </FilterBar>

      <DataTable
        columns={['S.No', 'Libellé', 'Numéro', 'Type', 'Pays', 'Statut', 'Actions']}
        data={data}
      />
    </div>
  )
}
