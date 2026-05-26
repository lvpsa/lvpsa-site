import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDgWX7FNdNMwd4k6W0Z-2eD_VzzCkr-t50",
  authDomain: "lvpsa-site.firebaseapp.com",
  projectId: "lvpsa-site",
  storageBucket: "lvpsa-site.firebasestorage.app",
  messagingSenderId: "314446097658",
  appId: "1:314446097658:web:724b87e7424c52336aad43"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
