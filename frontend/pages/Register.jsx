import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "./Login.css";


function Register() {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [check, setCheck] = useState("");

    const [otp, setOtp] = useState("");
    const [showOTP, setShowOTP] = useState(false);

    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);

    const navigate = useNavigate();


    // ==========================================
    // CREATE ACCOUNT
    // ==========================================

    async function Submit(e) {

        e.preventDefault();

        // Check fields
        if (!username || !email || !password || !check) {
            alert("Please fill all the fields.");
            return;
        }

        // Check passwords
        if (password !== check) {
            alert("Passwords do not match.");
            return;
        }

        try {

            setLoading(true);

            const response = await axios.post(
                "http://localhost:8000/auth/register/",
                {
                    username: username,
                    email: email,
                    password: password
                },
                {
                    withCredentials: true
                }
            );

            console.log("REGISTER RESPONSE:", response.data);

            alert(response.data.message);

            // Show OTP section
            setShowOTP(true);

        } catch (error) {

            console.log("REGISTER ERROR:", error);

            if (error.response) {

                alert(
                    error.response.data.message ||
                    "Registration failed."
                );

            } else {

                alert("Server is not reachable.");

            }

        } finally {

            setLoading(false);

        }
    }


    // ==========================================
    // VERIFY OTP
    // ==========================================

    async function verifyOTP(e) {

        e.preventDefault();

        if (!otp || otp.length !== 6) {

            alert("Please enter a 6-digit OTP.");
            return;

        }

        try {

            setLoading(true);

            const response = await axios.post(
                "http://localhost:8000/auth/verify-otp/",
                {
                    otp: otp
                },
                {
                    withCredentials: true
                }
            );

            console.log("OTP RESPONSE:", response.data);

            // ==================================
            // SAVE JWT TOKENS
            // ==================================

            localStorage.setItem(
                "accessToken",
                response.data.access
            );

            localStorage.setItem(
                "refreshToken",
                response.data.refresh
            );
            localStorage.removeItem("profileCompleted")

            // Tell App.jsx authentication changed
            window.dispatchEvent(
                new Event("authChanged")
            );

            alert("Registration successful!");

            // ==================================
            // GO TO PROFILE FORM
            // ==================================

            navigate("/auth/student/form", {
                replace: true
            });

        } catch (error) {

            console.log("OTP ERROR:", error);

            if (error.response) {

                alert(
                    error.response.data.message ||
                    "Invalid OTP."
                );

            } else {

                alert("Server is not reachable.");

            }

        } finally {

            setLoading(false);

        }
    }


    // ==========================================
    // RESEND OTP
    // ==========================================

    async function resendOTP() {

        try {

            setResending(true);

            const response = await axios.post(
                "http://localhost:8000/auth/resend-otp/",
                {},
                {
                    withCredentials: true
                }
            );

            console.log("RESEND RESPONSE:", response.data);

            alert(response.data.message);

            // Clear old OTP
            setOtp("");


        } catch (error) {

            console.log("RESEND ERROR:", error);

            if (error.response) {

                alert(
                    error.response.data.message ||
                    "Could not resend OTP."
                );

            } else {

                alert("Server is not reachable.");

            }

        } finally {

            setResending(false);

        }
    }


    return (

        <div className="auth-page">

            {/* ================================= */}
            {/* LEFT SIDE */}
            {/* ================================= */}

            <div className="auth-left">

                <div className="auth-brand">

                    <div className="brand-icon">
                        P
                    </div>

                    <span>
                        Peer-to-Peer Learning Platform
                    </span>

                </div>


                <div className="auth-content">

                    <h1>
                        Start your<br />
                        <span>learning journey.</span>
                    </h1>

                    <p>
                        Create your account and connect
                        with people who are learning,
                        teaching, and growing together.
                    </p>

                </div>

            </div>


            {/* ================================= */}
            {/* RIGHT SIDE */}
            {/* ================================= */}

            <div className="auth-right">

                <div className="auth-card">

                    <div className="auth-header">

                        <h2>
                            {showOTP
                                ? "Verify your email"
                                : "Create your account"
                            }
                        </h2>

                        <p>
                            {showOTP
                                ? "Enter the OTP sent to your email."
                                : "Join PeerLearn and start learning together."
                            }
                        </p>

                    </div>


                    {/* ================================= */}
                    {/* REGISTRATION FORM */}
                    {/* ================================= */}

                    {!showOTP ? (

                        <form onSubmit={Submit}>

                            <div className="input-group">

                                <label>
                                    Username
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                />

                            </div>


                            <div className="input-group">

                                <label>
                                    Email
                                </label>

                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                />

                            </div>


                            <div className="input-group">

                                <label>
                                    Password
                                </label>

                                <input
                                    type="password"
                                    placeholder="Create a password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />

                            </div>


                            <div className="input-group">

                                <label>
                                    Confirm Password
                                </label>

                                <input
                                    type="password"
                                    placeholder="Confirm your password"
                                    value={check}
                                    onChange={(e) =>
                                        setCheck(e.target.value)
                                    }
                                />

                            </div>


                            <button
                                className="auth-button"
                                type="submit"
                                disabled={loading}
                            >

                                {loading
                                    ? "Sending OTP..."
                                    : "Create Account"
                                }

                            </button>

                        </form>

                    ) : (

                        /* ================================= */
                        /* OTP FORM */
                        /* ================================= */

                        <form onSubmit={verifyOTP}>

                            <div className="input-group">

                                <label>
                                    Enter OTP
                                </label>

                                <input
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="Enter 6-digit OTP"
                                    value={otp}
                                    maxLength={6}
                                    onChange={(e) => {

                                        const value =
                                            e.target.value.replace(
                                                /\D/g,
                                                ""
                                            );

                                        setOtp(value);

                                    }}
                                />

                            </div>


                            <p style={{ marginBottom: "15px" }}>

                                OTP sent to:

                                <br />

                                <strong>
                                    {email}
                                </strong>

                            </p>


                            <button
                                className="auth-button"
                                type="submit"
                                disabled={loading}
                            >

                                {loading
                                    ? "Verifying..."
                                    : "Verify Email"
                                }

                            </button>


                            <button
                                type="button"
                                className="auth-button"
                                onClick={resendOTP}
                                disabled={resending}
                                style={{
                                    marginTop: "10px"
                                }}
                            >

                                {resending
                                    ? "Sending..."
                                    : "Resend OTP"
                                }

                            </button>

                        </form>

                    )}


                    {/* ================================= */}
                    {/* LOGIN LINK */}
                    {/* ================================= */}

                    <div className="auth-divider">
                        <span>or</span>
                    </div>


                    <div className="switch-auth">

                        Already have an account?

                        <Link to="/login">
                            {" "}Login
                        </Link>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Register;