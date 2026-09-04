import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Megaphone } from 'lucide-react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function CampaignList() {
  const [campaigns, setCampaigns] = useState([])
  const [form, setForm] = useState({ title: '', description: '', goal_quantity: '', deadline: '' })
  const { user } = useAuth()
  const navigate = useNavigate()

  const fetchCampaigns = async () => {
    const { data } = await api.get('/campaigns/')
    setCampaigns(data.results || data)
  }

  useEffect(() => { fetchCampaigns() }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleCreate = async (e) => {
    e.preventDefault()
    await api.post('/campaigns/', form)
    setForm({ title: '', description: '', goal_quantity: '', deadline: '' })
    fetchCampaigns()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Campaigns</h1>

      {user?.role === 'ngo_manager' && (
        <form onSubmit={handleCreate} className="card mb-8 max-w-lg flex flex-col gap-3">
          <h3 className="font-semibold text-gray-900">Create a new campaign</h3>
          <input className="input-field" name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
          <textarea className="input-field" name="description" placeholder="Description" value={form.description} onChange={handleChange} rows={3} />
          <div className="grid grid-cols-2 gap-3">
            <input className="input-field" name="goal_quantity" type="number" placeholder="Goal quantity" value={form.goal_quantity} onChange={handleChange} required />
            <input className="input-field" name="deadline" type="date" value={form.deadline} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn-primary self-start">Create Campaign</button>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {campaigns.map((c) => (
          <div className="card" key={c.id}>
            <span className="w-9 h-9 rounded-xl bg-accent-100 text-accent-600 flex items-center justify-center mb-3">
              <Megaphone className="w-4 h-4" />
            </span>
            <h3 className="font-semibold text-gray-900">{c.title}</h3>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{c.description}</p>
            <p className="text-xs text-gray-500 mt-3">Goal: {c.goal_quantity} · Collected: {c.collected_quantity} ({c.progress_percent}%)</p>
            <div className="w-full bg-gray-100 rounded-full h-2 mt-1.5 overflow-hidden">
              <div className="bg-brand-600 h-full rounded-full" style={{ width: `${c.progress_percent}%` }} />
            </div>
            <p className="text-xs text-gray-400 mt-2">Deadline: {c.deadline}</p>
            {user?.role === 'donor' && (
              <button
                onClick={() => navigate('/donations/new', { state: { campaignId: c.id } })}
                className="btn-secondary w-full mt-4 text-sm"
              >
                Donate to this campaign
              </button>
            )}
          </div>
        ))}
        {campaigns.length === 0 && (
          <div className="card text-center py-16 col-span-full">
            <p className="text-gray-500">No campaigns yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
