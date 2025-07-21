import { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../services/firebase';

export default function MemoryAlbum() {
  const [user] = useAuthState(auth);
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    if (!user) return;
    const db = getDatabase();
    const memoryRef = ref(db, `users/${user.uid}/memories`);
    onValue(memoryRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const grouped = {};
        Object.values(data).forEach(memory => {
          const albumName = memory.tags?.[0] || 'Uncategorized';
          if (!grouped[albumName]) grouped[albumName] = [];
          grouped[albumName].push(memory);
        });
        setAlbums(Object.entries(grouped));
      }
    });
  }, [user]);


  const isVideo = (url) => url?.match(/\.(mp4|webm|ogg)$/i);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-xl font-bold mb-4">Memory Albums</h1>
      {albums.map(([album, memories]) => (
        <div key={album} className="mb-6">
          <h2 className="text-lg font-semibold mb-2">{album}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {memories.map((mem, index) => (
              <div key={index} className="bg-white rounded shadow p-3">
                <h3 className="font-bold mb-1">{mem.title}</h3>
                <p className="text-sm mb-2 text-gray-600">{mem.description || 'No description'}</p>

                {mem.imageUrl ? (
                  isVideo(mem.imageUrl) ? (
                    <video
                      src={mem.imageUrl}
                      controls
                      className="rounded w-full max-h-52 object-cover"
                    />
                  ) : (
                    <img
                      src={mem.imageUrl}
                      alt={mem.title}
                      className="rounded w-full max-h-52 object-cover"
                    />
                  )
                ) : (
                  <p className="text-gray-400 italic text-sm">No media</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
