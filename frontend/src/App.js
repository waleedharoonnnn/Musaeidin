import React, { useState, useRef, useEffect } from "react";
import "./App.css";

function Navbar({ onNavigate }) {
  return (
    <nav className="navbar">
      <div className="navbar-left" onClick={() => onNavigate("home")}>
        <img src="/logo.png" alt="Musaeidin Logo" className="navbar-logo" />
        <span className="navbar-title">Musaeidin</span>
      </div>
      <div className="navbar-right">
        <button className="nav-link" onClick={() => onNavigate("about")}>
          About Us
        </button>
        <button className="nav-link" onClick={() => onNavigate("feedback")}>
          Feedback
        </button>
      </div>
    </nav>
  );
}

function AboutUs() {
  return (
    <div className="section-card">
      <h2 style={{ fontSize: "1.7rem", marginBottom: "10px" }}>
        🕌 About Musaeidin
      </h2>
      <p style={{ fontWeight: 500, fontSize: "1.08rem", marginBottom: 18 }}>
        <span style={{ fontWeight: 700 }}>Musaeidin (مُسَاعِدِين)</span>,
        meaning "those who help" in Arabic, is a faith-driven AI-powered
        platform designed to assist Muslims in their spiritual, mental, and
        everyday lives.
      </p>
      <p style={{ marginBottom: 18 }}>
        Built with sincerity and care, Musaeidin serves as your trusted Islamic
        companion, offering guidance rooted in authentic sources—the Qur'an,
        Sunnah, and reliable Hadith collections.
      </p>
      <p style={{ marginBottom: 18 }}>
        <b>Our mission</b> is to provide a safe, respectful, and accessible
        digital space where users can:
      </p>
      <ul
        style={{
          textAlign: "left",
          margin: "0 auto 18px auto",
          maxWidth: 420,
          fontSize: "1.05rem",
          color: "#333",
        }}
      >
        <li>Ask questions related to faith, worship, or daily challenges</li>
        <li>Seek mental and emotional wellness within Islamic values</li>
        <li>Learn and apply authentic Islamic knowledge in real life</li>
      </ul>
      <p style={{ marginBottom: 18 }}>
        We believe in the power of technology with purpose—using AI not just for
        automation, but for supporting your Deen, strengthening your Iman, and
        bringing ease to your journey in this world and the next.
      </p>
      <p
        style={{
          fontWeight: 600,
          fontStyle: "italic",
          color: "#007bff",
          fontSize: "1.08rem",
        }}
      >
        Musaeidin — Guided by Knowledge. Powered by Faith.
      </p>
    </div>
  );
}

function Feedback() {
  const [feedback, setFeedback] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    try {
      const res = await fetch("http://localhost:5000/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback }),
      });
      if (res.ok) {
        setStatus("Thank you for your feedback!");
        setFeedback("");
      } else {
        setStatus("Error submitting feedback.");
      }
    } catch {
      setStatus("Error submitting feedback.");
    }
  };

  return (
    <div className="section-card">
      <h2 style={{ fontSize: "1.7rem", marginBottom: "10px" }}>
        We Value Your Feedback
      </h2>
      <p style={{ fontWeight: 500, fontSize: "1.08rem", marginBottom: 12 }}>
        Your experience matters to us!
      </p>
      <p style={{ marginBottom: 10 }}>
        Please let us know how Musaeidin is working for you:
      </p>
      <ul
        style={{
          textAlign: "left",
          margin: "0 auto 16px auto",
          maxWidth: 420,
          fontSize: "1.05rem",
          color: "#333",
        }}
      >
        <li>Is the information helpful and accurate?</li>
        <li>Are there areas where we can improve?</li>
        <li>Do you have suggestions or features you'd like to see?</li>
      </ul>
      <p style={{ marginBottom: 18 }}>
        Your feedback helps us make Musaeidin better, more reliable, and more
        useful for everyone seeking authentic Islamic guidance.
      </p>
      <p
        style={{
          fontWeight: 600,
          fontStyle: "italic",
          color: "#007bff",
          fontSize: "1.08rem",
          marginBottom: 18,
        }}
      >
        📝 Share your thoughts — every comment is appreciated and helps us grow!
      </p>
      <form onSubmit={handleSubmit} className="feedback-form">
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Your feedback..."
          required
        />
        <button type="submit">Submit</button>
      </form>
      {status && <div className="feedback-status">{status}</div>}
    </div>
  );
}

function Home({ input, setInput, loading, sendMessage, messages, chatEndRef }) {
  return (
    <>
      <img src="/logo.png" alt="Musaeidin Logo" className="main-logo" />
      <h1 className="main-title main-title-black">Musaeidin</h1>
      <div className="chat-area">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chat-bubble ${
              msg.sender === "user" ? "user-bubble" : "ai-bubble"
            }`}
          >
            <span>{msg.text}</span>
          </div>
        ))}
        {loading && (
          <div className="chat-bubble ai-bubble">
            <i>Musaeidin is typing...</i>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <form className="chat-input-bar" onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Salam, Message Musaeidin..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="send-btn"
        >
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
            <path fill="#fff" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </form>
    </>
  );
}

function App() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState("home");
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage = input;
    setMessages([...messages, { sender: "user", text: userMessage }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await res.json();
      setMessages((msgs) => [...msgs, { sender: "ai", text: data.response }]);
    } catch (err) {
      setMessages((msgs) => [
        ...msgs,
        { sender: "ai", text: "Error: Could not reach backend." },
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="pattern-bg">
      <Navbar onNavigate={setPage} />
      <div className="center-content">
        {page === "home" && (
          <Home
            input={input}
            setInput={setInput}
            loading={loading}
            sendMessage={sendMessage}
            messages={messages}
            chatEndRef={chatEndRef}
          />
        )}
        {page === "about" && <AboutUs />}
        {page === "feedback" && <Feedback />}
      </div>
    </div>
  );
}

export default App;
