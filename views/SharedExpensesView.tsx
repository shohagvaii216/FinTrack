
import React, { useState, useMemo } from 'react';
import { 
  Users, UserPlus, ShoppingCart, Utensils, Receipt, Calculator, 
  Plus, Trash2, CheckSquare, Square, ArrowRightLeft, 
  ShoppingBag, ListTodo, X, RefreshCw, HandCoins, UserCheck, 
  PlusCircle, MinusCircle, Wallet, CalendarDays, ClipboardList
} from 'lucide-react';
import { BillSplit, MessMember, MessBazaar, MessMeal, ShoppingItem, Transaction } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  billSplits: BillSplit[]; setBillSplits: React.Dispatch<React.SetStateAction<BillSplit[]>>;
  messMembers: MessMember[]; setMessMembers: React.Dispatch<React.SetStateAction<MessMember[]>>;
  messBazaars: MessBazaar[]; setMessBazaars: React.Dispatch<React.SetStateAction<MessBazaar[]>>;
  messMeals: MessMeal[]; setMessMeals: React.Dispatch<React.SetStateAction<MessMeal[]>>;
  shoppingItems: ShoppingItem[]; setShoppingItems: React.Dispatch<React.SetStateAction<ShoppingItem[]>>;
  onAddTransaction: (tx: any) => void;
}

