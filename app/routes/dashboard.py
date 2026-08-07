from flask import Blueprint, render_template
from flask_login import login_required, current_user
from datetime import datetime, date, timedelta
from sqlalchemy import func
from app.extensions import db
from app.models import Task, Category

dashboard = Blueprint(
    "dashboard",
    __name__,
    url_prefix="/dashboard"
)


@dashboard.route("/")
@login_required
def home():

    today = date.today()
    now = datetime.utcnow()
    week_start = today - timedelta(days=today.weekday())  # Monday

    # Base query: all user's non-archived tasks
    user_tasks = Task.query.filter_by(user_id=current_user.id)

    # --- Stat Cards ---
    # Today's Tasks (due today)
    todays_tasks = user_tasks.filter(
        Task.deadline == today,
        Task.status != "Archived"
    ).all()

    # Pending Tasks
    pending_count = user_tasks.filter(
        Task.status == "Pending"
    ).count()

    # Completed Today
    completed_today = user_tasks.filter(
        Task.status == "Completed",
        func.date(Task.updated_at) == today
    ).count()

    # Total tasks (non-archived)
    total_tasks = user_tasks.filter(
        Task.status != "Archived"
    ).count()

    # Categories count
    categories_count = Category.query.filter_by(
        user_id=current_user.id
    ).count()

    # Overdue tasks
    overdue_count = user_tasks.filter(
        Task.deadline < today,
        Task.status == "Pending"
    ).count()

    # --- Weekly Productivity ---
    completed_this_week = user_tasks.filter(
        Task.status == "Completed",
        func.date(Task.updated_at) >= week_start
    ).count()

    created_this_week = user_tasks.filter(
        func.date(Task.created_at) >= week_start
    ).count()

    # --- Current Streak (consecutive days with at least 1 completed task) ---
    streak = 0
    check_date = today
    for _ in range(365):  # max 1 year lookback
        day_completed = user_tasks.filter(
            Task.status == "Completed",
            func.date(Task.updated_at) == check_date
        ).count()
        if day_completed > 0:
            streak += 1
            check_date -= timedelta(days=1)
        else:
            break

    # --- Upcoming Deadlines (next 7 days, excluding today) ---
    upcoming_deadlines = user_tasks.filter(
        Task.deadline > today,
        Task.deadline <= today + timedelta(days=7),
        Task.status == "Pending"
    ).order_by(Task.deadline.asc()).limit(5).all()

    # --- High Priority Pending ---
    high_priority_pending = user_tasks.filter(
        Task.priority == "High",
        Task.status == "Pending"
    ).count()

    return render_template(
        "dashboard/dashboard.html",
        todays_tasks=todays_tasks,
        pending_count=pending_count,
        completed_today=completed_today,
        total_tasks=total_tasks,
        categories_count=categories_count,
        overdue_count=overdue_count,
        completed_this_week=completed_this_week,
        created_this_week=created_this_week,
        streak=streak,
        upcoming_deadlines=upcoming_deadlines,
        high_priority_pending=high_priority_pending,
        today=today
    )