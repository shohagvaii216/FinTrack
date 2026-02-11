
import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, X, User, Cpu, Bot } from 'lucide-react';
import { askFinancialAdvisor } from '../services/gemini';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const AiAssistant: React.FC<Props> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: 'হ্যালো! আমি FinTrack AI। আমি আপনাকে বাজেট, সঞ্চয় বা বিনিয়োগের পরামর্শ দিয়ে সাহায্য করতে পারি। আপনি কি জানতে চান?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    const userMsg = query.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setQuery('');
    setIsLoading(true);

    const response = await askFinancialAdvisor(userMsg, messages);
    setMessages(prev => [...prev, { role: 'assistant', text: response || 'দুঃখিত, আমি উত্তর দিতে পারছি না।' }]);
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 sm:inset-auto sm:bottom-24 sm:right-6 sm:w-96 sm:h-[600px] bg-slate-950/95 border border-white/10 sm:rounded-[2.5rem] flex flex-col z-[300] shadow-2xl animate-slide-up backdrop-blur-xl">
      {/* Header */}
      <div className="p-6 border-b border-white/10 flex justify-between items-center bg-indigo-500/10 sm:rounded-t-[2.5rem]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Bot size={24} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">Ask FinTrack AI</h3>
            <p className="text-[9px] text-indigo-400 font-black uppercase tracking-widest">Premium Advisor</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-slate-400"><X size={20}/></button>
      </div>

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-indigo-500 text-white rounded-tr-none shadow-lg shadow-indigo-500/10' : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none'}`}>
               {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none animate-pulse flex items-center gap-2">
                <div className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce"></div>
                <div className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                <div className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce [animation-delay:-.5s]"></div>
             </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-6 border-t border-white/10">
        <div className="relative">
          <input 
            type="text" 
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="আপনার ফিন্যান্সিয়াল প্রশ্নটি লিখুন..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-4 pr-12 text-sm focus:outline-none focus:border-indigo-500 transition-all"
          />
          <button 
            type="submit"
            disabled={isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-500/20 active:scale-95 disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default AiAssistant;
