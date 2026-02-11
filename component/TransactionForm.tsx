
import React, { useState, useRef } from 'react';
import { Camera, Mic, X, Hash, Paperclip, Repeat, Image as ImageIcon, Trash2, Globe, Plus, Calendar } from 'lucide-react';
import { Transaction, PaymentMode, TransactionType, Category, Frequency, CurrencyCode, IncomeSource } from '../types';
import { PAYMENT_MODES, MOODS, CURRENCIES } from '../constants';
import { scanReceipt, processVoiceCommand } from '../services/gemini';

interface Props {
  onClose: () => void;
  onSubmit: (transaction: Omit<Transaction, 'id'> & { recurringFrequency?: Frequency }) => void;
  categories: Category[];
  incomeSources: IncomeSource[];
}

const TransactionForm: React.FC<Props> = ({ onClose, onSubmit, categories, incomeSources }) => {
  const getLocalDate = () => {
    const d = new Date();
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('T')[0];
  };

  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<CurrencyCode>('BDT');
  const [type, setType] = useState<TransactionType>('Expense');
  const [category, setCategory] = useState(type === 'Expense' ? categories[0]?.name : incomeSources[0]?.name || '');
  const [date, setDate] = useState(getLocalDate());
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('Cash');
  const [note, setNote] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [mood, setMood] = useState('😊');
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState<Frequency>('Monthly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [attachment, setAttachment] = useState<string | null>(null);
  
  const ocrInputRef = useRef<HTMLInputElement>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File, isOcr: boolean) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setAttachment(base64);

      if (isOcr) {
        setIsProcessing(true);
        const result = await scanReceipt(base64);
        if (result) {
          if (result.amount) setAmount(result.amount.toString());
          if (result.date) setDate(result.date);
          if (result.category) setCategory(result.category);
          if (result.note) setNote(result.note);
        }
        setIsProcessing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const startVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("ভয়েস কমান্ড এই ব্রাউজারে সাপোর্ট করে না।");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'bn-BD';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      setIsProcessing(true);
      const parsed = await processVoiceCommand(transcript);
      if (parsed) {
        if (parsed.amount) setAmount(parsed.amount.toString());
        if (parsed.category) setCategory(parsed.category);
        if (parsed.note) setNote(parsed.note);
        if (parsed.type) setType(parsed.type);
      }
      setIsProcessing(false);
    };
    recognition.start();
  };

  const handleAddTag = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (tagInput.trim()) {
      const cleanTag = tagInput.trim().replace(/^#/, '');
      if (!tags.includes(cleanTag)) {
        setTags([...tags, cleanTag]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    onSubmit({
      amount: parseFloat(amount),
      currency,
      type,
      category,
      date,
      paymentMode,
      note,
      tags,
      mood,
      attachment: attachment || undefined,
      recurringFrequency: isRecurring ? frequency : undefined
    });
    onClose();
  };

  // Switch Category logic based on Type
  const currentOptions = type === 'Expense' ? categories : incomeSources;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full max-w-lg glass sm:rounded-3xl rounded-t-3xl overflow-hidden animate-slide-up max-h-[95vh] overflow-y-auto no-scrollbar">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">লেনদেন যোগ করুন</h2>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
              <X size={24} />
            </button>
          </div>

          <div className="flex gap-2 mb-6 p-1 glass rounded-xl">
            <button 
              type="button"
              onClick={() => { setType('Expense'); setCategory(categories[0]?.name || ''); }}
              className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all ${type === 'Expense' ? 'bg-rose-500 text-white shadow-lg' : 'text-slate-400'}`}
            >
              ব্যয় (Expense)
            </button>
            <button 
              type="button"
              onClick={() => { setType('Income'); setCategory(incomeSources[0]?.name || ''); }}
              className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all ${type === 'Income' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400'}`}
            >
              আয় (Income)
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Amount Section */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <select 
                  value={currency} 
                  onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                  className="bg-sky-500/10 text-sky-400 font-bold border-none focus:ring-0 text-xl py-0 rounded"
                >
                  {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.symbol}</option>)}
                </select>
              </div>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 pl-20 pr-6 text-4xl font-bold focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all placeholder:text-slate-600"
                autoFocus
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                <button type="button" onClick={() => ocrInputRef.current?.click()} className="p-3 glass rounded-xl text-sky-400 hover:bg-sky-500/20 transition-colors"><Camera size={24} /></button>
                <button type="button" onClick={startVoice} className={`p-3 glass rounded-xl transition-colors ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'text-sky-400 hover:bg-sky-500/20'}`}><Mic size={24} /></button>
              </div>
            </div>

            <input type="file" ref={ocrInputRef} className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0], true)} />
            <input type="file" ref={attachmentInputRef} className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0], false)} />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{type === 'Expense' ? 'ক্যাটাগরি' : 'আয়ের উৎস'}</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-3 focus:outline-none text-sm"
                >
                  {currentOptions.map(opt => <option key={opt.id} value={opt.name} className="bg-slate-900">{opt.icon} {opt.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1"><Calendar size={12}/> তারিখ</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none text-sm text-white"/>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">পেমেন্ট মোড</label>
                <select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value as PaymentMode)} className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-3 focus:outline-none text-sm">
                  {PAYMENT_MODES.map(m => <option key={m} value={m} className="bg-slate-900">{m}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">মুড</label>
                <div className="flex gap-2 glass p-1 rounded-xl justify-around">
                  {MOODS.map(m => (
                    <button key={m} type="button" onClick={() => setMood(m)} className={`text-xl p-1 rounded-lg transition-all ${mood === m ? 'bg-white/20 scale-125' : 'grayscale opacity-50'}`}>{m}</button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2"><Hash size={14} /> হ্যাশ ট্যাগ</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map(tag => (
                  <span key={tag} className="bg-sky-500/10 text-sky-400 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">#{tag}<button type="button" onClick={() => removeTag(tag)} className="hover:text-rose-500"><X size={12} /></button></span>
                ))}
              </div>
              <div className="relative">
                <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())} placeholder="ট্যাগ লিখুন (যেমন: ঈদ_শপিং)" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none pr-12 text-sm"/>
                <button type="button" onClick={() => handleAddTag()} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-sky-400 hover:bg-sky-500/10 rounded-lg"><Plus size={18} /></button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2"><Globe size={14} /> নোট</label>
              <textarea value={note} onChange={(e) => setNote(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 h-20 focus:outline-none resize-none text-sm" placeholder="লেনদেনের বিস্তারিত এখানে লিখুন..."/>
            </div>

            <button disabled={isProcessing} type="submit" className="w-full py-4 bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/20 active:scale-95 transition-all">
              {isProcessing ? 'প্রসেসিং হচ্ছে...' : 'সেভ করুন'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TransactionForm;
