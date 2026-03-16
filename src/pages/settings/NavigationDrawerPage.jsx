import { FiMenu, FiSave, FiArrowUp, FiArrowDown } from 'react-icons/fi'
import { PageHeader, Btn, Card } from '../../components/PageLayout'

const menuItems = [
  { id: 1, label: 'Accueil', icon: '🏠', order: 1, visible: true, app: 'Utilisateur' },
  { id: 2, label: 'Réserver une course', icon: '🚕', order: 2, visible: true, app: 'Utilisateur' },
  { id: 3, label: 'Mes courses', icon: '📋', order: 3, visible: true, app: 'Utilisateur' },
  { id: 4, label: 'Mon portefeuille', icon: '👛', order: 4, visible: true, app: 'Utilisateur' },
  { id: 5, label: 'Support', icon: '💬', order: 5, visible: true, app: 'Utilisateur' },
  { id: 6, label: 'Tableau de bord', icon: '📊', order: 1, visible: true, app: 'Conducteur' },
  { id: 7, label: 'Mes gains', icon: '💰', order: 2, visible: true, app: 'Conducteur' },
  { id: 8, label: 'Documents', icon: '📁', order: 3, visible: true, app: 'Conducteur' },
]

const userItems = menuItems.filter(m => m.app === 'Utilisateur')
const driverItems = menuItems.filter(m => m.app === 'Conducteur')

function MenuList({ items, title }) {
  return (
    <Card>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: '#2d3748', marginTop: 0, marginBottom: 16 }}>
        App {title}
      </h3>
      {items.map(item => (
        <div key={item.id} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 12px', background: '#f6f7fb', borderRadius: 8, marginBottom: 8,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 18 }}>{item.icon}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#2d3748' }}>{item.label}</span>
          </div>
          <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            <div style={{
              width: 36, height: 18, borderRadius: 9,
              background: item.visible ? '#4680ff' : '#ddd',
              position: 'relative', cursor: 'pointer',
            }}>
              <div style={{
                width: 14, height: 14, borderRadius: '50%', background: '#fff',
                position: 'absolute', top: 2, left: item.visible ? 20 : 2,
              }} />
            </div>
            <button style={{ padding: '3px 6px', background: '#fff', border: '1px solid #ddd', borderRadius: 3, cursor: 'pointer' }}><FiArrowUp size={10} /></button>
            <button style={{ padding: '3px 6px', background: '#fff', border: '1px solid #ddd', borderRadius: 3, cursor: 'pointer' }}><FiArrowDown size={10} /></button>
          </div>
        </div>
      ))}
    </Card>
  )
}

export default function NavigationDrawerPage() {
  return (
    <div>
      <PageHeader title="Tiroir de navigation" icon={<FiMenu />}>
        <Btn color="#2ed8a3"><FiSave size={14} /> Enregistrer</Btn>
      </PageHeader>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <MenuList items={userItems} title="Utilisateur" />
        <MenuList items={driverItems} title="Conducteur" />
      </div>
    </div>
  )
}
