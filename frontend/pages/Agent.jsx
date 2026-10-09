import "./Agent.css";

function Agent() {
  return (
    <div className="agent-page">

      {/* NAVBAR */}
      <nav className="agent-navbar">
        <div className="agent-logo">
          <div className="agent-logo-icon">✦</div>
          <div>
            <strong>PeerLearn</strong>
            <span>AI Learning Platform</span>
          </div>
        </div>

        <div className="agent-nav-links">
          <a href="/">Home</a>
          <a href="/chat">Chats</a>
          <a className="active" href="/agent">AI Agent</a>
          <a href="/profile">Profile</a>
        </div>

        <button className="agent-profile-btn">
          Get Started
        </button>
      </nav>


      {/* MAIN */}
      <main className="agent-container">

        {/* HEADER */}
        <section className="agent-heading">

          <div className="ai-orb">
            <div className="orb-inner">✦</div>
          </div>

          <div>
            <span className="agent-label">YOUR AI LEARNING ASSISTANT</span>

            <h1>
              Ask anything.
              <br />
              <span>Find the right peer.</span>
            </h1>

            <p>
              Tell me what you're struggling with. I'll understand your
              doubt, identify the required skills, and find students who
              can help you.
            </p>
          </div>

        </section>


        {/* AI WORKSPACE */}
        <section className="agent-workspace">

          {/* CHAT AREA */}
          <div className="agent-chat">

            <div className="workspace-header">
              <div className="workspace-title">
                <div className="small-ai-icon">✦</div>

                <div>
                  <strong>AI Learning Agent</strong>
                  <span>Online • Ready to help</span>
                </div>
              </div>

              <span className="status-dot"></span>
            </div>


            {/* AI MESSAGE */}
            <div className="agent-message ai-message-box">

              <div className="message-avatar">
                ✦
              </div>

              <div className="message-content">

                <strong>AI Agent</strong>

                <p>
                  Hi! 👋 I'm your learning assistant.
                  Tell me what topic you're having trouble with
                  and I'll help you find the right peer.
                </p>

              </div>

            </div>


            {/* USER MESSAGE */}
            <div className="agent-message user-message-box">

              <div className="message-content">
                <strong>You</strong>

                <p>
                  I don't understand recursion in Java.
                  Can someone explain it with an example?
                </p>
              </div>

            </div>


            {/* AI ANALYSIS */}
            <div className="analysis-card">

              <div className="analysis-header">

                <div className="analysis-ai">
                  ✦
                </div>

                <div>
                  <strong>Understanding your doubt</strong>
                  <span>AI analysis completed</span>
                </div>

                <span className="check-icon">✓</span>

              </div>


              <p className="analysis-text">
                I understand that you need help with recursion,
                specifically in Java. These skills may be useful:
              </p>


              <div className="agent-skill-tags">
                <span>Java</span>
                <span>Recursion</span>
                <span>Data Structures</span>
                <span>Algorithms</span>
              </div>

            </div>


            {/* MATCHING */}
            <div className="matching-card">

              <div className="matching-icon">
                <span></span>
              </div>

              <div className="matching-text">
                <strong>Finding the best peer...</strong>
                <p>
                  Checking skills and availability
                </p>
              </div>

              <div className="matching-count">
                3 found
              </div>

            </div>


            {/* INPUT */}
            <div className="agent-input-area">

              <textarea
                placeholder="Describe your doubt..."
              ></textarea>

              <button className="send-btn">
                →
              </button>

            </div>

            <p className="input-hint">
              Press Enter to ask • AI will find the best peer
            </p>

          </div>


          {/* RIGHT SIDE */}
          <aside className="agent-sidebar">

            <div className="sidebar-title">
              <span>✦</span>
              Suggested questions
            </div>

            <button className="suggestion">
              Explain binary search trees
              <span>→</span>
            </button>

            <button className="suggestion">
              Help me understand pointers
              <span>→</span>
            </button>

            <button className="suggestion">
              How does recursion work?
              <span>→</span>
            </button>

            <button className="suggestion">
              Explain OS deadlocks
              <span>→</span>
            </button>


            <div className="sidebar-divider"></div>


            {/* MATCHED PEER */}
            <div className="peer-found">

              <div className="peer-found-title">
                <span>PEER MATCH</span>
                <small>95% match</small>
              </div>

              <div className="mini-peer">

                <div className="mini-peer-avatar">
                  RK
                  <i></i>
                </div>

                <div>
                  <strong>Rahul Kumar</strong>
                  <span>Java • DSA • Recursion</span>
                </div>

              </div>

              <button className="connect-peer">
                Connect with Rahul
                <span>→</span>
              </button>

            </div>

          </aside>

        </section>

      </main>

    </div>
  );
}

export default Agent;