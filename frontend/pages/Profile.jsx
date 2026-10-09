
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Profile.css";

const API_URL = "http://127.0.0.1:8000/auth/profile/";

const AVAILABLE_SKILLS = [
    "C", "C++", "Java", "Python", "JavaScript",
    "HTML", "CSS", "React", "Node.js", "Django",
    "Machine Learning", "Deep Learning",
    "Artificial Intelligence", "Data Science",
    "SQL", "MongoDB", "Authentication", "REST API",
    "Git", "GitHub", "Data Structures", "Algorithms",
    "DBMS", "Operating Systems", "Computer Networks",
    "Cybersecurity", "Cloud Computing", "Docker",
    "Flask", "Express.js",
];

function Profile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [skillScores, setSkillScores] = useState([]);

    const [formData, setFormData] = useState({
        year: "",
        branch: "",
        college: "",
        gender: "",
        skills: [],
    });

    const authConfig = () => ({
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    });
    
  
  
    async function fetchSkillScores() {
        try {
            const response = await axios.get(
                "http://127.0.0.1:8000/auth/skill-scores/",
                authConfig()
            );

            setSkillScores(response.data.skills || []);
        } catch (error) {
            console.error(
                "Could not load skill scores:",
                error.response?.data || error
            );
        }
    }


    async function fetchProfile() {
        setLoading(true);
        setError("");

        try {
            const response = await axios.get(API_URL, authConfig());
            const data = response.data;

            setProfile(data);
            setFormData({
                year: String(data.year),
                branch: data.branch,
                college: data.college,
                gender: data.gender,
                skills: data.skills || [],
            });
        } catch (err) {
            console.error(err.response?.data || err);
            setError(
                err.response?.status === 404
                    ? "Your profile has not been created yet."
                    : "Unable to load your profile."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProfile();
        fetchSkillScores();
    }, []);

    function handleChange(e) {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function addSkill(e) {
        const skill = e.target.value;

        if (skill && !formData.skills.includes(skill)) {
            setFormData((prev) => ({
                ...prev,
                skills: [...prev.skills, skill],
            }));
        }
    }

    function removeSkill(skill) {
        setFormData((prev) => ({
            ...prev,
            skills: prev.skills.filter((item) => item !== skill),
        }));
    }

    async function saveProfile(e) {
        e.preventDefault();
        setSaving(true);

        try {
            await axios.patch(
                API_URL,
                {
                    year: Number(formData.year),
                    branch: formData.branch,
                    college: formData.college,
                    gender: formData.gender,
                    skills: formData.skills,
                },
                authConfig()
            );

            await fetchProfile();
            setEditing(false);
            alert("Profile updated successfully!");
        } catch (err) {
            console.error(err.response?.data || err);
            alert(
                JSON.stringify(
                    err.response?.data || "Failed to update profile."
                )
            );
        } finally {
            setSaving(false);
        }
    }

    async function toggleAvailability() {
        const newValue = !profile.is_available;

        // Update immediately for a responsive UI.
        setProfile((prev) => ({
            ...prev,
            is_available: newValue,
        }));

        try {
            await axios.patch(
                API_URL,
                { is_available: newValue },
                authConfig()
            );
        } catch (err) {
            // Restore the previous value if the request fails.
            setProfile((prev) => ({
                ...prev,
                is_available: !newValue,
            }));

            console.error(err.response?.data || err);
            alert("Could not update availability. Please try again.");
        }
    }

    if (loading) {
        return <div className="profile-page">Loading profile...</div>;
    }

    if (error) {
        return (
            <div className="profile-page">
                <nav className="profile-navbar">
                    <strong>✦ PeerLearn</strong>
                    <Link to="/">Home</Link>
                </nav>

                <main className="profile-container">
                    <div className="profile-section-card">
                        <h2>{error}</h2>
                        <p>
                            {error.includes("not been created")
                                ? "Complete your profile to get started."
                                : "Check your login and backend server."}
                        </p>

                        {error.includes("not been created") && (
                            <Link to="/auth/student/form">
                                Complete Profile
                            </Link>
                        )}

                        <button onClick={fetchProfile}>
                            Retry
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    const displayName =
        profile.full_name?.trim() || profile.username;

    const initials = displayName
        .split(" ")
        .filter(Boolean)
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();


return (
    <div className="peer-profile">
        <nav className="peer-navbar">
            <Link to="/" className="peer-brand">
                <span className="brand-icon">✦</span>
                <span>
                    <strong>PeerLearn</strong>
                    <small>Peer Learning</small>
                </span>
            </Link>

            <div className="peer-nav-links">
                <Link to="/">Home</Link>
                <Link to="/chat">Chats</Link>
                <Link to="/agent">AI Agent</Link>
                <Link className="active" to="/profile">Profile</Link>
            </div>
        </nav>

        <main className="peer-layout">
            {/* PROFILE HEADER */}
            <section className="peer-hero">
                <div className="peer-avatar-wrap">
                    <img
                        className="peer-avatar"
                        src={
                            profile.gender === "MALE"
                                ? "/male.jpeg"
                                : "/female.jpeg"
                        }
                        alt="Default student avatar"
                    />
                    <span
                        className={`peer-online ${
                            profile.is_available ? "online" : "offline"
                        }`}
                    />
                </div>

                <div className="peer-hero-content">
                    <h1>{displayName}</h1>
                    <p className="peer-subtitle">
                        {profile.branch} Student | Year {profile.year}
                    </p>
                    <p className="peer-college">
                        <span>⌖</span> {profile.college}
                    </p>
                    <p className="peer-description">
                        A student at PeerLearn sharing knowledge,
                        learning new skills, and connecting with fellow students.
                    </p>

                    <div className="peer-tags">
                        {profile.skills?.slice(0, 5).map((skill) => (
                            <span key={skill}>{skill}</span>
                        ))}
                    </div>
                </div>

                <button
                    className="peer-edit-button"
                    onClick={() => setEditing(!editing)}
                >
                    {editing ? "Cancel Editing" : "✎ Edit Profile"}
                </button>
            </section>

            {/* SUMMARY CARDS */}
            <section className="peer-summary">
                <div className="peer-summary-card">
                    <span className="summary-icon blue">♙</span>
                    <div>
                        <strong>{profile.year}</strong>
                        <p>Year of Study</p>
                        <small>{profile.branch}</small>
                    </div>
                </div>

                <div className="peer-summary-card">
                    <span className="summary-icon green">◉</span>
                    <div>
                        <strong>
                            {profile.is_available ? "Available" : "Unavailable"}
                        </strong>
                        <p>Peer Learning</p>
                        <small>Current status</small>
                    </div>
                </div>

                <div className="peer-summary-card">
                    <span className="summary-icon purple">✦</span>
                    <div>
                        <strong>{profile.skills?.length || 0}</strong>
                        <p>Skills</p>
                        <small>Added to profile</small>
                    </div>
                </div>

                <div className="peer-summary-card">
                    <span className="summary-icon orange">⌂</span>
                    <div>
                        <strong>{profile.gender}</strong>
                        <p>Profile</p>
                        <small>Student account</small>
                    </div>
                </div>
            </section>

            {/* EDIT FORM */}
            {editing && (
                <section className="peer-panel peer-edit-panel">
                    <h2>Edit Your Profile</h2>

                    <form onSubmit={saveProfile}>
                        <label>
                            Year
                            <select
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                required
                            >
                                <option value="1">1st Year</option>
                                <option value="2">2nd Year</option>
                                <option value="3">3rd Year</option>
                                <option value="4">4th Year</option>
                            </select>
                        </label>

                        <label>
                            Branch
                            <select
                                name="branch"
                                value={formData.branch}
                                onChange={handleChange}
                                required
                            >
                                {[
                                    "CSE", "CSE-AI", "CSE-DS", "CSE-CS",
                                    "ECE", "EEE", "MECH", "CIVIL",
                                ].map((branch) => (
                                    <option key={branch} value={branch}>
                                        {branch}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label>
                            College
                            <input
                                name="college"
                                value={formData.college}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <label>
                            Gender
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                required
                            >
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                            </select>
                        </label>

                        <label>
                            Add a skill
                            <select value="" onChange={addSkill}>
                                <option value="">Select skill</option>
                                {AVAILABLE_SKILLS.map((skill) => (
                                    <option
                                        key={skill}
                                        value={skill}
                                        disabled={formData.skills.includes(skill)}
                                    >
                                        {skill}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <div className="peer-tags edit-tags">
                            {formData.skills.map((skill) => (
                                <span key={skill}>
                                    {skill}
                                    <button
                                        type="button"
                                        onClick={() => removeSkill(skill)}
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>

                        <button
                            className="peer-primary-button"
                            type="submit"
                            disabled={saving}
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </form>
                </section>
            )}

            {/* MAIN THREE-COLUMN CONTENT */}
            <section className="peer-columns">
                {/* LEFT COLUMN */}
                <aside className="peer-left">
                    <div className="peer-panel">
                        <h2>♙ Basic Information</h2>

                        <div className="peer-info-row">
                            <span>Name</span>
                            <strong>{displayName}</strong>
                        </div>
                        <div className="peer-info-row">
                            <span>Username</span>
                            <strong>{profile.username}</strong>
                        </div>
                        <div className="peer-info-row">
                            <span>Pursuing</span>
                            <strong>
                                Year {profile.year} · {profile.branch}
                            </strong>
                        </div>
                        <div className="peer-info-row">
                            <span>College</span>
                            <strong>{profile.college}</strong>
                        </div>
                        <div className="peer-info-row">
                            <span>Gender</span>
                            <strong>{profile.gender}</strong>
                        </div>
                    </div>

                    <div className="peer-panel">
                        <h2>◷ Availability</h2>
                        <p className="peer-muted">
                            Let other students know when you can help.
                        </p>

                        <div className="peer-availability">
                            <span className={
                                profile.is_available ? "online-text" : "offline-text"
                            }>
                                ● {profile.is_available ? "Available" : "Unavailable"}
                            </span>

                            <button
                                type="button"
                                onClick={toggleAvailability}
                            >
                                {profile.is_available
                                    ? "Set Unavailable"
                                    : "Set Available"}
                            </button>
                        </div>
                    </div>
                </aside>

                {/* CENTER COLUMN */}
                <div className="peer-center">
                    <div className="peer-panel">
                        <div className="peer-panel-heading">
                            <h2>⚒ Skills I Know</h2>
                            <button onClick={() => setEditing(true)}>
                                Edit →
                            </button>
                        </div>

                        <div className="peer-tags peer-all-skills">
                            {profile.skills?.length ? (
                                profile.skills.map((skill) => (
                                    <span key={skill}>{skill}</span>
                                ))
                            ) : (
                                <p>No skills added yet.</p>
                            )}
                        </div>

                    </div>
                    
                    <div className="peer-panel">
                        <h2>📊 My Skill Assessment</h2>

                        <p className="peer-muted">
                            Your skill percentages are based on your assessment results.
                        </p>

                        {skillScores.length === 0 ? (
                            <div>
                                <p>
                                    No assessment scores yet. Complete your skill test
                                    to see your percentages here.
                                </p>

                                <Link to="/student/form/questions">
                                    Take Skill Test →
                                </Link>
                            </div>
                        ) : (
                            <div className="profile-skill-scores">
                                {skillScores.map((item) => (
                                    <div className="profile-skill-score" key={item.name}>
                                        <div className="profile-skill-score-heading">
                                            <span>{item.name}</span>
                                            <strong>{item.percentage}%</strong>
                                        </div>

                                        <div className="profile-skill-track">
                                            <div
                                                className="profile-skill-fill"
                                                style={{
                                                    width: `${item.percentage}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <Link
                            to="/student/form/questions"
                            className="peer-primary-button"
                        >
                            Retake Assessment
                        </Link>
                    </div>

                    <div className="peer-panel">
                        <h2>▤ About Me</h2>
                        <p className="peer-about">
                            I am {displayName}, a {profile.branch} student
                            studying in year {profile.year} at {profile.college}.
                            I enjoy developing my technical skills and
                            collaborating with other students through PeerLearn.
                        </p>
                    </div>

                    <div className="peer-panel peer-connect">
                        <h2>Connect with Peers</h2>
                        <p>
                            Meet other students, exchange knowledge, and
                            learn together.
                        </p>
                        <Link to="/chat" className="peer-primary-button">
                            Open Chats
                        </Link>
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <aside className="peer-right">
                    <div className="peer-panel">
                        <h2>✦ Your Learning Profile</h2>

                        <div className="peer-profile-stat">
                            <strong>{profile.skills?.length || 0}</strong>
                            <span>Skills added</span>
                        </div>

                        <div className="peer-profile-stat">
                            <strong>{profile.branch}</strong>
                            <span>Branch</span>
                        </div>

                        <div className="peer-profile-stat">
                            <strong>Year {profile.year}</strong>
                            <span>Current study year</span>
                        </div>
                    </div>

                    <div className="peer-panel">
                        <h2>✦ Improve Your Profile</h2>
                        <p className="peer-muted">
                            Keep your skills up to date so other students
                            know what you can help them learn.
                        </p>
                        <button
                            className="peer-primary-button"
                            onClick={() => setEditing(true)}
                        >
                            Update Skills
                        </button>
                    </div>
                </aside>
            </section>
        </main>
    </div>
)};

export default Profile