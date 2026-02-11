
import React from 'react';
import { Home, List, PieChart, Briefcase, Plus, Settings, Users, Eye, EyeOff, Sun, Moon, Calculator, Ghost, Facebook, Send, Heart } from 'lucide-react';
import { ThemeMode } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onAddClick: () => void;
  isPrivacyMode: boolean;
  onTogglePrivacy: () => void;
  isFakeMode: boolean;
  onToggleFakeMode: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onToggleCalc: () => void;
  isCalcOpen: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, activeTab, setActiveTab, onAddClick, isPrivacyMode, onTogglePrivacy, 
  isFakeMode, onToggleFakeMode, theme, onToggleTheme, onToggleCalc, isCalcOpen 
}) => {
  const tabs = [
    { id: 'dashboard', icon: Home, label: 'হোম' },
    { id: 'transactions', icon: List, label: 'লেনদেন' },
    { id: 'placeholder', icon: null, label: '' },
    { id: 'shared', icon: Users, label: 'শেয়ারড' },
    { id: 'tools', icon: Briefcase, label: 'টুলস' },
  ];

  return (
    <div className={`min-h-screen flex flex-col pb-24 transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <header className="p-6 sticky top-0 z-50 glass border-b border-white/10 flex justify-between items-center print-hidden shadow-sm">
        <div className="cursor-pointer group" onClick={() => setActiveTab('dashboard')}>
          <h1 className="text-xl font-bold bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform">FinTrack</h1>
          <p className="text-[7px] font-black uppercase tracking-[0.4em] text-slate-500">Premium Finance</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onToggleCalc} className={`p-2 glass rounded-full transition-all hover:scale-110 ${isCalcOpen ? 'text-sky-400 border-sky-500/30' : 'text-slate-400'}`} title="ক্যালকুলেটর"><Calculator size={18} /></button>
          <button onClick={onToggleTheme} className="p-2 glass rounded-full transition-all hover:scale-110">
            {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-600" />}
          </button>
          <button onClick={onTogglePrivacy} className={`p-2 glass rounded-full transition-all ${isPrivacyMode ? 'text-amber-400 border-amber-500/30' : 'text-slate-400'}`} title="প্রাইভেসি মোড">
            {isPrivacyMode ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          <button onClick={() => setActiveTab('settings')} className={`p-2 glass rounded-full transition-all ${activeTab === 'settings' ? 'text-sky-400 border-sky-500/30 shadow-lg shadow-sky-500/10' : 'text-slate-400'}`} title="সেটিংস"><Settings size={18} /></button>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto p-4 md:p-6 w-full">
        {children}
      </main>

      {/* Advanced Modern Footer */}
      <footer className="max-w-4xl mx-auto w-full px-6 py-12 mt-12 border-t border-white/5 print-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="text-center md:text-left">
                <h3 className="text-xl font-black bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent mb-2">FinTrack AI</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-xs mx-auto md:mx-0">
                    আপনার ব্যক্তিগত অর্থ ও লেনদেনের সবচেয়ে বুদ্ধিমান সমাধান। প্রযুক্তির মাধ্যমে জীবন হোক আরও সহজ।
                </p>
            </div>
            <div className="flex flex-col items-center md:items-end gap-6">
                <div className="flex gap-4">
                    <a href="https://www.facebook.com/its.Shohag.X10" target="_blank" rel="noopener noreferrer" 
                       className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-slate-400 hover:text-sky-500 hover:scale-110 transition-all shadow-lg hover:shadow-sky-500/20">
                        <Facebook size={24} />
                    </a>
                    <a href="https://t.me/Shohag_vaii" target="_blank" rel="noopener noreferrer" 
                       className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-slate-400 hover:text-sky-400 hover:scale-110 transition-all shadow-lg hover:shadow-sky-400/20">
                        <Send size={24} />
                    </a>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                    Crafted with <Heart size={10} className="text-rose-500 fill-rose-500" /> by Shohag Vaii
                </div>
            </div>
        </div>
        <div className="mt-10 pt-6 border-t border-white/5 text-center">
            <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">© 2024 FinTrack Premium Finance • All Rights Reserved</p>
        </div>
      </footer>

      <nav className="fixed bottom-0 left-0 right-0 glass border-t border-white/10 p-2 flex justify-around items-center z-50 print-hidden shadow-2xl">
        {tabs.map((tab) => {
          if (tab.id === 'placeholder') {
            return (
              <div key="fab" className="relative -top-8">
                <button onClick={onAddClick} className="w-16 h-16 bg-gradient-to-tr from-sky-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/50 hover:scale-110 active:scale-95 transition-all text-white border-4 border-slate-950">
                  <Plus size={32} />
                </button>
              </div>
            );
          }
          const Icon = tab.icon!;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex flex-col items-center gap-1 transition-all p-2 ${activeTab === tab.id ? 'text-sky-400 scale-110' : 'text-slate-500 hover:text-sky-300'}`}>
              <Icon size={24} />
              <span className="text-[10px] font-black uppercase tracking-tighter">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;
