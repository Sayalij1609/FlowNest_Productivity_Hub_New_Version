<div align="center">

# 🪺 FlowNest — Productivity Hub

**A modern, full-stack productivity web application built with React (Vite) and Flask REST API.**

Manage tasks, capture notes, build habits, track your calendar, and gain analytical insights — all in a sleek, glassmorphic workspace.

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-3.0-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-003B57?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Render](https://img.shields.io/badge/Deployed%20on-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com)

</div>

---

## ✨ Features

### 📋 Task Management
- Create, edit, delete, and restore **archived tasks**
- Set **priority levels** (Low, Medium, High)
- Assign custom **color-coded categories**
- Set **deadlines** and automated **email reminders**
- Support for **file attachments** (images, PDFs, documents)
- Filter by status (Pending / Completed), priority, category, and real-time search

### 📝 Smart Notes
- Masonry-style grid layout with custom color themes (Yellow, Blue, Green, Pink, Orange, Purple, Gray)
- **Pin** important notes to the top of your board
- Instant full-text search across titles and content

### 🔥 Habit Tracker
- Track daily habits with automated **streak calculation** (Current & Best Streaks)
- Interactive daily check-in / undo completion system
- **Weekly progress indicators** & GitHub-style **habit completion heatmap**
- Per-habit completion rate metrics

### 📅 Calendar View
- Interactive monthly grid with day-level **task & habit activity indicators**
- Detailed **day view breakdown** (`/calendar/day/YYYY/MM/DD`) showing scheduled tasks and completed habits for any selected date

### 📊 Statistics & Analytics
- **Task completion metrics** and quick stat summaries
- **Weekly Productivity Bar Chart** & **Monthly Trend Line Chart**
- **Category Distribution Doughnut Chart**
- **Habit Completion Rates Horizontal Bar Chart**
- Powered by `Chart.js` with responsive glassmorphic styling

### 🔔 Notifications & Email Reminders
- In-app notification feed with unread indicators and mark-as-read controls
- Background **APScheduler** job running every 60 seconds for due email reminders
- **Brevo (Sendinblue) HTTP API** for reliable email delivery in production (SMTP-free)
- Styled HTML email templates with task details, priority, and deadline information
- External cron endpoint (`/check-reminders`) as a backup trigger for free-tier hosting

### 🔒 Security & Authentication
- Stateless **JWT Token** authentication (`Flask-JWT-Extended`)
- Strict **DNS deliverability email validation** (`check_deliverability=True` via `email-validator`) to verify domain MX records and reject non-existent or fake email domains upon registration
- Secure password hashing with `Werkzeug`

### 🎨 Theme & UI Excellence
- **Glassmorphism Design Tokens** with custom maroon/magenta theme, smooth CSS animations, and micro-interactions
- **Dark / Light mode** toggle with persistent user preference (`localStorage`)
- Fully responsive across desktop, tablet, and mobile displays

---

## 🛠️ Architecture & Tech Stack

FlowNest uses a decoupled **SPA + REST API** architecture:

```
                      +-----------------------------+
                      |     React (Vite) SPA        |
                      |  Axios + JWT Auth + Context |
                      +--------------+--------------+
                                     |
                                REST API (/api)
                                     |
                      +--------------v--------------+
                      |      Flask Backend API      |
                      | SQLAlchemy + APScheduler    |
                      +--------------+--------------+
                                     |
                      +--------------v--------------+
                      |   SQLite / PostgreSQL DB    |
                      +-----------------------------+
```

| Layer | Technology |
|-------|-----------|
| **Frontend Framework** | React 18, Vite 8, React Router DOM 7 |
| **Frontend Styling** | Custom Vanilla CSS (Design Tokens, Glassmorphism) |
| **Charts & Alerts** | Chart.js (`react-chartjs-2`), React Hot Toast |
| **HTTP Client** | Axios (with Request Interceptor for JWT Bearer Tokens) |
| **Backend Framework** | Python 3.12, Flask 3.0 |
| **API Authentication** | Flask-JWT-Extended (Stateless JWT Tokens) |
| **Email & Domain Validation** | `email-validator` with DNS MX deliverability check (`check_deliverability=True`) |
| **Database & ORM** | SQLAlchemy, Flask-Migrate (Alembic) |
| **Supported Databases** | SQLite (Development), PostgreSQL (`psycopg2-binary` for Production) |
| **Background Jobs** | APScheduler (interval-based reminder checks) |
| **Email Service** | Brevo (Sendinblue) HTTP API for production, Flask-Mail for local dev |
| **Deployment** | Render (Gunicorn WSGI server) |

---

## 📁 Project Structure

```
FlowNest/
├── app/                        # Python Flask Backend
│   ├── __init__.py             # Flask App Factory & React Static Serving
│   ├── extensions.py           # DB, JWT, CORS, Mail, Migrate instances
│   ├── models.py               # SQLAlchemy Models (User, Task, Habit, Note, etc.)
│   ├── utils.py                # Business logic helpers (streaks, statistics)
│   ├── routes/
│   │   ├── api/                # REST API Endpoints (/api/*)
│   │   │   ├── auth.py         # Login, Register, GET /auth/me
│   │   │   ├── dashboard.py    # Overview statistics API
│   │   │   ├── tasks.py        # Task CRUD & file upload API
│   │   │   ├── categories.py   # Category CRUD API
│   │   │   ├── habits.py       # Habit CRUD & check-in API
│   │   │   ├── notes.py        # Notes CRUD & pinning API
│   │   │   ├── calendar_api.py # Calendar month & day APIs
│   │   │   ├── stats.py        # Productivity analytics API
│   │   │   ├── profile.py      # Profile & password API
│   │   │   └── notifications.py# Notifications API
│   │   └── reminders.py        # External cron reminder endpoint
│   ├── services/
│   │   ├── email_service.py    # Brevo HTTP API email sender
│   │   ├── reminder_service.py # Reminder checking & dispatch logic
│   │   ├── notification_service.py # In-app notification creator
│   │   └── scheduler.py        # APScheduler background job setup
│   └── static/uploads/         # File attachment uploads directory
├── frontend/                   # React Single Page Application
│   ├── src/
│   │   ├── api/client.js       # Axios client with JWT interceptor
│   │   ├── context/            # AuthContext & ThemeContext
│   │   ├── components/         # Navbar, Sidebar, AppLayout, ProtectedRoute
│   │   ├── pages/              # React Views (Dashboard, Tasks, Habits, Notes, etc.)
│   │   ├── index.css           # Glassmorphism Design System CSS
│   │   ├── App.jsx             # React Router routing setup
│   │   └── main.jsx            # Application entry point
│   ├── package.json
│   └── vite.config.js          # Vite build config & dev proxy (/api -> :5000)
├── instance/                   # SQLite database directory (Development)
├── config.py                   # Environment & Flask app settings
├── run.py                      # Flask backend entry point
├── Procfile                    # Gunicorn start command for Render
├── requirements.txt            # Python dependencies
└── .env                        # Local environment variables (not committed)
```

---

## 🚀 Local Development Setup

### 1. Prerequisites
- **Python 3.10+**
- **Node.js 18+** & **npm**

### 2. Backend Setup (Flask API)

```bash
# Clone the repository
git clone https://github.com/Sayalij1609/FlowNest_Productivity_Hub_New_Version.git
cd FlowNest_Productivity_Hub_New_Version

# Create and activate virtual environment
python -m venv venv

# Windows (PowerShell):
venv\Scripts\activate

# macOS / Linux:
source venv/bin/activate

# Install Python packages
pip install -r requirements.txt
```

### 3. Create `.env` File

Create a `.env` file in the root directory:

```env
SECRET_KEY=dev-secret-key-change-in-prod
JWT_SECRET_KEY=dev-jwt-secret-key-change-in-prod
REMINDER_TOKEN=dev-reminder-token

# Email (optional for local dev — uses Brevo HTTP API in production)
BREVO_API_KEY=your-brevo-api-key
BREVO_SENDER_EMAIL=your-verified-sender@gmail.com
```

### 4. Initialize Database & Start Backend

```bash
# Run database migrations
flask db upgrade

# Start Flask backend server (port 5000)
python run.py
```

### 5. Frontend Setup (React SPA)

In a **second terminal**:

```bash
cd frontend

# Install npm packages
npm install

# Start Vite dev server (port 5173)
npm run dev
```

Open **`http://localhost:5173/app/`** in your browser 🎉

---

## ☁️ Production Deployment on Render

FlowNest is deployed as a **single unified service** on [Render](https://render.com). Flask serves the built React static bundle from `frontend/dist/` for all non-API routes, while handling REST API requests on `/api/*`.

### Step 1: Push to GitHub

Ensure your code is pushed to a GitHub repository with the frontend already built:

```bash
cd frontend && npm run build && cd ..
git add -A && git commit -m "Production build" && git push origin main
```

### Step 2: Create Render Web Service

1. Go to [render.com](https://render.com) and sign up / log in
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:

| Setting | Value |
|---------|-------|
| **Name** | `flownest` (or your preferred name) |
| **Region** | Choose closest to your users |
| **Branch** | `main` |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt && cd frontend && npm install && npm run build` |
| **Start Command** | `gunicorn run:app --workers 1 --preload --timeout 120` |
| **Plan** | Free |

> ⚠️ **Important**: Use `--workers 1` to ensure APScheduler runs exactly once (no duplicate reminder emails).

### Step 3: Create PostgreSQL Database

1. On Render dashboard, click **"New +"** → **"PostgreSQL"**
2. Choose the **Free** plan
3. After creation, copy the **Internal Database URL**

### Step 4: Set Environment Variables

Go to your Web Service → **Environment** → Add these variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `SECRET_KEY` | Flask session secret key | `generate-a-random-64-char-string` |
| `JWT_SECRET_KEY` | JWT signing secret | `generate-another-random-string` |
| `DATABASE_URL` | PostgreSQL connection string (from Step 3) | `postgresql://user:pass@host/dbname` |
| `REMINDER_TOKEN` | Security token for cron reminder endpoint | `your-secret-cron-token` |
| `BREVO_API_KEY` | Brevo (Sendinblue) API key for sending emails | `xkeysib-your-api-key...` |
| `BREVO_SENDER_EMAIL` | Verified sender email in Brevo | `your-app@gmail.com` |

### Step 5: Set Up Email Reminders (Brevo)

Render's free tier **blocks SMTP ports** (25, 465, 587), so FlowNest uses the [Brevo](https://www.brevo.com/) HTTP API for email delivery:

1. **Create a free Brevo account** at [brevo.com](https://www.brevo.com/) (300 emails/day, no credit card)
2. **Generate an API key**: Profile → SMTP & API → API Keys → Generate
3. **Verify your sender email**: Settings → Senders, Domains & Dedicated IPs → Add sender
4. **Authorize Render's IP**: Settings → Security → Authorized IPs → Add your Render server IP
5. Add `BREVO_API_KEY` and `BREVO_SENDER_EMAIL` to Render environment variables

### Step 6: Set Up External Cron (Recommended)

Render's free tier spins down after 15 minutes of inactivity, which kills the APScheduler. Use a free external cron to keep the app alive and trigger reminders:

**Option A: [cron-job.org](https://cron-job.org)** (Recommended)

| Setting | Value |
|---------|-------|
| **URL** | `https://your-app.onrender.com/check-reminders?token=your-secret-cron-token` |
| **Schedule** | Every 5 minutes |
| **Method** | `GET` |

**Option B: [UptimeRobot](https://uptimerobot.com)**

Set up an HTTP(s) monitor pinging the same URL every 5 minutes.

### Step 7: Verify Deployment

After deployment completes:

1. Visit `https://your-app.onrender.com/` — you should see FlowNest
2. Test the debug endpoint: `https://your-app.onrender.com/debug-reminders?token=your-token`
3. Verify `brevo_api_test` shows **SUCCESS**
4. Create a task with a reminder and confirm email delivery

---

## 🗄️ Database Migration (SQLite ➔ PostgreSQL)

FlowNest comes ready with `psycopg2-binary` in `requirements.txt`. The app automatically detects and uses PostgreSQL when `DATABASE_URL` is set.

When migrating to PostgreSQL in production:
1. Provide your PostgreSQL URI in `DATABASE_URL` (starting with `postgresql://`).
2. The app automatically converts `postgres://` to `postgresql://` for compatibility.
3. Run database migrations on deployment:
   ```bash
   flask db upgrade
   ```

---

## 🔧 Timezone Handling

FlowNest handles timezones transparently:

- **Frontend** → Converts all datetime-local inputs (reminders) to **UTC** before sending to the server
- **Server** → Stores and compares all timestamps in **UTC**
- **API Responses** → Returns timestamps with `Z` suffix so browsers auto-convert to the user's local timezone
- This ensures reminders fire at the correct time regardless of the user's timezone or server location

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Login & receive JWT token |
| `GET` | `/api/auth/me` | Get current user profile |
| `GET/POST` | `/api/tasks` | List / Create tasks |
| `GET/PUT/DELETE` | `/api/tasks/<id>` | View / Update / Delete task |
| `PATCH` | `/api/tasks/<id>/status` | Toggle task completion |
| `PATCH` | `/api/tasks/<id>/restore` | Restore archived task |
| `GET/POST` | `/api/categories` | List / Create categories |
| `GET/POST` | `/api/notes` | List / Create notes |
| `PUT/DELETE` | `/api/notes/<id>` | Update / Delete note |
| `PATCH` | `/api/notes/<id>/pin` | Toggle note pin |
| `GET/POST` | `/api/habits` | List / Create habits |
| `POST` | `/api/habits/<id>/check-in` | Daily habit check-in |
| `GET` | `/api/calendar/month/<y>/<m>` | Monthly calendar data |
| `GET` | `/api/calendar/day/<y>/<m>/<d>` | Day detail view |
| `GET` | `/api/stats` | Productivity analytics |
| `GET` | `/api/dashboard` | Dashboard overview |
| `GET` | `/api/notifications` | List notifications |
| `PATCH` | `/api/notifications/<id>/read` | Mark notification read |
| `GET/PUT` | `/api/profile` | View / Update profile |
| `PUT` | `/api/profile/password` | Change password |
| `GET` | `/check-reminders?token=<t>` | Trigger reminder check (cron) |

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

<div align="center">

**Built with ❤️ using React, Flask, and Glassmorphism**

</div>
