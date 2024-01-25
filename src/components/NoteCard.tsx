import { Note } from "@prisma/client";
import { useNotes } from "@/context/NoteContext";
import { HiPencil, HiTrash } from "react-icons/hi";
function NoteCard({ note }: { note: Note }) {
  const { deleteNote, setSelectedNote } = useNotes();
  return (
    <div key={note.id} className="bg-slate-300 p-4 my-3 flex justify-between rounded-md">
      <div>
        <h1 className="text-1xl font-bold">{note.title}</h1>
        <p>{note.content}</p>
        <p>{new Date(note.createdAt).toLocaleDateString()}</p>
      </div>
      <div className="flex gap-x-2">
        <button
        onClick={() => {
            setSelectedNote(note)
        }}>
          <HiPencil className="text-2xl text-green-600" />
          </button>
        <button
          onClick={async () => {
            if (confirm("Are you sure you want to delete this note?")) {
              await deleteNote(Number(note.id));
            }
          }}>
          <HiTrash className="text-2xl text-red-600" />
        </button>
      </div>
    </div>
  );
}

export default NoteCard;
