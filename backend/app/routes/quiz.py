from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.models.note import Note
from app.services.quiz_service import generate_quiz_from_text


quiz_bp = Blueprint("quiz", __name__)


@quiz_bp.route("/generate/<int:note_id>", methods=["POST"])
@jwt_required()
def generate_quiz(note_id):
    """
    Generate a quiz from the text extracted at upload time for a saved note.
    Only the owner of the note can generate the quiz.
    """

    current_user_id = int(get_jwt_identity())

    # Find the note
    note = Note.query.get(note_id)

    if not note:
        return jsonify({
            "status": "error",
            "message": "Note not found"
        }), 404


    # Verify that the logged-in user owns this note
    if note.user_id != current_user_id:
        return jsonify({
            "status": "error",
            "message": "You are not allowed to access this note"
        }), 403


    if not note.full_text:
        return jsonify({
            "status": "error",
            "message": "No extracted text is available for this note. Please re-upload the PDF."
        }), 404


    try:

        # Send stored extracted text to Gemini and generate quiz
        quiz_data = generate_quiz_from_text(note.full_text)


        return jsonify({
            "status": "success",
            "message": "Quiz generated successfully",
            "note_id": note.id,
            "filename": note.filename,
            "quiz": quiz_data
        }), 200


    except Exception as error:

        print(
            "QUIZ GENERATION ERROR:",
            str(error)
        )


        return jsonify({
            "status": "error",
            "message": "Unable to generate quiz"
        }), 500
