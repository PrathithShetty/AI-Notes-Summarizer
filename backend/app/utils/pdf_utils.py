import fitz  # PyMuPDF


def extract_text_from_pdf_bytes(pdf_bytes):
    """
    Extract text from all pages of a PDF held entirely in memory.
    Avoids writing to disk, which is required for serverless
    deployments where the filesystem is not persisted between requests.
    """

    document = fitz.open(stream=pdf_bytes, filetype="pdf")

    extracted_text = ""

    for page in document:
        extracted_text += page.get_text()

    document.close()

    return extracted_text.strip()
