import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// PASTE YOUR FIREBASE CONFIG HERE
const firebaseConfig = {
   apiKey: "AIzaSyCSFIWF27xYuq3kxQBOcNT9sXHk-cQzVcc",
  authDomain: "my-betting-tracker.firebaseapp.com",
  projectId: "my-betting-tracker",
  storageBucket: "my-betting-tracker.firebasestorage.app",
  messagingSenderId: "660876070724",
  appId: "1:660876070724:web:90a4ca0a0dfab1542fd111"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);