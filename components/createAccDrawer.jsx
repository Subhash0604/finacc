'use client'

import { React, useEffect, useState } from 'react'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger, } from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { accountSchema } from '../app/lib/schema'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from '@/components/ui/switch'
import useFetch from '@/hooks/use-fetch'
import { Loader2 } from 'lucide-react'
import { createAcc } from '@/server/dashboard'
import { toast } from 'sonner'




const CreateAccDrawer  = ({ children }) => {

  const [open, setOpen] = useState(false);

  const { register, handleSubmit, formState: { errors },
    setValue,
    watch,
    reset } = useForm({
      resolver: zodResolver(accountSchema),
      defaultValues: {
        name: "",
        type: "CURRENT",
        balance: "",
        isDefault: false,

      }
    });
const { data: newAccount, error , fn:createAccountFn, loading:createAccountLoading } = 
    useFetch(createAcc)

useEffect(() => {
  if(newAccount && !createAccountLoading){
    toast.success("Account created successfully");
    reset();
    setOpen(false);
  }
}, [createAccountLoading, newAccount])

useEffect( () => {
    if(error){
      toast.error(error.message || "Failed to create account")
  }
}, [error])

const onSubmit =async(data) => {
 await createAccountFn(data)
}

  return (
    <div>
      <Drawer open={open} onOpenChange={setOpen} >
        <DrawerTrigger asChild>{children}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          </DrawerHeader>

          <div className="px-4 pb-4">
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Account Name</label>
                <Input type="text" id="name" placeholder="e.g., Main" {...register("name")} />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="type"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Account Type
                </label>
                <Select
                  onValueChange={(value) => setValue("type", value)}
                  defaultValue={watch("type")}
                >
                  <SelectTrigger id="type" className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CURRENT">Current</SelectItem>
                    <SelectItem value="SAVINGS">Savings</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-sm text-red-500">{errors.type.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="balance" className="text-sm font-medium">Balance</label>
                <Input type="number" id="balance" step="0.01" placeholder="0.00" {...register("balance")} />
                {errors.balance && <p className="text-sm text-red-500">{errors.balance.message}</p>}
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex flex-col">
                  <label
                    htmlFor="isDefault"
                    className="text-sm font-medium leading-none"
                  >
                    Set as Default Account
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Use this as your main account by default
                  </p>
                </div>
                <Switch
                  id="isDefault"
                  onCheckedChange={(checked) => setValue("isDefault", checked)}
                  checked={watch("isDefault")}
                />
              </div>
              <div>
                <DrawerFooter className="flex flex-row justify-end gap-3">
                  <DrawerClose asChild>
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </DrawerClose>
                  <Button type="submit">
                    { createAccountLoading ? (<>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                    Creating... </>) : (
                      "Create Account"
                    )  }
                  </Button>
                </DrawerFooter>

              </div>
            </form>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default CreateAccDrawer;
