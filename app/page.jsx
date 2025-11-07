import React from 'react'
import HeroSection from '../components/hero'
import { featuresData, howItWorksData, statsData, testimonialsData } from '@/data/landing'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link';
import { Button } from '@/components/ui/button'

const page = () => {
  return (
    <div>
      <HeroSection />
      <section className='py-20 text-center bg-red-50 dark:bg-black'>
        <div className='container mx-auto px-4'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>

            {statsData.map((statsData, index) => (
              <div key={index}>
                <div className='text-4xl font-bold text-red-400 dark:text-gray-white mb-2'>{statsData.value}</div>
                <div className='text-gray-550'>{statsData.label}</div>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* featuresection */}
      <section className='py-20'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold text-center mb-12'>Everything you need to manage your finances </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {featuresData.map((feature, index) => (
              <Card key={index} className="pd-6">
                <CardContent className="space-y-4 pt-4">
                  {feature.icon}
                  <h3 className='text-xl font-semibold'>{feature.title}</h3>
                  <p  className='text-gray-600 dark:text-gray-400'>{feature.description}</p>
                </CardContent>
              </Card>

            ))}
          </div>
        </div>
      </section>

            {/* how it works section */}
      <section className='py-20 bg-red-50 dark:bg-black'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold text-center mb-16'>How It Works</h2>
          <div className='grid grid-cols-1 md:grid-cols- lg:grid-cols-3 gap-8'>
            {howItWorksData.map((step, index) => (
              <div key={index} className='text-center'>
                <div>
                    <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6'>{step.icon}</div>
                    <h3 className='text-xl font-semibold mb-4'>{step.title}</h3>
                    <p className='text-gray-600 dark:text-gray-400'>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='py-20'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold text-center mb-12'>What our Users Say </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {testimonialsData.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <CardContent className=" pt-4">
                 <div className='flex items-center mb-4'>
                  <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  width={40}
                  height={40}
                  className='rounded-full'
                  />

                  <div className='ml-4'>
                    <div className='font-semibold'>{testimonial.name}
                    </div>
                    <div className='text-gray-600 dark:text-white'>{testimonial.role }
                    </div>
                  </div>
                 </div>
                <p className='text-gray-600 dark:text-gray-400'>{testimonial.quote}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

    {/* getStart section */}
            
      <section className='py-20 bg-red-500 dark:bg-black'>
        <div className='container mx-auto px-4 text-center'>
          <h2 className='text-3xl font-bold text-white mb-4'>Start today and unlock financial intelligence with Finac
          </h2>
          <p className='text-red-100 mb-8 max-w-2xl mx-auto'>
            Join thousands of satisfied users who trust Finac to manage their finances effectively and efficiently
          </p>
          <Link href='/dashboard'>
          <Button
            size="lg"
            className="bg-white text-red-500 hover:bg-red-50 animate-pulse"
          >
            Start Free Trial
          </Button>
          </Link>
        </div>
      </section>
      


    </div>
  )
}

export default page
