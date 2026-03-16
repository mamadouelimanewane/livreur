import { useState } from 'react'
import { FiMessageSquare, FiDownload, FiEye, FiCheckCircle } from 'react-icons/fi'
import { PageHeader, Btn, FilterBar, Select, TextInput, Badge } from '../../components/PageLayout'

const tickets = [
  { id: 'TKT-001', subject: 'Conducteur non trouvé', user: 'Fatou Diallo', phone: '+221 77 123 45 67', category: 'Course', priority: 'Haute', date: '15/03/2024 10:32', status: 'Ouvert' },
  { id: 'TKT-002', subject: 'Remboursement demandé', user: 'Moussa Ndiaye', phone: '+221 76 234 56 78', category: 'Paiement', priority: 'Moyenne', date: '15/03/2024 09:15', status: 'En traitement' },
  { id: 'TKT-003', subject: 'Application ne se connecte pas', user: 'Aminata Koné', phone: '+221 70 345 67 89', category: 'Technique', priority: 'Basse', date: '14/03/2024 18:00', status: 'Résolu' },
  { id: 'TKT-004', subject: 'Prix incorrect facturé', user: 'Ibrahim Touré', phone: '+221 77 456 78 90', category: 'Paiement', priority: 'Haute', date: '14/03/2024 14:20', status: 'Ouvert' },
  { id: 'TKT-005', subject: 'Conducteur impoli', user: 'Mariama Balde', phone: '+221 76 567 89 01', category: 'Comportement', priority: 'Haute', date: '13/03/2024 20:45', status: 'En traitement' },
]

const priorityStyle = {
  'Haute': { color: '#ff5370', bg: '#fff0f3' },
  'Moyenne': { color: '#ffb64d', bg: '#fff8ee' },
  'Basse': { color: '#2ed8a3', bg: '#e6faf4' },
}

const statusStyle = {
  'Ouvert': { color: '#ff5370', bg: '#fff0f3' },
  'En traitement': { color: '#ffb64d', bg: '#fff8ee' },
  'Résolu': { color: '#2ed8a3', bg: '#e6faf4' },
}

export default function CustomerServicePage() {
  const [search, setSearch] = useState('')

  return (
    <div>
      <PageHeader title="Service client" icon={<FiMessageSquare />}>
        <Btn color="#4680ff"><FiDownload size={14} /></Btn>
      </PageHeader>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
        {[
          { label: 'Total tickets', count: tickets.length, color: '#4680ff' },
          { label: 'Ouverts', count: tickets.filter(t => t.status === 'Ouvert').length, color: '#ff5370' },
          { label: 'En traitement', count: tickets.filter(t => t.status === 'En traitement').length, color: '#ffb64d' },
          { label: 'Résolus', count: tickets.filter(t => t.status === 'Résolu').length, color: '#2ed8a3' },
        ].map((s, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 8, padding: '12px 16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.count}</div>
            <div style={{ fontSize: 11, color: '#718096', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <FilterBar>
        <Select value="Tous statuts" onChange={() => {}} options={['Tous statuts', 'Ouvert', 'En traitement', 'Résolu']} />
        <Select value="Toutes catégories" onChange={() => {}} options={['Toutes catégories', 'Course', 'Paiement', 'Technique', 'Comportement']} />
        <Select value="Toutes priorités" onChange={() => {}} options={['Toutes priorités', 'Haute', 'Moyenne', 'Basse']} />
        <TextInput placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} />
        <Btn color="#4680ff">Rechercher</Btn>
        <Btn outline color="#6c757d" onClick={() => setSearch('')}>Réinitialiser</Btn>
      </FilterBar>

      <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f6f7fb' }}>
              {['S.No', 'ID', 'Sujet', 'Utilisateur', 'Catégorie', 'Priorité', 'Date', 'Statut', 'Actions'].map((h, i) => (
                <th key={i} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#718096', borderBottom: '1px solid #edf2f7', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tickets.filter(t => !search || t.subject.toLowerCase().includes(search.toLowerCase()) || t.user.toLowerCase().includes(search.toLowerCase())).map((t, i) => (
              <tr key={t.id} style={{ borderBottom: '1px solid #f7f9fb' }}
                onMouseEnter={e => e.currentTarget.style.background = '#fafbff'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '10px 14px', fontSize: 13, color: '#718096' }}>{i + 1}</td>
                <td style={{ padding: '10px 14px' }}><span style={{ color: '#4680ff', fontWeight: 600 }}>{t.id}</span></td>
                <td style={{ padding: '10px 14px', fontSize: 13, fontWeight: 600, color: '#2d3748' }}>{t.subject}</td>
                <td style={{ padding: '10px 14px' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#2d3748' }}>{t.user}</div>
                  <div style={{ fontSize: 11, color: '#718096' }}>{t.phone}</div>
                </td>
                <td style={{ padding: '10px 14px', fontSize: 12 }}>{t.category}</td>
                <td style={{ padding: '10px 14px' }}>
                  <Badge color={priorityStyle[t.priority].color} bg={priorityStyle[t.priority].bg}>{t.priority}</Badge>
                </td>
                <td style={{ padding: '10px 14px', fontSize: 11, color: '#718096', whiteSpace: 'nowrap' }}>{t.date}</td>
                <td style={{ padding: '10px 14px' }}>
                  <Badge color={statusStyle[t.status].color} bg={statusStyle[t.status].bg}>{t.status}</Badge>
                </td>
                <td style={{ padding: '10px 14px' }}>
                  <div style={{ display: 'flex', gap: 5 }}>
                    <button style={{ padding: '4px 8px', background: '#4680ff', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer' }}><FiEye size={12} /></button>
                    {t.status !== 'Résolu' && (
                      <button style={{ padding: '4px 8px', background: '#2ed8a3', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer' }}><FiCheckCircle size={12} /></button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
