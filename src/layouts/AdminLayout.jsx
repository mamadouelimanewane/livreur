import { useState, useRef, useEffect, useCallback } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  FiHome, FiSettings, FiUsers, FiTruck, FiMap,
  FiChevronRight, FiChevronDown, FiBell, FiLogOut,
  FiUser, FiArrowLeft, FiMaximize2, FiMinimize2,
  FiShield, FiPackage, FiMapPin, FiTag, FiGlobe,
  FiMessageSquare, FiFileText, FiDollarSign, FiBarChart2,
  FiSend, FiAlertCircle, FiCreditCard, FiSliders,
  FiNavigation, FiSmartphone, FiBriefcase,
} from 'react-icons/fi'
import {
  MdOutlineLocalTaxi, MdOutlineDeliveryDining,
  MdOutlineSpaceDashboard,
} from 'react-icons/md'
import { RiMapPinTimeLine } from 'react-icons/ri'

/* ================================================================
   CONSTANTS
================================================================ */

const SIDEBAR_W = 260
const NAVBAR_H = 60

/* ── Dark premium sidebar theme ── */
const SIDEBAR_BG = 'linear-gradient(180deg, #1a1d2e 0%, #0f1117 100%)'
const SIDEBAR_ACCENT = '#4680ff'
const ACTIVE_BG = `linear-gradient(90deg, ${SIDEBAR_ACCENT} 0%, #6366f1 100%)`
const HOVER_BG = 'rgba(255,255,255,0.06)'
const SECTION_COLOR = 'rgba(255,255,255,0.35)'
const TEXT_COLOR = 'rgba(255,255,255,0.72)'
const TEXT_ACTIVE = '#ffffff'
const BRAND_GRADIENT = `linear-gradient(135deg, ${SIDEBAR_ACCENT} 0%, #6366f1 100%)`

/* ================================================================
   MENU DEFINITION
================================================================ */

