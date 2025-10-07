'use client'

import { SignInButton, UserButton, useUser, useAuth } from '@clerk/nextjs'
import { Authenticated, Unauthenticated } from 'convex/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { Button } from './ui/button'

const Header = () => {
    const pathname = usePathname()
    const isDashboard = pathname.startsWith("/dashboard")
    const { user, isLoaded } = useUser()
    const { signOut } = useAuth()
    
    const handleSignOut = async () => {
        try {
            await signOut()
            // Force page refresh to clear any cached state
            window.location.reload()
        } catch (error) {
            console.error("Sign out error:", error)
        }
    }
    
    return (
        <header className='flex items-center justify-between px-4 h-15 sm:px-6'>
            <Link href={"/dashboard"} className="font-medium uppercase">ChatBook</Link>

            <div className="flex items-center gap-2">
                <Authenticated>
                    {!isDashboard && (
                        <Link href="dashboard">
                            <Button variant="outline">Dashboard</Button>
                        </Link>
                    )}
                    <Button 
                        variant="outline" 
                        onClick={handleSignOut}
                        className="mr-2"
                    >
                        Sign Out
                    </Button>
                    <UserButton />
                </Authenticated>

                <Unauthenticated>
                    <SignInButton
                        mode='modal'
                        forceRedirectUrl={"/dashboard"}
                        signUpForceRedirectUrl={"/dashboard"}
                    >
                        <Button variant={'outline'}>Sign In</Button>
                    </SignInButton>
                </Unauthenticated>
            </div>
        </header>
    )
}

export default Header