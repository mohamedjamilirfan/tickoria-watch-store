import React, { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { div } from 'framer-motion/client';
import '../styles/Auth.css'; // Adjust the path based on your structure

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    const auth = getAuth();

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
      setError('');
      setEmail(''); // Clear email input after successful request
    } catch (err) {
      setError('An error occurred. Please check your email and try again.');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="pageContainer">
      <div className="container mt-5">
        <h2 className="text-center">Reset Password</h2>
        <form onSubmit={handleResetPassword} className="mt-4">
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Enter Your Login Email ID
            </label>
            <input
              type="email"
              id="email"
              placeholder='Enter Your Email ID'
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && (
            <div className="alert alert-success">
              Check your inbox for a password reset link.
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}>
            {loading ? (
              <div className="spinner-border text-light" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              'Send Reset Link'
            )}
          </button>
          
          <Link
            to="/signin"
            id='backtosignin'
            >
            Back to Sign In
          </Link>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
