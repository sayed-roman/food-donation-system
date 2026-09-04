import { useEffect, useState } from 'react'
import { MapPin, Package } from 'lucide-react'
import api from '../api/axios'

export default function MyTasks() {
  const [tasks, setTasks] = useState([])

  const fetchTasks = async () => {
    const { data } = await api.get('/tasks/my_tasks/')
    setTasks(data)
  }

  useEffect(() => { fetchTasks() }, [])

  const markPickedUp = async (id) => {
    await api.post(`/tasks/${id}/mark_picked_up/`)
    fetchTasks()
  }
  const markDelivered = async (id) => {
    await api.post(`/tasks/${id}/mark_delivered/`)
    fetchTasks()
  }

  const active = tasks.filter((t) => t.status !== 'delivered')
  const completed = tasks.filter((t) => t.status === 'delivered')

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">My Deliveries</h1>
      <p className="text-gray-500 mb-6">{active.length} active · {completed.length} completed</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {tasks.map((t) => (
          <div className="card" key={t.id}>
            <div className="flex items-center justify-between mb-2">
              <span className="w-9 h-9 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center">
                <Package className="w-4 h-4" />
              </span>
              <span className={`badge badge-${t.status}`}>{t.status.replace('_', ' ')}</span>
            </div>
            <h3 className="font-semibold text-gray-900">{t.donation_detail.food_type}</h3>
            <p className="text-sm text-gray-600">{t.donation_detail.quantity} {t.donation_detail.unit}</p>
            <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> {t.donation_detail.pickup_address}
            </p>
            {t.status === 'assigned' && (
              <button onClick={() => markPickedUp(t.id)} className="btn-primary w-full mt-4 text-sm">Mark Picked Up</button>
            )}
            {t.status === 'picked_up' && (
              <button onClick={() => markDelivered(t.id)} className="btn-primary w-full mt-4 text-sm">Mark Delivered</button>
            )}
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="card text-center py-16 col-span-full">
            <p className="text-gray-500">No tasks assigned yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
