
import React, { useState } from 'react';
import { 
  User, Download, Upload, Shield, Database, ChevronRight, X, Edit3, 
  Lock, Save, Trash2, Filter, Languages, Coins, Palette, Grid, Bell, Clock, Key, Layout, Mail, Globe, Star, Sun, Moon, Check, Plus, AlertCircle, Camera, Wallet, HandCoins, TrendingUp
} from 'lucide-react';
import { 
  Transaction, Category, UserProfile, Budget, RecurringTransaction, 
  Goal, Debt, Subscription, CurrencyCode, LanguageCode, ThemeColor, DateFormat, Loan, IncomeSource 
} from '../types';
import { CURRENCIES, LANGUAGES } from '../constants';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  transactions: Transaction[]; categories: Category[]; budgets: Budget[];
  recurring: RecurringTransaction[]; goals: Goal[]; debts: Debt[];
  subs: Subscription[]; profile: UserProfile; loans: Loan[];
  incomeSources: IncomeSource[];
  onUpdateProfile: (profile: UserProfile) => void;
  onImportData: (data: any) => void;
  onAddCategory: (cat: Category) => void;
  onUpdateIncomeSources: (sources: IncomeSource[]) => void;
}

const SettingsView: React.FC<Props> = (props) => {
  const [activeModal, setActiveModal] = useState<'profile' | 'pin' | 'appearance' | 'format' | 'reminders' | 'categories' | 'incomeSources' | 'backup' | null>(null);
  
  const [nameInput, setNameInput] = useState(props.profile.name);
  const [usernameInput, setUsernameInput] = useState(props.profile.username || '');
  const [emailInput, setEmailInput] = useState(props.profile.email || '');
  const [avatarInput, setAvatarInput] = useState(props.profile.avatar || '');
  const [pinInput, setPinInput] = useState(props.profile.pin || '');
  
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('📦');

  // Income Source Temp State
  const [newIncName, setNewIncName] = useState('');
  const [newIncIcon, setNewIncIcon] = useState('💰');
  const [newIncCat, setNewIncCat] = useState('Salary');

  const themeColors: { id: ThemeColor; class: string; name: string }[] = [
    { id: 'sky', class: 'bg-sky-500', name: 'Sky' },
    { id: 'emerald', class: 'bg-emerald-500', name: 'Emerald' },
    { id: 'rose', class: 'bg-rose-500', name: 'Rose' },
    { id: 'amber', class: 'bg-amber-500', name: 'Amber' },
  ];

  const handleSaveProfile = () => {
    props.onUpdateProfile({ 
      ...props.profile, 
      name: nameInput, 
      username: usernameInput,
      email: emailInput, 
      avatar: avatarInput 
    });
    setActiveModal(null);
  };

  const handleBackup = () => {
    const data = {
      profile: props.profile,
      transactions: props.transactions,
      categories: props.categories,
      incomeSources: props.incomeSources,
      budgets: props.budgets,
      recurring: props.recurring,
      goals: props.goals,
      debts: props.debts,
      subs: props.subs,
      loans: props.loans
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FinTrack_Backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        props.onImportData(data);
        alert('Data successfully restored!');
      } catch (err) {
        alert('Failed to parse backup file.');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (confirm('আপনি কি নিশ্চিত যে সমস্ত ডাটা মুছে ফেলতে চান? এটি আর ফিরে পাওয়া যাবে না!')) {
      const keys = [
        'fintrack_profile', 'fintrack_transactions', 'fintrack_categories',
        'fintrack_income_sources', 'fintrack_budgets', 'fintrack_recurring', 
        'fintrack_goals', 'fintrack_debts', 'fintrack_loans', 'fintrack_subs',
        'fintrack_investments', 'fintrack_bills', 'fintrack_mess_members',
        'fintrack_mess_bazaars', 'fintrack_mess_meals', 'fintrack_shopping'
      ];
      keys.forEach(k => localStorage.removeItem(k));
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleAddIncomeSource = () => {
    if (!newIncName) return;
    const source: IncomeSource = {
      id: uuidv4(),
      name: newIncName,
      category: newIncCat,
      icon: newIncIcon
    };
    props.onUpdateIncomeSources([...props.incomeSources, source]);
    setNewIncName('');
  };

  const isEn = props.profile.language === 'en';
  const themePrimary = props.profile.themeColor || 'sky';
  const accentColor = `text-${themePrimary}-500`;

  return (
    <div className="space-y-6 pb-28 animate-slide-up">
      <header className="px-2">
        <h2 className="text-3xl font-black">{isEn ? 'Settings' : 'সেটিংস ও প্রোফাইল'}</h2>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">FinTrack Finance Premium</p>
      </header>

      {/* User Profile Summary */}
      <div onClick={() => setActiveModal('profile')} className={`glass p-8 rounded-[2.5rem] border-${themePrimary}-500/20 bg-gradient-to-r from-${themePrimary}-500/10 to-transparent cursor-pointer group relative overflow-hidden flex items-center justify-between`}>
        <div className="flex items-center gap-6 relative z-10">
          <div className={`w-16 h-16 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center overflow-hidden shadow-xl`}>
            {props.profile.avatar ? <img src={props.profile.avatar} className="w-full h-full object-cover" /> : <User size={32} className={accentColor} />}
          </div>
          <div>
            <h3 className="text-xl font-black text-white">{props.profile.name} <Edit3 size={14} className="inline ml-1 text-slate-500" /></h3>
            <p className="text-xs text-slate-400">@{props.profile.username || 'user'}</p>
          </div>
        </div>
        <ChevronRight size={20} className="text-slate-600 group-hover:translate-x-1 transition-transform" />
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Personalization */}
        <section className="space-y-2">
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">{isEn ? 'Personalization' : 'ব্যক্তিগত পছন্দ'}</h4>
          <div className="glass rounded-[2rem] overflow-hidden divide-y divide-white/5 border border-white/5">
             <button onClick={() => setActiveModal('appearance')} className="w-full p-5 flex justify-between items-center hover:bg-white/5 transition-all text-left">
                <div className="flex items-center gap-4">
                   <Palette size={18} className={accentColor} />
                   <span className="text-sm font-bold">{isEn ? 'Appearance' : 'অ্যাপের চেহারা (ডার্ক/লাইট)'}</span>
                </div>
                <ChevronRight size={16} className="text-slate-700" />
             </button>
             <button onClick={() => setActiveModal('categories')} className="w-full p-5 flex justify-between items-center hover:bg-white/5 transition-all text-left">
                <div className="flex items-center gap-4">
                   <Grid size={18} className={accentColor} />
                   <span className="text-sm font-bold">{isEn ? 'Expense Categories' : 'ব্যয় ক্যাটাগরি ম্যানেজমেন্ট'}</span>
                </div>
                <ChevronRight size={16} className="text-slate-700" />
             </button>
             {/* Income Source Entry */}
             <button onClick={() => setActiveModal('incomeSources')} className="w-full p-5 flex justify-between items-center hover:bg-white/5 transition-all text-left">
                <div className="flex items-center gap-4">
                   <TrendingUp size={18} className="text-emerald-400" />
                   <span className="text-sm font-bold">{isEn ? 'Income Sources' : 'আয়ের উৎস ম্যানেজমেন্ট'}</span>
                </div>
                <ChevronRight size={16} className="text-slate-700" />
             </button>
             <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <Globe size={18} className={accentColor} />
                   <span className="text-sm font-bold">{isEn ? 'Language' : 'ভাষা নির্বাচন'}</span>
                </div>
                <select 
                  value={props.profile.language || 'bn'} 
                  onChange={(e) => props.onUpdateProfile({...props.profile, language: e.target.value as LanguageCode})} 
                  className="bg-slate-900 border border-white/10 rounded-xl p-2 text-xs font-bold"
                >
                  {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
                </select>
             </div>
          </div>
        </section>

        {/* Security & System */}
        <section className="space-y-2">
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">{isEn ? 'Security' : 'সিকিউরিটি ও সিস্টেম'}</h4>
          <div className="glass rounded-[2rem] overflow-hidden divide-y divide-white/5 border border-white/5">
             <button onClick={() => setActiveModal('pin')} className="w-full p-5 flex justify-between items-center hover:bg-white/5 transition-all text-left">
                <div className="flex items-center gap-4">
                   <Lock size={18} className={accentColor} />
                   <span className="text-sm font-bold">{isEn ? 'App Lock' : 'পিন লক প্রোটেকশন'}</span>
                </div>
                <ChevronRight size={16} className="text-slate-700" />
             </button>
             <button onClick={() => setActiveModal('format')} className="w-full p-5 flex justify-between items-center hover:bg-white/5 transition-all text-left">
                <div className="flex items-center gap-4">
                   <Coins size={18} className={accentColor} />
                   <span className="text-sm font-bold">{isEn ? 'Currency & Format' : 'মুদ্রা ও তারিখ ফরম্যাট'}</span>
                </div>
                <ChevronRight size={16} className="text-slate-700" />
             </button>
             <button onClick={() => setActiveModal('reminders')} className="w-full p-5 flex justify-between items-center hover:bg-white/5 transition-all text-left">
                <div className="flex items-center gap-4">
                   <Bell size={18} className={accentColor} />
                   <span className="text-sm font-bold">{isEn ? 'Reminders' : 'দৈনিক রিমাইন্ডার'}</span>
                </div>
                <ChevronRight size={16} className="text-slate-700" />
             </button>
          </div>
        </section>

        {/* Data & Backup */}
        <section className="space-y-2">
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">{isEn ? 'Data' : 'ডাটা ব্যাকআপ ও রিসেট'}</h4>
          <div className="glass rounded-[2rem] overflow-hidden divide-y divide-white/5 border border-white/5">
             <button onClick={handleBackup} className="w-full p-5 flex justify-between items-center hover:bg-white/5 transition-all text-left">
                <div className="flex items-center gap-4">
                   <Download size={18} className={accentColor} />
                   <span className="text-sm font-bold">{isEn ? 'Full Backup' : 'সম্পুর্ন ডাটা ব্যাকআপ নিন'}</span>
                </div>
                <ChevronRight size={16} className="text-slate-700" />
             </button>
             <label className="w-full p-5 flex justify-between items-center hover:bg-white/5 transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                   <Upload size={18} className={accentColor} />
                   <span className="text-sm font-bold">{isEn ? 'Restore Backup' : 'ডাটা ইমপোর্ট করুন'}</span>
                </div>
                <input type="file" className="hidden" accept=".json" onChange={handleFileImport} />
                <ChevronRight size={16} className="text-slate-700" />
             </label>
             <button onClick={handleReset} className="w-full p-5 flex justify-between items-center hover:bg-rose-500/5 transition-all text-left group">
                <div className="flex items-center gap-4">
                   <Trash2 size={18} className="text-rose-400" />
                   <span className="text-sm font-bold">{isEn ? 'Reset App' : 'অ্যাপ রিসেট করুন (মুছে ফেলুন)'}</span>
                </div>
                <ChevronRight size={16} className="text-slate-700" />
             </button>
          </div>
        </section>
      </div>

      {/* --- Modals --- */}

      {/* Income Sources Modal */}
      {activeModal === 'incomeSources' && (
        <div className="fixed inset-0 z-[400] bg-black/80 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="glass w-full max-w-sm rounded-[2.5rem] p-8 animate-slide-up relative flex flex-col max-h-[80vh]">
            <button onClick={() => setActiveModal(null)} className="absolute top-6 right-6 p-2 glass rounded-full"><X size={20}/></button>
            <h3 className="text-lg font-black mb-6 flex items-center gap-2"><HandCoins className="text-emerald-400"/> আয়ের উৎসসমূহ</h3>
            
            <div className="flex-1 overflow-y-auto space-y-3 mb-6 no-scrollbar pr-1">
               {props.incomeSources.map(src => (
                 <div key={src.id} className="flex items-center justify-between p-4 glass rounded-2xl border-white/5 group hover:border-emerald-500/30 transition-all">
                    <div className="flex items-center gap-4">
                       <span className="text-2xl w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">{src.icon}</span>
                       <div>
                          <p className="text-sm font-bold text-white">{src.name}</p>
                          <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{src.category}</p>
                       </div>
                    </div>
                    <button 
                      onClick={() => props.onUpdateIncomeSources(props.incomeSources.filter(s => s.id !== src.id))} 
                      className="p-2 text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                 </div>
               ))}
            </div>

            <div className="p-5 bg-slate-900/50 rounded-[2rem] space-y-4 border border-white/5">
               <div className="flex gap-2">
                  <input 
                    value={newIncIcon} 
                    onChange={e=>setNewIncIcon(e.target.value)} 
                    placeholder="Icon" 
                    className="w-14 bg-white/5 border border-white/10 rounded-xl p-3 text-center text-xl focus:border-emerald-500 outline-none transition-all"
                  />
                  <input 
                    value={newIncName} 
                    onChange={e=>setNewIncName(e.target.value)} 
                    placeholder="উৎসের নাম (যেমন: বেতন)" 
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:border-emerald-500 outline-none transition-all"
                  />
               </div>
               <div className="grid grid-cols-2 gap-2">
                 <select 
                  value={newIncCat} 
                  onChange={e => setNewIncCat(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-[10px] font-bold uppercase tracking-widest outline-none focus:border-emerald-500"
                 >
                   <option value="Salary">Salary</option>
                   <option value="Freelance">Freelance</option>
                   <option value="Investment">Investment</option>
                   <option value="Gift">Gift</option>
                   <option value="Business">Business</option>
                   <option value="Rental">Rental</option>
                   <option value="Other">Other</option>
                 </select>
                 <button 
                    onClick={handleAddIncomeSource}
                    disabled={!newIncName}
                    className="w-full py-3 bg-emerald-500 text-white rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50 transition-all"
                 >
                    <Plus size={14}/> যোগ করুন
                 </button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Categories Modal */}
      {activeModal === 'categories' && (
        <div className="fixed inset-0 z-[400] bg-black/80 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="glass w-full max-w-sm rounded-[2.5rem] p-8 animate-slide-up relative flex flex-col max-h-[80vh]">
            <button onClick={() => setActiveModal(null)} className="absolute top-6 right-6 p-2 glass rounded-full"><X size={20}/></button>
            <h3 className="text-lg font-black mb-6">ব্যয় ক্যাটাগরি লিস্ট</h3>
            <div className="flex-1 overflow-y-auto space-y-2 mb-6 no-scrollbar">
               {props.categories.map(cat => (
                 <div key={cat.id} className="flex items-center justify-between p-4 glass rounded-2xl border-white/5">
                    <div className="flex items-center gap-4">
                       <span className="text-xl w-10 h-10 bg-sky-500/10 rounded-xl flex items-center justify-center">{cat.icon}</span>
                       <span className="text-sm font-bold">{cat.name}</span>
                    </div>
                 </div>
               ))}
            </div>
            <div className="p-5 bg-slate-900/50 rounded-[2rem] space-y-3 border border-white/5">
               <div className="flex gap-2">
                  <input value={newCatIcon} onChange={e=>setNewCatIcon(e.target.value)} placeholder="Icon" className="w-14 bg-white/5 border border-white/10 rounded-xl p-3 text-center text-xl outline-none focus:border-sky-500"/>
                  <input value={newCatName} onChange={e=>setNewCatName(e.target.value)} placeholder="ক্যাটাগরি নাম" className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-sky-500"/>
               </div>
               <button 
                  onClick={() => {if(!newCatName) return; props.onAddCategory({ id: uuidv4(), name: newCatName, icon: newCatIcon, color: 'bg-sky-500' }); setNewCatName('');}}
                  className="w-full py-3 bg-sky-500 rounded-xl font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all"
               >
                  <Plus size={16}/> যোগ করুন
               </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Rest of the modals (Profile, PIN, etc.) stay the same --- */}
      {activeModal === 'profile' && (
        <div className="fixed inset-0 z-[400] bg-black/80 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="glass w-full max-w-sm rounded-[2.5rem] p-8 animate-slide-up relative">
            <button onClick={() => setActiveModal(null)} className="absolute top-6 right-6 p-2 glass rounded-full"><X size={20}/></button>
            <h3 className="text-lg font-black mb-6">প্রোফাইল সেটিংস</h3>
            <div className="space-y-4">
              <input value={nameInput} onChange={e=>setNameInput(e.target.value)} placeholder="নাম" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-sky-500"/>
              <input value={usernameInput} onChange={e=>setUsernameInput(e.target.value)} placeholder="ইউজারনেম" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-sky-500"/>
              <input value={emailInput} onChange={e=>setEmailInput(e.target.value)} placeholder="ইমেইল" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-sky-500"/>
              <input value={avatarInput} onChange={e=>setAvatarInput(e.target.value)} placeholder="ছবি URL" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-sky-500"/>
              <button onClick={handleSaveProfile} className={`w-full py-4 bg-${themePrimary}-500 rounded-2xl font-bold uppercase text-xs tracking-widest active:scale-95 transition-all`}>আপডেট করুন</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsView;
