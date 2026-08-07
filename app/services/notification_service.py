from app.extensions import db

from app.models import Notification


def create_notification(

    user,

    message

):

    notification = Notification(

        user_id=user.id,

        message=message

    )

    db.session.add(notification)

    db.session.commit()