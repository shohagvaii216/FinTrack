
import React, { useState, useEffect } from 'react';
import { Lock, Delete, ShieldCheck, Fingerprint } from 'lucide-react';

interface Props {
  correctPin: string;
  onUnlock: () => void;
}

const PinLockScreen: React.FC<Props> = ({ correctPin, onUnlock }) => {
  const [inputPin, setInputPin] = useState('');
  const [error, setError] = useState(false);

  const handleKeyPress = (num: string) => {
    if (inputPin.length < 4) {
      const next = inputPin + num;
      setInputPin(next);
      if (next.length === 4) {
        if (next === correctPin) {
          setTimeout(onUnlock, 100);
        } else {
          setError(true);
          setTimeout(() => {
            setInputPin('');
            setError(false);
          }, 500);
        }
      }
    }
  };

  const handleDelete = () => {
    setInputPin(inputPin.slice(0, -1));
  };

  return (
    <div className="fixed inset-0 z-[1000] glass flex flex-col items-center justify-center animate-fade-in">
      <div className="text-center mb-12">
        <div className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center mb-6 transition-all duration-300 ${error ? 'bg-rose-500/20 text-rose-500 animate-shake' : 'bg-sky-500/20 text-sky-400'}`}>
          <Lock size={40} />
        </div>
        <h2 className="text-2xl font-black">স্বাগতম!</h2>
        <p className="text-slate-400 text-sm mt-2">আপনার ৪-ডিজিটের পিন দিন</p>
      </div>

      {/* Pin Indicators */}
      <div className="flex gap-6 mb-16">
        {[0, 1, 2, 3].map((i) => (
          <div 
            key={i} 
            className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
              inputPin.length > i 
                ? 'bg-sky-500 border-sky-500 scale-125 shadow-[0_0_10px_rgba(14,165,233,0.5)]' 
                : 'border-white/20'
            }`}
          />
        ))}
      </div>

      {/* Keypad */}
      <div className="grid grid-cols-3 gap-6">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
          <button 
            key={num}
            onClick={() => handleKeyPress(num)}
            className="w-20 h-20 glass rounded-full flex items-center justify-center text-2xl font-bold hover:bg-white/10 active:scale-90 transition-all border border-white/5"
          >
            {num}
          </button>
        ))}
        <div className="w-20 h-20"></div>
        <button 
          onClick={() => handleKeyPress('0')}
          className="w-20 h-20 glass rounded-full flex items-center justify-center text-2xl font-bold hover:bg-white/10 active:scale-90 transition-all border border-white/5"
        >
          0
        </button>
        <button 
          onClick={handleDelete}
          className="w-20 h-20 flex items-center justify-center text-slate-500 hover:text-white transition-colors"
        >
          <Delete size={28} />
        </button>
      </div>

      <div className="mt-16 flex items-center gap-2 text-slate-600">
        <ShieldCheck size={16} />
        <span className="text-[10px] font-black uppercase tracking-widest">SritiSetu Secure Vault</span>
      </div>
    </div>
  );
};

export default PinLockScreen;
