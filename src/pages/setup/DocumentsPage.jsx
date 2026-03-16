import { FiFileText, FiPlus, FiDownload, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { PageHeader, Btn, FilterBar, Select, TextInput, DataTable, Badge } from '../../components/PageLayout'

const documents = [
  { id: 'DOC-001', name: 'Permis de conduire', applicableTo: 'Conducteur', country: 'Sénégal', required: true, hasExpiry: true, order: 1, status: 'Actif' },
  { id: 'DOC-002', name: 'Carte d\'identité nationale', applicableTo: 'Conducteur', country: 'Sénégal', required: true, hasExpiry: true, order: 2, status: 'Actif' },
  { id: 'DOC-003', name: 'Carte grise du véhicule', applicableTo: 'Véhicule', country: 'Sénégal', required: true, hasExpiry: true, order: 3, status: 'Actif' },
  { id: 'DOC-004', name: 'Assurance tous risques', applicableTo: 'Véhicule', country: 'Sénégal', required: true, hasExpiry: true, order: 4, status: 'Actif' },
  { id: 'DOC-005', name: 'Photo de profil', applicableTo: 'Conducteur', country: 'Sénégal', required: true, hasExpiry: false, order: 5, status: 'Actif' },
]

export default function DocumentsPage() {
  const data = documents.map((d, i) => [
    i + 1,
    <strong style={{ color: '#2d3748' }}>{d.name}</strong>,
    d.applicableTo,
    d.country,
    <Badge color={d.required ? '#ff5370' : '#a0aec0'} bg={d.required ? '#fff0f3' : '#f7f9fb'}>{d.required ? 'Obligatoire' : 'Optionnel'}</Badge>,
    <Badge color={d.hasExpiry ? '#ffb64d' : '#718096'} bg={d.hasExpiry ? '#fff8ee' : '#f7f9fb'}>{d.hasExpiry ? 'Avec expiry' : 'Sans expiry'}</Badge>,
    d.order,
    <div style={{ display: 'flex', gap: 5 }}>
      <button style={{ padding: '4px 8px', background: '#2ed8a3', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer' }}><FiEdit2 size={12} /></button>
      <button style={{ padding: '4px 8px', background: '#ff5370', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer' }}><FiTrash2 size={12} /></button>
    </div>,
  ])

  return (
    <div>
      <PageHeader title="Documents" icon={<FiFileText />}>
        <Btn color="#2ed8a3"><FiPlus size={14} /> Ajouter</Btn>
        <Btn color="#4680ff"><FiDownload size={14} /></Btn>
      </PageHeader>

      <FilterBar>
        <Select value="Sénégal" onChange={() => {}} options={['Sénégal', 'Côte d\'Ivoire']} />
        <Select value="Tous" onChange={() => {}} options={['Tous', 'Conducteur', 'Véhicule']} />
        <TextInput placeholder="Rechercher..." value="" onChange={() => {}} />
        <Btn color="#4680ff">Rechercher</Btn>
      </FilterBar>

      <DataTable
        columns={['S.No', 'Nom du document', 'Applicable à', 'Pays', 'Obligation', 'Expiration', 'Ordre', 'Actions']}
        data={data}
      />
    </div>
  )
}
