import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  serverTimestamp,
  writeBatch,
  increment,
  runTransaction,
} from "firebase/firestore";
import { db } from "../firebase";

const COLLECTION_PRODUITS = "produitsBoutique";
const COLLECTION_INVENTAIRE = "inventaireBoutiqueV2";
const COLLECTION_INVENTAIRE_PUBLIC = "inventairePublicBoutique";
const COLLECTION_COMMANDES = "commandesBoutique";
const COLLECTION_HISTORIQUE_COMMANDES = "historiqueCommandesBoutique";

const STATUTS_COMMANDES_VALIDES = [
  "en_attente",
  "en_preparation",
  "prete",
  "remise",
  "annulee",
];

const statutPublicDepuisQuantite = (quantite) => {
  return Number(quantite || 0) > 0 ? "disponible" : "sur_commande";
};

const refInventaire = (produitId, couleurId, taille) => {
  return doc(db, COLLECTION_INVENTAIRE, `${produitId}_${couleurId}_${taille}`);
};

const refInventairePublic = (produitId, couleurId, taille) => {
  return doc(db, COLLECTION_INVENTAIRE_PUBLIC, `${produitId}_${couleurId}_${taille}`);
};

const arrondirPrix = (valeur) => {
  return Math.round(Number(valeur || 0) * 100) / 100;
};

