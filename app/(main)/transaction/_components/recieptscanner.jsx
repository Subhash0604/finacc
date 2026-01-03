"use client";


import { Button } from '@/components/ui/button';
import useFetch from '@/hooks/use-fetch';
import { scanReceipt } from '@/server/transaction';
import { Camera, Loader2 } from 'lucide-react';
import React, { useEffect, useRef } from 'react'
import { toast } from 'sonner';

const RecieptScanner = ({ onScanComplete }) => {

    const fileInputRef = useRef();

    const {
        loading: scanReceiptLoading,
        fn: scanReceiptFn,
        data: scanData,
    } = useFetch(scanReceipt)

    const handleReceiptScan = async(file) => {
        if(file.size > 5 * 1024 * 1024){
            toast.error("File size should be less than 5MB")
            return;
        }
        await scanReceiptFn(file);
    }

    useEffect(() =>{
        if(scanData && !scanReceiptLoading ){
            onScanComplete(scanData);
            toast.success("receipt scanned Successfully")
        }
    },[scanReceiptLoading, scanData])
  return (
    <div>
        <input type="file"  ref={fileInputRef} accept='image/' capture='environment' className='hidden'
        onChange={(e) => {
            const file = e.target.files?.[0];
            if(file) handleReceiptScan(file)
        }}
        />
        <Button type='button' variant='outline' className='w-full h-10 cursor-pointer animate-gradient  hover:opacity-90 transition-opacity text-white hover:text-white'
        onClick={() => fileInputRef.current?.click()}
        disabled={scanReceiptLoading}
        >
            {scanReceiptLoading ? (
                <>
                <Loader2 className='mr-2 animate-spin'/>
                <span>Scanning Receipt</span>
                </>
            ): (
                <>
                <Camera className='mr-2'/>
                <span className='text-white'>Scan Receipt with AI</span>
                </>
            )}
        </Button>
        
    </div>
  )
}

export default RecieptScanner
