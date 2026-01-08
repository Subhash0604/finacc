"use client";

import React, { useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardAction } from '@/components/ui/card'
import { format } from 'date-fns';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from 'recharts';

const COLORS = [
    "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28EFF", "#FF6699", "#33CC33", "#FF9933"
]
const DashBoardOverview = ({ accounts, transactions}) => {

    const [selectedAccount, setSelectedAccount] = React.useState(accounts.find((acc) => acc.isDefault)?.id || accounts[0]?.id);


      const accountTransactions = useMemo(() => {
    return transactions.filter(
      (tx) => tx.accountId === selectedAccount
    );
  }, [transactions, selectedAccount]);
 
  const recentTransactions = useMemo(() => {
    return [...accountTransactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  }, [accountTransactions]);
     
    const currentDate = new Date();

    const currentExpenses = accountTransactions.filter((tx) => {
        const txDate = new Date(tx.date);
        return (tx.type === "EXPENSE" &&
        txDate.getMonth() === currentDate.getMonth() &&
        txDate.getFullYear() === currentDate.getFullYear()
        );
    })

    const CategorizeExpense = currentExpenses.reduce((acc, tx) => {
        const category = tx.category || "Uncategorized";
        const amount = Number(tx.amount);
        if(!acc[category]){
            acc[category] = 0;
        }
        acc[category] += amount;
        return acc;
    }, {});

    const pieData = Object.entries(CategorizeExpense).map(([category, amount]) => ({
        name: category,
        value: amount,
    }));

  return (
    <div className='grid gap-4 md:grid-cols-2'>

        <Card>
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
    <CardTitle className="text-base font-normal">Recent Trasactions</CardTitle>
    <Select
     value={selectedAccount}
     onValueChange={setSelectedAccount}>
  <SelectTrigger className="w-[140px]">
    <SelectValue placeholder="Select Account" />
  </SelectTrigger>
  <SelectContent>
    {accounts.map((acc) => (

    <SelectItem key={acc.id} value={acc.id}>{acc.name}</SelectItem>
    ))}
  </SelectContent>
</Select>
  </CardHeader>
  <CardContent>
    <div className='space-y-4'>
{recentTransactions.length === 0 ? (
    <p className='text-center text-muted-foreground py-4'>No recent transactions</p>
) : (
    recentTransactions.map((transaction) => {
       return   <div key={transaction.id} className='flex items-center justify-between'>
            <div className='space-y-1'>
                <p className='text-sm font-medium loading-none'>{transaction.description || "Untitled Transaction"}</p>
                <p className='text-sm text-muted-foreground'>{format(new Date(transaction.date),"PP")}</p>
            </div>

            <div className='flex items-center gap-2'>
                <div className={cn(
                    "flex items-center",
                    transaction.type === "EXPENSE" ? "text-red-500" : "text-green-500"
                )}>
                    {transaction.type === "EXPENSE" ? (
                        <ArrowDownRight className='mr-1 h-4 w-4'/>
                    ): (
                        <ArrowUpRight className='mr-1 h-4 w-4'/>
                    )}
                    {transaction.amount.toFixed(2)}
                    </div> 
                    
                </div>
        </div>
    })
)}

    </div>
  </CardContent>
  
</Card>

<Card>
  <CardHeader>
    <CardTitle>Monthly Expense Breakdown</CardTitle>
  </CardHeader>
  <CardContent className="p-0 pb-5">
    {pieData.length === 0 ? (
        <p className='text-center text-muted-foreground py-4'>No expenses for this month</p>
    ): (
        <div className="h-[300px]">
            <ResponsiveContainer width='100%' height='100%'>
            <PieChart>
<Pie data={pieData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
    {pieData.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
    ))}
    </Pie>
        <Legend/>
    </PieChart>
            </ResponsiveContainer>
        </div>

    )}
    
  </CardContent>
   
</Card>

    </div>
  )
}

export default DashBoardOverview
