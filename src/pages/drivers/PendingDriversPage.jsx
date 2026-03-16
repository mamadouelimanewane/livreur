import { FiTruck, FiDownload, FiInfo, FiCheck, FiX } from 'react-icons/fi'
import { PageHeader, Btn, FilterBar, Select, TextInput, Badge } from '../../components/PageLayout'

const drivers = [
  { id: 'DRV-020', name: 'Khadija Ndiaye', phone: '+221 77 555 11 22', email: 'khadija.ndiaye@gmail.com', zone: 'Dakar Centre', vehicle: 'Moto', submittedDate: '14/03/2024', docs: 3 },
  { id: 'DRV-021', name: 'Lamine Traoré', phone: '+221 76 666 22 33', email: 'lamine.traore@yahoo.fr', zone: 'Plateau', vehicle: 'Voiture', submittedDate: '14/03/2024', docs: 5 },
  { id: 'DRV-022', name: 'Rokhaya Faye', phone: '+221 70 777 33 44', email: 'rokhaya.faye@gmail.com', zone: 'Thiès', vehicle: 'Moto', submittedDate: '15/03/2024', docs: 4 },
]

export default function PendingDriversPage() {
  return (
    <div>
      <PageHeader title="En attente d'approbation" icon={<FiTruck />}>
        <Btn color="#4680ff"><FiDownload size={14} /></Btn>
        <Btn color="#4680ff"><FiInfo size={14} /></Btn>
      </PageHeader>

      <div style={{
        background: '#fff8ee',
        border: '1px solid #ffb64d',
        borderRadius: 8,
        padding: '10px 16px',
        marginBottom: 16,
        fontSize: 13,
        color: '#7a5200',
        fontWeight: 600,
      }}>
        En attente d'approbation des détails (3) — Ces conducteurs ont soumis leurs documents et attendent votre approbation.
      </div>

      <FilterBar>
        <Select value="Toutes zones" onChange={() => {}} options={['Toutes zones', 'Dakar Centre', 'Plateau', 'Thiès']} />
        <TextInput placeholder="Rechercher..." value="" onChange={() => {}} />
        <Btn color="#4680ff">Rechercher</Btn>
        <Btn outline color="#6c757d">Réinitialiser</Btn>
      </FilterBar>

      <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f6f7fb' }}>
                {['S.No', 'ID', 'Conducteur', 'Zone', 'Véhicule', 'Documents', 'Date soumission', 'Actions'].map((h, i) => (
                  <th key={i} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#718096', borderBottom: '1px solid #edf2f7', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {drivers.map((d, i) => (
                <tr key={d.id}
                  style={{ borderBottom: '1px solid #f7f9fb' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fafbff'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '10px 14px', fontSize: 13, color: '#718096' }}>{i + 1}</td>
                  <td style={{ padding: '10px 14px' }}><span style={{ color: '#4680ff', fontWeight: 600 }}>{d.id}</span></td>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ fontWeight: 600, color: '#2d3748' }}>{d.name}</div>
                    <div style={{ fontSize: 12, color: '#718096' }}>{d.phone}</div>
                    <div style={{ fontSize: 12, color: '#718096' }}>{d.email}</div>
                  </td>
                  <td style={{ padding: '10px 14px', fontSize: 13 }}>{d.zone}</td>
                  <td style={{ padding: '10px 14px', fontSize: 13 }}>{d.vehicle}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <Badge color="#4680ff" bg="#ebf4ff">{d.docs} docs</Badge>
                  </td>
                  <td style={{ padding: '10px 14px', fontSize: 13, color: '#718096' }}>{d.submittedDate}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ display: 'flex', gap: 5 }}>
                      <button style={{ padding: '4px 10px', background: '#2ed8a3', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}><FiCheck size={12} /> Approuver</button>
                      <button style={{ padding: '4px 10px', background: '#ff5370', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}><FiX size={12} /> Rejeter</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '10px 14px', borderTop: '1px solid #edf2f7', fontSize: 12, color: '#718096' }}>
          Affichage de {drivers.length} entrées
        </div>
      </div>
    </div>
  )
}
