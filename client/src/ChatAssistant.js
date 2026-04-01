import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './ChatAssistant.css';

const API_URL = 'http://localhost:5000/api';

const COMMANDS = [
  { label: '🩸 Blood Inventory',      cmd: 'blood inventory' },
  { label: '🩸 Blood Eligibility',    cmd: 'blood eligibility' },
  { label: '🩸 Blood Risks',          cmd: 'blood risks' },
  { label: '🩸 Blood Recovery',       cmd: 'blood recovery' },
  { label: '🩸 Blood Stats',          cmd: 'blood donation stats' },
  { label: '📋 Blood Requests',       cmd: 'blood request stats' },
  { label: 'A+ Compatibility',        cmd: 'A+ compatibility' },
  { label: 'B+ Compatibility',        cmd: 'B+ compatibility' },
  { label: 'O+ Compatibility',        cmd: 'O+ compatibility' },
  { label: 'AB+ Compatibility',       cmd: 'AB+ compatibility' },
  { label: 'O- Compatibility',        cmd: 'O- compatibility' },
  { label: '❤️ Heart SOP',            cmd: 'heart sop' },
  { label: '🫘 Kidney SOP',           cmd: 'kidney sop' },
  { label: '👁️ Eye SOP',              cmd: 'eye sop' },
  { label: '✅ Heart Eligibility',    cmd: 'heart eligibility' },
  { label: '✅ Kidney Eligibility',   cmd: 'kidney eligibility' },
  { label: '✅ Eye Eligibility',      cmd: 'eye eligibility' },
  { label: '⚠️ Kidney Risks',         cmd: 'kidney risks' },
  { label: '🔄 Kidney Recovery',      cmd: 'kidney recovery' },
  { label: '🫀 Organ Donation Stats', cmd: 'organ donation stats' },
  { label: '📋 Organ Request Stats',  cmd: 'organ request stats' },
  { label: '⏳ Pending Requests',     cmd: 'pending requests' },
  { label: '🫀 Organ Process',        cmd: 'organ donation process' },
  { label: '🩸 Blood Process',        cmd: 'blood donation process' },
  { label: '📊 Donor Stats',          cmd: 'donor stats' },
  { label: '📊 Overview',             cmd: 'stats' },
  { label: '🏥 List Hospitals',       cmd: 'list hospitals' },
  { label: '👨‍⚕️ Doctors',             cmd: 'doctor count' },
  { label: 'ℹ️ About System',         cmd: 'about this system' },
];

const HELP_TEXT = `Supported commands — tap a chip or type:\n\n🩸 BLOOD\n  blood inventory · blood eligibility · blood risks · blood recovery\n  blood donation stats · blood request stats · pending requests\n  A+/A-/B+/B-/AB+/AB-/O+/O- compatibility\n\n🫀 ORGAN\n  heart sop · kidney sop · eye sop\n  heart/kidney/eye eligibility\n  kidney risks · kidney recovery\n  organ donation stats · organ request stats\n  organ donation process\n\n📊 STATS & INFO\n  donor stats · stats · list hospitals · doctor count\n  about this system`;

function ChatAssistant() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello! 👋 I'm your Blood & Organ Donation assistant.\n\nType a question or tap a quick command below to get started.\n\nType "help" anytime to see all supported commands.`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (text) => {
    const msg = text.trim();
    if (!msg || loading) return;

    // Handle help locally
    if (msg.toLowerCase() === 'help') {
      setMessages(prev => [
        ...prev,
        { role: 'user', content: msg },
        { role: 'assistant', content: HELP_TEXT }
      ]);
      setInput('');
      return;
    }

    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/chat`, { message: msg, history: messages });
      const reply = response.data.reply;

      // If backend returned the generic fallback, append help hint
      const isUnknown = reply.startsWith("I can help you with:");
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: isUnknown
            ? `I didn't quite understand that. Here's what I can help with:\n\n${HELP_TEXT}`
            : reply
        }
      ]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>🤖 AI Assistant</h2>
        <p>Ask about blood & organ donation — type "help" for all commands</p>
      </div>

      <div className="chat-commands">
        {COMMANDS.map(({ label, cmd }) => (
          <button key={cmd} className="cmd-chip" onClick={() => send(cmd)} disabled={loading}>
            {label}
          </button>
        ))}
      </div>

      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            <div className="message-content">{msg.content}</div>
          </div>
        ))}
        {loading && (
          <div className="message assistant">
            <div className="message-content typing">
              <span /><span /><span />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }}
          placeholder='Type a message or "help" for commands...'
          rows="1"
          disabled={loading}
        />
        <button onClick={() => send(input)} disabled={loading || !input.trim()}>Send</button>
      </div>
    </div>
  );
}

export default ChatAssistant;
