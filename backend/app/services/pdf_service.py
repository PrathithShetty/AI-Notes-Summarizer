from app.utils.pdf_utils import extract_text_from_pdf_bytes
from app.services.ai_service import generate_summary


def process_pdf(pdf_bytes):
    """
    Extract text from an in-memory PDF and generate an AI summary.
    Returns both, since the extracted text is stored on the Note so
    quiz generation can reuse it without touching the original file.
    """

    extracted_text = extract_text_from_pdf_bytes(pdf_bytes)

    ai_summary = generate_summary(extracted_text)

    return extracted_text, ai_summary
