
import React, { useState, useMemo } from 'react';
import { 
  Search, Filter, Trash2, Receipt, Repeat, History, Clock, 
  FileDown, CheckSquare, Square, X, Check, Tag, Wallet,
  ArrowUpCircle, ArrowDownCircle
} from 'lucide-react';
import { Transaction, Category, CurrencyCode, UserProfile, RecurringTransaction, PaymentMode } from '../types';
import { PAYMENT_MODES, MOCK_RATES } from '../constants';
import CurrencyText from '../components/CurrencyText';

interface Props {
  transactions: Transaction[];
  recurringTransactions: RecurringTransaction[];
  categories: Category[];
  onViewReceipt: (tx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  onDeleteTransactions?: (ids: string[]) => void; // Added for bulk delete
  onDeleteRecurring: (id: string) => void;
  profile: UserProfile;
}

const TransactionsView: React.FC<Props> = ({ 
  transactions, 
  recurringTransactions,
  categories, 
  onViewReceipt, 
  onDeleteTransaction, 
  onDeleteTransactions,
  onDeleteRecurring,
  profile 
}) => {
  const [activeTab, setActiveTab] = useState<'history' | 'recurring'>('history');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'All' | 'Income' | 'Expense'>('All');
  const [selectedMode, setSelectedMode] = useState<'All' | PaymentMode>('All');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  // Bulk Edit State
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const isPrivacyMode = !!profile.isPrivacyMode;
  const baseCurrency = profile.baseCurrency || 'BDT';

  const convertToMain = (amount: number, from: CurrencyCode) => {
    if (from === baseCurrency) return amount;
    const amountInBDT = amount * (MOCK_RATES[from] || 1);
    return amountInBDT / (MOCK_RATES[baseCurrency] || 1);
  };

  // Extract all unique tags for filter chips
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    transactions.forEach(t => t.tags?.forEach(tag => tags.add(tag)));
    return Array.from(tags).slice(0, 10); // Show top 10 tags
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const lowerSearch = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        t.note.toLowerCase().includes(lowerSearch) || 
        t.category.toLowerCase().includes(lowerSearch) ||
        t.tags?.some(tag => tag.toLowerCase().includes(lowerSearch.replace('#', '')));
      
      const matchesType = selectedType === 'All' || t.type === selectedType;
      const matchesMode = selectedMode === 'All' || t.paymentMode === selectedMode;
      const matchesTag = !selectedTag || t.tags?.includes(selectedTag);
      
      return matchesSearch && matchesType && matchesMode && matchesTag;
    });
  }, [transactions, searchTerm, selectedType, selectedMode, selectedTag]);

  const stats = useMemo(() => {
    const inc = filteredTransactions.filter(t => t.type === 'Income').reduce((s, t) => s + convertToMain(t.amount, t.currency || 'BDT'), 0);
    const exp = filteredTransactions.filter(t => t.type === 'Expense').reduce((s, t) => s + convertToMain(t.amount, t.currency || 'BDT'), 0);
    return { income: inc, expense: exp, balance: inc - exp };
  }, [filteredTransactions, baseCurrency]);

  const toggleSelection = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
    if (next.size > 0) setIsSelectionMode(true);
    else setIsSelectionMode(false);
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
    setIsSelectionMode(false);
  };

  const handleBulkDelete = () => {
    if (confirm(`${selectedIds.size}টি লেনদেন মুছে ফেলতে চান?`)) {
      selectedIds.forEach(id => onDeleteTransaction(id));
      clearSelection();
    }
  };

  const exportPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-slide-up pb-24">
      {/* Header with Print/PDF Action */}
      <div className="flex justify-between items-center px-2 print-hidden">
         <div className="flex p-1 glass rounded-2xl w-full mr-4">
            <button 
               onClick={() => setActiveTab('history')} 
               className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'history' ? 'bg-sky-500 text-white shadow-lg' : 'text-slate-500'}`}
            >
               <History size={14} /> লেনদেনের ইতিহাস
            </button>
            <button 
               onClick={() => setActiveTab('recurring')} 
               className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'recurring' ? 'bg-sky-500 text-white shadow-lg' : 'text-slate-500'}`}
            >
               <Repeat size={14} /> অটো-লেনদেন
            </button>
         </div>
         <button 
           onClick={exportPDF}
           className="p-3 glass rounded-2xl text-sky-400 hover:bg-sky-500/10 transition-all shadow-xl"
           title="PDF রিপোর্ট"
         >
           <FileDown size={22} />
         </button>
      </div>

      {activeTab === 'history' ? (
        <>
          {/* Advanced Search & Bulk Bar */}
          <div className="sticky top-20 z-40 bg-inherit pt-2 pb-4 space-y-4 print-hidden">
            {isSelectionMode ? (
              <div className="flex items-center justify-between bg-sky-500 p-4 rounded-2xl shadow-xl animate-slide-up text-white">
                 <div className="flex items-center gap-4">
                    <button onClick={clearSelection} className="p-1 hover:bg-white/20 rounded-full"><X size={20}/></button>
                    <span className="font-black text-sm uppercase tracking-widest">{selectedIds.size} Selected</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <button onClick={handleBulkDelete} className="px-4 py-2 bg-rose-500 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 shadow-lg"><Trash2 size={14}/> মুছে ফেলুন</button>
                 </div>
              </div>
            ) : (
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input 
                  type="text" placeholder="নোট বা #ট্যাগ দিয়ে খুঁজুন..." 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-sky-500/50 text-sm"
                  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"><X size={18}/></button>}
              </div>
            )}

            {/* Filter Chips - Horizontal Scrollable */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 px-1">
               {/* Type Filters */}
               <button 
                  onClick={() => setSelectedType(selectedType === 'Income' ? 'All' : 'Income')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${selectedType === 'Income' ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-white/5 text-slate-400 border-white/10'}`}
               >
                  <ArrowUpCircle size={12}/> আয় (Income)
               </button>
               <button 
                  onClick={() => setSelectedType(selectedType === 'Expense' ? 'All' : 'Expense')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${selectedType === 'Expense' ? 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/20' : 'bg-white/5 text-slate-400 border-white/10'}`}
               >
                  <ArrowDownCircle size={12}/> ব্যয় (Expense)
               </button>

               {/* Payment Mode Filters */}
               {PAYMENT_MODES.map(mode => (
                  <button 
                    key={mode}
                    onClick={() => setSelectedMode(selectedMode === mode ? 'All' : mode as any)}
                    className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${selectedMode === mode ? 'bg-sky-500 text-white border-sky-500 shadow-lg shadow-sky-500/20' : 'bg-white/5 text-slate-400 border-white/10'}`}
                  >
                    {mode}
                  </button>
               ))}

               {/* Tag Filters */}
               {allTags.map(tag => (
                  <button 
                    key={tag}
                    onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${selectedTag === tag ? 'bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-500/20' : 'bg-white/5 text-slate-400 border-white/10'}`}
                  >
                    <Tag size={10}/> #{tag}
                  </button>
               ))}
            </div>
          </div>

          {/* Quick Stats Summary */}
          <div className="grid grid-cols-3 gap-3 print:grid-cols-3 print:mb-8">
            <div className="glass p-3 rounded-2xl border-emerald-500/20 bg-emerald-500/5 print:border-slate-200">
              <p className="text-[8px] text-slate-500 font-black mb-1 uppercase tracking-tighter">আয়</p>
              <p className="text-sm font-black text-emerald-500 print:text-emerald-700"><CurrencyText amount={stats.income} currency={baseCurrency} isPrivacyMode={isPrivacyMode} /></p>
            </div>
            <div className="glass p-3 rounded-2xl border-rose-500/20 bg-rose-500/5 print:border-slate-200">
              <p className="text-[8px] text-slate-500 font-black mb-1 uppercase tracking-tighter">ব্যয়</p>
              <p className="text-sm font-black text-rose-500 print:text-rose-700"><CurrencyText amount={stats.expense} currency={baseCurrency} isPrivacyMode={isPrivacyMode} /></p>
            </div>
            <div className="glass p-3 rounded-2xl border-sky-500/20 bg-sky-500/5 print:border-slate-200">
              <p className="text-[8px] text-slate-500 font-black mb-1 uppercase tracking-tighter">নিট</p>
              <p className="text-sm font-black text-sky-400 print:text-sky-700"><CurrencyText amount={stats.balance} currency={baseCurrency} isPrivacyMode={isPrivacyMode} /></p>
            </div>
          </div>

          {/* Transactions List */}
          <div className="space-y-3 print:space-y-2">
            {filteredTransactions.map(t => (
              <div 
                key={t.id} 
                onClick={() => isSelectionMode && toggleSelection(t.id)}
                className={`glass p-4 rounded-3xl border-white/5 flex justify-between items-center group transition-all print:border-slate-200 print:bg-white print:text-black ${selectedIds.has(t.id) ? 'border-sky-500 bg-sky-500/10' : ''}`}
              >
                <div className="flex items-center gap-4">
                  {/* Selection Checkbox */}
                  <div 
                    onClick={(e) => { e.stopPropagation(); toggleSelection(t.id); }}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all print-hidden ${selectedIds.has(t.id) ? 'bg-sky-500 text-white' : 'bg-white/5 border border-white/10 group-hover:border-sky-500/50'}`}
                  >
                    {selectedIds.has(t.id) ? <Check size={14} strokeWidth={4}/> : <div className="w-2 h-2 rounded-full bg-white/10"/>}
                  </div>

                  <div className="flex items-center gap-4 cursor-pointer" onClick={(e) => { if(!isSelectionMode) { e.stopPropagation(); onViewReceipt(t); } }}>
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl bg-slate-800/50 border border-white/5 print:bg-slate-100 print:border-slate-200">{t.mood || '💸'}</div>
                    <div>
                      <h4 className="font-bold text-sm">{t.note || t.category}</h4>
                      <p className="text-[9px] text-slate-500 uppercase font-black print:text-slate-600">{t.date} • {t.paymentMode}</p>
                      {/* Show Tags */}
                      {t.tags && t.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                           {t.tags.map(tag => (
                             <span key={tag} className="text-[7px] font-black uppercase text-sky-400 bg-sky-400/10 px-1.5 py-0.5 rounded-md">#{tag}</span>
                           ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right flex items-center gap-4">
                  <div onClick={() => !isSelectionMode && onViewReceipt(t)} className="cursor-pointer">
                    <p className={`font-black text-sm ${t.type === 'Income' ? 'text-emerald-500 print:text-emerald-700' : 'text-rose-500 print:text-rose-700'}`}>
                      {t.type === 'Income' ? '+' : '-'} <CurrencyText amount={t.amount} currency={t.currency || 'BDT'} isPrivacyMode={isPrivacyMode} />
                    </p>
                    <p className="text-[8px] text-slate-500 uppercase font-black print:text-slate-600">{t.category}</p>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); if(confirm('ডিলিট করবেন?')) onDeleteTransaction(t.id); }} 
                    className="p-2 text-slate-600 hover:text-rose-500 print-hidden"
                  >
                    <Trash2 size={16}/>
                  </button>
                </div>
              </div>
            ))}

            {filteredTransactions.length === 0 && (
              <div className="py-20 flex flex-col items-center justify-center gap-4 text-slate-500">
                <Search size={48} className="opacity-10" />
                <p className="font-bold text-sm">কোন লেনদেন খুঁজে পাওয়া যায়নি</p>
                <button onClick={() => { setSearchTerm(''); setSelectedType('All'); setSelectedMode('All'); setSelectedTag(null); }} className="text-sky-400 text-xs font-black uppercase tracking-widest">সব ফিল্টার ক্লিয়ার করুন</button>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <div className="px-2">
            <h3 className="text-lg font-black flex items-center gap-2"><Repeat className="text-sky-400" /> অটোমেটিক পুনরাবৃত্তি</h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">আপনার নিয়মিত খরচগুলো এখান থেকে ম্যানেজ করুন</p>
          </div>

          <div className="space-y-3">
            {recurringTransactions.map(rt => (
              <div key={rt.id} className="glass p-5 rounded-[2rem] border-white/5 flex justify-between items-center group hover:border-sky-500/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    <Repeat size={24} />
                    <span className="text-[8px] font-black uppercase">{rt.frequency}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{rt.note || rt.category}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${rt.type === 'Income' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                        {rt.type}
                      </span>
                      <span className="text-[9px] text-slate-500 font-black flex items-center gap-1 uppercase">
                        <Clock size={10} /> {rt.frequency}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className={`font-black text-sm ${rt.type === 'Income' ? 'text-emerald-500' : 'text-rose-400'}`}>
                      <CurrencyText amount={rt.amount} currency={rt.currency || 'BDT'} isPrivacyMode={isPrivacyMode} />
                    </p>
                    <p className="text-[8px] text-slate-500 font-black uppercase">{rt.category}</p>
                  </div>
                  <button 
                    onClick={() => confirm('এই অটো-পেমেন্ট ডিলিট করবেন?') && onDeleteRecurring(rt.id)} 
                    className="p-3 bg-white/5 rounded-xl text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                  >
                    <Trash2 size={18}/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsView;
