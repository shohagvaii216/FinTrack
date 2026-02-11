
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Layout from './components/Layout';
import Dashboard from './views/Dashboard';
import TransactionsView from './views/TransactionsView';
import BudgetView from './views/BudgetView';
import FinancialToolsView from './views/FinancialToolsView';
import SharedExpensesView from './views/SharedExpensesView';
import SettingsView from './views/SettingsView';
import TransactionForm from './components/TransactionForm';
import DigitalReceipt from './components/DigitalReceipt';
import SmsDetector from './components/SmsDetector';
import PinLockScreen from './components/PinLockScreen';
import CalculatorPopup from './components/CalculatorPopup';
import AiAssistant from './components/AiAssistant';
import { 
  Transaction, Category, Budget, RecurringTransaction, 
  Goal, Debt, Subscription, Investment, BillSplit, 
  MessMember, MessBazaar, MessMeal, UserProfile, Frequency,
  CurrencyCode, ShoppingItem, Loan, IncomeSource 
} from './types';
import { DEFAULT_CATEGORIES } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [viewingReceipt, setViewingReceipt] = useState<Transaction | null>(null);
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('fintrack_profile');
    return saved ? JSON.parse(saved) : {
      name: 'অতিথি ব্যবহারকারী',
      email: 'guest@fintrack.com',
      membership: 'Premium',
      isPinEnabled: false,
      isPrivacyMode: false,
      isFakeMode: false,
      theme: 'dark',
      themeColor: 'sky',
      baseCurrency: 'BDT',
      language: 'bn',
      dateFormat: 'DD-MM-YYYY',
      reminderTime: '22:00'
    };
  });

  const [isPinLocked, setIsPinLocked] = useState(!!profile.isPinEnabled);

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('fintrack_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('fintrack_categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>(() => {
    const saved = localStorage.getItem('fintrack_income_sources');
    return saved ? JSON.parse(saved) : [
      { id: 'inc-1', name: 'বেতন (Salary)', category: 'Salary', icon: '💰' },
      { id: 'inc-2', name: 'ফ্রিল্যান্সিং (Freelance)', category: 'Freelance', icon: '💻' }
    ];
  });

  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const saved = localStorage.getItem('fintrack_budgets');
    return saved ? JSON.parse(saved) : [];
  });

  const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>(() => {
    const saved = localStorage.getItem('fintrack_recurring');
    return saved ? JSON.parse(saved) : [];
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('fintrack_goals');
    return saved ? JSON.parse(saved) : [];
  });

  const [debts, setDebts] = useState<Debt[]>(() => {
    const saved = localStorage.getItem('fintrack_debts');
    return saved ? JSON.parse(saved) : [];
  });

  const [loans, setLoans] = useState<Loan[]>(() => {
    const saved = localStorage.getItem('fintrack_loans');
    return saved ? JSON.parse(saved) : [];
  });

  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    const saved = localStorage.getItem('fintrack_subs');
    return saved ? JSON.parse(saved) : [];
  });

  const [investments, setInvestments] = useState<Investment[]>(() => {
    const saved = localStorage.getItem('fintrack_investments');
    return saved ? JSON.parse(saved) : [];
  });

  const [billSplits, setBillSplits] = useState<BillSplit[]>(() => {
    const saved = localStorage.getItem('fintrack_bills');
    return saved ? JSON.parse(saved) : [];
  });

  const [messMembers, setMessMembers] = useState<MessMember[]>(() => {
    const saved = localStorage.getItem('fintrack_mess_members');
    return saved ? JSON.parse(saved) : [];
  });

  const [messBazaars, setMessBazaars] = useState<MessBazaar[]>(() => {
    const saved = localStorage.getItem('fintrack_mess_bazaars');
    return saved ? JSON.parse(saved) : [];
  });

  const [messMeals, setMessMeals] = useState<MessMeal[]>(() => {
    const saved = localStorage.getItem('fintrack_mess_meals');
    return saved ? JSON.parse(saved) : [];
  });

  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>(() => {
    const saved = localStorage.getItem('fintrack_shopping');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('fintrack_profile', JSON.stringify(profile));
    localStorage.setItem('fintrack_transactions', JSON.stringify(transactions));
    localStorage.setItem('fintrack_categories', JSON.stringify(categories));
    localStorage.setItem('fintrack_income_sources', JSON.stringify(incomeSources));
    localStorage.setItem('fintrack_budgets', JSON.stringify(budgets));
    localStorage.setItem('fintrack_recurring', JSON.stringify(recurringTransactions));
    localStorage.setItem('fintrack_goals', JSON.stringify(goals));
    localStorage.setItem('fintrack_debts', JSON.stringify(debts));
    localStorage.setItem('fintrack_loans', JSON.stringify(loans));
    localStorage.setItem('fintrack_subs', JSON.stringify(subscriptions));
    localStorage.setItem('fintrack_investments', JSON.stringify(investments));
    localStorage.setItem('fintrack_bills', JSON.stringify(billSplits));
    localStorage.setItem('fintrack_mess_members', JSON.stringify(messMembers));
    localStorage.setItem('fintrack_mess_bazaars', JSON.stringify(messBazaars));
    localStorage.setItem('fintrack_mess_meals', JSON.stringify(messMeals));
    localStorage.setItem('fintrack_shopping', JSON.stringify(shoppingItems));
  }, [profile, transactions, categories, incomeSources, budgets, recurringTransactions, goals, debts, loans, subscriptions, investments, billSplits, messMembers, messBazaars, messMeals, shoppingItems]);

  const handleAddTransaction = (txData: Omit<Transaction, 'id'> & { recurringFrequency?: Frequency }) => {
    const { recurringFrequency, ...data } = txData;
    const newTx: Transaction = { ...data, id: uuidv4(), tags: data.tags || [] };
    setTransactions(prev => [newTx, ...prev]);

    if (recurringFrequency) {
      const recurringTx: RecurringTransaction = {
        ...newTx,
        frequency: recurringFrequency
      };
      setRecurringTransactions(prev => [recurringTx, ...prev]);
    }
  };

  const handleImportData = (data: any) => {
    if (data.profile) setProfile(data.profile);
    if (data.transactions) setTransactions(data.transactions);
    if (data.categories) setCategories(data.categories);
    if (data.incomeSources) setIncomeSources(data.incomeSources);
    if (data.budgets) setBudgets(data.budgets);
    if (data.goals) setGoals(data.goals);
    if (data.debts) setDebts(data.debts);
    if (data.loans) setLoans(data.loans);
    if (data.subs) setSubscriptions(data.subs);
    if (data.investments) setInvestments(data.investments);
    if (data.shoppingItems) setShoppingItems(data.shoppingItems);
    if (data.recurring) setRecurringTransactions(data.recurring);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard transactions={transactions} profile={profile} investments={investments} debts={debts} budgets={budgets} />;
      case 'transactions':
        return (
          <TransactionsView 
            transactions={transactions} 
            recurringTransactions={recurringTransactions}
            categories={categories} 
            onViewReceipt={setViewingReceipt} 
            onDeleteTransaction={(id) => setTransactions(transactions.filter(t=>t.id!==id))} 
            onDeleteRecurring={(id) => setRecurringTransactions(recurringTransactions.filter(r=>r.id!==id))}
            profile={profile} 
          />
        );
      case 'shared':
        return <SharedExpensesView billSplits={billSplits} setBillSplits={setBillSplits} messMembers={messMembers} setMessMembers={setMessMembers} messBazaars={messBazaars} setMessBazaars={setMessBazaars} messMeals={messMeals} setMessMeals={setMessMeals} shoppingItems={shoppingItems} setShoppingItems={setShoppingItems} onAddTransaction={handleAddTransaction} />;
      case 'tools':
        return <FinancialToolsView goals={goals} setGoals={setGoals} debts={debts} setDebts={setDebts} loans={loans} setLoans={setLoans} subscriptions={subscriptions} setSubscriptions={setSubscriptions} investments={investments} setInvestments={setInvestments} transactions={transactions} profile={profile} onOpenAi={() => setIsAiOpen(true)} />;
      case 'budget':
        return <BudgetView transactions={transactions} budgets={budgets} categories={categories} goals={goals} setGoals={setGoals} profile={profile} onUpdateBudget={(cat, lim) => {
          const ex = budgets.find(b=>b.category===cat);
          if(ex) setBudgets(budgets.map(b=>b.category===cat?{...b,limit:lim}:b));
          else setBudgets([...budgets, {category:cat, limit:lim}]);
        }} onAddCategory={(cat)=>setCategories([...categories,cat])} />;
      case 'settings':
        return (
          <SettingsView 
            transactions={transactions} 
            categories={categories} 
            incomeSources={incomeSources}
            budgets={budgets} 
            recurring={recurringTransactions} 
            goals={goals} 
            debts={debts} 
            subs={subscriptions} 
            profile={profile} 
            onUpdateProfile={setProfile} 
            onImportData={handleImportData} 
            onAddCategory={(cat)=>setCategories([...categories,cat])} 
            onUpdateIncomeSources={setIncomeSources}
            loans={loans} 
          />
        );
      default: return null;
    }
  };

  if (isPinLocked && profile.pin) {
    return <PinLockScreen correctPin={profile.pin} onUnlock={() => setIsPinLocked(false)} />;
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} onAddClick={() => setIsFormOpen(true)} isPrivacyMode={!!profile.isPrivacyMode} onTogglePrivacy={() => setProfile({ ...profile, isPrivacyMode: !profile.isPrivacyMode })} isFakeMode={!!profile.isFakeMode} onToggleFakeMode={() => setProfile({ ...profile, isFakeMode: !profile.isFakeMode })} theme={profile.theme || 'dark'} onToggleTheme={() => setProfile({ ...profile, theme: profile.theme === 'dark' ? 'light' : 'dark' })} onToggleCalc={() => setIsCalcOpen(!isCalcOpen)} isCalcOpen={isCalcOpen}>
      {renderContent()}
      <AiAssistant isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
      {isFormOpen && <TransactionForm categories={categories} incomeSources={incomeSources} onClose={() => setIsFormOpen(false)} onSubmit={handleAddTransaction} />}
      {viewingReceipt && <DigitalReceipt transaction={viewingReceipt} onClose={() => setViewingReceipt(null)} />}
      {isCalcOpen && <CalculatorPopup onClose={() => setIsCalcOpen(false)} />}
      <SmsDetector onSuggest={handleAddTransaction} />
    </Layout>
  );
};

export default App;
