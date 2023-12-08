'use client'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { NotesProvider } from '@/providers/NotesContext'
import { ClipboardList } from 'lucide-react'
import React from 'react'

type Props = {
  children: React.ReactNode
}

export const PrimaryLayout = ({ children }: Props) => {
  return (
    <div className='min-h-screen max-w-7xl mx-auto p-10 md:p-20 flex flex-col space-y-10'>
      <Alert>
        <ClipboardList className='h-4 w-4' />
        <AlertTitle>TODO List</AlertTitle>
        <AlertDescription>Your go to notes taking app</AlertDescription>
      </Alert>
      <NotesProvider> {children}</NotesProvider>
    </div>
  )
}
