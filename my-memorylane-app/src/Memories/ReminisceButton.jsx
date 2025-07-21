import { useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../services/firebase';

export default function ReminisceButton() {
  const [user] = useAuthState(auth);
  const [randomMemory, setRandomMemory] = useState(null);

  const handleReminisce = () => {
    if (!user) return;
    const db = getDatabase();
    const memoryRef = ref(db, `users/${user.uid}/memories`);

    onValue(memoryRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.values(data);
        const random = list[Math.floor(Math.random() * list.length)];
        setRandomMemory(random);
      }
    }, { onlyOnce: true });
  };

  return (
    <div className="mt-6">
      <button
        onClick={handleReminisce}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        Reminisce
      </button>
      {randomMemory && (
        <div className="mt-4 bg-white p-4 rounded shadow">
          <h3 className="font-bold text-lg">{randomMemory.title}</h3>
          <p className="text-sm mb-2">{randomMemory.note}</p>
          {randomMemory.media?.[0] && <img src={randomMemory.media[0]} alt="" className="rounded" />}
          <div className="text-xs text-gray-500 mt-2">{new Date(randomMemory.createdAt).toLocaleDateString()}</div>
        </div>
      )}
    </div>
  );
}
