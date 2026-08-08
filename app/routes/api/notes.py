from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models import Note
from sqlalchemy import or_

notes_api = Blueprint("notes_api", __name__, url_prefix="/notes")


def serialize_note(note):
    return {
        "id": note.id,
        "title": note.title,
        "content": note.content,
        "color": note.color,
        "is_pinned": note.is_pinned,
        "created_at": note.created_at.isoformat() if note.created_at else None,
        "updated_at": note.updated_at.isoformat() if note.updated_at else None
    }


@notes_api.route("", methods=["GET"])
@jwt_required()
def list_notes():
    user_id = int(get_jwt_identity())
    search = request.args.get("search", "")

    query = Note.query.filter_by(user_id=user_id)

    if search:
        query = query.filter(
            or_(
                Note.title.ilike(f"%{search}%"),
                Note.content.ilike(f"%{search}%")
            )
        )

    notes = query.order_by(
        Note.is_pinned.desc(),
        Note.updated_at.desc()
    ).all()

    return jsonify([serialize_note(n) for n in notes]), 200


@notes_api.route("", methods=["POST"])
@jwt_required()
def create_note():
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}

    title = data.get("title", "").strip()
    content = data.get("content", "").strip()
    color = data.get("color", "yellow")

    if not title or not content:
        return jsonify({"error": "Title and content are required"}), 400

    note = Note(
        title=title,
        content=content,
        color=color,
        user_id=user_id
    )

    db.session.add(note)
    db.session.commit()

    return jsonify(serialize_note(note)), 201


@notes_api.route("/<int:note_id>", methods=["GET"])
@jwt_required()
def get_note(note_id):
    user_id = int(get_jwt_identity())
    note = Note.query.filter_by(id=note_id, user_id=user_id).first_or_404()
    return jsonify(serialize_note(note)), 200


@notes_api.route("/<int:note_id>", methods=["PUT"])
@jwt_required()
def update_note(note_id):
    user_id = int(get_jwt_identity())
    note = Note.query.filter_by(id=note_id, user_id=user_id).first_or_404()

    data = request.get_json() or {}

    note.title = data.get("title", note.title)
    note.content = data.get("content", note.content)
    note.color = data.get("color", note.color)

    db.session.commit()

    return jsonify(serialize_note(note)), 200


@notes_api.route("/<int:note_id>", methods=["DELETE"])
@jwt_required()
def delete_note(note_id):
    user_id = int(get_jwt_identity())
    note = Note.query.filter_by(id=note_id, user_id=user_id).first_or_404()

    db.session.delete(note)
    db.session.commit()

    return jsonify({"message": "Note deleted successfully"}), 200


@notes_api.route("/<int:note_id>/pin", methods=["PATCH"])
@jwt_required()
def pin_note(note_id):
    user_id = int(get_jwt_identity())
    note = Note.query.filter_by(id=note_id, user_id=user_id).first_or_404()

    note.is_pinned = not note.is_pinned
    db.session.commit()

    return jsonify(serialize_note(note)), 200
