import { Link } from 'react-router-dom'
import { CheckCircle2, Clock, HandHeart, Leaf } from 'lucide-react'
import PublicNav from '../components/PublicNav'

export default function Landing() {
  return (
    <div>
      <PublicNav />

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <span className="inline-block bg-brand-100 text-brand-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
            Together we can
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900">
            Good food deserves a <span className="text-brand-600">second chance.</span>
          </h1>
          <p className="mt-4 text-gray-600 text-lg max-w-lg">
            Donate surplus food and help connect it with people who need it. Together we can
            reduce food waste and fight hunger.
          </p>
          <div className="mt-6 flex gap-3">
            <Link to="/register" className="btn-primary">Donate Food</Link>
            <Link to="/register" className="btn-secondary">Become a Volunteer</Link>
          </div>
        </div>
        <div className="relative">
  <div className="rounded-2xl overflow-hidden shadow-card aspect-[4/3]">
    <img
      src="/hero.png"
      alt="Foodish volunteer donating food"
      className="w-full h-full object-cover"
    />
  </div>
  <div className="absolute -bottom-5 left-6 card flex items-center gap-3 py-3 px-4">
    <span className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold">🍱</span>
    <div>
      <p className="font-bold text-gray-900 leading-none">1,250+</p>
      <p className="text-xs text-gray-500">Meals Donated</p>
    </div>
  </div>
</div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-6">
        {[
          { icon: CheckCircle2, title: 'Easy to donate', text: 'Submit food in just a few simple steps.' },
          { icon: Clock, title: 'Real time updates', text: 'Track your donation status from pickup to delivery.' },
          { icon: Leaf, title: 'Make an impact', text: 'Help people in need and reduce food waste.' },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="card">
            <span className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center mb-3">
              <Icon className="w-5 h-5" />
            </span>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">{text}</p>
          </div>
        ))}
      </section>

      {/* Why Foodish / Impact stats */}
      <section id="why-foodish" className="bg-brand-700 text-white">
        <div id="impact" className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            ['1,250+', 'Meals Donated'],
            ['320+', 'Active Volunteers'],
            ['85+', 'Partner Organizations'],
            ['12+', 'Cities Covered'],
          ].map(([num, label]) => (
            <div key={label}>
              <p className="text-3xl font-extrabold">{num}</p>
              <p className="text-brand-100 text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Ready to make a difference?</h2>
        <p className="text-gray-600 mt-2">Join Foodish today as a donor, volunteer, or NGO partner.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/register" className="btn-primary">Get Started</Link>
        </div>
      </section>

      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Foodish — Food Donation and Distribution System
      </footer>
    </div>
  )
}
