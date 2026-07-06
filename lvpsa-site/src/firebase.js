import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDgWX7FNdNMwd4k6W0Z-2eD_VzzCkr-t50",
  authDomain: "lvpsa-site.firebaseapp.com",
  projectId: "lvpsa-site",
  storageBucket: "lvpsa-site.firebasestorage.app",
  messagingSenderId: "314446097658",
  appId: "1:314446097658:web:724b87e7424c52336aad43",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

/* =====================================================
   BOUTIQUE
===================================================== */

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

/* =====================================================
   REMPLAÇANTS - NORMALISATION
===================================================== */

function normaliserCategoriesRemplacant(data) {
  const source = data.categories || data.categorie || [];

  if (!Array.isArray(source)) return [];

  return source
    .map((cat) => {
      const valeur = String(cat).toLowerCase().trim();

      if (
        valeur === "récréatif" ||
        valeur === "recreatif" ||
        valeur === "récréative" ||
        valeur === "recreative"
      ) {
        return "recreatif";
      }

      if (
        valeur === "compétitif" ||
        valeur === "competitif" ||
        valeur === "compétitive" ||
        valeur === "competitive"
      ) {
        return "competitif";
      }

      return valeur;
    })
    .filter(Boolean);
}

export function normaliserRemplacant(id, data) {
  const emailFinal = data.email || data.courriel || "";

  return {
    id,
    ...data,

    nom: data.nom || "",
    email: emailFinal,
    courriel: data.courriel || emailFinal,
    telephone: data.telephone || "",
    note: data.note || "",
    categories: normaliserCategoriesRemplacant(data),

    disponible:
      typeof data.disponible === "boolean"
        ? data.disponible
        : data.statut === "actif",

    statut: data.statut || (data.disponible === false ? "inactif" : "actif"),
  };
}

export async function chargerRemplacements() {
  const snap = await getDocs(collection(db, "remplacements"));

  return snap.docs.map((docItem) =>
    normaliserRemplacant(docItem.id, docItem.data())
  );
}

export async function uniformiserRemplacementsSansSupprimer() {
  const snap = await getDocs(collection(db, "remplacements"));
  const batch = writeBatch(db);

  let compteur = 0;

  snap.forEach((docItem) => {
    const data = docItem.data();
    const ref = doc(db, "remplacements", docItem.id);

    const categoriesNormalisees = normaliserCategoriesRemplacant(data);
    const emailFinal = data.email || data.courriel || "";

    const updates = {};

    if (!data.categories && categoriesNormalisees.length > 0) {
      updates.categories = categoriesNormalisees;
    }

    if (!data.email && emailFinal) {
      updates.email = emailFinal;
    }

    if (!data.courriel && emailFinal) {
      updates.courriel = emailFinal;
    }

    if (typeof data.disponible !== "boolean") {
      updates.disponible = data.statut === "actif" || !data.statut;
    }

    if (!data.statut) {
      updates.statut = data.disponible === false ? "inactif" : "actif";
    }

    if (!data.updatedAt) {
      updates.updatedAt = serverTimestamp();
    }

    if (Object.keys(updates).length > 0) {
      batch.update(ref, updates);
      compteur++;
    }
  });

  if (compteur > 0) {
    await batch.commit();
  }

  return compteur;
}
