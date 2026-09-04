import { useEffect, useState } from 'react'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, PieChart, Pie, Cell, Legend,
} from 'recharts'
import { Package, CheckCircle2, Clock, Users } from 'lucide-react'
import api from '../../api/axios'

const STATUS_COLORS = { pending: '#f97316', assigned: '#3b82f6', picked_up: '#a855f7', delivered: '#2a7548' }
const STATUS_LABELS = { pending: 'Pending', assigned: 'Assigned', picked_up: 'In Transit', delivered: 'Delivered' }

export default function AdminDashboard() {
  const [overview, setOverview] = useState(null)

  useEffect(() => {
    api.get('/admin/analytics/overview/').then(({ data }) => setOverview(data))
  }, [])

  if (!overview) return <p className="text-gray-500">Loading overview...</p>

  const statusData = (overview.status_breakdown || []).map((s) => ({
    name: STATUS_LABELS[s.status] || s.status, value: s.count, color: STATUS_COLORS[s.status] || '#999',
  }))
  const timeSeriesData = (overview.donations_over_time || []).map((d) => ({ date: d.date.slice(5), count: d.count }))

  const stats = [
    { label: 'Total Donations', value: overview.total_donations, icon: Package, color: 'bg-brand-100 text-brand-700' },
    { label: 'Total Meals/Units', value: overview.total_quantity, icon: CheckCircle2, color: 'bg-brand-100 text-brand-700' },
    { label: 'Active Volunteers', value: overview.active_volunteers, icon: Users, color: 'bg-blue-100 text-blue-700' },
    { label: 'Pending Requests', value: overview.pending_requests, icon: Clock, color: 'bg-accent-100 text-accent-600' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Admin Overview</h1>
      <p className="text-gray-500 mb-6">Platform-wide analytics across all donors, volunteers, and NGOs.</p>

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

      <div className="card mb-5">
        <h3 className="font-semibold text-gray-900 mb-4">Donations Over Time (last 14 days)</h3>
        {timeSeriesData.length === 0 ? (
          <p className="text-sm text-gray-400">No recent donation activity.</p>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#2a7548" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">Donations by Status</h3>
          {statusData.length === 0 ? <p className="text-sm text-gray-400">No data yet.</p> : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={2}>
                  {statusData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
                <Tooltip /><Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">Platform Summary</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex justify-between"><span className="text-gray-400">Total campaigns</span><span>{overview.total_campaigns}</span></li>
            <li className="flex justify-between"><span className="text-gray-400">Total donations</span><span>{overview.total_donations}</span></li>
            <li className="flex justify-between"><span className="text-gray-400">Pending requests</span><span>{overview.pending_requests}</span></li>
            <li className="flex justify-between"><span className="text-gray-400">Active volunteers</span><span>{overview.active_volunteers}</span></li>
          </ul>
        </div>
      </div>

      {overview.recent_donations?.length > 0 && (
        <div className="card mt-5 overflow-x-auto">
          <h3 className="font-semibold text-gray-900 mb-4">Recent Donations</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-100">
                <th className="py-2 px-3 font-medium">Food</th>
                <th className="py-2 px-3 font-medium">Donor</th>
                <th className="py-2 px-3 font-medium">Location</th>
                <th className="py-2 px-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {overview.recent_donations.map((d) => (
                <tr key={d.id} className="border-b border-gray-50 last:border-0">
                  <td className="py-2 px-3">{d.food_type}</td>
                  <td className="py-2 px-3 text-gray-500">{d.donor_username}</td>
                  <td className="py-2 px-3 text-gray-500">{d.pickup_address}</td>
                  <td className="py-2 px-3"><span className={`badge badge-${d.status}`}>{d.status.replace('_', ' ')}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
