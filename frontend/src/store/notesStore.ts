import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NotesState {
  notes: Record<string, string>; // section -> content
  setNote: (section: string, content: string) => void;
  getNote: (section: string) => string;
  clearNotes: () => void;
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: {},
      
      setNote: (section: string, content: string) => {
        set((state) => ({
          notes: { ...state.notes, [section]: content }
        }));
      },
      
      getNote: (section: string) => {
        return get().notes[section] || '';
      },
      
      clearNotes: () => {
        set({ notes: {} });
      },
    }),
    {
      name: 'notes-storage',
    }
  )
);