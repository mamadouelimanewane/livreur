import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { FiTrendingUp, FiActivity, FiUsers, FiRadio } from 'react-icons/fi'

const TABS = [
  { path: '/reports/financial',   label: 'Financier',     icon: <FiTrendingUp size={15} /> },
  { path: '/reports/operations',  label: 'Opérationnel',  icon: <FiActivity size={15} />   },
  { path: '/reports/drivers',     label: 'Conducteurs',   icon: <FiUsers size={15} />      },
  { path: '/reports/live',        label: '🔴 Live',       icon: <FiRadio size={15} />      },
]

export default function ReportsLayout() {
  const { pathname } = useLocation()
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1e293b', margin: '0 0 6px 0' }}>Rapports & Analytics</h1>
        <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>Vue analytique complète de votre plateforme LiviGo</p>
      </div>

      {/* Onglets */}
      <div style={{
        display: 'flex', gap: 4, marginBottom: 24,
        background: '#f1f5f9', borderRadius: 12, padding: 4,
        width: 'fit-content',
      }}>
        {TABS.map(tab => {
          const active = pathname.startsWith(tab.path)
          return (
            <Link key={tab.path} to={tab.path} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 18px', borderRadius: 9,
              background: active ? '#fff' : 'transparent',
              color: active ? '#4680ff' : '#64748b',
              fontWeight: active ? 700 : 500,
              fontSize: 13, textDecoration: 'none',
              boxShadow: active ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.2s',
            }}>
              {tab.icon} {tab.label}
            </Link>
          )
        })}
      </div>

      <Outlet />
    </div>
  )
}
