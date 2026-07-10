import fitz  # PyMuPDF


def extract_text_from_pdf(pdf_path):
    """
    Extract text from all pages of a PDF.
    """

    document = fitz.open(pdf_path)

    extracted_text = ""

    for page in document:
        extracted_text += page.get_text()

    document.close()

    return extracted_text.strip()