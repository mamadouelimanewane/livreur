import { FiDollarSign, FiDownload, FiCheck, FiX, FiEye } from 'react-icons/fi'
import { PageHeader, Btn, FilterBar, Select, TextInput, Badge } from '../../components/PageLayout'

const cashouts = [
  { id: 'CO-001', driver: 'Oumar Sall', phone: '+221 77 100 22 33', amount: '15 000 FCFA', method: 'Wave', account: '+221 77 100 22 33', balance: '18 500 FCFA', requestDate: '15/03/2024', status: 'En attente' },
  { id: 'CO-002', driver: 'Ibrahima Ba', phone: '+221 70 300 44 55', amount: '25 000 FCFA', method: 'Orange Money', account: '+221 70 300 44 55', balance: '28 000 FCFA', requestDate: '14/03/2024', status: 'Approuvé' },
  { id: 'CO-003', driver: 'Abdoulaye Mbaye', phone: '+221 76 500 66 77', amount: '10 000 FCFA', method: 'Wave', account: '+221 76 500 66 77', balance: '12 000 FCFA', requestDate: '14/03/2024', status: 'Payé' },
  { id: 'CO-004', driver: 'Cheikh Fall', phone: '+221 76 200 33 44', amount: '8 000 FCFA', method: 'Virement bancaire', account: 'SN20 ...4521', balance: '10 200 FCFA', requestDate: '13/03/2024', status: 'Rejeté' },
  { id: 'CO-005', driver: 'Seydou Diop', phone: '+221 77 400 55 66', amount: '5 000 FCFA', method: 'Wave', account: '+221 77 400 55 66', balance: '5 600 FCFA', requestDate: '13/03/2024', status: 'En attente' },
]

const statusStyle = {
  'En attente': { color: '#ffb64d', bg: '#fff8ee' },
  'Approuvé': { color: '#4680ff', bg: '#ebf4ff' },
  'Payé': { color: '#2ed8a3', bg: '#e6faf4' },
  'Rejeté': { color: '#ff5370', bg: '#fff0f3' },
}

export default function CashoutPage() {
  return (
    <div>
      <PageHeader title="Demandes de retrait — Conducteur" icon={<FiDollarSign />}>
        <Btn color="#4680ff"><FiDownload size={14} /></Btn>
      </PageHeader>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
        {[
          { label: 'En attente', count: cashouts.filter(c => c.status === 'En attente').length, color: '#ffb64d', total: '20 000 FCFA' },
          { label: 'Approuvés', count: cashouts.filter(c => c.status === 'Approuvé').length, color: '#4680ff', total: '25 000 FCFA' },
          { label: 'Payés', count: cashouts.filter(c => c.status === 'Payé').length, color: '#2ed8a3', total: '10 000 FCFA' },
          { label: 'Rejetés', count: cashouts.filter(c => c.status === 'Rejeté').length, color: '#ff5370', total: '8 000 FCFA' },
        ].map((s, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 8, padding: '12px 16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.count}</div>
                <div style={{ fontSize: 11, color: '#a0aec0' }}>{s.label}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#2d3748' }}>{s.total}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <FilterBar>
        <Select value="Tous statuts" onChange={() => {}} options={['Tous statuts', 'En attente', 'Approuvé', 'Payé', 'Rejeté']} />
        <Select value="Tous moyens" onChange={() => {}} options={['Tous moyens', 'Wave', 'Orange Money', 'Virement bancaire']} />
        <TextInput placeholder="Rechercher un conducteur..." value="" onChange={() => {}} />
        <Btn color="#4680ff">Rechercher</Btn>
        <Btn outline color="#6c757d">Réinitialiser</Btn>
      </FilterBar>

      <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f6f7fb' }}>
                {['S.No', 'ID', 'Conducteur', 'Montant demandé', 'Solde dispo', 'Méthode', 'Compte', 'Date', 'Statut', 'Actions'].map((h, i) => (
                  <th key={i} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#718096', borderBottom: '1px solid #edf2f7', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cashouts.map((c, i) => (
                <tr key={c.id} style={{ borderBottom: '1px solid #f7f9fb' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fafbff'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '10px 14px', fontSize: 13, color: '#718096' }}>{i + 1}</td>
                  <td style={{ padding: '10px 14px' }}><span style={{ color: '#4680ff', fontWeight: 600 }}>{c.id}</span></td>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ fontWeight: 600, color: '#2d3748' }}>{c.driver}</div>
                    <div style={{ fontSize: 12, color: '#718096' }}>{c.phone}</div>
                  </td>
                  <td style={{ padding: '10px 14px' }}><strong style={{ color: '#ff5370' }}>{c.amount}</strong></td>
                  <td style={{ padding: '10px 14px', fontSize: 13 }}>{c.balance}</td>
                  <td style={{ padding: '10px 14px', fontSize: 13 }}>{c.method}</td>
                  <td style={{ padding: '10px 14px', fontSize: 12, color: '#718096' }}>{c.account}</td>
                  <td style={{ padding: '10px 14px', fontSize: 12, color: '#718096', whiteSpace: 'nowrap' }}>{c.requestDate}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <Badge color={statusStyle[c.status].color} bg={statusStyle[c.status].bg}>{c.status}</Badge>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ display: 'flex', gap: 5 }}>
                      <button style={{ padding: '4px 8px', background: '#4680ff', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer' }}><FiEye size={12} /></button>
                      {c.status === 'En attente' && (
                        <>
                          <button style={{ padding: '4px 8px', background: '#2ed8a3', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer' }}><FiCheck size={12} /></button>
                          <button style={{ padding: '4px 8px', background: '#ff5370', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer' }}><FiX size={12} /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '10px 14px', borderTop: '1px solid #edf2f7', fontSize: 12, color: '#718096' }}>
          Affichage de {cashouts.length} demandes
        </div>
      </div>
    </div>
  )
}
