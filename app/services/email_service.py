from flask_mail import Message

from app.extensions import mail


def send_reminder_email(user, task):

    msg = Message(

        subject=f"Reminder: {task.title}",

        recipients=[user.email]

    )

    msg.body = f"""
Hello {user.username},

This is a reminder for your task.

Task:
{task.title}

Description:
{task.description}

Deadline:
{task.deadline.strftime("%d %B %Y")}

Priority:
{task.priority}

Reminder Time:
{task.reminder.strftime("%I:%M %p")}

Regards,
FlowNest
"""

    mail.send(msg)