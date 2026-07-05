from flask import Blueprint, request, jsonify
from app.extensions import db, bcrypt
from app.models.user import User

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/health")
def health():
    return {
        "status": "success",
        "message": "Authentication Service Working 🚀"
    }


@auth_bp.route("/register", methods=["POST"])
def register():

    data = request.get_json()

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    # Check if user already exists
    existing_user = User.query.filter_by(email=email).first()

    if existing_user:
        return jsonify({
            "status": "error",
            "message": "Email already exists"
        }), 400

    # Hash password
    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

    # Create user
    new_user = User(
        username=username,
        email=email,
        password=hashed_password
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "status": "success",
        "message": "User registered successfully"
    }), 201