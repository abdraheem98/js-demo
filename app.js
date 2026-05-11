import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://54.80.16.114:5000');

export default function App() {
  const [username, setUsername] = useState('');
  const [room, setRoom]         = useState('general');
  const [joined, setJoined]     = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText]         = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    if (joined) {
      fetch(`http://54.80.16.114/messages/${room}`)
        .then(r => r.json())
        .then(setMessages);
    }

    socket.on('receive_message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    socket.on('user_joined', ({ username }) => {
      setMessages(prev => [...prev, { system: true, text: `${username} joined the room` }]);
    });

    socket.on('user_left', ({ username }) => {
      setMessages(prev => [...prev, { system: true, text: `${username} left the room` }]);
    });

    return () => {
      socket.off('receive_message');
      socket.off('user_joined');
      socket.off('user_left');
    };
  }, [joined, room]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const joinRoom = () => {
    if (!username.trim()) return;
    socket.emit('join_room', { username, room });
    setJoined(true);
  };

  const sendMessage = () => {
    if (!text.trim()) return;
    socket.emit('send_message', { username, text, room });
    setText('');
  };

  if (!joined) return (
    <div style={styles.center}>
      <div style={styles.card}>
        <h2 style={styles.title}>💬 Docker Chat</h2>
        <input
          style={styles.input}
          placeholder="Your name"
          value={username}
          onChange={e => setUsername(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && joinRoom()}
        />
        <select style={styles.input} value={room} onChange={e => setRoom(e.target.value)}>
          <option value="general">General</option>
          <option value="docker">Docker</option>
          <option value="devops">DevOps</option>
        </select>
        <button style={styles.btn} onClick={joinRoom}>Join Room</button>
      </div>
    </div>
  );

  return (
    <div style={styles.chatWrap}>
      <div style={styles.header}>
        💬 #{room} &nbsp;·&nbsp; <span style={{ fontWeight: 400 }}>{username}</span>
      </div>
      <div style={styles.messages}>
        {messages.map((m, i) =>
          m.system
            ? <div key={i} style={styles.system}>{m.text}</div>
            : <div key={i} style={styles.msg}>
                <span style={styles.user}>{m.username}</span>
                <span style={styles.bubble}>{m.text}</span>
                <span style={styles.time}>
                  {new Date(m.timestamp).toLocaleTimeString()}
                </span>
              </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div style={styles.inputRow}>
        <input
          style={{ ...styles.input, flex: 1 }}
          placeholder="Type a message..."
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
        />
        <button style={styles.btn} onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

const styles = {
  center:   { display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'#f0f2f5' },
  card:     { background:'#fff', padding:'2rem', borderRadius:12, display:'flex', flexDirection:'column', gap:12, width:320, boxShadow:'0 2px 12px rgba(0,0,0,0.1)' },
  title:    { margin:0, textAlign:'center' },
  chatWrap: { display:'flex', flexDirection:'column', height:'100vh', fontFamily:'sans-serif' },
  header:   { background:'#1a1a2e', color:'#fff', padding:'12px 20px', fontWeight:600, fontSize:16 },
  messages: { flex:1, overflowY:'auto', padding:16, display:'flex', flexDirection:'column', gap:8, background:'#f0f2f5' },
  msg:      { display:'flex', alignItems:'baseline', gap:8 },
  user:     { fontWeight:600, fontSize:13, color:'#1a1a2e', minWidth:80 },
  bubble:   { background:'#fff', padding:'6px 12px', borderRadius:8, fontSize:14, boxShadow:'0 1px 2px rgba(0,0,0,0.08)' },
  time:     { fontSize:11, color:'#999' },
  system:   { textAlign:'center', fontSize:12, color:'#999', fontStyle:'italic' },
  inputRow: { display:'flex', gap:8, padding:12, background:'#fff', borderTop:'1px solid #eee' },
  input:    { padding:'8px 12px', borderRadius:8, border:'1px solid #ddd', fontSize:14, outline:'none' },
  btn:      { padding:'8px 20px', background:'#1a1a2e', color:'#fff', border:'none', borderRadius:8, cursor:'pointer', fontSize:14 },
};

sourceMappingURL=app.js.map

const root = document.getElementById('root');
import { createRoot } from 'react-dom/client';
createRoot(root).render(<App />);
