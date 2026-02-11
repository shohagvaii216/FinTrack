
import React, { useState, useMemo } from 'react';
// Added missing icons: X, Check, RefreshCw
import { 
  CreditCard, Coins, Repeat, RefreshCcw, Landmark, Package, 
  ReceiptText, ChevronLeft, Plus, Trash2, ArrowUpRight, 
  ArrowDownRight, Calculator, CheckCircle2, TrendingUp, 
  BarChart3, PieChart, Info, DollarSign, Calendar, TrendingDown,
  ShieldCheck, Wallet, Landmark as BankIcon, UserCircle2, 
  CheckCircle, Clock, AlertCircle, Sparkles, BarChart, Bot,
  User, UserPlus, Milestone, Banknote, CalendarCheck2, History,
  X, Check, RefreshCw
} from 'lucide-react';
import { 
  Goal, Debt, Subscription, Transaction, Investment, UserProfile, 
  CurrencyCode, Loan 
} from '../types';
import { v4 as uuidv4 } from 'uuid';
import { MOCK_RATES, BD_TAX_CONFIG, ZAKAT_RATE } from '../constants';
import CurrencyText from '../components/CurrencyText';
import { 
  ResponsiveContainer, PieChart as RePieChart, Pie, Cell, 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip,
  BarChart as ReBarChart, Bar
} from 'recharts';

interface Props {
  goals: Goal[]; setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
  debts: Debt[]; setDebts: React.Dispatch<React.SetStateAction<Debt[]>>;
  loans: Loan[]; setLoans: React.Dispatch<React.SetStateAction<Loan[]>>;
  subscriptions: Subscription[]; setSubscriptions: React.Dispatch<React.SetStateAction<Subscription[]>>;
  investments: Investment[]; setInvestments: React.Dispatch<React.SetStateAction<Investment[]>>;
  transactions: Transaction[]; profile: UserProfile;
  onOpenAi: () => void;
}

