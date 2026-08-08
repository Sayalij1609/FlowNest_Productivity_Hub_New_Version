from datetime import datetime, timezone

from flask import Blueprint, request, current_app, jsonify
from sqlalchemy import or_

from app.services.reminder_service import check_reminders
from app.extensions import db
from app.models import Task

reminder_bp = Blueprint(
    "reminder",
    __name__
)

@reminder_bp.route("/check-reminders")
def run_reminders():

    token = request.args.get("token")

    if token != current_app.config["REMINDER_TOKEN"]:
        return "Unauthorized", 401

    check_reminders()

    return "Reminder check completed."


@reminder_bp.route("/debug-reminders")
def debug_reminders():
    """Diagnostic endpoint to debug reminder/email issues on Render."""

    token = request.args.get("token")
    if token != current_app.config["REMINDER_TOKEN"]:
        return "Unauthorized", 401

    now = datetime.now(timezone.utc).replace(tzinfo=None)

    # Check mail config
    mail_user = current_app.config.get("MAIL_USERNAME")
    mail_pass = current_app.config.get("MAIL_PASSWORD")
    mail_server = current_app.config.get("MAIL_SERVER")
    mail_port = current_app.config.get("MAIL_PORT")

    # Get all tasks with reminders
    all_reminder_tasks = Task.query.filter(
        Task.reminder.isnot(None)
    ).all()

    # Get pending (not yet sent) reminders
    pending_tasks = Task.query.filter(
        Task.reminder.isnot(None),
        Task.reminder <= now,
        or_(
            Task.reminder_sent == False,
            Task.reminder_sent.is_(None)
        )
    ).all()

    # Get future reminders
    future_tasks = Task.query.filter(
        Task.reminder.isnot(None),
        Task.reminder > now
    ).all()

    # Test SMTP connection
    smtp_status = "NOT TESTED"
    try:
        import smtplib
        server = smtplib.SMTP(mail_server, mail_port, timeout=10)
        server.starttls()
        if mail_user and mail_pass:
            server.login(mail_user, mail_pass)
            smtp_status = "SUCCESS — SMTP login worked!"
        else:
            smtp_status = "FAILED — MAIL_USERNAME or MAIL_PASSWORD is empty/None"
        server.quit()
    except Exception as e:
        smtp_status = f"FAILED — {str(e)}"

    result = {
        "server_time_utc": str(now),
        "mail_config": {
            "MAIL_SERVER": mail_server,
            "MAIL_PORT": mail_port,
            "MAIL_USERNAME": mail_user if mail_user else "NOT SET",
            "MAIL_PASSWORD": ("***" + mail_pass[-4:]) if mail_pass and len(mail_pass) > 4 else ("SET" if mail_pass else "NOT SET"),
            "MAIL_USE_TLS": current_app.config.get("MAIL_USE_TLS"),
        },
        "smtp_test": smtp_status,
        "all_tasks_with_reminders": [
            {
                "id": t.id,
                "title": t.title,
                "reminder_utc": str(t.reminder),
                "reminder_sent": t.reminder_sent,
                "user_email": t.user.email if t.user else None
            }
            for t in all_reminder_tasks
        ],
        "pending_now": len(pending_tasks),
        "future_reminders": len(future_tasks),
    }

    return jsonify(result), 200