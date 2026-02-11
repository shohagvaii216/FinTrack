
export type PaymentMode = 'Cash' | 'Card' | 'Bkash' | 'Nagad' | 'Rocket' | 'Bank';
export type TransactionType = 'Income' | 'Expense';
export type Frequency = 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
export type ThemeMode = 'light' | 'dark';
export type ThemeColor = 'sky' | 'emerald' | 'rose' | 'amber';
export type DateFormat = 'DD-MM-YYYY' | 'YYYY-MM-DD' | 'MM/DD/YYYY';
export type AssetType = 'Stock' | 'SavingsCertificate' | 'Crypto' | 'Gold' | 'RealEstate' | 'Other';
export type CurrencyCode = 'BDT' | 'USD' | 'EUR' | 'GBP';
export type LanguageCode = 'bn' | 'en';

export interface UserProfile {
  name: string;
  username?: string;
  email: string;
  membership: 'Free' | 'Premium';
  avatar?: string;
  isPinEnabled?: boolean;
  pin?: string;
  isPrivacyMode?: boolean;
  isFakeMode?: boolean;
  theme?: ThemeMode;
  themeColor?: ThemeColor;
  baseCurrency?: CurrencyCode;
  language?: LanguageCode;
  dateFormat?: DateFormat;
  reminderTime?: string;
}

export interface IncomeSource {
  id: string;
  name: string;
  category: string;
  icon: string;
}

export interface Loan {
  id: string;
  title: string;
  totalAmount: number;
  interestRate: number;
  durationMonths: number;
  startDate: string;
  emiAmount: number;
  paidMonths: number;
  isCompleted: boolean;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  currency: CurrencyCode;
  renewalDate: string;
  frequency: Frequency;
  isActive: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Transaction {
  id: string;
  amount: number;
  currency: CurrencyCode;
  type: TransactionType;
  category: string;
  date: string;
  paymentMode: PaymentMode;
  note: string;
  tags: string[];
  attachment?: string;
  mood?: string;
  isRecurring?: boolean;
}

export interface RecurringTransaction extends Transaction {
  frequency: Frequency;
}

export interface ShoppingItem {
  id: string;
  name: string;
  estimatedPrice: number;
  isDone: boolean;
}

export interface Budget {
  category: string;
  limit: number;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  icon: string;
}

export interface Debt {
  id: string;
  personName: string;
  amount: number;
  type: 'Lent' | 'Borrowed';
  date: string;
  dueDate?: string;
  note: string;
  isSettled: boolean;
}

export interface BillSplit {
  id: string;
  title: string;
  totalAmount: number;
  participants: string[];
  payer: string;
  date: string;
  isSettled: boolean;
}

export interface Investment {
  id: string;
  name: string;
  type: AssetType;
  buyPrice: number;
  currentPrice: number;
  purchaseDate: string;
  note?: string;
}

export interface MessMember { id: string; name: string; deposit: number; }
export interface MessBazaar { id: string; memberId: string; amount: number; item: string; date: string; }
export interface MessMeal { id: string; memberId: string; count: number; date: string; }

export interface ForecastResult {
  nextMonthTotal: number;
  confidenceScore: number;
  insights: string;
  categoryBreakdown: any[];
}
