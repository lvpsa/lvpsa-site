import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  increment,
  serverTimestamp,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase";

export function useInventaire() {
  const [inventaire, setInventaire] = useState({});
  const [chargementInventaire, setChargementInventaire] = useState(true);

  const chargerInventaire = async () => {
    try {
      setChargementInventaire(true);

      const snap = await getDocs(collection(db, "inventaireBoutiqueV2"));
      const data = {};

      snap.docs.forEach((docItem) => {
        data[docItem.id] = docItem.data();
      });

      setInventaire(data);
    } catch (error) {
      console.error("Erreur lors du chargement de l'inventaire :", error);
    } finally {
      setChargementInventaire(false);
    }
  };

  useEffect(() => {
    chargerInventaire();
  }, []);

  const cleInventaire = (produitId, couleurId, taille) => {
    return `${produitId}_${couleurId}_${taille}`;
  };

  const quantiteInventaire = (produitId, couleurId, taille) => {
    const cle = cleInventaire(produitId, couleurId, taille);
    return Number(inventaire[cle]?.quantite || 0);
  };

  const statutInventaire = (produitId, couleurId, taille) => {
    const quantite = quantiteInventaire(produitId, couleurId, taille);

    if (quantite >= 4) return "🟢 en inventaire";
    if (quantite >= 1) return "🟡 dernières quantités";
    return "🔶 sur commande";
  };

  const deduireInventaire = async (articles) => {
    const batch = writeBatch(db);

    articles.forEach((article) => {
      const ref = doc(
        db,
        "inventaireBoutiqueV2",
        cleInventaire(article.produitId, article.couleurId, article.taille)
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
    await chargerInventaire();
  };

  const ajusterInventaire = async (produitId, couleurId, taille, variation) => {
    const ref = doc(
      db,
      "inventaireBoutiqueV2",
      cleInventaire(produitId, couleurId, taille)
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

    await chargerInventaire();
  };

  return {
    inventaire,
    chargementInventaire,
    chargerInventaire,
    quantiteInventaire,
    statutInventaire,
    deduireInventaire,
    ajusterInventaire,
  };
}
