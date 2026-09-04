import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Check, MapPinned } from 'lucide-react'
import api from '../api/axios'

const steps = ['Food Details', 'Pickup Info', 'Review & Submit']

export default function DonationForm() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    food_type: '', quantity: '', unit: 'kg', expiry_date: '',
    pickup_address: '', pickup_latitude: '', pickup_longitude: '',
  })
  const [photo, setPhoto] = useState(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const campaignId = location.state?.campaignId

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const useMyLocation = () => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition((pos) => {
      setForm((f) => ({ ...f, pickup_latitude: pos.coords.latitude, pickup_longitude: pos.coords.longitude }))
    })
  }

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1))
  const back = () => setStep((s) => Math.max(s - 1, 0))

  const handleSubmit = async () => {
    setError('')
    try {
      const data = new FormData()
      Object.entries(form).forEach(([k, v]) => data.append(k, v))
      if (photo) data.append('photo', photo)
      if (campaignId) data.append('campaign', campaignId)

      await api.post('/donations/', data, { headers: { 'Content-Type': 'multipart/form-data' } })
      navigate('/donations')
    } catch (err) {
      setError(JSON.stringify(err.response?.data) || 'Something went wrong.')
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Donate Food</h1>
      <p className="text-gray-500 mb-6">Step {step + 1} of {steps.length}</p>

      <div className="flex items-center gap-2 mb-8">
        {steps.map((label, i) => (
          <div key={label} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${
              i <= step ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {i < step ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            <span className={`text-xs font-medium hidden sm:block ${i === step ? 'text-gray-900' : 'text-gray-400'}`}>{label}</span>
            {i < steps.length - 1 && <div className="flex-1 h-px bg-gray-200" />}
          </div>
        ))}
      </div>

      <div className="card">
        {error && <p className="text-sm text-red-600 mb-3 break-words">{error}</p>}

        {step === 0 && (
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Food Name *</label>
              <input className="input-field mt-1" name="food_type" placeholder="e.g. Cooked rice and curry" value={form.food_type} onChange={handleChange} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Quantity *</label>
                <input className="input-field mt-1" name="quantity" type="number" placeholder="15" value={form.quantity} onChange={handleChange} required />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Unit</label>
                <select className="input-field mt-1" name="unit" value={form.unit} onChange={handleChange}>
                  <option value="kg">kg</option>
                  <option value="meals">meals</option>
                  <option value="packets">packets</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Expiry / Available Until</label>
              <input className="input-field mt-1" name="expiry_date" type="date" value={form.expiry_date} onChange={handleChange} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Photo (optional)</label>
              <input className="input-field mt-1" type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Pickup Address *</label>
              <input className="input-field mt-1" name="pickup_address" placeholder="House, road, area" value={form.pickup_address} onChange={handleChange} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input className="input-field" name="pickup_latitude" placeholder="Latitude" value={form.pickup_latitude} onChange={handleChange} required />
              <input className="input-field" name="pickup_longitude" placeholder="Longitude" value={form.pickup_longitude} onChange={handleChange} required />
            </div>
            <button type="button" onClick={useMyLocation} className="btn-secondary self-start">
              <MapPinned className="w-4 h-4" /> Use my current location
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-gray-900">Review your donation</h3>
            <div className="text-sm text-gray-600 grid grid-cols-2 gap-y-2">
              <span className="text-gray-400">Food</span><span>{form.food_type}</span>
              <span className="text-gray-400">Quantity</span><span>{form.quantity} {form.unit}</span>
              <span className="text-gray-400">Expiry</span><span>{form.expiry_date || '\u2014'}</span>
              <span className="text-gray-400">Pickup address</span><span>{form.pickup_address}</span>
              <span className="text-gray-400">Photo</span><span>{photo ? photo.name : 'None'}</span>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-6">
          {step > 0 ? (
            <button type="button" onClick={back} className="btn-secondary">Back</button>
          ) : <span />}
          {step < steps.length - 1 ? (
            <button type="button" onClick={next} className="btn-primary">Continue</button>
          ) : (
            <button type="button" onClick={handleSubmit} className="btn-primary">Submit Donation</button>
          )}
        </div>
      </div>
    </div>
  )
}
