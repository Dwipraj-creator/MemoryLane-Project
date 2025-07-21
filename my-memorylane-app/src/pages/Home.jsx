import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Welcome to MemoryLane!</h1>
      <button className="btn-primary" onClick={() => navigate('/create-memory')}>
        + Create New Memory
      </button>
    </div>
  );
}
