// src/components/TaxCalculator.tsx
"use client";

import { useState } from 'react';

const incomeTaxBrackets = [
  { limit: 237100, rate: 0.18 },
  { limit: 370500, rate: 0.26 },
  { limit: 512800, rate: 0.31 },
  { limit: 673000, rate: 0.36 },
  { limit: Infinity, rate: 0.39 },
];

const businessTaxRate = 0.28;
const vatRate = 0.15;

const calculateIncomeTax = (salary: number, isAnnual: boolean) => {
  const amount = isAnnual ? salary : salary * 12;
  let tax = 0;

  for (let i = 0; i < incomeTaxBrackets.length; i++) {
    const bracket = incomeTaxBrackets[i];
    if (amount > bracket.limit) {
      tax += (Math.min(amount, bracket.limit) - (i > 0 ? incomeTaxBrackets[i - 1].limit : 0)) * bracket.rate;
    } else {
      tax += (amount - (i > 0 ? incomeTaxBrackets[i - 1].limit : 0)) * bracket.rate;
      break;
    }
  }

  return tax;
};

const calculateBusinessTax = (income: number) => income * businessTaxRate;

const TaxCalculator = () => {
  const [taxType, setTaxType] = useState<string>('');
  const [amount, setAmount] = useState<number | ''>('');
  const [isAnnual, setIsAnnual] = useState<boolean>(true);
  const [result, setResult] = useState<{
    tax: number;
    remainingAmount: string;
  } | null>(null);

  const handleCalculate = () => {
    if (amount === '') return;

    const numericAmount = Number(amount);
    let tax = 0;
    let remainingAmount = '';

    switch (taxType) {
      case 'income':
        if (numericAmount <= incomeTaxBrackets[0].limit && isAnnual) {
          tax = 0;
          remainingAmount = `Amount remaining after tax: R${numericAmount.toFixed(2)}`;
        } else {
          if (isAnnual) {
            tax = calculateIncomeTax(numericAmount, true);
            remainingAmount = `Amount remaining after tax: R${(numericAmount - tax).toFixed(2)}`;
          } else {
            // Monthly calculation: calculate monthly tax and remaining amount
            const monthlyIncome = numericAmount;
            const annualIncome = monthlyIncome * 12;
            const annualTax = calculateIncomeTax(annualIncome, true);
            const monthlyTax = annualTax / 12;
            remainingAmount = `Amount remaining after tax: R${(monthlyIncome - monthlyTax).toFixed(2)}`;
            tax = monthlyTax;
          }
        }
        break;
      case 'business':
        if (isAnnual) {
          tax = calculateBusinessTax(numericAmount);
          remainingAmount = `Amount remaining after tax: R${(numericAmount - tax).toFixed(2)}`;
        } else {
          // Monthly calculation: calculate monthly tax and remaining amount
          const monthlyIncome = numericAmount;
          const annualIncome = monthlyIncome * 12;
          const annualTax = calculateBusinessTax(annualIncome);
          const monthlyTax = annualTax / 12;
          remainingAmount = `Amount remaining after tax: R${(monthlyIncome - monthlyTax).toFixed(2)}`;
          tax = monthlyTax;
        }
        break;
      case 'vat':
        tax = numericAmount * vatRate;
        remainingAmount = `Amount remaining after VAT: R${(numericAmount - tax).toFixed(2)}`;
        break;
      default:
        return;
    }

    setResult({ tax, remainingAmount });
  };

  return (
    <div>
      <h1>Government Protection Fee Calculator</h1>
      <div>
        <label>
          <input
            type="radio"
            value="income"
            checked={taxType === 'income'}
            onChange={() => setTaxType('income')}
          />
          Income Tax
        </label>
        <label>
          <input
            type="radio"
            value="business"
            checked={taxType === 'business'}
            onChange={() => setTaxType('business')}
          />
          Business Tax
        </label>
        <label>
          <input
            type="radio"
            value="vat"
            checked={taxType === 'vat'}
            onChange={() => setTaxType('vat')}
          />
          VAT
        </label>
      </div>

      <div>
        <label>
          Amount:
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
            placeholder="Enter amount"
          />
        </label>
        {(taxType === 'income' || taxType === 'business') && (
          <div>
            <label>
              <input
                type="radio"
                value="annual"
                checked={isAnnual}
                onChange={() => setIsAnnual(true)}
              />
              Annual
              <input
                type="radio"
                value="monthly"
                checked={!isAnnual}
                onChange={() => setIsAnnual(false)}
              />
              Monthly
            </label>
          </div>
        )}
      </div>

      <button onClick={handleCalculate}>Calculate</button>

      {result && (
        <div>
          <h2>Results</h2>
          <p>Total tax amount deducted: R{result.tax.toFixed(2)}</p>
          <p>{result.remainingAmount}</p>
        </div>
      )}
    </div>
  );
};

export default TaxCalculator;
