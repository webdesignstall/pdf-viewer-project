'use client'

import React from 'react'
import { useNotes } from '@/providers/NotesContext'
import NotesCard from '../notesCard'

export const NotesCards = () => {
  const { notes } = useNotes()
  return (
    <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3'>
      {notes.map((todo, id) => (
        <NotesCard key={id} todo={todo} />
      ))}
    </div>
  )
}
