import MemoryAlbum from '../Memories/MemoryAlbum';
import Navbar from '../Layout/Navbar';

export default function Albums() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto p-4">
        <MemoryAlbum />
      </div>
    </div>
  );
}