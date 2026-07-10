import json

from app.extensions import db


class Note(db.Model):
    __tablename__ = "notes"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    filename = db.Column(
        db.String(255),
        nullable=False
    )

    summary = db.Column(
        db.Text,
        nullable=False
    )

    important_points = db.Column(
        db.Text,
        nullable=False
    )

    exam_questions = db.Column(
        db.Text,
        nullable=False
    )

    quick_revision = db.Column(
        db.Text,
        nullable=False
    )

    mnemonics = db.Column(
        db.Text,
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now(),
        nullable=False
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False,
        index=True
    )


    def set_important_points(self, value):
        self.important_points = json.dumps(value)


    def get_important_points(self):
        return json.loads(self.important_points or "[]")


    def set_exam_questions(self, value):
        self.exam_questions = json.dumps(value)


    def get_exam_questions(self):
        return json.loads(self.exam_questions or "[]")


    def set_quick_revision(self, value):
        self.quick_revision = json.dumps(value)


    def get_quick_revision(self):
        return json.loads(self.quick_revision or "[]")


    def set_mnemonics(self, value):
        self.mnemonics = json.dumps(value)


    def get_mnemonics(self):
        return json.loads(self.mnemonics or "[]")


    def to_dict(self):
        return {
            "id": self.id,
            "filename": self.filename,
            "summary": self.summary,
            "important_points": self.get_important_points(),
            "exam_questions": self.get_exam_questions(),
            "quick_revision": self.get_quick_revision(),
            "mnemonics": self.get_mnemonics(),
            "created_at": (
                self.created_at.isoformat()
                if self.created_at
                else None
            ),
            "user_id": self.user_id
        }