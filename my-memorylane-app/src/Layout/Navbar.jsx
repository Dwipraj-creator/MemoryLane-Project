import { Link, useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../services/firebase';

export default function Navbar() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.signOut();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <Link to="/dashboard" className="text-xl font-bold text-blue-600">MemoryLane</Link>
      <div className="space-x-4">
        <Link to="/create-memory" className="text-gray-700 hover:text-blue-600">Create</Link>
        <Link to="/albums" className="text-gray-700 hover:text-blue-600">Albums</Link>
        <Link to="/search" className="text-gray-700 hover:text-blue-600">Search</Link>
        <button
          onClick={handleLogout}
          className="text-red-500 hover:underline ml-4"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
