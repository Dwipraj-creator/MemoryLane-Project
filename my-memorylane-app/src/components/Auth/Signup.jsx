import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleSignup} className="space-y-4 p-4">
      <input
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
        className="input w-full border p-2 rounded"
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
        className="input w-full border p-2 rounded"
      />
      <button className="btn-primary bg-green-500 text-white px-4 py-2 rounded">Signup</button>
    </form>
  );
}
