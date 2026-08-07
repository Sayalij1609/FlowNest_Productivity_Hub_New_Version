from flask import (
    Blueprint,
    render_template,
    redirect,
    url_for
)
from flask_login import (
    login_required,
    current_user
)
from app.models import Notification
from app.extensions import db
from flask import abort

notifications = Blueprint(
    "notifications",
    __name__,
    url_prefix="/notifications"
)

# List Notification
@notifications.route("/")
@login_required
def list_notifications():
    notifications = Notification.query.filter_by(
        user_id=current_user.id
    ).order_by(
        Notification.created_at.desc()
    ).all()

    return render_template(
        "notifications/list.html",
        notifications=notifications
    )

# Mark as read route
@notifications.route("/read/<int:id>")
@login_required
def mark_read(id):

    notification = Notification.query.get_or_404(id)

    if notification.user_id != current_user.id:

        abort(403)

    notification.is_read = True

    db.session.commit()

    return redirect(

        url_for("notifications.list_notifications")

    )