import React from "react";
import { formatTelephone } from "../../utils/telephone";

export default function FormulaireCommandeV2({
  ouvert,
  onFermer,
  panier,
  total,
  commande,
  setCommande,
  onEnvoyer,
}) {
  if (!ouvert) return null;

  const mettreAJourChamp = (champ, valeur) => {
    setCommande((prev) => ({
      ...prev,
      [champ]: valeur,
    }));
  };

  const formulaireComplet =
    String(commande.nom || "").trim() &&
    String(commande.courriel || "").trim() &&
    String(commande.telephone || "").trim() &&
    panier.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6">
      <div className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-slate-950 p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-bold uppercase tracking-wider text-amber-300">
              Finaliser
            </p>
            <h2 className="mt-2 text-3xl font-black text-white">
              Votre commande
            </h2>
          </div>

          <button
            type="button"
            onClick={onFermer}
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-white"
          >
            Fermer
          </button>
        </div>

        <div className="mt-6 grid gap-4">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-300">
              Nom complet
            </label>
            <input
              className="w-full rounded-2xl px-4 py-3 text-slate-950"
              placeholder="Nom complet"
              value={commande.nom || ""}
              onChange={(e) => mettreAJourChamp("nom", e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-300">
              Courriel
            </label>
            <input
              type="email"
              className="w-full rounded-2xl px-4 py-3 text-slate-950"
              placeholder="Courriel"
              value={commande.courriel || ""}
              onChange={(e) => mettreAJourChamp("courriel", e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-300">
              Téléphone
            </label>
            <input
              inputMode="tel"
              maxLength={13}
              className="w-full rounded-2xl px-4 py-3 text-slate-950"
              placeholder="(418)555-1234"
              value={commande.telephone || ""}
              onChange={(e) =>
                mettreAJourChamp("telephone", formatTelephone(e.target.value))
              }
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-300">
              Notes ou demandes spéciales
            </label>
            <textarea
              className="min-h-28 w-full rounded-2xl px-4 py-3 text-slate-950"
              placeholder="Notes ou demandes spéciales"
              value={commande.notes || ""}
              onChange={(e) => mettreAJourChamp("notes", e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-white/5 p-4">
          <p className="font-black text-amber-300">
            Résumé : {panier.length} article(s)
          </p>
          <p className="mt-2 text-2xl font-black text-white">
            Total : {Number(total || 0)} $
          </p>
        </div>

        {!formulaireComplet && (
          <p className="mt-4 text-sm font-bold text-amber-300">
            Complétez le nom, le courriel et le téléphone avant d’envoyer la commande.
          </p>
        )}

        <button
          type="button"
          onClick={onEnvoyer}
          disabled={!formulaireComplet}
          className={`mt-6 w-full rounded-full px-8 py-4 font-black ${
            formulaireComplet
              ? "bg-amber-400 text-slate-950 hover:bg-amber-300"
              : "cursor-not-allowed bg-slate-600 text-slate-300"
          }`}
        >
          Envoyer la commande
        </button>
      </div>
    </div>
  );
}

