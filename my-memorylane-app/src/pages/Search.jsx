import { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../services/firebase';
import Navbar from '../Layout/Navbar';

export default function Search() {
  const [user] = useAuthState(auth);
  const [query, setQuery] = useState('');
  const [memories, setMemories] = useState([]);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    if (!user) return;

    const db = getDatabase();
    const memoryRef = ref(db, `users/${user.uid}/memories`);
    onValue(memoryRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.values(data);
        setMemories(list);
      }
    });
  }, [user]);

  useEffect(() => {
    const q = query.toLowerCase();
    const results = memories.filter(m =>
      m.title?.toLowerCase().includes(q) ||
      m.note?.toLowerCase().includes(q) ||
      m.tags?.some(tag => tag.toLowerCase().includes(q))
    );
    setFiltered(results);
  }, [query, memories]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Search Memories</h1>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, note, or tag"
          className="w-full p-2 border rounded mb-6"
        />

        {filtered.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {filtered.map((memory, idx) => (
              <div key={idx} className="bg-white p-4 rounded shadow">
                <h2 className="font-bold">{memory.title}</h2>
                <p className="text-sm mb-1">{memory.note}</p>
                {memory.media?.[0] && (
                  <img
                    src={memory.media[0]}
                    alt="memory"
                    className="rounded mt-2"
                  />
                )}
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(memory.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No memories found for "{query}".</p>
        )}
      </div>
    </div>
  );
}
