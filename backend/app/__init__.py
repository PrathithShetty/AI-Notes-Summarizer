from flask import Flask
from flask_cors import CORS

from config import Config
from app.extensions import db, bcrypt, jwt


def create_app():

    app = Flask(__name__)

    # Load configuration
    app.config.from_object(Config)

    # Enable CORS
    CORS(app)

    # Initialize extensions
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    # Import models so SQLAlchemy knows about them
    from app.models.user import User
    from app.models.note import Note

    # Import blueprints
    from app.routes.auth import auth_bp
    from app.routes.pdf import pdf_bp
    from app.routes.quiz import quiz_bp

    # Register blueprints
    app.register_blueprint(
        auth_bp,
        url_prefix="/api/auth"
    )

    app.register_blueprint(
        pdf_bp,
        url_prefix="/api/pdf"
    )

    app.register_blueprint(
        quiz_bp,
        url_prefix="/api/quiz"
    )

    # Backend health route
    @app.route("/")
    def home():
        return {
            "status": "success",
            "message": "AI Notes Summarizer Backend Running"
        }

    return app