from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models import Category

categories_api = Blueprint("categories_api", __name__, url_prefix="/categories")


def serialize_category(cat):
    return {
        "id": cat.id,
        "name": cat.name,
        "color": cat.color,
        "task_count": len(cat.tasks) if cat.tasks else 0
    }


@categories_api.route("", methods=["GET"])
@jwt_required()
def list_categories():
    user_id = int(get_jwt_identity())
    categories = Category.query.filter_by(user_id=user_id).all()
    return jsonify([serialize_category(c) for c in categories]), 200


@categories_api.route("", methods=["POST"])
@jwt_required()
def create_category():
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}

    name = data.get("name", "").strip()
    color = data.get("color", "#007bff")

    if not name:
        return jsonify({"error": "Category name is required"}), 400

    existing = Category.query.filter_by(name=name, user_id=user_id).first()
    if existing:
        return jsonify({"error": "Category already exists"}), 409

    category = Category(name=name, color=color, user_id=user_id)
    db.session.add(category)
    db.session.commit()

    return jsonify(serialize_category(category)), 201


@categories_api.route("/<int:category_id>", methods=["PUT"])
@jwt_required()
def update_category(category_id):
    user_id = int(get_jwt_identity())
    category = Category.query.filter_by(
        id=category_id, user_id=user_id
    ).first_or_404()

    data = request.get_json() or {}

    name = data.get("name", category.name).strip()
    color = data.get("color", category.color)

    # Check for duplicate name
    existing = Category.query.filter(
        Category.name == name,
        Category.user_id == user_id,
        Category.id != category.id
    ).first()
    if existing:
        return jsonify({"error": "Category already exists"}), 409

    category.name = name
    category.color = color
    db.session.commit()

    return jsonify(serialize_category(category)), 200


@categories_api.route("/<int:category_id>", methods=["DELETE"])
@jwt_required()
def delete_category(category_id):
    user_id = int(get_jwt_identity())
    category = Category.query.filter_by(
        id=category_id, user_id=user_id
    ).first_or_404()

    if category.tasks:
        return jsonify({
            "error": "Cannot delete category because it contains tasks"
        }), 400

    db.session.delete(category)
    db.session.commit()

    return jsonify({"message": "Category deleted successfully"}), 200
