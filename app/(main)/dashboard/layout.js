import React from 'react'
import DashboardPage from './page'
import { Suspense } from 'react'
import { BarLoader } from 'react-spinners'

const pageLayout = () => {
    return (

        <div className="px-5">
            <div className="flex items-center justify-between mb-5">
                <h1 className="text-6xl font-bold tracking-tight gradient-title">
                    Dashboard
                </h1>
            </div>
            
            <Suspense
                fallback={
                <div className='gradient-bar'>
                <BarLoader className="mt-4" width={"100%"}/> 
                </div>}
            >
                <DashboardPage />
            </Suspense>
            
        </div>
    )
}

export default pageLayout
