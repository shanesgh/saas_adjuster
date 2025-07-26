import { useState, useEffect } from "react";
import { useNotesStore } from "../../store/notesStore";
import { apiClient } from "../../lib/api";
import { useAuth } from "@clerk/clerk-react";

interface NotesTextboxProps {
  section: string;
  claimId?: string;
  placeholder?: string;
}

export const NotesTextbox = ({
  section,
  claimId,
  placeholder = "Add notes...",
}: NotesTextboxProps) => {
  const { getToken } = useAuth();
  const { setNote, getNote } = useNotesStore();
  const [content, setContent] = useState(getNote(section));
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    setContent(getNote(section));
  }, [section, getNote]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    setNote(section, newContent);
  };

  const saveToDatabase = async () => {
    if (!claimId || !content.trim()) return;

    setIsSaving(true);
    try {
      const token = await getToken();
      if (token) {
        apiClient.setToken(token);
        await apiClient.createNote({
          claimId,
          section,
          content: content.trim(),
        });
        setLastSaved(new Date());
      }
    } catch (error) {
      console.error("Failed to save note:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBlur = () => {
    if (claimId && content.trim()) {
      saveToDatabase();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">Notes</label>
        {lastSaved && (
          <span className="text-xs text-gray-500">
            Saved {lastSaved.toLocaleTimeString()}
          </span>
        )}
        {isSaving && <span className="text-xs text-blue-600">Saving...</span>}
      </div>
      <textarea
        value={content}
        onChange={handleChange}
        onBlur={handleBlur}
        rows={5}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        placeholder={placeholder}
      />
    </div>
  );
};
