from flask import Flask
from flask_cors import CORS

from config import Config
from app.extensions import db, jwt


def create_app():
    app = Flask(__name__)

    app.config.from_object(Config)

    CORS(app)

    db.init_app(app)
    jwt.init_app(app)

    from app.routes.auth import auth_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")

    @app.route("/")
    def home():
        return {
            "status": "success",
            "message": "Backend Running"
        }

    with app.app_context():
        db.create_all()

    return app