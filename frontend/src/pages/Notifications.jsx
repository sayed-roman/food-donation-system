import { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'
import api from '../api/axios'

export default function Notifications() {
  const [notifications, setNotifications] = useState([])

  const fetchNotifications = async () => {
    const { data } = await api.get('/notifications/')
    setNotifications(data.results || data)
  }

  useEffect(() => { fetchNotifications() }, [])

  const markRead = async (id) => {
    await api.post(`/notifications/${id}/mark_read/`)
    fetchNotifications()
  }
  const markAllRead = async () => {
    await api.post('/notifications/mark_all_read/')
    fetchNotifications()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <button onClick={markAllRead} className="btn-secondary text-sm">Mark all as read</button>
      </div>

      <div className="flex flex-col gap-2">
        {notifications.map((n) => (
          <button
            key={n.id}
            onClick={() => markRead(n.id)}
            className={`card text-left flex items-start gap-3 ${n.is_read ? 'opacity-60' : 'border-l-4 border-l-brand-600'}`}
          >
            <span className="w-8 h-8 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4" />
            </span>
            <div>
              <p className={`text-sm ${!n.is_read ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>{n.message}</p>
              <p className="text-xs text-gray-400 mt-1">{new Date(n.created_at).toLocaleString()}</p>
            </div>
          </button>
        ))}
        {notifications.length === 0 && (
          <div className="card text-center py-16">
            <p className="text-gray-500">No notifications yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
