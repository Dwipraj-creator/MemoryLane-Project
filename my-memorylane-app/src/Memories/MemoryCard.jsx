import { ref, update, remove } from 'firebase/database';
import { db, auth } from '../../services/firebase';
import { useState } from 'react';
import { uploadToCloudinary } from '../../services/cloudinary';

export default function MemoryCard({ memory }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedNote, setEditedNote] = useState(memory.note);
  const [editedTitle, setEditedTitle] = useState(memory.title);
  const [editedTag, setEditedTag] = useState(memory.tag || '');
  const [editedDate, setEditedDate] = useState(memory.date || '');
  const [newFiles, setNewFiles] = useState([]);

  const handleDelete = async () => {
    const user = auth.currentUser;
    if (!user) return;
    if (confirm("Are you sure you want to delete this memory?")) {
      await remove(ref(db, `users/${user.uid}/memories/${memory.id}`));
    }
  };

  const handleEdit = async () => {
    const user = auth.currentUser;
    if (!user) return;

    let newMedia = memory.media || [];
    if (newFiles.length > 0) {
      const uploaded = await uploadToCloudinary(newFiles);
      if (uploaded) {
        newMedia = uploaded;
      }
    }

    await update(ref(db, `users/${user.uid}/memories/${memory.id}`), {
      title: editedTitle,
      note: editedNote,
      tag: editedTag,
      date: editedDate,
      media: newMedia
    });

    setIsEditing(false);
    setNewFiles([]);
  };

  return (
    <div className="bg-white shadow-md p-4 rounded-md">
      {isEditing ? (
        <div className="space-y-2">
          <input
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="input"
            placeholder="Title"
          />
          <textarea
            value={editedNote}
            onChange={(e) => setEditedNote(e.target.value)}
            className="textarea"
            placeholder="Edit note..."
          />
          <input
            value={editedTag}
            onChange={(e) => setEditedTag(e.target.value)}
            className="input"
            placeholder="Tag"
          />
          <input
            type="date"
            value={editedDate}
            onChange={(e) => setEditedDate(e.target.value)}
            className="input"
          />
          <input
            type="file"
            multiple
            onChange={(e) => setNewFiles(Array.from(e.target.files))}
            className="file-input"
          />
          <div className="flex space-x-2 mt-2">
            <button onClick={handleEdit} className="btn-primary">Save</button>
            <button onClick={() => setIsEditing(false)} className="btn-secondary">Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between">
            <div>
              <h3 className="text-xl font-semibold">{memory.title}</h3>
              <p className="text-sm text-gray-600">{new Date(memory.date).toDateString()}</p>
            </div>
            <div className="space-x-2">
              <button onClick={() => setIsEditing(true)} className="text-blue-600 text-sm">Edit</button>
              <button onClick={handleDelete} className="text-red-600 text-sm">Delete</button>
            </div>
          </div>
          <p className="mt-2">{memory.note}</p>
          {memory.media?.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mt-4">
              {memory.media.map((url, idx) => (
                <img key={idx} src={url} alt="Memory" className="rounded-md object-cover w-full max-h-60" />
              ))}
            </div>
          )}
          {memory.tag && (
            <span className="inline-block bg-blue-100 text-blue-600 text-xs px-2 py-1 mt-3 rounded-full">
              #{memory.tag}
            </span>
          )}
        </>
      )}
    </div>
  );
}
