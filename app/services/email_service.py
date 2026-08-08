from flask_mail import Message

from app.extensions import mail


def send_reminder_email(user, task):
    deadline_str = task.deadline.strftime("%d %B %Y") if task.deadline else "No deadline"
    reminder_str = task.reminder.strftime("%d %B %Y, %I:%M %p") if task.reminder else "N/A"

    msg = Message(
        subject=f"Reminder: {task.title}",
        recipients=[user.email]
    )

    msg.body = f"""
Hello {user.username},

This is a reminder for your task on FlowNest.

Task: {task.title}
Description: {task.description or 'No description'}
Deadline: {deadline_str}
Priority: {task.priority}
Reminder Time: {reminder_str}

Stay productive!
— FlowNest Team
"""

    mail.send(msg)