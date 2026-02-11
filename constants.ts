
import { Category, CurrencyCode, LanguageCode } from './types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'খাদ্য', icon: '🍔', color: 'bg-orange-500' },
  { id: '2', name: 'যাতায়াত', icon: '🚗', color: 'bg-blue-500' },
  { id: '3', name: 'শপিং', icon: '🛍️', color: 'bg-pink-500' },
  { id: '4', name: 'বিল', icon: '📜', color: 'bg-yellow-500' },
  { id: '5', name: 'বেতন', icon: '💰', color: 'bg-green-500' },
  { id: '6', name: 'অন্যান্য', icon: '📦', color: 'bg-gray-500' },
];

export const PAYMENT_MODES = ['Cash', 'Card', 'Bkash', 'Nagad', 'Rocket', 'Bank'];
export const MOODS = ['😊', '😐', '😔', '😡', '🤑'];

export const CURRENCIES: { code: CurrencyCode, symbol: string, name: string }[] = [
  { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
];

export const LANGUAGES: { code: LanguageCode, label: string, icon: string }[] = [
  { code: 'bn', label: 'বাংলা (Bengali)', icon: '🇧🇩' },
  { code: 'en', label: 'English', icon: '🇺🇸' },
];

export const MOCK_RATES: Record<CurrencyCode, number> = {
  BDT: 1,
  USD: 121.50,
  EUR: 132.20,
  GBP: 154.80
};

export const BD_TAX_CONFIG = {
  maleThreshold: 350000,
  femaleThreshold: 400000,
  slabs: [
    { limit: 100000, rate: 0.05 },
    { limit: 300000, rate: 0.10 },
    { limit: 400000, rate: 0.15 },
    { limit: 500000, rate: 0.20 },
    { limit: Infinity, rate: 0.25 }
  ]
};

export const ZAKAT_RATE = 0.025;
export const NISAB_GOLD_GRAMS = 87.48;
export const NISAB_SILVER_GRAMS = 612.36;
