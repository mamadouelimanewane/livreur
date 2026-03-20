// Shared page layout component used across all admin pages

export default function PageLayout({ title, subtitle, actions, children }) {
  return (
    <div style={{ padding: '0 0 24px 0' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a1d2e', margin: 0 }}>{title}</h1>
          {subtitle && <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>{subtitle}</div>}
        </div>
        {actions && <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{actions}</div>}
      </div>
      {/* Content */}
      <div>{children}</div>
    </div>
  )
}

export function PageHeader({ title, icon, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {icon && <span style={{ color: '#4680ff', fontSize: 22 }}>{icon}</span>}
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#2d3748', margin: 0 }}>{title}</h1>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{children}</div>
    </div>
  )
}

export function Btn({ color = '#4680ff', outline = false, onClick, children, style = {} }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 14px',
        borderRadius: 5,
        border: outline ? `1px solid ${color}` : 'none',
        background: outline ? 'transparent' : color,
        color: outline ? color : '#fff',
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        ...style,
      }}
    >
      {children}
    </button>
  )
}

export function Badge({ color = '#4680ff', bg, children }) {
  const bgColor = bg || color + '20'
  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 600,
      background: bgColor,
      color: color,
      whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  )
}

export function FilterBar({ children }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 8,
      padding: '14px 18px',
      marginBottom: 16,
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 10,
    }}>
      {children}
    </div>
  )
}

export function Select({ value, onChange, options, style = {} }) {
  return (
    <select
      value={value}
      onChange={onChange}
      style={{
        padding: '5px 10px',
        borderRadius: 5,
        border: '1px solid #ddd',
        fontSize: 13,
        color: '#4a5568',
        background: '#fff',
        cursor: 'pointer',
        ...style,
      }}
    >
      {options.map(o => (
        <option key={o.value || o} value={o.value || o}>{o.label || o}</option>
      ))}
    </select>
  )
}

export function TextInput({ placeholder, value, onChange, style = {} }) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{
        padding: '5px 10px',
        borderRadius: 5,
        border: '1px solid #ddd',
        fontSize: 13,
        color: '#4a5568',
        outline: 'none',
        minWidth: 180,
        ...style,
      }}
    />
  )
}

export function DataTable({ columns, data, emptyMsg = 'Aucune donnée disponible' }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 8,
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      overflow: 'hidden',
    }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f6f7fb' }}>
              {columns.map((col, i) => (
                <th key={i} style={{
                  padding: '10px 14px',
                  textAlign: 'left',
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#718096',
                  borderBottom: '1px solid #edf2f7',
                  whiteSpace: 'nowrap',
                }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ padding: 30, textAlign: 'center', color: '#a0aec0', fontSize: 13 }}>
                  {emptyMsg}
                </td>
              </tr>
            ) : data.map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f7f9fb' }}
                onMouseEnter={e => e.currentTarget.style.background = '#fafbff'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {row.map((cell, j) => (
                  <td key={j} style={{ padding: '10px 14px', fontSize: 13, color: '#4a5568' }}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{
        padding: '10px 14px',
        borderTop: '1px solid #edf2f7',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: 12,
        color: '#718096',
      }}>
        <span>Affichage de {data.length} entrées</span>
        <div style={{ display: 'flex', gap: 4 }}>
          {['«', '‹', '1', '›', '»'].map((p, i) => (
            <button key={i} style={{
              padding: '3px 8px',
              border: '1px solid #ddd',
              borderRadius: 4,
              background: p === '1' ? '#4680ff' : '#fff',
              color: p === '1' ? '#fff' : '#4a5568',
              cursor: 'pointer',
              fontSize: 12,
            }}>{p}</button>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ActionBtns() {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      <button style={{ padding: '4px 10px', border: 'none', background: '#4680ff', color: '#fff', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>✏️</button>
      <button style={{ padding: '4px 10px', border: 'none', background: '#ff5370', color: '#fff', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>🗑</button>
    </div>
  )
}

export function Card({ children, style = {} }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 8,
      padding: 20,
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      ...style,
    }}>
      {children}
    </div>
  )
}