const nettoyerTexte = (valeur) => {
  return String(valeur || "").trim();
};

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
        imageDevant: "/tshirt-homme-sable-devant.jpg",
        imageDos: "/tshirt-homme-sable-dos.png",
      },
      {
        id: "or",
        nom: "Or",
        imageDevant: "/tshirt-homme-or-devant.jpg",
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
        imageDevant: "/tshirt-femme-blanc-devant.jpg",
        imageDos: "/tshirt-femme-blanc-dos.png",
      },
      {
        id: "rose",
        nom: "Rose",
        imageDevant: "/tshirt-femme-rose-devant.jpg",
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
        imageDevant: "/camisole-homme-blanc-devant.jpg",
        imageDos: "/camisole-homme-blanc-dos.png",
      },
      {
        id: "marine",
        nom: "Marine",
        imageDevant: "/camisole-homme-marine-devant.jpg",
        imageDos: "/camisole-homme-marine-dos.png",
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
        imageDevant: "/camisole-femme-bleu-devant.jpg",
        imageDos: "/camisole-femme-bleu-dos.png",
      },
      {
        id: "rose",
        nom: "Rose",
        imageDevant: "/camisole-femme-rose-devant.jpg",
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
        imageDevant: "/hoodie-unisex-marine-devant.jpg",
        imageDos: "/hoodie-unisex-marine-dos.png",
      },
      {
        id: "or",
        nom: "Or",
        imageDevant: "/hoodie-unisex-or-devant.jpg",
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

function ecrireInventairePublicDansBatch(batch, produitId, couleurId, taille, quantite) {
  batch.set(
    refInventairePublic(produitId, couleurId, taille),
    {
      produitId,
      couleurId,
      taille,
      disponible: Number(quantite || 0) > 0,
      statut: statutPublicDepuisQuantite(quantite),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

async function chargerProduitsParId() {
  const snap = await getDocs(collection(db, COLLECTION_PRODUITS));
  const produits = {};

  snap.docs.forEach((docItem) => {
    produits[docItem.id] = {
      id: docItem.id,
      ...docItem.data(),
    };
  });

  return produits;
}

function nettoyerArticleBoutique(article, produitOfficiel) {
  const produitId = nettoyerTexte(article.produitId);
  const couleurId = nettoyerTexte(article.couleurId);
  const taille = nettoyerTexte(article.taille).toUpperCase();
  const quantite = Math.max(1, Number(article.quantite || 1));
  const prix = arrondirPrix(produitOfficiel?.prix ?? article.prix ?? 0);

  return {
    produitId,
    nom: produitOfficiel?.nom || nettoyerTexte(article.nom),
    type: produitOfficiel?.type || nettoyerTexte(article.type),
    categorie: produitOfficiel?.categorie || nettoyerTexte(article.categorie),
    couleurId,
    couleurNom: nettoyerTexte(article.couleurNom),
    taille,
    quantite,
    prix,
    image: nettoyerTexte(article.image),
  };
}

async function nettoyerCommandeBoutique(commande) {
  const produits = await chargerProduitsParId();

  const articles = Array.isArray(commande.articles)
    ? commande.articles.map((article) =>
        nettoyerArticleBoutique(article, produits[nettoyerTexte(article.produitId)])
      )
    : [];

  if (articles.length === 0) {
    throw new Error("La commande ne contient aucun article.");
  }

  const nom = nettoyerTexte(commande.nom);
  const courriel = nettoyerTexte(commande.courriel || commande.email).toLowerCase();
  const telephone = nettoyerTexte(commande.telephone);

  if (!nom || !courriel || !telephone) {
    throw new Error("Le nom, le courriel et le téléphone sont obligatoires.");
  }

  const total = arrondirPrix(
    articles.reduce(
      (somme, article) => somme + Number(article.prix) * Number(article.quantite),
      0
    )
  );

  return {
    userId: nettoyerTexte(commande.userId) || null,
    nom,
    courriel,
    telephone,
    notes: nettoyerTexte(commande.notes),
    articles,
    total,
    source: commande.source || "boutique-v2",
  };
}

export async function initialiserBoutiqueFirebase() {
  const batch = writeBatch(db);

  produitsInitiaux.forEach((produit) => {
    const ref = doc(db, COLLECTION_PRODUITS, produit.id);

    batch.set(ref, {
      ...produit,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });

  Object.entries(inventaireInitial).forEach(([produitId, couleurs]) => {
    Object.entries(couleurs).forEach(([couleurId, tailles]) => {
      Object.entries(tailles).forEach(([taille, quantite]) => {
        const ref = refInventaire(produitId, couleurId, taille);

        batch.set(ref, {
          produitId,
          couleurId,
          taille,
          quantite,
          updatedAt: serverTimestamp(),
        });

        ecrireInventairePublicDansBatch(batch, produitId, couleurId, taille, quantite);
      });
    });
  });

  await batch.commit();
}

export async function synchroniserProduitsBoutiqueSansInventaire() {
  const batch = writeBatch(db);

  produitsInitiaux.forEach((produit) => {
    const ref = doc(db, COLLECTION_PRODUITS, produit.id);

    batch.set(
      ref,
      {
        ...produit,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  });

  await batch.commit();
}

export async function recalculerInventairePublicBoutique() {
  const snap = await getDocs(collection(db, COLLECTION_INVENTAIRE));
  const batch = writeBatch(db);

  snap.docs.forEach((docItem) => {
    const item = docItem.data();

    ecrireInventairePublicDansBatch(
      batch,
      item.produitId,
      item.couleurId,
      item.taille,
      Number(item.quantite || 0)
    );
  });

  await batch.commit();
}

export async function chargerProduitsBoutique() {
  const snap = await getDocs(collection(db, COLLECTION_PRODUITS));

  return snap.docs
    .map((docItem) => ({
      id: docItem.id,
      ...docItem.data(),
    }))
    .filter((produit) => produit.actif !== false)
    .sort((a, b) => Number(a.ordre || 0) - Number(b.ordre || 0));
}

export async function chargerInventaireBoutiqueV2() {
  const snap = await getDocs(collection(db, COLLECTION_INVENTAIRE));
  const inventaire = {};

  snap.docs.forEach((docItem) => {
    inventaire[docItem.id] = docItem.data();
  });

  return inventaire;
}

export async function chargerInventairePublicBoutique() {
  const snap = await getDocs(collection(db, COLLECTION_INVENTAIRE_PUBLIC));
  const inventaire = {};

  snap.docs.forEach((docItem) => {
    inventaire[docItem.id] = docItem.data();
  });

  return inventaire;
}

export async function creerCommandeBoutique(commande) {
  const commandeNettoyee = await nettoyerCommandeBoutique(commande);
  const compteurRef = doc(db, "settings", "compteurCommandesBoutique");

  return runTransaction(db, async (transaction) => {
    const compteurSnap = await transaction.get(compteurRef);

    const dernierNumero = compteurSnap.exists()
      ? Number(compteurSnap.data().dernierNumero || 1000)
      : 1000;

    const nouveauNumero = dernierNumero + 1;
    const numeroCommande = `LVPSA-${nouveauNumero}`;

    transaction.set(
      compteurRef,
      {
        dernierNumero: nouveauNumero,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    const commandeRef = doc(collection(db, COLLECTION_COMMANDES));

    transaction.set(commandeRef, {
      ...commandeNettoyee,
      numeroCommande,
      numeroCommandeSimple: nouveauNumero,
      statut: "en_attente",
      inventaireRemis: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return {
      id: commandeRef.id,
      numeroCommande,
      numeroCommandeSimple: nouveauNumero,
    };
  });
}

export async function chargerCommandesBoutique() {
  const snap = await getDocs(collection(db, COLLECTION_COMMANDES));

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

export async function modifierStatutCommandeBoutique(commandeId, statut, meta = {}) {
  if (!STATUTS_COMMANDES_VALIDES.includes(statut)) {
    throw new Error(`Statut de commande invalide : ${statut}`);
  }

  const commandeRef = doc(db, COLLECTION_COMMANDES, commandeId);

  await runTransaction(db, async (transaction) => {
    const commandeSnap = await transaction.get(commandeRef);

    if (!commandeSnap.exists()) {
      throw new Error("Commande introuvable.");
    }

    const commande = commandeSnap.data();
    const ancienStatut = commande.statut || null;

    transaction.update(commandeRef, {
      statut,
      updatedAt: serverTimestamp(),
    });

    const historiqueRef = doc(collection(db, COLLECTION_HISTORIQUE_COMMANDES));

    transaction.set(historiqueRef, {
      commandeId,
      numeroCommande: commande.numeroCommande || null,
      ancienStatut,
      nouveauStatut: statut,
      type: "changement_statut",
      parUserId: meta.userId || null,
      parNom: meta.nom || null,
      parEmail: meta.email || null,
      note: meta.note || "",
      createdAt: serverTimestamp(),
    });
  });
}

export async function ajusterInventaireBoutiqueV2(
  produitId,
  couleurId,
  taille,
  variation
) {
  const inventaireRef = refInventaire(produitId, couleurId, taille);
  const publicRef = refInventairePublic(produitId, couleurId, taille);

  await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(inventaireRef);
    const quantiteActuelle = snap.exists() ? Number(snap.data().quantite || 0) : 0;
    const nouvelleQuantite = quantiteActuelle + Number(variation || 0);

    transaction.set(
      inventaireRef,
      {
        produitId,
        couleurId,
        taille,
        quantite: nouvelleQuantite,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    transaction.set(
      publicRef,
      {
        produitId,
        couleurId,
        taille,
        disponible: nouvelleQuantite > 0,
        statut: statutPublicDepuisQuantite(nouvelleQuantite),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  });
}

export async function deduireInventaireBoutique(articles = []) {
  await runTransaction(db, async (transaction) => {
    for (const article of articles) {
      const produitId = nettoyerTexte(article.produitId);
      const couleurId = nettoyerTexte(article.couleurId);
      const taille = nettoyerTexte(article.taille).toUpperCase();
      const quantiteDemandee = Math.max(1, Number(article.quantite || 1));

      const inventaireRef = refInventaire(produitId, couleurId, taille);
      const publicRef = refInventairePublic(produitId, couleurId, taille);
      const snap = await transaction.get(inventaireRef);
      const quantiteActuelle = snap.exists() ? Number(snap.data().quantite || 0) : 0;
      const nouvelleQuantite = quantiteActuelle - quantiteDemandee;

      transaction.set(
        inventaireRef,
        {
          produitId,
          couleurId,
          taille,
          quantite: nouvelleQuantite,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      transaction.set(
        publicRef,
        {
          produitId,
          couleurId,
          taille,
          disponible: nouvelleQuantite > 0,
          statut: statutPublicDepuisQuantite(nouvelleQuantite),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    }
  });
}

export async function annulerCommandeBoutique(commandeId, articles = [], meta = {}) {
  const commandeRef = doc(db, COLLECTION_COMMANDES, commandeId);

  await runTransaction(db, async (transaction) => {
    const commandeSnap = await transaction.get(commandeRef);

    if (!commandeSnap.exists()) {
      throw new Error("Commande introuvable.");
    }

    const commande = commandeSnap.data();
    const ancienStatut = commande.statut || null;
    const articlesARemettre = articles.length > 0 ? articles : commande.articles || [];
    const inventaireDejaRemis = commande.inventaireRemis === true;

    if (!inventaireDejaRemis) {
      for (const article of articlesARemettre) {
        const produitId = nettoyerTexte(article.produitId);
        const couleurId = nettoyerTexte(article.couleurId);
        const taille = nettoyerTexte(article.taille).toUpperCase();
        const quantiteARemettre = Math.max(1, Number(article.quantite || 1));

        const inventaireRef = refInventaire(produitId, couleurId, taille);
        const publicRef = refInventairePublic(produitId, couleurId, taille);
        const snap = await transaction.get(inventaireRef);
        const quantiteActuelle = snap.exists() ? Number(snap.data().quantite || 0) : 0;
        const nouvelleQuantite = quantiteActuelle + quantiteARemettre;

        transaction.set(
          inventaireRef,
          {
            produitId,
            couleurId,
            taille,
            quantite: nouvelleQuantite,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );

        transaction.set(
          publicRef,
          {
            produitId,
            couleurId,
            taille,
            disponible: nouvelleQuantite > 0,
            statut: statutPublicDepuisQuantite(nouvelleQuantite),
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      }
    }

    transaction.update(commandeRef, {
      statut: "annulee",
      inventaireRemis: true,
      updatedAt: serverTimestamp(),
    });

    const historiqueRef = doc(collection(db, COLLECTION_HISTORIQUE_COMMANDES));

    transaction.set(historiqueRef, {
      commandeId,
      numeroCommande: commande.numeroCommande || null,
      ancienStatut,
      nouveauStatut: "annulee",
      type: "annulation_commande",
      inventaireRemis: !inventaireDejaRemis,
      parUserId: meta.userId || null,
      parNom: meta.nom || null,
      parEmail: meta.email || null,
      createdAt: serverTimestamp(),
    });
  });
}

export async function supprimerCommandeBoutique(commandeId, meta = {}) {
  const commandeRef = doc(db, COLLECTION_COMMANDES, commandeId);
  const commandeSnap = await getDoc(commandeRef);

  if (!commandeSnap.exists()) {
    throw new Error("Commande introuvable.");
  }

  const commande = commandeSnap.data();

  if (commande.statut !== "annulee") {
    throw new Error("Seules les commandes annulées peuvent être supprimées définitivement.");
  }

  const batch = writeBatch(db);
  const historiqueRef = doc(collection(db, COLLECTION_HISTORIQUE_COMMANDES));

  batch.set(historiqueRef, {
    commandeId,
    numeroCommande: commande.numeroCommande || null,
    ancienStatut: commande.statut || null,
    nouveauStatut: "supprimee",
    type: "suppression_commande_annulee",
    parUserId: meta.userId || null,
    parNom: meta.nom || null,
    parEmail: meta.email || null,
    createdAt: serverTimestamp(),
  });

  batch.delete(commandeRef);

  await batch.commit();
}

