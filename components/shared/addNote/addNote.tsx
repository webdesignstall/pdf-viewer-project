'use client'

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import React from 'react'
import CardForm from '../cardForm'

type Props = {
  icon: React.ReactNode
  noteData?: TodoNote
  className?: string
}

export const AddNote = ({
  icon,
  noteData = {
    title: '',
    description: '',
  },
  className,
}: Props) => {
  const [open, setOpen] = React.useState(false)
  return (
    <div className={`${className}`}>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>{icon}</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add a Todo List</AlertDialogTitle>
            <AlertDialogDescription>
              <CardForm noteData={noteData} setDialog={setOpen} />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
