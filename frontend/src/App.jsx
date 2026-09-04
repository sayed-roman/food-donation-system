import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import DonationList from './pages/DonationList'
import DonationForm from './pages/DonationForm'
import DonationDetail from './pages/DonationDetail'
import MyTasks from './pages/MyTasks'
import CampaignList from './pages/CampaignList'
import MapView from './pages/MapView'
import Notifications from './pages/Notifications'
import Dashboard from './pages/Dashboard'
import AdminUsers from './pages/AdminUsers'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/donations" element={<ProtectedRoute><DonationList /></ProtectedRoute>} />
      <Route path="/donations/new" element={<ProtectedRoute allowedRoles={['donor']}><DonationForm /></ProtectedRoute>} />
      <Route path="/donations/:id" element={<ProtectedRoute><DonationDetail /></ProtectedRoute>} />

      <Route path="/my-tasks" element={<ProtectedRoute allowedRoles={['volunteer']}><MyTasks /></ProtectedRoute>} />
      <Route path="/campaigns" element={<ProtectedRoute><CampaignList /></ProtectedRoute>} />
      <Route path="/map" element={<ProtectedRoute><MapView /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

      <Route path="/admin/users" element={
        <ProtectedRoute allowedRoles={['admin']}><AdminUsers title="Users" /></ProtectedRoute>
      } />
      <Route path="/admin/volunteers" element={
        <ProtectedRoute allowedRoles={['admin']}><AdminUsers roleFilter="volunteer" title="Volunteers" /></ProtectedRoute>
      } />
      <Route path="/admin/organizations" element={
        <ProtectedRoute allowedRoles={['admin']}><AdminUsers roleFilter="ngo_manager" title="Organizations" /></ProtectedRoute>
      } />
    </Routes>
  )
}

export default App
