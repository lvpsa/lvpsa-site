import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
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

export default function BoutiquesV2() {
  const { chargementInventaire, statutInventaire, quantiteInventaire } =
    useInventaire();

  const [produits, setProduits] = useState([]);
  const [chargementProduits, setChargementProduits] = useState(true);

  const [produitSelectionne, setProduitSelectionne] = useState(null);
  const [couleurId, setCouleurId] = useState("");
  const [vueProduit, setVueProduit] = useState("devant");
  const [taille, setTaille] = useState("M");
  const [quantite, setQuantite] = useState(1);
  const [panier, setPanier] = useState([]);
  const [formulaireOuvert, setFormulaireOuvert] = useState(false);

const [commande, setCommande] = useState({
  nom: "",
  courriel: "",
  telephone: "",
  notes: "",
});

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
        image: couleurSelectionnee.imageDevant,
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

  const commandeComplete = {
    nom: commande.nom,
    courriel: commande.courriel,
    telephone: commande.telephone,
    notes: commande.notes,
    articles: panier,
    total,
    source: "boutique-v2",
  };

  try {
    const resultatCommande = await creerCommandeBoutique(commandeComplete);

const commandeAvecNumero = {
  ...commandeComplete,
  numeroCommande: resultatCommande.numeroCommande,
  numeroCommandeSimple: resultatCommande.numeroCommandeSimple,
};

await deduireInventaireBoutique(panier);
await envoyerCommandeGoogleSheet(commandeAvecNumero);
await envoyerCourrielsCommande(commandeAvecNumero);

alert(`Commande ${resultatCommande.numeroCommande} envoyée avec succès!`);
    setPanier([]);
    setCommande({
      nom: "",
      courriel: "",
      telephone: "",
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

      <div className="mt-12 space-y-12">
        {["T-shirt", "Camisole", "Hoodie"].map((type) => (
          <div key={type}>
            <h2 className="mb-5 text-3xl font-black text-amber-300">
              {type === "Hoodie" ? "Hoodies" : `${type}s`}
            </h2>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
                      <img
                        src={couleurDefaut?.imageDevant}
                        alt={produit.nom}
                        className="h-56 w-full rounded-2xl bg-white object-contain"
                      />

                      <p className="mt-4 text-lg font-black text-white">
                        {produit.nom}
                      </p>

                      <p className="text-sm text-slate-300">
                        {produit.couleurs?.length || 0} couleur(s) disponible(s)
                      </p>

                      <p className="mt-2 text-sm font-bold text-slate-300">
                        {couleurDefaut &&
                          statutInventaire(
                            produit.id,
                            couleurDefaut.id,
                            tailleDefaut
                          )}
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
                <img
                  src={
                    vueProduit === "devant"
                      ? couleurSelectionnee.imageDevant
                      : couleurSelectionnee.imageDos
                  }
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

                  <p className="mt-1 text-lg font-black text-amber-300">
                    {statutInventaire(
                      produitSelectionne.id,
                      couleurSelectionnee.id,
                      taille
                    )}
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    Quantité actuelle :{" "}
                    {quantiteInventaire(
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
