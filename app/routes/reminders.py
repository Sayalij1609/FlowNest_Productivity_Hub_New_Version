import os
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

    # Check Brevo config
    brevo_key = os.getenv("BREVO_API_KEY")
    sender_email = os.getenv("BREVO_SENDER_EMAIL", "flownest.in@gmail.com")

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

    # Test Brevo API connection
    brevo_status = "NOT TESTED"
    if brevo_key:
        try:
            import requests as req
            resp = req.get(
                "https://api.brevo.com/v3/account",
                headers={"api-key": brevo_key, "Accept": "application/json"},
                timeout=10
            )
            if resp.status_code == 200:
                account = resp.json()
                brevo_status = f"SUCCESS — Account: {account.get('email', 'unknown')}, Plan: {account.get('plan', [{}])[0].get('type', 'unknown') if account.get('plan') else 'unknown'}"
            else:
                brevo_status = f"FAILED — Status {resp.status_code}: {resp.text[:200]}"
        except Exception as e:
            brevo_status = f"FAILED — {str(e)}"
    else:
        brevo_status = "NOT SET — Add BREVO_API_KEY environment variable"

    result = {
        "server_time_utc": str(now),
        "email_config": {
            "BREVO_API_KEY": ("***" + brevo_key[-4:]) if brevo_key and len(brevo_key) > 4 else ("NOT SET" if not brevo_key else "SET"),
            "BREVO_SENDER_EMAIL": sender_email,
        },
        "brevo_api_test": brevo_status,
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
        "pending_tasks": [
            {"id": t.id, "title": t.title, "reminder_utc": str(t.reminder)}
            for t in pending_tasks
        ]
    }

    return jsonify(result), 200