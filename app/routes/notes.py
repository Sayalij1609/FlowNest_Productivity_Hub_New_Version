from re import search
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
from app.models import Note
from app.forms import NoteForm
from sqlalchemy import or_

notes = Blueprint(
    "notes",
    __name__,
    url_prefix="/notes"
)


# List Notes
@notes.route("/")
@login_required
def list_notes():

    search = request.args.get(
        "search",
        ""
    )

    query = Note.query.filter_by(
        user_id=current_user.id
    )

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
    return render_template(
        "notes/notes.html",
        notes=notes,
        search=search
    )

# Create Notes
@notes.route("/create", methods=["GET", "POST"])
@login_required
def create_note():

    form = NoteForm()

    if form.validate_on_submit():

        note = Note(

            title=form.title.data,

            content=form.content.data,

            color=form.color.data,

            user_id=current_user.id

        )

        db.session.add(note)

        db.session.commit()

        flash(
            "Note created successfully!",
            "success"
        )

        return redirect(
            url_for("notes.list_notes")
        )

    return render_template(
        "notes/create.html",
        form=form
    )


# Update Note
@notes.route("/edit/<int:note_id>", methods=["GET", "POST"])
@login_required
def update_note(note_id):

    note = Note.query.filter_by(
        id=note_id,
        user_id=current_user.id
    ).first_or_404()

    form = NoteForm(obj=note)

    if form.validate_on_submit():

        note.title = form.title.data
        note.content = form.content.data
        note.color = form.color.data

        db.session.commit()

        flash(
            "Note updated successfully!",
            "success"
        )

        return redirect(
            url_for("notes.list_notes")
        )

    return render_template(
        "notes/create.html",
        form=form,
        edit=True
    )

# Delete Note
@notes.route("/delete/<int:note_id>")
@login_required
def delete_note(note_id):

    note = Note.query.filter_by(
        id=note_id,
        user_id=current_user.id
    ).first_or_404()

    db.session.delete(note)

    db.session.commit()

    flash(
        "Note deleted successfully!",
        "success"
    )

    return redirect(
        url_for("notes.list_notes")
    )

# Pin / Unpin
@notes.route("/pin/<int:note_id>")
@login_required
def pin_note(note_id):

    note = Note.query.filter_by(
        id=note_id,
        user_id=current_user.id
    ).first_or_404()

    note.is_pinned = not note.is_pinned

    db.session.commit()

    flash(
        "Note pinned!" if note.is_pinned else "Note unpinned!",
        "success"
    )

    return redirect(
        url_for("notes.list_notes")
    )

