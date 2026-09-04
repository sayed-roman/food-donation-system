import Sidebar from './Sidebar'

export default function AppLayout({ children }) {
  return (
    <div className="flex bg-brand-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 max-w-6xl">{children}</main>
    </div>
  )
}
