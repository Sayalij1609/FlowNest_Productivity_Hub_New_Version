from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models import Notification

notifications_api = Blueprint(
    "notifications_api", __name__, url_prefix="/notifications"
)


@notifications_api.route("", methods=["GET"])
@jwt_required()
def list_notifications():
    user_id = int(get_jwt_identity())

    notifications = Notification.query.filter_by(
        user_id=user_id
    ).order_by(Notification.created_at.desc()).all()

    return jsonify([
        {
            "id": n.id,
            "message": n.message,
            "is_read": n.is_read,
            "created_at": n.created_at.isoformat() if n.created_at else None
        }
        for n in notifications
    ]), 200


@notifications_api.route("/<int:notification_id>/read", methods=["PATCH"])
@jwt_required()
def mark_read(notification_id):
    user_id = int(get_jwt_identity())

    notification = Notification.query.get_or_404(notification_id)

    if notification.user_id != user_id:
        return jsonify({"error": "Forbidden"}), 403

    notification.is_read = True
    db.session.commit()

    return jsonify({
        "id": notification.id,
        "message": notification.message,
        "is_read": notification.is_read
    }), 200
