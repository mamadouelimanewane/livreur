import { useEffect, useState } from 'react'
import { FiStar, FiAward, FiTrendingUp, FiGift, FiUsers } from 'react-icons/fi'
import { PageHeader } from '../../components/PageLayout'
import { LOYALTY_LEVELS, getLoyaltyLevel, getLoyaltyLeaderboard } from '../../services/api/loyaltyService'
import { supabase } from '../../services/api/supabaseClient'

const MOCK_USERS_LOYALTY = [
  { userId: 'USR-001', name: 'Fatou Diallo',   totalPoints: 8420, totalRides: 312, level: getLoyaltyLevel(8420) },
  { userId: 'USR-002', name: 'Cheikh Fall',    totalPoints: 5930, totalRides: 198, level: getLoyaltyLevel(5930) },
  { userId: 'USR-003', name: 'Aminata Koné',  totalPoints: 4100, totalRides: 145, level: getLoyaltyLevel(4100) },
  { userId: 'USR-004', name: 'Mamadou Diop',  totalPoints: 2850, totalRides: 89,  level: getLoyaltyLevel(2850) },
  { userId: 'USR-005', name: 'Rokhaya Sarr',  totalPoints: 1200, totalRides: 44,  level: getLoyaltyLevel(1200) },
  { userId: 'USR-006', name: 'Ibou Ndoye',    totalPoints:  640, totalRides: 23,  level: getLoyaltyLevel(640)  },
  { userId: 'USR-007', name: 'Ndeye Touré',   totalPoints:  180, totalRides:  8,  level: getLoyaltyLevel(180)  },
]

function LevelCard({ level }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 14, padding: '20px 24px',
      boxShadow: `0 2px 12px ${level.color}20`,
      border: `1px solid ${level.color}30`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 28 }}>{level.emoji}</span>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: level.color }}>{level.name}</div>
            <div style={{ fontSize: 11, color: '#64748b' }}>à partir de {level.minPoints.toLocaleString()} pts</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#1e293b' }}>-{level.discount}%</div>
          <div style={{ fontSize: 10, color: '#94a3b8' }}>réduction</div>
        </div>
      </div>
      <div style={{ fontSize: 12, color: '#64748b', padding: '8px 12px', background: level.color + '10', borderRadius: 8 }}>
        {level.perksLabel}
      </div>
    </div>
  )
}

function UserLoyaltyRow({ user, rank }) {
  const medalEmoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '12px 20px',
      borderBottom: '1px solid #f8fafc',
      background: rank <= 3 ? user.level.color + '06' : 'transparent',
    }}>
      <span style={{ fontSize: rank <= 3 ? 22 : 14, fontWeight: 700, color: '#94a3b8', width: 36, textAlign: 'center', flexShrink: 0 }}>{medalEmoji}</span>
      <div style={{
        width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
        background: `linear-gradient(135deg, ${user.level.color}, ${user.level.color}88)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 14, fontWeight: 800, color: '#fff',
      }}>
        {user.name.charAt(0)}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{user.name}</div>
        <div style={{ fontSize: 11, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4, marginTop: 1 }}>
          <span style={{ fontSize: 14 }}>{user.level.emoji}</span>
          <span style={{ color: user.level.color, fontWeight: 600 }}>{user.level.name}</span>
          · {user.totalRides} courses
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 16, fontWeight: 900, color: '#1e293b' }}>{user.totalPoints.toLocaleString()}</div>
        <div style={{ fontSize: 10, color: '#94a3b8' }}>LiviStars</div>
      </div>
    </div>
  )
}

export default function LoyaltyPage() {
  const [leaderboard, setLeaderboard] = useState(MOCK_USERS_LOYALTY)
  const [stats, setStats] = useState({ total: 847, active: 234, redemptions: 1250000 })

  useEffect(() => {
    getLoyaltyLeaderboard().then(data => {
      if (data?.length > 0) setLeaderboard(data)
    })
  }, [])

  // Stats par niveau
  const byLevel = LOYALTY_LEVELS.map(l => ({
    ...l,
    count: leaderboard.filter(u => u.level?.name === l.name).length,
  }))

  return (
    <div>
      <PageHeader title="Programme LiviStars — Fidélité" icon={<FiStar />} />

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Membres inscrits',     value: stats.total.toLocaleString(),       icon: <FiUsers size={18} />,    color: '#4680ff' },
          { label: 'Membres actifs (30j)', value: stats.active.toLocaleString(),       icon: <FiTrendingUp size={18} />, color: '#22c55e' },
          { label: 'Points échangés',      value: `${(stats.redemptions / 1000).toFixed(0)}K pts`, icon: <FiGift size={18} />,     color: '#a855f7' },
        ].map((k, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 12, padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: k.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: k.color }}>
              {k.icon}
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#1e293b' }}>{k.value}</div>
              <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Niveaux */}
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: 6 }}>
            <FiAward size={16} color="#f59e0b" /> Niveaux de fidélité
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {LOYALTY_LEVELS.map(l => (
              <LevelCard key={l.name} level={l} />
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: 6 }}>
            <FiStar size={16} color="#f59e0b" /> Classement — Top clients
          </h3>
          <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
            {leaderboard.map((u, i) => (
              <UserLoyaltyRow key={u.userId || i} user={u} rank={i + 1} />
            ))}
          </div>

          {/* Distribution par niveau */}
          <div style={{ background: '#fff', borderRadius: 14, padding: '16px 20px', marginTop: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: 13, fontWeight: 700, color: '#1e293b' }}>Répartition par niveau</h4>
            {byLevel.map(l => (
              <div key={l.name} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 16, width: 20 }}>{l.emoji}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: l.color, width: 60 }}>{l.name}</span>
                <div style={{ flex: 1, height: 8, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.min(100, (l.count / leaderboard.length) * 100)}%`, background: l.color, borderRadius: 4 }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#1e293b', width: 20, textAlign: 'right' }}>{l.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
