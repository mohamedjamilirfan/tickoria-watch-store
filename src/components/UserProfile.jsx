import React, { useState, useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    profilePic: '',
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (auth.currentUser) {
      loadUserProfile(auth.currentUser.uid);
    }
  }, [auth.currentUser]);

  // Load user data from Firestore
  const loadUserProfile = async (userId) => {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      setUserData(userSnap.data());
    } else {
      console.log('User profile not found.');
    }
  };

  // Handle file upload
  const handleImageUpload = async (file) => {
    if (!file) return;
    const storageRef = ref(storage, `profilePics/${auth.currentUser.uid}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  // Handle form submission (Save Profile)
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = userData.profilePic;
      if (imageFile) {
        imageUrl = await handleImageUpload(imageFile);
      }

      const userRef = doc(db, 'users', auth.currentUser.uid);
      await setDoc(
        userRef,
        { ...userData, profilePic: imageUrl },
        { merge: true }
      );

      setEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }

    setLoading(false);
  };

  // Handle logout
  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <div className="container mt-4">
      <div className="card p-4 shadow">
        <div className="text-center">
          <label htmlFor="profilePicInput">
            <img
              src={userData.profilePic || '/default-profile.png'}
              alt="Profile"
              className="rounded-circle"
              width="120"
              height="120"
              style={{ cursor: 'pointer' }}
            />
          </label>
          {editing && (
            <input
              type="file"
              id="profilePicInput"
              className="d-none"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
          )}
        </div>

        <form onSubmit={handleSave} className="mt-3">
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              value={userData.name}
              onChange={(e) =>
                setUserData({ ...userData, name: e.target.value })
              }
              disabled={!editing}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={userData.email}
              disabled
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Mobile Number</label>
            <input
              type="text"
              className="form-control"
              value={userData.phone}
              onChange={(e) =>
                setUserData({ ...userData, phone: e.target.value })
              }
              disabled={!editing}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Address</label>
            <input
              type="text"
              className="form-control"
              value={userData.address}
              onChange={(e) =>
                setUserData({ ...userData, address: e.target.value })
              }
              disabled={!editing}
            />
          </div>

          {editing ? (
            <div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={() => setEditing(false)}>
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="btn btn-warning"
              onClick={() => setEditing(true)}>
              Edit
            </button>
          )}
        </form>

        <button className="btn btn-danger mt-3" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
