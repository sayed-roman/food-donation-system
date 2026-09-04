import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Leaf } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await login(username, password)
      navigate('/dashboard')
    } catch {
      setError('Invalid username or password.')
    }
  }

  return (
    <div className="min-h-screen bg-brand-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-6">
          <span className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" />
          </span>
          <span className="text-lg font-bold text-gray-900">Foodish</span>
        </Link>

        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Welcome back</h2>
          <p className="text-sm text-gray-500 mb-5">Log in to continue making an impact.</p>

          {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input className="input-field" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <input className="input-field" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit" className="btn-primary w-full mt-2">Log in</button>
          </form>

          <p className="text-sm text-gray-500 mt-4 text-center">
            No account? <Link to="/register" className="text-brand-700 font-medium">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
