from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models import Task, Category
from app.utils import allowed_file
from app.services.notification_service import create_notification
from sqlalchemy import or_
from datetime import date
import os
from werkzeug.utils import secure_filename

tasks_api = Blueprint("tasks_api", __name__, url_prefix="/tasks")


def serialize_task(task):
    return {
        "id": task.id,
        "title": task.title,
        "description": task.description,
        "priority": task.priority,
        "status": task.status,
        "deadline": task.deadline.isoformat() if task.deadline else None,
        "reminder": (task.reminder.isoformat() + "Z") if task.reminder else None,
        "attachment": task.attachment,
        "category_id": task.category_id,
        "category_name": task.category.name if task.category else None,
        "category_color": task.category.color if task.category else None,
        "created_at": task.created_at.isoformat() if task.created_at else None,
        "updated_at": task.updated_at.isoformat() if task.updated_at else None
    }


@tasks_api.route("", methods=["GET"])
@jwt_required()
def list_tasks():
    user_id = int(get_jwt_identity())

    query = Task.query.filter(
        Task.user_id == user_id,
        Task.status != "Archived"
    )

    # Search
    search = request.args.get("search", "")
    if search:
        query = query.filter(
            or_(
                Task.title.ilike(f"%{search}%"),
                Task.description.ilike(f"%{search}%")
            )
        )

    # Filter type
    filter_type = request.args.get("filter", "")
    if filter_type == "today":
        query = query.filter(Task.deadline == date.today())
    elif filter_type == "upcoming":
        query = query.filter(Task.deadline > date.today())
    elif filter_type == "overdue":
        query = query.filter(
            Task.deadline < date.today(),
            Task.status != "Completed"
        )
    elif filter_type == "high":
        query = query.filter_by(priority="High")
    elif filter_type == "pending":
        query = query.filter_by(status="Pending")
    elif filter_type == "completed":
        query = query.filter_by(status="Completed")

    # Category filter
    category = request.args.get("category", type=int, default=0)
    if category:
        query = query.filter_by(category_id=category)

    # Priority filter
    priority = request.args.get("priority", "")
    if priority:
        query = query.filter_by(priority=priority)

    # Status filter
    status = request.args.get("status", "")
    if status:
        query = query.filter_by(status=status)

    tasks = query.order_by(Task.created_at.desc()).all()

    return jsonify([serialize_task(t) for t in tasks]), 200


@tasks_api.route("", methods=["POST"])
@jwt_required()
def create_task():
    user_id = int(get_jwt_identity())

    # Support both JSON and multipart form data (for file uploads)
    if request.content_type and "multipart" in request.content_type:
        title = request.form.get("title", "").strip()
        description = request.form.get("description", "")
        priority = request.form.get("priority", "Medium")
        category_id = request.form.get("category_id", type=int)
        deadline = request.form.get("deadline")
        reminder = request.form.get("reminder")
        file = request.files.get("attachment")
    else:
        data = request.get_json() or {}
        title = data.get("title", "").strip()
        description = data.get("description", "")
        priority = data.get("priority", "Medium")
        category_id = data.get("category_id")
        deadline = data.get("deadline")
        reminder = data.get("reminder")
        file = None

    if not title:
        return jsonify({"error": "Title is required"}), 400

    filename = None
    if file and file.filename:
        if allowed_file(file.filename):
            filename = secure_filename(file.filename)
            upload_path = current_app.config["UPLOAD_FOLDER"]
            os.makedirs(upload_path, exist_ok=True)
            file.save(os.path.join(upload_path, filename))
        else:
            return jsonify({"error": "Invalid file type"}), 400

    from datetime import datetime, date

    def parse_deadline(val):
        if not val:
            return None
        if isinstance(val, date):
            return val
        try:
            return datetime.strptime(str(val)[:10], "%Y-%m-%d").date()
        except Exception:
            return None

    def parse_reminder(val):
        if not val:
            return None
        if isinstance(val, datetime):
            return val.replace(tzinfo=None)
        s = str(val).replace("Z", "+00:00")
        try:
            dt = datetime.fromisoformat(s)
            # Strip timezone info — we store naive UTC datetimes
            return dt.replace(tzinfo=None) if dt.tzinfo else dt
        except Exception:
            try:
                return datetime.strptime(s[:16], "%Y-%m-%dT%H:%M")
            except Exception:
                return None

    parsed_deadline = parse_deadline(deadline)
    parsed_reminder = parse_reminder(reminder)

    task = Task(
        title=title,
        description=description,
        priority=priority,
        deadline=parsed_deadline,
        reminder=parsed_reminder,
        reminder_sent=False if parsed_reminder else False,
        status="Pending",
        attachment=filename,
        user_id=user_id,
        category_id=category_id
    )

    db.session.add(task)
    db.session.commit()

    create_notification(user_id, f'Task "{task.title}" created successfully.')

    return jsonify(serialize_task(task)), 201


