
import React from 'react';
import { CurrencyCode } from '../types';
import { CURRENCIES } from '../constants';

interface Props {
  amount: number | string;
  currency?: CurrencyCode;
  isPrivacyMode: boolean;
  isFakeMode?: boolean;
  className?: string;
  showCode?: boolean;
}

const CurrencyText: React.FC<Props> = ({ 
  amount, 
  currency = 'BDT', 
  isPrivacyMode, 
  isFakeMode, 
  className = "",
  showCode = false
}) => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount.replace(/,/g, '')) : amount;
  
  const symbol = CURRENCIES.find(c => c.code === currency)?.symbol || '৳';

  // Logic for Fake Mode: Show a plausible but fictional number
  const getFakeValue = (val: number) => {
    if (isNaN(val)) return "0";
    const fake = (val * 0.43) + 2500;
    return fake.toLocaleString(undefined, { maximumFractionDigits: 0 });
  };

  const displayValue = isFakeMode && typeof numericAmount === 'number' 
    ? getFakeValue(numericAmount) 
    : (typeof amount === 'number' ? amount.toLocaleString(undefined, { minimumFractionDigits: currency === 'BDT' ? 0 : 2, maximumFractionDigits: 2 }) : amount);

  return (
    <span className={`${className} transition-all duration-300 ${isPrivacyMode ? 'blur-md select-none' : ''}`}>
      <span className="opacity-70 mr-0.5">{symbol}</span>
      {displayValue}
      {showCode && <span className="ml-1 text-[0.6em] opacity-50">{currency}</span>}
    </span>
  );
};

export default CurrencyText;
