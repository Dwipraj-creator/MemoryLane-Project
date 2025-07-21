import { useEffect, useState, useRef, useCallback } from 'react';
import { getDatabase, ref, onValue, query, orderByChild } from 'firebase/database';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../services/firebase';

const BATCH_SIZE = 6;

export default function MemoryList() {
  const [user] = useAuthState(auth);
  const [allMemories, setAllMemories] = useState([]);
  const [displayedMemories, setDisplayedMemories] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef(null);

  useEffect(() => {
    if (!user) return;

    const db = getDatabase();
    const memoryRef = query(ref(db, `users/${user.uid}/memories`), orderByChild('createdAt'));

    onValue(memoryRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const memoryArray = Object.entries(data).map(([id, value]) => ({
          id,
          ...value
        }));

        const sorted = memoryArray.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setAllMemories(sorted);
        setDisplayedMemories(sorted.slice(0, BATCH_SIZE));
        setHasMore(sorted.length > BATCH_SIZE);
      } else {
        setAllMemories([]);
        setDisplayedMemories([]);
        setHasMore(false);
      }
    });
  }, [user]);

  const loadMore = useCallback(() => {
    setDisplayedMemories(prev => {
      const nextBatch = allMemories.slice(prev.length, prev.length + BATCH_SIZE);
      const updated = [...prev, ...nextBatch];
      setHasMore(updated.length < allMemories.length);
      return updated;
    });
  }, [allMemories]);

  useEffect(() => {
    if (!loader.current || !hasMore) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 1 }
    );

    observer.observe(loader.current);
    return () => observer.disconnect();
  }, [loadMore, hasMore]);


  const isVideo = (url) => {
    return url?.match(/\.(mp4|webm|ogg)$/i);
  };

  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {displayedMemories.map((memory) => (
        <div key={memory.id} className="bg-white rounded shadow p-4">
          <h2 className="font-bold text-lg mb-2">{memory.title}</h2>
          <p className="text-sm mb-2">{memory.description || memory.note}</p>

          {memory.imageUrl ? (
            isVideo(memory.imageUrl) ? (
              <video
                src={memory.imageUrl}
                controls
                className="rounded w-full max-h-60 object-cover mb-2"
              />
            ) : (
              <img
                src={memory.imageUrl}
                alt="Memory"
                className="rounded w-full max-h-60 object-cover mb-2"
              />
            )
          ) : (
            <p className="text-gray-400 italic text-sm">No media available</p>
          )}

          <div className="text-xs text-gray-500">
            {memory.createdAt && new Date(memory.createdAt).toLocaleDateString()}
          </div>
        </div>
      ))}

      {hasMore && (
        <div ref={loader} className="col-span-full text-center py-4 text-gray-400">
          Loading more memories...
        </div>
      )}
    </div>
  );
}
