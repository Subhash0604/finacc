'use client';

import React, { useMemo, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from '@/components/ui/checkbox'
import { format } from 'date-fns';
import { categoryColors } from '@/data/categories';
import { ChevronDown, ChevronUp, Clock, MoreHorizontal, RefreshCw, Search, Trash, X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const RECURRING_INTERVALS = {
    DAILY: "daily",
    WEEKLY: "weekly",
    MONTHLY: "monthly",
    YEARLY: "yearly",
}

const TransactionTable = ({ transactions = [] }) => {

    const router = useRouter();

    const [selectIds, setSelectIds] = useState([]);
    const [sort, setSort] = useState({
        field: "date",
        direction: "desc",

    })

    const [search, setSearch] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [recurringFilter, setRecurringFilter] = useState("");


    const filterTransactions = useMemo(() => {
        let filtered = [...transactions];
        if(search){
            filtered = filtered.filter((transaction) => transaction.description?.toLowerCase().includes(search.toLowerCase()));
        }

        if(recurringFilter){
            filtered = filtered.filter((transaction) => recurringFilter === "recurring" ? transaction.isRecurring : !transaction.isRecurring);
        }

        if(filterCategory){
            filtered = filtered.filter((transaction) => transaction.type === filterCategory);
        }
        return filtered;
    }, [transactions, search, filterCategory, recurringFilter, sort]);


    // console.log(transactions)
    const handleSort = (field) => {
        setSort(curr => ({
            field,
            direction:
                curr.field == field && curr.direction === "asc" ? "desc" : "asc"
        }))
    }

    const handleSelect = (id) => {
        setSelectIds(curr => curr.includes(id) ? curr.filter(item => item !== id) : [...curr, id])
    }

    const handleSelectAll = () => {
        setSelectIds(curr => curr.length === filterTransactions.length ? [] : filterTransactions.map(item => item.id))
    }

    const handleDeleteAll = () => {
        // deleteFn(selectIds);
        setSelectIds([]);
    }

    const handleClearFilters = () => {
        setSearch("");
        setFilterCategory("");
        setRecurringFilter("");
        setSelectIds([]);
    }
    return (
        <div className='space-y-4'>
            <div className='flex flex-col sm:flex-row gap-4'>
                <div className='relative flex-1'>
                    <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
                    <Input
                        placeholder='Search Transactions'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className='pl-8' />
                </div>
 
                <div className='flex gap-2'>
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                        <SelectTrigger>
                            <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="INCOME">Income</SelectItem>
                            <SelectItem value="EXPENSE">Expense</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={recurringFilter} onValueChange={setRecurringFilter}>
                        <SelectTrigger className='w-[140px]'>
                            <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="recurring">Recurring Only</SelectItem>
                            <SelectItem value="non-recurring">Non-Recurring</SelectItem>
                        </SelectContent>
                    </Select>

                    {selectIds.length > 0 && (
                        <div>
                            <Button variant="destructive"
                            size="sm" onClick={handleDeleteAll}>
                                <Trash className='h-4 w-2 mr-1'/>
                                Delete({selectIds.length})
                            </Button>
                        </div>
                    )}
                    {(search || filterCategory || recurringFilter) && (
                        <Button variant='outline' size="icon" onClick={handleClearFilters} title="Clear Filters">
                            <X className='h-3 w-3'/>
                        </Button>
                    )}
                </div>
            </div>

            <div className='rounded-md border '>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">
                                <Checkbox onCheckedChange={handleSelectAll}
                                    checked={selectIds.length === filterTransactions.length && filterTransactions.length > 0}
                                />
                            </TableHead>
                            <TableHead className="cursor-pointer"
                                onClick={() => handleSort("date")}>
                                <div className='flex items-center'>
                                    Date{sort.field === "date" && (sort.direction === "asc" ? <ChevronUp className='ml-1 h-4 w-4' /> : <ChevronDown className='ml-1 h-4 w-4' />)}
                                </div>
                            </TableHead>
                            <TableHead  >
                                Description
                            </TableHead>
                            <TableHead className="cursor-pointer "
                                onClick={() => handleSort("category")}>
                                <div className='flex items-center'>
                                    Category{sort.field === "category" && (sort.direction === "asc" ? <ChevronUp className='ml-1 h-4 w-4' /> : <ChevronDown className='ml-1 h-4 w-4' />)}
                                </div>
                            </TableHead>
                            <TableHead className="cursor-pointer"
                                onClick={() => handleSort("amount")}>
                                <div className='flex items-center justify-end'>
                                    Amount{sort.field === "amount" && (sort.direction === "asc" ? <ChevronUp className='ml-1 h-4 w-4' /> : <ChevronDown className='ml-1 h-4 w-4' />)}
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
                                    <TableCell><Checkbox onCheckedChange={() => handleSelect(transaction.id)}
                                        checked={selectIds.includes(transaction.id)}
                                    /></TableCell>
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
                                        {transaction.isRecurring ? (
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Badge variant='outline' className='gap-1 bg-orange-100 text-orange-700 hover:bg-orange-200 '>
                                                        <RefreshCw className='h-3 w-3' />
                                                        {RECURRING_INTERVALS[transaction.recurringInterval]}</Badge>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <div className='text-sm'>
                                                        <div className='font-medium'>
                                                            Next Date:
                                                        </div>
                                                        <div>
                                                            {format(new Date(transaction.nextRecurringDate), 'dd MMM yyyy')}
                                                        </div>
                                                    </div>
                                                </TooltipContent>
                                            </Tooltip>
                                        ) : (
                                            <Badge variant='outline' className='gap-1'>
                                                <Clock className='h-3 w-3' />
                                                one-time</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant='ghost' className='h-8 w-8 p-0'><MoreHorizontal className='h-4 w-4' /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem
                                                    onClick={() => router.push(`/transaction/create?edit=/${transaction.id}`)}
                                                >Edit</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className='text-destructive'
                                                // onClick={()=>deleteFn([transaction.id])}
                                                >Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
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
