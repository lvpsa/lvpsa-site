import {
  collection,
  doc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  serverTimestamp,
  writeBatch,
  increment,
} from "firebase/firestore";
import { db } from "../firebase";

export const produitsInitiaux = [
  {
    id: "tshirt-homme",
    nom: "T-shirt Homme",
    type: "T-shirt",
    categorie: "Homme",
    prix: 20,
    actif: true,
    ordre: 1,
    description: "T-shirt léger et confortable aux couleurs de la LVPSA.",
    grandeurs: ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"],
    couleurs: [
      {
        id: "sable",
        nom: "Sable",
        imageDevant: "/tshirt-homme-sable-devant.png",
        imageDos: "/tshirt-homme-sable-dos.png",
      },
      {
        id: "or",
        nom: "Or",
        imageDevant: "/tshirt-homme-or-devant.png",
        imageDos: "/tshirt-homme-or-dos.png",
      },
    ],
  },
  {
    id: "tshirt-femme",
    nom: "T-shirt Femme",
    type: "T-shirt",
    categorie: "Femme",
    prix: 20,
    actif: true,
    ordre: 2,
    description: "T-shirt coupe femme aux couleurs officielles de la LVPSA.",
    grandeurs: ["XS", "S", "M", "L", "XL", "XXL"],
    couleurs: [
      {
        id: "blanc",
        nom: "Blanc",
        imageDevant: "/tshirt-femme-blanc-devant.png",
        imageDos: "/tshirt-femme-blanc-dos.png",
      },
      {
        id: "rose",
        nom: "Rose",
        imageDevant: "/tshirt-femme-rose-devant.png",
        imageDos: "/tshirt-femme-rose-dos.png",
      },
    ],
  },
  {
    id: "camisole-homme",
    nom: "Camisole Homme",
    type: "Camisole",
    categorie: "Homme",
    prix: 20,
    actif: true,
    ordre: 3,
    description: "Camisole confortable, parfaite pour le terrain et l’été.",
    grandeurs: ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"],
    couleurs: [
      {
        id: "blanc",
        nom: "Blanc",
        imageDevant: "/camisole-homme-blanc-devant.png",
        imageDos: "/camisole-homme-blanc-dos.png",
      },
      {
        id: "marine",
        nom: "Marine",
        imageDevant: "/camisole-homme-marin-devant.png",
        imageDos: "/camisole-homme-marin-dos.png",
      },
    ],
  },
  {
    id: "camisole-femme",
    nom: "Camisole Femme",
    type: "Camisole",
    categorie: "Femme",
    prix: 20,
    actif: true,
    ordre: 4,
    description: "Camisole racerback légère aux couleurs de la LVPSA.",
    grandeurs: ["XS", "S", "M", "L", "XL", "XXL"],
    couleurs: [
      {
        id: "bleu",
        nom: "Bleu",
        imageDevant: "/camisole-femme-bleue-devant.png",
        imageDos: "/camisole-femme-bleue-dos.png",
      },
      {
        id: "rose",
        nom: "Rose",
        imageDevant: "/camisole-femme-rose-devant.png",
        imageDos: "/camisole-femme-rose-dos.png",
      },
    ],
  },
  {
    id: "hoodie-unisex",
    nom: "Hoodie Unisex",
    type: "Hoodie",
    categorie: "Unisex",
    prix: 40,
    actif: true,
    ordre: 5,
    description: "Hoodie officiel LVPSA, confortable et parfait pour les soirées fraîches.",
    grandeurs: ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"],
    couleurs: [
      {
        id: "marine",
        nom: "Marine",
        imageDevant: "/hoodie-unisex-marin-devant.png",
        imageDos: "/hoodie-unisex-marin-dos.png",
      },
      {
        id: "or",
        nom: "Or",
        imageDevant: "/hoodie-unisex-or-devant.png",
        imageDos: "/hoodie-unisex-or-dos.png",
      },
    ],
  },
];

