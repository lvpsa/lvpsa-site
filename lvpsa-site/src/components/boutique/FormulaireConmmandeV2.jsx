import React from "react";

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
            className="rounded-full border border-white/10 px-4 py-2 text-sm"
          >
            Fermer
          </button>
        </div>

        <div className="mt-6 grid gap-4">
          <input
            className="rounded-2xl px-4 py-3 text-slate-950"
            placeholder="Nom complet"
            value={commande.nom}
            onChange={(e) => setCommande({ ...commande, nom: e.target.value })}
          />

          <input
            className="rounded-2xl px-4 py-3 text-slate-950"
            placeholder="Courriel"
            value={commande.courriel}
            onChange={(e) =>
              setCommande({ ...commande, courriel: e.target.value })
            }
          />

          <input
            className="rounded-2xl px-4 py-3 text-slate-950"
            placeholder="Téléphone"
            value={commande.telephone}
            onChange={(e) =>
              setCommande({ ...commande, telephone: e.target.value })
            }
          />

          <textarea
            className="min-h-28 rounded-2xl px-4 py-3 text-slate-950"
            placeholder="Notes ou demandes spéciales"
            value={commande.notes}
            onChange={(e) =>
              setCommande({ ...commande, notes: e.target.value })
            }
          />
        </div>

        <div className="mt-6 rounded-2xl bg-white/5 p-4">
          <p className="font-black text-amber-300">
            Résumé : {panier.length} article(s)
          </p>
          <p className="mt-2 text-2xl font-black text-white">
            Total : {total} $
          </p>
        </div>

        <button
          type="button"
          onClick={onEnvoyer}
          className="mt-6 w-full rounded-full bg-amber-400 px-8 py-4 font-black text-slate-950 hover:bg-amber-300"
        >
          Envoyer la commande
        </button>
      </div>
    </div>
  );
}
