import React, { useState } from 'react';
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

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', type: 'text', text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5083/api/chat', { 
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
    <div className="flex flex-col h-[600px] w-full max-w-2xl border border-gray-700 bg-gray-900 rounded-lg shadow-xl overflow-hidden text-white mx-auto mt-10 font-mono">
      {/* Chat Window */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-left align-text-top">
        {messages.map((msg) => (
          /* Force left-alignment for all message rows */
          <div key={msg.id} className="flex items-start justify-start w-full border-b border-gray-800/40 pb-2">
            
            {/* Terminal prefix identifier */}
            <span className={`text-sm font-bold mr-2 shrink-0 ${msg.sender === 'user' ? 'text-blue-400' : 'text-green-400'}`}>
              {msg.sender === 'user' ? 'visitor:~$' : 'gemini:~$'}
            </span>

            <div className="flex-1 text-left">
              {/* Resetting prose layout styles to ensure it respects absolute left alignment */}
              <div className="prose prose-invert text-sm max-w-none text-left [&>*]:text-left">
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>

              {/* Render Interactive Projects */}
              {msg.type === 'project-list' && msg.data && (
                <div className="grid grid-cols-1 gap-3 mt-3 max-w-xl text-left">
                  {(msg.data as ProjectItem[]).map((proj, idx) => (
                    <div key={idx} className="p-3 bg-gray-800 rounded-md border border-gray-700 shadow-sm text-left">
                      <h4 className="font-bold text-base text-blue-400 text-left">{proj.title}</h4>
                      <p className="text-xs text-gray-300 mt-1 text-left">{proj.description}</p>
                      <div className="text-xs text-gray-400 mt-1 text-left">
                        <strong>Technologies:</strong> {proj.programmingLanguagesUsed}
                      </div>
                      <div className="mt-2 flex space-x-2 justify-start">
                        {proj.githubUrl && (
                          <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-xs bg-gray-700 px-2 py-1 rounded hover:bg-gray-600 transition">
                            GitHub
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Render Interactive Hobbies */}
              {msg.type === 'hobby-grid' && msg.data && (
                <div className="flex flex-wrap gap-2 mt-3 justify-start">
                  {(msg.data as string[]).map((hobby, idx) => (
                    <span key={idx} className="bg-purple-900/50 text-purple-200 border border-purple-700 text-xs px-3 py-1 rounded font-medium">
                      {hobby}
                    </span>
                  ))}
                </div>
              )}

            </div>
          </div>
        ))}
        {loading && <div className="text-xs text-gray-500 animate-pulse pl-1 text-left">AI is typing...</div>}
      </div>

      {/* Input Form */}
      <form onSubmit={sendMessage} className="p-3 bg-gray-800 border-t border-gray-700 flex gap-2">
        <span className="text-sm font-bold text-blue-400 self-center font-mono">visitor:~$</span>
        <input
          type="text"
          className="flex-1 bg-gray-900 rounded px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
          placeholder="Type a message or `/projects`..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm font-medium transition font-mono">
          Execute
        </button>
      </form>
    </div>
  );
}