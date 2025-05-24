import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import '../styles/Admin.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // ✅ Define Admin Credentials
  const adminEmail = 'mohamedjamilirfan14@gmail.com'; // Change this to your actual admin email

  // ✅ Handle Admin Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // ✅ Check if the logged-in user is an admin
      if (user.email === adminEmail) {
        localStorage.setItem('isAdmin', 'true'); // Store admin session
        navigate('/admin'); // Redirect to Admin Panel
      } else {
        setError('Access Denied: Not an Admin');
      }
    } catch (error) {
      setError('Invalid Credentials');
    }
  };

  return (
    <div className="container my-5">
      <h2 className="text-center text-uppercase margin21">Admin Login</h2>
      <div className="admin-limited-container">
      <form onSubmit={handleLogin} className="limited-form">
        <input
          type="email"
          placeholder="Enter Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-danger">{error}</p>}
        <button className="btn btn-primary mt-3">Login</button>
      </form>
      </div>
    </div>
  );
};

export default AdminLogin;
