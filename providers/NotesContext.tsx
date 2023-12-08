'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import moment from 'moment'

type Props = {
  children: React.ReactNode
}

type NotesContextProps = {
  notes: TodoNote[]
  addNote: (_payload: TodoNote) => void
  deleteNote: (_id: string) => void
  updateNote: (_id: string, _data: TodoNote) => void
}

const NotesContext = createContext<NotesContextProps>({
  notes: [],
  addNote: (_payload: TodoNote) => {},
  deleteNote: (_id: string) => {},
  updateNote: (_id: string, _data: TodoNote) => {},
})

export const useNotes = () => {
  return useContext(NotesContext)
}

export const NotesProvider = ({ children }: Props) => {
  const [notes, setNotes] = useState<TodoNote[]>([])

  useEffect(() => {
    const storedNotes = localStorage.getItem('notes')
    setNotes(storedNotes ? JSON.parse(storedNotes) : [])
  }, [])

  useEffect(() => {
    if (!notes.length) return
    localStorage.setItem('notes', JSON.stringify(notes))
  }, [notes])

  const addNote = (payload: TodoNote) => {
    const newNote = {
      id: new Date().getTime().toString(),
      title: payload.title,
      description: payload.description,
      category: payload.category,
      date: moment().toISOString(),
    }

    setNotes((prevNotes) => [...prevNotes, newNote])
  }

  const updateNote = (noteId: string, updatedData: TodoNote) => {
    const updatedNotes = notes.map((note) =>
      note.id === noteId ? { ...note, ...updatedData, date: moment().toISOString() } : note
    )

    setNotes(updatedNotes)
  }

  const deleteNote = (noteId: string) => {
    const updatedNotes = notes.filter((note) => note.id !== noteId)
    setNotes(updatedNotes)
  }

  return <NotesContext.Provider value={{ notes, addNote, updateNote, deleteNote }}>{children}</NotesContext.Provider>
}
