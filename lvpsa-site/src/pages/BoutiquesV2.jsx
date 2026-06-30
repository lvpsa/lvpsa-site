import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { produitsBoutique } from "../data/produits";
import { useInventaire } from "../hooks/useInventaire";

export default function BoutiquesV2() {
  const produits = produitsBoutique;
  const { chargementInventaire, statutInventaire, quantiteInventaire } =
    useInventaire();

  const [produitSelectionne, setProduitSelectionne] = useState(null);
  const [vueProduit, setVueProduit] = useState("devant");
  const [taille, setTaille] = useState("M");
  const [quantite, setQuantite] = useState(1);
  const [panier, setPanier] = useState([]);

  const total = useMemo(() => {
    return panier.reduce(
      (somme, item) => somme + Number(item.prix) * Number(item.quantite),
      0
    );
  }, [panier]);

  const ouvrirProduit = (produit) => {
    setProduitSelectionne(produit);
    setVueProduit("devant");
    setTaille(produit.grandeurs?.includes("M") ? "M" : produit.grandeurs?.[0]);
    setQuantite(1);
  };

  const ajouterAuPanier = () => {
    if (!produitSelectionne) return;

    setPanier((prev) => [
      ...prev,
      {
        produitId: produitSelectionne.id,
        categorie: produitSelectionne.categorie,
        modele: produitSelectionne.modele,
        couleur: produitSelectionne.couleur,
        prix: produitSelectionne.prix,
        taille,
        quantite: Math.max(1, Number(quantite) || 1),
        image: produitSelectionne.imageDevant,
      },
    ]);

    setProduitSelectionne(null);
  };

  const retirerArticle = (index) => {
    setPanier((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <p className="font-bold uppercase tracking-wider text-amber-300">
        LVPSA
      </p>

      <h1 className="mt-2 text-5xl font-black">Boutique V2</h1>

      <p className="mt-4 text-xl text-slate-300">
        Collection officielle Beach Volleyball 2026
      </p>

      <div className="mt-8 rounded-3xl border border-amber-400/20 bg-white/5 p-6">
        <h2 className="text-2xl font-black text-amber-300">
          Boutique en test
        </h2>

        <p className="mt-3 text-slate-300">
          Cette version sert à valider la nouvelle boutique avec inventaire
          Firebase avant de remplacer la boutique actuelle.
        </p>
      </div>

      {chargementInventaire && (
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-300">
          Chargement de l’inventaire...
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
                        src={produit.imageDevant}
                        alt={produit.modele}
                        className="h-56 w-full rounded-2xl bg-white object-contain"
                      />

                      <p className="mt-4 text-lg font-black text-white">
                        {produit.categorie}
                      </p>

                      <p className="text-sm text-slate-300">
                        Couleur : {produit.couleur}
                      </p>

                      <p className="mt-2 text-sm font-bold text-slate-300">
                        {statutInventaire(produit.id, tailleDefaut)}
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

      {produitSelectionne && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] border border-white/10 bg-slate-950 p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-amber-300">
                  Ajouter à la commande
                </p>

                <h2 className="mt-2 text-3xl font-black">
                  {produitSelectionne.categorie}
                </h2>

                <p className="mt-1 text-slate-300">
                  Couleur : {produitSelectionne.couleur} —{" "}
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
                      ? produitSelectionne.imageDevant
                      : produitSelectionne.imageDos
                  }
                  alt={produitSelectionne.modele}
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
                    Statut pour {taille}
                  </p>

                  <p className="mt-1 text-lg font-black text-amber-300">
                    {statutInventaire(produitSelectionne.id, taille)}
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    Quantité actuelle :{" "}
                    {quantiteInventaire(produitSelectionne.id, taille)}
                  </p>
                </div>

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

      <div className="mt-16 rounded-3xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-3xl font-black">Panier de test</h2>

        <div className="mt-6 space-y-3">
          {panier.length === 0 ? (
            <p className="text-slate-400">Aucun article sélectionné.</p>
          ) : (
            panier.map((article, index) => (
              <div
                key={`${article.produitId}-${article.taille}-${index}`}
                className="rounded-2xl border border-white/10 bg-black/20 p-4"
              >
                <div className="flex gap-4">
                  <img
                    src={article.image}
                    alt={article.modele}
                    className="h-20 w-20 rounded-xl bg-white object-contain"
                  />

                  <div className="flex-1">
                    <p className="font-bold text-amber-300">
                      {article.categorie}
                    </p>

                    <p className="text-sm text-slate-300">
                      Couleur {article.couleur} • Taille {article.taille} • Qté{" "}
                      {article.quantite}
                    </p>

                    <p className="mt-1 text-sm font-bold text-white">
                      Total : {Number(article.prix) * Number(article.quantite)} $
                    </p>

                    <button
                      type="button"
                      onClick={() => retirerArticle(index)}
                      className="mt-2 text-xs text-red-300 hover:underline"
                    >
                      Retirer
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {panier.length > 0 && (
          <div className="mt-6 rounded-2xl bg-amber-400 p-4 text-right text-xl font-black text-slate-950">
            Total : {total} $
          </div>
        )}
      </div>

      <div className="mt-8">
        <Link to="/boutique" className="text-amber-300 hover:underline">
          ← Retour à la boutique actuelle
        </Link>
      </div>
    </section>
  );
}
