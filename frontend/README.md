# Food Donation and Distribution System — Frontend (Foodish)

React (Vite) + Tailwind CSS frontend, styled as "Foodish" — a modern social-impact platform design.

## Local setup

```bash
cd frontend
npm install
cp .env.example .env    # edit VITE_API_URL to point at your backend (default: http://127.0.0.1:8000)
npm run dev
```

Runs at `http://localhost:5173/`.

## Pages

- `/` — public landing page (hero, how it works, impact stats)
- `/login`, `/register` — auth (register redirects straight into the dashboard after auto-login)
- `/dashboard` — stats + a donations-by-food-type bar chart (recharts)
- `/donations` — browse donations (search/filter/pagination), card grid
- `/donations/new` — 3-step donation wizard (Food Details → Pickup Info → Review & Submit)
- `/donations/:id` — donation detail with a visual delivery-status timeline; NGO manager/admin see nearby volunteers and can assign
- `/my-tasks` — a volunteer's assigned pickup/delivery tasks
- `/campaigns` — browse campaigns; NGO manager can create one; donor can link a donation to one
- `/map` — Leaflet map of all donation pickup locations
- `/notifications` — in-app notification feed

Authenticated pages share a sidebar layout (`AppLayout` + `Sidebar`) with role-aware navigation links.

## Design system

Tailwind config (`tailwind.config.js`) defines the brand palette: deep green (`brand-*`) as primary, warm orange (`accent-*`) as secondary. Reusable component classes (`.btn-primary`, `.card`, `.badge-*`, etc.) live in `src/index.css`.

**Deliberately not implemented** (see the project's build-prompt docs for why): live GPS route animation/real-time tracking, referral/points gamification, volunteer earnings, and a full admin user/organization management CRUD. The current map and status timeline show donation state visually but do not animate a live vehicle position.

## Deploying to Vercel

1. Push this repo to GitHub
2. New Project on Vercel, root directory `frontend`
3. Framework preset: Vite (auto-detected). Build command `npm run build`, output directory `dist`
4. Set environment variable `VITE_API_URL` to your deployed Render backend URL (no trailing slash)
5. Deploy, then make sure the backend's `CORS_ALLOWED_ORIGINS` includes this Vercel URL
