import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDGkdMo9pLw7mvMLDegPqeyQhExhv_E4iM",
  authDomain: "lvpsa-81fa8.firebaseapp.com",
  projectId: "lvpsa-81fa8",
  storageBucket: "lvpsa-81fa8.firebasestorage.app",
  messagingSenderId: "562341714816",
  appId: "1:562341714816:web:4a6cd6b55a2c1d64e33f65"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
