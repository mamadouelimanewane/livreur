import { Outlet } from 'react-router-dom'
import Sidebar from './admin/Sidebar'
import Navbar from './admin/Navbar'
import { NAVBAR_H, SIDEBAR_W } from './admin/constants'

export default function AdminLayout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f6f9' }}>
      <Sidebar />

      <div
        style={{
          marginLeft: SIDEBAR_W,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <Navbar />

        <main
          style={{
            marginTop: NAVBAR_H,
            flex: 1,
            padding: '24px',
            minHeight: `calc(100vh - ${NAVBAR_H}px - 44px)`,
          }}
        >
          <Outlet />
        </main>

        <footer
          style={{
            height: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            color: '#aaa',
            borderTop: '1px solid #e8ecf0',
            background: '#fff',
            flexShrink: 0,
          }}
        >
          {'\u00a9 2026 LiviGo \u2014 Tous droits reserves'}
        </footer>
      </div>
    </div>
  )
}
