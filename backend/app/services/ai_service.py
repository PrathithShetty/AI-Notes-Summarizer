import json
import google.generativeai as genai

from config import Config


# Configure Gemini API
genai.configure(api_key=Config.GEMINI_API_KEY)


# Load Gemini Model
model = genai.GenerativeModel("gemini-2.5-flash")


def generate_summary(text):
    """
    Generate structured AI study notes from extracted PDF text.
    """

    # Check whether PDF text extraction worked
    if not text or not text.strip():
        raise ValueError("No text was extracted from the PDF.")

    prompt = f"""
You are an expert university professor, examiner, and study coach.

Your task is to analyze ONLY the study material provided below and transform it
into clear, accurate, beginner-friendly study notes.

The student has zero prior knowledge of the topic.

===========================
IMPORTANT RULES
===========================

All generated content must be based on the provided study material.

Do not generate notes about unrelated topics.

Do not ignore the study material.

Return ONLY valid JSON.

Do not use Markdown.

Do not use JSON code fences.

Do not write explanations outside the JSON.

Use simple and easy English.

Explain concepts clearly.

Avoid unnecessary repetition.

===========================
OUTPUT FORMAT
===========================

Return exactly this JSON structure:

{{
    "summary": "string",

    "important_points": [
        "string"
    ],

    "exam_questions": [
        {{
            "type": "Easy",
            "question": "string"
        }},
        {{
            "type": "Easy",
            "question": "string"
        }},
        {{
            "type": "Medium",
            "question": "string"
        }},
        {{
            "type": "Medium",
            "question": "string"
        }},
        {{
            "type": "Difficult",
            "question": "string"
        }},
        {{
            "type": "Difficult",
            "question": "string"
        }}
    ],

    "quick_revision": [
        "string"
    ],

    "mnemonics": [
        "string"
    ]
}}

===========================
SUMMARY
===========================

Write a clear 300-400 word explanation of the main topics contained in the study material.

Explain the concepts from the beginning.

Write for students who have zero prior knowledge of the topic.

Focus only on the actual content of the uploaded document.

Explain why the main concepts are important when relevant.

Explain where the concepts are used in real life when relevant.

Do not add unrelated information merely to reach the word count.

End with one clear concluding sentence.

===========================
IMPORTANT POINTS
===========================

Generate the most useful factual and conceptual points from the study material.

Each point must:

- contain one useful concept or fact
- be easy to understand
- be useful for exam preparation
- avoid repeating information
- be concise

===========================
EXAM QUESTIONS
===========================

Generate exactly 6 questions based on the study material.

Generate:

2 Easy questions.

2 Medium questions.

2 Difficult university-level questions.

Easy questions should test basic understanding.

Medium questions should require explanation or comparison.

Difficult questions should require deeper analysis, application, or detailed explanation.

===========================
QUICK REVISION
===========================

Generate concise one-line revision statements.

Cover the most important concepts from the study material.

Avoid repeating the Important Points word-for-word.

Each revision statement should be useful for last-minute exam preparation.

===========================
MNEMONICS
===========================

Generate useful memory tricks only when appropriate.

Mnemonics must help students remember concepts from the uploaded document.

If no useful mnemonic can be created, return an empty list.

===========================
STUDY MATERIAL START
===========================

{text}

===========================
STUDY MATERIAL END
===========================
"""

    # Send study material to Gemini
    response = model.generate_content(
        prompt,
        generation_config={
            "response_mime_type": "application/json"
        }
    )

    # Get Gemini response
    ai_response = response.text.strip()

    # Convert JSON text into Python dictionary
    try:
        notes = json.loads(ai_response)

    except json.JSONDecodeError as error:

        print("JSON PARSING ERROR:", error)

        return {
            "summary": ai_response,
            "important_points": [],
            "exam_questions": [],
            "quick_revision": [],
            "mnemonics": []
        }

    return notes