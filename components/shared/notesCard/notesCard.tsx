'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import moment from 'moment'
import { FileEdit, Trash2 } from 'lucide-react'
import { useNotes } from '@/providers/NotesContext'
import AddNote from '../addNote'

type Props = {
  todo: TodoNote
}

export const NotesCard = ({ todo }: Props) => {
  const editNoteIcon = <FileEdit className='h-6 w-6' color='green' />
  const { deleteNote } = useNotes()
  const formattedDate = moment(todo.date).format('MMMM Do YYYY, h:mm:ss a')
  const handleDeleteNote = () => deleteNote(todo.id!)
  return (
    <Card className='relative hover:scale-105 hover:bg-gray-700 hover:text-white cursor-pointer'>
      <CardHeader>
        <CardTitle>{todo.title}</CardTitle>
        <CardDescription>{todo?.category}</CardDescription>
      </CardHeader>
      <CardContent>{todo.description}</CardContent>
      <CardFooter>{formattedDate}</CardFooter>
      <Trash2 onClick={handleDeleteNote} className='absolute right-3 top-5 h-6 w-6' color='red' />
      <AddNote noteData={todo} icon={editNoteIcon} className='absolute right-10 top-5' />
    </Card>
  )
}
