import React from 'react'
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Button } from './ui/button';
import Image from 'next/image';
import { LayoutDashboard, PenBox } from 'lucide-react';
import { AuthUser } from '@/lib/AuthUser';
import { ModeToggle } from '@/app/component/ModeToggle';

const Header = async() => {
  const user = await AuthUser();
  console.log(user);
  return (
    <header  className='fixed top-0 w-full bg-white/80 dark:bg-black backdrop-blur-md z-50 border-b  shadow-[0_4px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_30px_rgba(255,255,255,0.1)]
                       transition-all duration-300'>
      <nav className='container mx-auto px-4 py-4 flex items-center justify-between'>
     
        <Link href="/">
        <Image 
        
        src={"/Preview.png"}
        alt="finac logo"
        height={60}
        width={200}
        className="h-12 w-auto object-contain"
        />
        </Link>

      <div className="flex items-center gap-3">
          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button variant="outline">Login</Button>
            </SignInButton>
            {/* <SignUpButton> */}
              {/* <Button>Sign Up</Button>
            </SignUpButton> */}
          </SignedOut>

          <SignedIn>
              <Link href={"/dashboard"} className='text-gray-600 dark:text-white hover:text-red-600 flex items-center gap-2'>
                <Button variant="outline" className='dark:border-white glow-button'>
                  <LayoutDashboard size={18}/>
                  <span className='hidden md:inline '>
                    Dashboard
                  </span>
                </Button>
              </Link>

              <Link href={"/transaction/create"}>
                <Button className="flex items-center gap-2">
                  <PenBox size={18}/>
                  <span className='hidden md:inline'>
                    Add Transaction
                  </span>
                </Button>
              </Link>
              <ModeToggle/>
            <UserButton 
            appearance={{
              elements:{
                avatarBox: "w-12 h-12"
              }
            }} afterSignOutUrl="/" />
          </SignedIn>
        </div>
     </nav> 
    </header>
  )
}

export default Header
