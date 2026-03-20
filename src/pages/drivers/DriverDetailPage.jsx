import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FiUser, FiPhone, FiMail, FiMapPin, FiTruck, FiStar, FiDollarSign, FiFileText, FiCheck, FiX, FiArrowLeft } from 'react-icons/fi'
import { MOCK_DRIVERS } from '../../data/mockApiData'

const TABS = ['Informations', 'Performance', 'Transactions', 'Historique']

const MOCK_HISTORY = [
  { id: 'RD-8820', from: 'Plateau', to: 'Parcelles', amount: '500 FCFA', date: '15/03/2024', status: 'Terminée', rating: 5 },
  { id: 'RD-8823', from: 'Plateau', to: 'Rufisque',  amount: '1500 FCFA', date: '14/03/2024', status: 'Terminée', rating: 4 },
  { id: 'RD-8821', from: 'Centre',  to: 'Guédiawaye', amount: '800 FCFA', date: '14/03/2024', status: 'En cours', rating: null },
]

const MOCK_TRANSACTIONS = [
  { id: 'TXN-001', type: 'Retrait',  amount: '-12 000 FCFA', date: '10/03/2024', status: 'Payé' },
  { id: 'TXN-002', type: 'Commission', amount: '-500 FCFA',  date: '09/03/2024', status: 'Déduit' },
  { id: 'TXN-003', type: 'Gain',     amount: '+1 500 FCFA', date: '09/03/2024', status: 'Crédité' },
  { id: 'TXN-004', type: 'Gain',     amount: '+800 FCFA',   date: '08/03/2024', status: 'Crédité' },
]

const PERF_WEEKLY = [
  { day: 'Lun', rides: 6 }, { day: 'Mar', rides: 8 }, { day: 'Mer', rides: 9 },
  { day: 'Jeu', rides: 7 }, { day: 'Ven', rides: 10 }, { day: 'Sam', rides: 12},
  { day: 'Dim', rides: 3 },
]

const STATUS_COLOR = { Terminée: '#22c55e', 'En cours': '#4680ff', Annulée: '#ef4444' }

function MiniBar({ data }) {
  const max = Math.max(...data.map(d => d.rides), 1)
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 80 }}>
      {data.map((d, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: 4 }}>
          <span style={{ fontSize: 10, color: '#4680ff', fontWeight: 700 }}>{d.rides}</span>
          <div style={{ width: '100%', background: 'linear-gradient(180deg, #4680ff, #6366f1)', borderRadius: '4px 4px 0 0', height: `${(d.rides / max) * 60}px`, minHeight: 4, transition: 'height 0.4s ease' }} />
          <span style={{ fontSize: 9, color: '#94a3b8' }}>{d.day}</span>
        </div>
      ))}
    </div>
  )
}

