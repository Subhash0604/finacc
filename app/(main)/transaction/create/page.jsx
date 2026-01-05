import { defaultCategories } from '@/data/categories';
import { getAccounts } from '@/server/dashboard'
import React from 'react'
import { TransactionForm } from '../_components/transactionForm';
import { fetchTransactions } from '@/server/transaction';
import { tr } from 'date-fns/locale';


 export default async function CreateAcc({ searchParams }) {
  const accounts = await getAccounts();
  
  const ResovledsearchParams = await searchParams;
  const rawEdit = ResovledsearchParams?.edit;

let transactionId = Array.isArray(rawEdit) ? rawEdit[0] : rawEdit;

if (transactionId?.startsWith("/")) {
  transactionId = transactionId.slice(1);
}

  // const transactionId = searchParams?.edit;
  // console.log("Transaction ID:", transactionId);
  let intialData = null;

  // if(transactionId) {
  //   const transaction = await fetchTransactions(transactionId);
  //   intialData = transaction;
  // }

if(transactionId) {
  try{
    intialData = await fetchTransactions(transactionId);

  }catch(err){
    intialData = null;
  }
}
  return (
    <div className="max-w-3xl mx-auto px-5"> 
      <h1 className="gradient-title text-5xl mb-8">
        {transactionId ? "Edit" : "Add"} Transaction
      </h1>

      <TransactionForm    
        initialData={intialData}
        editMode={!!transactionId}
        accounts={accounts}
        categories={defaultCategories}
      />
    </div>
  );
}


