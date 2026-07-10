import os

from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.models.note import Note
from app.services.quiz_service import generate_quiz_from_pdf


quiz_bp = Blueprint("quiz", __name__)

UPLOAD_FOLDER = "uploads"


@quiz_bp.route("/generate/<int:note_id>", methods=["POST"])
@jwt_required()
def generate_quiz(note_id):
    """
    Generate a quiz from the PDF associated with a saved note.
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


    # Build path to original uploaded PDF
    pdf_path = os.path.join(
        UPLOAD_FOLDER,
        note.filename
    )


    # Make sure the PDF still exists
    if not os.path.exists(pdf_path):
        return jsonify({
            "status": "error",
            "message": "Original PDF file not found"
        }), 404


    try:

        # Send PDF content to Gemini and generate quiz
        quiz_data = generate_quiz_from_pdf(pdf_path)


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