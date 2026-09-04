import { Link } from 'react-router-dom'
import { Leaf } from 'lucide-react'

export default function PublicNav() {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" />
          </span>
          <span className="text-lg font-bold text-gray-900">Foodish</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <a href="#how-it-works" className="hover:text-brand-700">How it works</a>
          <a href="#why-foodish" className="hover:text-brand-700">Why Foodish</a>
          <a href="#impact" className="hover:text-brand-700">Impact</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-brand-700 px-3 py-2">Log in</Link>
          <Link to="/register" className="btn-primary text-sm px-4 py-2">Sign up</Link>
        </div>
      </div>
    </header>
  )
}
