'use client'

import { SessionProvider, Session } from 'next-auth/react'
import { ReactNode } from 'react'

interface ProvidersProps {
  children: ReactNode
  session?: Session | null
}

export default function Providers({ children, session }: ProvidersProps) {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  )
}