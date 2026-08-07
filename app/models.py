from datetime import datetime
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from app.extensions import db

# User Table
class User(UserMixin, db.Model):
    __tablename__ = "users"
    
    id = db.Column(db.Integer, primary_key=True)
    
    username = db.Column(
    db.String(100),
    unique=True,
    nullable=False
    )

    email = db.Column(
    db.String(120),
    unique=True,
    nullable=False
    )

    password_hash = db.Column(
    db.String(255),
    nullable=False
    )

    profile_image = db.Column(
    db.String(255),
    default="default.png"
    )

    bio = db.Column(
    db.Text,
    nullable=True
    )

    theme = db.Column(
    db.String(20),
    default="light"
    )    

    created_at = db.Column(
    db.DateTime,
    default=datetime.utcnow
    ) 

    notifications = db.relationship(

        "Notification",

        back_populates="user",

        lazy=True,

        cascade="all, delete-orphan"

    )
    
    # user relationships 
    tasks = db.relationship(
    "Task",
    back_populates="user",
    cascade="all, delete-orphan",
    lazy=True
    )

    categories = db.relationship(
    "Category",
    back_populates="user",
    cascade="all, delete-orphan",
    lazy=True
    )

    habits = db.relationship(
    "Habit",
    back_populates="user",
    cascade="all, delete-orphan",
    lazy=True
    )

    notes = db.relationship(
    "Note",
    back_populates="user",
    cascade="all, delete-orphan",
    lazy=True
    )

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(
            self.password_hash,
            password
        )

    def __repr__(self):
        return f"<User {self.username}>"

# Task Table
class Task(db.Model):
    __tablename__ = "tasks"

    id = db.Column(db.Integer, primary_key=True)

    title = db.Column(db.String(200), nullable=False)

    description = db.Column(db.Text, nullable=True)

    priority = db.Column(db.String(20), default="Medium")

    status = db.Column(db.String(20), default="Pending")

    deadline = db.Column(db.Date, nullable=True)

    reminder = db.Column(db.DateTime, nullable=True)

    attachment = db.Column(db.String(255), nullable=True)

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    reminder_sent = db.Column(
    db.Boolean,
    default=False
    )

    # User Foreign Key
    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )
    # Category Foreign Key
    category_id = db.Column(
        db.Integer,
        db.ForeignKey("categories.id"),
        nullable=True
    )

    # Task Relationships
    user = db.relationship(
    "User",
    back_populates="tasks"
    )

    category = db.relationship(
    "Category",
    back_populates="tasks"
    )

    def __repr__(self):
        return f"<Task {self.title}>"

# Category Table
class Category(db.Model):
    __tablename__ = "categories"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    # Category Relationships
    user = db.relationship(
    "User",
    back_populates="categories"
    )

    tasks = db.relationship(
    "Task",
    back_populates="category",
    lazy=True
    )

    name = db.Column(
        db.String(100),
        nullable=False
    )

    color = db.Column(
        db.String(20),
        default="#007bff"
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    def __repr__(self):
        return f"<Category {self.name}>"

# Habit Model
class Habit(db.Model):

    __tablename__ = "habits"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    habit_name = db.Column(
        db.String(100),
        nullable=False
    )

    description = db.Column(
        db.Text
    )

    current_streak = db.Column(
        db.Integer,
        default=0
    )

    longest_streak = db.Column(
        db.Integer,
        default=0
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )
    
    # Habit Relationships
    user = db.relationship(
    "User",
    back_populates="habits"
    )

    logs = db.relationship(
        "HabitLog",
        back_populates="habit",
        cascade="all, delete-orphan",
        lazy=True
    )

# Habit Log Model
class HabitLog(db.Model):

    __tablename__ = "habit_logs"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    completed_date = db.Column(
        db.Date,
        nullable=False
    )

    completed = db.Column(
        db.Boolean,
        default=False
    )

    habit_id = db.Column(
        db.Integer,
        db.ForeignKey("habits.id"),
        nullable=False
    )

    # Habit Log Relationships
    habit = db.relationship(
    "Habit",
    back_populates="logs"
    )

# Note Model
class Note(db.Model):

    __tablename__ = "notes"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    title = db.Column(
        db.String(150),
        nullable=False
    )

    content = db.Column(
        db.Text,
        nullable=False
    )

    color = db.Column(
        db.String(20),
        default="yellow"
    )

    is_pinned = db.Column(
        db.Boolean,
        default=False
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    # Note Model Relationships
    user = db.relationship(
        "User",
        back_populates="notes"
    )

# Notification Model
class Notification(db.Model):

    __tablename__ = "notifications"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    message = db.Column(
        db.String(255),
        nullable=False
    )

    is_read = db.Column(
        db.Boolean,
        default=False
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    user = db.relationship(
        "User",
        back_populates="notifications"
    )

    def __repr__(self):

        return f"<Notification {self.message}>"


