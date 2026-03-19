import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { FiChevronRight, FiSettings, FiUser, FiLogOut, FiShield } from 'react-icons/fi'
import { useAuth } from '../../context/useAuth'
import {
  ACTIVE_BG,
  BRAND_GRADIENT,
  HOVER_BG,
  NAVBAR_H,
  SECTION_COLOR,
  SIDEBAR_ACCENT,
  SIDEBAR_BG,
  SIDEBAR_W,
  TEXT_ACTIVE,
  TEXT_COLOR,
} from './constants'
import { menu } from './menuConfig'

function MenuItem({ item, depth = 0 }) {
  const paddingLeft = 20 + depth * 16

  return (
    <NavLink
      to={item.path}
      style={({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: `9px 14px 9px ${paddingLeft}px`,
        borderRadius: 8,
        margin: '2px 10px',
        color: isActive ? TEXT_ACTIVE : TEXT_COLOR,
        fontSize: 13,
        fontWeight: isActive ? 600 : 400,
        background: isActive ? ACTIVE_BG : 'transparent',
        boxShadow: isActive ? '0 2px 12px rgba(70,128,255,0.35)' : 'none',
        transition: 'all 0.2s ease',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        cursor: 'pointer',
        letterSpacing: '0.01em',
        position: 'relative',
      })}
      onMouseEnter={e => {
        const isActive = e.currentTarget.getAttribute('aria-current') === 'page'
        if (!isActive) {
          e.currentTarget.style.background = HOVER_BG
          e.currentTarget.style.color = 'rgba(255,255,255,0.95)'
        }
      }}
      onMouseLeave={e => {
        const isActive = e.currentTarget.getAttribute('aria-current') === 'page'
        if (!isActive) {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.color = TEXT_COLOR
        }
      }}
    >
      {item.icon && <span style={{ flexShrink: 0, opacity: 0.85, display: 'flex' }}>{item.icon}</span>}
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>
    </NavLink>
  )
}

function MenuGroup({ item, depth = 0 }) {
  const [open, setOpen] = useState(false)
  const paddingLeft = 20 + depth * 16

  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: `9px 14px 9px ${paddingLeft}px`,
          borderRadius: 8,
          margin: '2px 10px',
          width: 'calc(100% - 20px)',
          color: open ? 'rgba(255,255,255,0.95)' : TEXT_COLOR,
          fontSize: 13,
          fontWeight: 500,
          background: open ? 'rgba(255,255,255,0.04)' : 'transparent',
          transition: 'all 0.2s ease',
          cursor: 'pointer',
          border: 'none',
          textAlign: 'left',
          letterSpacing: '0.01em',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = HOVER_BG
          e.currentTarget.style.color = 'rgba(255,255,255,0.95)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = open ? 'rgba(255,255,255,0.04)' : 'transparent'
          e.currentTarget.style.color = open ? 'rgba(255,255,255,0.95)' : TEXT_COLOR
        }}
      >
        {item.icon && (
          <span style={{ flexShrink: 0, opacity: 0.7, display: 'flex' }}>{item.icon}</span>
        )}
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {item.label}
        </span>
        <span
          style={{
            flexShrink: 0,
            transition: 'transform 0.25s ease',
            transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
            opacity: 0.5,
            display: 'flex',
          }}
        >
          <FiChevronRight size={13} />
        </span>
      </button>

      <div
        style={{
          overflow: 'hidden',
          maxHeight: open ? 2000 : 0,
          transition: 'max-height 0.3s ease',
        }}
      >
        <div
          style={{
            marginLeft: paddingLeft + 8,
            borderLeft: '1px solid rgba(70,128,255,0.2)',
            paddingLeft: 0,
          }}
        >
          {item.children.map(child =>
            child.children
              ? <MenuGroup key={child.id} item={child} depth={depth + 1} />
              : <MenuItem key={child.id} item={child} depth={depth + 1} />
          )}
        </div>
      </div>
    </div>
  )
}

function SectionLabel({ label }) {
  return (
    <div
      style={{
        padding: '18px 22px 6px',
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.1em',
        color: SECTION_COLOR,
        textTransform: 'uppercase',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <span>{label}</span>
      <span
        style={{
          flex: 1,
          height: 1,
          background: 'rgba(255,255,255,0.06)',
        }}
      />
    </div>
  )
}

export default function Sidebar() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  return (
    <aside
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: SIDEBAR_W,
        height: '100vh',
        background: SIDEBAR_BG,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 100,
        boxShadow: '4px 0 30px rgba(0,0,0,0.25)',
      }}
    >
      <div
        style={{
          height: NAVBAR_H,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '0 22px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: BRAND_GRADIENT,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 12px rgba(70,128,255,0.4)',
          }}
        >
          <FiShield size={18} color="#fff" />
        </div>
        <span
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: '#fff',
            letterSpacing: '0.04em',
          }}
        >
          {'LiviGo'}
        </span>
        <span
          style={{
            marginLeft: 'auto',
            fontSize: 10,
            color: 'rgba(255,255,255,0.3)',
            fontWeight: 500,
            background: 'rgba(255,255,255,0.06)',
            padding: '2px 8px',
            borderRadius: 4,
          }}
        >
          v2.0
        </span>
      </div>

      <nav
        className="sidebar-scroll"
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '10px 0',
        }}
      >
        {menu.map(item => {
          if (item.type === 'section') return <SectionLabel key={item.id} label={item.label} />
          if (item.children) return <MenuGroup key={item.id} item={item} depth={0} />
          return <MenuItem key={item.id} item={item} depth={0} />
        })}
        <div style={{ height: 80 }} />
      </nav>

      <div
        style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-around',
          gap: 8,
          flexShrink: 0,
          background: 'rgba(0,0,0,0.15)',
        }}
      >
        <button
          title={'Param\u00e8tres'}
          onClick={() => navigate('/settings/general')}
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: 'rgba(255,255,255,0.06)',
            color: 'rgba(255,255,255,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(70,128,255,0.2)'
            e.currentTarget.style.color = SIDEBAR_ACCENT
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
            e.currentTarget.style.color = 'rgba(255,255,255,0.6)'
          }}
        >
          <FiSettings size={16} />
        </button>

        <button
          title="Mon profil"
          onClick={() => navigate('/settings/admins')}
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: 'rgba(255,255,255,0.06)',
            color: 'rgba(255,255,255,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(70,128,255,0.2)'
            e.currentTarget.style.color = SIDEBAR_ACCENT
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
            e.currentTarget.style.color = 'rgba(255,255,255,0.6)'
          }}
        >
          <FiUser size={16} />
        </button>

        <button
          title={'D\u00e9connexion'}
          onClick={logout}
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: 'rgba(255,60,60,0.12)',
            color: 'rgba(255,120,120,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,60,60,0.25)'
            e.currentTarget.style.color = '#ff6b6b'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,60,60,0.12)'
            e.currentTarget.style.color = 'rgba(255,120,120,0.9)'
          }}
        >
          <FiLogOut size={16} />
        </button>
      </div>
    </aside>
  )
}
