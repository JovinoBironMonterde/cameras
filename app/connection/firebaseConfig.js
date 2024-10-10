// connection/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCQI4-NYYte2H6uVY0hrdKjSv9SwYJs3X8",
  authDomain: "uploadimagedb-5cec6.firebaseapp.com",
  projectId: "uploadimagedb-5cec6",
  storageBucket: "uploadimagedb-5cec6.appspot.com",
  messagingSenderId: "606842291901",
  appId: "1:606842291901:web:2179b1b1e67509b3acd9d4"
};

const app = initializeApp(firebaseConfig);
export const imageDb = getStorage(app); // Exported as imageDb to match your import
