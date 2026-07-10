import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { chargerProduitsBoutique } from "../services/firebaseBoutique";
import { useInventaire } from "../hooks/useInventaire";
import PanierV2 from "../components/boutique/PanierV2";
import FormulaireCommandeV2 from "../components/boutique/FormulaireCommandeV2";
import {
  creerCommandeBoutique,
  deduireInventaireBoutique,
} from "../services/firebaseBoutique";
import { envoyerCommandeGoogleSheet } from "../services/googleSheet";
import { envoyerCourrielsCommande } from "../services/emailService";
import { getCharteGrandeur } from "../data/chartesGrandeurs";
import { formatTelephone } from "../utils/telephone";

const normaliserSlugImage = (valeur) =>
  String(valeur || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/t[\s-]?shirt/g, "tshirt")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const cheminsImagesProduit = (produit, couleur, vue = "devant") => {
  const typeImage = vue === "dos" ? "dos" : "devant";
  const extension = typeImage === "dos" ? "png" : "jpg";

  const chemins = [];

  const ajouter = (chemin) => {
    if (chemin && !chemins.includes(chemin)) {
      chemins.push(chemin);
    }
  };

  const cleFixe = `${normaliserSlugImage(produit?.id)}_${normaliserSlugImage(couleur?.id)}_${typeImage}`;

  const imagesFixes = {
    "tshirt-homme_sable_devant": ["/tshirt-homme-sable-devant.jpg"],
    "tshirt-homme_sable_dos": ["/tshirt-homme-sable-dos.png"],
    "tshirt-homme_or_devant": ["/tshirt-homme-or-devant.jpg"],
    "tshirt-homme_or_dos": ["/tshirt-homme-or-dos.png"],

    "tshirt-femme_blanc_devant": ["/tshirt-femme-blanc-devant.jpg"],
    "tshirt-femme_blanc_dos": ["/tshirt-femme-blanc-dos.png"],
    "tshirt-femme_rose_devant": ["/tshirt-femme-rose-devant.jpg"],
    "tshirt-femme_rose_dos": ["/tshirt-femme-rose-dos.png"],

    "camisole-homme_blanc_devant": ["/camisole-homme-blanc-devant.jpg"],
    "camisole-homme_blanc_dos": ["/camisole-homme-blanc-dos.png"],
    "camisole-homme_marine_devant": [
      "/camisole-homme-marine-devant.jpg",
      "/camisole-homme-marin-devant.jpg",
      "/camisole-homme-bleu-devant.jpg"
    ],
    "camisole-homme_marine_dos": [
      "/camisole-homme-marine-dos.png",
      "/camisole-homme-marin-dos.png",
      "/camisole-homme-bleu-dos.png"
    ],

    "camisole-femme_bleu_devant": [
      "/camisole-femme-bleu-devant.jpg",
      "/camisole-femme-bleue-devant.jpg"
    ],
    "camisole-femme_bleu_dos": [
      "/camisole-femme-bleu-dos.png",
      "/camisole-femme-bleue-dos.png"
    ],
    "camisole-femme_rose_devant": ["/camisole-femme-rose-devant.jpg"],
    "camisole-femme_rose_dos": ["/camisole-femme-rose-dos.png"],

    "hoodie-unisex_marine_devant": [
      "/hoodie-unisex-marine-devant.jpg",
      "/hoodie-unisex-marin-devant.jpg"
    ],
    "hoodie-unisex_marine_dos": [
      "/hoodie-unisex-marine-dos.png",
      "/hoodie-unisex-marin-dos.png"
    ],
    "hoodie-unisex_or_devant": ["/hoodie-unisex-or-devant.jpg"],
    "hoodie-unisex_or_dos": ["/hoodie-unisex-or-dos.png"],
  };

  (imagesFixes[cleFixe] || []).forEach(ajouter);

  const produitId = normaliserSlugImage(produit?.id);
  const nomProduit = normaliserSlugImage(produit?.nom);
  const categorieProduit = normaliserSlugImage(produit?.categorie);

  const couleurId = normaliserSlugImage(couleur?.id);
  const couleurNom = normaliserSlugImage(couleur?.nom);

  const couleurs = [...new Set([couleurId, couleurNom].filter(Boolean))];
  const bases = [...new Set([produitId, nomProduit, categorieProduit].filter(Boolean))];

  couleurs.forEach((couleurSlug) => {
    bases.forEach((base) => {
      // Cas où le id contient déjà la couleur : tshirt-homme-or
      if (base.includes(`-${couleurSlug}`) || base.endsWith(couleurSlug)) {
        ajouter(`/${base}-${typeImage}.${extension}`);
      }

      // Cas normal : tshirt-homme + or
      ajouter(`/${base}-${couleurSlug}-${typeImage}.${extension}`);
    });
  });

  // Fallbacks si le chemin est déjà dans Firebase
  if (typeImage === "devant") {
    ajouter(couleur?.imageDevant);
    ajouter(produit?.imageDevant);
  } else {
    ajouter(couleur?.imageDos);
    ajouter(produit?.imageDos);
  }

  // Corrections spécifiques pour les camisoles
if (typeImage === "devant") {
  bases.forEach((base) => {
    couleurs.forEach((couleurSlug) => {
      if (base.includes("camisole-homme") && couleurSlug.includes("marine")) {
        ajouter("/camisole-homme-marine-devant.jpg");
        ajouter("/camisole-homme-bleu-devant.jpg");
      }

      if (base.includes("camisole-homme") && couleurSlug.includes("bleu")) {
        ajouter("/camisole-homme-bleu-devant.jpg");
        ajouter("/camisole-homme-marine-devant.jpg");
      }

      if (base.includes("camisole-femme") && couleurSlug.includes("bleu")) {
        ajouter("/camisole-femme-bleu-devant.jpg");
        ajouter("/camisole-femme-marine-devant.jpg");
      }

      if (base.includes("camisole-femme") && couleurSlug.includes("marine")) {
        ajouter("/camisole-femme-marine-devant.jpg");
        ajouter("/camisole-femme-bleu-devant.jpg");
      }
    });
  });
}
  
  return chemins;
};

