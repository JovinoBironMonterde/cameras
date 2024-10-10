// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Import Firestore
import { getStorage } from "firebase/storage"; // Import Storage

const firebaseConfig = {
  apiKey: "AIzaSyALqxdO0Ld-DV9B5-TVixquwpmD2X1wJ7M",
  authDomain: "cameras-69f2f.firebaseapp.com",
  projectId: "cameras-69f2f",
  storageBucket: "cameras-69f2f.appspot.com",
  messagingSenderId: "1043392367197",
  appId: "1:1043392367197:web:bb2ba4317c53845eab1bb4",
  measurementId: "G-RGYEQSBNKL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Initialize Firestore
const storage = getStorage(app); // Initialize Storage

export { db, storage }; // Export Firestore and Storage instances