export const inventaireInitial = {
  "tshirt-homme": {
    sable: { M: 3, L: 3, XL: 3, XXL: 1 },
    or: { M: 3, L: 3, XL: 3, XXL: 1 },
  },
  "tshirt-femme": {
    blanc: { S: 3, M: 4, L: 3 },
    rose: { S: 3, M: 4, L: 3 },
  },
  "camisole-homme": {
    blanc: { M: 3, L: 3, XL: 3, XXL: 1 },
    marine: { M: 3, L: 3, XL: 3, XXL: 1 },
  },
  "camisole-femme": {
    bleu: { S: 3, M: 4, L: 3 },
    rose: { S: 3, M: 4, L: 3 },
  },
  "hoodie-unisex": {
    marine: { S: 4, M: 14, L: 14, XL: 6, XXL: 1 },
    or: { S: 4, M: 14, L: 14, XL: 6, XXL: 1 },
  },
};

export async function initialiserBoutiqueFirebase() {
  const batch = writeBatch(db);

  produitsInitiaux.forEach((produit) => {
    const ref = doc(db, "produitsBoutique", produit.id);

    batch.set(ref, {
      ...produit,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });

  Object.entries(inventaireInitial).forEach(([produitId, couleurs]) => {
    Object.entries(couleurs).forEach(([couleurId, tailles]) => {
      Object.entries(tailles).forEach(([taille, quantite]) => {
        const ref = doc(
          db,
          "inventaireBoutiqueV2",
          `${produitId}_${couleurId}_${taille}`
        );

        batch.set(ref, {
          produitId,
          couleurId,
          taille,
          quantite,
          updatedAt: serverTimestamp(),
        });
      });
    });
  });

  await batch.commit();
}

export async function chargerProduitsBoutique() {
  const snap = await getDocs(collection(db, "produitsBoutique"));

  return snap.docs
    .map((docItem) => ({
      id: docItem.id,
      ...docItem.data(),
    }))
    .filter((produit) => produit.actif !== false)
    .sort((a, b) => Number(a.ordre || 0) - Number(b.ordre || 0));
}

export async function chargerInventaireBoutiqueV2() {
  const snap = await getDocs(collection(db, "inventaireBoutiqueV2"));

  const inventaire = {};

  snap.docs.forEach((docItem) => {
    inventaire[docItem.id] = docItem.data();
  });

  return inventaire;
}

export async function creerCommandeBoutique(commande) {
  return addDoc(collection(db, "commandesBoutique"), {
    ...commande,
    statut: "en_attente",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function deduireInventaireBoutique(articles) {
  const batch = writeBatch(db);

  articles.forEach((article) => {
    const ref = doc(
      db,
      "inventaireBoutiqueV2",
      `${article.produitId}_${article.couleurId}_${article.taille}`
    );

    batch.set(
      ref,
      {
        produitId: article.produitId,
        couleurId: article.couleurId,
        taille: article.taille,
        quantite: increment(-Number(article.quantite)),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  });

  await batch.commit();
}

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

export async function ajusterInventaireBoutiqueV2(
  produitId,
  couleurId,
  taille,
  variation
) {
  const ref = doc(
    db,
    "inventaireBoutiqueV2",
    `${produitId}_${couleurId}_${taille}`
  );

  await setDoc(
    ref,
    {
      produitId,
      couleurId,
      taille,
      quantite: increment(Number(variation)),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function annulerCommandeBoutique(commandeId, articles = []) {
  const batch = writeBatch(db);

  articles.forEach((article) => {
    const ref = doc(
      db,
      "inventaireBoutiqueV2",
      `${article.produitId}_${article.couleurId}_${article.taille}`
    );

    batch.set(
      ref,
      {
        produitId: article.produitId,
        couleurId: article.couleurId,
        taille: article.taille,
        quantite: increment(Number(article.quantite)),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  });

  const commandeRef = doc(db, "commandesBoutique", commandeId);

  batch.update(commandeRef, {
    statut: "annulee",
    inventaireRemis: true,
    updatedAt: serverTimestamp(),
  });

  await batch.commit();
}
