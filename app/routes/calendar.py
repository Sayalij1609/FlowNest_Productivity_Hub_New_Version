from flask import (
    Blueprint,
    render_template,
    request
)
from flask_login import (
    login_required,
    current_user
)
from datetime import (
    datetime,
    date
)
import calendar as cal_module
from app.models import (
    Task,
    Habit,
    HabitLog
)

calendar_bp = Blueprint(
    "calendar",
    __name__,
    url_prefix="/calendar"
)

# Calendar Route
@calendar_bp.route("/")
@login_required
def calendar_view():

    today = date.today()

    year = request.args.get(
        "year",
        default=today.year,
        type=int
    )

    month = request.args.get(
        "month",
        default=today.month,
        type=int
    )

    cal = cal_module.monthcalendar(
        year,
        month
    )

    month_name = cal_module.month_name[month]

    tasks = Task.query.filter_by(
        user_id=current_user.id
    ).all()

    task_dates = {
        task.deadline.day
        for task in tasks
        if task.deadline
        and task.deadline.month == month
        and task.deadline.year == year
    }

    logs = (
        HabitLog.query
        .join(Habit)
        .filter(
            Habit.user_id == current_user.id,
            HabitLog.completed == True
        )
        .all()
    )

    habit_dates = {
        log.completed_date.day
        for log in logs
        if log.completed_date.month == month
        and log.completed_date.year == year
    }

    return render_template(
        "calender/calender.html",
        calendar=cal,
        year=year,
        month=month,
        month_name=month_name,
        task_dates=task_dates,
        habit_dates=habit_dates,
        current_day=today.day,
        current_month=today.month,
        current_year=today.year
    )


# Day Details
@calendar_bp.route("/day/<int:year>/<int:month>/<int:day>")
@login_required
def day_details(year, month, day):

    selected_date = date(
        year,
        month,
        day
    )

    today = date.today()

    tasks = Task.query.filter_by(
        user_id=current_user.id
    ).filter(
        Task.deadline == selected_date
    ).all()

    habit_logs = (
        HabitLog.query
        .join(Habit)
        .filter(
            Habit.user_id == current_user.id,
            HabitLog.completed == True,
            HabitLog.completed_date == selected_date
        )
        .all()
    )

    return render_template(
        "calender/day_details.html",
        selected_date=selected_date,
        tasks=tasks,
        habit_logs=habit_logs,
        today=today,
        year=year,
        month=month
    )
