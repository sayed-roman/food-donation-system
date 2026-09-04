import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Leaf } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const roles = [
  { value: 'donor', label: 'Donor', desc: 'I have surplus food to give' },
  { value: 'volunteer', label: 'Volunteer', desc: 'I can pick up & deliver' },
  { value: 'ngo_manager', label: 'NGO Manager', desc: 'We distribute to beneficiaries' },
]

export default function Register() {
  const [form, setForm] = useState({
    username: '', email: '', password: '', first_name: '', last_name: '',
    phone_number: '', role: 'donor', organization_name: '',
  })
  const [error, setError] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await register(form)
      navigate('/dashboard')
    } catch (err) {
      setError(JSON.stringify(err.response?.data) || 'Registration failed.')
    }
  }

  return (
    <div className="min-h-screen bg-brand-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <Link to="/" className="flex items-center justify-center gap-2 mb-6">
          <span className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" />
          </span>
          <span className="text-lg font-bold text-gray-900">Foodish</span>
        </Link>

        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Create your account</h2>
          <p className="text-sm text-gray-500 mb-5">Join Foodish as a donor, volunteer, or NGO manager.</p>

          {error && <p className="text-sm text-red-600 mb-3 break-words">{error}</p>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-2">
              {roles.map((r) => (
                <button
                  type="button"
                  key={r.value}
                  onClick={() => setForm({ ...form, role: r.value })}
                  className={`text-left rounded-xl border p-3 transition ${
                    form.role === r.value ? 'border-brand-600 bg-brand-50' : 'border-gray-200 hover:border-brand-300'
                  }`}
                >
                  <p className="font-semibold text-sm text-gray-900">{r.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{r.desc}</p>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input className="input-field" name="first_name" placeholder="First name" value={form.first_name} onChange={handleChange} required />
              <input className="input-field" name="last_name" placeholder="Last name" value={form.last_name} onChange={handleChange} required />
            </div>
            <input className="input-field" name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
            <input className="input-field" name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
            <input className="input-field" name="phone_number" placeholder="Phone number" value={form.phone_number} onChange={handleChange} />
            <input className="input-field" name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
            {form.role === 'ngo_manager' && (
              <input className="input-field" name="organization_name" placeholder="Organization name" value={form.organization_name} onChange={handleChange} />
            )}
            <button type="submit" className="btn-primary w-full mt-1">Create account</button>
          </form>

          <p className="text-sm text-gray-500 mt-4 text-center">
            Already have an account? <Link to="/login" className="text-brand-700 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
