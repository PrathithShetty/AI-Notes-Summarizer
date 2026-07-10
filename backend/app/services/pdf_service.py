import os

from app.utils.pdf_utils import extract_text_from_pdf
from app.services.ai_service import generate_summary


def process_pdf(filename):
    """
    Extract text from a PDF and generate an AI summary.
    """

    pdf_path = os.path.join("uploads", filename)

    extracted_text = extract_text_from_pdf(pdf_path)

    ai_summary = generate_summary(extracted_text)

    return ai_summary