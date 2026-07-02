import React, { useEffect, useMemo, useState } from "react";
import {
  chargerCommandesBoutique,
  modifierStatutCommandeBoutique,
  chargerInventaireBoutiqueV2,
  ajusterInventaireBoutiqueV2,
  chargerProduitsBoutique,
} from "../../../services/firebaseBoutique";

export default function AdminBoutiqueV2() {
  const [onglet, setOnglet] = useState("commandes");
  const [commandes, setCommandes] = useState([]);
  const [inventaire, setInventaire] = useState({});
  const [produits, setProduits] = useState([]);
  const [chargement, setChargement] = useState(true);

  const charger = async () => {
    setChargement(true);
    const [cmds, inv, prods] = await Promise.all([
      chargerCommandesBoutique(),
      chargerInventaireBoutiqueV2(),
      chargerProduitsBoutique(),
    ]);

    setCommandes(cmds);
    setInventaire(inv);
    setProduits(prods);
    setChargement(false);
  };

  useEffect(() => {
    charger();
  }, []);

  const ventesTotales = useMemo(
    () => commandes.reduce((total, c) => total + Number(c.total || 0), 0),
    [commandes]
  );

  const articlesVendus = useMemo(
    () =>
      commandes.reduce(
        (total, c) =>
          total +
          (c.articles || []).reduce(
            (sousTotal, a) => sousTotal + Number(a.quantite || 0),
            0
          ),
        0
      ),
    [commandes]
  );

  const changerStatut = async (id, statut) => {
    await modifierStatutCommandeBoutique(id, statut);
    await charger();
  };

  const ajusterStock = async (produitId, couleurId, taille, variation) => {
    await ajusterInventaireBoutiqueV2(produitId, couleurId, taille, variation);
    await charger();
  };

  if (chargement) {
    return (
      <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6 text-slate-300">
        Chargement de la boutique...
      </div>
    );
  }

  return (
    <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-3xl font-black text-amber-300">Boutique LVPSA</h2>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <StatCard titre="Commandes" valeur={commandes.length} />
        <StatCard titre="Articles vendus" valeur={articlesVendus} />
        <StatCard titre="Ventes totales" valeur={`${ventesTotales} $`} />
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {[
          ["commandes", "📦 Commandes"],
          ["inventaire", "👕 Inventaire"],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setOnglet(id)}
            className={`rounded-full px-6 py-3 font-black ${
              onglet === id
                ? "bg-amber-400 text-slate-950"
                : "border border-white/15 text-white hover:border-amber-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {onglet === "commandes" && (
        <div className="mt-8 space-y-5">
          {commandes.length === 0 ? (
            <p className="text-slate-400">Aucune commande pour le moment.</p>
          ) : (
            commandes.map((commande) => (
              <div
                key={commande.id}
                className="rounded-2xl border border-white/10 bg-black/20 p-5"
              >
                <div className="flex flex-wrap justify-between gap-4">
                  <div>
                    <p className="text-xl font-black text-amber-300">
                      {commande.nom}
                    </p>
                    <p className="text-sm text-slate-300">
                      {commande.courriel} · {commande.telephone}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      ID : {commande.id}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-black text-white">
                      {commande.total} $
                    </p>

                    <select
                      value={commande.statut || "en_attente"}
                      onChange={(e) =>
                        changerStatut(commande.id, e.target.value)
                      }
                      className="mt-3 rounded-2xl px-4 py-3 text-slate-950"
                    >
                      <option value="en_attente">En attente</option>
                      <option value="en_preparation">En préparation</option>
                      <option value="prete">Prête</option>
                      <option value="remise">Remise</option>
                      <option value="annulee">Annulée</option>
                    </select>
                  </div>
                </div>

                <div className="mt-5 space-y-2 text-slate-300">
                  {(commande.articles || []).map((article, index) => (
                    <p key={index}>
                      • {article.nom} — {article.couleurNom} —{" "}
                      {article.taille} — Qté {article.quantite}
                    </p>
                  ))}
                </div>

                {commande.notes && (
                  <p className="mt-4 rounded-xl bg-white/5 p-3 text-sm text-slate-300">
                    Note : {commande.notes}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {onglet === "inventaire" && (
        <div className="mt-8 space-y-8">
          {produits.map((produit) => (
            <div
              key={produit.id}
              className="rounded-2xl border border-white/10 bg-black/20 p-5"
            >
              <h3 className="text-2xl font-black text-amber-300">
                {produit.nom}
              </h3>

              <div className="mt-5 space-y-6">
                {produit.couleurs?.map((couleur) => (
                  <div key={couleur.id}>
                    <p className="mb-3 font-black text-white">
                      Couleur : {couleur.nom}
                    </p>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {produit.grandeurs?.map((taille) => {
                        const cle = `${produit.id}_${couleur.id}_${taille}`;
                        const quantite = Number(
                          inventaire[cle]?.quantite || 0
                        );

                        return (
                          <div
                            key={cle}
                            className="rounded-xl border border-white/10 bg-white/5 p-4"
                          >
                            <p className="font-black text-white">{taille}</p>

                            <div className="mt-3 flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() =>
                                  ajusterStock(
                                    produit.id,
                                    couleur.id,
                                    taille,
                                    -1
                                  )
                                }
                                className="h-9 w-9 rounded-full border border-white/15 font-black text-white"
                              >
                                −
                              </button>

                              <span className="min-w-8 text-center text-xl font-black text-amber-300">
                                {quantite}
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  ajusterStock(
                                    produit.id,
                                    couleur.id,
                                    taille,
                                    1
                                  )
                                }
                                className="h-9 w-9 rounded-full border border-white/15 font-black text-white"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ titre, valeur }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
      <p className="text-sm font-bold uppercase tracking-wider text-slate-400">
        {titre}
      </p>
      <p className="mt-2 text-3xl font-black text-white">{valeur}</p>
    </div>
  );
}
