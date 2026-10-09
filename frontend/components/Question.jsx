
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Question.css";

const BASE_URL = "https://peerlearn-4.onrender.com";
const PROFILE_URL = `${BASE_URL}/auth/profile/`;
const API_URL = `${BASE_URL}/auth/skill-quiz/`;
const SUBMIT_URL = `${BASE_URL}/auth/skill-quiz/submit/`;

function authConfig() {
    const token = localStorage.getItem("accessToken");

    return {
        headers: {
            ...(token
                ? { Authorization: `Bearer ${token}` }
                : {}),
            "Content-Type": "application/json",
        },
    };
}

function Question() {
    const navigate = useNavigate();

    const [started, setStarted] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState(null);

    async function startTest() {
        setLoading(true);
        setError("");

        try {
            // Get the logged-in user's profile and skills.
            const profileResponse = await axios.get(
                PROFILE_URL,
                authConfig()
            );

            const profile = profileResponse.data;

            // Assumes the profile API returns { skills: [...] }.
            const userSkills = profile.skills;

            if (!Array.isArray(userSkills) || userSkills.length === 0) {
                setError(
                    "No skills found in your profile. Please add your skills first."
                );
                return;
            }

            // Generate a quiz. The backend stores its answer key in cache.
            const response = await axios.post(
                API_URL,
                { skills: userSkills },
                authConfig()
            );

            const generatedQuestions = response.data.questions;

            if (
                !Array.isArray(generatedQuestions) ||
                generatedQuestions.length === 0
            ) {
                throw new Error(
                    "No questions were returned. Please try again."
                );
            }

            setQuestions(generatedQuestions);
            setAnswers({});
            setCurrentQuestion(0);
            setResult(null);
            setStarted(true);
        } catch (err) {
            console.error(
                "Quiz generation error:",
                err.response?.data || err.message
            );

            setError(
                err.response?.data?.message ||
                err.message ||
                "Could not generate the quiz. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    function handleAnswer(option) {
        setAnswers((previous) => ({
            ...previous,
            [currentQuestion]: option,
        }));

        setError("");
    }

    function previousQuestion() {
        if (currentQuestion > 0) {
            setCurrentQuestion((previous) => previous - 1);
            setError("");
        }
    }

    function nextQuestion() {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion((previous) => previous + 1);
            setError("");
        }
    }

    async function handleSubmit() {
        if (Object.keys(answers).length !== questions.length) {
            setError("Please answer all questions before finishing.");
            return;
        }

        setSubmitting(true);
        setError("");

        try {
            // The backend expects question IDs as keys, not array indexes.
            const submittedAnswers = {};

            questions.forEach((question, index) => {
                submittedAnswers[String(question.id)] = answers[index];
            });

            const response = await axios.post(
                SUBMIT_URL,
                { answers: submittedAnswers },
                authConfig()
            );

            const data = response.data;

            setResult({
                totalQuestions: data.totalQuestions,
                totalCorrect: data.totalCorrect,
                overallPercentage: data.overallPercentage,
                skillResults: data.skillResults,
            });
        } catch (err) {
            console.error("Submit status:", err.response?.status);
            console.error("Submit response:", err.response?.data);

            setError(
                err.response?.data?.message ||
                "Your result could not be saved. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    }

    // Intro screen
    if (!started && !result) {
        return (
            <main className="question-page">
                <section className="question-card intro-card">
                    <div className="quiz-icon">✦</div>

                    <p className="quiz-eyebrow">
                        PEERLEARN SKILL ASSESSMENT
                    </p>

                    <h1>Discover your skill level</h1>

                    <div className="quiz-intro-content">
                        <p>
                            Answer 10 multiple-choice questions based on
                            the technical skills in your profile.
                        </p>

                        <p>
                            Each answer helps assess your understanding
                            of your selected technical skills.
                        </p>

                        <p>
                            Your results will be calculated by the backend.
                        </p>
                    </div>

                    <div className="quiz-info">
                        <span>📝 10 Questions</span>
                        <span>🎯 One correct answer each</span>
                        <span>📊 Skill-wise results</span>
                    </div>

                    {error && (
                        <p className="quiz-error">{error}</p>
                    )}

                    <button
                        className="take-test-btn"
                        onClick={startTest}
                        disabled={loading}
                    >
                        {loading ? "Generating your test..." : "Take Test →"}
                    </button>

                    <button
                        className="quiz-back-btn"
                        onClick={() => navigate("/profile")}
                    >
                        Back to Profile
                    </button>
                </section>
            </main>
        );
    }

    // Results screen
    if (result) {
        return (
            <main className="question-page">
                <section className="question-card result-card">
                    <div className="quiz-icon">🏆</div>

                    <p className="quiz-eyebrow">
                        ASSESSMENT COMPLETED
                    </p>

                    <h1>Your results</h1>

                    <div className="overall-score">
                        <strong>{result.overallPercentage}%</strong>
                        <span>
                            {result.totalCorrect} out of{" "}
                            {result.totalQuestions} correct
                        </span>
                    </div>

                    <h2>Assessed skills</h2>

                    <div className="skill-results">
                        {result.skillResults.map((item) => (
                            <div
                                className="skill-result"
                                key={item.skill}
                            >
                                <div className="skill-result-heading">
                                    <span>{item.skill}</span>
                                    <strong>{item.percentage}%</strong>
                                </div>

                                <div className="skill-progress-track">
                                    <div
                                        className="skill-progress-fill"
                                        style={{
                                            width: `${item.percentage}%`,
                                        }}
                                    />
                                </div>

                                <small>
                                    {item.correct} of {item.total} correct
                                </small>
                            </div>
                        ))}
                    </div>

                    <p className="quiz-note">
                        Only skills assessed by this test receive a score.
                    </p>

                    <button
                        className="take-test-btn"
                        onClick={() => navigate("/profile")}
                    >
                        View My Profile →
                    </button>
                </section>
            </main>
        );
    }

    const question = questions[currentQuestion];

    if (!question) {
        return (
            <main className="question-page">
                <section className="question-card">
                    <p className="quiz-error">
                        Question data is unavailable. Please start a new quiz.
                    </p>

                    <button
                        className="take-test-btn"
                        onClick={() => {
                            setStarted(false);
                            setQuestions([]);
                            setAnswers({});
                            setCurrentQuestion(0);
                            setError("");
                        }}
                    >
                        Start Again
                    </button>
                </section>
            </main>
        );
    }

    // Question screen
    return (
        <main className="question-page">
            <section className="question-card">
                <div className="question-header">
                    <span>
                        Question {currentQuestion + 1} of {questions.length}
                    </span>

                    <span className="question-skill">
                        {question.skill}
                    </span>
                </div>

                <div className="progress-bar">
                    <div
                        className="progress"
                        style={{
                            width: `${
                                ((currentQuestion + 1) / questions.length) *
                                100
                            }%`,
                        }}
                    />
                </div>

                <h1 className="question-title">
                    {question.question}
                </h1>

                <div className="options">
                    {question.options.map((option, index) => (
                        <button
                            type="button"
                            key={`${question.id}-${index}`}
                            className={
                                answers[currentQuestion] === option
                                    ? "option selected"
                                    : "option"
                            }
                            onClick={() => handleAnswer(option)}
                            disabled={submitting}
                        >
                            <span className="option-letter">
                                {String.fromCharCode(65 + index)}
                            </span>

                            <span>{option}</span>
                        </button>
                    ))}
                </div>

                {error && (
                    <p className="quiz-error">{error}</p>
                )}

                <div className="question-navigation">
                    <button
                        className="previous-btn"
                        onClick={previousQuestion}
                        disabled={currentQuestion === 0 || submitting}
                    >
                        ← Previous
                    </button>

                    {currentQuestion === questions.length - 1 ? (
                        <button
                            className="next-btn"
                            onClick={handleSubmit}
                            disabled={
                                !answers[currentQuestion] || submitting
                            }
                        >
                            {submitting ? "Saving..." : "Finish ✓"}
                        </button>
                    ) : (
                        <button
                            className="next-btn"
                            onClick={nextQuestion}
                            disabled={
                                !answers[currentQuestion] || submitting
                            }
                        >
                            Next →
                        </button>
                    )}
                </div>
            </section>
        </main>
    );
}

export default Question;
