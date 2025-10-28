import React from 'react'
import CreateAccDrawer from '@/components/createAccDrawer'
import { Card, CardContent } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import { getAccounts } from '@/server/dashboard'
import AccountCard from './_components/account-card'
import { getBudgetSummary } from '@/server/budget'
import BudgetProgress from './_components/budget-dashboard'

async function DashboardPage() {

  const accounts = await getAccounts();
  // console.log(accounts);

  const defaultAccount = accounts.find(acc => acc.isDefault);

  let budgetData = null;
  if(defaultAccount){
    budgetData = await getBudgetSummary(defaultAccount.id);
  }

  return (
    <div className='space-y-5'>

       {defaultAccount && <BudgetProgress
        intialBudget = {budgetData?.budget}
        currentExpense = {budgetData?.currentExpense || 0}/>}       
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <CreateAccDrawer>
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed">
            <CardContent className="flex flex-col items-center justify-center text-muted-foreground h-full pt-5">
              <Plus className="h-10 w-10 mb-2" />
              <p className="text-sm font-medium">Add New Account</p>
            </CardContent>
          </Card>
        </CreateAccDrawer>
        {accounts.length > 0 &&
          accounts?.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
      </div>
    </div>
  )
}

export default DashboardPage
