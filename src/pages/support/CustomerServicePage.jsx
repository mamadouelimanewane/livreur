import { useEffect, useState } from 'react'
import { FiMessageSquare, FiDownload, FiEye, FiCheckCircle } from 'react-icons/fi'
import { PageHeader, Btn, FilterBar, Select, TextInput, Badge } from '../../components/PageLayout'
import {
  getCustomerServiceFilters,
  getCustomerServiceTickets,
  getSupportTicketPriorityStyles,
  getSupportTicketStatusStyles,
} from '../../services/api/supportService'

export default function CustomerServicePage() {
  const [tickets, setTickets] = useState([])
  const [filters, setFilters] = useState({
    statuses: ['Tous statuts'],
    categories: ['Toutes catégories'],
    priorities: ['Toutes priorités'],
  })
  const [status, setStatus] = useState('Tous statuts')
  const [category, setCategory] = useState('Toutes catégories')
  const [priority, setPriority] = useState('Toutes priorités')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadTickets() {
      try {
        setLoading(true)
        setError('')
        const [nextTickets, nextFilters] = await Promise.all([
          getCustomerServiceTickets(),
          getCustomerServiceFilters(),
        ])

        if (isMounted) {
          setTickets(nextTickets)
          setFilters(nextFilters)
        }
      } catch {
        if (isMounted) {
          setError('Impossible de charger les tickets du service client.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadTickets()

    return () => {
      isMounted = false
    }
  }, [])

  const priorityStyle = getSupportTicketPriorityStyles()
  const statusStyle = getSupportTicketStatusStyles()
  const normalizedSearch = search.trim().toLowerCase()
  const filteredTickets = tickets.filter(ticket => {
    const matchesStatus = status === 'Tous statuts' || ticket.status === status
    const matchesCategory = category === 'Toutes catégories' || ticket.category === category
    const matchesPriority = priority === 'Toutes priorités' || ticket.priority === priority
    const matchesSearch = !normalizedSearch || [
      ticket.id,
      ticket.subject,
      ticket.user,
      ticket.phone,
    ].some(value => value.toLowerCase().includes(normalizedSearch))

    return matchesStatus && matchesCategory && matchesPriority && matchesSearch
  })

  const stats = [
    { label: 'Total tickets', count: tickets.length, color: '#4680ff' },
    { label: 'Ouverts', count: tickets.filter(ticket => ticket.status === 'Ouvert').length, color: '#ff5370' },
    { label: 'En traitement', count: tickets.filter(ticket => ticket.status === 'En traitement').length, color: '#ffb64d' },
    { label: 'Résolus', count: tickets.filter(ticket => ticket.status === 'Résolu').length, color: '#2ed8a3' },
  ]

  return (
    <div>
      <PageHeader title="Service client" icon={<FiMessageSquare />}>
        <Btn color="#4680ff"><FiDownload size={14} /></Btn>
      </PageHeader>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
        {stats.map((stat, index) => (
          <div key={index} style={{ background: '#fff', borderRadius: 8, padding: '12px 16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: stat.color }}>{stat.count}</div>
            <div style={{ fontSize: 11, color: '#718096', marginTop: 2 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <FilterBar>
        <Select value={status} onChange={event => setStatus(event.target.value)} options={filters.statuses} />
        <Select value={category} onChange={event => setCategory(event.target.value)} options={filters.categories} />
        <Select value={priority} onChange={event => setPriority(event.target.value)} options={filters.priorities} />
        <TextInput placeholder="Rechercher..." value={search} onChange={event => setSearch(event.target.value)} />
        <Btn color="#4680ff">Rechercher</Btn>
        <Btn outline color="#6c757d" onClick={() => {
          setStatus('Tous statuts')
          setCategory('Toutes catégories')
          setPriority('Toutes priorités')
          setSearch('')
        }}
        >
          Réinitialiser
        </Btn>
      </FilterBar>

      {loading ? (
        <div style={{ background: '#fff', borderRadius: 8, padding: 40, textAlign: 'center', color: '#718096', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          Chargement des tickets...
        </div>
      ) : error ? (
        <div style={{ background: '#fff0f3', border: '1px solid #ff5370', borderRadius: 8, padding: 16, color: '#c53030' }}>
          {error}
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f6f7fb' }}>
                {['S.No', 'ID', 'Sujet', 'Utilisateur', 'Catégorie', 'Priorité', 'Date', 'Statut', 'Actions'].map((header, index) => (
                  <th key={index} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#718096', borderBottom: '1px solid #edf2f7', whiteSpace: 'nowrap' }}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket, index) => (
                <tr
                  key={ticket.id}
                  style={{ borderBottom: '1px solid #f7f9fb' }}
                  onMouseEnter={event => { event.currentTarget.style.background = '#fafbff' }}
                  onMouseLeave={event => { event.currentTarget.style.background = 'transparent' }}
                >
                  <td style={{ padding: '10px 14px', fontSize: 13, color: '#718096' }}>{index + 1}</td>
                  <td style={{ padding: '10px 14px' }}><span style={{ color: '#4680ff', fontWeight: 600 }}>{ticket.id}</span></td>
                  <td style={{ padding: '10px 14px', fontSize: 13, fontWeight: 600, color: '#2d3748' }}>{ticket.subject}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#2d3748' }}>{ticket.user}</div>
                    <div style={{ fontSize: 11, color: '#718096' }}>{ticket.phone}</div>
                  </td>
                  <td style={{ padding: '10px 14px', fontSize: 12 }}>{ticket.category}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <Badge color={priorityStyle[ticket.priority].color} bg={priorityStyle[ticket.priority].bg}>{ticket.priority}</Badge>
                  </td>
                  <td style={{ padding: '10px 14px', fontSize: 11, color: '#718096', whiteSpace: 'nowrap' }}>{ticket.date}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <Badge color={statusStyle[ticket.status].color} bg={statusStyle[ticket.status].bg}>{ticket.status}</Badge>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ display: 'flex', gap: 5 }}>
                      <button style={{ padding: '4px 8px', background: '#4680ff', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer' }}><FiEye size={12} /></button>
                      {ticket.status !== 'Résolu' && (
                        <button style={{ padding: '4px 8px', background: '#2ed8a3', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer' }}><FiCheckCircle size={12} /></button>
                      )}
                    </div>
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
