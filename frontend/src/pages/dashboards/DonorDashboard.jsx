import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, CheckCircle2, Clock, Megaphone, Plus, MapPin } from 'lucide-react'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

export default function DonorDashboard() {
  const [donations, setDonations] = useState([])
  const [campaigns, setCampaigns] = useState([])
  const { user } = useAuth()

  useEffect(() => {
    api.get('/donations/', { params: { donor: user.id, page_size: 100 } }).then(({ data }) => setDonations(data.results || data))
    api.get('/campaigns/').then(({ data }) => setCampaigns(data.results || data))
  }, [user.id])

  const delivered = donations.filter((d) => d.status === 'delivered').length
  const pending = donations.filter((d) => d.status === 'pending').length
  const totalQuantity = donations.reduce((sum, d) => sum + Number(d.quantity || 0), 0)

  const stats = [
    { label: 'Total Donations', value: donations.length, icon: Package, color: 'bg-brand-100 text-brand-700' },
    { label: 'Meals/Units Donated', value: totalQuantity, icon: CheckCircle2, color: 'bg-brand-100 text-brand-700' },
    { label: 'Pending', value: pending, icon: Clock, color: 'bg-accent-100 text-accent-600' },
    { label: 'Delivered', value: delivered, icon: CheckCircle2, color: 'bg-blue-100 text-blue-700' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.first_name || user?.username}! 👋</h1>
        <Link to="/donations/new" className="btn-primary"><Plus className="w-4 h-4" /> Donate Food</Link>
      </div>
      <p className="text-gray-500 mb-6">Thanks for being a part of this amazing community.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="stat-card">
            <span className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}><Icon className="w-5 h-5" /></span>
            <div>
              <p className="text-2xl font-bold text-gray-900 leading-none">{value}</p>
              <p className="text-xs text-gray-500 mt-1">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        <div className="md:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Recent Donations</h3>
            <Link to="/donations" className="text-sm text-brand-700 font-medium">View all</Link>
          </div>
          {donations.length === 0 ? (
            <p className="text-sm text-gray-400">You haven't submitted any donations yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {donations.slice(0, 5).map((d) => (
                <Link key={d.id} to={`/donations/${d.id}`} className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3 hover:bg-brand-50 transition">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{d.food_type}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1"><MapPin className="w-3 h-3" /> {d.pickup_address}</p>
                  </div>
                  <span className={`badge badge-${d.status}`}>{d.status.replace('_', ' ')}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Campaigns</h3>
            <Megaphone className="w-4 h-4 text-brand-600" />
          </div>
          {campaigns.length === 0 ? (
            <p className="text-sm text-gray-400">No active campaigns right now.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {campaigns.slice(0, 3).map((c) => (
                <div key={c.id}>
                  <p className="text-sm font-medium text-gray-700">{c.title}</p>
                  <div className="w-full bg-gray-100 rounded-full h-2 mt-1 overflow-hidden">
                    <div className="bg-brand-600 h-full rounded-full" style={{ width: `${c.progress_percent}%` }} />
                  </div>
                </div>
              ))}
              <Link to="/campaigns" className="text-sm text-brand-700 font-medium mt-1">View all campaigns</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
