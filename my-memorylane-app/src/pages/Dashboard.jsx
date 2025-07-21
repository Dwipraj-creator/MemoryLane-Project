import MemoryList from '../Memories/MemoryList';
import ReminisceButton from '../Memories/ReminisceButton';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Your Memory Timeline</h1>
        <ReminisceButton />
        <MemoryList />
      </div>
    </div>
  );
}

