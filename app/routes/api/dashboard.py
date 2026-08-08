from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, date, timedelta
from sqlalchemy import func
from app.extensions import db
from app.models import Task, Category

dashboard_api = Blueprint("dashboard_api", __name__, url_prefix="/dashboard")


@dashboard_api.route("", methods=["GET"])
@jwt_required()
def get_dashboard():
    user_id = int(get_jwt_identity())
    today = date.today()
    now = datetime.utcnow()
    week_start = today - timedelta(days=today.weekday())

    user_tasks = Task.query.filter_by(user_id=user_id)

    # Today's Tasks
    todays_tasks = user_tasks.filter(
        Task.deadline == today,
        Task.status != "Archived"
    ).all()

    # Pending
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
        user_id=user_id
    ).count()

    # Overdue
    overdue_count = user_tasks.filter(
        Task.deadline < today,
        Task.status == "Pending"
    ).count()

    # Weekly Productivity
    completed_this_week = user_tasks.filter(
        Task.status == "Completed",
        func.date(Task.updated_at) >= week_start
    ).count()

    created_this_week = user_tasks.filter(
        func.date(Task.created_at) >= week_start
    ).count()

    # Streak
    streak = 0
    check_date = today
    for _ in range(365):
        day_completed = user_tasks.filter(
            Task.status == "Completed",
            func.date(Task.updated_at) == check_date
        ).count()
        if day_completed > 0:
            streak += 1
            check_date -= timedelta(days=1)
        else:
            break

    # Upcoming Deadlines
    upcoming_deadlines = user_tasks.filter(
        Task.deadline > today,
        Task.deadline <= today + timedelta(days=7),
        Task.status == "Pending"
    ).order_by(Task.deadline.asc()).limit(5).all()

    # High Priority Pending
    high_priority_pending = user_tasks.filter(
        Task.priority == "High",
        Task.status == "Pending"
    ).count()

    return jsonify({
        "todays_tasks": [
            {
                "id": t.id,
                "title": t.title,
                "priority": t.priority,
                "status": t.status,
                "deadline": t.deadline.isoformat() if t.deadline else None
            }
            for t in todays_tasks
        ],
        "pending_count": pending_count,
        "completed_today": completed_today,
        "total_tasks": total_tasks,
        "categories_count": categories_count,
        "overdue_count": overdue_count,
        "completed_this_week": completed_this_week,
        "created_this_week": created_this_week,
        "streak": streak,
        "upcoming_deadlines": [
            {
                "id": t.id,
                "title": t.title,
                "priority": t.priority,
                "deadline": t.deadline.isoformat() if t.deadline else None
            }
            for t in upcoming_deadlines
        ],
        "high_priority_pending": high_priority_pending
    }), 200
