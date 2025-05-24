import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import firebase from 'firebase/compat/app';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAz5lJXza_iHFS3XbVW2oiz7qHqSqXU_6w',
  authDomain: 'watch-ecommerce-27132.firebaseapp.com',
  projectId: 'watch-ecommerce-27132',
  storageBucket: 'watch-ecommerce-27132.firebasestorage.app',
  messagingSenderId: '490643666604',
  appId: '1:490643666604:web:76135861c072d624ef5109',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase services
const auth = getAuth(app);
const db = getFirestore(app); // Firestore Database
const rtdb = getDatabase(app); // Realtime Database
const storage = getStorage(app);

export { app, auth, db, rtdb, storage, doc, setDoc, getDoc };
