"use client";

import React, { useEffect } from 'react'
import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { set } from 'date-fns';
import useFetch from '@/hooks/use-fetch';
import { toast } from 'sonner';
import { updateBudget } from '@/server/budget';
import { Progress } from '@/components/ui/progress';

const BudgetProgress = ({ intialBudget, currentExpense }) => {

    const [isEditing, setIsEditing] = useState(false);
    const [newBudget, setNewBudget] = useState(intialBudget?.amount?.toString() || "");

    
    const {
        loading: isLoading,
        fn: updateBudgetFn,
        data: updateData,
        error,
    } = useFetch(updateBudget);
    
    const percentage = intialBudget ? (currentExpense / intialBudget.amount) * 100 : 0;

    const handleUpdateBudget = async () => {
        const amount = parseFloat(newBudget);

        if(isNaN(amount) || amount <=0){
            toast.error("Please Enter a valid Budget Amount");
            return;
        }
        await updateBudgetFn(amount);
    }
 const handleCancel = () => {
        setNewBudget(intialBudget?.amount?.toString() || "");
        setIsEditing(false);
    }

    useEffect(() => {
        if(updateData?.success){
            setIsEditing(false);
            toast.success("Budget updated successfully");
        }
    },[updateData]) 


    useEffect(() => {
        if(error){
            toast.error("Failed to update budget")
        }
    },[error]) 


   
    return (
        <div>
            <Card className="max-w-md w-full p-4">
      <CardHeader className="p-0">
        <CardTitle className="text-sm font-semibold mb-2">Monthly Budget (Default Account)</CardTitle>

        {isEditing ? (
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 gap-2 mt-2">
            <Input
              type="number"
              value={newBudget}
              onChange={(e) => setNewBudget(e.target.value)}
              className="w-full sm:w-36"
              placeholder="Enter new budget"
              autoFocus
              disabled={isLoading}
            />

            <div className="flex gap-2 mt-2 sm:mt-0">
              <Button
                variant="outline"
                pointer="cursor"
                size="sm"
                className="border-green-500 hover:bg-green-500 hover:text-white transition-colors"
                onClick={handleUpdateBudget}
                disabled={isLoading}
              >
                Save
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white transition-colors"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-2 gap-2">
            <CardDescription className="text-sm text-muted-foreground">
              {intialBudget
                ? `$${currentExpense.toFixed(2)} of $${intialBudget.amount.toFixed(2)} spent`
                : "No budget set"}
            </CardDescription>

            <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
              <Edit className="w-5 h-5 text-blue-600" />
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-3">
        {intialBudget && (
          <div className="space-y-2 ">
            <Progress value={percentage}
            extraStyles={`${
                percentage >= 90 ? "bg-red-500" :
                percentage >= 75 ? "bg-yellow-500" :
                "bg-green-500"
            }`}
            />
            <p className='text-xs text-muted-foreground text-right'>
                {percentage.toFixed(2)}% used
            </p>
            <div/>
          </div>
        )}
      </CardContent>
    </Card>
        </div>
    )
}

export default BudgetProgress
