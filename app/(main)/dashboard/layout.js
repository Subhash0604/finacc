import React from 'react'
import DashboardPage from './page'
import { Suspense } from 'react'
import { BarLoader } from 'react-spinners'

const pageLayout = () => {
    return (
        <div className='px-5 mt-40'>
            <h1 className='text-6xl font-bold gradient-title mb-5'>Dashboard</h1>

            <Suspense fallback={<BarLoader className='mt-4' width={"100%"} color=" #d65c66"/>}>
                <DashboardPage />
            </Suspense>
        </div>
    )
}

export default pageLayout
