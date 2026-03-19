import { useEffect, useState } from 'react'
import { FiUsers, FiPlus, FiDownload, FiInfo, FiEye, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { PageHeader, Btn, FilterBar, Select, TextInput, Badge } from '../../components/PageLayout'
import { getUsers, getUserFilters, getUserStatusStyles } from '../../services/api/usersService'

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [filters, setFilters] = useState({ countries: ['Tous'], searchBy: ['Nom', 'Email', 'T\u00e9l\u00e9phone'] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [searchBy, setSearchBy] = useState('Nom')
  const [country, setCountry] = useState('Tous')
  const statusColor = getUserStatusStyles()

  useEffect(() => {
    let active = true

    async function loadData() {
      try {
        const [userRows, filterConfig] = await Promise.all([getUsers(), getUserFilters()])
        if (!active) return
        setUsers(userRows)
        setFilters(filterConfig)
      } catch {
        if (!active) return
        setError('Impossible de charger les utilisateurs.')
      } finally {
        if (active) setLoading(false)
      }
    }

    loadData()
    return () => { active = false }
  }, [])

  const filtered = users.filter(u => {
    if (country !== 'Tous' && u.country !== country) return false
    const q = search.toLowerCase()
    if (!q) return true
    if (searchBy === 'Nom') return u.name.toLowerCase().includes(q)
    if (searchBy === 'Email') return u.email.toLowerCase().includes(q)
    if (searchBy === 'T\u00e9l\u00e9phone') return u.phone.includes(q)
    return true
  })

  return (
    <div>
      <PageHeader title="Gestion des utilisateurs" icon={<FiUsers />}>
        <Btn outline color="#6c757d">{'Effac\u00e9 Utilisateurs (0)'}</Btn>
        <Btn color="#2ed8a3"><FiPlus size={14} /> Ajouter</Btn>
        <Btn color="#4680ff"><FiDownload size={14} /></Btn>
        <Btn color="#4680ff"><FiInfo size={14} /></Btn>
      </PageHeader>

      <FilterBar>
        <span style={{ fontSize: 13, color: '#4a5568', fontWeight: 600 }}>Rechercher par:</span>
        <Select value={searchBy} onChange={e => setSearchBy(e.target.value)} options={filters.searchBy} />
        <TextInput placeholder="Saisir la valeur de recherche..." value={search} onChange={e => setSearch(e.target.value)} />
        <Select value={country} onChange={e => setCountry(e.target.value)} options={filters.countries} />
        <Btn color="#4680ff">Rechercher</Btn>
        <Btn outline color="#6c757d" onClick={() => { setSearch(''); setCountry('Tous') }}>{'R\u00e9initialiser'}</Btn>
      </FilterBar>

      <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f6f7fb' }}>
                {['S.No', 'ID utilisateur', 'D\u00e9tails de l\'utilisateur', 'Stats services', 'Portefeuille', 'Pays / Zone', 'Date d\'inscription', 'Actions'].map((h, i) => (
                  <th key={i} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#718096', borderBottom: '1px solid #edf2f7', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ padding: 30, textAlign: 'center', color: '#a0aec0', fontSize: 13 }}>Chargement des utilisateurs...</td></tr>
              ) : error ? (
                <tr><td colSpan={8} style={{ padding: 30, textAlign: 'center', color: '#c53030', fontSize: 13 }}>{error}</td></tr>
              ) : filtered.map((u, i) => (
                <tr
                  key={u.id}
                  style={{ borderBottom: '1px solid #f7f9fb' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fafbff'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '10px 14px', fontSize: 13, color: '#718096' }}>{i + 1}</td>
                  <td style={{ padding: '10px 14px' }}><span style={{ fontSize: 13, color: '#4680ff', fontWeight: 600 }}>{u.id}</span></td>
                  <td style={{ padding: '10px 14px' }}><div style={{ fontWeight: 600, fontSize: 13, color: '#2d3748' }}>{u.name}</div><div style={{ fontSize: 12, color: '#718096' }}>{u.phone}</div><div style={{ fontSize: 12, color: '#718096' }}>{u.email}</div></td>
                  <td style={{ padding: '10px 14px', textAlign: 'center' }}><span style={{ display: 'inline-block', background: '#ebf4ff', color: '#4680ff', borderRadius: 12, padding: '3px 10px', fontSize: 12, fontWeight: 700 }}>{u.services} courses</span></td>
                  <td style={{ padding: '10px 14px', fontSize: 13, fontWeight: 600, color: '#2d3748' }}>{u.wallet}</td>
                  <td style={{ padding: '10px 14px' }}><div style={{ fontSize: 13 }}>{u.country}</div><div style={{ fontSize: 12, color: '#718096' }}>{u.zone}</div></td>
                  <td style={{ padding: '10px 14px', fontSize: 13, color: '#718096', whiteSpace: 'nowrap' }}>{u.registered}<br /><Badge color={statusColor[u.status].color} bg={statusColor[u.status].bg}>{u.status}</Badge></td>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ display: 'flex', gap: 5 }}>
                      <button style={{ padding: '4px 8px', background: '#4680ff', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer' }}><FiEye size={12} /></button>
                      <button style={{ padding: '4px 8px', background: '#2ed8a3', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer' }}><FiEdit2 size={12} /></button>
                      <button style={{ padding: '4px 8px', background: '#ff5370', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer' }}><FiTrash2 size={12} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '10px 14px', borderTop: '1px solid #edf2f7', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: '#718096' }}>
          <span>Affichage de {filtered.length} entr\u00e9es</span>
          <div style={{ display: 'flex', gap: 4 }}>
            {['\u00ab', '\u2039', '1', '\u203a', '\u00bb'].map((p, i) => (
              <button key={i} style={{ padding: '3px 8px', border: '1px solid #ddd', borderRadius: 4, background: p === '1' ? '#4680ff' : '#fff', color: p === '1' ? '#fff' : '#4a5568', cursor: 'pointer', fontSize: 12 }}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
