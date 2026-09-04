import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, MapPin } from 'lucide-react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

const statusLabel = {
  pending: 'Pending', assigned: 'Assigned', picked_up: 'In Transit', delivered: 'Delivered',
}

export default function DonationList() {
  const [donations, setDonations] = useState([])
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('')
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState('')
  const { user } = useAuth()

  const fetchDonations = async () => {
    const params = { page }
    if (status) params.status = status
    if (search) params.search = search
    const { data } = await api.get('/donations/', { params })
    setDonations(data.results)
    setCount(data.count)
  }

  useEffect(() => { fetchDonations() }, [page, status, search])

  const acceptPickup = async (e, donationId) => {
    e.preventDefault()
    e.stopPropagation()
    setMessage('')
    try {
      await api.post('/tasks/accept/', { donation_id: donationId })
      setMessage('Pickup accepted! Check "My Deliveries" to get started.')
      fetchDonations()
    } catch (err) {
      setMessage(err.response?.data?.detail || 'Could not accept this pickup — it may have just been taken.')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Donations</h1>
          <p className="text-gray-500 text-sm">{count} total</p>
        </div>
        {user?.role === 'donor' && (
          <Link to="/donations/new" className="btn-primary">
            <Plus className="w-4 h-4" /> Donate
          </Link>
        )}
      </div>

      {message && <p className="text-sm text-brand-700 mb-4">{message}</p>}

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            className="input-field pl-9"
            placeholder="Search food type or address..."
            value={search}
            onChange={(e) => { setPage(1); setSearch(e.target.value) }}
          />
        </div>
        <select className="input-field w-auto" value={status} onChange={(e) => { setPage(1); setStatus(e.target.value) }}>
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="assigned">Assigned</option>
          <option value="picked_up">In Transit</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>

      {donations.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-gray-500">No donations found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {donations.map((d) => (
            <Link to={`/donations/${d.id}`} key={d.id} className="card hover:shadow-md transition-shadow block relative">
              {d.photo ? (
                <img src={d.photo} alt={d.food_type} className="w-full h-36 object-cover rounded-xl mb-3" />
              ) : (
                <div className="w-full h-36 rounded-xl mb-3 bg-brand-100 flex items-center justify-center text-4xl">🍽️</div>
              )}
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-gray-900">{d.food_type}</h3>
                <span className={`badge badge-${d.status}`}>{statusLabel[d.status]}</span>
              </div>
              <p className="text-sm text-gray-600">{d.quantity} {d.unit}</p>
              <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {d.pickup_address}
              </p>
              {user?.role === 'volunteer' && d.status === 'pending' && (
                <button
                  onClick={(e) => acceptPickup(e, d.id)}
                  className="btn-primary text-xs w-full mt-3"
                >
                  Accept Pickup
                </button>
              )}
            </Link>
          ))}
        </div>
      )}

      {count > 10 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button className="btn-secondary" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
          <span className="text-sm text-gray-500">Page {page}</span>
          <button className="btn-secondary" disabled={donations.length < 10} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      )}
    </div>
  )
}
