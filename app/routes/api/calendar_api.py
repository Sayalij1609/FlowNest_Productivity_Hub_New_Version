from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import date
import calendar as cal_module
from app.models import Task, Habit, HabitLog

calendar_api = Blueprint("calendar_api", __name__, url_prefix="/calendar")


@calendar_api.route("", methods=["GET"])
@jwt_required()
def calendar_view():
    user_id = int(get_jwt_identity())
    today = date.today()

    year = request.args.get("year", default=today.year, type=int)
    month = request.args.get("month", default=today.month, type=int)

    cal = cal_module.monthcalendar(year, month)
    month_name = cal_module.month_name[month]

    # Task dates
    tasks = Task.query.filter_by(user_id=user_id).all()
    task_dates = [
        task.deadline.day
        for task in tasks
        if task.deadline
        and task.deadline.month == month
        and task.deadline.year == year
    ]

    # Habit dates
    logs = (
        HabitLog.query
        .join(Habit)
        .filter(
            Habit.user_id == user_id,
            HabitLog.completed == True
        )
        .all()
    )
    habit_dates = [
        log.completed_date.day
        for log in logs
        if log.completed_date.month == month
        and log.completed_date.year == year
    ]

    return jsonify({
        "calendar": cal,
        "year": year,
        "month": month,
        "month_name": month_name,
        "task_dates": list(set(task_dates)),
        "habit_dates": list(set(habit_dates)),
        "current_day": today.day,
        "current_month": today.month,
        "current_year": today.year
    }), 200


@calendar_api.route("/day/<int:year>/<int:month>/<int:day>", methods=["GET"])
@jwt_required()
def day_details(year, month, day):
    user_id = int(get_jwt_identity())
    selected_date = date(year, month, day)
    today = date.today()

    tasks = Task.query.filter_by(
        user_id=user_id
    ).filter(Task.deadline == selected_date).all()

    habit_logs = (
        HabitLog.query
        .join(Habit)
        .filter(
            Habit.user_id == user_id,
            HabitLog.completed == True,
            HabitLog.completed_date == selected_date
        )
        .all()
    )

    return jsonify({
        "selected_date": selected_date.isoformat(),
        "is_today": selected_date == today,
        "tasks": [
            {
                "id": t.id,
                "title": t.title,
                "priority": t.priority,
                "status": t.status,
                "description": t.description
            }
            for t in tasks
        ],
        "habit_logs": [
            {
                "id": log.id,
                "habit_name": log.habit.habit_name,
                "completed": log.completed
            }
            for log in habit_logs
        ]
    }), 200
