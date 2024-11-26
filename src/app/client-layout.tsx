'use client'

import React from 'react'

interface ClientLayoutProps {
  children: React.ReactNode
  geistSans: any
  geistMono: any
}

export function ClientLayout({
  children,
  geistSans,
  geistMono
}: ClientLayoutProps) {
  return (
    <body className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
      {children}
    </body>
  )
}