@tasks_api.route("/<int:task_id>", methods=["GET"])
@jwt_required()
def get_task(task_id):
    user_id = int(get_jwt_identity())
    task = Task.query.filter_by(id=task_id, user_id=user_id).first_or_404()
    return jsonify(serialize_task(task)), 200


@tasks_api.route("/<int:task_id>", methods=["PUT"])
@jwt_required()
def update_task(task_id):
    user_id = int(get_jwt_identity())
    task = Task.query.filter_by(id=task_id, user_id=user_id).first_or_404()

    data = request.get_json() or {}

    task.title = data.get("title", task.title)
    task.description = data.get("description", task.description)
    task.priority = data.get("priority", task.priority)
    task.category_id = data.get("category_id", task.category_id)

    from datetime import datetime, date

    def parse_deadline(val):
        if not val:
            return None
        if isinstance(val, date):
            return val
        try:
            return datetime.strptime(str(val)[:10], "%Y-%m-%d").date()
        except Exception:
            return None

    def parse_reminder(val):
        if not val:
            return None
        if isinstance(val, datetime):
            return val
        s = str(val).replace("Z", "+00:00")
        try:
            return datetime.fromisoformat(s)
        except Exception:
            try:
                return datetime.strptime(s[:16], "%Y-%m-%dT%H:%M")
            except Exception:
                return None

    if "deadline" in data:
        task.deadline = parse_deadline(data["deadline"])

    if "reminder" in data:
        new_reminder = parse_reminder(data["reminder"])
        if new_reminder != task.reminder:
            task.reminder = new_reminder
            task.reminder_sent = False

    db.session.commit()

    return jsonify(serialize_task(task)), 200


@tasks_api.route("/<int:task_id>", methods=["DELETE"])
@jwt_required()
def delete_task(task_id):
    user_id = int(get_jwt_identity())
    task = Task.query.filter_by(id=task_id, user_id=user_id).first_or_404()

    from app.models import User
    user = User.query.get(user_id)
    create_notification(user, f'Task "{task.title}" deleted.')

    db.session.delete(task)
    db.session.commit()

    return jsonify({"message": "Task deleted successfully"}), 200


@tasks_api.route("/<int:task_id>/complete", methods=["PATCH"])
@jwt_required()
def complete_task(task_id):
    user_id = int(get_jwt_identity())
    task = Task.query.filter_by(id=task_id, user_id=user_id).first_or_404()

    task.status = "Completed"
    db.session.commit()

    from app.models import User
    user = User.query.get(user_id)
    create_notification(user, f'Task "{task.title}" completed.')

    return jsonify(serialize_task(task)), 200


@tasks_api.route("/<int:task_id>/archive", methods=["PATCH"])
@jwt_required()
def archive_task(task_id):
    user_id = int(get_jwt_identity())
    task = Task.query.filter_by(id=task_id, user_id=user_id).first_or_404()

    if task.status != "Completed":
        return jsonify({"error": "Only completed tasks can be archived"}), 400

    task.status = "Archived"
    db.session.commit()

    return jsonify(serialize_task(task)), 200


@tasks_api.route("/<int:task_id>/restore", methods=["PATCH"])
@jwt_required()
def restore_task(task_id):
    user_id = int(get_jwt_identity())
    task = Task.query.filter_by(id=task_id, user_id=user_id).first_or_404()

    task.status = "Pending"
    db.session.commit()

    return jsonify(serialize_task(task)), 200


@tasks_api.route("/archived", methods=["GET"])
@jwt_required()
def archived_tasks():
    user_id = int(get_jwt_identity())

    tasks = Task.query.filter_by(
        user_id=user_id,
        status="Archived"
    ).order_by(Task.created_at.desc()).all()

    return jsonify([serialize_task(t) for t in tasks]), 200
