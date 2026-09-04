# Food Donation and Distribution System — Backend

Django + Django REST Framework backend.

## Local setup

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env       # then edit .env if needed (SQLite works out of the box locally)
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Backend runs at `http://127.0.0.1:8000/`. Admin panel at `/admin/`. Swagger API docs at `/api/docs/`.

## Key endpoints

- `POST /api/auth/register/` — register (fields: username, email, password, first_name, last_name, phone_number, role, organization_name)
- `POST /api/auth/login/` — returns `access` and `refresh` JWT tokens
- `POST /api/auth/token/refresh/` — refresh the access token
- `GET/PATCH /api/auth/me/` — view/update your own profile
- `GET/POST /api/donations/` — list (filter/search/paginate) or create a donation
- `GET /api/donations/{id}/nearby_volunteers/` — nearby available volunteers (NGO manager/admin only)
- `POST /api/tasks/assign/` — assign a volunteer to a donation (NGO manager/admin only)
- `GET /api/tasks/my_tasks/` — a volunteer's own assigned tasks
- `POST /api/tasks/{id}/mark_picked_up/`, `POST /api/tasks/{id}/mark_delivered/`
- `GET/POST /api/tasks/feedback/` — feedback on completed tasks
- `GET/POST /api/campaigns/` — list/create campaigns (create is NGO manager/admin only)
- `GET /api/notifications/`, `POST /api/notifications/{id}/mark_read/`, `POST /api/notifications/mark_all_read/`

## Deploying to Render

1. Push this repo to GitHub
2. New Web Service on Render, root directory `backend`
3. Build command: `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate`
4. Start command: `gunicorn config.wsgi:application`
5. Add a Render PostgreSQL instance and set `DATABASE_URL` in the environment
6. Set `SECRET_KEY`, `DEBUG=False`, `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS` (your Vercel frontend URL), and Cloudinary credentials as environment variables

## Notes / simplifications

- A single `Profile` model holds role-specific fields (address, lat/lng, availability, organization name) rather than three separate profile models, to keep things simpler to maintain.
- Image uploads use Cloudinary when credentials are set; otherwise they fall back to local disk storage (fine for local dev, not for Render's ephemeral filesystem in production).
- Out of scope by design: payment gateway, social media integration, emergency response module, real-time WebSocket tracking, helpline/ticketing, multi-language UI, automated tests/CI/Docker — see the project's build-prompt document for why.
