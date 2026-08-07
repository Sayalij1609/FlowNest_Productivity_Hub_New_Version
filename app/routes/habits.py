from flask import Blueprint, render_template, redirect, url_for, flash, request, jsonify
from flask_login import login_required, current_user
from app.extensions import db
from app.forms import HabitForm
from app.models import Habit, HabitLog
from datetime import date, timedelta
from app.utils import calculate_streaks, calculate_statistics
from sqlalchemy import func

habits = Blueprint(
    "habits",
    __name__,
    url_prefix="/habits"
)


# List Habits
@habits.route("/")
@login_required
def list_habits():

    today = date.today()

    search = request.args.get("search", "").strip()

    query = Habit.query.filter_by(
        user_id=current_user.id
    )

    if search:
        query = query.filter(
            Habit.habit_name.ilike(f"%{search}%")
        )

    all_habits = query.order_by(
        Habit.created_at.desc()
    ).all()

    for habit in all_habits:
        habit.stats = calculate_statistics(habit)
        habit.completed_today = HabitLog.query.filter_by(
            habit_id=habit.id,
            completed_date=today
        ).first() is not None

        # Weekly progress (Mon-Sun of current week)
        week_start = today - timedelta(days=today.weekday())
        habit.weekly = []
        for i in range(7):
            day = week_start + timedelta(days=i)
            done = HabitLog.query.filter_by(
                habit_id=habit.id,
                completed_date=day,
                completed=True
            ).first() is not None
            habit.weekly.append({
                "day": day.strftime("%a"),
                "date": day,
                "done": done,
                "is_today": day == today,
                "is_future": day > today
            })

        # Calendar heatmap (past 12 weeks = 84 days)
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

        habit.heatmap = []
        for i in range(84):
            day = heatmap_start + timedelta(days=i)
            habit.heatmap.append({
                "date": day,
                "done": day in completed_dates,
                "is_today": day == today
            })

        # Monthly completion data (last 6 months)
        habit.monthly_data = []
        for m in range(5, -1, -1):
            month_date = today.replace(day=1) - timedelta(days=m * 30)
            month_start = month_date.replace(day=1)
            if month_start.month == 12:
                month_end = month_start.replace(year=month_start.year + 1, month=1, day=1) - timedelta(days=1)
            else:
                month_end = month_start.replace(month=month_start.month + 1, day=1) - timedelta(days=1)

            total_days_in_month = (month_end - month_start).days + 1
            completed_in_month = HabitLog.query.filter(
                HabitLog.habit_id == habit.id,
                HabitLog.completed_date >= month_start,
                HabitLog.completed_date <= month_end,
                HabitLog.completed == True
            ).count()

            pct = round((completed_in_month / total_days_in_month) * 100) if total_days_in_month > 0 else 0
            habit.monthly_data.append({
                "label": month_start.strftime("%b"),
                "pct": pct,
                "completed": completed_in_month,
                "total": total_days_in_month
            })

    return render_template(
        "habits/list.html",
        habits=all_habits,
        search=search,
        today=today
    )


# Create Habit
@habits.route("/create", methods=["GET", "POST"])
@login_required
def create_habit():

    form = HabitForm()

    if form.validate_on_submit():

        existing = Habit.query.filter_by(
            habit_name=form.habit_name.data,
            user_id=current_user.id
        ).first()

        if existing:
            flash(
                "Habit already exists.",
                "warning"
            )
            return redirect(
                url_for("habits.create_habit")
            )

        habit = Habit(
            habit_name=form.habit_name.data,
            description=form.description.data,
            user_id=current_user.id
        )

        db.session.add(habit)
        db.session.commit()

        flash(
            "Habit created successfully!",
            "success"
        )

        return redirect(
            url_for("habits.list_habits")
        )

    return render_template(
        "habits/create.html",
        form=form
    )


# Update Habit
@habits.route("/edit/<int:habit_id>", methods=["GET", "POST"])
@login_required
def update_habit(habit_id):

    habit = Habit.query.filter_by(
        id=habit_id,
        user_id=current_user.id
    ).first_or_404()

    form = HabitForm(obj=habit)

    if form.validate_on_submit():
        habit.habit_name = form.habit_name.data
        habit.description = form.description.data
        db.session.commit()

        flash("Habit updated successfully!", "success")
        return redirect(url_for("habits.list_habits"))

    return render_template(
        "habits/update.html",
        form=form,
        habit=habit
    )


# Delete Habit
@habits.route("/delete/<int:habit_id>", methods=["POST"])
@login_required
def delete_habit(habit_id):

    habit = Habit.query.filter_by(
        id=habit_id,
        user_id=current_user.id
    ).first_or_404()

    db.session.delete(habit)
    db.session.commit()

    flash("Habit deleted successfully!", "success")
    return redirect(url_for("habits.list_habits"))


# Complete Habit
@habits.route("/complete/<int:habit_id>")
@login_required
def complete_habit(habit_id):

    habit = Habit.query.filter_by(
        id=habit_id,
        user_id=current_user.id
    ).first_or_404()

    today = date.today()

    existing_log = HabitLog.query.filter_by(
        habit_id=habit.id,
        completed_date=today
    ).first()

    if existing_log:
        flash(
            "Habit already completed today.",
            "warning"
        )
        return redirect(
            url_for("habits.list_habits")
        )

    log = HabitLog(
        habit_id=habit.id,
        completed_date=today,
        completed=True
    )

    db.session.add(log)
    db.session.commit()
    calculate_streaks(habit)

    flash(
        "Habit marked as completed!",
        "success"
    )

    return redirect(
        url_for("habits.list_habits")
    )


# Undo Habit Completion
@habits.route("/undo/<int:habit_id>")
@login_required
def undo_habit(habit_id):

    habit = Habit.query.filter_by(
        id=habit_id,
        user_id=current_user.id
    ).first_or_404()

    today = date.today()

    log = HabitLog.query.filter_by(
        habit_id=habit.id,
        completed_date=today
    ).first()

    if log:
        db.session.delete(log)
        db.session.commit()
        calculate_streaks(habit)

        flash(
            "Today's completion removed.",
            "success"
        )

    return redirect(
        url_for("habits.list_habits")
    )
