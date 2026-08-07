from flask import Blueprint, request, current_app

from app.services.reminder_service import check_reminders

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