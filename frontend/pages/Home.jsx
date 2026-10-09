import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.dispatchEvent(new Event("authChanged"));
    navigate("/login", { replace: true });
  }

  return (
    <div className="home">
      {/* NAVBAR */}
      <nav className="navbar">
        <a className="logo" href="/" aria-label="PeerLearn home">
          <div className="logo-icon">✦</div>
          <div>
            <strong>PeerLearn</strong>
            <span>Peer-to-Peer Learning</span>
          </div>
        </a>

        <div className="nav-links">
          <a className="active" href="/">Home</a>
          <a href="/chat">Chats</a>
          <a href="/agent">AI Agent</a>
          <a href="/call">call</a>
          <a href="/profile">Profile</a>
        </div>

        <div className="nav-actions">
          <button className="nav-btn" onClick={() => navigate("/agent")}>
            Start Learning <span aria-hidden="true">→</span>
          </button>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <div className="badge"><span>✦</span> AI-Powered Peer Learning</div>

          <h1>
            Learn from peers.
            <br />
            <span>Teach what you know.</span>
          </h1>

          <p className="hero-description">
            Get your doubts solved by students who have the skills you need.
            Our AI finds the right peer, connects you instantly, and helps
            you learn together.
          </p>

          <div className="hero-buttons">
            <button className="primary-btn" onClick={() => navigate("/agent")}>
              Ask AI a Doubt <span aria-hidden="true">→</span>
            </button>
            <button className="secondary-btn" onClick={() => navigate("/profile")}>
              Explore Peers
            </button>
          </div>

          <div className="hero-stats">
            <div><strong>Peer</strong><span>Learning community</span></div>
            <div><strong>AI</strong><span>Skill-based matching</span></div>
            <div><strong>1:1</strong><span>Learn together</span></div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-orb hero-orb-one" />
          <div className="hero-orb hero-orb-two" />

          <img
            src="/peerlearn-students.jpeg"
            alt="Students collaborating on a coding project with AI learning tools"
            className="hero-students-image"
          />

          <div className="floating-card ai-floating-card">
            <div className="floating-icon">✦</div>
            <div className="floating-copy">
              <strong>Your AI Learning Agent</strong>
              <span>Ready to find your peer</span>
            </div>
            <span className="floating-online" aria-label="Online" />
          </div>

          <div className="floating-card skill-floating-card">
            <div className="floating-skill-icon">✓</div>
            <div className="floating-copy">
              <strong>Skills that connect</strong>
              <span>Python · React · Data Structures</span>
            </div>
          </div>

          <div className="image-caption">
            <span className="caption-sparkle">✦</span>
            Learn together. Grow together.
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section how-section">
        <div className="section-heading">
          <span className="eyebrow">HOW IT WORKS</span>
          <h2>From doubt to understanding.</h2>
          <p>Our AI helps you find the right peer so you can focus on learning.</p>
        </div>

        <div className="steps">
          <article className="step-card">
            <div className="step-top"><span className="step-icon">💬</span><span className="step-number">01</span></div>
            <h3>Ask your doubt</h3>
            <p>Tell the AI Agent what you are struggling to understand.</p>
          </article>
          <article className="step-card">
            <div className="step-top"><span className="step-icon">✦</span><span className="step-number">02</span></div>
            <h3>AI finds a match</h3>
            <p>AI identifies the skills needed to explain your topic.</p>
          </article>
          <article className="step-card">
            <div className="step-top"><span className="step-icon">🔔</span><span className="step-number">03</span></div>
            <h3>Peers connect</h3>
            <p>Students with matching skills can connect and help you.</p>
          </article>
          <article className="step-card">
            <div className="step-top"><span className="step-icon">🤝</span><span className="step-number">04</span></div>
            <h3>Learn together</h3>
            <p>Discuss concepts and solve problems through peer learning.</p>
          </article>
        </div>
      </section>

      {/* AI DOUBT SECTION */}
      <section className="doubt-section">
        <div className="doubt-content">
          <div className="ai-big-icon">✦</div>
          <span className="eyebrow">YOUR PERSONAL LEARNING AGENT</span>
          <h2>Stuck on something?<br /><span>Just ask.</span></h2>
          <p>
            Describe your doubt and let PeerLearn guide you toward the skills
            and people that can help. Learn concepts with support from your peers.
          </p>
          <button className="primary-btn" onClick={() => navigate("/agent")}>
            Ask AI Agent <span aria-hidden="true">→</span>
          </button>
        </div>

        <div className="doubt-demo">
          <div className="demo-top">
            <div className="demo-ai-icon">✦</div>
            <div><strong>AI Learning Agent</strong><span>Example conversation</span></div>
            <span className="demo-status"><i /> Ready</span>
          </div>

          <div className="chat-message user-message">
            <span>You</span>
            <p>Can someone explain binary search trees?</p>
          </div>

          <div className="chat-message ai-message">
            <div className="ai-message-header"><div className="mini-ai">✦</div><strong>AI Agent</strong></div>
            <p>These skills may help you understand this topic:</p>
            <div className="skill-tags">
              <span>Data Structures</span><span>Binary Trees</span><span>Algorithms</span>
            </div>
            <div className="found-peer">
              <div className="peer-mini-avatar">RK<i /></div>
              <div className="found-peer-copy"><strong>Potential peer match</strong><p>Data Structures · Peer learning</p></div>
              <button onClick={() => navigate("/chat")}>Connect</button>
            </div>
          </div>
        </div>
      </section>

      {/* PEERS */}
      <section className="section peers-section">
        <div className="section-heading peer-heading">
          <div>
            <span className="eyebrow">LEARN FROM EACH OTHER</span>
            <h2>Peers who can help you grow.</h2>
            <p>Connect with fellow learners and share what you know.</p>
          </div>
          <button className="outline-btn" onClick={() => navigate("/profile")}>Explore profiles <span aria-hidden="true">→</span></button>
        </div>

        <div className="peer-grid">
          <article className="peer-card">
            <div className="peer-top"><div className="peer-avatar avatar-one">PS<i /></div><span className="available">● Peer learning</span></div>
            <h3>Web Development</h3>
            <p className="course">Frontend skills and projects</p>
            <div className="skill-tags"><span>HTML</span><span>CSS</span><span>React</span></div>
            <div className="peer-bottom"><span>Learn by building</span><button onClick={() => navigate("/profile")}>View profile</button></div>
          </article>

          <article className="peer-card">
            <div className="peer-top"><div className="peer-avatar avatar-two">AI<i /></div><span className="available">● Peer learning</span></div>
            <h3>AI & Machine Learning</h3>
            <p className="course">Explore models and concepts</p>
            <div className="skill-tags"><span>Python</span><span>ML</span><span>Data</span></div>
            <div className="peer-bottom"><span>Learn step by step</span><button onClick={() => navigate("/profile")}>View profile</button></div>
          </article>

          <article className="peer-card">
            <div className="peer-top"><div className="peer-avatar avatar-three">DS<i /></div><span className="available">● Peer learning</span></div>
            <h3>Data Structures</h3>
            <p className="course">Practice problem-solving</p>
            <div className="skill-tags"><span>Algorithms</span><span>DSA</span><span>Java</span></div>
            <div className="peer-bottom"><span>Practice together</span><button onClick={() => navigate("/profile")}>View profile</button></div>
          </article>
        </div>
      </section>

      {/* LEARNING RESOURCES */}
      <section className="recorded-section">
        <div className="section-heading">
          <span className="eyebrow">KEEP EXPLORING</span>
          <h2>Every question is a chance to grow.</h2>
          <p>Build your confidence through collaboration, practice, and shared knowledge.</p>
        </div>

        <div className="resource-grid">
          <article className="resource-card">
            <div className="resource-art art-blue"><span>01</span><div className="resource-symbol">{`{ }`}</div></div>
            <div className="resource-info"><span>WEB DEVELOPMENT</span><h3>Build practical projects</h3><p>Learn frontend skills by creating and sharing projects.</p></div>
          </article>
          <article className="resource-card">
            <div className="resource-art art-purple"><span>02</span><div className="resource-symbol">✦</div></div>
            <div className="resource-info"><span>AI & DATA</span><h3>Explore new ideas</h3><p>Break down difficult concepts with help from other learners.</p></div>
          </article>
          <article className="resource-card">
            <div className="resource-art art-green"><span>03</span><div className="resource-symbol">⌘</div></div>
            <div className="resource-info"><span>PROBLEM SOLVING</span><h3>Practice together</h3><p>Share approaches, compare solutions, and improve your skills.</p></div>
          </article>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="cta-section">
        <div className="cta-icon">✦</div>
        <span className="eyebrow">YOUR NEXT STEP STARTS HERE</span>
        <h2>Everyone knows something.<br /><span>Everyone can learn something.</span></h2>
        <p>Start your peer-learning journey today.</p>
        <button className="primary-btn" onClick={() => navigate("/agent")}>Start Learning <span aria-hidden="true">→</span></button>
      </section>

      {/* FOOTER */}
      <footer className="home-footer">
        <a className="footer-brand" href="/">
          <span className="footer-logo-icon">✦</span>
          <span><strong>PeerLearn</strong><small>AI-powered peer-to-peer learning</small></span>
        </a>
        <div className="footer-links">
          <a href="/">Home</a><a href="/agent">AI Agent</a><a href="/chat">Chats</a><a href="/profile">Profile</a>
        </div>
        <span className="footer-note">Learn together. Grow together.</span>
      </footer>
    </div>
  );
}

export default Home;
