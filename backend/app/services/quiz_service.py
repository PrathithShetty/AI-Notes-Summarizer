import json

import google.generativeai as genai

from config import Config
from app.utils.pdf_utils import extract_text_from_pdf


genai.configure(api_key=Config.GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-2.5-flash")


def generate_quiz_from_pdf(pdf_path):
    """
    Extract text from a PDF and generate a comprehensive MCQ quiz.
    """

    extracted_text = extract_text_from_pdf(pdf_path)

    if not extracted_text or not extracted_text.strip():
        raise ValueError("No readable text was found in the PDF.")


    prompt = f"""
You are an expert university professor and examination question creator.

Your task is to create a comprehensive multiple-choice quiz using ONLY the provided study material.

The quiz should test all important, meaningful, and testable concepts found in the document.

===========================
STRICT OUTPUT RULES
===========================

Return ONLY valid JSON.

Never use markdown.

Never use ```json.

Never include explanations outside the JSON object.

Use simple and clear English.

Every question must be answerable from the provided study material.

Do not create duplicate or nearly duplicate questions.

Do not create questions about information that is not present in the study material.

===========================
QUESTION GENERATION
===========================

Generate as many HIGH-QUALITY and DISTINCT questions as reasonably possible.

Cover the entire study material.

Generate questions from different topics and sections.

Do not repeatedly test the same concept.

Use a balanced mixture of:

Easy questions
Medium questions
Difficult questions

Every question must have exactly 4 answer options.

Only one option must be correct.

Incorrect options must be believable.

Randomize the position of the correct answer.

Provide a short explanation of why the correct answer is correct.

===========================
OUTPUT FORMAT
===========================

{{
    "quiz_title": "",
    "questions": [
        {{
            "question": "",
            "options": [
                "",
                "",
                "",
                ""
            ],
            "correct_answer": "",
            "explanation": "",
            "difficulty": "Easy"
        }}
    ]
}}

===========================
STUDY MATERIAL
===========================

{extracted_text}
"""


    response = model.generate_content(prompt)

    ai_response = response.text.strip()


    # Remove accidental markdown code fences
    if ai_response.startswith("```json"):
        ai_response = (
            ai_response
            .replace("```json", "")
            .replace("```", "")
            .strip()
        )

    elif ai_response.startswith("```"):
        ai_response = (
            ai_response
            .replace("```", "")
            .strip()
        )


    try:
        quiz_data = json.loads(ai_response)

    except json.JSONDecodeError as error:
        print("QUIZ JSON ERROR:", str(error))
        print("RAW GEMINI QUIZ RESPONSE:", ai_response)

        raise ValueError(
            "Gemini did not return a valid quiz response."
        )


    # Validate quiz structure
    if not isinstance(quiz_data, dict):
        raise ValueError("Invalid quiz response format.")


    questions = quiz_data.get("questions")


    if not isinstance(questions, list) or len(questions) == 0:
        raise ValueError("Gemini did not generate quiz questions.")


    # Validate every question
    valid_questions = []


    for item in questions:

        if not isinstance(item, dict):
            continue


        question = item.get("question")

        options = item.get("options")

        correct_answer = item.get("correct_answer")

        explanation = item.get("explanation")

        difficulty = item.get("difficulty")


        if not question:
            continue


        if not isinstance(options, list):
            continue


        if len(options) != 4:
            continue


        if correct_answer not in options:
            continue


        if not explanation:
            continue


        if difficulty not in [
            "Easy",
            "Medium",
            "Difficult"
        ]:
            difficulty = "Medium"


        valid_questions.append({
            "question": question,
            "options": options,
            "correct_answer": correct_answer,
            "explanation": explanation,
            "difficulty": difficulty
        })


    if len(valid_questions) == 0:
        raise ValueError(
            "No valid quiz questions were generated."
        )


    return {
        "quiz_title": quiz_data.get(
            "quiz_title",
            "AI Generated Quiz"
        ),

        "total_questions": len(valid_questions),

        "questions": valid_questions
    }