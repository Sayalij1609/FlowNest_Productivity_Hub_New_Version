from flask import Blueprint, render_template, redirect, url_for, flash
from app.forms import RegisterForm, LoginForm
from flask_login import login_user
from app.models import User
from app.extensions import db
from flask_login import login_user,logout_user,login_required,current_user


# Create Authentication Blueprint
auth = Blueprint(
    "auth",
    __name__,
    url_prefix="/auth"
)

# Registeration route 
@auth.route("/register", methods=["GET", "POST"])
def register():

    # Create form object
    form = RegisterForm()

    # Process form when submitted
    if form.validate_on_submit():

        # Check if email already exists
        existing_user = User.query.filter_by(
            email=form.email.data
        ).first()

        if existing_user:
            flash(
                "Email already registered.",
                "danger"
            )
            return redirect(url_for("auth.register"))

        # Check if username already exists
        existing_username = User.query.filter_by(
            username=form.username.data
        ).first()

        if existing_username:
            flash(
                "Username already taken.",
                "danger"
            )
            return redirect(url_for("auth.register"))

        # Create new user
        user = User(
            username = form.username.data,
            email = form.email.data
        )

        # Hash password
        user.set_password(form.password.data)

        # Save user to database
        db.session.add(user)
        db.session.commit()

        # Success message
        flash(
            "Registration successful! Please login.",
            "success"
        )

        # Redirect to login page
        return redirect(url_for("auth.login"))

    return render_template(
        "auth/register.html",
        form=form
    )

# Login Route
@auth.route("/login", methods=["GET", "POST"])
def login():

    # If already logged in, don't show login page again
    if current_user.is_authenticated:
        return redirect(url_for("main.home"))

    form = LoginForm()

    if form.validate_on_submit():

        # Find user by email
        user = User.query.filter_by(
            email=form.email.data
        ).first()

        # Verify user and password
        if user and user.check_password(form.password.data):

            login_user(
                user,
                remember=form.remember.data
            )

            flash(
                "Login successful!",
                "success"
            )

            return redirect(url_for("dashboard.home"))


        flash(
            "Invalid email or password.",
            "danger"
        )

    return render_template(
        "auth/login.html",
        form=form
    )

# Logout route
@auth.route("/logout")
@login_required
def logout():

    logout_user()

    flash(
        "You have been logged out successfully.",
        "success"
    )

    return redirect(url_for("auth.login"))