export default function DriverDetailPage() {
  const { driverId } = useParams()
  const navigate = useNavigate()
  const [tab, setTab] = useState('Informations')

  // Chercher le conducteur dans les mocks (ou fallback)
  const driver = MOCK_DRIVERS.find(d => d.id === driverId) ?? {
    id: driverId, name: 'Conducteur inconnu', phone: '—', email: '—',
    zone: '—', vehicle: '—', brand: '—', plate: '—', year: '—',
    rides: 0, amount: '0 FCFA', registered: '—', status: 'En attente',
  }

  const statusColors = { Approuvé: '#22c55e', 'En attente': '#f59e0b', Rejeté: '#ef4444' }
  const statusColor = statusColors[driver.status] || '#94a3b8'

  return (
    <div>
      {/* Header */}
      <button onClick={() => navigate(-1)} style={{
        display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none',
        cursor: 'pointer', fontSize: 13, color: '#64748b', fontWeight: 600, marginBottom: 20, padding: 0,
      }}>
        <FiArrowLeft size={15} /> Retour aux conducteurs
      </button>

      {/* Carte profil */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1d2e 0%, #2d1f5e 60%, #4680ff 100%)',
        borderRadius: 20, padding: '28px 32px', marginBottom: 20,
        color: '#fff', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -30, right: -10, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, position: 'relative', zIndex: 1 }}>
          {/* Avatar */}
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'linear-gradient(135deg, #4680ff, #6366f1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, fontWeight: 800, color: '#fff',
            border: '3px solid rgba(255,255,255,0.3)',
            boxShadow: '0 4px 20px rgba(70,128,255,0.4)',
            flexShrink: 0,
          }}>
            {driver.name.charAt(0)}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>{driver.name}</h1>
              <span style={{
                fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20,
                background: statusColor + '30', color: '#fff', border: `1px solid ${statusColor}60`,
              }}>
                {driver.status}
              </span>
            </div>
            <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>{driver.id} · Inscrit le {driver.registered}</div>
            <div style={{ display: 'flex', gap: 20, marginTop: 14 }}>
              {[
                { label: 'Courses', value: driver.rides },
                { label: 'Gains',   value: driver.amount },
                { label: 'Zone',    value: driver.zone },
                { label: 'Véhicule', value: driver.vehicle },
              ].map((s, i) => (
                <div key={i}>
                  <div style={{ fontSize: 14, fontWeight: 800 }}>{s.value}</div>
                  <div style={{ fontSize: 10, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Actions rapides */}
          {driver.status === 'En attente' && (
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{ padding: '8px 16px', borderRadius: 10, border: 'none', background: '#22c55e', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                <FiCheck size={14} /> Approuver
              </button>
              <button style={{ padding: '8px 16px', borderRadius: 10, border: 'none', background: 'rgba(255,83,112,0.8)', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                <FiX size={14} /> Rejeter
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Onglets */}
      <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', borderRadius: 10, padding: 4, marginBottom: 20, width: 'fit-content' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '8px 18px', borderRadius: 8, border: 'none',
            background: tab === t ? '#fff' : 'transparent',
            color: tab === t ? '#4680ff' : '#64748b',
            fontWeight: tab === t ? 700 : 500, fontSize: 13,
            cursor: 'pointer', boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
            transition: 'all 0.2s',
          }}>
            {t}
          </button>
        ))}
      </div>

      {/* Contenu des onglets */}
      {tab === 'Informations' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ background: '#fff', borderRadius: 14, padding: '20px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700, color: '#1e293b' }}>📋 Informations personnelles</h3>
            {[
              { icon: <FiUser />,    label: 'Nom complet', value: driver.name },
              { icon: <FiPhone />,   label: 'Téléphone',   value: driver.phone },
              { icon: <FiMail />,    label: 'Email',        value: driver.email },
              { icon: <FiMapPin />,  label: 'Zone',         value: driver.zone },
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: i < 3 ? '1px solid #f1f5f9' : 'none' }}>
                <span style={{ color: '#4680ff', marginTop: 2 }}>{row.icon}</span>
                <div>
                  <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>{row.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b', marginTop: 2 }}>{row.value}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: '#fff', borderRadius: 14, padding: '20px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700, color: '#1e293b' }}>🏍 Informations véhicule</h3>
            {[
              { icon: <FiTruck />,   label: 'Type',          value: driver.vehicleType || driver.vehicle },
              { label: 'Marque',     value: driver.brand },
              { label: 'Plaque',     value: driver.plate },
              { label: 'Année',      value: driver.year },
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: i < 3 ? '1px solid #f1f5f9' : 'none' }}>
                <span style={{ color: '#22c55e', marginTop: 2 }}>{row.icon || <FiFileText />}</span>
                <div>
                  <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>{row.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b', marginTop: 2 }}>{row.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'Performance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {[
              { label: 'Courses totales', value: driver.rides, color: '#4680ff' },
              { label: 'Note moyenne',    value: '4.8 ★',       color: '#f59e0b' },
              { label: 'Gains totaux',    value: driver.amount, color: '#22c55e' },
              { label: 'Taux acceptation', value: '88%',        color: '#a855f7' },
            ].map((s, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 12, padding: '16px 18px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginBottom: 6 }}>{s.label}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>
          <div style={{ background: '#fff', borderRadius: 14, padding: '20px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700 }}>Courses cette semaine</h3>
            <MiniBar data={PERF_WEEKLY} />
          </div>
        </div>
      )}

      {tab === 'Transactions' && (
        <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f8fafc' }}>
              <tr>
                {['ID', 'Type', 'Montant', 'Date', 'Statut'].map((h, i) => (
                  <th key={i} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_TRANSACTIONS.map((t, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#94a3b8' }}>{t.id}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{t.type}</td>
                  <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 700, color: t.amount.startsWith('+') ? '#22c55e' : '#ef4444' }}>{t.amount}</td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#64748b' }}>{t.date}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 10, background: '#f0fdf4', color: '#166534' }}>{t.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Historique' && (
        <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f8fafc' }}>
              <tr>
                {['ID', 'De', 'À', 'Montant', 'Date', 'Statut', 'Note'].map((h, i) => (
                  <th key={i} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_HISTORY.map((r, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#4680ff', fontWeight: 600 }}>{r.id}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{r.from}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{r.to}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 700, color: '#22c55e' }}>{r.amount}</td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#64748b' }}>{r.date}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 10, background: (STATUS_COLOR[r.status] || '#94a3b8') + '15', color: STATUS_COLOR[r.status] || '#94a3b8' }}>
                      {r.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#f59e0b' }}>
                    {r.rating ? `${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
