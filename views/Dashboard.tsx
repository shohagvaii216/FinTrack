
import React, { useMemo, useState } from 'react';
import { 
  TrendingUp, TrendingDown, Wallet, Calendar, Activity, 
  ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownRight,
  Target, Sparkles, AlertTriangle, CheckCircle2, LayoutGrid
} from 'lucide-react';
import { Transaction, RecurringTransaction, UserProfile, CurrencyCode, Investment, Debt, Budget } from '../types';
import { MOCK_RATES } from '../constants';
import { 
  ResponsiveContainer, Tooltip, 
  XAxis, YAxis, CartesianGrid, AreaChart, Area
} from 'recharts';
import CurrencyText from '../components/CurrencyText';

interface Props {
  transactions: Transaction[];
  recurringTransactions?: RecurringTransaction[];
  profile: UserProfile;
  investments?: Investment[];
  debts?: Debt[];
  budgets: Budget[];
}

const Dashboard: React.FC<Props> = ({ 
  transactions, 
  profile, 
  investments = [],
  debts = [],
  budgets = []
}) => {
  const isPrivacyMode = !!profile.isPrivacyMode;
  const baseCurrency: CurrencyCode = profile.baseCurrency || 'BDT';
  
  // View Period State: Daily, Monthly, Yearly
  const [viewType, setViewType] = useState<'Daily' | 'Monthly' | 'Yearly'>('Monthly');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const periodStr = useMemo(() => {
    if (viewType === 'Daily') return selectedDate.toISOString().slice(0, 10);
    if (viewType === 'Monthly') return selectedDate.toISOString().slice(0, 7);
    return selectedDate.getFullYear().toString();
  }, [selectedDate, viewType]);

  const convertToMain = (amount: number, from: CurrencyCode) => {
    if (from === baseCurrency) return amount;
    return (amount * (MOCK_RATES[from] || 1)) / (MOCK_RATES[baseCurrency] || 1);
  };

  const stats = useMemo(() => {
    const periodTxs = transactions.filter(t => t.date.startsWith(periodStr));
    const inc = periodTxs.filter(t => t.type === 'Income').reduce((s, t) => s + convertToMain(t.amount, t.currency || 'BDT'), 0);
    const exp = periodTxs.filter(t => t.type === 'Expense').reduce((s, t) => s + convertToMain(t.amount, t.currency || 'BDT'), 0);
    return { income: inc, expense: exp, balance: inc - exp };
  }, [transactions, periodStr, baseCurrency]);

  const totalAllTime = useMemo(() => {
    return transactions.reduce((acc, t) => {
      const factor = t.type === 'Income' ? 1 : -1;
      return acc + (convertToMain(t.amount, t.currency || 'BDT') * factor);
    }, 0);
  }, [transactions, baseCurrency]);

  const changePeriod = (offset: number) => {
    const newDate = new Date(selectedDate);
    if (viewType === 'Daily') newDate.setDate(newDate.getDate() + offset);
    else if (viewType === 'Monthly') newDate.setMonth(newDate.getMonth() + offset);
    else newDate.setFullYear(newDate.getFullYear() + offset);
    setSelectedDate(newDate);
  };

  // Heatmap Data (Current Month)
  const heatmapData = useMemo(() => {
    const month = selectedDate.getMonth();
    const year = selectedDate.getFullYear();
    const days = new Date(year, month + 1, 0).getDate();
    const data = [];
    let maxExp = 0;
    
    for (let i = 1; i <= days; i++) {
      const d = i < 10 ? `0${i}` : `${i}`;
      const m = (month + 1) < 10 ? `0${month+1}` : `${month+1}`;
      const fullDate = `${year}-${m}-${d}`;
      const dayExp = transactions
        .filter(t => t.date === fullDate && t.type === 'Expense')
        .reduce((s, t) => s + convertToMain(t.amount, t.currency || 'BDT'), 0);
      if (dayExp > maxExp) maxExp = dayExp;
      data.push({ day: i, amount: dayExp });
    }
    return { data, maxExp };
  }, [transactions, selectedDate, baseCurrency]);

  const chartData = useMemo(() => {
    const data = [];
    if (viewType === 'Monthly') {
      const days = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
      for (let i = 1; i <= days; i++) {
        const d = i < 10 ? `0${i}` : `${i}`;
        const m = (selectedDate.getMonth() + 1) < 10 ? `0${selectedDate.getMonth()+1}` : `${selectedDate.getMonth()+1}`;
        const fullDate = `${selectedDate.getFullYear()}-${m}-${d}`;
        const dayTxs = transactions.filter(t => t.date === fullDate);
        data.push({
          label: i.toString(),
          income: dayTxs.filter(t => t.type === 'Income').reduce((s, t) => s + convertToMain(t.amount, t.currency), 0),
          expense: dayTxs.filter(t => t.type === 'Expense').reduce((s, t) => s + convertToMain(t.amount, t.currency), 0)
        });
      }
    } else if (viewType === 'Yearly') {
       for (let i = 0; i < 12; i++) {
          const m = (i + 1) < 10 ? `0${i+1}` : `${i+1}`;
          const monthPrefix = `${selectedDate.getFullYear()}-${m}`;
          const monthTxs = transactions.filter(t => t.date.startsWith(monthPrefix));
          data.push({
            label: (i + 1).toString(),
            income: monthTxs.filter(t => t.type === 'Income').reduce((s, t) => s + convertToMain(t.amount, t.currency), 0),
            expense: monthTxs.filter(t => t.type === 'Expense').reduce((s, t) => s + convertToMain(t.amount, t.currency), 0)
          });
       }
    }
    return data;
  }, [transactions, selectedDate, viewType, baseCurrency]);

  const themePrimary = profile.themeColor || 'sky';
  const accentColor = `text-${themePrimary}-500`;

  return (
    <div className="space-y-6 pb-24 animate-slide-up">
      {/* Top Controls & Navigation */}
      <div className="flex flex-col gap-4">
         <div className="flex p-1 glass rounded-2xl">
            {['Daily', 'Monthly', 'Yearly'].map(v => (
               <button 
                  key={v} 
                  onClick={() => setViewType(v as any)}
                  className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${viewType === v ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' : 'text-slate-500 hover:text-slate-300'}`}
               >
                  {v === 'Daily' ? 'দৈনিক' : v === 'Monthly' ? 'মাসিক' : 'বাৎসরিক'}
               </button>
            ))}
         </div>

         <div className="flex items-center justify-between px-2">
            <button onClick={() => changePeriod(-1)} className="p-3 glass rounded-2xl text-slate-500 hover:text-white transition-all"><ChevronLeft size={20}/></button>
            <div className="text-center">
               <h2 className="text-sm font-black uppercase tracking-widest text-white">
                  {viewType === 'Daily' ? selectedDate.toLocaleDateString('bn-BD') : 
                   viewType === 'Monthly' ? selectedDate.toLocaleDateString('bn-BD', { month: 'long', year: 'numeric' }) :
                   selectedDate.getFullYear()}
               </h2>
               <p className="text-[8px] font-black text-slate-500 uppercase mt-0.5 tracking-[0.2em]">টাইমলাইন ভিউ</p>
            </div>
            <button onClick={() => changePeriod(1)} className="p-3 glass rounded-2xl text-slate-500 hover:text-white transition-all"><ChevronRight size={20}/></button>
         </div>
      </div>

      {/* Dynamic Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         {/* Net Profit/Loss Card */}
         <div className={`glass p-8 rounded-[3rem] bg-gradient-to-br border-${stats.balance >= 0 ? 'emerald' : 'rose'}-500/30 from-${stats.balance >= 0 ? 'emerald' : 'rose'}-500/10 to-transparent relative overflow-hidden`}>
            <div className="absolute -right-6 -bottom-6 opacity-5 rotate-12">
               {stats.balance >= 0 ? <CheckCircle2 size={160}/> : <AlertTriangle size={160}/>}
            </div>
            <div className="relative z-10 flex justify-between items-start">
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                     {stats.balance >= 0 ? 'নিট লাভ (Profit)' : 'নিট লোকসান (Loss)'}
                  </p>
                  <h2 className={`text-4xl font-black leading-none ${stats.balance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                     <CurrencyText amount={stats.balance} currency={baseCurrency} isPrivacyMode={isPrivacyMode} />
                  </h2>
               </div>
               <div className={`p-4 rounded-3xl ${stats.balance >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                  {stats.balance >= 0 ? <TrendingUp size={28}/> : <TrendingDown size={28}/>}
               </div>
            </div>
         </div>

         <div className="grid grid-cols-2 gap-4">
            <div className="glass p-5 rounded-[2.5rem] border-emerald-500/10">
               <p className="text-[8px] font-black text-slate-500 uppercase mb-1">মোট আয়</p>
               <h4 className="text-xl font-black text-emerald-500"><CurrencyText amount={stats.income} currency={baseCurrency} isPrivacyMode={isPrivacyMode} /></h4>
            </div>
            <div className="glass p-5 rounded-[2.5rem] border-rose-500/10">
               <p className="text-[8px] font-black text-slate-500 uppercase mb-1">মোট ব্যয়</p>
               <h4 className="text-xl font-black text-rose-500"><CurrencyText amount={stats.expense} currency={baseCurrency} isPrivacyMode={isPrivacyMode} /></h4>
            </div>
            <div className="glass p-5 rounded-[2.5rem] border-sky-500/10 col-span-2 flex justify-between items-center">
               <div>
                  <p className="text-[8px] font-black text-slate-500 uppercase mb-1">অবশিষ্ট ব্যালেন্স (All Time)</p>
                  <h4 className="text-xl font-black text-white"><CurrencyText amount={totalAllTime} currency={baseCurrency} isPrivacyMode={isPrivacyMode} /></h4>
               </div>
               <Wallet className="text-sky-500 opacity-30" size={32}/>
            </div>
         </div>
      </div>

      {/* Spending Heatmap (Calendar View) */}
      <div className="glass p-6 rounded-[2.5rem] border-white/5">
         <div className="flex justify-between items-center mb-6 px-2">
            <h3 className="font-black text-[10px] uppercase tracking-widest flex items-center gap-2 text-slate-400">
               <LayoutGrid size={16} className={accentColor} /> এক্সপেন্স হিটম্যাপ
            </h3>
            <span className="text-[8px] font-black text-slate-600 uppercase">মাসের খরচ প্রবাহ</span>
         </div>
         <div className="grid grid-cols-7 gap-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
               <div key={d} className="text-[8px] font-black text-slate-700 text-center mb-1">{d}</div>
            ))}
            {heatmapData.data.map(day => {
               const intensity = heatmapData.maxExp > 0 ? (day.amount / heatmapData.maxExp) : 0;
               return (
                  <div 
                     key={day.day} 
                     title={`Day ${day.day}: ৳${day.amount.toLocaleString()}`}
                     className="heatmap-cell group relative flex items-center justify-center cursor-help border border-white/5"
                     style={{ 
                        backgroundColor: `rgba(244, 63, 94, ${0.05 + intensity * 0.8})`,
                        boxShadow: intensity > 0.8 ? '0 0 10px rgba(244, 63, 94, 0.3)' : 'none'
                     }}
                  >
                     <span className={`text-[8px] font-black transition-all ${intensity > 0.5 ? 'text-white' : 'text-slate-500 group-hover:text-white'}`}>{day.day}</span>
                     {day.amount > 0 && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-slate-900 text-white text-[8px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap pointer-events-none border border-white/10 shadow-2xl">
                           ৳{day.amount.toLocaleString()}
                        </div>
                     )}
                  </div>
               );
            })}
         </div>
      </div>

      {/* Interactive Trend Chart */}
      <div className="glass p-6 rounded-[3rem] border-white/5">
        <div className="flex justify-between items-center mb-8 px-2">
           <h3 className="font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
              <Activity size={18} className={accentColor} /> আয় বনাম ব্যয় ট্রেন্ড
           </h3>
           <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                 <span className="text-[8px] font-black text-slate-500 uppercase">আয়</span>
              </div>
              <div className="flex items-center gap-1.5">
                 <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                 <span className="text-[8px] font-black text-slate-500 uppercase">ব্যয়</span>
              </div>
           </div>
        </div>
        <div className="h-60 w-full">
           <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                 <defs>
                    <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                       <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                       <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                 <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 9, fontWeight: 'bold' }} />
                 <YAxis hide />
                 <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)' }}
                    itemStyle={{ fontSize: '11px', fontWeight: 'bold' }}
                 />
                 <Area type="monotone" dataKey="income" stroke="#10b981" fillOpacity={1} fill="url(#colorInc)" strokeWidth={3} />
                 <Area type="monotone" dataKey="expense" stroke="#f43f5e" fillOpacity={1} fill="url(#colorExp)" strokeWidth={3} />
              </AreaChart>
           </ResponsiveContainer>
        </div>
      </div>

      {/* AI Insight Tile */}
      <div className={`glass p-6 rounded-[2.5rem] border-${themePrimary}-500/20 bg-${themePrimary}-500/5 flex gap-5 items-center`}>
         <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 border border-white/5">
            <Sparkles className={accentColor} size={28}/>
         </div>
         <div>
            <h5 className="font-bold text-sm">স্মার্ট পরামর্শ</h5>
            <p className="text-xs text-slate-400 leading-snug">আপনার {viewType === 'Monthly' ? 'মাসের' : 'সময়ের'} ডাটা বিশ্লেষণে দেখা যাচ্ছে {stats.balance < 0 ? 'খরচ আয়ের চেয়ে বেশি হচ্ছে' : 'আপনার সঞ্চয় লক্ষ্যমাত্রা সন্তোষজনক'}। নিয়মিত ট্র্যাকিং বজায় রাখুন।</p>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