const menu = [
  {
    id: 'dashboard',
    label: 'Tableau de bord',
    icon: <MdOutlineSpaceDashboard size={17} />,
    path: '/dashboard',
  },

  // ── SETUP OBLIGATOIRE ──────────────────────────────────────────
  { id: 'sep-setup', type: 'section', label: 'SETUP OBLIGATOIRE' },
  {
    id: 'config-base',
    label: 'Configuration de base',
    icon: <FiSettings size={16} />,
    children: [
      { id: 'countries',      label: 'Pays',                   path: '/setup/countries' },
      { id: 'documents',      label: 'Documents',              path: '/setup/documents' },
      { id: 'services',       label: 'Prestations',            path: '/setup/services' },
      { id: 'zones',          label: 'Zone de service',        path: '/setup/zones' },
      { id: 'banners',        label: 'Gestion des bannières',  path: '/setup/banners' },
      { id: 'weight-units',   label: 'Weight Unit',            path: '/setup/weight-units' },
      { id: 'map-markers',    label: 'Map Markers',            path: '/setup/map-markers' },
      { id: 'pricing-params', label: 'Pricing Parameters',     path: '/setup/pricing-params' },
    ],
  },
  {
    id: 'carte-prix',
    label: 'Carte de prix',
    icon: <FiDollarSign size={16} />,
    children: [
      {
        id: 'taxi-logistics',
        label: 'Services de taxi et de logistique',
        children: [
          { id: 'pricecards', label: "Pour l'utilisateur & Conducteur", path: '/setup/pricecards' },
        ],
      },
    ],
  },
  {
    id: 'promo-codes',
    label: 'Code promo',
    icon: <FiTag size={16} />,
    path: '/setup/promo-codes',
  },

  // ── MANUAL DISPATCH ───────────────────────────────────────────
  { id: 'sep-dispatch', type: 'section', label: 'MANUAL DISPATCH' },
  {
    id: 'manual-dispatch',
    label: 'Manual Dispatch',
    icon: <FiSend size={16} />,
    path: '/dispatch/manual',
  },

  // ── DELIVERY MANAGEMENT ───────────────────────────────────────
  { id: 'sep-delivery', type: 'section', label: 'DELIVERY MANAGEMENT' },
  {
    id: 'delivery-mgmt',
    label: 'Delivery Management',
    icon: <MdOutlineDeliveryDining size={17} />,
    children: [
      { id: 'del-products', label: 'Products', path: '/delivery/products' },
    ],
  },
  {
    id: 'delivery-rides',
    label: 'Rides',
    icon: <FiTruck size={16} />,
    children: [
      { id: 'del-active',        label: 'Randonnées en cours',   path: '/delivery/rides/active' },
      { id: 'del-completed',     label: 'Completed Rides',       path: '/delivery/rides/completed' },
      { id: 'del-cancelled',     label: 'Cancelled Rides',       path: '/delivery/rides/cancelled' },
      { id: 'del-failed',        label: 'Failed Rides',          path: '/delivery/rides/failed' },
      { id: 'del-auto-cancelled',label: 'Auto Cancelled Rides',  path: '/delivery/rides/auto-cancelled' },
      { id: 'del-all',           label: 'All Rides',             path: '/delivery/rides/all' },
    ],
  },

  // ── GESTION DES TAXIS ─────────────────────────────────────────
  { id: 'sep-taxi', type: 'section', label: 'GESTION DES TAXIS' },
  {
    id: 'taxi-rides',
    label: 'Rides',
    icon: <MdOutlineLocalTaxi size={17} />,
    children: [
      { id: 'taxi-active',        label: 'Randonnées en cours',   path: '/taxi/rides/active' },
      { id: 'taxi-completed',     label: 'Completed Rides',       path: '/taxi/rides/completed' },
      { id: 'taxi-cancelled',     label: 'Cancelled Rides',       path: '/taxi/rides/cancelled' },
      { id: 'taxi-failed',        label: 'Failed Rides',          path: '/taxi/rides/failed' },
      { id: 'taxi-auto-cancelled',label: 'Auto Cancelled Rides',  path: '/taxi/rides/auto-cancelled' },
      { id: 'taxi-all',           label: 'All Rides',             path: '/taxi/rides/all' },
    ],
  },

  // ── GESTION DES CONDUCTEURS ───────────────────────────────────
  { id: 'sep-drivers', type: 'section', label: 'GESTION DES CONDUCTEURS' },
  {
    id: 'conducteurs',
    label: 'Conducteurs',
    icon: <FiUser size={16} />,
    children: [
      { id: 'dr-all',          label: 'Tous les conducteurs',             path: '/drivers/all' },
      { id: 'dr-status',       label: 'Conducteur Statuts',               path: '/drivers/status' },
      { id: 'dr-vehicle',      label: 'Conducteurs en véhicule',          path: '/drivers/vehicle-based' },
      { id: 'dr-add',          label: 'Ajouter un conducteur',            path: '/drivers/add' },
      { id: 'dr-signup',       label: 'Inscription de base',              path: '/drivers/basic-signup' },
      { id: 'dr-pending',      label: "En attente d'approbation",         path: '/drivers/pending' },
      { id: 'dr-rejected',     label: 'Conducteurs rejetés',              path: '/drivers/rejected' },
      { id: 'dr-temp',         label: 'Temporairement rejetés',           path: '/drivers/temp-rejected' },
      { id: 'dr-online',       label: 'Rapport en ligne du conducteur',   path: '/drivers/online-report' },
      { id: 'dr-expiring',     label: "Documents proche d'expiration",    path: '/drivers/expiring-docs' },
      { id: 'dr-expired',      label: 'Document expiré',                  path: '/drivers/expired-docs' },
    ],
  },
  {
    id: 'vehicles',
    label: 'Véhicules',
    icon: <FiTruck size={16} />,
    children: [
      { id: 'veh-all', label: 'Tous les véhicules', path: '/drivers/vehicles' },
    ],
  },
  {
    id: 'drivers-map',
    label: 'Map',
    icon: <FiMap size={16} />,
    children: [
      { id: 'map-drivers',  label: 'Carte des conducteurs', path: '/drivers/map' },
      { id: 'map-heat',     label: 'Carte thermique',       path: '/drivers/heatmap' },
    ],
  },

  // ── GESTION DES UTILISATEURS ──────────────────────────────────
  { id: 'sep-users', type: 'section', label: 'GESTION DES UTILISATEURS' },
  {
    id: 'users',
    label: 'Utilisateurs',
    icon: <FiUsers size={16} />,
    path: '/users',
  },

  // ── SYSTÈME DE SUPPORT ────────────────────────────────────────
  { id: 'sep-support', type: 'section', label: 'SYSTÈME DE SUPPORT' },
  {
    id: 'sos',
    label: 'SOS',
    icon: <FiAlertCircle size={16} />,
    children: [
      { id: 'sos-number',   label: 'Numéro SOS',     path: '/support/sos' },
      { id: 'sos-requests', label: 'Demande Sos',    path: '/support/sos-requests' },
    ],
  },
  {
    id: 'customer-service',
    label: 'Service client',
    icon: <FiMessageSquare size={16} />,
    path: '/support/customer-service',
  },

  // ── AUTRE ─────────────────────────────────────────────────────
  { id: 'sep-autre', type: 'section', label: 'AUTRE' },
  {
    id: 'content',
    label: 'Gestion de contenu',
    icon: <FiFileText size={16} />,
    children: [
      { id: 'cnt-pages',     label: 'Pages',                    path: '/content/pages' },
      { id: 'cnt-cms',       label: 'Pages CMS',                path: '/content/cms' },
      { id: 'cnt-strings',   label: "Chaînes d'application",    path: '/content/app-strings' },
      { id: 'cnt-strings2',  label: "Chaînes d'application v2", path: '/content/app-strings-v2' },
      { id: 'cnt-admin-str', label: "Chaînes d'admin",          path: '/content/admin-strings' },
      { id: 'cnt-payment',   label: 'Option de paiement',       path: '/content/payment-options' },
    ],
  },
  {
    id: 'promotions',
    label: 'Notification promotionnelle',
    icon: <FiBell size={16} />,
    path: '/content/promotions',
  },
  {
    id: 'wallet',
    label: 'Recharge de portefeuille',
    icon: <FiCreditCard size={16} />,
    path: '/content/wallet-recharge',
  },

  // ── GESTION DES TRANSACTIONS ──────────────────────────────────
  { id: 'sep-transactions', type: 'section', label: 'GESTION DES TRANSACTIONS' },
  {
    id: 'withdrawal',
    label: 'Demande de retrait',
    icon: <FiDollarSign size={16} />,
    children: [
      { id: 'cashout', label: 'Conducteur', path: '/transactions/cashout' },
    ],
  },

  // ── RAPPORT ET GRAPHIQUES ─────────────────────────────────────
  { id: 'sep-reports', type: 'section', label: 'RAPPORT ET GRAPHIQUES' },

  // ── PARAMÈTRE ─────────────────────────────────────────────────
  { id: 'sep-params', type: 'section', label: 'PARAMÈTRE' },
  {
    id: 'sous-admin',
    label: 'Sous-administrateur',
    icon: <FiShield size={16} />,
    children: [
      { id: 'admins', label: 'Liste des administrateurs', path: '/settings/admins' },
      { id: 'roles',  label: 'Rôle',                      path: '/settings/roles' },
    ],
  },
  {
    id: 'parametrage',
    label: 'Paramétrage et configuration',
    icon: <FiSliders size={16} />,
    children: [
      { id: 'set-general',   label: 'Général',                              path: '/settings/general' },
      { id: 'set-booking',   label: 'Demande de configuration',             path: '/settings/booking' },
      { id: 'set-driver',    label: 'Configuration du conducteur',          path: '/settings/driver' },
      { id: 'set-email',     label: 'Configuration des e-mails',            path: '/settings/email' },
      { id: 'set-email-tpl', label: 'Email Template',                       path: '/settings/email-template' },
      { id: 'set-svc-type',  label: 'Configuration de type de service',     path: '/settings/service-type' },
      { id: 'set-nav',       label: 'Tiroir de navigation',                 path: '/settings/navigation-drawer' },
      { id: 'set-app-url',   label: 'Application Url',                      path: '/settings/app-url' },
      { id: 'set-push',      label: 'Configuration des notifications push', path: '/settings/push-notifications' },
      { id: 'set-cancel',    label: "Raisons d'annulation",                 path: '/settings/cancel-reasons' },
      { id: 'set-payment',   label: 'Méthode de paiement',                  path: '/settings/payment-method' },
    ],
  },
]

