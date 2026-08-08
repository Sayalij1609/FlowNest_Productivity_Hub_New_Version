import os
import requests
from flask import current_app


def send_reminder_email(user, task):
    """
    Send a reminder email using Brevo (Sendinblue) HTTP API.
    Render's free tier blocks SMTP ports (25, 465, 587), so we use
    an HTTP-based email API over port 443 which Render allows.
    """
    deadline_str = task.deadline.strftime("%d %B %Y") if task.deadline else "No deadline"
    reminder_str = task.reminder.strftime("%d %B %Y, %I:%M %p") if task.reminder else "N/A"

    api_key = os.getenv("BREVO_API_KEY")
    sender_email = os.getenv("BREVO_SENDER_EMAIL", "flownest.in@gmail.com")
    sender_name = os.getenv("BREVO_SENDER_NAME", "FlowNest")

    if not api_key:
        print("[Email] BREVO_API_KEY not set — skipping email")
        return

    subject = f"⏰ Reminder: {task.title}"

    html_content = f"""
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a2e; color: #e0e0e0; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🔔 FlowNest Reminder</h1>
        </div>
        <div style="padding: 30px;">
            <p style="font-size: 16px; color: #b0b0b0;">Hello <strong style="color: #667eea;">{user.username}</strong>,</p>
            <p style="font-size: 16px; color: #b0b0b0;">This is a reminder for your task:</p>
            <div style="background: #16213e; border-left: 4px solid #667eea; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h2 style="color: #ffffff; margin: 0 0 10px 0;">{task.title}</h2>
                <p style="color: #b0b0b0; margin: 5px 0;">📝 {task.description or 'No description'}</p>
                <p style="color: #b0b0b0; margin: 5px 0;">📅 Deadline: <strong>{deadline_str}</strong></p>
                <p style="color: #b0b0b0; margin: 5px 0;">⚡ Priority: <strong style="color: {'#ff6b6b' if task.priority == 'High' else '#ffd93d' if task.priority == 'Medium' else '#6bcb77'};">{task.priority}</strong></p>
                <p style="color: #b0b0b0; margin: 5px 0;">⏰ Reminder: <strong>{reminder_str}</strong></p>
            </div>
            <p style="font-size: 14px; color: #888;">Stay productive! 🚀</p>
            <p style="font-size: 14px; color: #888;">— FlowNest Team</p>
        </div>
    </div>
    """

    text_content = f"""Hello {user.username},

This is a reminder for your task on FlowNest.

Task: {task.title}
Description: {task.description or 'No description'}
Deadline: {deadline_str}
Priority: {task.priority}
Reminder Time: {reminder_str}

Stay productive!
— FlowNest Team
"""

    url = "https://api.brevo.com/v3/smtp/email"
    headers = {
        "api-key": api_key,
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
    payload = {
        "sender": {"name": sender_name, "email": sender_email},
        "to": [{"email": user.email, "name": user.username}],
        "subject": subject,
        "htmlContent": html_content,
        "textContent": text_content
    }

    response = requests.post(url, json=payload, headers=headers, timeout=15)

    if response.status_code in (200, 201):
        print(f"[Email] ✅ Sent to {user.email} for task '{task.title}'")
    else:
        print(f"[Email] ❌ Failed ({response.status_code}): {response.text}")
        response.raise_for_status()