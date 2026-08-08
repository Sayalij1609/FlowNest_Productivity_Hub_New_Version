from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models import Habit, HabitLog
from app.utils import calculate_streaks, calculate_statistics
from datetime import date, timedelta

habits_api = Blueprint("habits_api", __name__, url_prefix="/habits")


def serialize_habit(habit, include_details=True):
    today = date.today()
    data = {
        "id": habit.id,
        "habit_name": habit.habit_name,
        "description": habit.description,
        "current_streak": habit.current_streak,
        "longest_streak": habit.longest_streak,
        "created_at": (habit.created_at.isoformat() + "Z") if habit.created_at else None
    }

    if not include_details:
        return data

    # Stats
    stats = calculate_statistics(habit)
    data["stats"] = stats

    # Completed today?
    data["completed_today"] = HabitLog.query.filter_by(
        habit_id=habit.id, completed_date=today
    ).first() is not None

    # Weekly progress
    week_start = today - timedelta(days=today.weekday())
    weekly = []
    for i in range(7):
        day = week_start + timedelta(days=i)
        done = HabitLog.query.filter_by(
            habit_id=habit.id, completed_date=day, completed=True
        ).first() is not None
        weekly.append({
            "day": day.strftime("%a"),
            "date": day.isoformat(),
            "done": done,
            "is_today": day == today,
            "is_future": day > today
        })
    data["weekly"] = weekly

    # Heatmap (past 84 days)
    heatmap_start = today - timedelta(days=83)
    completed_dates = set()
    logs = HabitLog.query.filter(
        HabitLog.habit_id == habit.id,
        HabitLog.completed_date >= heatmap_start,
        HabitLog.completed_date <= today,
        HabitLog.completed == True
    ).all()
    for log in logs:
        completed_dates.add(log.completed_date)

    heatmap = []
    for i in range(84):
        day = heatmap_start + timedelta(days=i)
        heatmap.append({
            "date": day.isoformat(),
            "done": day in completed_dates,
            "is_today": day == today
        })
    data["heatmap"] = heatmap

    # Monthly data (last 6 months)
    monthly_data = []
    for m in range(5, -1, -1):
        month_date = today.replace(day=1) - timedelta(days=m * 30)
        month_start = month_date.replace(day=1)
        if month_start.month == 12:
            month_end = month_start.replace(
                year=month_start.year + 1, month=1, day=1
            ) - timedelta(days=1)
        else:
            month_end = month_start.replace(
                month=month_start.month + 1, day=1
            ) - timedelta(days=1)

        total_days_in_month = (month_end - month_start).days + 1
        completed_in_month = HabitLog.query.filter(
            HabitLog.habit_id == habit.id,
            HabitLog.completed_date >= month_start,
            HabitLog.completed_date <= month_end,
            HabitLog.completed == True
        ).count()

        pct = round(
            (completed_in_month / total_days_in_month) * 100
        ) if total_days_in_month > 0 else 0

        monthly_data.append({
            "label": month_start.strftime("%b"),
            "pct": pct,
            "completed": completed_in_month,
            "total": total_days_in_month
        })
    data["monthly_data"] = monthly_data

    return data


@habits_api.route("", methods=["GET"])
@jwt_required()
def list_habits():
    user_id = int(get_jwt_identity())
    search = request.args.get("search", "").strip()

    query = Habit.query.filter_by(user_id=user_id)
    if search:
        query = query.filter(Habit.habit_name.ilike(f"%{search}%"))

    habits = query.order_by(Habit.created_at.desc()).all()
    return jsonify([serialize_habit(h) for h in habits]), 200


@habits_api.route("", methods=["POST"])
@jwt_required()
def create_habit():
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}

    habit_name = data.get("habit_name", "").strip()
    description = data.get("description", "")

    if not habit_name:
        return jsonify({"error": "Habit name is required"}), 400

    existing = Habit.query.filter_by(
        habit_name=habit_name, user_id=user_id
    ).first()
    if existing:
        return jsonify({"error": "Habit already exists"}), 409

    habit = Habit(
        habit_name=habit_name,
        description=description,
        user_id=user_id
    )
    db.session.add(habit)
    db.session.commit()

    return jsonify(serialize_habit(habit, include_details=False)), 201


@habits_api.route("/<int:habit_id>", methods=["PUT"])
@jwt_required()
def update_habit(habit_id):
    user_id = int(get_jwt_identity())
    habit = Habit.query.filter_by(
        id=habit_id, user_id=user_id
    ).first_or_404()

    data = request.get_json() or {}
    habit.habit_name = data.get("habit_name", habit.habit_name)
    habit.description = data.get("description", habit.description)
    db.session.commit()

    return jsonify(serialize_habit(habit, include_details=False)), 200


@habits_api.route("/<int:habit_id>", methods=["DELETE"])
@jwt_required()
def delete_habit(habit_id):
    user_id = int(get_jwt_identity())
    habit = Habit.query.filter_by(
        id=habit_id, user_id=user_id
    ).first_or_404()

    db.session.delete(habit)
    db.session.commit()

    return jsonify({"message": "Habit deleted successfully"}), 200


@habits_api.route("/<int:habit_id>/complete", methods=["POST"])
@jwt_required()
def complete_habit(habit_id):
    user_id = int(get_jwt_identity())
    habit = Habit.query.filter_by(
        id=habit_id, user_id=user_id
    ).first_or_404()

    today = date.today()
    existing_log = HabitLog.query.filter_by(
        habit_id=habit.id, completed_date=today
    ).first()

    if existing_log:
        return jsonify({"error": "Habit already completed today"}), 409

    log = HabitLog(
        habit_id=habit.id,
        completed_date=today,
        completed=True
    )
    db.session.add(log)
    db.session.commit()
    calculate_streaks(habit)

    return jsonify(serialize_habit(habit)), 200


@habits_api.route("/<int:habit_id>/undo", methods=["POST"])
@jwt_required()
def undo_habit(habit_id):
    user_id = int(get_jwt_identity())
    habit = Habit.query.filter_by(
        id=habit_id, user_id=user_id
    ).first_or_404()

    today = date.today()
    log = HabitLog.query.filter_by(
        habit_id=habit.id, completed_date=today
    ).first()

    if log:
        db.session.delete(log)
        db.session.commit()
        calculate_streaks(habit)

    return jsonify(serialize_habit(habit)), 200
