import { useEffect, useState } from 'react';
import { db, auth } from '../../services/firebase';
import { ref, onValue } from 'firebase/database';
import MemoryCard from './MemoryCard';

export default function MemoryTimeline() {
  const [memories, setMemories] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const memRef = ref(db, `users/${user.uid}/memories`);
    onValue(memRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.entries(data).map(([id, mem]) => ({
          id,
          ...mem
        }));
        list.sort((a, b) => new Date(b.date) - new Date(a.date));
        setMemories(list);
      }
    });
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Your Memories Timeline</h2>
      <div className="space-y-4">
        {memories.map((mem) => (
          <MemoryCard key={mem.id} memory={mem} />
        ))}
      </div>
    </div>
  );
}
