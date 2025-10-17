'use client';

import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from '@/components/ui/checkbox'
import { format } from 'date-fns';
import { categoryColors } from '@/data/categories';
import { Clock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@radix-ui/react-tooltip';
import { Badge } from '@/components/ui/badge' 


const TransactionTable = ({ transactions = [] }) => {
    const filterTransactions = transactions;

    console.log(transactions)
    const handleSort = () => {

    }
    return (
        <div className='space-y-4'>
            <div className='rounded-md border '>

                <Table>

                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">
                                <Checkbox />
                            </TableHead>
                            <TableHead className="cursor-pointer"
                                onClick={() => handleSort("date")}>
                                <div className='flex items-center'>
                                    Date
                                </div>
                            </TableHead>
                            <TableHead  >
                                Description
                            </TableHead>
                            <TableHead className="cursor-pointer "
                                onClick={() => handleSort("category")}>
                                <div className='flex items-center'>
                                    Category
                                </div>
                            </TableHead>
                            <TableHead className="cursor-pointer"
                                onClick={() => handleSort("date")}>
                                <div className='flex items-center justify-end'>
                                    Amount
                                </div>
                            </TableHead>
                            <TableHead>
                                Reccuring
                            </TableHead>

                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filterTransactions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center text-muted-foreground">
                                    No Transactions Found
                                </TableCell>
                            </TableRow>
                        ) : (
                            filterTransactions.map((transaction) => (
                                <TableRow key={transaction.id}>
                                    <TableCell><Checkbox /></TableCell>
                                    <TableCell>{format(new Date(transaction.date), 'dd MMM yyyy')}</TableCell>
                                    <TableCell>{transaction.description}</TableCell>
                                    <TableCell className="capitalize">
                                        <span
                                            style={{
                                                background: categoryColors[transaction.category] || "#6b7280",
                                            }}
                                            className="text-white px-2 py-1 rounded text-sm"
                                        >
                                            {transaction.category}
                                        </span>
                                    </TableCell>
                                    <TableCell
                                        className="text-right font-medium"
                                        style={{
                                            color: transaction.type === "EXPENSE" ? "red" : "green",
                                        }}
                                    >
                                        {transaction.type === "EXPENSE" ? "-" : "+"}${transaction.amount.toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                        {transaction.recurring ? (
                                            <Tooltip>
                                                <TooltipTrigger>Hover</TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Add to library</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        ) : (
                                            <Badge variant='outline' className='gap-1'>
                                                <Clock className='h-3 w-3'/>
                                                one-time</Badge>
                                        )}
                                    </TableCell>

                                </TableRow>
                            ))
                        )}
                    </TableBody>


                </Table>
            </div>
        </div>
    )
}

export default TransactionTable