/* ================================================================
   SIDEBAR MENU ITEM COMPONENTS
================================================================ */

/**
 * A single leaf link item (no children).
 */
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

/**
 * A collapsible parent item. Manages its own open/close state.
 * Supports up to 3 levels deep (depth=0 → depth=1 → depth=2).
 */
function MenuGroup({ item, depth = 0 }) {
  const [open, setOpen] = useState(false)
  const paddingLeft = 20 + depth * 16

  return (
    <div>
      {/* Header row */}
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
        onMouseEnter={e => { e.currentTarget.style.background = HOVER_BG; e.currentTarget.style.color = 'rgba(255,255,255,0.95)' }}
        onMouseLeave={e => { e.currentTarget.style.background = open ? 'rgba(255,255,255,0.04)' : 'transparent'; e.currentTarget.style.color = open ? 'rgba(255,255,255,0.95)' : TEXT_COLOR }}
      >
        {item.icon && (
          <span style={{ flexShrink: 0, opacity: 0.7, display: 'flex' }}>{item.icon}</span>
        )}
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {item.label}
        </span>
        <span style={{
          flexShrink: 0,
          transition: 'transform 0.25s ease',
          transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
          opacity: 0.5,
          display: 'flex',
        }}>
          <FiChevronRight size={13} />
        </span>
      </button>

      {/* Children – with subtle left border indicator */}
      <div style={{
        overflow: 'hidden',
        maxHeight: open ? 2000 : 0,
        transition: 'max-height 0.3s ease',
      }}>
        <div style={{
          marginLeft: paddingLeft + 8,
          borderLeft: `1px solid rgba(70,128,255,0.2)`,
          paddingLeft: 0,
        }}>
          {item.children.map(child =>
            child.children
              ? <MenuGroup key={child.id} item={child} depth={depth + 1} />
              : <MenuItem  key={child.id} item={child} depth={depth + 1} />
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Section separator / label
 */
function SectionLabel({ label }) {
  return (
    <div style={{
      padding: '18px 22px 6px',
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: '0.1em',
      color: SECTION_COLOR,
      textTransform: 'uppercase',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    }}>
      <span>{label}</span>
      <span style={{
        flex: 1,
        height: 1,
        background: 'rgba(255,255,255,0.06)',
      }} />
    </div>
  )
}

/* ================================================================
   SIDEBAR COMPONENT
================================================================ */

function Sidebar() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  return (
    <aside style={{
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
    }}>

      {/* Logo */}
      <div style={{
        height: NAVBAR_H,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '0 22px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        flexShrink: 0,
      }}>
        {/* Icon bubble with glow */}
        <div style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: BRAND_GRADIENT,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 12px rgba(70,128,255,0.4)',
        }}>
          <FiShield size={18} color="#fff" />
        </div>
        <span style={{
          fontSize: 22,
          fontWeight: 800,
          color: '#fff',
          letterSpacing: '0.04em',
        }}>SÛR</span>
        <span style={{
          marginLeft: 'auto',
          fontSize: 10,
          color: 'rgba(255,255,255,0.3)',
          fontWeight: 500,
          background: 'rgba(255,255,255,0.06)',
          padding: '2px 8px',
          borderRadius: 4,
        }}>v2.0</span>
      </div>

      {/* Scrollable menu */}
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
          if (item.children)          return <MenuGroup    key={item.id} item={item} depth={0} />
          return                             <MenuItem     key={item.id} item={item} depth={0} />
        })}
        {/* Extra space at bottom */}
        <div style={{ height: 80 }} />
      </nav>

      {/* Bottom bar */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '12px 16px',
        display: 'flex',
        justifyContent: 'space-around',
        gap: 8,
        flexShrink: 0,
        background: 'rgba(0,0,0,0.15)',
      }}>
        {/* Settings */}
        <button
          title="Paramètres"
          onClick={() => navigate('/settings/general')}
          style={{
            width: 38, height: 38,
            borderRadius: 10,
            background: 'rgba(255,255,255,0.06)',
            color: 'rgba(255,255,255,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(70,128,255,0.2)'; e.currentTarget.style.color = SIDEBAR_ACCENT }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}
        >
          <FiSettings size={16} />
        </button>

        {/* Profile */}
        <button
          title="Mon profil"
          onClick={() => navigate('/settings/admins')}
          style={{
            width: 38, height: 38,
            borderRadius: 10,
            background: 'rgba(255,255,255,0.06)',
            color: 'rgba(255,255,255,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(70,128,255,0.2)'; e.currentTarget.style.color = SIDEBAR_ACCENT }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}
        >
          <FiUser size={16} />
        </button>

        {/* Logout */}
        <button
          title="Déconnexion"
          onClick={logout}
          style={{
            width: 38, height: 38,
            borderRadius: 10,
            background: 'rgba(255,60,60,0.12)',
            color: 'rgba(255,120,120,0.9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,60,60,0.25)'; e.currentTarget.style.color = '#ff6b6b' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,60,60,0.12)'; e.currentTarget.style.color = 'rgba(255,120,120,0.9)' }}
        >
          <FiLogOut size={16} />
        </button>
      </div>
    </aside>
  )
}

