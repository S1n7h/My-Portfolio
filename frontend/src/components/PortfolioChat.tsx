import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

interface ProjectItem {
  title: string;
  description: string;
  programmingLanguagesUsed: string;
  githubUrl?: string;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  type: 'text' | 'project-list' | 'hobby-grid';
  text: string;
  data?: ProjectItem[] | string[];
}

export default function PortfolioChat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'ai', type: 'text', text: 'Hi! Type `/projects` to see what I have built, or just ask me anything!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll feed behavior matched from the previous UI layout
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', type: 'text', text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('https://protfolio-backend-jku3.onrender.com/api/chat', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.text }),
      });
      const data = await response.json();

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        type: data.type,
        text: data.text,
        data: data.data,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("Error communicating with backend:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    /* Outer container layout copied exactly from previous project */
    <div style={{ border: '1px solid #444444', padding: '20px', maxWidth: '1000px', margin: '40px auto', background: '#121212', color: '#fff', fontFamily: 'monospace', borderRadius: '8px' }}>
      <h2 style={{ margin: '0 0 10px 0' }}>Portfolio Terminal</h2>
      <hr style={{ borderColor: '#444', margin: '0 0 20px 0' }} />
      
      {/* Chat Feed Box container match from previous UI styling */}
      <div style={{ border: '1px solid #444444', height: '300px', overflowY: 'scroll', padding: '10px', margin: '20px 0', borderRadius: '6px', background: '#1a1a1a' }}>
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            style={{ display: 'flex', flexDirection: 'column', background: '#222', padding: '8px', margin: '8px 0', borderRadius: '4px', textAlign: 'left' }}
          >
            {/* Plain content layout — no individual user titles or hovering dependencies */}
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <strong style={{ color: msg.sender === 'user' ? '#61afef' : '#98c379', marginRight: '8px', flexShrink: 0 }}>
                {msg.sender === 'user' ? 'visitor:~$' : 'gemini:~$'}
              </strong>
              <div style={{ fontSize: '14px', lineHeight: '1.4' }}>
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            </div>

            {/* Interactive Project Lists Render Block */}
            {msg.type === 'project-list' && msg.data && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px', marginTop: '12px', maxWidth: '600px' }}>
                {(msg.data as ProjectItem[]).map((proj, idx) => (
                  <div key={idx} style={{ padding: '12px', background: '#2c2c2c', borderRadius: '6px', border: '1px solid #444' }}>
                    <h4 style={{ margin: '0 0 4px 0', color: '#61afef', fontSize: '16px' }}>{proj.title}</h4>
                    <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#ccc' }}>{proj.description}</p>
                    <div style={{ fontSize: '12px', color: '#aaa' }}>
                      <strong>Technologies:</strong> {proj.programmingLanguagesUsed}
                    </div>
                    {proj.githubUrl && (
                      <div style={{ marginTop: '8px' }}>
                        <a href={proj.githubUrl} target="_blank" rel="noreferrer" style={{ display: 'inline-block', fontSize: '12px', background: '#444', color: '#fff', padding: '4px 8px', borderRadius: '4px', textDecoration: 'none' }}>
                          GitHub
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Interactive Hobby Tag Grid Render Block */}
            {msg.type === 'hobby-grid' && msg.data && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                {(msg.data as string[]).map((hobby, idx) => (
                  <span key={idx} style={{ background: 'rgba(110, 68, 255, 0.2)', color: '#d4bfff', border: '1px solid #6e44ff', fontSize: '12px', padding: '4px 10px', borderRadius: '4px' }}>
                    {hobby}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
        {loading && <div style={{ fontSize: '12px', color: '#666', paddingLeft: '4px' }}>AI is typing...</div>}
        <div ref={messagesEndRef} />
      </div>

      {/* Action Prompt layout matched to previous layout structure */}
      <form onSubmit={sendMessage} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#61afef' }}>visitor:~$</span>
        <input 
          type="text" 
          placeholder="Type a message or `/projects`..." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flexGrow: 1, padding: '10px', borderRadius: '4px', border: '1px solid #555', background: '#111', color: '#fff', fontFamily: 'monospace' }}
        />
        <button 
          type="submit"
          style={{ background: '#5b48c9', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'monospace' }}
        >
          Execute
        </button>
      </form>
    </div>
  );
}