/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { Comment } from "@mui/icons-material";
import { FaPaperPlane, FaMicrophone, FaQuestion } from "react-icons/fa";
import axios from "axios";
import "./Bot.css";
import { MdHelpOutline, MdQuestionAnswer } from "react-icons/md";
 
const Bot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const speakText = (text) => {
    const synth = window.speechSynthesis;
    if (synth) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      synth.speak(utterance);
    }
  };

  const createMessage = (sender, text) => ({
    sender,
    text,
  });

  const faqs = {
    "how do i book a ride": "To book a ride, visit the rides page, choose your route, date, and confirm your selection.",
    "how to cancel a booking": "Go to 'My Bookings' and click 'Cancel' next to the ride you want to cancel.",
    "how does tqli-toli work": "GoOn helps you book reliable transport. Browse rides, select your route, and confirm in a few steps.",
  };

  const getFaqResponse = (msg) => {
    const match = Object.keys(faqs).find((faq) => msg.toLowerCase().includes(faq));
    return match ? faqs[match] : null;
  };

  const sendMessage = async (msg = input) => {
    if (msg.trim()) {
      const userMessage = createMessage("user", msg);
      const updatedHistory = [...messages, userMessage];
      setMessages(updatedHistory);
      setInput("");

      setIsTyping(true);
      setMessages((prev) => [...prev, createMessage("bot", "[typing]")]);

      const shortcutReply = handleCommandShortcuts(msg) || getFaqResponse(msg);
      if (shortcutReply) {
        setTimeout(() => {
          const replyMsg = createMessage("bot", shortcutReply);
          setMessages((prev) => [...prev.slice(0, -1), replyMsg]);
          speakText(shortcutReply);
          setIsTyping(false);
          localStorage.setItem("goon-chat", JSON.stringify([...updatedHistory, replyMsg]));
        }, 800);
        return;
      }

      try {
        const response = await axios.post("/api/chat/bot", {
          history: updatedHistory,
          message: msg,
        });

        setTimeout(() => {
          const botMessage = createMessage("bot", response.data.reply);
          setMessages((prev) => [...prev.slice(0, -1), botMessage]);
          speakText(response.data.reply);
          localStorage.setItem("goOn-chat", JSON.stringify([...updatedHistory, botMessage]));
          setIsTyping(false);
        }, 1000);
      } catch (error) {
        const errorMessage = createMessage("bot", "Oops! Something went wrong. Please try again later.");
        setMessages((prev) => [...prev.slice(0, -1), errorMessage]);
        setIsTyping(false);
      }
    }
  };

  const handleCommandShortcuts = (msg) => {
    const lower = msg.toLowerCase();
    if (lower.includes("book ride to")) {
      return "To book a ride, visit the rides page, enter your route and date, then select a ride.";
    } else if (lower.includes("cancel ride")) {
      return "To cancel a ride, go to your bookings page and click 'Cancel' next to your ride.";
    } else if (lower.includes("platform status")) {
      return "GoOn is currently online and fully functional. You can book rides anytime.";
    }
    return null;
  };

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const saved = localStorage.getItem("goOn-chat");
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  const quickReplies = [
    "Book a ride",
    "Cancel a ride",
    "Platform status",
    "Help",
  ];

  return (
    <div className="chatbot-container">
      <button className="chatbot-button" onClick={toggleChat}>
        <MdHelpOutline style={{ color: "#fff", fontSize: "32px" }} />
      </button>

      {isOpen && (
        <div className="chatbot-dialog">
          <div className="chatbot-header">
            <div className="header-left">
              <img src="/chatbot.png" alt="Bot" className="bot-avatar" />
              <span className="bot-title">GoOn Assistant</span>
            </div>
            <button className="close-button" onClick={toggleChat}>
              &times;
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-message ${msg.sender} ${msg.text === '[typing]' ? 'typing' : ''}`}
              >
                <div className="bubble">
                  {msg.text === '[typing]' ? <span className="dot-typing">{isTyping}</span> : msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-quick-replies">
            {quickReplies.map((text, index) => ( 
              <button
                key={index}
                className="quick-reply-btn"
                onClick={() => sendMessage(text)}
              >
                {text}
              </button>
            ))}
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={() => sendMessage()} title="Send">
              <FaPaperPlane />
            </button>
            <button onClick={startListening} title="Speak">
              <FaMicrophone color={isListening ? "red" : "#333"} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bot;