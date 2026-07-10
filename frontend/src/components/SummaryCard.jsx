import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { generateQuiz } from "../services/quizService";

import "../styles/SummaryCard.css";


function SummaryCard({ notes, noteId }) {

    const navigate = useNavigate();

    const [quizLoading, setQuizLoading] = useState(false);
    const [quizError, setQuizError] = useState("");

    if (!notes) {
        return null;
    }


    const summary =
        typeof notes.summary === "string"
            ? notes.summary
            : "No summary available.";


    const importantPoints =
        Array.isArray(notes.important_points)
            ? notes.important_points
            : [];


    const examQuestions =
        Array.isArray(notes.exam_questions)
            ? notes.exam_questions
            : [];


    const quickRevision =
        Array.isArray(notes.quick_revision)
            ? notes.quick_revision
            : [];


    const mnemonics =
        Array.isArray(notes.mnemonics)
            ? notes.mnemonics
            : [];


    const getDifficultyClass = (type) => {

        const difficulty = type?.toLowerCase();

        if (difficulty === "easy") {
            return "difficulty-easy";
        }

        if (difficulty === "medium") {
            return "difficulty-medium";
        }

        if (
            difficulty === "difficult" ||
            difficulty === "hard"
        ) {
            return "difficulty-hard";
        }

        return "difficulty-default";
    };


    const handleTakeQuiz = async () => {

        if (quizLoading) {
            return;
        }


        if (!noteId) {
            setQuizError(
                "Unable to start quiz because the note ID is missing."
            );

            return;
        }


        try {

            setQuizLoading(true);
            setQuizError("");


            const response = await generateQuiz(noteId);


            if (
                !response.quiz ||
                !Array.isArray(response.quiz.questions) ||
                response.quiz.questions.length === 0
            ) {
                throw new Error(
                    "The server did not return quiz questions."
                );
            }


            console.log(
                "GENERATED QUIZ:",
                response.quiz
            );


            // Save quiz so Quiz.jsx can load it
            sessionStorage.setItem(
                "currentQuiz",
                JSON.stringify(response.quiz)
            );


            // Save associated Note ID
            sessionStorage.setItem(
                "currentQuizNoteId",
                String(noteId)
            );


            // Open quiz page
            navigate("/quiz");


        } catch (error) {

            console.error(
                "QUIZ GENERATION ERROR:",
                error
            );


            setQuizError(
                error.response?.data?.message ||
                error.message ||
                "Unable to generate quiz. Please try again."
            );


        } finally {

            setQuizLoading(false);

        }

    };


    return (

        <article className="study-notes">


            {/* AI Notes Header */}

            <header className="study-notes-header">

                <span className="study-notes-label">
                    AI GENERATED STUDY MATERIAL
                </span>

                <h2 className="study-notes-title">
                    🤖 AI Study Notes
                </h2>

                <p className="study-notes-description">
                    Your document has been transformed into structured
                    notes for understanding, revision, and exam preparation.
                </p>

            </header>



            {/* Quiz Action */}

            <section className="notes-block">

                <div className="notes-section-heading">

                    <span className="notes-section-icon">
                        🧠
                    </span>

                    <div>

                        <h3>
                            Test Your Knowledge
                        </h3>

                        <p>
                            Generate a comprehensive AI quiz from this PDF.
                        </p>

                    </div>

                </div>


                <button
                    type="button"
                    className="btn btn-primary btn-lg"
                    onClick={handleTakeQuiz}
                    disabled={quizLoading || !noteId}
                >

                    {
                        quizLoading
                            ? "Generating Quiz..."
                            : "🧠 Take Quiz"
                    }

                </button>


                {quizLoading && (

                    <div
                        className="ai-loading-panel mt-4"
                        aria-live="polite"
                    >

                        <div
                            className="spinner-border text-primary ai-loading-spinner"
                            role="status"
                        >

                            <span className="visually-hidden">
                                Loading...
                            </span>

                        </div>


                        <div>

                            <h4 className="ai-loading-title">
                                🧠 Creating Your Quiz
                            </h4>

                            <p className="ai-loading-message">
                                AI is reading your PDF again and generating
                                questions from the study material.
                            </p>

                            <p className="ai-loading-helper">
                                This may take a few moments.
                            </p>

                        </div>

                    </div>

                )}


                {quizError && (

                    <div
                        className="alert alert-danger mt-3 mb-0"
                        role="alert"
                    >

                        <strong>
                            Quiz generation failed.
                        </strong>{" "}

                        {quizError}

                    </div>

                )}

            </section>



            {/* Summary */}

            <section className="notes-block">

                <div className="notes-section-heading">

                    <span className="notes-section-icon">
                        📝
                    </span>

                    <div>

                        <h3>
                            Summary
                        </h3>

                        <p>
                            A beginner-friendly explanation of the study material.
                        </p>

                    </div>

                </div>


                <div className="summary-content">
                    {summary}
                </div>

            </section>



            {/* Important Points */}

            <section className="notes-block">

                <div className="notes-section-heading">

                    <span className="notes-section-icon">
                        ⭐
                    </span>

                    <div>

                        <h3>
                            Important Points
                        </h3>

                        <p>
                            The most useful concepts to remember.
                        </p>

                    </div>

                </div>


                {importantPoints.length > 0 ? (

                    <div className="important-points-grid">

                        {importantPoints.map((point, index) => (

                            <div
                                className="important-point-item"
                                key={index}
                            >

                                <span className="point-number">
                                    {index + 1}
                                </span>

                                <p>
                                    {point}
                                </p>

                            </div>

                        ))}

                    </div>

                ) : (

                    <p className="notes-empty-message">
                        No important points generated.
                    </p>

                )}

            </section>



            {/* Exam Questions */}

            <section className="notes-block">

                <div className="notes-section-heading">

                    <span className="notes-section-icon">
                        ❓
                    </span>

                    <div>

                        <h3>
                            Exam Questions
                        </h3>

                        <p>
                            Practice questions organized by difficulty.
                        </p>

                    </div>

                </div>


                {examQuestions.length > 0 ? (

                    <div className="exam-question-list">

                        {examQuestions.map((item, index) => {

                            const isString =
                                typeof item === "string";


                            const question =
                                isString
                                    ? item
                                    : item?.question;


                            const type =
                                isString
                                    ? "Question"
                                    : item?.type;


                            return (

                                <div
                                    className="exam-question-item"
                                    key={index}
                                >

                                    <div className="exam-question-top">

                                        <span className="question-number">
                                            Question {index + 1}
                                        </span>


                                        <span
                                            className={
                                                `difficulty-badge ${getDifficultyClass(type)}`
                                            }
                                        >

                                            {type || "Question"}

                                        </span>

                                    </div>


                                    <p>
                                        {
                                            question ||
                                            "Question unavailable."
                                        }
                                    </p>

                                </div>

                            );

                        })}

                    </div>

                ) : (

                    <p className="notes-empty-message">
                        No exam questions generated.
                    </p>

                )}

            </section>



            {/* Quick Revision */}

            <section className="notes-block">

                <div className="notes-section-heading">

                    <span className="notes-section-icon">
                        ⚡
                    </span>

                    <div>

                        <h3>
                            Quick Revision
                        </h3>

                        <p>
                            Short notes for last-minute revision.
                        </p>

                    </div>

                </div>


                {quickRevision.length > 0 ? (

                    <div className="revision-grid">

                        {quickRevision.map((item, index) => (

                            <div
                                className="revision-item"
                                key={index}
                            >

                                <span>
                                    ✓
                                </span>

                                <p>
                                    {item}
                                </p>

                            </div>

                        ))}

                    </div>

                ) : (

                    <p className="notes-empty-message">
                        No quick revision notes generated.
                    </p>

                )}

            </section>



            {/* Memory Tricks */}

            {mnemonics.length > 0 && (

                <section className="notes-block memory-block">

                    <div className="notes-section-heading">

                        <span className="notes-section-icon">
                            🧠
                        </span>

                        <div>

                            <h3>
                                Memory Tricks
                            </h3>

                            <p>
                                Simple techniques to help you remember key concepts.
                            </p>

                        </div>

                    </div>


                    <div className="memory-list">

                        {mnemonics.map((item, index) => (

                            <div
                                className="memory-item"
                                key={index}
                            >

                                <span className="memory-number">
                                    {index + 1}
                                </span>

                                <p>
                                    {item}
                                </p>

                            </div>

                        ))}

                    </div>

                </section>

            )}


        </article>

    );
}


export default SummaryCard;