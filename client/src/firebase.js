// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-21d91.firebaseapp.com",
  projectId: "mern-estate-21d91",
  storageBucket: "mern-estate-21d91.appspot.com",
  messagingSenderId: "59643679136",
  appId: "1:59643679136:web:e89a7f1a186bcaea7954c5"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);