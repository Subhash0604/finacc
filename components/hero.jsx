"use client"

import React, { useEffect, useRef } from 'react'
import Link from 'next/link';
import { Button } from './ui/button';
import Image from 'next/image';

const HeroSection = () => {

    const imageRef = useRef()

    useEffect(() => {
        const imageElement = imageRef.current;

        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const scrollThreshold = 100;

            if(scrollPosition > scrollThreshold){
                imageElement.classList.add("scrolled")
            }else{
                imageElement.classList.remove("scrolled")
            }
        }
        window.addEventListener("scroll", handleScroll);


        return () => window.removeEventListener("scroll",handleScroll)
    })
    
  return (
    <div className="pb-20 px-4 pt-28">
        
        <div className='container mx-auto text-center'>
            <h1 className='text-5xl md:text-8xl lg:text-[105px] pb-6 gradient-title '>
              Empowering businesses with precise financial reporting <br /> with Intellegence
            </h1> 
            <p className='text-xl text-gray-570 mb-8 max-2-3xl mx-auto'>
                An AI-powered financial reporting tool that generates accurate and insightful reports in seconds, helping businesses make informed decisions and drive growth
                Unlock the power of automation and intelligence for your financial data.
            </p>

            <div className='flex justify-center space-x-5'>
                <Link href="/dashboard">
                    <Button className="px-8" size="lg">
                        Get Started
                    </Button>
                </Link>
                  <Link href="/dashboard">
                    <Button variant='outline' className="px-8" size="lg">
                        Watch Demo
                    </Button>
                </Link>
            </div>
            <div className='hero-image-wrapper'>
                <div ref={imageRef} className='hero-image'>
                    <Image src="/finance.png"
                    width={1280}
                    height={720}
                    alt="Dashboard Image"
                    className="rounded-lg shadow-2xl border mx-auto"
                    priority    
                    >
                    </Image>
    
                </div>
            </div>
        </div>
      
    </div>
  )
}

export default HeroSection
