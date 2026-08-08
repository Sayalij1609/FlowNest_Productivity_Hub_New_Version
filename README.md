<div align="center">

# 🪺 FlowNest — Productivity Hub

**A modern, full-stack productivity web application built with React (Vite) and Flask REST API.**

Manage tasks, capture notes, build habits, track your calendar, and gain analytical insights — all in a sleek, glassmorphic workspace.

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-3.0-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io)
[![SQLite](https://img.shields.io/badge/Database-SQLite%20%2F%20PostgreSQL-003B57?style=for-the-badge&logo=postgresql&logoColor=white)](https://sqlite.org)

</div>

---

## ✨ Features

### 📋 Task Management
- Create, edit, delete, and restore **archived tasks**
- Set **priority levels** (Low, Medium, High)
- Assign custom **color-coded categories**
- Set **deadlines** and automated **reminders**
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
- SMTP integration via Flask-Mail

### 🎨 Theme & UI Excellence
- **Glassmorphism Design Tokens** with smooth CSS animations and micro-interactions
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
| **Database & ORM** | SQLAlchemy, Flask-Migrate (Alembic) |
| **Supported Databases** | SQLite (Development), PostgreSQL (`psycopg2-binary` for Production) |
| **Background Jobs** | APScheduler + Flask-Mail |

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
│   ├── services/               # Notification & email scheduler services
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
├── requirements.txt            # Python dependencies
└── .env                        # Local environment variables
```

---

## 🚀 Local Development Setup

### 1. Prerequisites
- **Python 3.10+**
- **Node.js 18+** & **npm**

### 2. Backend Setup (Flask API)

```bash
# Clone the repository
git clone https://github.com/your-username/FlowNest.git
cd FlowNest

# Create and activate virtual environment
python -m venv venv

# Windows (PowerShell):
venv\Scripts\activate

# macOS / Linux:
source venv/bin/activate

# Install Python packages
pip install -r requirements.txt

# Create .env file in root directory
SECRET_KEY=dev-secret-key-change-in-prod
JWT_SECRET_KEY=dev-jwt-secret-key-change-in-prod
REMINDER_TOKEN=dev-reminder-token

# Run database migrations
flask db upgrade

# Start Flask backend server (port 5000)
python run.py
```

### 3. Frontend Setup (React SPA)

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

## ☁️ Production Deployment Guide

FlowNest is designed to be served as a single unified service on free hosting platforms (e.g. **Render**, **Railway**, **Fly.io**, **Koyeb**).

### Single-Service Deployment Strategy
Flask automatically serves the built React static bundle from `frontend/dist` for all non-API routes (`/app/*` and `/`).

### 1. Build Frontend Bundle
```bash
cd frontend
npm run build
```
This generates the optimized production build in `frontend/dist/`.

### 2. Environment Variables for Hosting Platform
Set these environment variables in your hosting provider's dashboard:

| Variable | Description | Example |
|----------|-------------|---------|
| `SECRET_KEY` | Flask session secret key | `random-secure-string` |
| `JWT_SECRET_KEY` | JWT signing secret | `random-jwt-secure-string` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host/dbname` |
| `REMINDER_TOKEN` | Security token for cron triggers | `your-cron-secret-token` |
| `MAIL_USERNAME` | *(Optional)* Gmail SMTP address | `your-app@gmail.com` |
| `MAIL_PASSWORD` | *(Optional)* Google App Password | `16-character-app-password` |

### 3. Start Command for Server
```bash
gunicorn run:app
```

---

## 🗄️ Database Migration (SQLite ➔ PostgreSQL)

FlowNest comes ready with `psycopg2-binary` in `requirements.txt`.

When migrating to PostgreSQL in production:
1. Provide your PostgreSQL URI in `DATABASE_URL` (starting with `postgresql://`).
2. Run database migrations on deployment:
   ```bash
   flask db upgrade
   ```

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

<div align="center">

**Built with ❤️ using React, Flask, and Glassmorphism**

</div>
