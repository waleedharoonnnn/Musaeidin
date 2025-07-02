import React, { useState } from "react";
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
      <h2>About Us</h2>
      <p>
        Musaeidin is an AI-powered assistant designed to provide spiritual
        guidance, answer questions, and support your journey. Our mission is to
        make knowledge and support accessible to everyone, anytime.
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
      <h2>Feedback</h2>
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

function Home({ input, setInput, loading, sendMessage }) {
  return (
    <>
      <img src="/logo.png" alt="Musaeidin Logo" className="main-logo" />
      <h1 className="main-title main-title-black">Musaeidin</h1>
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
          />
        )}
        {page === "about" && <AboutUs />}
        {page === "feedback" && <Feedback />}
      </div>
    </div>
  );
}

export default App;
