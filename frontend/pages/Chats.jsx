import "./Chats.css";

function Chat() {
  return (
    <div className="chat-page">

      {/* NAVBAR */}
      <nav className="chat-navbar">

        <div className="chat-logo">
          <div>✦</div>

          <section>
            <strong>PeerLearn</strong>
            <span>Peer Learning</span>
          </section>
        </div>

        <div className="chat-nav-links">
          <a href="/">Home</a>
          <a className="active" href="/chat">Chats</a>
          <a href="/agent">AI Agent</a>
          <a href="/profile">Profile</a>
        </div>

      </nav>


      {/* CHAT APP */}
      <main className="chat-container">

        {/* CONVERSATIONS */}
        <aside className="conversation-panel">

          <div className="conversation-header">
            <div>
              <h2>Messages</h2>
              <span>Connect with your peers</span>
            </div>

            <button>＋</button>
          </div>


          <div className="chat-search">
            🔍
            <input
              placeholder="Search conversations..."
            />
          </div>


          <div className="conversation-list">

            <div className="conversation active-chat">

              <div className="chat-avatar blue-avatar">
                RK
                <i></i>
              </div>

              <div className="conversation-info">
                <div>
                  <strong>Rahul Kumar</strong>
                  <small>2m</small>
                </div>

                <p>
                  Sure! I can explain recursion.
                </p>
              </div>

            </div>


            <div className="conversation">

              <div className="chat-avatar purple-avatar">
                AS
                <i></i>
              </div>

              <div className="conversation-info">
                <div>
                  <strong>Ananya Sharma</strong>
                  <small>1h</small>
                </div>

                <p>
                  Did you understand the ML topic?
                </p>
              </div>

            </div>


            <div className="conversation">

              <div className="chat-avatar green-avatar">
                VP
              </div>

              <div className="conversation-info">
                <div>
                  <strong>Vamsi Prasad</strong>
                  <small>3h</small>
                </div>

                <p>
                  Thanks for helping me!
                </p>
              </div>

            </div>

          </div>

        </aside>


        {/* CHAT WINDOW */}
        <section className="chat-window">

          {/* HEADER */}
          <div className="chat-window-header">

            <div className="chat-person">

              <div className="chat-avatar blue-avatar">
                RK
                <i></i>
              </div>

              <div>
                <strong>Rahul Kumar</strong>
                <span>● Online • Data Structures</span>
              </div>

            </div>

            <div className="chat-actions">
              <button>📞</button>
              <button>⋮</button>
            </div>

          </div>


          {/* MESSAGES */}
          <div className="messages">

            <div className="date-divider">
              <span>Today</span>
            </div>


            <div className="message received">
              <div className="message-bubble">
                Hey! I saw that you need help with recursion.
              </div>

              <small>6:32 PM</small>
            </div>


            <div className="message received">
              <div className="message-bubble">
                I can explain it using a simple Java example.
              </div>

              <small>6:33 PM</small>
            </div>


            <div className="message sent">
              <div className="message-bubble">
                That would be great! I am confused about how
                the function calls itself.
              </div>

              <small>6:34 PM ✓✓</small>
            </div>


            <div className="message received">
              <div className="message-bubble">
                No problem. Think of recursion as a function
                solving a smaller version of the same problem.
              </div>

              <small>6:35 PM</small>
            </div>


            <div className="message sent">
              <div className="message-bubble">
                Ohh, now I understand!
              </div>

              <small>6:36 PM ✓✓</small>
            </div>

          </div>


          {/* INPUT */}
          <div className="chat-input-area">

            <button className="attach-btn">
              ＋
            </button>

            <input
              placeholder="Type your message..."
            />

            <button className="emoji-btn">
              😊
            </button>

            <button className="chat-send">
              ➤
            </button>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Chat;