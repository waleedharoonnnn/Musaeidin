import React, { useState, useRef, useEffect } from "react";
import "./App.css";

const featureCards = [
  {
    title: "Dua to make",
    desc: "Dua for Protection from Evil",
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
        <path
          fill="#fff"
          d="M12 2a1 1 0 0 1 1 1v2.07A7.002 7.002 0 0 1 19.93 11H22a1 1 0 1 1 0 2h-2.07A7.002 7.002 0 0 1 13 19.93V22a1 1 0 1 1-2 0v-2.07A7.002 7.002 0 0 1 4.07 13H2a1 1 0 1 1 0-2h2.07A7.002 7.002 0 0 1 11 4.07V2a1 1 0 0 1 1-1Zm0 4a5 5 0 1 0 0 10A5 5 0 0 0 12 6Z"
        />
      </svg>
    ),
  },
  {
    title: "Islamic perspectives",
    desc: "On Trust in Allah",
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
        <path
          fill="#fff"
          d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20Zm0 2a8 8 0 1 0 0 16A8 8 0 0 0 12 4Zm0 3a1 1 0 0 1 1 1v3h3a1 1 0 1 1 0 2h-4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z"
        />
      </svg>
    ),
  },
  {
    title: "Spiritual remedies",
    desc: "For Maximizing Ramadan Worship",
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
        <path
          fill="#fff"
          d="M12 2a1 1 0 0 1 1 1v2.07A7.002 7.002 0 0 1 19.93 11H22a1 1 0 1 1 0 2h-2.07A7.002 7.002 0 0 1 13 19.93V22a1 1 0 1 1-2 0v-2.07A7.002 7.002 0 0 1 4.07 13H2a1 1 0 1 1 0-2h2.07A7.002 7.002 0 0 1 11 4.07V2a1 1 0 0 1 1-1Zm0 4a5 5 0 1 0 0 10A5 5 0 0 0 12 6Z"
        />
      </svg>
    ),
  },
];

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
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
      <div className="center-content">
        <img src="/logo.png" alt="Musaeidin Logo" className="main-logo" />
        <h1 className="main-title">Musaeidin</h1>
        <div className="feature-cards">
          {featureCards.map((card, idx) => (
            <div className="feature-card" key={idx}>
              <div className="feature-icon">{card.icon}</div>
              <div>
                <div className="feature-title">{card.title}</div>
                <div className="feature-desc">{card.desc}</div>
              </div>
            </div>
          ))}
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
      </div>
    </div>
  );
}

export default App;
