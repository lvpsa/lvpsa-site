import React from "react";

export default function PanierV2({
  panier,
  setPanier,
  total,
  onCommander,
}) {
  const modifierQuantite = (index, variation) => {
    setPanier((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              quantite: Math.max(1, Number(item.quantite) + variation),
            }
          : item
      )
    );
  };

  const retirerArticle = (index) => {
    setPanier((prev) => prev.filter((_, i) => i !== index));
  };

  const viderPanier = () => {
    if (window.confirm("Vider complètement le panier?")) {
      setPanier([]);
    }
  };

  const nombreArticles = panier.reduce(
    (total, item) => total + Number(item.quantite),
    0
  );

  return (
    <div className="mt-16 rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white">Panier</h2>

          <p className="mt-2 text-slate-300">
            {nombreArticles} article{nombreArticles > 1 ? "s" : ""} dans votre panier
          </p>
        </div>

        {panier.length > 0 && (
          <button
            type="button"
            onClick={viderPanier}
            className="rounded-full border border-red-400/40 px-5 py-2 text-sm font-bold text-red-300 hover:bg-red-400/10"
          >
            Vider le panier
          </button>
        )}
      </div>

      <div className="mt-6 space-y-4">
        {panier.length === 0 ? (
          <p className="rounded-2xl bg-black/20 p-5 text-slate-400">
            Aucun article sélectionné.
          </p>
        ) : (
          panier.map((article, index) => (
            <div
              key={`${article.produitId}-${article.couleurId}-${article.taille}-${index}`}
              className="rounded-2xl border border-white/10 bg-black/20 p-4"
            >
              <div className="flex gap-4">
                <img
                  src={article.image}
                  alt={article.nom}
                  className="h-24 w-24 rounded-xl bg-white object-contain"
                />

                <div className="flex-1">
                  <p className="font-black text-amber-300">{article.nom}</p>

                  <p className="mt-1 text-sm text-slate-300">
                    Couleur : {article.couleurNom} • Grandeur : {article.taille}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => modifierQuantite(index, -1)}
                      className="h-9 w-9 rounded-full border border-white/15 font-black text-white hover:border-amber-300"
                    >
                      −
                    </button>

                    <span className="min-w-8 text-center font-black text-white">
                      {article.quantite}
                    </span>

                    <button
                      type="button"
                      onClick={() => modifierQuantite(index, 1)}
                      className="h-9 w-9 rounded-full border border-white/15 font-black text-white hover:border-amber-300"
                    >
                      +
                    </button>

                    <button
                      type="button"
                      onClick={() => retirerArticle(index)}
                      className="ml-auto text-sm font-bold text-red-300 hover:underline"
                    >
                      Retirer
                    </button>
                  </div>

                  <p className="mt-3 text-right font-black text-white">
                    {Number(article.prix) * Number(article.quantite)} $
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {panier.length > 0 && (
        <div className="mt-8 rounded-3xl bg-amber-400 p-5 text-slate-950">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xl font-black">Total</p>
            <p className="text-3xl font-black">{total} $</p>
          </div>

          <button
            type="button"
            onClick={onCommander}
            className="mt-5 w-full rounded-full bg-slate-950 px-8 py-4 font-black text-white hover:bg-slate-800"
          >
            Passer la commande
          </button>
        </div>
      )}
    </div>
  );
}
