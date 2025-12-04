import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, Loader2, MapPin, Globe } from 'lucide-react';
import { getGeminiTutorResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

interface AITutorProps {
  contextTitle: string;
}

const AITutor: React.FC<AITutorProps> = ({ contextTitle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'model',
      text: `Hi! I'm Aim AI. I can help you understand "${contextTitle}". Ask me anything!`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  // Reset chat when context changes
  useEffect(() => {
    setMessages([{
      id: Date.now().toString(),
      role: 'model',
      text: `Hi! I'm Aim AI. I see you're studying "${contextTitle}". How can I help?`,
      timestamp: new Date()
    }]);
  }, [contextTitle]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      const response = await getGeminiTutorResponse(history, contextTitle, userMsg.text);

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text,
        timestamp: new Date(),
        groundingUrls: response.groundingUrls
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      {/* Chat Window */}
      {isOpen && (
        <div className="pointer-events-auto bg-white rounded-2xl shadow-2xl border border-slate-200 w-80 sm:w-96 h-[500px] flex flex-col mb-4 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <h3 className="font-semibold">Aim AI Tutor</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
                
                {/* Render Grounding URLs (Maps & Search) */}
                {msg.groundingUrls && msg.groundingUrls.length > 0 && (
                  <div className="mt-2 max-w-[85%] space-y-2">
                    {msg.groundingUrls.map((url, idx) => (
                      <a 
                        key={idx} 
                        href={url.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block bg-white border border-slate-200 rounded-lg p-2 hover:bg-slate-50 transition shadow-sm group"
                      >
                         <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                                url.source === 'map' ? 'bg-red-100' : 'bg-blue-100'
                            }`}>
                                {url.source === 'map' ? (
                                    <MapPin className="w-4 h-4 text-red-600" />
                                ) : (
                                    <Globe className="w-4 h-4 text-blue-600" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-slate-800 truncate">{url.title}</p>
                                <p className="text-[10px] text-slate-500 truncate">
                                    {url.source === 'map' ? 'Open in Google Maps' : 'Visit Website'}
                                </p>
                            </div>
                         </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-slate-200 shadow-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                  <span className="text-xs text-slate-500">Thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-slate-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about this topic..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`pointer-events-auto shadow-xl transition-all duration-300 ${
          isOpen 
            ? 'bg-slate-700 hover:bg-slate-800 rotate-90 opacity-0 h-0 w-0 p-0 overflow-hidden' 
            : 'bg-gradient-to-br from-indigo-600 to-violet-600 hover:scale-110 p-4 rounded-full'
        }`}
      >
        <Bot className="w-7 h-7 text-white" />
      </button>
      {!isOpen && (
        <div className="pointer-events-auto absolute bottom-0 right-0 bg-gradient-to-br from-indigo-600 to-violet-600 p-4 rounded-full shadow-xl hover:scale-110 transition-transform cursor-pointer group" onClick={() => setIsOpen(true)}>
            <Bot className="w-7 h-7 text-white group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-400"></span>
            </span>
        </div>
      )}
    </div>
  );
};

export default AITutor;