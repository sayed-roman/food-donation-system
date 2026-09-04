import { useAuth } from '../context/AuthContext'
import DonorDashboard from './dashboards/DonorDashboard'
import VolunteerDashboard from './dashboards/VolunteerDashboard'
import NGODashboard from './dashboards/NGODashboard'
import AdminDashboard from './dashboards/AdminDashboard'

const dashboardByRole = {
  donor: DonorDashboard,
  volunteer: VolunteerDashboard,
  ngo_manager: NGODashboard,
  admin: AdminDashboard,
}

export default function Dashboard() {
  const { user } = useAuth()
  const RoleDashboard = dashboardByRole[user?.role] || DonorDashboard
  return <RoleDashboard />
}
