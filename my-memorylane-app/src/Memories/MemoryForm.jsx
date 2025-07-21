import { useState } from 'react';
import { getDatabase, ref, push } from 'firebase/database';
import { uploadToCloudinary } from '../../services/cloudinary';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../services/firebase';

export default function MemoryForm() {
  const [user] = useAuthState(auth);
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [tags, setTags] = useState('');
  const [location, setLocation] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert('User not authenticated');
    setLoading(true);
    try {
      const urls = await uploadToCloudinary(files);
      const db = getDatabase();
      const memoryRef = ref(db, `users/${user.uid}/memories`);
      await push(memoryRef, {
        title,
        note,
        location,
        tags: tags.split(',').map(tag => tag.trim()),
        media: urls,
        createdAt: Date.now(),
      });
      setTitle('');
      setNote('');
      setLocation('');
      setTags('');
      setFiles([]);
      alert('Memory saved!');
    } catch (err) {
      console.error(err);
      alert('Failed to save memory');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-xl font-bold mb-4">Create Memory</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow-md max-w-xl mx-auto">
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Note"
          className="w-full border p-2 rounded"
          required
        />
        <input
          value={location}
          onChange={e => setLocation(e.target.value)}
          placeholder="Location"
          className="w-full border p-2 rounded"
        />
        <input
          value={tags}
          onChange={e => setTags(e.target.value)}
          placeholder="Tags (comma separated)"
          className="w-full border p-2 rounded"
        />
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Memory'}
        </button>
      </form>
    </div>
  );
}
