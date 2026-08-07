from asyncio import taskgroups
from flask import Blueprint,render_template,redirect,url_for, flash, request, current_app
from flask_login import login_required, current_user
from app.extensions import db
from app.forms import TaskForm,CategoryForm
from app.models import Task,Category
from app.forms import SearchForm
from datetime import date
import os
from werkzeug.utils import secure_filename
from app.utils import allowed_file
from app.services.notification_service import create_notification

tasks = Blueprint(
    "tasks",
    __name__,
    url_prefix="/tasks"
)



# Create Tasks
@tasks.route("/create", methods=["GET", "POST"])
@login_required
def create_task():

    form = TaskForm()

    # Load current user's categories
    form.category.choices = [
        (category.id, category.name)
        for category in Category.query.filter_by(
            user_id=current_user.id
        ).order_by(Category.name).all()
    ]

    # Process form submission
    if form.validate_on_submit():

        filename = None

        if form.attachment.data:

            file = form.attachment.data

            if allowed_file(file.filename):

                filename = secure_filename(file.filename)

                file.save(

                    os.path.join(

                        current_app.config["UPLOAD_FOLDER"],

                        filename

                    )

                )

            else:

                flash(

                    "Invalid file type.",

                    "danger"

                )

                return redirect(

                    url_for("tasks.create_task")

                )

        task = Task(

                title=form.title.data,
                description=form.description.data,
                priority=form.priority.data,
                deadline=form.deadline.data,
                reminder=form.reminder.data,
                status="Pending",
                attachment=filename,
                user_id=current_user.id,
                category_id=form.category.data,
                

            )

        db.session.add(task)
        db.session.commit()

        create_notification(

        current_user,

        f'Task "{task.title}" created successfully.'

        )

        flash(
            "Task created successfully!",
            "success"
        )

        return redirect(
            url_for("tasks.list_tasks")
        )

    return render_template(
        "tasks/create.html",
        form=form
    )

# List All Tasks
from sqlalchemy import or_

# Showing Tasks
@tasks.route("/")
@login_required
def list_tasks():

    form = SearchForm()

    # Load current user's categories
    form.category.choices.extend([
        (category.id, category.name)
        for category in Category.query.filter_by(
            user_id=current_user.id
        ).order_by(Category.name)
        .all()
    ])

    # Base query
    query = Task.query.filter(
        Task.user_id == current_user.id,
        Task.status != "Archived"
    )

    # Read search parameters
    search = request.args.get(
        "search",
        ""
    )

    category = request.args.get(
        "category",
        type=int,
        default=0
    )

    priority = request.args.get(
        "priority",
        ""
    )

    status = request.args.get(
        "status",
        ""
    )

    filter_type = request.args.get(
    "filter",
    ""
    )

    # Search by title or description
    if search:
        query = query.filter(
            or_(
                Task.title.ilike(f"%{search}%"),
                Task.description.ilike(f"%{search}%")
            )
        )
    # Today's Tasks
    if filter_type == "today":

        query = query.filter(
            Task.deadline == date.today()
        )

   # Upcoming Tasks
    if filter_type == "upcoming":

        query = query.filter(
            Task.deadline > date.today()
        )

    # Overdue Tasks
    if filter_type == "overdue":

        query = query.filter(
            Task.deadline < date.today(),
            Task.status != "Completed"
        )

    # High Priority Tasks
    if filter_type == "high":

        query = query.filter_by(
            priority="High"
        )

    # Pending Tasks
    if filter_type == "pending":

        query = query.filter_by(
            status="Pending"
        )

    # Completed Tasks
    if filter_type == "completed":

        query = query.filter_by(
            status="Completed"
        )

    # Archived Tasks
    if filter_type == "archived":

        query = query.filter_by(
            status="Archived"
        )

    # Filter by category
    if category:
        query = query.filter_by(
            category_id=category
        )

    # Filter by priority
    if priority:
        query = query.filter_by(
            priority=priority
        )

    # Filter by status
    if status:
        query = query.filter_by(
            status=status
        )

    # Fetch tasks
    tasks = query.order_by(
    Task.created_at.desc()
    ).all()

    # Preserve selected values
    form.search.data = search
    form.category.data = category
    form.priority.data = priority
    form.status.data = status
    selected_filter = filter_type

    return render_template(
    "tasks/list.html",
    tasks=tasks,
    form=form,
    selected_filter=selected_filter
)

