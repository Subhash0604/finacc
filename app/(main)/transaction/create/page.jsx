import { defaultCategories } from '@/data/categories';
import { getAccounts } from '@/server/dashboard'
import React from 'react'
import { TransactionForm } from '../_components/transactionForm';

 
 export default async function CreateAcc() {
  const accounts = await getAccounts();

  
  return (
    <div className="max-w-3xl mx-auto px-5"> 
      <h1 className="gradient-title text-5xl mb-8">
        Add Transaction
      </h1>

      <TransactionForm    
        accounts={accounts}
        categories={defaultCategories}
      />
    </div>
  );
}