/* ================================================================
   TOP NAVBAR COMPONENT
================================================================ */

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [fullscreen, setFullscreen] = useState(false)
  const [userDropOpen, setUserDropOpen] = useState(false)
  const [langDropOpen, setLangDropOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const userDropRef = useRef(null)
  const langDropRef = useRef(null)
  const notifRef = useRef(null)

  /* Close dropdowns on outside click */
  useEffect(() => {
    function handler(e) {
      if (userDropRef.current && !userDropRef.current.contains(e.target)) setUserDropOpen(false)
      if (langDropRef.current && !langDropRef.current.contains(e.target)) setLangDropOpen(false)
      if (notifRef.current    && !notifRef.current.contains(e.target))    setNotifOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
      setFullscreen(true)
    } else {
      document.exitFullscreen().catch(() => {})
      setFullscreen(false)
    }
  }

  /* Initial letters for avatar */
  const initials = (user?.name ?? 'A')
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const iconBtn = {
    width: 36, height: 36,
    borderRadius: 8,
    background: 'transparent',
    color: '#666',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    border: 'none', cursor: 'pointer',
    transition: 'background 0.15s',
    position: 'relative',
  }

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: SIDEBAR_W,
      right: 0,
      height: NAVBAR_H,
      background: '#fff',
      borderBottom: '1px solid #e8ecf0',
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px',
      gap: 8,
      zIndex: 90,
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    }}>

      {/* ── Left controls ── */}
      <button
        title="Retour"
        onClick={() => navigate(-1)}
        style={iconBtn}
        onMouseEnter={e => { e.currentTarget.style.background = '#f0f2f5' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
      >
        <FiArrowLeft size={17} />
      </button>

      <button
        title={fullscreen ? 'Quitter le plein écran' : 'Plein écran'}
        onClick={toggleFullscreen}
        style={iconBtn}
        onMouseEnter={e => { e.currentTarget.style.background = '#f0f2f5' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
      >
        {fullscreen ? <FiMinimize2 size={17} /> : <FiMaximize2 size={17} />}
      </button>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* ── Right controls ── */}

      {/* Notification bell */}
      <div ref={notifRef} style={{ position: 'relative' }}>
        <button
          title="Notifications"
          onClick={() => setNotifOpen(o => !o)}
          style={{ ...iconBtn, position: 'relative' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#f0f2f5' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
        >
          <FiBell size={18} color="#555" />
          {/* Badge */}
          <span style={{
            position: 'absolute',
            top: 5, right: 5,
            width: 8, height: 8,
            borderRadius: '50%',
            background: '#ff4d4f',
            border: '2px solid #fff',
          }} />
        </button>

        {notifOpen && (
          <div style={{
            position: 'absolute',
            top: 44, right: 0,
            width: 300,
            background: '#fff',
            borderRadius: 10,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            border: '1px solid #e8ecf0',
            zIndex: 200,
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '12px 16px',
              borderBottom: '1px solid #f0f0f0',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>Notifications</span>
              <span style={{
                fontSize: 11, background: '#ff4d4f', color: '#fff',
                borderRadius: 10, padding: '2px 7px',
              }}>3</span>
            </div>
            {[
              { title: 'Nouveau conducteur inscrit', time: 'il y a 5 min' },
              { title: 'Demande de retrait en attente', time: 'il y a 12 min' },
              { title: 'Alerte SOS reçue', time: 'il y a 30 min' },
            ].map((n, i) => (
              <div key={i} style={{
                padding: '11px 16px',
                borderBottom: i < 2 ? '1px solid #f5f5f5' : 'none',
                cursor: 'pointer',
                transition: 'background 0.12s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#fafbfc' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}
              >
                <div style={{ fontSize: 13, fontWeight: 500 }}>{n.title}</div>
                <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>{n.time}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Language selector */}
      <div ref={langDropRef} style={{ position: 'relative' }}>
        <button
          onClick={() => setLangDropOpen(o => !o)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 10px',
            borderRadius: 8,
            background: 'transparent',
            border: '1px solid #e8ecf0',
            cursor: 'pointer',
            color: '#444',
            fontSize: 13,
            fontWeight: 500,
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#f5f6f8' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
        >
          <FiGlobe size={14} color="#666" />
          <span>Français</span>
          <FiChevronDown size={13} color="#999" style={{
            transition: 'transform 0.2s',
            transform: langDropOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }} />
        </button>

        {langDropOpen && (
          <div style={{
            position: 'absolute',
            top: 44, right: 0,
            background: '#fff',
            borderRadius: 10,
            boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
            border: '1px solid #e8ecf0',
            zIndex: 200,
            minWidth: 140,
            overflow: 'hidden',
          }}>
            {[
              { code: 'fr', label: 'Français', active: true },
              { code: 'en', label: 'English', active: false },
              { code: 'ar', label: 'العربية', active: false },
            ].map(lang => (
              <button
                key={lang.code}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '9px 16px',
                  textAlign: 'left',
                  fontSize: 13,
                  fontWeight: lang.active ? 600 : 400,
                  color: lang.active ? '#4680ff' : '#444',
                  background: lang.active ? '#f0f4ff' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background 0.12s',
                }}
                onMouseEnter={e => { if (!lang.active) e.currentTarget.style.background = '#f5f6f8' }}
                onMouseLeave={e => { if (!lang.active) e.currentTarget.style.background = 'transparent' }}
              >
                {lang.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 24, background: '#e8ecf0' }} />

      {/* User avatar + dropdown */}
      <div ref={userDropRef} style={{ position: 'relative' }}>
        <button
          onClick={() => setUserDropOpen(o => !o)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '4px 8px',
            borderRadius: 8,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#f5f6f8' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
        >
          {/* Avatar circle */}
          <div style={{
            width: 34, height: 34,
            borderRadius: '50%',
            background: BRAND_GRADIENT,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff',
            fontSize: 13,
            fontWeight: 700,
            flexShrink: 0,
          }}>
            {initials}
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#2d3748', lineHeight: 1.2 }}>
              {user?.name ?? 'Admin'}
            </div>
            <div style={{ fontSize: 11, color: '#999' }}>
              {user?.role ?? 'superadmin'}
            </div>
          </div>
          <FiChevronDown size={13} color="#999" style={{
            transition: 'transform 0.2s',
            transform: userDropOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }} />
        </button>

        {userDropOpen && (
          <div style={{
            position: 'absolute',
            top: 46, right: 0,
            background: '#fff',
            borderRadius: 10,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            border: '1px solid #e8ecf0',
            zIndex: 200,
            minWidth: 190,
            overflow: 'hidden',
          }}>
            {/* User info header */}
            <div style={{
              padding: '14px 16px',
              borderBottom: '1px solid #f0f0f0',
            }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{user?.name}</div>
              <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>{user?.email}</div>
            </div>

            {/* Actions */}
            {[
              { icon: <FiUser size={14} />,    label: 'Mon profil',    action: () => navigate('/settings/admins') },
              { icon: <FiSettings size={14} />, label: 'Paramètres',   action: () => navigate('/settings/general') },
            ].map((item, i) => (
              <button
                key={i}
                onClick={() => { item.action(); setUserDropOpen(false) }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  width: '100%',
                  padding: '10px 16px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: 13,
                  color: '#444',
                  transition: 'background 0.12s',
                  textAlign: 'left',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#f5f6f8' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
              >
                <span style={{ color: '#888' }}>{item.icon}</span>
                {item.label}
              </button>
            ))}

            <div style={{ borderTop: '1px solid #f0f0f0' }}>
              <button
                onClick={() => { logout(); navigate('/login') }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  width: '100%',
                  padding: '10px 16px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: 13,
                  color: '#ff4d4f',
                  transition: 'background 0.12s',
                  textAlign: 'left',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#fff1f0' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
              >
                <FiLogOut size={14} />
                Déconnexion
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

/* ================================================================
   ADMIN LAYOUT (root export)
================================================================ */

export default function AdminLayout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f6f9' }}>
      <Sidebar />

      {/* Right side */}
      <div style={{
        marginLeft: SIDEBAR_W,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}>
        <Navbar />

        {/* Page content */}
        <main style={{
          marginTop: NAVBAR_H,
          flex: 1,
          padding: '24px',
          minHeight: `calc(100vh - ${NAVBAR_H}px - 44px)`,
        }}>
          <Outlet />
        </main>

        {/* Footer */}
        <footer style={{
          height: 44,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 12,
          color: '#aaa',
          borderTop: '1px solid #e8ecf0',
          background: '#fff',
          flexShrink: 0,
        }}>
          © 2026 SÛR — Tous droits réservés
        </footer>
      </div>
    </div>
  )
}
