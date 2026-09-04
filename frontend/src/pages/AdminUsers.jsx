import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import api from '../api/axios'

const roleLabels = {
  donor: 'Donor', volunteer: 'Volunteer', ngo_manager: 'NGO Manager', admin: 'Admin',
}

/**
 * Reusable admin management table.
 * roleFilter: fixed role to lock the view to (e.g. 'volunteer' for the Volunteers page,
 * 'ngo_manager' for Organizations). Pass null for the general Users page (all roles, with a picker).
 */
export default function AdminUsers({ roleFilter = null, title = 'Users' }) {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [role, setRole] = useState(roleFilter || '')
  const [count, setCount] = useState(0)

  const fetchUsers = async () => {
    const params = {}
    if (role) params.role = role
    if (search) params.search = search
    const { data } = await api.get('/admin/users/', { params })
    setUsers(data.results || data)
    setCount(data.count ?? (data.results || data).length)
  }

  useEffect(() => { fetchUsers() }, [role, search])

  const toggleActive = async (user) => {
    const action = user.is_active ? 'deactivate' : 'activate'
    await api.post(`/admin/users/${user.id}/${action}/`)
    fetchUsers()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-500 text-sm">{count} total</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input className="input-field pl-9" placeholder="Search name, username, email..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        {!roleFilter && (
          <select className="input-field w-auto" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="">All roles</option>
            <option value="donor">Donors</option>
            <option value="volunteer">Volunteers</option>
            <option value="ngo_manager">NGO Managers</option>
            <option value="admin">Admins</option>
          </select>
        )}
      </div>

      <div className="card overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b border-gray-100">
              <th className="py-3 px-4 font-medium">Name</th>
              <th className="py-3 px-4 font-medium">Username</th>
              <th className="py-3 px-4 font-medium">Email</th>
              {!roleFilter && <th className="py-3 px-4 font-medium">Role</th>}
              {roleFilter === 'ngo_manager' && <th className="py-3 px-4 font-medium">Organization</th>}
              {roleFilter === 'volunteer' && <th className="py-3 px-4 font-medium">Available</th>}
              <th className="py-3 px-4 font-medium">Status</th>
              <th className="py-3 px-4 font-medium">Joined</th>
              <th className="py-3 px-4 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-gray-50 last:border-0">
                <td className="py-3 px-4">{u.first_name} {u.last_name}</td>
                <td className="py-3 px-4 text-gray-500">{u.username}</td>
                <td className="py-3 px-4 text-gray-500">{u.email}</td>
                {!roleFilter && <td className="py-3 px-4">{roleLabels[u.role]}</td>}
                {roleFilter === 'ngo_manager' && <td className="py-3 px-4">{u.organization_name || '—'}</td>}
                {roleFilter === 'volunteer' && (
                  <td className="py-3 px-4">
                    <span className={`badge ${u.is_available ? 'badge-delivered' : 'badge-pending'}`}>
                      {u.is_available ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                )}
                <td className="py-3 px-4">
                  <span className={`badge ${u.is_active ? 'badge-delivered' : 'badge-pending'}`}>
                    {u.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-400">{new Date(u.date_joined).toLocaleDateString()}</td>
                <td className="py-3 px-4">
                  <button onClick={() => toggleActive(u)} className="btn-secondary text-xs px-3 py-1.5">
                    {u.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={8} className="text-center py-10 text-gray-400">No users found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
