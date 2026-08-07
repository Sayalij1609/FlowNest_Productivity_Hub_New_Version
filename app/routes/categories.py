from flask import (
    Blueprint,
    render_template,
    redirect,
    url_for,
    flash,
    request
)
from flask_login import (
    login_required,
    current_user
)
from app.extensions import db
from app.forms import CategoryForm
from app.models import Category

categories = Blueprint(
    "categories",
    __name__,
    url_prefix="/categories"
)

# Showing list
@categories.route("/")
@login_required
def list_categories():

    categories = Category.query.filter_by(
        user_id=current_user.id
    ).all()

    return render_template(
        "categories/list.html",
        categories=categories
    )

# Create Categories
@categories.route("/create", methods=["GET", "POST"])
@login_required
def create_category():

    form = CategoryForm()

    if form.validate_on_submit():

        existing_category = Category.query.filter_by(
            name=form.name.data,
            user_id=current_user.id
        ).first()

        if existing_category:

            flash(
                "Category already exists.",
                "warning"
            )

            return redirect(
                url_for("categories.create_category")
            )

        category = Category(
            name=form.name.data,
            color=form.color.data,
            user_id=current_user.id
        )

        db.session.add(category)
        db.session.commit()

        flash(
            "Category created successfully!",
            "success"
        )

        return redirect(
            url_for("categories.list_categories")
        )

    return render_template(
        "categories/create.html",
        form=form
    )

# create Categories
@categories.route("/edit/<int:category_id>", methods=["GET", "POST"])
@login_required
def update_category(category_id):

    category = Category.query.filter_by(
        id=category_id,
        user_id=current_user.id
    ).first_or_404()

    form = CategoryForm(obj=category)

    if form.validate_on_submit():

        existing = Category.query.filter(
            Category.name == form.name.data,
            Category.user_id == current_user.id,
            Category.id != category.id
        ).first()

        if existing:

            flash(
                "Category already exists.",
                "warning"
            )

            return redirect(
                url_for(
                    "categories.update_category",
                    category_id=category.id
                )
            )

        category.name = form.name.data
        category.color = form.color.data

        db.session.commit()

        flash(
            "Category updated successfully!",
            "success"
        )

        return redirect(
            url_for("categories.list_categories")
        )

    return render_template(
        "categories/update.html",
        form=form,
        category=category
    )

# delete categories
@categories.route("/delete/<int:category_id>")
@login_required
def delete_category(category_id):

    category = Category.query.filter_by(
        id=category_id,
        user_id=current_user.id
    ).first_or_404()

    db.session.delete(category)

    db.session.commit()
    
    if category.tasks:

        flash(
            "Cannot delete category because it contains tasks.",
            "warning"
        )

        return redirect(
            url_for("categories.list_categories")
        )
    flash(
        "Category deleted successfully!",
        "success"
    )


    return redirect(
        url_for("categories.list_categories")
    )