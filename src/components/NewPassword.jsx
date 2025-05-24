import React, { useState, useEffect } from 'react';
import {
  getAuth,
  verifyPasswordResetCode,
  confirmPasswordReset,
} from 'firebase/auth';
import { useNavigate, useLocation } from 'react-router-dom';

const NewPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const resetCode = new URLSearchParams(location.search).get('oobCode');

  useEffect(() => {
    if (!resetCode) {
      setError('Invalid reset code.');
      return;
    }

    const auth = getAuth();
    verifyPasswordResetCode(auth, resetCode)
      .then(() => setError(''))
      .catch(() => setError('Invalid reset code.'));
  }, [resetCode]);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    const auth = getAuth();

    try {
      await confirmPasswordReset(auth, resetCode, password);
      setSuccess(true);
      setError('');
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError('Failed to reset password.');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">New Password</h2>
      <form onSubmit={handleResetPassword} className="mt-4">
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            New Password
          </label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            className="form-control"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && (
          <div className="alert alert-success">
            Your password has been reset!
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
};

export default NewPassword;
