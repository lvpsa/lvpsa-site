import React, { useEffect, useState } from "react";
import {
  chargerCommandesBoutique,
  modifierStatutCommandeBoutique,
} from "../../services/firebaseBoutique";

export default function AdminCommandesBoutique() {
  const [commandes, setCommandes] = useState([]);

  const charger = async () => {
    const data = await chargerCommandesBoutique();
    setCommandes(data);
  };

  useEffect(() => {
    charger();
  }, []);

  const changerStatut = async (id, statut) => {
    await modifierStatutCommandeBoutique(id, statut);
    await charger();
  };

  return (
    <div className="mt-8 space-y-4">
      <h3 className="text-2xl font-black text-white">Commandes boutique</h3>

      {commandes.map((commande) => (
        <div
          key={commande.id}
          className="rounded-2xl border border-white/10 bg-black/20 p-5"
        >
          <p className="font-black text-amber-300">{commande.nom}</p>
          <p className="text-sm text-slate-300">{commande.courriel}</p>
          <p className="text-sm text-slate-300">{commande.telephone}</p>

          <div className="mt-4 space-y-1 text-slate-300">
            {commande.articles?.map((article, index) => (
              <p key={index}>
                • {article.nom} — {article.couleurNom} — {article.taille} — Qté{" "}
                {article.quantite}
              </p>
            ))}
          </div>

          <p className="mt-4 text-xl font-black text-white">
            Total : {commande.total} $
          </p>

          <select
            value={commande.statut || "en_attente"}
            onChange={(e) => changerStatut(commande.id, e.target.value)}
            className="mt-4 rounded-2xl px-4 py-3 text-slate-950"
          >
            <option value="en_attente">En attente</option>
            <option value="en_preparation">En préparation</option>
            <option value="prete">Prête</option>
            <option value="remise">Remise</option>
            <option value="annulee">Annulée</option>
          </select>
        </div>
      ))}
    </div>
  );
}
