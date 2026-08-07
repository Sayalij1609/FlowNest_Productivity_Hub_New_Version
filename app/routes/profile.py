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
from app.forms import ProfileForm, PasswordForm
from flask_mail import Message
from app.extensions import mail

profile = Blueprint(
    "profile",
    __name__,
    url_prefix="/profile"
)


@profile.route("/")
@login_required
def profile_page():

    return render_template(
        "profile/profile.html"
    )

@profile.route("/edit", methods=["GET","POST"])
@login_required
def edit_profile():

    form = ProfileForm()

    if form.validate_on_submit():

        current_user.username = form.username.data

        current_user.bio = form.bio.data

        current_user.theme = form.theme.data

        if form.profile_image.data:

            from app.utils import save_profile_picture

            picture = save_profile_picture(
                form.profile_image.data
            )

            current_user.profile_image = picture

        db.session.commit()

        flash(
            "Profile updated successfully.",
            "success"
        )

        return redirect(
            url_for("profile.profile_page")
        )

    if request.method == "GET":

        form.username.data = current_user.username

        form.bio.data = current_user.bio

        form.theme.data = current_user.theme

    return render_template(
        "profile/edit_profile.html",
        form=form
    )


@profile.route("/change-password", methods=["GET", "POST"])
@login_required
def change_password():

    form = PasswordForm()

    if form.validate_on_submit():

        if not current_user.check_password(
            form.current_password.data
        ):

            flash(
                "Current password is incorrect.",
                "danger"
            )

            return redirect(
                url_for("profile.change_password")
            )

        current_user.set_password(
            form.new_password.data
        )

        db.session.commit()

        flash(
            "Password changed successfully.",
            "success"
        )

        return redirect(
            url_for("profile.profile_page")
        )

    return render_template(
        "profile/change_password.html",
        form=form
    )

@profile.route("/test-email")
@login_required
def test_email():

    try:
        msg = Message(
            subject="FlowNest Test",
            recipients=[current_user.email],
            body="Hello,\n\nThis is a test email from FlowNest.\n\nCongratulations! Your email configuration is working successfully.\n\nRegards,\nFlowNest"
        )

        mail.send(msg)

        flash(
            "Test email sent successfully!",
            "success"
        )

    except Exception as e:
        flash(
            f"Failed to send email: {str(e)}",
            "danger"
        )

    return redirect(
        url_for("profile.profile_page")
    )