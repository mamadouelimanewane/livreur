import { useState, useEffect } from 'react'
import { FiGift, FiTarget, FiTrendingUp, FiAward, FiDollarSign, FiCheck, FiClock, FiStar } from 'react-icons/fi'
import PageLayout from '../../components/PageLayout'
import {
  getDriverBonuses,
  getDriverBonusStats,
  getBonusGoals,
  claimBonus,
  claimAllBonuses,
  getBonusLeaderboard,
  BONUS_TYPES,
  BONUS_STATUS,
} from '../../services/api/driverBonusesService'

const ACCENT = '#4680ff'
const DARK = '#1a1d2e'
const GREEN = '#22c55e'
const ORANGE = '#f59e0b'

function StatCard({ icon, label, value, color = ACCENT }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 16, padding: 20,
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: `${color}15`, display: 'flex',
          alignItems: 'center', justifyContent: 'center', color,
        }}>
          {icon}
        </div>
        <span style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>{label}</span>
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, color: DARK }}>{value}</div>
    </div>
  )
}

function GoalCard({ goal, progress }) {
  const percentage = Math.min((progress / goal.target) * 100, 100)
  const isComplete = progress >= goal.target
  
  return (
    <div style={{
      background: '#fff', borderRadius: 16, padding: 20,
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      border: isComplete ? '2px solid #22c55e' : '1px solid #e2e8f0',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: DARK, marginBottom: 4 }}>
            {goal.name}
          </div>
          <div style={{ fontSize: 12, color: '#64748b' }}>
            {goal.description}
          </div>
        </div>
        <div style={{
          padding: '6px 12px', borderRadius: 8,
          background: isComplete ? '#e6faf4' : `${ACCENT}10`,
          color: isComplete ? GREEN : ACCENT,
          fontSize: 12, fontWeight: 700,
        }}>
          +{goal.reward} FCFA
        </div>
      </div>
      
      <div style={{ marginBottom: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
          <span style={{ color: '#64748b' }}>Progression</span>
          <span style={{ fontWeight: 600, color: DARK }}>{progress}/{goal.target}</span>
        </div>
        <div style={{ height: 8, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{
            width: `${percentage}%`, height: '100%',
            background: isComplete ? GREEN : ACCENT,
            borderRadius: 4, transition: 'width 0.3s',
          }} />
        </div>
      </div>
      
      {isComplete && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          color: GREEN, fontSize: 12, fontWeight: 600,
        }}>
          <FiCheck size={14} /> Objectif atteint !
        </div>
      )}
    </div>
  )
}

function BonusCard({ bonus, onClaim }) {
  const status = BONUS_STATUS[bonus.status] || BONUS_STATUS.pending
  
  return (
    <div style={{
      background: '#fff', borderRadius: 16, padding: 16,
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      border: `1px solid ${status.color}20`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: `${status.color}15`, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            color: status.color,
          }}>
            <FiGift size={20} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: DARK }}>
              {bonus.goalName || BONUS_TYPES[bonus.type]?.label}
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>
              {new Date(bonus.createdAt).toLocaleDateString('fr-FR')}
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: GREEN }}>
            +{bonus.reward} FCFA
          </div>
          <div style={{
            fontSize: 10, padding: '2px 8px', borderRadius: 6,
            background: status.color, color: '#fff',
            fontWeight: 600, display: 'inline-block',
          }}>
            {status.label}
          </div>
        </div>
      </div>
      
      {bonus.status === 'earned' && (
        <button
          onClick={() => onClaim(bonus.id)}
          style={{
            width: '100%', marginTop: 8, padding: '8px',
            background: GREEN, color: '#fff', border: 'none',
            borderRadius: 8, fontSize: 12, fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Réclamer
        </button>
      )}
    </div>
  )
}

function LeaderboardItem({ driver, rank }) {
  const medalColors = ['#ffd700', '#c0c0c0', '#cd7f32']
  
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 0', borderBottom: '1px solid #f1f5f9',
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: '50%',
        background: rank <= 3 ? medalColors[rank - 1] : '#e2e8f0',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 12, fontWeight: 800, color: rank <= 3 ? '#fff' : DARK,
      }}>
        {rank}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: DARK }}>
          {driver.drivers?.name || driver.name}
        </div>
        <div style={{ fontSize: 11, color: '#94a3b8' }}>
          ★ {driver.drivers?.rating || driver.rating || 0}
        </div>
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, color: GREEN }}>
        {driver.total_bonuses?.toLocaleString() || 0} FCFA
      </div>
    </div>
  )
}

