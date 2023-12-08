'use client'
import AddNote from '@/components/shared/addNote'
import NotesCards from '@/components/shared/notesCards'
import { PlusCircle } from 'lucide-react'
import React from 'react'

export const Home = () => {
  const addNoteIcon = <PlusCircle className='h-10 w-10 cursor-pointer hover:scale-105' />
  return (
    <div className='relative flex-1'>
      <NotesCards />
      <AddNote icon={addNoteIcon} className='absolute bottom-5 right-5' />
    </div>
  )
}