# Edit Tasks
@tasks.route("/edit/<int:task_id>", methods=["GET", "POST"])
@login_required
def update_task(task_id):

    task = Task.query.filter_by(
        id=task_id,
        user_id=current_user.id
    ).first_or_404()

    form = TaskForm(obj=task)

    form.category.choices = [
        (category.id, category.name)
        for category in Category.query.filter_by(
            user_id=current_user.id
        ).order_by(Category.name)
        .all()
    ]

    if form.validate_on_submit():

        task.title = form.title.data
        task.description = form.description.data
        task.priority = form.priority.data
        task.deadline = form.deadline.data
        task.reminder = form.reminder.data
        task.category_id = form.category.data

        db.session.commit()

        flash(
            "Task updated successfully!",
            "success"
        )

        return redirect(
            url_for("tasks.list_tasks")
        )

    return render_template(
        "tasks/update.html",
        form=form,
        task=task
    )

# Delete Tasks
@tasks.route("/delete/<int:task_id>")
@login_required
def delete_task(task_id):

    task = Task.query.filter_by(
        id=task_id,
        user_id=current_user.id
    ).first_or_404()

    db.session.delete(task)

    db.session.commit()

    create_notification(

            current_user,

            f'Task "{task.title}" deleted.'

    )

    flash(
        "Task deleted successfully!",
        "success"
    )

    return redirect(
        url_for("tasks.list_tasks")
    )

# Complete Tasks
@tasks.route("/complete/<int:task_id>")
@login_required
def complete_task(task_id):

    task = Task.query.filter_by(
        id=task_id,
        user_id=current_user.id
    ).first_or_404()

    task.status = "Completed"

    db.session.commit()

    create_notification(

        current_user,

        f'Task "{task.title}" completed.'

    )

    flash(
        "Task marked as completed!",
        "success"
    )

    return redirect(
        url_for("tasks.list_tasks")
    )

# View Task Details
@tasks.route("/view/<int:task_id>")
@login_required
def view_task(task_id):

    task = Task.query.filter_by(
        id=task_id,
        user_id=current_user.id
    ).first_or_404()

    return render_template(
        "tasks/view.html",
        task=task
    )

# Archive Task
@tasks.route("/archive/<int:task_id>")
@login_required
def archive_task(task_id):

    task = Task.query.filter_by(
        id=task_id,
        user_id=current_user.id
    ).first_or_404()

    if task.status != "Completed":

        flash(
            "Only completed tasks can be archived.",
            "warning"
        )

        return redirect(
            url_for("tasks.list_tasks")
        )

    task.status = "Archived"
    db.session.commit()

    db.session.commit()

    flash(
        "Task archived successfully!",
        "success"
    )

    return redirect(
        url_for("tasks.list_tasks")
    )

# List Archived Tasks
@tasks.route("/archived")
@login_required
def archived_tasks():

    tasks = Task.query.filter_by(
        user_id=current_user.id,
        status="Archived"
    ).order_by(
        Task.created_at.desc()
    ).all()

    return render_template(
        "tasks/archived.html",
        tasks=tasks
    )

# Restore Task
@tasks.route("/restore/<int:task_id>")
@login_required
def restore_task(task_id):

    task = Task.query.filter_by(
        id=task_id,
        user_id=current_user.id
    ).first_or_404()

    task.status = "Pending"

    db.session.commit()

    flash(
        "Task restored successfully!",
        "success"
    )

    return redirect(
        url_for("tasks.archived_tasks")
    )