const SharedExpensesView: React.FC<Props> = (props) => {
  const [activeSubTab, setActiveSubTab] = useState<'bill' | 'mess' | 'shopping'>('bill');
  
  // Modals visibility
  const [showBillModal, setShowBillModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showBazaarModal, setShowBazaarModal] = useState(false);
  const [showMealModal, setShowMealModal] = useState(false);

  // Form states
  const [tempTitle, setTempTitle] = useState('');
  const [tempAmount, setTempAmount] = useState('');
  const [tempParticipants, setTempParticipants] = useState('');
  const [tempMemberName, setTempMemberName] = useState('');
  const [tempMemberDeposit, setTempMemberDeposit] = useState('');
  const [tempBazaarMember, setTempBazaarMember] = useState('');
  const [tempBazaarAmount, setTempBazaarAmount] = useState('');
  const [tempBazaarItem, setTempBazaarItem] = useState('');
  const [tempMealMember, setTempMealMember] = useState('');
  const [tempMealCount, setTempMealCount] = useState('1');
  const [newShopItem, setNewShopItem] = useState('');
  const [newShopPrice, setNewShopPrice] = useState('');

  // Mess Logic Calculations
  const totalBazaar = useMemo(() => props.messBazaars.reduce((s, b) => s + b.amount, 0), [props.messBazaars]);
  const totalMeals = useMemo(() => props.messMeals.reduce((s, m) => s + m.count, 0), [props.messMeals]);
  const mealRate = useMemo(() => totalMeals > 0 ? totalBazaar / totalMeals : 0, [totalBazaar, totalMeals]);

  const memberStats = useMemo(() => {
    return props.messMembers.map(member => {
      const personalMeals = props.messMeals.filter(m => m.memberId === member.id).reduce((s, m) => s + m.count, 0);
      const personalBazaars = props.messBazaars.filter(b => b.memberId === member.id).reduce((s, b) => s + b.amount, 0);
      const personalCost = personalMeals * mealRate;
      const balance = member.deposit - personalCost;
      return { ...member, meals: personalMeals, cost: personalCost, balance, bazaar: personalBazaars };
    });
  }, [props.messMembers, props.messMeals, props.messBazaars, mealRate]);

  // Handlers
  const handleAddBill = () => {
    if (!tempTitle || !tempAmount) return;
    const split: BillSplit = {
      id: uuidv4(),
      title: tempTitle,
      totalAmount: parseFloat(tempAmount),
      participants: tempParticipants.split(',').map(p => p.trim()),
      payer: tempParticipants.split(',')[0].trim(),
      date: new Date().toISOString().split('T')[0],
      isSettled: false
    };
    props.setBillSplits([split, ...props.billSplits]);
    setTempTitle(''); setTempAmount(''); setTempParticipants('');
    setShowBillModal(false);
  };

  const handleAddMember = () => {
    if (!tempMemberName) return;
    const member: MessMember = { id: uuidv4(), name: tempMemberName, deposit: parseFloat(tempMemberDeposit) || 0 };
    props.setMessMembers([...props.messMembers, member]);
    setTempMemberName(''); setTempMemberDeposit('');
    setShowMemberModal(false);
  };

  const handleAddBazaar = () => {
    if (!tempBazaarMember || !tempBazaarAmount) return;
    const bazaar: MessBazaar = { 
      id: uuidv4(), 
      memberId: tempBazaarMember, 
      amount: parseFloat(tempBazaarAmount), 
      item: tempBazaarItem, 
      date: new Date().toISOString().split('T')[0] 
    };
    props.setMessBazaars([bazaar, ...props.messBazaars]);
    setTempBazaarAmount(''); setTempBazaarItem('');
    setShowBazaarModal(false);
  };

  const handleAddMeal = () => {
    if (!tempMealMember || !tempMealCount) return;
    const meal: MessMeal = { 
      id: uuidv4(), 
      memberId: tempMealMember, 
      count: parseFloat(tempMealCount), 
      date: new Date().toISOString().split('T')[0] 
    };
    props.setMessMeals([meal, ...props.messMeals]);
    setShowMealModal(false);
  };

  const addShopItem = () => {
    if (!newShopItem) return;
    const item: ShoppingItem = { id: uuidv4(), name: newShopItem, estimatedPrice: parseFloat(newShopPrice) || 0, isDone: false };
    props.setShoppingItems([...props.shoppingItems, item]);
    setNewShopItem(''); setNewShopPrice('');
  };

  const handleBuyItem = (item: ShoppingItem) => {
    props.onAddTransaction({
      amount: item.estimatedPrice,
      currency: 'BDT',
      type: 'Expense',
      category: 'শপিং',
      date: new Date().toISOString().split('T')[0],
      paymentMode: 'Cash',
      note: `কেনা হয়েছে: ${item.name}`,
      tags: ['শপিং_লিস্ট'],
      mood: '🛍️'
    });
    props.setShoppingItems(props.shoppingItems.map(i => i.id === item.id ? { ...i, isDone: true } : i));
  };

  return (
    <div className="space-y-6 pb-24 animate-slide-up">
      {/* Tab Switcher */}
      <div className="flex p-1 glass rounded-2xl overflow-x-auto no-scrollbar whitespace-nowrap">
        {[
          { id: 'bill', label: 'বিল স্প্লিটার', icon: ArrowRightLeft, color: 'text-sky-400' },
          { id: 'mess', label: 'মেস ম্যানেজার', icon: Utensils, color: 'text-emerald-400' },
          { id: 'shopping', label: 'শপিং লিস্ট', icon: ShoppingBag, color: 'text-amber-400' },
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveSubTab(tab.id as any)} 
            className={`flex-1 min-w-[100px] py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeSubTab === tab.id ? 'bg-white/10 text-white' : 'text-slate-500'}`}
          >
            <tab.icon size={14} className={activeSubTab === tab.id ? tab.color : ''} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Bill Splitter View */}
      {activeSubTab === 'bill' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-lg font-bold">একত্রিত খরচ ভাগাভাগি</h3>
            <button onClick={() => setShowBillModal(true)} className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-sky-500/20"><Plus/></button>
          </div>
          {props.billSplits.map(bill => (
            <div key={bill.id} className="glass p-5 rounded-3xl border-white/5 flex justify-between items-center group">
              <div>
                <h4 className="font-bold text-sm">{bill.title}</h4>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-tighter">মাথাপিছু: ৳{(bill.totalAmount / bill.participants.length).toFixed(0)} • {bill.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-black text-sm">৳{bill.totalAmount.toLocaleString()}</p>
                  <p className="text-[9px] text-slate-500 uppercase font-black">{bill.participants.length} জন</p>
                </div>
                <button onClick={() => props.setBillSplits(props.billSplits.filter(b => b.id !== bill.id))} className="text-slate-600 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mess Manager View */}
      {activeSubTab === 'mess' && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-3">
            <div className="glass p-4 rounded-3xl border-emerald-500/20 text-center">
              <p className="text-[8px] text-slate-500 font-black uppercase mb-1">মোট বাজার</p>
              <h4 className="text-sm font-black text-emerald-400">৳{totalBazaar.toLocaleString()}</h4>
            </div>
            <div className="glass p-4 rounded-3xl border-sky-500/20 text-center">
              <p className="text-[8px] text-slate-500 font-black uppercase mb-1">মোট মিল</p>
              <h4 className="text-sm font-black text-sky-400">{totalMeals}</h4>
            </div>
            <div className="glass p-4 rounded-3xl border-amber-500/20 text-center">
              <p className="text-[8px] text-slate-500 font-black uppercase mb-1">মিল রেট</p>
              <h4 className="text-sm font-black text-amber-400">৳{mealRate.toFixed(2)}</h4>
            </div>
          </div>

          <div className="flex justify-between items-center px-2">
            <h3 className="text-lg font-bold">সদস্য ও হিসাব</h3>
            <button onClick={() => setShowMemberModal(true)} className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-black uppercase flex items-center gap-2"><UserPlus size={14}/> সদস্য</button>
          </div>

          <div className="space-y-3">
            {memberStats.map(m => (
              <div key={m.id} className="glass p-5 rounded-[2rem] border-white/5">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-lg">👤</div>
                    <div>
                      <h4 className="font-bold text-sm">{m.name}</h4>
                      <p className="text-[9px] text-slate-500 font-black uppercase">জমা: ৳{m.deposit} • মিল: {m.meals}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-black text-sm ${m.balance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {m.balance >= 0 ? 'পাবেন' : 'দিতে হবে'}: ৳{Math.abs(m.balance).toFixed(0)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setShowBazaarModal(true)} className="py-4 bg-emerald-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2"><ShoppingCart size={18}/> বাজার এন্ট্রি</button>
            <button onClick={() => setShowMealModal(true)} className="py-4 bg-sky-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2"><Utensils size={18}/> মিল এন্ট্রি</button>
          </div>
        </div>
      )}

      {/* Shopping List View */}
      {activeSubTab === 'shopping' && (
        <div className="space-y-4">
          <div className="glass p-6 rounded-[2rem] border-amber-500/20">
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2 text-amber-400"><ListTodo size={18}/> নতুন জিনিসের তালিকা</h3>
            <div className="flex gap-2">
              <input value={newShopItem} onChange={e => setNewShopItem(e.target.value)} placeholder="আইটেমের নাম" className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none"/>
              <input value={newShopPrice} onChange={e => setNewShopPrice(e.target.value)} type="number" placeholder="৳" className="w-20 bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-sm focus:outline-none text-center"/>
              <button onClick={addShopItem} className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-white"><Plus/></button>
            </div>
          </div>

          <div className="space-y-3">
            {props.shoppingItems.map(item => (
              <div key={item.id} className={`glass p-4 rounded-3xl border-white/5 flex justify-between items-center ${item.isDone ? 'opacity-40 grayscale' : ''}`}>
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500"><ShoppingBag size={20}/></div>
                   <div>
                      <h4 className="font-bold text-sm">{item.name}</h4>
                      <p className="text-[10px] text-slate-500 font-black uppercase">বাজেট: ৳{item.estimatedPrice}</p>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   {!item.isDone && (
                     <button onClick={() => handleBuyItem(item)} className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all" title="ওয়ালেটে অ্যাড করুন">
                       <Wallet size={18}/>
                     </button>
                   )}
                   <button onClick={() => props.setShoppingItems(props.shoppingItems.filter(i => i.id !== item.id))} className="text-slate-600 hover:text-rose-500"><Trash2 size={16}/></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals for Mess Manager */}
      {showMemberModal && (
        <div className="fixed inset-0 z-[300] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="glass w-full max-w-sm rounded-[2.5rem] p-8 animate-slide-up">
            <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold">নতুন সদস্য</h3><button onClick={() => setShowMemberModal(false)}><X/></button></div>
            <div className="space-y-4">
              <input value={tempMemberName} onChange={e => setTempMemberName(e.target.value)} placeholder="নাম" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4"/>
              <input value={tempMemberDeposit} onChange={e => setTempMemberDeposit(e.target.value)} type="number" placeholder="প্রাথমিক জমা (৳)" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4"/>
              <button onClick={handleAddMember} className="w-full py-4 bg-emerald-500 rounded-2xl font-bold">সদস্য যোগ করুন</button>
            </div>
          </div>
        </div>
      )}

      {showBazaarModal && (
        <div className="fixed inset-0 z-[300] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="glass w-full max-w-sm rounded-[2.5rem] p-8 animate-slide-up">
            <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold">বাজার এন্ট্রি</h3><button onClick={() => setShowBazaarModal(false)}><X/></button></div>
            <div className="space-y-4">
              <select value={tempBazaarMember} onChange={e => setTempBazaarMember(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4">
                <option value="">সদস্য সিলেক্ট করুন</option>
                {props.messMembers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
              <input value={tempBazaarAmount} onChange={e => setTempBazaarAmount(e.target.value)} type="number" placeholder="টাকার পরিমাণ (৳)" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4"/>
              <input value={tempBazaarItem} onChange={e => setTempBazaarItem(e.target.value)} placeholder="কি কি কেনা হলো?" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4"/>
              <button onClick={handleAddBazaar} className="w-full py-4 bg-emerald-500 rounded-2xl font-bold">বাজার সেভ করুন</button>
            </div>
          </div>
        </div>
      )}

      {showMealModal && (
        <div className="fixed inset-0 z-[300] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="glass w-full max-w-sm rounded-[2.5rem] p-8 animate-slide-up">
            <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold">ডেইলি মিল ইনপুট</h3><button onClick={() => setShowMealModal(false)}><X/></button></div>
            <div className="space-y-4">
              <select value={tempMealMember} onChange={e => setTempMealMember(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4">
                <option value="">সদস্য সিলেক্ট করুন</option>
                {props.messMembers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
              <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10">
                 <button onClick={() => setTempMealCount(String(Math.max(0, parseFloat(tempMealCount)-0.5)))} className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-rose-400"><MinusCircle/></button>
                 <span className="flex-1 text-center text-2xl font-black">{tempMealCount}</span>
                 <button onClick={() => setTempMealCount(String(parseFloat(tempMealCount)+0.5))} className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-emerald-400"><PlusCircle/></button>
              </div>
              <button onClick={handleAddMeal} className="w-full py-4 bg-sky-500 rounded-2xl font-bold">মিল যোগ করুন</button>
            </div>
          </div>
        </div>
      )}

      {/* Bill Split Modal */}
      {showBillModal && (
        <div className="fixed inset-0 z-[300] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="glass w-full max-w-sm rounded-[2.5rem] p-8 animate-slide-up">
            <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold">নতুন বিল ভাগ করুন</h3><button onClick={() => setShowBillModal(false)}><X/></button></div>
            <div className="space-y-4">
              <input value={tempTitle} onChange={e => setTempTitle(e.target.value)} placeholder="বিলের নাম (যেমন: ট্রিপ বা ডিনার)" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4"/>
              <input value={tempAmount} onChange={e => setTempAmount(e.target.value)} type="number" placeholder="মোট টাকা (৳)" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4"/>
              <input value={tempParticipants} onChange={e => setTempParticipants(e.target.value)} placeholder="সদস্যদের নাম (কমা দিয়ে লিখুন)" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4"/>
              <button onClick={handleAddBill} className="w-full py-4 bg-sky-500 rounded-2xl font-bold">বিল সেট করুন</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SharedExpensesView;
