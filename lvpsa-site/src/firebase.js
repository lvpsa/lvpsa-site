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
export async function chargerCommandesBoutique() {
  const snap = await getDocs(collection(db, "commandesBoutique"));

  return snap.docs
    .map((docItem) => ({
      id: docItem.id,
      ...docItem.data(),
    }))
    .sort((a, b) => {
      const dateA = a.createdAt?.seconds || 0;
      const dateB = b.createdAt?.seconds || 0;
      return dateB - dateA;
    });
}

export async function modifierStatutCommandeBoutique(commandeId, statut) {
  const ref = doc(db, "commandesBoutique", commandeId);

  await updateDoc(ref, {
    statut,
    updatedAt: serverTimestamp(),
  });
}
