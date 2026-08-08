from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models import User

profile_api = Blueprint("profile_api", __name__, url_prefix="/profile")


@profile_api.route("", methods=["GET"])
@jwt_required()
def get_profile():
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)

    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "profile_image": user.profile_image,
        "bio": user.bio,
        "theme": user.theme,
        "created_at": user.created_at.isoformat() if user.created_at else None,
        "task_count": len(user.tasks),
        "habit_count": len(user.habits),
        "note_count": len(user.notes)
    }), 200


@profile_api.route("", methods=["PUT"])
@jwt_required()
def update_profile():
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)

    # Support multipart form (for image upload) and JSON
    if request.content_type and "multipart" in request.content_type:
        username = request.form.get("username", user.username).strip()
        bio = request.form.get("bio", user.bio)
        theme = request.form.get("theme", user.theme)
        file = request.files.get("profile_image")
    else:
        data = request.get_json() or {}
        username = data.get("username", user.username).strip()
        bio = data.get("bio", user.bio)
        theme = data.get("theme", user.theme)
        file = None

    user.username = username
    user.bio = bio
    user.theme = theme

    if file and file.filename:
        from app.utils import save_profile_picture
        picture = save_profile_picture(file)
        user.profile_image = picture

    db.session.commit()

    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "profile_image": user.profile_image,
        "bio": user.bio,
        "theme": user.theme
    }), 200


@profile_api.route("/change-password", methods=["POST"])
@jwt_required()
def change_password():
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)
    data = request.get_json() or {}

    current_password = data.get("current_password", "")
    new_password = data.get("new_password", "")

    if not current_password or not new_password:
        return jsonify({"error": "Both passwords are required"}), 400

    if not user.check_password(current_password):
        return jsonify({"error": "Current password is incorrect"}), 401

    if len(new_password) < 6:
        return jsonify({"error": "New password must be at least 6 characters"}), 400

    user.set_password(new_password)
    db.session.commit()

    return jsonify({"message": "Password changed successfully"}), 200
