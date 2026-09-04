import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, CheckCircle2, Calendar, Star, MapPin } from 'lucide-react'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

export default function VolunteerDashboard() {
  const [stats, setStats] = useState(null)
  const [availablePickups, setAvailablePickups] = useState([])
  const [myTasks, setMyTasks] = useState([])
  const [message, setMessage] = useState('')
  const { user } = useAuth()

  const fetchAll = () => {
    api.get('/tasks/my_stats/').then(({ data }) => setStats(data))
    api.get('/donations/', { params: { status: 'pending', page_size: 5 } }).then(({ data }) => setAvailablePickups(data.results || data))
    api.get('/tasks/my_tasks/').then(({ data }) => setMyTasks(data.filter((t) => t.status !== 'delivered').slice(0, 5)))
  }

  useEffect(() => { fetchAll() }, [])

  const acceptPickup = async (donationId) => {
    setMessage('')
    try {
      await api.post('/tasks/accept/', { donation_id: donationId })
      setMessage('Pickup accepted! Check "My Deliveries" to get started.')
      fetchAll()
    } catch (err) {
      setMessage(err.response?.data?.detail || 'Could not accept this pickup — it may have just been taken.')
    }
  }

  const statCards = [
    { label: 'Available Pickups', value: stats?.available_pickups ?? '—', icon: Package, color: 'bg-brand-100 text-brand-700' },
    { label: 'Completed Deliveries', value: stats?.completed_deliveries ?? '—', icon: CheckCircle2, color: 'bg-blue-100 text-blue-700' },
    { label: "This Week", value: stats?.this_week ?? '—', icon: Calendar, color: 'bg-accent-100 text-accent-600' },
    { label: 'Rating', value: stats?.average_rating ? `${stats.average_rating} ★` : '—', icon: Star, color: 'bg-purple-100 text-purple-700' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Hello, {user?.first_name || user?.username}! 👋</h1>
      <p className="text-gray-500 mb-6">Ready to make a difference today?</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="stat-card">
            <span className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}><Icon className="w-5 h-5" /></span>
            <div>
              <p className="text-2xl font-bold text-gray-900 leading-none">{value}</p>
              <p className="text-xs text-gray-500 mt-1">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {message && <p className="text-sm text-brand-700 mb-4">{message}</p>}

      <div className="grid md:grid-cols-2 gap-5">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Available Pickups</h3>
            <Link to="/donations" className="text-sm text-brand-700 font-medium">View all</Link>
          </div>
          {availablePickups.length === 0 ? (
            <p className="text-sm text-gray-400">No pending pickups right now.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {availablePickups.map((d) => (
                <div key={d.id} className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3">
                  <Link to={`/donations/${d.id}`} className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{d.food_type}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1"><MapPin className="w-3 h-3" /> {d.pickup_address}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{d.quantity} {d.unit}</p>
                  </Link>
                  <button onClick={() => acceptPickup(d.id)} className="btn-primary text-xs px-3 py-1.5 shrink-0">Accept Pickup</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">My Deliveries</h3>
            <Link to="/my-tasks" className="text-sm text-brand-700 font-medium">View all</Link>
          </div>
          {myTasks.length === 0 ? (
            <p className="text-sm text-gray-400">No active deliveries right now.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {myTasks.map((t) => (
                <Link key={t.id} to={`/donations/${t.donation_detail.id}`} className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3 hover:bg-brand-50 transition">
                  <p className="text-sm font-medium text-gray-900">{t.donation_detail.food_type}</p>
                  <span className={`badge badge-${t.status}`}>{t.status.replace('_', ' ')}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
