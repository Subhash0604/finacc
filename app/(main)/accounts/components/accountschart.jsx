"use client";

import { endOfDay, format, startOfDay, subDays } from 'date-fns';
import React, { useMemo } from 'react'
import { BarChart,Bar, CartesianGrid, Legend, Tooltip, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'


const DATE_RANGES = {
    "7D": { label: 'Last 7 Days', days: 7 },
    "1M": { label: 'Last 30 Days', days: 30 },
    "3M": { label: 'Last 3 Months', days: 90 },
    "6M": { label: 'Last 6 Months', days: 180 },
    ALL: { label: 'All Time', days: null },
}

const AccountsChart = ({ transactions }) => {

    const [dateRange, setDateRange] = React.useState("1M");

    const filteredData = useMemo(() => {
        const range = DATE_RANGES[dateRange];
        const now = new Date();
        const startDate = range.days ? startOfDay(subDays(now, range.days - 1)) : startOfDay(new Date(0));

        const filtered = transactions.filter((t) => new Date(t.date) >= startDate && new Date(t.date) <= endOfDay(now));

        const grouped = filtered.reduce((acc, transaction) =>    {
            const key = format(new Date(transaction.date), 'yyyy-MM-dd'); 
            const date = format(new Date(transaction.date), 'MMM dd');


            if (!acc[key]) {
                acc[key] = { date: date,rawDate: new Date(transaction.date), income: 0, expense: 0 };
            }

            if (transaction.type === 'INCOME') {
                acc[key].income += transaction.amount;
            } else {
                acc[key].expense += transaction.amount;
            }

            return acc;
        }, {});
        
        return Object.values(grouped).sort((a, b) => a.rawDate - b.rawDate);
        
    }, [dateRange, transactions]);

    const total = useMemo(() => {
        return filteredData.reduce((acc, curr) => ({
            income: acc.income + curr.income,
            expense: acc.expense + curr.expense
        }),
            { income: 0, expense: 0 });
    }, [filteredData])

    return (


        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
                <CardTitle className='text-base font-normal'>Transaction Overview</CardTitle>
                <Select defaultValue={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="S  elect range" />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.entries(DATE_RANGES).map(([key, { label }]) => (
                            <SelectItem  key={key} value={key}>{label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            
            </CardHeader>
            <CardContent>

                <div className='flex justify-around mb-6 text-sm'>
                    <div className='text-center'>
                        <p className='text-muted-foreground'>Total Income</p>
                        <p className='text-lg font-bold text-green-500'>
                            {" "}
                            ${total.income.toFixed(2)}</p>
                    </div>
                    <div className='text-center'>
                        <p className='text-muted-foreground'>Total Expense</p>
                        <p className='text-lg font-bold text-red-500'>
                            {" "}
                            ${total.expense.toFixed(2)}</p>
                    </div>
                    <div className='text-center'>
                        <p className='text-muted-foreground'>Net Income</p>
                        <p className={`text-lg font-bold ${total.income - total.expense >= 0 ? "text-green-500" : "text-red-500"}`}>
                            {" "}
                            ${(total.income - total.expense).toFixed(2)}</p>
                    </div>
                </div>

                <div className='h-[300px]'>

                <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    
                    data={filteredData}
                    margin={{
                        top: 10,
                        right: 10,
                        left: 10,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" />
                    <YAxis
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}/>
                    <Tooltip formatter={(value) => [`$${value}`, undefined]} />
                    <Legend />
                    <Bar dataKey="income" 
                    name="Income "fill="#22c55e"
                    radius={[4,4,0,0]} />
                    <Bar dataKey="expense" 
                    name="Expense "fill="#ef4444" radius={[4,4,0,0]} />
                </BarChart>
            </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}

export default AccountsChart
