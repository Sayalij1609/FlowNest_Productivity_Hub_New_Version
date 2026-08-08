from datetime import datetime, timezone

from sqlalchemy import or_

from app.models import Task

from app.extensions import db

from app.services.email_service import send_reminder_email
from app.services.notification_service import create_notification


def check_reminders():
    # Use UTC time since Render servers run in UTC and
    # the frontend now sends reminder times in UTC
    now = datetime.now(timezone.utc).replace(tzinfo=None)

    tasks = Task.query.filter(

        Task.reminder.isnot(None),

        Task.reminder <= now,

        or_(
            Task.reminder_sent == False,
            Task.reminder_sent.is_(None)
        )

    ).all()

    print(f"[Reminder] Checking at {now} UTC — found {len(tasks)} pending reminders")

    for task in tasks:

        try:
            send_reminder_email(
                task.user,
                task
            )
            print(f"[Reminder] Email sent for task: {task.title}")
        except Exception as e:
            print(f"[Reminder] Email failed for task '{task.title}': {e}")

        # Create in-app notification
        try:
            create_notification(
                task.user_id,
                f"Reminder for task: '{task.title}'"
            )
        except Exception as e:
            print(f"[Reminder] Notification creation failed: {e}")

        task.reminder_sent = True

    db.session.commit()