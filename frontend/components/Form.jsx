import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Form.css";

function Form({onProfileComplete}) {

    const [year, setYear] = useState("");
    const [branch, setBranch] = useState("");
    const [college, setCollege] = useState(
        "Vignan's Institute of Information Technology, Duvvada"
    );
    const [gender, setGender] = useState("");
    const [skills,setSkills]=useState([])
    const AVAILABLE_SKILLS = [
        "C",
        "C++",
        "Java",
        "Python",
        "JavaScript",
        "HTML",
        "CSS",
        "React",
        "Node.js",
        "Django",
        "Machine Learning",
        "Deep Learning",
        "Artificial Intelligence",
        "Data Science",
        "SQL",
        "MongoDB",
        "Authentication",
        "REST API",
        "Git",
        "GitHub",
        "Data Structures",
        "Algorithms",
        "DBMS",
        "Operating Systems",
        "Computer Networks",
        "Cybersecurity",
        "Cloud Computing",
        "Docker",
        "Flask",
        "Express.js",
    ];

    const navigate = useNavigate();

    async function Submit(e) {

        e.preventDefault();

        if (!year || !branch) {
            alert("Please fill all the required fields.");
            return;
        }

        const accessToken = localStorage.getItem("accessToken");

        try {

            const response = await axios.post(
                "http://127.0.0.1:8000/auth/profile/",
                {
                    year: Number(year),
                    branch: branch,
                    college: college,
                    gender: gender,
                    skills: skills
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            );
           localStorage.setItem("profileCompleted", "true");

            if (onProfileComplete) {
                onProfileComplete();
            }

            alert(response.data.message);

            navigate("/student/form/questions", {
                replace: true
            });

        } catch (error) {

            console.log(error);

            if (error.response) {
                console.log(error.response.data);

                alert(
                    error.response.data.message ||
                    "Failed to create profile."
                );
            } else {
                alert("Server is not reachable.");
            }
        }
    }

    return (
        <div className="form-container">

            <div className="form-card">

                <h2>Complete Your Profile</h2>

                <p>
                    Enter your details to continue with PeerLearn.
                </p>

                <form onSubmit={Submit}>

                    {/* Year */}
                    <div className="form-group">

                        <label>Pursuing Year</label>

                        <select
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                        >

                            <option value="">
                                Select your year
                            </option>

                            <option value="1">
                                1st Year
                            </option>

                            <option value="2">
                                2nd Year
                            </option>

                            <option value="3">
                                3rd Year
                            </option>

                            <option value="4">
                                4th Year
                            </option>

                        </select>

                    </div>


                    {/* Branch */}
                    <div className="form-group">

                        <label>Branch</label>

                        <select
                            value={branch}
                            onChange={(e) => setBranch(e.target.value)}
                        >

                            <option value="">
                                Select your branch
                            </option>

                            <option value="CSE">CSE</option>
                            <option value="CSE-AI">CSE-AI</option>
                            <option value="CSE-DS">CSE-DS</option>
                            <option value="CSE-CS">CSE-CS</option>
                            <option value="ECE">ECE</option>
                            <option value="EEE">EEE</option>
                            <option value="MECH">MECH</option>
                            <option value="CIVIL">CIVIL</option>

                        </select>

                    </div>


                    {/* College */}
                    <div className="form-group">

                        <label>College</label>

                        <input
                            type="text"
                            value={college}
                            onChange={(e) => setCollege(e.target.value)}
                        />

                    </div>
                    <div className="form-group">
                        <label>Gender</label>
                        <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                        >
                            <option value="MALE">
                                Male
                            </option>
                            <option value="FEMALE">Female</option>
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label>Skills You Know</label>

                        <select
                            value=""
                            onChange={(e) => {
                                const selectedSkill = e.target.value;

                                if (selectedSkill && !skills.includes(selectedSkill)) {
                                    setSkills((prev) => [...prev, selectedSkill]);
                                }
                            }}
                        >
                            <option value="">Select a skill to add</option>

                            {AVAILABLE_SKILLS.map((skill) => (
                                <option
                                    key={skill}
                                    value={skill}
                                    disabled={skills.includes(skill)}
                                >
                                    {skill}
                                </option>
                            ))}
                        </select>

                        <div className="selected-skills">
                            {skills.map((skill) => (
                                <span className="skill-tag" key={skill}>
                                    {skill}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSkills((prev) =>
                                                prev.filter((item) => item !== skill)
                                            )
                                        }
                                        aria-label={`Remove ${skill}`}
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="form-button"
                    >
                        Continue
                    </button>

                </form>

            </div>

        </div>
    );
}

export default Form;