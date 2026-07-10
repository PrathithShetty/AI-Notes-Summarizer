import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/Quiz.css";


function Quiz() {
    const navigate = useNavigate();

    const [quiz, setQuiz] = useState(null);

    const [currentQuestionIndex, setCurrentQuestionIndex] =
        useState(0);

    const [answers, setAnswers] = useState({});

    const [submitted, setSubmitted] =
        useState(false);

    const [score, setScore] =
        useState(0);


    useEffect(() => {

        const savedQuiz =
            sessionStorage.getItem("currentQuiz");


        if (!savedQuiz) {

            navigate("/dashboard", {
                replace: true,
            });

            return;
        }


        try {

            const parsedQuiz =
                JSON.parse(savedQuiz);


            if (
                !parsedQuiz ||
                !Array.isArray(parsedQuiz.questions) ||
                parsedQuiz.questions.length === 0
            ) {
                throw new Error(
                    "Invalid quiz data."
                );
            }


            setQuiz(parsedQuiz);


        } catch (error) {

            console.error(
                "QUIZ LOAD ERROR:",
                error
            );


            sessionStorage.removeItem(
                "currentQuiz"
            );


            navigate("/dashboard", {
                replace: true,
            });

        }

    }, [navigate]);



    if (!quiz) {

        return (

            <div className="quiz-loading-page">

                <div
                    className="spinner-border text-primary"
                    role="status"
                >

                    <span className="visually-hidden">
                        Loading...
                    </span>

                </div>


                <p>
                    Loading your quiz...
                </p>

            </div>

        );

    }



    const questions =
        quiz.questions;


    const totalQuestions =
        questions.length;


    const currentQuestion =
        questions[currentQuestionIndex];


    const answeredCount =
        Object.keys(answers).length;


    const remainingCount =
        totalQuestions - answeredCount;


    const progressPercentage =
        (
            (currentQuestionIndex + 1) /
            totalQuestions
        ) * 100;


    const answerProgressPercentage =
        totalQuestions > 0
            ? Math.round(
                (
                    answeredCount /
                    totalQuestions
                ) * 100
            )
            : 0;


    const resultPercentage =
        totalQuestions > 0
            ? Math.round(
                (
                    score /
                    totalQuestions
                ) * 100
            )
            : 0;



    const handleSelectAnswer = (option) => {

        if (submitted) {
            return;
        }


        setAnswers(
            (previousAnswers) => ({

                ...previousAnswers,

                [currentQuestionIndex]:
                    option,

            })
        );

    };



    const handlePrevious = () => {

        if (currentQuestionIndex > 0) {

            setCurrentQuestionIndex(
                (previousIndex) =>
                    previousIndex - 1
            );

        }

    };



    const handleNext = () => {

        if (
            currentQuestionIndex <
            totalQuestions - 1
        ) {

            setCurrentQuestionIndex(
                (previousIndex) =>
                    previousIndex + 1
            );

        }

    };



    const handleQuestionJump = (index) => {

        setCurrentQuestionIndex(index);


        window.scrollTo({

            top: 0,

            behavior: "smooth",

        });

    };



    const handleSubmitQuiz = () => {

        if (
            answeredCount <
            totalQuestions
        ) {

            const unansweredCount =
                totalQuestions -
                answeredCount;


            const shouldSubmit =
                window.confirm(

                    `You still have ${unansweredCount} unanswered question(s). Submit anyway?`

                );


            if (!shouldSubmit) {
                return;
            }

        }



        let calculatedScore = 0;


        questions.forEach(
            (question, index) => {

                if (
                    answers[index] ===
                    question.correct_answer
                ) {

                    calculatedScore += 1;

                }

            }
        );


        setScore(calculatedScore);

        setSubmitted(true);


        window.scrollTo({

            top: 0,

            behavior: "smooth",

        });

    };



    const handleRetakeQuiz = () => {

        setAnswers({});

        setScore(0);

        setSubmitted(false);

        setCurrentQuestionIndex(0);


        window.scrollTo({

            top: 0,

            behavior: "smooth",

        });

    };



    const handleBackToDashboard = () => {

        navigate("/dashboard");

    };



    const getDifficultyClass =
        (difficulty) => {

            const normalizedDifficulty =
                difficulty?.toLowerCase();


            if (
                normalizedDifficulty ===
                "easy"
            ) {

                return "quiz-difficulty-easy";

            }


            if (
                normalizedDifficulty ===
                "medium"
            ) {

                return "quiz-difficulty-medium";

            }


            if (
                normalizedDifficulty ===
                    "difficult" ||
                normalizedDifficulty ===
                    "hard"
            ) {

                return "quiz-difficulty-hard";

            }


            return "quiz-difficulty-default";

        };



    /*
    ================================
    RESULT / ANSWER REVIEW SCREEN
    ================================
    */


    if (submitted) {

        return (

            <div className="quiz-page">

                <main className="quiz-container">


                    <section className="quiz-result-card">


                        <div className="quiz-result-icon">
                            🎯
                        </div>


                        <p className="quiz-result-label">
                            QUIZ COMPLETED
                        </p>


                        <h1>
                            Your Result
                        </h1>


                        <div className="quiz-score-circle">


                            <span className="quiz-score-percentage">

                                {resultPercentage}%

                            </span>


                            <span className="quiz-score-text">

                                {score} / {totalQuestions}

                            </span>


                        </div>


                        <p className="quiz-result-message">

                            {

                                resultPercentage >= 80

                                    ? "Excellent work! You have a strong understanding of the material."

                                    : resultPercentage >= 60

                                        ? "Good work! Review the incorrect answers to strengthen your understanding."

                                        : "Keep practicing. Review the explanations below and try the quiz again."

                            }

                        </p>


                        <div className="quiz-result-actions">


                            <button

                                type="button"

                                className="btn btn-primary"

                                onClick={
                                    handleRetakeQuiz
                                }

                            >

                                🔄 Retake Quiz

                            </button>


                            <button

                                type="button"

                                className="btn btn-outline-secondary"

                                onClick={
                                    handleBackToDashboard
                                }

                            >

                                ← Back to Dashboard

                            </button>


                        </div>


                    </section>



                    <section className="quiz-review-section">


                        <div className="quiz-review-header">


                            <p className="quiz-review-label">
                                ANSWER REVIEW
                            </p>


                            <h2>
                                Review Your Answers
                            </h2>


                            <p>

                                Check every question,
                                the correct answer,
                                and the AI-generated
                                explanation.

                            </p>


                        </div>



                        <div className="quiz-review-list">


                            {

                                questions.map(

                                    (
                                        question,
                                        index
                                    ) => {


                                        const userAnswer =
                                            answers[index];


                                        const isCorrect =

                                            userAnswer ===
                                            question.correct_answer;



                                        return (

                                            <article

                                                className={

                                                    `quiz-review-card ${

                                                        isCorrect

                                                            ? "quiz-review-correct"

                                                            : "quiz-review-incorrect"

                                                    }`

                                                }

                                                key={index}

                                            >


                                                <div className="quiz-review-top">


                                                    <span className="quiz-review-number">

                                                        Question {index + 1}

                                                    </span>


                                                    <span

                                                        className={

                                                            `quiz-difficulty-badge ${getDifficultyClass(

                                                                question.difficulty

                                                            )}`

                                                        }

                                                    >

                                                        {

                                                            question.difficulty ||
                                                            "Medium"

                                                        }

                                                    </span>


                                                    <span

                                                        className={

                                                            isCorrect

                                                                ? "quiz-answer-status correct"

                                                                : "quiz-answer-status incorrect"

                                                        }

                                                    >

                                                        {

                                                            isCorrect

                                                                ? "✓ Correct"

                                                                : "✕ Incorrect"

                                                        }

                                                    </span>


                                                </div>



                                                <h3>

                                                    {
                                                        question.question
                                                    }

                                                </h3>



                                                <div className="quiz-review-answer">


                                                    <strong>
                                                        Your answer:
                                                    </strong>{" "}


                                                    {

                                                        userAnswer ||
                                                        "Not answered"

                                                    }


                                                </div>



                                                {

                                                    !isCorrect && (

                                                        <div className="quiz-review-correct-answer">


                                                            <strong>
                                                                Correct answer:
                                                            </strong>{" "}


                                                            {

                                                                question.correct_answer

                                                            }


                                                        </div>

                                                    )

                                                }



                                                <div className="quiz-explanation">


                                                    <strong>

                                                        💡 Explanation

                                                    </strong>


                                                    <p>

                                                        {

                                                            question.explanation ||
                                                            "No explanation available."

                                                        }

                                                    </p>


                                                </div>


                                            </article>

                                        );

                                    }

                                )

                            }


                        </div>


                    </section>


                </main>

            </div>

        );

    }



    /*
    ================================
    ACTIVE QUIZ SCREEN
    ================================
    */


    return (

        <div className="quiz-page">


            <main className="quiz-container">



                {/* QUIZ HEADER */}


                <header className="quiz-header">


                    <button

                        type="button"

                        className="quiz-back-button"

                        onClick={
                            handleBackToDashboard
                        }

                    >

                        ← Dashboard

                    </button>



                    <div>


                        <p className="quiz-header-label">

                            AI GENERATED QUIZ

                        </p>


                        <h1>

                            {

                                quiz.quiz_title ||
                                "AI Generated Quiz"

                            }

                        </h1>


                    </div>



                    <div className="quiz-answered-count">

                        {answeredCount} / {totalQuestions} answered

                    </div>


                </header>



                {/* PROGRESS BAR */}


                <section className="quiz-progress-section">


                    <div className="quiz-progress-info">


                        <span>

                            Question {

                                currentQuestionIndex + 1

                            } of {totalQuestions}

                        </span>


                        <span>

                            {

                                Math.round(
                                    progressPercentage
                                )

                            }%

                        </span>


                    </div>



                    <div className="quiz-progress-track">


                        <div

                            className="quiz-progress-fill"

                            style={{

                                width:
                                    `${progressPercentage}%`,

                            }}

                        />


                    </div>


                </section>



                {/* QUESTION NAVIGATOR */}


                <section className="quiz-question-navigator">


                    <div className="quiz-navigator-header">


                        <div>


                            <p className="quiz-navigator-label">

                                QUESTION NAVIGATOR

                            </p>


                            <h2>

                                Jump to a Question

                            </h2>


                        </div>



                        <div className="quiz-navigator-stats">


                            <span>

                                {totalQuestions} Questions

                            </span>


                            <span>

                                {answeredCount} Answered

                            </span>


                            <span>

                                {remainingCount} Remaining

                            </span>


                            <span>

                                {answerProgressPercentage}% Complete

                            </span>


                        </div>


                    </div>



                    <div className="quiz-question-grid">


                        {

                            questions.map(

                                (
                                    question,
                                    index
                                ) => {


                                    const isCurrent =

                                        currentQuestionIndex ===
                                        index;


                                    const isAnswered =

                                        Object.prototype.hasOwnProperty.call(

                                            answers,

                                            index

                                        );



                                    let questionClass =

                                        "quiz-question-jump";



                                    if (isAnswered) {

                                        questionClass +=
                                            " answered";

                                    }



                                    if (isCurrent) {

                                        questionClass +=
                                            " current";

                                    }



                                    return (

                                        <button

                                            type="button"

                                            key={index}

                                            className={
                                                questionClass
                                            }

                                            onClick={() =>
                                                handleQuestionJump(
                                                    index
                                                )
                                            }

                                            aria-current={
                                                isCurrent
                                                    ? "step"
                                                    : undefined
                                            }

                                            aria-label={

                                                `Go to question ${index + 1}, ${

                                                    isCurrent

                                                        ? "current question, "

                                                        : ""

                                                }${

                                                    isAnswered

                                                        ? "answered"

                                                        : "unanswered"

                                                }`

                                            }

                                        >

                                            {index + 1}

                                        </button>

                                    );

                                }

                            )

                        }


                    </div>



                    <div className="quiz-navigator-legend">


                        <span>

                            <i className="quiz-legend-dot current" />

                            Current

                        </span>


                        <span>

                            <i className="quiz-legend-dot answered" />

                            Answered

                        </span>


                        <span>

                            <i className="quiz-legend-dot unanswered" />

                            Unanswered

                        </span>


                    </div>


                </section>



                {/* CURRENT QUESTION */}


                <section className="quiz-question-card">


                    <div className="quiz-question-top">


                        <span className="quiz-question-number">

                            Question {

                                currentQuestionIndex + 1

                            }

                        </span>



                        <span

                            className={

                                `quiz-difficulty-badge ${getDifficultyClass(

                                    currentQuestion.difficulty

                                )}`

                            }

                        >

                            {

                                currentQuestion.difficulty ||
                                "Medium"

                            }

                        </span>


                    </div>



                    <h2 className="quiz-question-text">

                        {currentQuestion.question}

                    </h2>



                    <div className="quiz-options">


                        {

                            Array.isArray(
                                currentQuestion.options
                            ) &&

                            currentQuestion.options.map(

                                (
                                    option,
                                    optionIndex
                                ) => {


                                    const isSelected =

                                        answers[
                                            currentQuestionIndex
                                        ] === option;



                                    return (

                                        <button

                                            type="button"

                                            className={

                                                `quiz-option ${

                                                    isSelected

                                                        ? "selected"

                                                        : ""

                                                }`

                                            }

                                            key={optionIndex}

                                            onClick={() =>
                                                handleSelectAnswer(
                                                    option
                                                )
                                            }

                                        >


                                            <span className="quiz-option-letter">

                                                {

                                                    String.fromCharCode(

                                                        65 +
                                                        optionIndex

                                                    )

                                                }

                                            </span>



                                            <span className="quiz-option-text">

                                                {option}

                                            </span>



                                            <span className="quiz-option-selector">

                                                {

                                                    isSelected

                                                        ? "✓"

                                                        : ""

                                                }

                                            </span>


                                        </button>

                                    );

                                }

                            )

                        }


                    </div>


                </section>



                {/* PREVIOUS / NEXT / SUBMIT */}


                <section className="quiz-navigation">


                    <button

                        type="button"

                        className="btn btn-outline-secondary"

                        onClick={
                            handlePrevious
                        }

                        disabled={
                            currentQuestionIndex === 0
                        }

                    >

                        ← Previous

                    </button>



                    <div className="quiz-navigation-status">

                        {answeredCount} of {totalQuestions} questions answered

                    </div>



                    {

                        currentQuestionIndex <
                        totalQuestions - 1

                            ? (

                                <button

                                    type="button"

                                    className="btn btn-primary"

                                    onClick={
                                        handleNext
                                    }

                                >

                                    Next →

                                </button>

                            )

                            : (

                                <button

                                    type="button"

                                    className="btn btn-success"

                                    onClick={
                                        handleSubmitQuiz
                                    }

                                >

                                    ✓ Submit Quiz

                                </button>

                            )

                    }


                </section>


            </main>


        </div>

    );

}


export default Quiz;