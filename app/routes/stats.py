from flask import Blueprint, render_template
from flask_login import login_required, current_user
from sqlalchemy import func
from datetime import datetime, date, timedelta
from app.models import Task, Habit, HabitLog, Category
from app.extensions import db
import calendar

stats = Blueprint(
    "stats",
    __name__,
    url_prefix="/statistics"
)

@stats.route("/")
@login_required
def statistics():

    # ------------------------
    # Task Statistics
    # ------------------------

    total_tasks = Task.query.filter_by(
        user_id=current_user.id
    ).count()

    completed_tasks = Task.query.filter_by(
        user_id=current_user.id,
        status="Completed"
    ).count()

    pending_tasks = Task.query.filter_by(
        user_id=current_user.id,
        status="Pending"
    ).count()

    archived_tasks = Task.query.filter_by(
        user_id=current_user.id,
        status="Archived"
    ).count()

    # ------------------------
    # Habit Statistics
    # ------------------------

    total_habits = Habit.query.filter_by(
        user_id=current_user.id
    ).count()

    current_streak = db.session.query(
        func.sum(Habit.current_streak)
    ).filter(
        Habit.user_id == current_user.id
    ).scalar() or 0

    # ------------------------
    # Today's Completed Habits
    # ------------------------

    today = date.today()

    completed_today = HabitLog.query\
        .join(Habit)\
        .filter(
            Habit.user_id == current_user.id,
            HabitLog.completed == True,
            HabitLog.completed_date == today
        ).count()

    # -----------------------------
    # Weekly Productivity
    # -----------------------------

    week_labels = []
    week_data = []

    for i in range(6, -1, -1):

        current_day = today - timedelta(days=i)

        week_labels.append(
            current_day.strftime("%a")
        )

        completed_count = Task.query.filter(
            Task.user_id == current_user.id,
            Task.status == "Completed",
            func.date(Task.updated_at) == current_day
        ).count()

        week_data.append(completed_count)

    # -----------------------------
    # Monthly Productivity
    # -----------------------------

    current_year = today.year

    month_labels = []
    month_data = []

    for month in range(1, 13):

        month_labels.append(
            calendar.month_abbr[month]
        )

        count = Task.query.filter(
            Task.user_id == current_user.id,
            Task.status == "Completed",
            func.extract(
                "year",
                Task.updated_at
            ) == current_year,
            func.extract(
                "month",
                Task.updated_at
            ) == month
        ).count()

        month_data.append(count)

    # -----------------------------
    # Category Distribution
    # -----------------------------

    category_result = (
        db.session.query(
            Category.name,
            func.count(Task.id)
        )
        .join(Task)
        .filter(
            Category.user_id == current_user.id
        )
        .group_by(Category.id)
        .all()
    )

    category_labels = [
        row[0]
        for row in category_result
    ]

    category_values = [
        row[1]
        for row in category_result
    ]

    # -----------------------------
    # Habit Completion Statistics
    # -----------------------------

    habit_labels = []
    habit_rates = []

    habits = Habit.query.filter_by(
        user_id=current_user.id
    ).all()

    for habit in habits:

        total_logs = HabitLog.query.filter_by(
            habit_id=habit.id
        ).count()

        completed_logs = HabitLog.query.filter_by(
            habit_id=habit.id,
            completed=True
        ).count()

        if total_logs > 0:
            completion_rate = round(
                (completed_logs / total_logs) * 100,
                2
            )
        else:
            completion_rate = 0

        habit_labels.append(
            habit.habit_name
        )

        habit_rates.append(
            completion_rate
        )

    return render_template(
        "statistics/statistics.html",

        total_tasks=total_tasks,
        completed_tasks=completed_tasks,
        pending_tasks=pending_tasks,
        archived_tasks=archived_tasks,
        total_habits=total_habits,
        current_streak=current_streak,
        completed_today=completed_today,
        week_labels=week_labels,
        week_data=week_data,
        month_labels=month_labels,
        month_data=month_data,
        category_labels=category_labels,
        category_values=category_values,
        habit_labels=habit_labels,
        habit_rates=habit_rates,
    )