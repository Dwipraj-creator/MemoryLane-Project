import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './services/firebase';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import CreateMemory from './pages/CreateMemory';
import Albums from './pages/Albums';
import Search from './pages/Search';
import MemoryTimeline from './Memories/MemoryList';
import Navbar from './Layout/Navbar';

function PrivateRoute({ children }) {
  const [user, loading] = useAuthState(auth);
  if (loading) return <div className="p-4">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
   
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-memory"
          element={
            <PrivateRoute>
              <CreateMemory />
            </PrivateRoute>
          }
        />
        <Route
          path="/timeline"
          element={
            <PrivateRoute>
              <MemoryTimeline />
            </PrivateRoute>
          }
        />
        <Route
          path="/albums"
          element={
            <PrivateRoute>
              <Albums />
            </PrivateRoute>
          }
        />
        <Route
          path="/search"
          element={
            <PrivateRoute>
              <Search />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}
