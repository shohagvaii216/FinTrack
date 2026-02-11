
import React, { useState } from 'react';
import { X, Delete, Divide, Minus, Plus, X as Multiply, Hash, Percent } from 'lucide-react';

interface Props {
  onClose: () => void;
}

const CalculatorPopup: React.FC<Props> = ({ onClose }) => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');

  const handleNumber = (num: string) => {
    setDisplay(prev => (prev === '0' ? num : prev + num));
  };

  const handleOperator = (op: string) => {
    setEquation(display + ' ' + op + ' ');
    setDisplay('0');
  };

  const calculate = () => {
    try {
      const fullEquation = equation + display;
      // Note: In a production app, use a safer math parser instead of eval
      const result = eval(fullEquation.replace('×', '*').replace('÷', '/'));
      setDisplay(String(Number(result.toFixed(2))));
      setEquation('');
    } catch (e) {
      setDisplay('Error');
    }
  };

  const clear = () => {
    setDisplay('0');
    setEquation('');
  };

  const backspace = () => {
    setDisplay(prev => (prev.length > 1 ? prev.slice(0, -1) : '0'));
  };

  return (
    <div className="fixed bottom-24 right-4 sm:right-8 z-[200] w-72 glass rounded-[2rem] border border-white/20 shadow-2xl animate-slide-up overflow-hidden">
      {/* Header */}
      <div className="p-4 flex justify-between items-center bg-white/5 border-b border-white/10">
        <div className="flex items-center gap-2 text-sky-400">
          <Hash size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest">ক্যালকুলেটর</span>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
          <X size={18} className="text-slate-400" />
        </button>
      </div>

      {/* Display */}
      <div className="p-6 text-right">
        <div className="text-[10px] text-slate-500 font-bold h-4 overflow-hidden mb-1">{equation}</div>
        <div className="text-3xl font-black text-white truncate">{display}</div>
      </div>

      {/* Keypad */}
      <div className="p-4 grid grid-cols-4 gap-2 bg-black/10">
        <button onClick={clear} className="p-4 rounded-2xl bg-rose-500/20 text-rose-400 font-bold text-xs hover:bg-rose-500/30 transition-all">AC</button>
        <button onClick={backspace} className="p-4 rounded-2xl bg-white/5 text-slate-400 flex items-center justify-center hover:bg-white/10 transition-all"><Delete size={18} /></button>
        <button onClick={() => handleOperator('%')} className="p-4 rounded-2xl bg-white/5 text-sky-400 font-bold hover:bg-white/10 transition-all"><Percent size={18} /></button>
        <button onClick={() => handleOperator('÷')} className="p-4 rounded-2xl bg-sky-500/20 text-sky-400 font-bold text-xl hover:bg-sky-500/30 transition-all">÷</button>

        {['7', '8', '9'].map(n => (
          <button key={n} onClick={() => handleNumber(n)} className="p-4 rounded-2xl bg-white/5 text-white font-bold text-lg hover:bg-white/10 transition-all active:scale-90">{n}</button>
        ))}
        <button onClick={() => handleOperator('×')} className="p-4 rounded-2xl bg-sky-500/20 text-sky-400 font-bold text-xl hover:bg-sky-500/30 transition-all">×</button>

        {['4', '5', '6'].map(n => (
          <button key={n} onClick={() => handleNumber(n)} className="p-4 rounded-2xl bg-white/5 text-white font-bold text-lg hover:bg-white/10 transition-all active:scale-90">{n}</button>
        ))}
        <button onClick={() => handleOperator('-')} className="p-4 rounded-2xl bg-sky-500/20 text-sky-400 font-bold text-xl hover:bg-sky-500/30 transition-all">-</button>

        {['1', '2', '3'].map(n => (
          <button key={n} onClick={() => handleNumber(n)} className="p-4 rounded-2xl bg-white/5 text-white font-bold text-lg hover:bg-white/10 transition-all active:scale-90">{n}</button>
        ))}
        <button onClick={() => handleOperator('+')} className="p-4 rounded-2xl bg-sky-500/20 text-sky-400 font-bold text-xl hover:bg-sky-500/30 transition-all">+</button>

        <button onClick={() => handleNumber('0')} className="col-span-2 p-4 rounded-2xl bg-white/5 text-white font-bold text-lg hover:bg-white/10 transition-all active:scale-90 text-left px-8">0</button>
        <button onClick={() => handleNumber('.')} className="p-4 rounded-2xl bg-white/5 text-white font-bold text-lg hover:bg-white/10 transition-all active:scale-90">.</button>
        <button onClick={calculate} className="p-4 rounded-2xl bg-sky-500 text-white font-black text-xl shadow-lg shadow-sky-500/30 hover:scale-105 transition-all active:scale-95">=</button>
      </div>
    </div>
  );
};

export default CalculatorPopup;
