"use client"

import React from 'react'
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { Authenticated, AuthLoading, ConvexReactClient, Unauthenticated } from "convex/react";
import LoadingLogo from '@/components/shared/LoadingLogo';
import { ClerkProvider, useAuth, SignInButton, SignOutButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button';

type Props = {
    children: React.ReactNode;
}

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || "";

const convex = new ConvexReactClient(CONVEX_URL);

const ConvexClientProvider = ({children}: Props) => {
  return (
    <ClerkProvider>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
            <Authenticated>
                {children}
            </Authenticated>
            <AuthLoading>
                <LoadingLogo />
            </AuthLoading>
            <div className='flex h-screen items-center justify-center'>
                <Unauthenticated>
                    <Button>
                        <SignInButton />
                    </Button>
                </Unauthenticated>
            </div>
        </ConvexProviderWithClerk>
    </ClerkProvider>
  )
}

export default ConvexClientProvider;