import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Megaphone, Package, Users } from 'lucide-react'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

export default function NGODashboard() {
  const [campaigns, setCampaigns] = useState([])
  const [donations, setDonations] = useState([])
  const { user } = useAuth()

  useEffect(() => {
    api.get('/campaigns/', { params: { ngo: user.id } }).then(({ data }) => setCampaigns(data.results || data))
    api.get('/donations/', { params: { page_size: 100 } }).then(({ data }) => setDonations(data.results || data))
  }, [user.id])

  const totalCollected = campaigns.reduce((sum, c) => sum + Number(c.collected_quantity || 0), 0)
  const linkedDonations = donations.filter((d) => campaigns.some((c) => c.id === d.campaign))

  const stats = [
    { label: 'My Campaigns', value: campaigns.length, icon: Megaphone, color: 'bg-brand-100 text-brand-700' },
    { label: 'Total Collected', value: totalCollected, icon: Package, color: 'bg-brand-100 text-brand-700' },
    { label: 'Linked Donations', value: linkedDonations.length, icon: Users, color: 'bg-blue-100 text-blue-700' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.first_name || user?.username}! 👋</h1>
        <Link to="/campaigns" className="btn-primary">Manage Campaigns</Link>
      </div>
      <p className="text-gray-500 mb-6">Track your organization's campaigns and distribution.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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

      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-4">Campaign Progress</h3>
        {campaigns.length === 0 ? (
          <p className="text-sm text-gray-400">You haven't created any campaigns yet. <Link to="/campaigns" className="text-brand-700 font-medium">Create one</Link>.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {campaigns.map((c) => (
              <div key={c.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{c.title}</span>
                  <span className="text-gray-400">{c.collected_quantity}/{c.goal_quantity} ({c.progress_percent}%)</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-brand-600 h-full rounded-full" style={{ width: `${c.progress_percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
