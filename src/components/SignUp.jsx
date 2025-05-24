import React, { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth, db } from '../data/firebase';
import { setDoc, doc } from 'firebase/firestore';
import { FcGoogle } from 'react-icons/fc';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Auth.css';
import isdCodes from '../data/isdCodes';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [isdCode, setIsdCode] = useState('+91');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const emailRegex = /\S+@\S+\.\S+/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!name.trim()) return 'Please enter your name.';
    if (!emailRegex.test(email)) return 'Please enter a valid email address.';
    if (password.length < 6) return 'Password should be at least 6 characters.';
    if (!phoneRegex.test(mobile))
      return 'Please enter a valid 10-digit mobile number.';

    return '';
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await updateProfile(user, { displayName: name });

      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        isdCode,
        mobile,
        address: '',
        photoURL: user.photoURL || '',
      });

      navigate('/profile');
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await setDoc(
        doc(db, 'users', user.uid),
        {
          name: user.displayName || '',
          email: user.email,
          isdCode: '',
          mobile: '',
          address: '',
          photoURL: user.photoURL || '',
        },
        { merge: true }
      );

      navigate('/profile');
    } catch (err) {
      setError('Google sign-in failed. Please try again.');
    }
  };

  return (
    <div id="pageContainer">
      <div className="container">
        <h2>Sign Up</h2>
        {error && <p className="text-danger">{error}</p>}
        <form onSubmit={handleSignUp}>
          <input
            type="text"
            className="form-control"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="password-container" style={{position: 'relative'}}>
            <input type={showPassword ? "text" : "password"} className="form-control" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <span onClick={() => setShowPassword(!showPassword)} className="password-toggle">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <div className="d-flex gap-2 align-items-center mt-1">
            <select
              id="selectisd"
              value={isdCode}
              onChange={(e) => setIsdCode(e.target.value)}>
              {isdCodes.map(({ country, code }) => (
                <option
                  key={code}
                  value={code}>{`${country} (${code})`}</option>
              ))}
            </select>
            <input
              type="tel"
              className="form-control"
              placeholder="Enter mobile no"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}>
            {loading ? (
              <span className="spinner-border text-light" role="status">
                <span className="visually-hidden">Loading...</span>
              </span>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        <button
          className="btn btn-danger w-100 mt-3"
          onClick={handleGoogleSignUp}>
          <FcGoogle size={24} className="me-2" /> Sign Up with Google
        </button>

        <p className="mt-3 text-center">
          Already have an account? <Link to="/signin">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