const FinancialToolsView: React.FC<Props> = (props) => {
  const [activeTool, setActiveTool] = useState<string | null>(null);

  const tools = [
    { id: 'ai', label: 'AI অ্যাসিস্ট্যান্ট', icon: Bot, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { id: 'reports', label: 'পরিসংখ্যান ও রিপোর্ট', icon: BarChart3, color: 'text-sky-400', bg: 'bg-sky-500/10' },
    { id: 'loans', label: 'লোন ম্যানেজার', icon: CreditCard, color: 'text-rose-400', bg: 'bg-rose-500/10' },
    { id: 'zakat', label: 'যাকাত ক্যালকুলেটর', icon: Coins, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { id: 'debts', label: 'ধার ও পাওনা', icon: Landmark, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { id: 'savings', label: 'সেভিং ও সম্পদ', icon: Package, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { id: 'tax', label: 'ট্যাক্স ক্যালকুলেটর', icon: ReceiptText, color: 'text-slate-400', bg: 'bg-slate-500/10' },
    { id: 'convert', label: 'কারেন্সি কনভার্টার', icon: RefreshCcw, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { id: 'subs', label: 'সাবস্ক্রিপশন', icon: Repeat, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ];

  const handleToolClick = (id: string) => {
    if (id === 'ai') {
      props.onOpenAi();
      return;
    }
    setActiveTool(id);
  };

  const renderToolContent = () => {
    switch (activeTool) {
      case 'reports': return <ReportsView transactions={props.transactions} profile={props.profile} />;
      case 'loans': return <LoanManager loans={props.loans} setLoans={props.setLoans} profile={props.profile} />;
      case 'zakat': return <ZakatCalculator profile={props.profile} transactions={props.transactions} investments={props.investments} />;
      case 'convert': return <CurrencyConverter profile={props.profile} />;
      case 'debts': return <DebtManager debts={props.debts} setDebts={props.setDebts} profile={props.profile} />;
      case 'subs': return <SubscriptionTracker subs={props.subscriptions} setSubs={props.setSubscriptions} profile={props.profile} />;
      case 'savings': return <AssetManager investments={props.investments} setInvestments={props.setInvestments} profile={props.profile} />;
      case 'tax': return <TaxCalculator profile={props.profile} />;
      default: return null;
    }
  };

  if (activeTool) {
    return (
      <div className="space-y-6 animate-slide-up pb-24">
        <button onClick={() => setActiveTool(null)} className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors group">
          <div className="w-10 h-10 glass rounded-xl flex items-center justify-center group-hover:bg-white/10 transition-all">
            <ChevronLeft size={20}/>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">টুলস ড্যাশবোর্ড</span>
        </button>
        {renderToolContent()}
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24 animate-slide-up">
      <header className="px-2">
        <h2 className="text-3xl font-black mb-1">Financial Hub</h2>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">FinTrack Premium Tools Grid</p>
      </header>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
        {tools.map(tool => (
          <button 
            key={tool.id} 
            onClick={() => handleToolClick(tool.id)}
            className={`aspect-square glass rounded-[2.5rem] flex flex-col items-center justify-center gap-3 transition-all active:scale-95 hover:border-${tool.color.split('-')[1]}-500/50 shadow-xl group border-white/5`}
          >
            <div className={`w-12 h-12 ${tool.bg} rounded-2xl flex items-center justify-center ${tool.color} group-hover:scale-110 transition-transform`}>
              <tool.icon size={24} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-center px-2 leading-tight text-slate-400 group-hover:text-white transition-colors">
              {tool.label}
            </span>
          </button>
        ))}
      </div>

      <div className="glass p-8 rounded-[3.5rem] bg-gradient-to-br from-indigo-500/10 to-transparent border-indigo-500/20 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-5 rotate-12"><ShieldCheck size={200}/></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400"><TrendingUp size={20}/></div>
             <h3 className="font-black uppercase tracking-widest text-[10px]">Financial Intelligence</h3>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed font-medium mb-6">FinTrack AI আপনার খরচ বিশ্লেষণ করে বাজেট ভারসাম্য বজায় রাখতে সাহায্য করে।</p>
          <button onClick={() => setActiveTool('reports')} className="px-6 py-4 bg-indigo-500 rounded-2xl text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-indigo-500/20 active:scale-95 transition-all">বিস্তারিত বিশ্লেষণ</button>
        </div>
      </div>
    </div>
  );
};

// --- Reports View Component ---
const ReportsView = ({ transactions, profile }: { transactions: Transaction[], profile: UserProfile }) => {
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');

  const filterTransactionsByPeriod = (txs: Transaction[]) => {
    const now = new Date();
    if (period === 'weekly') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return txs.filter(t => new Date(t.date) >= weekAgo);
    }
    if (period === 'monthly') {
      const currentMonth = now.toISOString().slice(0, 7);
      return txs.filter(t => t.date.startsWith(currentMonth));
    }
    if (period === 'yearly') {
      const currentYear = now.getFullYear().toString();
      return txs.filter(t => t.date.startsWith(currentYear));
    }
    return txs;
  };

  const currentTxs = useMemo(() => filterTransactionsByPeriod(transactions), [transactions, period]);
  const expenses = useMemo(() => currentTxs.filter(t => t.type === 'Expense'), [currentTxs]);
  const incomes = useMemo(() => currentTxs.filter(t => t.type === 'Income'), [currentTxs]);
  
  const totalExpense = useMemo(() => expenses.reduce((s, t) => s + t.amount, 0), [expenses]);
  const totalIncome = useMemo(() => incomes.reduce((s, t) => s + t.amount, 0), [incomes]);

  const categoryStats = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach(t => { map[t.category] = (map[t.category] || 0) + t.amount; });
    return Object.entries(map).map(([name, value]) => ({ 
      name, 
      value, 
      percent: totalExpense > 0 ? (value / totalExpense) * 100 : 0 
    })).sort((a, b) => b.value - a.value);
  }, [expenses, totalExpense]);

  const barData = useMemo(() => {
    return [
      { name: 'আয়', amount: totalIncome, fill: '#10b981' },
      { name: 'ব্যয়', amount: totalExpense, fill: '#f43f5e' },
      { name: 'নিট', amount: totalIncome - totalExpense, fill: '#38bdf8' }
    ];
  }, [totalIncome, totalExpense]);

  const trendData = useMemo(() => {
    const map: Record<string, { income: number, expense: number }> = {};
    currentTxs.forEach(t => {
      if (!map[t.date]) map[t.date] = { income: 0, expense: 0 };
      if (t.type === 'Income') map[t.date].income += t.amount;
      else map[t.date].expense += t.amount;
    });
    return Object.entries(map).map(([date, vals]) => ({ 
      date: date.slice(8, 10), 
      ...vals 
    })).sort((a, b) => a.date.localeCompare(b.date));
  }, [currentTxs]);

  const COLORS = ['#38bdf8', '#818cf8', '#fbbf24', '#f472b6', '#34d399', '#94a3b8'];

  return (
    <div className="space-y-6">
      <div className="flex p-1 glass rounded-2xl">
        {['weekly', 'monthly', 'yearly'].map(p => (
          <button 
            key={p} 
            onClick={() => setPeriod(p as any)} 
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${period === p ? 'bg-sky-500 text-white' : 'text-slate-500'}`}
          >
            {p === 'weekly' ? 'সাপ্তাহিক' : p === 'monthly' ? 'মাসিক' : 'বাৎসরিক'}
          </button>
        ))}
      </div>

      <div className="glass p-6 rounded-[3rem] border-white/5">
         <h3 className="text-sm font-bold mb-6 flex items-center gap-2"><BarChart size={18} className="text-emerald-400"/> আয় বনাম ব্যয় (সারসংক্ষেপ)</h3>
         <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
               <ReBarChart data={barData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
                  <YAxis hide />
                  <ReTooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', fontSize: '10px' }} />
                  <Bar dataKey="amount" radius={[10, 10, 0, 0]} />
               </ReBarChart>
            </ResponsiveContainer>
         </div>
      </div>

      <div className="glass p-6 rounded-[3rem] border-white/5 flex flex-col items-center">
        <h3 className="text-sm font-bold mb-4 self-start flex items-center gap-2"><PieChart size={18} className="text-sky-400"/> খাতেরভিত্তিক ব্যয়</h3>
        <div className="h-64 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <RePieChart>
              <Pie data={categoryStats} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                {categoryStats.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <ReTooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', fontSize: '10px' }} />
            </RePieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
             <span className="text-[10px] font-black text-slate-500 uppercase">মোট ব্যয়</span>
             <span className="text-xl font-black">৳{totalExpense.toLocaleString()}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4 w-full px-4">
           {categoryStats.map((cat, i) => (
             <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                   <span className="text-[10px] font-bold text-slate-400">{cat.name}</span>
                </div>
                <span className="text-[10px] font-black text-white">{cat.percent.toFixed(0)}%</span>
             </div>
           ))}
        </div>
      </div>

      <div className="glass p-6 rounded-[3rem] border-white/5">
        <h3 className="text-sm font-bold mb-6 flex items-center gap-2"><TrendingUp size={18} className="text-sky-400"/> ব্যয়ের ট্রেন্ড</h3>
        <div className="h-48 w-full">
           <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                 <defs>
                    <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                 <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                 <YAxis hide />
                 <ReTooltip />
                 <Area type="monotone" dataKey="expense" stroke="#f43f5e" fillOpacity={1} fill="url(#colorAmt)" strokeWidth={3} />
              </AreaChart>
           </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// --- Debt Manager Redesign ---
const DebtManager = ({ debts, setDebts, profile }: { debts: Debt[], setDebts: any, profile: UserProfile }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'Lent' | 'Borrowed'>('Borrowed');
  const [filter, setFilter] = useState<'Active' | 'Settled'>('Active');

  const addDebt = () => {
    if (!name || !amount) return;
    const newDebt: Debt = { id: uuidv4(), personName: name, amount: parseFloat(amount), type, date: new Date().toISOString(), isSettled: false, note: '' };
    setDebts([newDebt, ...debts]); setShowAdd(false); setName(''); setAmount('');
  };

  const totals = useMemo(() => {
    const lent = debts.filter(d => d.type === 'Lent' && !d.isSettled).reduce((s, d) => s + d.amount, 0);
    const borrowed = debts.filter(d => d.type === 'Borrowed' && !d.isSettled).reduce((s, d) => s + d.amount, 0);
    return { lent, borrowed };
  }, [debts]);

  const filteredDebts = debts.filter(d => filter === 'Settled' ? d.isSettled : !d.isSettled);

  const toggleSettle = (id: string) => {
    setDebts(debts.map(d => d.id === id ? { ...d, isSettled: !d.isSettled } : d));
  };

  const deleteDebt = (id: string) => {
    if(confirm('আপনি কি এই তথ্যটি ডিলিট করতে চান?')) {
        setDebts(debts.filter(d => d.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Visual Debt Balance Header */}
      <div className="glass p-8 rounded-[3.5rem] bg-gradient-to-br from-indigo-500/10 to-transparent border-indigo-500/20 relative overflow-hidden">
         <div className="absolute -right-6 -bottom-6 opacity-5 rotate-12"><Landmark size={180}/></div>
         <div className="relative z-10 flex flex-col gap-8">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="font-black text-[10px] uppercase tracking-widest text-indigo-400 mb-1">নিট দেনা-পাওনা</h3>
                    <h2 className={`text-4xl font-black ${totals.lent - totals.borrowed >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        ৳{(totals.lent - totals.borrowed).toLocaleString()}
                    </h2>
                </div>
                <div className="w-16 h-16 glass rounded-[2rem] flex items-center justify-center text-indigo-400 border-indigo-500/30">
                    <History size={28}/>
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-500 uppercase flex items-center gap-1"><ArrowUpRight size={12} className="text-emerald-400"/> আমি পাবো</p>
                    <p className="text-lg font-black text-white">৳{totals.lent.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-500 uppercase flex items-center gap-1"><ArrowDownRight size={12} className="text-rose-400"/> আমি দেবো</p>
                    <p className="text-lg font-black text-white">৳{totals.borrowed.toLocaleString()}</p>
                </div>
            </div>
         </div>
      </div>

      <div className="flex justify-between items-center px-4">
        <div className="flex p-1 glass rounded-2xl gap-1">
          <button onClick={() => setFilter('Active')} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'Active' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500'}`}>বকেয়া</button>
          <button onClick={() => setFilter('Settled')} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'Settled' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500'}`}>পরিশোধিত</button>
        </div>
        {/* Fixed: Use imported X icon */}
        <button onClick={() => setShowAdd(!showAdd)} className="w-14 h-14 bg-indigo-500 rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-indigo-500/30 active:scale-90 transition-all border-4 border-slate-950">
            {showAdd ? <X/> : <UserPlus/>}
        </button>
      </div>

      {showAdd && (
        <div className="glass p-8 rounded-[3.5rem] border-indigo-500/30 space-y-6 animate-scale-in relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5"><UserPlus size={100}/></div>
          <h3 className="text-lg font-black uppercase tracking-widest relative z-10">নতুন লেনদেনের তথ্য</h3>
          <div className="space-y-4 relative z-10">
            <div className="relative">
                <UserCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20}/>
                <input value={name} onChange={e=>setName(e.target.value)} placeholder="ব্যক্তির নাম" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-sm focus:border-indigo-500 transition-all outline-none"/>
            </div>
            <div className="relative">
                <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20}/>
                <input value={amount} onChange={e=>setAmount(e.target.value)} type="number" placeholder="৳ টাকার পরিমাণ" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-sm focus:border-indigo-500 transition-all outline-none"/>
            </div>
            
            <div className="flex gap-2 p-1.5 glass rounded-[2rem]">
              <button onClick={()=>setType('Borrowed')} className={`flex-1 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${type==='Borrowed'?'bg-rose-500 text-white shadow-lg':'text-slate-500 hover:text-white'}`}>
                <ArrowDownRight size={14}/> আমি দেবো
              </button>
              <button onClick={()=>setType('Lent')} className={`flex-1 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${type==='Lent'?'bg-emerald-500 text-white shadow-lg':'text-slate-500 hover:text-white'}`}>
                <ArrowUpRight size={14}/> আমি পাবো
              </button>
            </div>
            <button onClick={addDebt} className="w-full py-5 bg-indigo-500 rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-500/20 active:scale-95 transition-all text-sm">ডাটা সেভ করুন</button>
          </div>
        </div>
      )}

      <div className="space-y-4 px-1">
        {filteredDebts.map(d => (
          <div key={d.id} className={`glass p-6 rounded-[3rem] border-white/5 flex flex-col gap-6 group transition-all hover:bg-white/5 ${d.isSettled ? 'opacity-60' : ''}`}>
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black ${d.type==='Lent' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                    {d.personName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-black text-white text-lg">{d.personName}</h4>
                    <p className="text-[9px] text-slate-500 font-black flex items-center gap-1 uppercase tracking-widest">
                        <Calendar size={10} /> {new Date(d.date).toLocaleDateString('bn-BD', { day: 'numeric', month: 'short' })}
                        <span className="mx-1 opacity-20">•</span>
                        {d.type === 'Lent' ? 'উত্তোলন' : 'প্রদান'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-black text-xl leading-none mb-1 ${d.type==='Lent'?'text-emerald-400':'text-rose-400'}`}>৳{d.amount.toLocaleString()}</p>
                  <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${d.isSettled ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-500'}`}>
                    {d.isSettled ? 'সম্পন্ন' : 'বকেয়া'}
                  </span>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button 
                    onClick={() => toggleSettle(d.id)} 
                    className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${d.isSettled ? 'bg-white/5 text-slate-500 border border-white/5' : 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/10 hover:scale-[1.02]'}`}
                >
                    {/* Fixed: Use imported RefreshCw and Check icons */}
                    {d.isSettled ? <RefreshCw size={14}/> : <Check size={14}/>} 
                    {d.isSettled ? 'বকেয়া করুন' : 'পরিশোধ সম্পন্ন'}
                </button>
                <button 
                    onClick={() => deleteDebt(d.id)}
                    className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                >
                    <Trash2 size={18}/>
                </button>
            </div>
          </div>
        ))}

        {filteredDebts.length === 0 && (
          <div className="py-20 text-center flex flex-col items-center justify-center gap-4 text-slate-600">
             <div className="w-20 h-20 glass rounded-full flex items-center justify-center opacity-20"><History size={40}/></div>
             <p className="font-bold text-sm">কোন তথ্য পাওয়া যায়নি</p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Loan Manager Redesign ---
const LoanManager = ({ loans, setLoans, profile }: { loans: Loan[], setLoans: any, profile: UserProfile }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [interest, setInterest] = useState('9');
  const [duration, setDuration] = useState('12');

  const addLoan = () => {
    if (!title || !amount) return;
    const p = parseFloat(amount);
    const r = parseFloat(interest) / 12 / 100;
    const n = parseInt(duration);
    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const newLoan: Loan = {
      id: uuidv4(), title, totalAmount: p, interestRate: parseFloat(interest), 
      durationMonths: n, startDate: new Date().toISOString(), emiAmount: emi, 
      paidMonths: 0, isCompleted: false
    };
    setLoans([newLoan, ...loans]);
    setShowAdd(false); setTitle(''); setAmount('');
  };

  const handlePayEMI = (id: string) => {
    setLoans(loans.map(l => {
        if(l.id === id) {
            const nextPaid = Math.min(l.durationMonths, l.paidMonths + 1);
            return { ...l, paidMonths: nextPaid, isCompleted: nextPaid === l.durationMonths };
        }
        return l;
    }));
  };

  const totalMonthlyEMI = loans.reduce((s, l) => s + (l.isCompleted ? 0 : l.emiAmount), 0);

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Monthly Commitment Header */}
      <div className="glass p-8 rounded-[3.5rem] bg-gradient-to-br from-rose-500/10 to-transparent border-rose-500/20 relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 opacity-5 rotate-12"><CreditCard size={180}/></div>
        <div className="relative z-10 flex flex-col gap-6">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-black text-[10px] uppercase tracking-widest text-rose-400 mb-1">মাসিক কিস্তি (EMI)</h3>
                    <h2 className="text-4xl font-black text-white">৳{totalMonthlyEMI.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h2>
                </div>
                {/* Fixed: Use imported X icon */}
                <button 
                    onClick={() => setShowAdd(!showAdd)} 
                    className="w-14 h-14 bg-rose-500 rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-rose-500/30 active:scale-95 transition-all"
                >
                    {showAdd ? <X/> : <Plus/>}
                </button>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-4">
                <div className="p-2 bg-rose-500/10 text-rose-400 rounded-lg"><Info size={16}/></div>
                <p className="text-[10px] text-slate-400 font-medium">আপনার সচল {loans.filter(l => !l.isCompleted).length} টি কিস্তি রিমাইন্ডার সেট করা আছে।</p>
            </div>
        </div>
      </div>

      {showAdd && (
        <div className="glass p-8 rounded-[3.5rem] border-rose-500/30 space-y-6 animate-scale-in">
          <h3 className="text-xl font-black uppercase tracking-widest">লোন এর তথ্য দিন</h3>
          <div className="space-y-4">
            <div className="relative">
                <Landmark className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20}/>
                <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="লোন নাম (যেমন: কার লোন)" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-sm focus:border-rose-500 transition-all outline-none"/>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">৳</span>
                    <input value={amount} onChange={e=>setAmount(e.target.value)} type="number" placeholder="পরিমাণ" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-10 text-sm outline-none focus:border-rose-500"/>
                </div>
                <div className="relative">
                    <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18}/>
                    <input value={interest} onChange={e=>setInterest(e.target.value)} type="number" placeholder="সুদ %" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-sm outline-none focus:border-rose-500"/>
                </div>
            </div>
            <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18}/>
                <input value={duration} onChange={e=>setDuration(e.target.value)} type="number" placeholder="সময়কাল (মাস)" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-sm outline-none focus:border-rose-500"/>
            </div>
            <button onClick={addLoan} className="w-full py-5 bg-rose-500 rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-xl shadow-rose-500/20 active:scale-95 transition-all text-sm">লোন সেভ করুন</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loans.map(loan => {
          const progress = (loan.paidMonths / loan.durationMonths) * 100;
          const remainingAmount = (loan.durationMonths - loan.paidMonths) * loan.emiAmount;
          
          return (
            <div key={loan.id} className="glass p-6 rounded-[3rem] border-white/5 relative overflow-hidden group hover:border-rose-500/30 transition-all flex flex-col gap-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-400 border border-rose-500/10">
                    <Milestone size={28}/>
                  </div>
                  <div>
                    <h4 className="font-black text-white text-lg">{loan.title}</h4>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-1">
                        <CalendarCheck2 size={12}/> {loan.paidMonths} / {loan.durationMonths} মাস সম্পন্ন
                    </p>
                  </div>
                </div>
                <button 
                    onClick={() => setLoans(loans.filter(l => l.id !== loan.id))} 
                    className="p-3 glass rounded-2xl text-slate-600 hover:text-rose-500 transition-colors"
                >
                    <Trash2 size={18}/>
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-500">
                    <span>বকেয়া: ৳{remainingAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    <span className="text-rose-400">{progress.toFixed(0)}% সম্পন্ন</span>
                </div>
                <div className="h-4 bg-slate-900 rounded-full overflow-hidden p-[2px] border border-white/5">
                    <div 
                        className="h-full bg-gradient-to-r from-rose-600 to-rose-400 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(244,63,94,0.3)]" 
                        style={{ width: `${progress}%` }}
                    />
                </div>
              </div>

              <div className="flex justify-between items-center p-4 glass rounded-3xl bg-white/5">
                <div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">মাসিক কিস্তি</p>
                    <p className="text-xl font-black text-white">৳{loan.emiAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                </div>
                {!loan.isCompleted && (
                    <button 
                        onClick={() => handlePayEMI(loan.id)}
                        className="px-6 py-3 bg-rose-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-rose-500/20 active:scale-95 transition-all"
                    >
                        EMI দিন
                    </button>
                )}
                {loan.isCompleted && (
                    <div className="px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        {/* Fixed: Use imported Check icon */}
                        <Check size={14}/> সম্পন্ন
                    </div>
                )}
              </div>
            </div>
          );
        })}

        {loans.length === 0 && (
          <div className="col-span-full py-20 text-center flex flex-col items-center justify-center gap-4 text-slate-600 border-2 border-dashed border-white/5 rounded-[3rem]">
             <div className="w-20 h-20 glass rounded-full flex items-center justify-center opacity-20"><CreditCard size={40}/></div>
             <p className="font-bold text-sm">কোন লোন বা কিস্তির তথ্য নেই</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ZakatCalculator = ({ profile, transactions, investments }: { profile: UserProfile, transactions: Transaction[], investments: Investment[] }) => {
  const [goldVal, setGoldVal] = useState('0');
  const [silverVal, setSilverVal] = useState('0');
  const cash = transactions.reduce((s, t) => s + (t.type === 'Income' ? t.amount : -t.amount), 0);
  const assetVal = investments.reduce((s, i) => s + i.currentPrice, 0);
  const totalWealth = cash + assetVal + parseFloat(goldVal) + parseFloat(silverVal);
  const zakatPayable = totalWealth * ZAKAT_RATE;
  return (
    <div className="glass p-8 rounded-[3.5rem] border-amber-500/30 text-center space-y-6">
      <div className="w-20 h-20 bg-amber-500/10 rounded-3xl mx-auto flex items-center justify-center text-amber-400"><Coins size={40}/></div>
      <h3 className="text-xl font-bold">যাকাত ক্যালকুলেটর</h3>
      <div className="space-y-4 text-left">
        <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-bold text-amber-400">৳ {cash.toLocaleString()} (Cash)</div>
        <div className="grid grid-cols-2 gap-4">
          <input value={goldVal} onChange={e=>setGoldVal(e.target.value)} type="number" placeholder="স্বর্ণ (৳)" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm"/>
          <input value={silverVal} onChange={e=>setSilverVal(e.target.value)} type="number" placeholder="রূপা (৳)" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm"/>
        </div>
      </div>
      <div className="pt-4 border-t border-white/10"><p className="text-[10px] font-black text-slate-500 uppercase mb-2">প্রদেয় যাকাত</p><h2 className="text-4xl font-black text-amber-400">৳ {zakatPayable.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h2></div>
    </div>
  );
};

const TaxCalculator = ({ profile }: { profile: UserProfile }) => {
  const [income, setIncome] = useState('500000');
  const calculateTax = (inc: number) => {
    const threshold = profile.name.includes('Ms') ? BD_TAX_CONFIG.femaleThreshold : BD_TAX_CONFIG.maleThreshold;
    let taxable = inc - threshold;
    if (taxable <= 0) return 0;
    let tax = 0;
    // Fixed: slab -> slabs
    for (const slab of BD_TAX_CONFIG.slabs) {
      const amount = Math.min(taxable, slab.limit);
      tax += amount * slab.rate;
      taxable -= amount;
      if (taxable <= 0) break;
    }
    return tax;
  };
  const taxVal = calculateTax(parseFloat(income) || 0);
  return (
    <div className="glass p-8 rounded-[3.5rem] border-slate-500/30 space-y-6">
      <div className="flex items-center gap-4"><div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400"><ReceiptText size={32}/></div><div><h3 className="text-xl font-bold">ইনকাম ট্যাক্স (BD)</h3><p className="text-[10px] text-slate-500 font-black uppercase">২০২৪-২৫ অর্থবছর</p></div></div>
      <input value={income} onChange={e=>setIncome(e.target.value)} type="number" className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-2xl font-black text-center"/>
      <div className="p-8 bg-slate-900/50 rounded-[2.5rem] border border-white/5 text-center"><p className="text-[10px] font-black text-slate-500 uppercase mb-2">প্রাক্কলিত ট্যাক্স</p><h2 className="text-4xl font-black text-white">৳ {taxVal.toLocaleString()}</h2></div>
    </div>
  );
};

const CurrencyConverter = ({ profile }: { profile: UserProfile }) => {
  const [val, setVal] = useState('100');
  const [from, setFrom] = useState<CurrencyCode>('USD');
  const [to, setTo] = useState<CurrencyCode>('BDT');
  const result = (parseFloat(val) * MOCK_RATES[from]) / MOCK_RATES[to];
  return (
    <div className="glass p-8 rounded-[3.5rem] border-emerald-500/30 space-y-8">
      <h3 className="text-xl font-bold flex items-center gap-2 text-emerald-400"><RefreshCcw/> কনভার্টার</h3>
      <div className="space-y-4">
        <div className="flex gap-4"><input value={val} onChange={e=>setVal(e.target.value)} type="number" className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-5 text-2xl font-black"/><select value={from} onChange={e=>setFrom(e.target.value as any)} className="bg-slate-900 border border-white/10 rounded-2xl p-4 font-bold">{Object.keys(MOCK_RATES).map(c=><option key={c} value={c}>{c}</option>)}</select></div>
        <div className="flex justify-center"><RefreshCcw className="text-slate-600 rotate-90"/></div>
        <div className="flex gap-4"><div className="flex-1 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 text-2xl font-black text-emerald-400 flex items-center justify-center">{result.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div><select value={to} onChange={e=>setTo(e.target.value as any)} className="bg-slate-900 border border-white/10 rounded-2xl p-4 font-bold">{Object.keys(MOCK_RATES).map(c=><option key={c} value={c}>{c}</option>)}</select></div>
      </div>
    </div>
  );
};

const SubscriptionTracker = ({ subs, setSubs, profile }: { subs: Subscription[], setSubs: any, profile: UserProfile }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const addSub = () => {
    if(!name || !amount) return;
    const newSub: Subscription = { id: uuidv4(), name, amount: parseFloat(amount), currency: profile.baseCurrency || 'BDT', renewalDate: new Date().toISOString(), frequency: 'Monthly', isActive: true };
    setSubs([newSub, ...subs]); setShowAdd(false); setName(''); setAmount('');
  };
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><h3 className="text-xl font-bold flex items-center gap-2 text-purple-400"><Repeat/> সাবস্ক্রিপশন</h3><button onClick={() => setShowAdd(!showAdd)} className="p-2 bg-purple-500 rounded-xl text-white shadow-lg active:scale-95 transition-all"><Plus/></button></div>
      {showAdd && (
        <div className="glass p-6 rounded-[2.5rem] border-purple-500/30 space-y-4 animate-slide-up"><input value={name} onChange={e=>setName(e.target.value)} placeholder="সার্ভিসের নাম" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm"/><input value={amount} onChange={e=>setAmount(e.target.value)} type="number" placeholder="৳" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm"/><button onClick={addSub} className="w-full py-4 bg-purple-500 rounded-2xl font-bold active:scale-95 transition-all shadow-lg shadow-purple-500/20">অ্যাড করুন</button></div>
      )}
      <div className="space-y-3">{subs.map(s => (<div key={s.id} className="glass p-4 rounded-3xl flex justify-between items-center border-white/5"><div className="flex items-center gap-4"><div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400"><CheckCircle2 size={18}/></div><div><h4 className="font-bold text-sm">{s.name}</h4><p className="text-[9px] text-slate-500 font-black uppercase">৳{s.amount} / মাস</p></div></div><button onClick={()=>setSubs(subs.filter(x=>x.id!==s.id))} className="text-slate-600 hover:text-rose-500"><Trash2 size={16}/></button></div>))}</div>
    </div>
  );
};

const AssetManager = ({ investments, setInvestments, profile }: { investments: Investment[], setInvestments: any, profile: UserProfile }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const addAsset = () => {
    if(!name || !price) return;
    const newAsset: Investment = { id: uuidv4(), name, type: 'Other', buyPrice: parseFloat(price), currentPrice: parseFloat(price), purchaseDate: new Date().toISOString() };
    setInvestments([newAsset, ...investments]); setShowAdd(false); setName(''); setPrice('');
  };
  const totalVal = investments.reduce((s, i) => s + i.currentPrice, 0);
  return (
    <div className="space-y-6">
      <div className="glass p-8 rounded-[3.5rem] bg-gradient-to-br from-blue-500/20 to-transparent border-blue-500/30 text-center"><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">আপনার মোট সম্পদের মূল্য</p><h2 className="text-4xl font-black text-white">৳ {totalVal.toLocaleString()}</h2></div>
      <div className="flex justify-between items-center"><h3 className="text-xl font-bold flex items-center gap-2 text-blue-400"><Package/> আমার সম্পদ</h3><button onClick={() => setShowAdd(!showAdd)} className="p-2 bg-blue-500 rounded-xl text-white shadow-lg active:scale-95 transition-all"><Plus/></button></div>
      {showAdd && (
        <div className="glass p-6 rounded-[2.5rem] border-blue-500/30 space-y-4 animate-slide-up"><input value={name} onChange={e=>setName(e.target.value)} placeholder="সম্পদের নাম" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm"/><input value={price} onChange={e=>setPrice(e.target.value)} type="number" placeholder="৳" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm"/><button onClick={addAsset} className="w-full py-4 bg-blue-500 rounded-2xl font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all">যোগ করুন</button></div>
      )}
      <div className="space-y-3">{investments.map(inv => (<div key={inv.id} className="glass p-4 rounded-3xl flex justify-between items-center border-white/5"><div className="flex items-center gap-4"><div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400"><BankIcon size={18}/></div><h4 className="font-bold text-sm">{inv.name}</h4></div><div className="flex items-center gap-4"><p className="font-black text-sm text-slate-300">৳{inv.currentPrice.toLocaleString()}</p><button onClick={()=>setInvestments(investments.filter(x=>x.id!==inv.id))} className="text-slate-600 hover:text-rose-500"><Trash2 size={16}/></button></div></div>))}</div>
    </div>
  );
};

export default FinancialToolsView;
