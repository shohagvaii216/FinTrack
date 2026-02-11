
import React, { useState } from 'react';
import { MessageSquare, Zap, X, Check, ClipboardPaste } from 'lucide-react';
import { parseFinancialSms } from '../services/gemini';

interface Props {
  onSuggest: (data: any) => void;
}

const SmsDetector: React.FC<Props> = ({ onSuggest }) => {
  const [isParsing, setIsParsing] = useState(false);
  const [smsInput, setSmsInput] = useState('');
  const [showInput, setShowInput] = useState(false);

  const handleParse = async (text: string) => {
    if (!text.trim()) return;
    setIsParsing(true);
    const result = await parseFinancialSms(text);
    if (result) {
      onSuggest(result);
      setSmsInput('');
      setShowInput(false);
    } else {
      alert("SMS থেকে তথ্য পাওয়া যায়নি। সঠিক টেক্সট পেস্ট করুন।");
    }
    setIsParsing(false);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setSmsInput(text);
      handleParse(text);
    } catch (err) {
      setShowInput(true);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end gap-3">
      {showInput && (
        <div className="glass p-4 rounded-3xl w-72 mb-2 animate-slide-up border-sky-500/30">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-widest">Smart SMS Parser</span>
            <button onClick={() => setShowInput(false)}><X size={16}/></button>
          </div>
          <textarea 
            value={smsInput}
            onChange={(e) => setSmsInput(e.target.value)}
            className="w-full h-24 bg-white/5 border border-white/10 rounded-xl p-3 text-xs focus:outline-none resize-none mb-3"
            placeholder="ব্যাংক বা বিকাশের SMS এখানে পেস্ট করুন..."
          />
          <button 
            disabled={isParsing}
            onClick={() => handleParse(smsInput)}
            className="w-full py-2 bg-sky-500 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
          >
            {isParsing ? 'স্ক্যান হচ্ছে...' : 'স্ক্যান করুন'}
          </button>
        </div>
      )}

      <button 
        onClick={() => setShowInput(!showInput)}
        className="w-14 h-14 bg-slate-900 rounded-full flex items-center justify-center border-2 border-sky-500/50 shadow-lg shadow-sky-500/20 text-sky-400 hover:scale-110 active:scale-95 transition-all group"
        title="SMS এন্ট্রি সাজেশন"
      >
        <MessageSquare size={24} className="group-hover:animate-bounce" />
      </button>
    </div>
  );
};

export default SmsDetector;
