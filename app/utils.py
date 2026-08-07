import os
import secrets
from PIL import Image
from flask import current_app

ALLOWED_EXTENSIONS = {

    "png",

    "jpg",

    "jpeg",

    "pdf",

    "txt",

    "doc",

    "docx"

}

def allowed_file(filename):

    return (

        "." in filename

        and

        filename.rsplit(".", 1)[1].lower()

        in ALLOWED_EXTENSIONS

    )

from datetime import date, timedelta
from app.models import HabitLog
from app.extensions import db


def calculate_streaks(habit):

    logs = HabitLog.query.filter_by(
        habit_id=habit.id,
        completed=True
    ).order_by(
        HabitLog.completed_date.asc()
    ).all()

    if not logs:
        habit.current_streak = 0
        habit.longest_streak = 0
        return

    completed_dates = {
        log.completed_date
        for log in logs
    }

    today = date.today()

    current = 0

    check_day = today

    while check_day in completed_dates:

        current += 1

        check_day -= timedelta(days=1)

    habit.current_streak = current

    longest = 0
    streak = 0

    previous_day = None

    for log in logs:

        if previous_day is None:

            streak = 1

        elif log.completed_date == previous_day + timedelta(days=1):

            streak += 1

        else:

            streak = 1

        longest = max(
            longest,
            streak
        )

        previous_day = log.completed_date

    habit.longest_streak = longest
    db.session.commit()

def calculate_statistics(habit):

    logs = HabitLog.query.filter_by(
        habit_id=habit.id
    ).all()

    total_days = len(logs)

    completed_days = sum(
        1
        for log in logs
        if log.completed
    )

    if total_days > 0:

        completion_rate = round(
            (completed_days / total_days) * 100,
            2
        )

    else:

        completion_rate = 0

    return {

        "total_days": total_days,

        "completed_days": completed_days,

        "completion_rate": completion_rate

    }

def save_profile_picture(file):

    random_name = secrets.token_hex(8)

    _, extension = os.path.splitext(file.filename)

    filename = random_name + extension

    path = os.path.join(

        current_app.root_path,

        "static",

        "uploads",

        "profile",

        filename

    )

    image = Image.open(file)

    image.thumbnail((300,300))

    image.save(path)

    return filename