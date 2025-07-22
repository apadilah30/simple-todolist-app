import AppLayout from "@/components/layout/AppLayout";
import ChecklistInput from "@/components/Checklist/ChecklistInput";
import ChecklistCard from "@/components/Checklist/ChecklistCard";
import type { Checklist } from "@/lib/types";
import { useEffect, useState } from "react";
import axiosInstance from "@/api/axiosInstance";

const Home = () => {
  const [notes, setNotes] = useState<Checklist[]>([]);

  const fetchNotes = async () => {
    try {
      const response = await axiosInstance.get('/checklist');
      console.log('Fetched notes:', response.data.data);
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      return [];
    }
  }

  useEffect(() => {
    const loadNotes = async () => {
      const fetchedNotes = await fetchNotes();
      setNotes(fetchedNotes);
    };

    loadNotes();
  }, []);

  return (
    <AppLayout>
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <ChecklistInput />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {notes.map((note) => (
            <ChecklistCard key={note.id} note={note} />
          ))}
        </div>
      </main>
    </AppLayout>
  );
};

export default Home;