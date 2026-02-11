
import React, { useState } from 'react';
import { Target, Edit2, Check, X, Plus, PlusCircle, Trash2, Wallet, Camera, ShoppingCart, Home, Laptop, Bike, Car } from 'lucide-react';
import { Transaction, Budget, Category, Goal, UserProfile } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  transactions: Transaction[];
  budgets: Budget[];
  categories: Category[];
  goals: Goal[];
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
  profile: UserProfile;
  onUpdateBudget: (category: string, limit: number) => void;
  onAddCategory: (category: Category) => void;
}

const BudgetView: React.FC<Props> = ({ transactions, budgets, categories, goals, setGoals, profile, onUpdateBudget, onAddCategory }) => {
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [activeTab, setActiveTab] = useState<'budget' | 'goals'>('budget');
  
  const currentMonth = new Date().toISOString().slice(0, 7);
  
  const getSpentForCategory = (category: string) => {
    return transactions
      .filter(t => t.type === 'Expense' && t.category === category && t.date.startsWith(currentMonth))
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const handleAddMoneyToGoal = (id: string) => {
    const amount = prompt("জমানো টাকার পরিমাণ লিখুন (৳):");
    if (!amount || isNaN(parseFloat(amount))) return;
    setGoals(goals.map(g => g.id === id ? { ...g, currentAmount: g.currentAmount + parseFloat(amount) } : g));
  };

  const goalIcons = [
    { icon: <Laptop size={32} />, label: 'ল্যাপটপ' },
    { icon: <Bike size={32} />, label: 'বাইক' },
    { icon: <Car size={32} />, label: 'গাড়ি' },
    { icon: <Home size={32} />, label: 'বাড়ি' },
    { icon: <Camera size={32} />, label: 'ক্যামেরা' },
    { icon: <ShoppingCart size={32} />, label: 'শপিং' },
  ];

  return (
    <div className="space-y-6 pb-24 animate-slide-up">
      <div className="flex p-1 glass rounded-[1.5rem] mb-4">
        <button 
          onClick={() => setActiveTab('budget')} 
          className={`flex-1 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'budget' ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' : 'text-slate-500 hover:text-slate-300'}`}
        >
          বাজেট প্ল্যানিং
        </button>
        <button 
          onClick={() => setActiveTab('goals')} 
          className={`flex-1 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'goals' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'text-slate-500 hover:text-slate-300'}`}
        >
          আমার লক্ষ্যমাত্রা
        </button>
      </div>

      {activeTab === 'budget' ? (
        <div className="space-y-4">
          <header className="px-2 mb-6">
            <h2 className="text-3xl font-black flex items-center gap-3">
              <Target className="text-sky-400" size={32} />
              Monthly Budget
            </h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">আপনার খরচের লাগাম ধরুন</p>
          </header>

          <div className="grid grid-cols-1 gap-4">
            {categories.map(cat => {
              const budget = budgets.find(b => b.category === cat.name) || { category: cat.name, limit: 0 };
              const spent = getSpentForCategory(cat.name);
              const remaining = Math.max(0, budget.limit - spent);
              const percent = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;
              
              // Visual Logic: Green (<80), Yellow (80-100), Red (>100)
              const colorClass = percent > 100 ? 'bg-rose-500' : percent >= 80 ? 'bg-amber-500' : 'bg-emerald-500';
              const textClass = percent > 100 ? 'text-rose-500' : percent >= 80 ? 'text-amber-500' : 'text-emerald-500';
              const glowClass = percent > 100 ? 'shadow-[0_0_15px_rgba(244,63,94,0.4)]' : percent >= 80 ? 'shadow-[0_0_15px_rgba(245,158,11,0.4)]' : '';

              return (
                <div key={cat.id} className="glass p-6 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl bg-slate-800/50 border border-white/5 shadow-inner transition-transform group-hover:scale-110`}>
                        {cat.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{cat.name} Budget</h3>
                        <p className={`text-xs font-black uppercase tracking-tighter ${textClass}`}>
                          ৳{spent.toLocaleString()} / ৳{budget.limit.toLocaleString()} 
                          <span className="text-slate-500 ml-1">(Remaining: ৳{remaining.toLocaleString()})</span>
                        </p>
                      </div>
                    </div>
                    {editingCategory === cat.name ? (
                      <div className="flex items-center gap-2 bg-slate-900 rounded-xl p-1 border border-white/10">
                        <input 
                          type="number" 
                          value={editValue} 
                          onChange={e => setEditValue(e.target.value)} 
                          className="w-20 bg-transparent px-3 text-sm font-bold focus:outline-none" 
                          placeholder="Limit"
                          autoFocus 
                        />
                        <button onClick={() => {onUpdateBudget(cat.name, parseFloat(editValue)||0); setEditingCategory(null);}} className="p-2 bg-sky-500 rounded-lg text-white"><Check size={14}/></button>
                      </div>
                    ) : (
                      <button onClick={() => {setEditingCategory(cat.name); setEditValue(budget.limit.toString());}} className="p-3 glass rounded-xl text-slate-500 hover:text-sky-400 hover:border-sky-500/30 transition-all"><Edit2 size={16}/></button>
                    )}
                  </div>

                  <div className="space-y-2 relative z-10">
                    <div className="h-3 bg-slate-900 rounded-full overflow-hidden p-[2px] border border-white/5">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${colorClass} ${glowClass}`} 
                        style={{ width: `${Math.min(percent, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <header className="px-2 flex justify-between items-end mb-6">
            <div>
              <h2 className="text-3xl font-black flex items-center gap-3">
                <PlusCircle className="text-amber-400" size={32} />
                Saving Goals
              </h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">আপনার স্বপ্ন পূরণ হোক</p>
            </div>
            <button 
              onClick={() => {
                const name = prompt("লক্ষ্যের নাম (যেমন: নতুন ল্যাপটপ):");
                const target = prompt("টার্গেট পরিমাণ (৳):");
                if(name && target) {
                  setGoals([...goals, { 
                    id: uuidv4(), 
                    name, 
                    targetAmount: parseFloat(target), 
                    currentAmount: 0, 
                    deadline: '', 
                    icon: '🎯' 
                  }]);
                }
              }} 
              className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-amber-500/30 active:scale-95 transition-all"
            >
              <Plus size={24}/>
            </button>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {goals.map(goal => {
              const percent = (goal.currentAmount / goal.targetAmount) * 100;
              return (
                <div key={goal.id} className="glass p-6 rounded-[3rem] border border-white/5 relative overflow-hidden group hover:border-amber-500/30 transition-all">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform text-amber-500">
                    <Target size={120} />
                  </div>
                  
                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-500/20 to-transparent rounded-2xl flex items-center justify-center text-3xl border border-amber-500/20 shadow-inner">
                      {goal.name.toLowerCase().includes('laptop') || goal.name.toLowerCase().includes('ল্যাপটপ') ? <Laptop className="text-amber-400" /> : 
                       goal.name.toLowerCase().includes('bike') || goal.name.toLowerCase().includes('বাইক') ? <Bike className="text-amber-400" /> : 
                       goal.name.toLowerCase().includes('car') || goal.name.toLowerCase().includes('গাড়ি') ? <Car className="text-amber-400" /> : 
                       <Target className="text-amber-400" />}
                    </div>
                    <button onClick={() => setGoals(goals.filter(g=>g.id!==goal.id))} className="p-2 text-slate-600 hover:text-rose-500 transition-colors"><Trash2 size={18}/></button>
                  </div>

                  <h4 className="font-black text-xl mb-2 relative z-10">{goal.name}</h4>
                  
                  <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 relative z-10">
                    <span>টার্গেট: ৳{goal.targetAmount.toLocaleString()}</span>
                    <span className="text-amber-400">{percent.toFixed(0)}% সম্পন্ন</span>
                  </div>

                  <div className="h-4 bg-slate-900 rounded-full overflow-hidden border border-white/5 mb-8 p-[2px]">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-600 to-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all duration-1000 rounded-full" 
                      style={{ width: `${Math.min(percent, 100)}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between items-center relative z-10">
                    <div>
                      <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">বর্তমানে জমানো</p>
                      <p className="text-2xl font-black text-white">৳{goal.currentAmount.toLocaleString()}</p>
                    </div>
                    <button 
                      onClick={() => handleAddMoneyToGoal(goal.id)} 
                      className="px-6 py-4 bg-amber-500 text-white rounded-[1.5rem] font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all"
                    >
                      <Plus size={16}/> টাকা জমান
                    </button>
                  </div>
                </div>
              );
            })}
            
            {goals.length === 0 && (
              <div className="col-span-full py-20 glass rounded-[3rem] border-dashed border-white/10 flex flex-col items-center justify-center text-slate-500 gap-4">
                <Wallet size={48} className="opacity-20" />
                <p className="font-bold text-sm">আপনার কোনো সঞ্চয় লক্ষ্য নেই</p>
                <button 
                  onClick={() => setActiveTab('goals')} 
                  className="text-xs font-black uppercase text-amber-500 tracking-widest"
                >
                  নতুন লক্ষ্য যোগ করুন
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetView;
