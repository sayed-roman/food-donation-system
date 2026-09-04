import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Package, PlusCircle, Map, Bell, User as UserIcon,
  LogOut, Megaphone, ClipboardList, Users, Building2,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const linksByRole = {
  donor: [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/donations', label: 'My Donations', icon: Package },
    { to: '/donations/new', label: 'Donate', icon: PlusCircle },
    { to: '/campaigns', label: 'Campaigns', icon: Megaphone },
    { to: '/map', label: 'Map', icon: Map },
  ],
  volunteer: [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/my-tasks', label: 'My Deliveries', icon: ClipboardList },
    { to: '/donations', label: 'Available Pickups', icon: Package },
    { to: '/map', label: 'Map', icon: Map },
  ],
  ngo_manager: [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/donations', label: 'Donations', icon: Package },
    { to: '/campaigns', label: 'Campaigns', icon: Megaphone },
    { to: '/map', label: 'Map', icon: Map },
  ],
  admin: [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/donations', label: 'Donations', icon: Package },
    { to: '/admin/users', label: 'Users', icon: Users },
    { to: '/admin/volunteers', label: 'Volunteers', icon: ClipboardList },
    { to: '/admin/organizations', label: 'Organizations', icon: Building2 },
    { to: '/campaigns', label: 'Campaigns', icon: Megaphone },
    { to: '/map', label: 'Map', icon: Map },
  ],
}

export default function Sidebar() {
  const { user, logout } = useAuth()
  const links = linksByRole[user?.role] || linksByRole.donor

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-gray-100 min-h-screen p-4 flex flex-col">
      <div className="flex items-center gap-2 px-2 py-3 mb-2">
        <span className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold">F</span>
        <span className="font-bold text-gray-900">Foodish</span>
      </div>

      <nav className="flex-1 flex flex-col gap-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}
        <NavLink to="/notifications" className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}>
          <Bell className="w-4 h-4" /> Notifications
        </NavLink>
      </nav>

      <div className="flex flex-col gap-1 pt-2 border-t border-gray-100">
        <span className="sidebar-link cursor-default">
          <UserIcon className="w-4 h-4" /> {user?.username} <span className="text-xs text-gray-400">({user?.role})</span>
        </span>
        <button onClick={logout} className="sidebar-link text-red-500 hover:bg-red-50 hover:text-red-600 w-full text-left">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </aside>
  )
}
