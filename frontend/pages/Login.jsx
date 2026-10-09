import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "./Login.css";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();


    async function Submit(e) {

        e.preventDefault();

        if (!email || !password) {
            alert("Please enter email and password.");
            return;
        }

        try {

            setLoading(true);

            const response = await axios.post(
                "http://127.0.0.1:8000/auth/login/",
                {
                    email: email,
                    password: password
                }
            );

            console.log(
                "LOGIN RESPONSE:",
                response.data
            );


            // Save JWT tokens
            localStorage.setItem(
                "accessToken",
                response.data.access
            );

            localStorage.setItem(
                "refreshToken",
                response.data.refresh
            );


            alert(response.data.message);


            // Clear form
            setEmail("");
            setPassword("");


            /*
             * Tell App.jsx that the authentication
             * state has changed.
             */
            window.dispatchEvent(
                new Event("authChanged")
            );


            // Smoothly go to Home
            navigate("/", {
                replace: true
            });


        } catch (error) {

            console.log(
                "LOGIN ERROR:",
                error
            );


            if (error.response) {

                alert(
                    error.response.data.message ||
                    "Login failed."
                );

            } else {

                alert(
                    "Server is not reachable."
                );

            }

        } finally {

            setLoading(false);
        }
    }


    return (

        <div className="auth-page">

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
                        Learn together.<br />
                        <span>Grow together.</span>
                    </h1>

                    <p>
                        Connect with learners, share knowledge,
                        solve doubts, and grow your skills together.
                    </p>

                </div>

            </div>


            <div className="auth-right">

                <div className="auth-card">

                    <div className="auth-header">

                        <h2>
                            Welcome back
                        </h2>

                        <p>
                            Login to continue your learning journey.
                        </p>

                    </div>


                    <form onSubmit={Submit}>

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
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                            />

                        </div>


                        <div className="forgot-password">

                            <Link to="/forgot-password">
                                Forgot password?
                            </Link>

                        </div>


                        <button
                            className="auth-button"
                            type="submit"
                            disabled={loading}
                        >

                            {loading
                                ? "Logging in..."
                                : "Login"
                            }

                        </button>

                    </form>


                    <div className="auth-divider">
                        <span>or</span>
                    </div>


                    <div className="switch-auth">

                        Don't have an account?

                        <Link to="/register">
                            {" "}Register
                        </Link>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;