from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager

import config
from config import Config

print("=" * 60)
print("CONFIG FILE:", config.__file__)
print("DATABASE URI:", Config.SQLALCHEMY_DATABASE_URI)
print("=" * 60)

db = SQLAlchemy()
jwt = JWTManager()

app = Flask(__name__)
app.config.from_object(Config)

CORS(app)

db.init_app(app)
jwt.init_app(app)


@app.route("/")
def home():
    return {
        "status": "success",
        "message": "Backend Connected Successfully 🚀"
    }


if __name__ == "__main__":
    try:
        with app.app_context():
            db.create_all()
            print("Database initialized successfully")
    except Exception as exc:
        print(f"Database initialization skipped: {exc}")

    print("Starting Flask server at http://127.0.0.1:5000")
    app.run(host="0.0.0.0", port=5000, debug=True)