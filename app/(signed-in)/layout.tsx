"use client"


import UserSyncWrapper from '@/components/UserSyncWrapper'
import React from 'react'

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <UserSyncWrapper>

            {children}</UserSyncWrapper>
    )
}

export default Layout; 