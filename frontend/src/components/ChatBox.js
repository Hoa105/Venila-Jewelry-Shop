import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/ChatBox.css";

const ChatBox = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  let user_id = user?.id;

  const handlesetOpen = async () => {
    setOpen(true);
    if (!user_id) {
      navigate("/login");
    }
    try {
      const response = await fetch(`http://localhost:8081/messages/${user_id}`);
      const data = await response.json();
      setMessages(data.results || []);
    } catch (error) {
      console.error("Lỗi khi lấy tin nhắn:", error);
    }
  };

  // Cuộn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Gửi tin nhắn
  const handleSend = async () => {
    if (!input.trim()) return;
    const newMsg = { from: "user", text: input };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    await fetch("http://localhost:8081/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id, content: input }),
    });

    handlesetOpen();
  };

  return (
    <>
      {!open && (
        <div
          className="chat-bubble"
          onClick={handlesetOpen}
          title="Chat hỗ trợ"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            width="36"
            height="36"
            viewBox="0 0 24 24"
            strokeWidth="1"
            stroke="#222"
            className="size-16"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
            />
          </svg>
        </div>
      )}

      {open && (
        <div className="chatbox-container">
          <div className="chatbox-header">
            Chat hỗ trợ
            <span
              className="chatbox-close"
              onClick={() => setOpen(false)}
              title="Đóng"
            >
              ×
            </span>
          </div>
          <div className="chatbox-messages">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={
                  msg.is_admin_reply ? "chatbox-msg admin" : "chatbox-msg user"
                }
              >
                <span className="chatbox-msg-content">{msg.content}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="chatbox-input-row">
            <input
              className="chatbox-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Nhập tin nhắn..."
            />
            <button className="chatbox-send-btn" onClick={handleSend}>
              Gửi
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBox;