export default function DriverBonusesPage() {
  const [driverId] = useState('DRV-001') // Demo driver
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [goals, setGoals] = useState([])
  const [bonuses, setBonuses] = useState([])
  const [leaderboard, setLeaderboard] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [statsData, goalsData, bonusesData, leaderboardData] = await Promise.all([
        getDriverBonusStats(driverId),
        getBonusGoals(),
        getDriverBonuses(driverId),
        getBonusLeaderboard(5),
      ])
      
      setStats(statsData)
      setGoals(goalsData)
      setBonuses(bonusesData)
      setLeaderboard(leaderboardData)
    } catch (err) {
      console.error('Error loading bonuses:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleClaim = async (bonusId) => {
    await claimBonus(bonusId)
    loadData()
  }

  const handleClaimAll = async () => {
    await claimAllBonuses(driverId)
    loadData()
  }

  const earnedNotClaimed = bonuses.filter(b => b.status === 'earned').reduce((sum, b) => sum + b.reward, 0)

  if (loading) {
    return (
      <PageLayout title="Mes Bonus">
        <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>
          Chargement...
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout 
      title="Mes Bonus & Objectifs"
      actions={
        earnedNotClaimed > 0 && (
          <button onClick={handleClaimAll} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: GREEN, color: '#fff', border: 'none',
            padding: '10px 16px', borderRadius: 10, fontSize: 13,
            fontWeight: 600, cursor: 'pointer',
          }}>
            <FiDollarSign size={16} /> Réclamer tout ({earnedNotClaimed.toLocaleString()} FCFA)
          </button>
        )
      }
    >
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <StatCard
          icon={<FiGift size={20} />}
          label="Total Bonus Gagnés"
          value={`${stats?.totalBonuses?.toLocaleString() || 0} FCFA`}
          color={GREEN}
        />
        <StatCard
          icon={<FiClock size={20} />}
          label="En Attente"
          value={`${stats?.pendingBonuses?.toLocaleString() || 0} FCFA`}
          color={ORANGE}
        />
        <StatCard
          icon={<FiTarget size={20} />}
          label="Courses Aujourd'hui"
          value={stats?.ridesToday || 0}
        />
        <StatCard
          icon={<FiTrendingUp size={20} />}
          label="Série Actuelle"
          value={`${stats?.currentStreak || 0} jours`}
          color={ACCENT}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        {/* Goals */}
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: DARK, marginBottom: 16 }}>
            <FiAward style={{ marginRight: 8 }} />
            Objectifs en cours
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {goals.slice(0, 4).map(goal => {
              let progress = 0
              if (goal.type === 'rides_count') {
                progress = goal.period === 'daily' ? stats?.ridesToday : 
                           goal.period === 'weekly' ? stats?.ridesThisWeek : 
                           stats?.ridesThisMonth
              } else if (goal.type === 'rating') {
                progress = stats?.averageRating
              } else if (goal.type === 'streak') {
                progress = stats?.currentStreak
              } else if (goal.type === 'completion_rate') {
                progress = stats?.completionRate
              }
              return <GoalCard key={goal.id} goal={goal} progress={progress || 0} />
            })}
          </div>
        </div>

        {/* Leaderboard */}
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: DARK, marginBottom: 16 }}>
            <FiStar style={{ marginRight: 8 }} />
            Classement
          </div>
          <div style={{
            background: '#fff', borderRadius: 16, padding: 16,
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          }}>
            {leaderboard.map((driver, i) => (
              <LeaderboardItem key={driver.driver_id} driver={driver} rank={i + 1} />
            ))}
          </div>
        </div>
      </div>

      {/* Recent Bonuses */}
      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: DARK, marginBottom: 16 }}>
          <FiGift style={{ marginRight: 8 }} />
          Historique des Bonus
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {bonuses.slice(0, 6).map(bonus => (
            <BonusCard key={bonus.id} bonus={bonus} onClaim={handleClaim} />
          ))}
        </div>
      </div>
    </PageLayout>
  )
}
