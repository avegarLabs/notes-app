"use client";
import { CreateNote, UpdateNote } from "@/interfaces/Note";
import { Note } from "@prisma/client";
import { createContext, useState, useContext } from "react";

export const NoteContext = createContext<{
  notes: Note[];
  loadNotes: () => Promise<void>;
  createNote: (note: CreateNote) => Promise<void>;
  updateNote: (id:number, note: UpdateNote) => Promise<void>;
  deleteNote: (id: number) => Promise<void>;
  selectedNote: Note | null;
  setSelectedNote: (note: Note | null) => void;
}>({
  notes: [],
  loadNotes: async () => {},
  createNote: async (note: CreateNote) => {},
  updateNote: async (id:number,  note: UpdateNote) => {},
  deleteNote: async (id: number) => {},
  selectedNote: null,
  setSelectedNote: (note: Note | null) => {},
});

export const useNotes = () => {
  const context = useContext(NoteContext);
  if (!context) {
    throw new Error("useNote must be use within a NotesProvider");
  }
  return context;
};

export const NotesProvider = ({ children }: { children: React.ReactNode }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  async function loadNotes() {
    const res = await fetch("api/notes");
    let data = await res.json();
    setNotes(data);
  }

  async function createNote(note: CreateNote) {
    const data = await fetch("api/notes", {
      method: "POST",
      body: JSON.stringify(note),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const newNote = await data.json();
    setNotes([...notes, newNote]);
  }

  async function deleteNote(id: number) {
    const res = await fetch("api/notes/" + id, {
      method: "DELETE",
    });
    const data = await res.json();
    setNotes(notes.filter((note) => note.id !== id));
  }

  async function updateNote(id: number, note: UpdateNote) {
    const res = await fetch("api/notes/" + id, {
      body: JSON.stringify(note),
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    setNotes(notes.map((note) => (note.id === id ? data : note)));
  }

  return (
    <NoteContext.Provider
      value={{
        notes,
        loadNotes,
        createNote,
        deleteNote,
        selectedNote,
        setSelectedNote,
        updateNote
      }}
    >
      {children}
    </NoteContext.Provider>
  );
};
