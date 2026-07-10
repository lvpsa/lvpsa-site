import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const COLLECTION_INVENTAIRE_PUBLIC = "inventairePublicBoutique";
const COLLECTION_INVENTAIRE_PRIVE = "inventaireBoutiqueV2";

const cleInventaire = (produitId, couleurId, taille) => {
  return `${produitId}_${couleurId}_${taille}`;
};

const statutPublicDepuisQuantite = (quantite) => {
  return Number(quantite || 0) > 0 ? "disponible" : "sur_commande";
};

const libelleStatutClient = (item) => {
  if (!item) return "Sur commande";

  if (item.disponible === true || item.statut === "disponible") {
    return "Disponible";
  }

  return "Sur commande";
};

const convertirInventairePriveEnPublic = (snap) => {
  const data = {};

  snap.docs.forEach((docItem) => {
    const item = docItem.data();
    const quantite = Number(item.quantite || 0);

    data[docItem.id] = {
      produitId: item.produitId || "",
      couleurId: item.couleurId || "",
      taille: item.taille || "",
      disponible: quantite > 0,
      statut: statutPublicDepuisQuantite(quantite),
    };
  });

  return data;
};

export function useInventaire() {
  const [inventaire, setInventaire] = useState({});
  const [chargementInventaire, setChargementInventaire] = useState(true);

  const chargerInventaire = async () => {
    try {
      setChargementInventaire(true);

      const publicSnap = await getDocs(collection(db, COLLECTION_INVENTAIRE_PUBLIC));

      if (!publicSnap.empty) {
        const data = {};

        publicSnap.docs.forEach((docItem) => {
          data[docItem.id] = docItem.data();
        });

        setInventaire(data);
        return;
      }

      // Transition temporaire : permet au site de continuer à fonctionner
      // tant que inventairePublicBoutique n'est pas encore généré.
      // Après la publication des règles sécurisées, cette collection privée
      // ne devra plus être lisible par les clients.
      const priveSnap = await getDocs(collection(db, COLLECTION_INVENTAIRE_PRIVE));
      setInventaire(convertirInventairePriveEnPublic(priveSnap));
    } catch (error) {
      console.error("Erreur lors du chargement de l'inventaire public :", error);
      setInventaire({});
    } finally {
      setChargementInventaire(false);
    }
  };

  useEffect(() => {
    chargerInventaire();
  }, []);

  const itemInventaire = (produitId, couleurId, taille) => {
    const cle = cleInventaire(produitId, couleurId, taille);
    return inventaire[cle] || null;
  };

  const estDisponible = (produitId, couleurId, taille) => {
    const item = itemInventaire(produitId, couleurId, taille);
    return item?.disponible === true || item?.statut === "disponible";
  };

  const statutInventaire = (produitId, couleurId, taille) => {
    return libelleStatutClient(itemInventaire(produitId, couleurId, taille));
  };

  // Compatibilité avec l'ancien code.
  // Ne retourne plus la vraie quantité afin de ne pas exposer l'inventaire client.
  const quantiteInventaire = (produitId, couleurId, taille) => {
    return estDisponible(produitId, couleurId, taille) ? 1 : 0;
  };

  return {
    inventaire,
    chargementInventaire,
    chargerInventaire,
    estDisponible,
    quantiteInventaire,
    statutInventaire,
  };
}

