"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { transactionSchema } from "@/app/lib/schema";
import useFetch from "@/hooks/use-fetch";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import CreateAccDrawer from "@/components/CreateAccDrawer";
import { useRouter } from "next/navigation";
import { addTransaction } from "@/server/transaction";
import { toast } from "sonner";
import RecieptScanner from "./recieptscanner";

export function TransactionForm({ accounts, categories }) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
    reset,
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "EXPENSE",
      amount: "",
      description: "",
      accountId: accounts.find((ac) => ac.isDefault)?.id,
      date: new Date(),
      isRecurring: false,
      recurringInterval: "",
      category: "",
    },
  });

  const { loading: transactionLoading, fn: transactionFn, data: transactionResult } = useFetch(addTransaction);

  

  const router = useRouter();



  const onSubmit =  (data) => {
    const formData = {
      ...data,
      amount: parseFloat(data.amount),
    };
     transactionFn(formData);
  };

 
  useEffect(() => {
    if (transactionResult?.success && !transactionLoading) {
      toast.success("Transaction created successfully");
      reset();
      router.push(`/accounts/${transactionResult.data.accountId}`);
    }
    
  }, [transactionResult, transactionLoading]);

  const type = watch("type");
  const isRecurring = watch("isRecurring");
  const date = watch("date");

  const filteredCategories = categories.filter((category) => category.type === type);

  const handleScanComplete = (scanData) => {
    console.log(scanData)
  }
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-3xl mx-auto bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm rounded-2xl p-8"
    >

     {/* <RecieptScanner onScanComplete={handleScanComplete}/> */}
      <h2 className="text-2xl font-semibold mb-2 text-neutral-900 dark:text-neutral-100">
        Create Transaction
      </h2>
      <p className="text-sm text-neutral-500 mb-6">
        Record an income or expense, select its account, category, and schedule.
      </p>
    
      <Controller
        name="type"
        control={control}
        render={({ field }) => (
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
              Transaction Type
            </label>
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="!h-11 w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INCOME">Income</SelectItem>
                <SelectItem value="EXPENSE">Expense</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && <p className="text-xs text-red-500 mt-1">{errors.type.message}</p>}
          </div>
        )}
      />  
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2 ">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
            Amount
          </label>
          <Input type="number" step="0.01" placeholder="0.00" className="h-11" {...register("amount")} />
          {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount.message}</p>}
        </div>
 
        <Controller
          name="accountId"
          control={control}
          render={({ field }) => (
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200">Account</label>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="!h-11 w-full">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name} (${parseFloat(account.balance).toFixed(2)})
                    </SelectItem>
                  ))}
                  <div className="border-t mt-2 pt-2">
                    <CreateAccDrawer>
                      <Button variant="ghost" className="w-full text-sm">
                        + Create New Account
                      </Button>
                    </CreateAccDrawer>
                  </div>
                </SelectContent>
              </Select>
              {errors.accountId && <p className="text-xs text-red-500 mt-1">{errors.accountId.message}</p>}
            </div>
          )}
        />
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200">Category</label>
              <Select  onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="!h-11 w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-sm text-muted-foreground">No categories available</div>
                  )}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>}
            </div>
          )}
        />
 
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button className="w-full h-11 justify-start text-left font-normal" variant="outline">
                    {field.value ? format(field.value, "PPP") : "Pick a Date"}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(d) => d > new Date() || d < new Date("1900-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date.message}</p>}
            </div>
          )}
        />

     
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200">Description</label>
          <Input placeholder="Add a short description (optional)" className="h-11" {...register("description")} />
          {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
        </div>
      </div>
 
      <Controller
        name="isRecurring"
        control={control}
        render={({ field }) => (
          <div className="flex items-center justify-between rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-4">
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                Recurring Transaction
              </label>
              <p className="text-xs text-muted-foreground">Enable to make this transaction repeat automatically</p>
            </div>
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          </div>
        )}
      />

    
      {isRecurring && (
        <Controller
          name="recurringInterval"
          control={control}
          render={({ field }) => (
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                Recurring Interval
              </label>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select interval" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DAILY">Daily</SelectItem>
                  <SelectItem value="WEEKLY">Weekly</SelectItem>
                  <SelectItem value="MONTHLY">Monthly</SelectItem>
                  <SelectItem value="YEARLY">Yearly</SelectItem>
                </SelectContent>
              </Select>
              {errors.recurringInterval && <p className="text-xs text-red-500 mt-1">{errors.recurringInterval.message}</p>}
            </div>
          )}
        />
      )}
    <div className="flex gap-2">
      <Button variant="outline" className="" type='button' onClick={() => router.back()}>Cancel</Button>
      <Button type="submit" disabled={transactionLoading} className="cursor-pointer text-base font-medium hover:bg-gray-700 ">
        {transactionLoading ? "Saving..." : "Save Transaction"}
      </Button>
      </div>
    </form>
  );
};


