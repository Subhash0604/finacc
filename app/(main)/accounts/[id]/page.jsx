import { getAccountsTransaction } from '@/server/accounts'
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react'

import TransactionTable from '../components/transactions';
import { BarLoader } from 'react-spinners';

const AccountsPage = async ({ params }) => {
  const accountData = await getAccountsTransaction(params.id);
console.log(accountData)
  if (!accountData) {
    return notFound();
  }

  const { transactions, ...account } = accountData;

  return (
    <div className='space-y-10 px-5'>
      <div className='flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 border-b pb-6'>
        <div>
          <h1 className='text-5xl sm:text-6xl font-bold gradient-title capitalize'>{account.name}</h1>
          <p className='text-muted-foreground pl-1.5 pt-2'>{account.type.charAt(0) + account.type.slice(1).toLowerCase()} Account</p>
        </div>

        <div className='text-right pb-2'>
          <div className='text-xl sm:text-2xl font-bold'>${parseFloat(account.balance).toFixed(2)}</div>
          <p className='text-sm text-muted-foreground'>{account._count.transactions}Transactions</p>
        </div>
      </div>


        <Suspense fallback={
          <div className='gradient-bar'>
            <BarLoader className='mt-4' width='100%' />
          </div>
        }>
          <TransactionTable transactions={transactions} />
        </Suspense>
    </div>
  )
}

export default AccountsPage
