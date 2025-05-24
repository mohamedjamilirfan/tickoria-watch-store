import React, { useState, useEffect } from 'react';
import { auth, db } from '../data/firebase';
import { getDoc, setDoc, doc, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import axios from 'axios';
import isdCodes from '../data/isdCodes';
import {
  saveUserToLocal,
  getUserFromLocal,
  clearUserFromLocal,
} from '../utils/localStorageHelper';
import '../styles/Auth.css';
import profilepic12 from '../assets/profile-user.png';
import OrderHistory from './OrderHistory';

const DEFAULT_PROFILE_PIC = profilepic12;

const Profile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    isdCode: '+91',
    address: '',
    photoURL: '',
  });

  console.log(formData);

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('India'); // Default country

  useEffect(() => {
    // Load from local storage first
    const localUser = getUserFromLocal();
    if (localUser) {
      setUser(localUser);
      setFormData(localUser);
      setImagePreview(localUser.photoURL || '');
      updateSelectedCountry(localUser.isdCode);
    }

    // Fetch from Firestore with a delay to improve UX
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUser(userData);
          setFormData(userData);
          setImagePreview(userData.photoURL || DEFAULT_PROFILE_PIC);
          updateSelectedCountry(userData.isdCode);
          saveUserToLocal(userData); // Save to local storage
        } else {
          const newUser = {
            name: auth.currentUser.displayName || '',
            email: auth.currentUser.email,
            mobile: '',
            isdCode: '+91',
            address: '',
            photoURL: auth.currentUser.photoURL || DEFAULT_PROFILE_PIC,
          };
          await setDoc(userRef, newUser);
          setUser(newUser);
          setFormData(newUser);
          setImagePreview(newUser.photoURL || '');
          updateSelectedCountry('+91');
        }
      }
    };

    fetchUserData();
  }, []);

  const updateSelectedCountry = (code) => {
    const country = isdCodes.find((c) => c.code === code);
    setSelectedCountry(country ? country.name : 'Unknown');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'isdCode') {
      updateSelectedCountry(value);
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setLoading(true);
      const imageUrl = await uploadImage(file);
      if (imageUrl) {
        setImagePreview(imageUrl);
        setFormData((prev) => ({ ...prev, photoURL: imageUrl }));
      }
      setLoading(false);
    }
  };

  const uploadImage = async (file) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'profile_pics');

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dkl4itzbc/image/upload`,
        formData
      );
      return response.data.secure_url;
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Image upload failed. Try again.');
      return null;
    }
  };

  const handleSave = async () => {
    if (!auth.currentUser) return;

    setLoading(true);
    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, formData);
      setUser(formData);
      saveUserToLocal(formData); // Save updated data to local storage
      setEditMode(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile. Please try again.');
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    clearUserFromLocal(); // Clear local storage on logout
    window.location.href = '/signin';
  };

  return (
    <div id="pageContainer" style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
      <div
        className="container p-4"
        style={{ maxWidth: '400px', background: '#1e1e1e', color: '#f39c12', marginTop: editMode ? '85px' : '0', }}>
        <div className="text-center mb-4">
          <label htmlFor="profilePicInput" className="d-block">
            <img
              src={imagePreview}
              alt="Profile"
              className="image1"
              style={{
                width: '120px',
                height: '120px',
                cursor: 'pointer',
                borderRadius: '50%',
              }}
            />
          </label>
          {editMode && (
            <>
              <input
                type="file"
                id="profilePicInput"
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleFileChange}
              />
              <button
                className="btn btn-sm btn-outline-warning mt-2"
                onClick={() =>
                  document.getElementById('profilePicInput').click()
                }>
                Choose Profile Picture
              </button>
            </>
          )}
        </div>

        <h4 className="text-center mb-3">{formData.name || 'User Name'}</h4>
        <p className="text-center">{formData.email}</p>

        <div className="mb-3">
          <label className="fw-bold">Mobile:</label>
          <p className="mb-1">
            {formData.isdCode} {formData.mobile || 'Not provided'}
          </p>
        </div>

        <div className="mb-3">
          <label className="fw-bold">Address:</label>
          <p>{formData.address || 'Not provided'}</p>
        </div>

        {editMode && (
          <>
            <input
              type="text"
              className="form-control mb-2"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter name"
            />

            <div className="mobileisd mb-3">
              <select
                id="selectisd"
                name="isdCode"
                value={formData.isdCode}
                onChange={handleChange}>
                {isdCodes.map((code) => (
                  <option key={code.code} value={code.code}>
                    ({code.code}) {code.country}
                  </option>
                ))}
              </select>
              <input
                type="text"
                className="form-control"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Enter mobile no"
              />
            </div>

            <input
              type="text"
              className="form-control mb-2"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter address"
            />

            <button
              className="btn btn-success w-100 mb-2"
              onClick={handleSave}
              disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              className="btn btn-secondary w-100"
              onClick={() => setEditMode(false)}>
              Cancel
            </button>
          </>
        )}

        <div id="buttonContainer">
          {!editMode && (
            <button
              className="btn btn-primary w-100"
              onClick={() => setEditMode(true)}>
              Edit Profile
            </button>
          )}

          <button className="btn btn-danger w-100" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
      <OrderHistory />
    </div>
  );
};

export default Profile;
