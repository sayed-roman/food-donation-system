import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Check } from 'lucide-react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

const timelineSteps = [
  { key: 'pending', label: 'Submitted' },
  { key: 'assigned', label: 'Volunteer Assigned' },
  { key: 'picked_up', label: 'Picked Up' },
  { key: 'delivered', label: 'Delivered' },
]

export default function DonationDetail() {
  const { id } = useParams()
  const [donation, setDonation] = useState(null)
  const [volunteers, setVolunteers] = useState([])
  const [message, setMessage] = useState('')
  const { user } = useAuth()

  const fetchDonation = async () => {
    const { data } = await api.get(`/donations/${id}/`)
    setDonation(data)
  }

  const fetchNearbyVolunteers = async () => {
    try {
      const { data } = await api.get(`/donations/${id}/nearby_volunteers/`)
      setVolunteers(data)
    } catch {
      // no permission - fine
    }
  }

  useEffect(() => { fetchDonation() }, [id])
  useEffect(() => {
    if (user && ['ngo_manager', 'admin'].includes(user.role)) fetchNearbyVolunteers()
  }, [user, id])

  const assignVolunteer = async (volunteerId) => {
    try {
      await api.post('/tasks/assign/', { donation_id: id, volunteer_id: volunteerId })
      setMessage('Volunteer assigned successfully.')
      fetchDonation()
    } catch (err) {
      setMessage(err.response?.data?.detail || 'Could not assign volunteer.')
    }
  }

  const acceptPickup = async () => {
    try {
      await api.post('/tasks/accept/', { donation_id: id })
      setMessage('You accepted this pickup! Check "My Deliveries" to get started.')
      fetchDonation()
    } catch (err) {
      setMessage(err.response?.data?.detail || 'Could not accept this pickup.')
    }
  }

  if (!donation) return <p className="text-gray-500">Loading...</p>

  const currentIndex = timelineSteps.findIndex((s) => s.key === donation.status)

  return (
    <div className="max-w-3xl">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{donation.food_type}</h1>
          <p className="text-gray-500 text-sm">Donation #{donation.id}</p>
        </div>
        <span className={`badge badge-${donation.status}`}>{donation.status.replace('_', ' ')}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="card">
          {donation.photo ? (
            <img src={donation.photo} alt={donation.food_type} className="w-full h-48 object-cover rounded-xl mb-4" />
          ) : (
            <div className="w-full h-48 rounded-xl mb-4 bg-brand-100 flex items-center justify-center text-5xl">🍽️</div>
          )}
          <dl className="text-sm text-gray-600 space-y-2">
            <div className="flex justify-between"><dt className="text-gray-400">Quantity</dt><dd>{donation.quantity} {donation.unit}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-400">Pickup address</dt><dd className="text-right">{donation.pickup_address}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-400">Donor</dt><dd>{donation.donor_username}</dd></div>
            {donation.expiry_date && <div className="flex justify-between"><dt className="text-gray-400">Best before</dt><dd>{donation.expiry_date}</dd></div>}
          </dl>
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">Delivery Status</h3>
          <div className="flex flex-col gap-0">
            {timelineSteps.map((s, i) => (
              <div key={s.key} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                    i <= currentIndex ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-400'
                  }`}>
                    {i <= currentIndex ? <Check className="w-3.5 h-3.5" /> : i + 1}
                  </div>
                  {i < timelineSteps.length - 1 && (
                    <div className={`w-px flex-1 min-h-[24px] ${i < currentIndex ? 'bg-brand-600' : 'bg-gray-200'}`} />
                  )}
                </div>
                <p className={`text-sm pb-6 ${i <= currentIndex ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {message && <p className="text-sm text-brand-700 mt-4">{message}</p>}

      {user?.role === 'volunteer' && donation.status === 'pending' && (
        <div className="card mt-5 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">This pickup is available</h3>
            <p className="text-sm text-gray-500">Accept it to add it to your deliveries.</p>
          </div>
          <button onClick={acceptPickup} className="btn-primary">Accept Pickup</button>
        </div>
      )}

      {user && ['ngo_manager', 'admin'].includes(user.role) && donation.status === 'pending' && (
        <div className="card mt-5">
          <h3 className="font-semibold text-gray-900 mb-1">Manually assign a volunteer</h3>
          <p className="text-xs text-gray-400 mb-3">Optional override — volunteers can also accept this pickup themselves.</p>
          {volunteers.length === 0 && <p className="text-sm text-gray-400">No available volunteers with a set location nearby.</p>}
          <div className="flex flex-col gap-2">
            {volunteers.map((v) => (
              <div key={v.id} className="flex items-center justify-between text-sm border border-gray-100 rounded-xl px-4 py-2.5">
                <span>{v.username} — <span className="text-gray-400">{v.distance_km} km away</span></span>
                <button onClick={() => assignVolunteer(v.id)} className="btn-primary text-xs px-3 py-1.5">Assign</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
