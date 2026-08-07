<div align="center">

# 🪺 FlowNest — Your Productivity Hub

**A beautiful, full-stack productivity web application built with Flask.**

Manage tasks, capture notes, build habits, track your calendar, and stay productive — all in one elegant workspace.

[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-3.0-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com)
[![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://sqlite.org)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

</div>

---

## ✨ Features

### 📋 Task Management
- Create, edit, delete, and archive tasks
- Set **priority levels** (Low, Medium, High, Urgent)
- Assign **categories** with color coding
- Add **deadlines** and **reminders**
- Attach **files** to tasks (images, PDFs, docs)
- Filter tasks by status, priority, category, and search

### 📝 Smart Notes
- Create color-coded notes with rich content
- **Pin** important notes to the top
- Full-text **search** across all notes
- Masonry grid layout for visual organization

### 🔥 Habit Tracker
- Create daily habits with customizable frequency
- **Streak tracking** — current & longest streaks
- Daily check-in system with completion logging
- **Completion rate** analytics per habit
- Visual progress statistics

### 📅 Calendar View
- Monthly calendar with **task & habit indicators**
- Click any day to see detailed task/habit breakdown
- Visual dots showing busy days at a glance

### 📊 Statistics & Insights
- **Task status pie chart** (Completed / Pending / Archived)
- **Weekly & Monthly productivity** trend charts
- **Category distribution** doughnut chart
- **Habit completion rate** horizontal bar chart
- Powered by Chart.js with theme-aware styling

### 🔔 Notifications & Email Reminders
- In-app notification system with read/unread states
- **Automatic email reminders** via Gmail SMTP
- Background scheduler checks every 60 seconds
- Unread badge counter in navbar

### 👤 User Profile
- Profile picture upload with image resizing
- Editable bio and personal details
- Secure password change
- Test email functionality
- Member-since date display

### 🎨 Design & UX
- **Glassmorphism** design system
- **Dark / Light** theme toggle with persistence
- Fully **responsive** — works on desktop, tablet, and mobile
- Premium typography with **Google Fonts (Inter)**
- Smooth CSS animations and micro-interactions
- Enterprise-grade glassmorphic sidebar navigation

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Python 3.12, Flask 3.0 |
| **Database** | SQLite + SQLAlchemy ORM |
| **Auth** | Flask-Login (session-based) |
| **Forms** | Flask-WTF + WTForms |
| **Email** | Flask-Mail (Gmail SMTP) |
| **Scheduler** | APScheduler (background jobs) |
| **Migrations** | Flask-Migrate (Alembic) |
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Charts** | Chart.js 4.x |
| **Images** | Pillow (resize/optimize) |
| **Deployment** | Gunicorn + Render/Heroku ready |

---

## 📁 Project Structure

```
FlowNest_Your Productivity Hub/
├── app/
│   ├── __init__.py              # App factory (create_app)
│   ├── extensions.py            # Flask extensions (db, login, mail)
│   ├── models.py                # SQLAlchemy models (User, Task, Note, etc.)
│   ├── forms.py                 # WTForms form classes
│   ├── utils.py                 # Helpers (streaks, stats, image upload)
│   ├── routes/
│   │   ├── main.py              # Landing page
│   │   ├── auth.py              # Login, Register, Logout
│   │   ├── dashboard.py         # Dashboard with overview stats
│   │   ├── tasks.py             # CRUD for tasks + file attachments
│   │   ├── categories.py        # Task category management
│   │   ├── habits.py            # Habit CRUD + daily check-in
│   │   ├── notes.py             # Notes CRUD + pin/search
│   │   ├── calendar.py          # Monthly calendar + day details
│   │   ├── stats.py             # Statistics & chart data
│   │   ├── profile.py           # Profile, password, test email
│   │   └── notifications.py     # Notification list + mark read
│   ├── services/
│   │   ├── email_service.py     # Send reminder emails via SMTP
│   │   ├── notification_service.py  # Create in-app notifications
│   │   ├── reminder_service.py  # Check & send due reminders
│   │   └── scheduler.py         # APScheduler background jobs
│   ├── static/
│   │   ├── style/style.css      # Full design system (~4000 lines)
│   │   ├── js/script.js         # Theme toggle, alerts, nav
│   │   ├── js/statistics.js     # Chart.js chart initialization
│   │   └── uploads/             # User-uploaded files & profile pics
│   └── templates/
│       ├── base.html             # Base layout (navbar, sidebar, scripts)
│       ├── home.html             # Landing page
│       ├── navbar.html           # Top navigation bar
│       ├── sidebar.html          # Side navigation
│       ├── auth/                 # Login & Register pages
│       ├── dashboard/            # Dashboard overview
│       ├── tasks/                # Task list, create, edit, view
│       ├── categories/           # Category management
│       ├── habits/               # Habit list, detail, check-in
│       ├── notes/                # Notes grid & create/edit
│       ├── calender/             # Calendar & day details
│       ├── statistics/           # Charts & analytics
│       ├── profile/              # Profile, edit, change password
│       └── notifications/        # Notification list
├── migrations/                   # Alembic migration files
├── config.py                     # App configuration
├── run.py                        # Entry point
├── requirements.txt              # Python dependencies
├── Procfile                      # Deployment process file
├── runtime.txt                   # Python version for deployment
└── .env                          # Environment variables (not in git)
```

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.10+** installed
- **Git** installed
- A **Gmail account** with [App Password](https://myaccount.google.com/apppasswords) (for email reminders)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/FlowNest.git
cd FlowNest
```

### 2. Create Virtual Environment

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS / Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Create a `.env` file in the project root:

```env
SECRET_KEY=your-super-secret-key-here
DATABASE_URL=sqlite:///database.db
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-16-char-app-password
```

> **📧 Gmail Setup:** You need a [Google App Password](https://myaccount.google.com/apppasswords) (requires 2-Step Verification enabled). Regular Gmail passwords won't work.

### 5. Initialize the Database

```bash
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

### 6. Run the Application

```bash
python run.py
```

Open your browser and go to **http://127.0.0.1:5000** 🎉

---

## 📧 Email Reminder Setup

FlowNest sends **automatic email reminders** for tasks with upcoming deadlines.

### How it works:
1. The **APScheduler** runs a background job every 60 seconds
2. It checks for tasks where `reminder <= now` and `reminder_sent == False`
3. Sends an email via Gmail SMTP to the task owner
4. Marks the reminder as sent

### Gmail Configuration:
1. Enable **2-Step Verification** on your Google account
2. Generate an **App Password** at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Add it to your `.env` file (no spaces):
   ```
   MAIL_USERNAME=your-email@gmail.com
   MAIL_PASSWORD=abcdefghijklmnop
   ```

---

## 🗃️ Database Models

| Model | Description |
|-------|-----------|
| `User` | Authentication, profile, theme preference |
| `Task` | Tasks with priority, category, deadline, reminder, file attachment |
| `Category` | User-defined task categories with colors |
| `Habit` | Daily habits with frequency and streak tracking |
| `HabitLog` | Daily completion log for each habit |
| `Note` | Color-coded notes with pin and timestamps |
| `Notification` | In-app notifications with read/unread status |

---

## 🌐 Deployment

FlowNest is deployment-ready with **Gunicorn** and a **Procfile**.

### Deploy to Render

1. Push your code to GitHub
2. Create a new **Web Service** on [Render](https://render.com)
3. Connect your GitHub repository
4. Set environment variables:
   - `SECRET_KEY`
   - `DATABASE_URL` (use PostgreSQL for production)
   - `MAIL_USERNAME`
   - `MAIL_PASSWORD`
5. Render will auto-detect the `Procfile` and deploy

### Deploy to Heroku

```bash
heroku create flownest-app
heroku config:set SECRET_KEY=your-secret-key
heroku config:set MAIL_USERNAME=your-email@gmail.com
heroku config:set MAIL_PASSWORD=your-app-password
git push heroku main
heroku run flask db upgrade
```

---

## 🎨 Theme System

FlowNest supports **Dark** and **Light** themes with instant switching:

- Toggle via the 🌙/☀️ button in the navbar
- Theme preference is saved to `localStorage`
- Flash-of-unstyled-content (FOUC) prevention with inline script
- All components use CSS custom properties for seamless theming

---

## 📸 Screenshots

| Dark Mode | Light Mode |
|-----------|------------|
| Landing page with glassmorphic hero | Clean light variant |
| Dashboard with stats cards | Bright, readable UI |
| Task management interface | High-contrast design |

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. **Fork** the repository
2. Create a **feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. Open a **Pull Request**

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ using Flask & Glassmorphism**

⭐ Star this repo if you found it helpful!

</div>
