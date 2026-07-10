import os

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename

from app.extensions import db
from app.models.note import Note
from app.services.pdf_service import process_pdf


pdf_bp = Blueprint("pdf", __name__)


UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@pdf_bp.route("/upload", methods=["POST"])
@jwt_required()
def upload_pdf():
    """
    Upload a PDF, generate AI study notes,
    and save the generated notes for the logged-in user.
    """

    # Get logged-in user's ID from JWT token
    current_user_id = get_jwt_identity()


    # Check whether request contains a file
    if "file" not in request.files:

        return jsonify({
            "status": "error",
            "message": "No file uploaded"
        }), 400


    file = request.files["file"]


    # Check whether user selected a file
    if file.filename == "":

        return jsonify({
            "status": "error",
            "message": "No file selected"
        }), 400


    # Allow PDF files only
    if not file.filename.lower().endswith(".pdf"):

        return jsonify({
            "status": "error",
            "message": "Only PDF files are allowed"
        }), 400


    # Create safe filename
    filename = secure_filename(file.filename)


    # Create complete file path
    filepath = os.path.join(
        UPLOAD_FOLDER,
        filename
    )


    # Save uploaded PDF
    file.save(filepath)


    try:

        # Generate AI notes from PDF
        ai_summary = process_pdf(filename)


        # Create database Note object
        new_note = Note(
            filename=filename,

            summary=ai_summary.get(
                "summary",
                ""
            ),

            user_id=int(current_user_id)
        )


        # Store list/dictionary fields as JSON
        new_note.set_important_points(
            ai_summary.get(
                "important_points",
                []
            )
        )


        new_note.set_exam_questions(
            ai_summary.get(
                "exam_questions",
                []
            )
        )


        new_note.set_quick_revision(
            ai_summary.get(
                "quick_revision",
                []
            )
        )


        new_note.set_mnemonics(
            ai_summary.get(
                "mnemonics",
                []
            )
        )


        # Save note to MySQL
        db.session.add(new_note)

        db.session.commit()


        # Return generated and saved note
        return jsonify({
            "status": "success",

            "message":
                "PDF uploaded and notes saved successfully",

            "filename": filename,

            "note": new_note.to_dict(),

            # Keep this for compatibility with
            # your current React UploadCard.
            "summary": ai_summary

        }), 201


    except Exception as error:

        # Undo any incomplete database transaction
        db.session.rollback()

        print(
            "PDF PROCESSING ERROR:",
            str(error)
        )


        return jsonify({
            "status": "error",

            "message":
                "Unable to process PDF and save notes"

        }), 500