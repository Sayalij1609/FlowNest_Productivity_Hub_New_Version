from app.extensions import db

from app.models import Notification


def create_notification(
    user_or_id,
    message
):
    user_id = user_or_id.id if hasattr(user_or_id, "id") else int(user_or_id)

    notification = Notification(
        user_id=user_id,
        message=message
    )

    db.session.add(notification)
    db.session.commit()