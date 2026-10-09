import { Route, Routes, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import Profile from "../pages/Profile.jsx";
import Home from "../pages/Home.jsx";
import Chat from "../pages/Chats.jsx";
import Agent from "../pages/Agent.jsx";
import AgoraCall from "../pages/AgoraCall.jsx";

import Form from "../components/Form.jsx";
import Question from "../components/Question.jsx";


function App() {

    const [checking, setChecking] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [profileCompleted, setProfileCompleted] = useState(
        localStorage.getItem("profileCompleted") === "true"
    );


    // ==========================================
    // CHECK LOGIN
    // ==========================================

    async function checkAuthentication() {

        const refreshToken =
            localStorage.getItem("refreshToken");

        // No refresh token
        if (!refreshToken) {

            setIsAuthenticated(false);
            setChecking(false);

            return;
        }

        try {

            const response = await axios.post(
                "http://localhost:8000/refresh/",
                {
                    refresh: refreshToken
                }
            );

            // Save new access token
            localStorage.setItem(
                "accessToken",
                response.data.access
            );

            setIsAuthenticated(true);

        } catch (error) {

            console.log(
                "AUTH CHECK ERROR:",
                error
            );

            localStorage.removeItem(
                "accessToken"
            );

            localStorage.removeItem(
                "refreshToken"
            );

            setIsAuthenticated(false);

        } finally {

            setChecking(false);

        }
    }


    // ==========================================
    // AUTH CHANGED
    // ==========================================

    useEffect(() => {

        // Check when application starts
        checkAuthentication();


        // This runs after login/register
        function handleAuthChanged() {

            const refreshToken =
                localStorage.getItem("refreshToken");

            if (refreshToken) {

                setIsAuthenticated(true);

            } else {

                setIsAuthenticated(false);

            }
        }


        window.addEventListener(
            "authChanged",
            handleAuthChanged
        );


        // Cleanup
        return () => {

            window.removeEventListener(
                "authChanged",
                handleAuthChanged
            );

        };

    }, []);


    // ==========================================
    // LOADING
    // ==========================================

    if (checking) {

        return (
            <div>
                Loading...
            </div>
        );

    }


    // ==========================================
    // ROUTES
    // ==========================================

    return (

        <Routes>

            {/* ============================= */}
            {/* LOGIN */}
            {/* ============================= */}

            <Route
                path="/login"
                element={
                    isAuthenticated
                        ? <Navigate to="/" replace />
                        : <Login />
                }
            />


            {/* ============================= */}
            {/* REGISTER */}
            {/* ============================= */}

            <Route
                path="/register"
                element={
                    isAuthenticated
                        ? <Navigate to="/" replace />
                        : <Register />
                }
            />


            {/* ============================= */}
            {/* HOME */}
            {/* ============================= */}

            
            <Route
                path="/"
                element={
                    !isAuthenticated ? (
                        <Navigate to="/login" replace />
                    ) : !profileCompleted ? (
                        <Navigate to="/auth/student/form" replace />
                    ) : (
                        <Home />
                    )
                }
            />

            <Route
                path="/chat"
                element={
                    !isAuthenticated ? (
                        <Navigate to="/login" replace />
                    ) : !profileCompleted ? (
                        <Navigate to="/auth/student/form" replace />
                    ) : (
                        <Chat />
                    )
                }
            />

            <Route
                path="/agent"
                element={
                    !isAuthenticated ? (
                        <Navigate to="/login" replace />
                    ) : !profileCompleted ? (
                        <Navigate to="/auth/student/form" replace />
                    ) : (
                        <Agent />
                    )
                }
            />

            <Route
                path="/call"
                element={
                    !isAuthenticated ? (
                        <Navigate to="/login" replace />
                    ) : !profileCompleted ? (
                        <Navigate to="/auth/student/form" replace />
                    ) : (
                        <AgoraCall />
                    )
                }
            />
            <Route
                path="/profile"
                element={
                    !isAuthenticated ? (
                        <Navigate to="/login" replace />
                    ) : !profileCompleted ? (
                        <Navigate to="/auth/student/form" replace />
                    ) : (
                        <Profile />
                    )
                }
            />



            {/* ============================= */}
            {/* STUDENT FORM */}
            {/* ============================= */}

           {/* STUDENT FORM */}
            <Route
                path="/auth/student/form"
                element={
                    isAuthenticated ? (
                        profileCompleted ? (
                            <Navigate to="/student/form/questions" replace />
                        ) : (
                            <Form
                                onProfileComplete={() => {
                                    localStorage.setItem(
                                        "profileCompleted",
                                        "true"
                                    );
                                    setProfileCompleted(true);
                                }}
                            />
                        )
                    ) : (
                        <Navigate to="/login" replace />
                    )
                }
            />

            {/* QUESTIONS */}
            <Route
                path="/student/form/questions"
                element={
                    isAuthenticated ? (
                        profileCompleted ? (
                            <Question />
                        ) : (
                            <Navigate to="/auth/student/form" replace />
                        )
                    ) : (
                        <Navigate to="/login" replace />
                    )
                }
            />


            {/* ============================= */}
            {/* UNKNOWN URL */}
            {/* ============================= */}

            <Route
                path="*"
                element={
                    <Navigate
                        to={
                            isAuthenticated
                                ? "/"
                                : "/login"
                        }
                        replace
                    />
                }
            />

        </Routes>

    );
}

export default App;