function ImageBoutique({ produit, couleur, vue = "devant", alt, className }) {
  const sources = useMemo(
    () => cheminsImagesProduit(produit, couleur, vue),
    [produit, couleur, vue]
  );

  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [sources.join("|")]);

  return (
    <img
      src={sources[index] || ""}
      alt={alt}
      className={className}
      onError={() => {
        setIndex((current) =>
          current + 1 < sources.length ? current + 1 : current
        );
      }}
    />
  );
}

export default function BoutiquesV2() {
  const { chargementInventaire, statutInventaire } = useInventaire();

  const [produits, setProduits] = useState([]);
  const [chargementProduits, setChargementProduits] = useState(true);

  const [produitSelectionne, setProduitSelectionne] = useState(null);
  const [couleurId, setCouleurId] = useState("");
  const [vueProduit, setVueProduit] = useState("devant");
  const [taille, setTaille] = useState("M");
  const [quantite, setQuantite] = useState(1);
  const [panier, setPanier] = useState([]);
  const [formulaireOuvert, setFormulaireOuvert] = useState(false);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  const [commande, setCommande] = useState({
    nom: "",
    courriel: "",
    telephone: "",
    notes: "",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        setUserData(null);
        return;
      }

      try {
        const userSnap = await getDoc(doc(db, "users", currentUser.uid));
        const data = userSnap.exists() ? userSnap.data() : {};

        setUserData(data);

        setCommande((prev) => ({
          ...prev,
          nom: prev.nom || data.nom || "",
          courriel:
            prev.courriel ||
            data.email ||
            data.courriel ||
            currentUser.email ||
            "",
          telephone: prev.telephone || formatTelephone(data.telephone || ""),
        }));
      } catch (error) {
        console.error("Erreur chargement profil boutique :", error);

        setCommande((prev) => ({
          ...prev,
          courriel: prev.courriel || currentUser.email || "",
        }));
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const chargerProduits = async () => {
      try {
        const data = await chargerProduitsBoutique();
        setProduits(data);
      } catch (error) {
        console.error("Erreur chargement produits :", error);
      } finally {
        setChargementProduits(false);
      }
    };

    chargerProduits();
  }, []);

  const couleurSelectionnee = produitSelectionne?.couleurs?.find(
    (couleur) => couleur.id === couleurId
  );

  const statutClientInventaire = (produitId, couleurId, taille) => {
    return statutInventaire(produitId, couleurId, taille);
  };
  
  const imageProduit = (produit, couleur, vue = "devant") => {
  if (!produit) return "";

  const typeImage = vue === "dos" ? "dos" : "devant";
  const extension = typeImage === "dos" ? "png" : "jpg";

  const imageDepuisCouleur =
    typeImage === "dos" ? couleur?.imageDos : couleur?.imageDevant;

  const imageDepuisProduit =
    typeImage === "dos" ? produit.imageDos : produit.imageDevant;

  if (imageDepuisCouleur) return imageDepuisCouleur;
  if (imageDepuisProduit) return imageDepuisProduit;

  const produitId = String(produit.id || "").trim();
  const couleurId = String(couleur?.id || "").trim();

  if (!produitId) return "";

  // Cas 1 : le produit.id contient déjà la couleur
  // Exemple : tshirt-homme-or
  if (
    couleurId &&
    produitId.toLowerCase().includes(couleurId.toLowerCase())
  ) {
    return `/${produitId}-${typeImage}.${extension}`;
  }

  // Cas 2 : produit.id sans couleur + couleur.id
  // Exemple : tshirt-homme + or
  if (couleurId) {
    return `/${produitId}-${couleurId}-${typeImage}.${extension}`;
  }

  // Cas 3 : seulement produit.id
  return `/${produitId}-${typeImage}.${extension}`;
};
  const total = useMemo(() => {
    return panier.reduce(
      (somme, item) => somme + Number(item.prix) * Number(item.quantite),
      0
    );
  }, [panier]);

  const ouvrirProduit = (produit) => {
    const couleurDefaut = produit.couleurs?.[0];
    const tailleDefaut = produit.grandeurs?.includes("M")
      ? "M"
      : produit.grandeurs?.[0];

    setProduitSelectionne(produit);
    setCouleurId(couleurDefaut?.id || "");
    setTaille(tailleDefaut || "M");
    setVueProduit("devant");
    setQuantite(1);
  };

  const ajouterAuPanier = () => {
    if (!produitSelectionne || !couleurSelectionnee) return;

    setPanier((prev) => [
      ...prev,
      {
        produitId: produitSelectionne.id,
        nom: produitSelectionne.nom,
        type: produitSelectionne.type,
        categorie: produitSelectionne.categorie,
        couleurId: couleurSelectionnee.id,
        couleurNom: couleurSelectionnee.nom,
        prix: produitSelectionne.prix,
        taille,
        quantite: Math.max(1, Number(quantite) || 1),
        image:
  cheminsImagesProduit(produitSelectionne, couleurSelectionnee, "devant")[0] ||
  "",
      },
    ]);

    setProduitSelectionne(null);
  };

  const envoyerCommande = async () => {
  if (panier.length === 0) {
    alert("Votre panier est vide.");
    return;
  }

  if (!commande.nom || !commande.courriel || !commande.telephone) {
    alert("Veuillez compléter votre nom, courriel et téléphone.");
    return;
  }

    if (!user) {
  alert("Vous devez être connecté à votre compte LVPSA pour envoyer une commande.");
  return;
}
    
const commandeComplete = {
  userId: user?.uid || "",
  nom: commande.nom,
  courriel: commande.courriel,
  telephone: formatTelephone(commande.telephone),
  notes: commande.notes,
  articles: panier,
  total,
  source: "boutique-v2",
};

  try {
    const resultatCommande = await creerCommandeBoutique(commandeComplete);

const commandeAvecNumero = {
  ...commandeComplete,
  id: resultatCommande.id,
  numeroCommande: resultatCommande.numeroCommande,
  numeroCommandeSimple: resultatCommande.numeroCommandeSimple,
};

await deduireInventaireBoutique(panier);

const suivis = await Promise.allSettled([
  envoyerCommandeGoogleSheet(commandeAvecNumero),
  envoyerCourrielsCommande(commandeAvecNumero),
]);

suivis.forEach((resultat, index) => {
  if (resultat.status === "rejected") {
    console.error(
      index === 0
        ? "Erreur envoi Google Sheet :"
        : "Erreur envoi courriels commande :",
      resultat.reason
    );
  }
});

alert(`Commande ${resultatCommande.numeroCommande} envoyée avec succès!`);
    setPanier([]);
    setCommande({
      nom: userData?.nom || commande.nom || "",
      courriel:
        userData?.email ||
        userData?.courriel ||
        user?.email ||
        commande.courriel ||
        "",
      telephone: formatTelephone(userData?.telephone || commande.telephone || ""),
      notes: "",
    });
    setFormulaireOuvert(false);
  } catch (error) {
    console.error(error);
    alert("Erreur lors de l’envoi de la commande.");
  }
};

  const charteProduit = getCharteGrandeur(produitSelectionne);
  
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
     <p className="font-bold uppercase tracking-wider text-amber-300">
  Collection officielle
</p>

<h1 className="mt-2 text-5xl font-black">
  Boutique LVPSA
</h1>

<p className="mt-4 max-w-3xl text-xl leading-8 text-slate-300">
  Découvrez la collection officielle de la Ligue de volleyball de plage de
  Saint-Augustin. Des vêtements conçus pour représenter fièrement la LVPSA,
  sur le terrain comme au quotidien.
</p>

<div className="mt-8 rounded-3xl border border-amber-400/20 bg-white/5 p-6">
  <h2 className="text-2xl font-black text-amber-300">
    Quantités limitées
  </h2>

  <p className="mt-3 text-slate-300 leading-relaxed">
    Plusieurs articles sont disponibles en quantités limitées. Si un modèle ou
    une grandeur n’est plus en inventaire, il sera automatiquement indiqué comme
    disponible sur commande.
  </p>
</div>

      {(chargementProduits || chargementInventaire) && (
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-300">
          Chargement de la boutique...
        </div>
      )}

      <div className="mt-10 overflow-hidden rounded-[2rem] border border-white/10 bg-white shadow-2xl">
        <img
          src="/boutique-lvpsa.png"
          alt="Collection officielle LVPSA"
          className="w-full h-auto object-cover"
        />
      </div>

      <div className="mt-12 grid gap-8 xl:grid-cols-3">
  {["T-shirt", "Camisole", "Hoodie"].map((type) => (
    <div key={type}>
      <h2 className="mb-5 text-center text-3xl font-black text-amber-300">
        {type === "Hoodie" ? "Hoodies" : `${type}s`}
      </h2>

      <div className="grid gap-6">
        {produits
          .filter((produit) => produit.type === type)
          .map((produit) => {
            const couleurDefaut = produit.couleurs?.[0];
            const tailleDefaut = produit.grandeurs?.includes("M")
              ? "M"
              : produit.grandeurs?.[0];

            return (
              <button
                key={produit.id}
                type="button"
                onClick={() => ouvrirProduit(produit)}
                className="rounded-3xl border border-white/10 bg-white/5 p-4 text-left transition hover:-translate-y-1 hover:border-amber-300"
              >
               <ImageBoutique
                  produit={produit}
                  couleur={couleurDefaut}
                  vue="devant"
                  alt={produit.nom}
                  className="h-56 w-full rounded-2xl bg-white object-contain"
                />

                <p className="mt-4 text-lg font-black text-white">
                  {produit.nom}
                </p>

                <p className="text-sm text-slate-300">
                  {produit.couleurs?.length || 0} couleur(s) disponible(s)
                </p>

                <p
  className={`mt-2 text-sm font-bold ${
    couleurDefaut &&
    statutClientInventaire(produit.id, couleurDefaut.id, tailleDefaut) ===
      "Disponible"
      ? "text-emerald-300"
      : "text-amber-300"
  }`}
>
  {couleurDefaut
    ? statutClientInventaire(produit.id, couleurDefaut.id, tailleDefaut)
    : "Sur commande"}
</p>

                <p className="mt-2 text-xl font-black text-amber-300">
                  {produit.prix} $
                </p>
              </button>
            );
          })}
      </div>
    </div>
  ))}
</div>

      {produitSelectionne && couleurSelectionnee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] border border-white/10 bg-slate-950 p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-amber-300">
                  Ajouter à la commande
                </p>

                <h2 className="mt-2 text-3xl font-black">
                  {produitSelectionne.nom}
                </h2>

                <p className="mt-1 text-slate-300">
                  Couleur : {couleurSelectionnee.nom} —{" "}
                  {produitSelectionne.prix} $
                </p>
              </div>

              <button
                type="button"
                onClick={() => setProduitSelectionne(null)}
                className="rounded-full border border-white/10 px-4 py-2 text-sm"
              >
                Fermer
              </button>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div>
                <ImageBoutique
                  produit={produitSelectionne}
                  couleur={couleurSelectionnee}
                  vue={vueProduit}
                  alt={produitSelectionne.nom}
                  className="h-96 w-full rounded-2xl bg-white object-contain"
                />

                <div className="mt-4 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setVueProduit("devant")}
                    className={`rounded-full px-5 py-2 font-bold ${
                      vueProduit === "devant"
                        ? "bg-amber-400 text-slate-950"
                        : "border border-white/15 text-white"
                    }`}
                  >
                    Devant
                  </button>

                  <button
                    type="button"
                    onClick={() => setVueProduit("dos")}
                    className={`rounded-full px-5 py-2 font-bold ${
                      vueProduit === "dos"
                        ? "bg-amber-400 text-slate-950"
                        : "border border-white/15 text-white"
                    }`}
                  >
                    Dos
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-300">
                  Couleur
                </label>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  {produitSelectionne.couleurs.map((couleur) => (
                    <button
                      key={couleur.id}
                      type="button"
                      onClick={() => {
                        setCouleurId(couleur.id);
                        setVueProduit("devant");
                      }}
                      className={`rounded-2xl border px-4 py-3 font-black ${
                        couleurId === couleur.id
                          ? "border-amber-400 bg-amber-400 text-slate-950"
                          : "border-white/10 bg-white/5 text-white"
                      }`}
                    >
                      {couleur.nom}
                    </button>
                  ))}
                </div>

                <label className="mt-6 block text-sm font-bold text-slate-300">
                  Grandeur
                </label>

                <div className="mt-3 grid grid-cols-3 gap-3">
                  {produitSelectionne.grandeurs.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setTaille(g)}
                      className={`rounded-2xl border px-4 py-3 font-black ${
                        taille === g
                          ? "border-amber-400 bg-amber-400 text-slate-950"
                          : "border-white/10 bg-white/5 text-white"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>

                <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-slate-300">
                    Statut pour {couleurSelectionnee.nom} / {taille}
                  </p>

<p
  className={`mt-1 text-lg font-black ${
    statutClientInventaire(
      produitSelectionne.id,
      couleurSelectionnee.id,
      taille
    ) === "Disponible"
      ? "text-emerald-300"
      : "text-amber-300"
  }`}
>
  {statutClientInventaire(
    produitSelectionne.id,
    couleurSelectionnee.id,
    taille
  )}
</p>
                </div>

                {charteProduit && (
  <details className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
    <summary className="cursor-pointer font-black text-amber-300">
      Voir la charte des grandeurs
    </summary>

    <div className="mt-4 overflow-x-auto">
      <p className="mb-3 text-sm text-slate-300">
        {getCharteGrandeur(produitSelectionne).titre} —{" "}
        modèle {getCharteGrandeur(produitSelectionne).modele}. Mesures en{" "}
        {getCharteGrandeur(produitSelectionne).unite}.
      </p>

      <table className="w-full min-w-[650px] text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-amber-300">
            <th className="px-3 py-3 font-black">Mesure</th>

            {getCharteGrandeur(produitSelectionne).tailles.map((taille) => (
              <th key={taille} className="px-3 py-3 font-black">
                {taille}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {getCharteGrandeur(produitSelectionne).mesures.map((ligne) => (
            <tr key={ligne.nom} className="border-b border-white/10">
              <td className="px-3 py-3 font-bold text-white">
                {ligne.nom}
              </td>

              {ligne.valeurs.map((valeur, index) => (
                <td key={`${ligne.nom}-${index}`} className="px-3 py-3 text-slate-300">
                  {valeur}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-3 text-xs text-slate-400">
        Les mesures sont celles du vêtement à plat ou complètes selon la ligne indiquée.
        Elles peuvent varier légèrement selon les tolérances du manufacturier.
      </p>
    </div>
  </details>
)}

                <label className="mt-5 block text-sm font-bold text-slate-300">
                  Quantité
                </label>

                <input
                  type="number"
                  min="1"
                  value={quantite}
                  onChange={(e) => setQuantite(e.target.value)}
                  className="mt-2 w-full rounded-2xl px-4 py-3 text-slate-950"
                />

                <button
                  type="button"
                  onClick={ajouterAuPanier}
                  className="mt-6 w-full rounded-full bg-amber-400 px-8 py-3 font-black text-slate-950 hover:bg-amber-300"
                >
                  Ajouter au panier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <PanierV2
        panier={panier}
        setPanier={setPanier}
        total={total}
        onCommander={() => setFormulaireOuvert(true)}
      />

      <FormulaireCommandeV2
  ouvert={formulaireOuvert}
  onFermer={() => setFormulaireOuvert(false)}
  panier={panier}
  total={total}
  commande={commande}
  setCommande={setCommande}
  onEnvoyer={envoyerCommande}
/>

      <div className="mt-8">
        <Link to="/boutique" className="text-amber-300 hover:underline">
          ← Retour à la boutique actuelle
        </Link>
      </div>
    </section>
  );
}
