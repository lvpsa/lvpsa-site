import React, { useEffect, useMemo, useState } from "react";
import emailjs from "@emailjs/browser";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebase";
import {
  chargerCommandesBoutique,
  modifierStatutCommandeBoutique,
  chargerInventaireBoutiqueV2,
  ajusterInventaireBoutiqueV2,
  chargerProduitsBoutique,
  annulerCommandeBoutique,
  supprimerCommandeBoutique,
  synchroniserProduitsBoutiqueSansInventaire,
  recalculerInventairePublicBoutique,
} from "../../../services/firebaseBoutique";

const STATUTS = {
  en_attente: "En attente",
  en_preparation: "En préparation",
  prete: "Prête",
  remise: "Remise",
  annulee: "Annulée",
};

export default function AdminBoutiqueV2() {
  const [onglet, setOnglet] = useState("commandes");
  const [filtreCommandes, setFiltreCommandes] = useState("actives");
  const [commandes, setCommandes] = useState([]);
  const [inventaire, setInventaire] = useState({});
  const [produits, setProduits] = useState([]);
  const [commandeActive, setCommandeActive] = useState(null);
  const [adminActuel, setAdminActuel] = useState(null);
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setAdminActuel(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const commandesActives = commandes.filter(
    (c) => !["remise", "annulee"].includes(c.statut)
  );

  const commandesRemises = commandes.filter((c) => c.statut === "remise");
  const commandesAnnulees = commandes.filter((c) => c.statut === "annulee");

  const commandesAffichees =
    filtreCommandes === "actives"
      ? commandesActives
      : filtreCommandes === "remises"
      ? commandesRemises
      : commandesAnnulees;

  const ventesTotales = useMemo(
    () =>
      commandes
        .filter((c) => c.statut !== "annulee")
        .reduce((total, c) => total + Number(c.total || 0), 0),
    [commandes]
  );

  const articlesVendus = useMemo(
    () =>
      commandes
        .filter((c) => c.statut !== "annulee")
        .reduce(
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

  const inventaireFaible = useMemo(() => {
    return Object.values(inventaire).filter((item) => {
      const qte = Number(item.quantite || 0);
      return qte > 0 && qte <= 2;
    }).length;
  }, [inventaire]);

  const ruptures = useMemo(() => {
    return Object.values(inventaire).filter(
      (item) => Number(item.quantite || 0) <= 0
    ).length;
  }, [inventaire]);

  const metaAdmin = () => ({
    userId: adminActuel?.uid || null,
    nom: adminActuel?.displayName || adminActuel?.email || "Admin LVPSA",
    email: adminActuel?.email || null,
  });

  const synchroniserBoutique = async () => {
    const confirmer = window.confirm(
      "Synchroniser les produits boutique et recalculer l'inventaire public?\n\nCette action ne réinitialise pas les quantités privées."
    );

    if (!confirmer) return;

    try {
      setChargement(true);
      await synchroniserProduitsBoutiqueSansInventaire();
      await recalculerInventairePublicBoutique();
      await charger();
      alert("Boutique synchronisée avec succès.");
    } catch (error) {
      console.error("Erreur synchronisation boutique :", error);
      alert("Erreur lors de la synchronisation de la boutique.");
    } finally {
      setChargement(false);
    }
  };

  const envoyerNotificationStatutCommande = async (commande, nouveauStatut) => {
  const courrielClient = commande.courriel || commande.email || "";

  if (!courrielClient) {
    console.warn("Aucun courriel client pour la commande :", commande.id);
    return;
  }

  const numeroCommande =
    commande.numeroCommande ||
    commande.numeroCommandeSimple ||
    commande.id;

  const statutAffichage = STATUTS[nouveauStatut] || nouveauStatut;

  const messageAction =
    nouveauStatut === "en_attente"
      ? "Votre commande a bien été reçue. Nous communiquerons avec vous lorsque la préparation avancera."
      : nouveauStatut === "en_preparation"
      ? "Votre commande est maintenant en préparation."
      : nouveauStatut === "prete"
      ? "Votre commande est prête. Nous communiquerons avec vous pour la remise."
      : nouveauStatut === "remise"
      ? "Votre commande a été remise. Merci d’avoir encouragé la boutique LVPSA!"
      : nouveauStatut === "annulee"
      ? "Votre commande a été annulée. Si vous avez des questions, vous pouvez répondre à ce courriel."
      : "Le statut de votre commande a été mis à jour.";

  const detailsArticles = (commande.articles || [])
    .map((article) => {
      const nom = article.nom || article.modele || article.categorie || "Article";
      const couleur = article.couleurNom || article.couleur || "";
      const taille = article.taille || "";
      const quantite = article.quantite || 1;

      return `• ${nom}${couleur ? ` — ${couleur}` : ""}${taille ? ` — ${taille}` : ""} — Qté ${quantite}`;
    })
    .join("\n");

  await emailjs.send(
    "service_f4h3rii",
    "template_nwl643g",
    {
      to_email: courrielClient,
      name: "LVPSA",
      email: "liguevpsa@gmail.com",

      sujet: `Mise à jour de votre commande ${numeroCommande}`,
      nom_destinataire: commande.nom || "membre LVPSA",

      message_principal:
        `Le statut de votre commande LVPSA a été mis à jour : ${statutAffichage}.`,

      details:
        `Commande : ${numeroCommande}\n` +
        `Nouveau statut : ${statutAffichage}\n` +
        `Total : ${commande.total || 0} $\n\n` +
        `Articles :\n${detailsArticles || "Aucun article détaillé"}`,

      message_action: messageAction,

      section_actions: "",
      lien_accepter: "",
      lien_refuser: "",
    },
    "ZooBSx9i6qVl5HI8T"
  );
};
  
  const changerStatut = async (commande, statut) => {
  if (!commande?.id) return;

  if (commande.statut === statut) {
    return;
  }

  try {
    if (statut === "annulee" && !commande.inventaireRemis) {
      const confirmer = window.confirm(
        "Annuler cette commande et remettre les articles en inventaire?"
      );

      if (!confirmer) return;

      await annulerCommandeBoutique(commande.id, commande.articles || [], metaAdmin());

      try {
        await envoyerNotificationStatutCommande(commande, statut);
      } catch (emailError) {
        console.error("Erreur notification client :", emailError);
        alert(
          "La commande a été annulée, mais le courriel de notification n’a pas pu être envoyé."
        );
      }

      await charger();
      setCommandeActive(null);
      return;
    }

    await modifierStatutCommandeBoutique(commande.id, statut, metaAdmin());

    try {
      await envoyerNotificationStatutCommande(commande, statut);
    } catch (emailError) {
      console.error("Erreur notification client :", emailError);
      alert(
        "Le statut a été modifié, mais le courriel de notification n’a pas pu être envoyé."
      );
    }

    await charger();

    setCommandeActive((prev) =>
      prev?.id === commande.id ? { ...prev, statut } : prev
    );
  } catch (error) {
    console.error("Erreur changement statut commande :", error);
    alert("Erreur lors de la modification du statut de la commande.");
  }
};

  const supprimerCommandeDefinitivement = async (commande) => {
    if (commande.statut !== "annulee") {
      alert("Seules les commandes annulées peuvent être supprimées définitivement.");
      return;
    }

    const numero =
      commande.numeroCommande ||
      commande.numeroCommandeSimple ||
      commande.id;

    const confirmer = window.confirm(
      `Supprimer définitivement la commande ${numero}?

Cette action est irréversible.`
    );

    if (!confirmer) return;

    try {
      await supprimerCommandeBoutique(commande.id, metaAdmin());

      setCommandes((prev) =>
        prev.filter((item) => item.id !== commande.id)
      );

      setCommandeActive((prev) =>
        prev?.id === commande.id ? null : prev
      );

      alert("Commande supprimée définitivement.");
    } catch (error) {
      console.error("Erreur suppression commande :", error);
      alert("Erreur lors de la suppression de la commande.");
    }
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
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-bold uppercase tracking-wider text-amber-300">
            Administration
          </p>

          <h2 className="mt-2 text-4xl font-black text-white">
            Boutique LVPSA
          </h2>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={synchroniserBoutique}
            className="rounded-full bg-amber-400 px-6 py-3 font-black text-slate-950 hover:bg-amber-300"
          >
            Synchroniser boutique
          </button>

          <button
            type="button"
            onClick={charger}
            className="rounded-full border border-white/15 px-6 py-3 font-black text-white hover:border-amber-300 hover:text-amber-300"
          >
            Rafraîchir
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-5">
        <StatCard titre="Commandes actives" valeur={commandesActives.length} />
        <StatCard titre="Articles vendus" valeur={articlesVendus} />
        <StatCard titre="Ventes totales" valeur={`${ventesTotales} $`} />
        <StatCard titre="Inventaire faible" valeur={inventaireFaible} />
        <StatCard titre="Ruptures" valeur={ruptures} />
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
        <div className="mt-8">
          <div className="flex flex-wrap gap-3">
            {[
              ["actives", `Actives (${commandesActives.length})`],
              ["remises", `Remises (${commandesRemises.length})`],
              ["annulees", `Annulées (${commandesAnnulees.length})`],
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setFiltreCommandes(id)}
                className={`rounded-full px-5 py-2 text-sm font-black ${
                  filtreCommandes === id
                    ? "bg-white text-slate-950"
                    : "border border-white/15 text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mt-6 grid gap-5 xl:grid-cols-2">
            {commandesAffichees.length === 0 ? (
              <p className="text-slate-400">Aucune commande à afficher.</p>
            ) : (
              commandesAffichees.map((commande) => (
                <div
                  key={commande.id}
                  className="rounded-2xl border border-white/10 bg-black/20 p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xl font-black text-amber-300">
                        {commande.nom}
                      </p>

                      <p className="mt-1 text-sm text-slate-300">
                        {commande.courriel}
                      </p>

                      <p className="text-sm text-slate-300">
                        {commande.telephone}
                      </p>

                      <p className="mt-2 text-xs text-slate-500">
                        Commande : {commande.numeroCommande || commande.id}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-black text-white">
                        {commande.total} $
                      </p>

                      <p className="mt-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-slate-200">
                        {STATUTS[commande.statut] || "En attente"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-1 text-sm text-slate-300">
                    {(commande.articles || []).slice(0, 3).map((article, index) => (
                      <p key={index}>
                        • {article.nom} — {article.couleurNom} — {article.taille} —
                        Qté {article.quantite}
                      </p>
                    ))}

                    {(commande.articles || []).length > 3 && (
                      <p className="text-slate-500">
                        + {(commande.articles || []).length - 3} autre(s) article(s)
                      </p>
                    )}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => setCommandeActive(commande)}
                      className="rounded-full bg-amber-400 px-5 py-2 font-black text-slate-950 hover:bg-amber-300"
                    >
                      Voir détails
                    </button>

                    <select
                      value={commande.statut || "en_attente"}
                      onChange={(e) => changerStatut(commande, e.target.value)}
                      className="rounded-full px-5 py-2 font-bold text-slate-950"
                    >
                      <option value="en_attente">En attente</option>
                      <option value="en_preparation">En préparation</option>
                      <option value="prete">Prête</option>
                      <option value="remise">Remise</option>
                      <option value="annulee">Annulée</option>
                    </select>

                    {filtreCommandes === "annulees" && (
                      <button
                        type="button"
                        onClick={() => supprimerCommandeDefinitivement(commande)}
                        className="rounded-full border border-red-400 px-5 py-2 font-black text-red-300 hover:bg-red-400 hover:text-slate-950"
                      >
                        Supprimer définitivement
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
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
                        const quantite = Number(inventaire[cle]?.quantite || 0);

                        return (
                          <div
                            key={cle}
                            className={`rounded-xl border p-4 ${
                              quantite <= 0
                                ? "border-red-400/30 bg-red-400/10"
                                : quantite <= 2
                                ? "border-yellow-400/30 bg-yellow-400/10"
                                : "border-white/10 bg-white/5"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <p className="font-black text-white">{taille}</p>

                              <p
                                className={`text-xs font-black ${
                                  quantite <= 0
                                    ? "text-red-300"
                                    : quantite <= 2
                                    ? "text-yellow-300"
                                    : "text-emerald-300"
                                }`}
                              >
                                {quantite <= 0
                                  ? "Rupture"
                                  : quantite <= 2
                                  ? "Faible"
                                  : "OK"}
                              </p>
                            </div>

                            <div className="mt-3 flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() =>
                                  ajusterStock(produit.id, couleur.id, taille, -1)
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
                                  ajusterStock(produit.id, couleur.id, taille, 1)
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

      {commandeActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] border border-white/10 bg-slate-950 p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-amber-300">
                  Détail de commande
                </p>

                <h3 className="mt-2 text-3xl font-black text-white">
                  {commandeActive.nom}
                </h3>

                <p className="mt-2 text-slate-300">
                  {commandeActive.courriel} · {commandeActive.telephone}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Commande : {commandeActive.numeroCommande || commandeActive.id}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setCommandeActive(null)}
                className="rounded-full border border-white/10 px-4 py-2 text-sm"
              >
                Fermer
              </button>
            </div>

            <div className="mt-6 space-y-3">
              {(commandeActive.articles || []).map((article, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <p className="font-black text-amber-300">{article.nom}</p>

                  <p className="mt-1 text-sm text-slate-300">
                    Couleur : {article.couleurNom} · Grandeur : {article.taille} ·
                    Quantité : {article.quantite}
                  </p>

                  <p className="mt-1 text-sm font-bold text-white">
                    Total article :{" "}
                    {Number(article.prix) * Number(article.quantite)} $
                  </p>
                </div>
              ))}
            </div>

            {commandeActive.notes && (
              <div className="mt-6 rounded-2xl bg-white/5 p-4">
                <p className="font-bold text-amber-300">Notes</p>
                <p className="mt-2 text-slate-300">{commandeActive.notes}</p>
              </div>
            )}

            <div className="mt-6 rounded-2xl bg-amber-400 p-5 text-slate-950">
              <div className="flex items-center justify-between">
                <p className="text-xl font-black">Total</p>
                <p className="text-3xl font-black">{commandeActive.total} $</p>
              </div>
            </div>

            <div className="mt-6">
              <label className="text-sm font-bold text-slate-300">
                Changer le statut
              </label>

              <select
                value={commandeActive.statut || "en_attente"}
                onChange={(e) => changerStatut(commandeActive, e.target.value)}
                className="mt-2 w-full rounded-2xl px-4 py-3 text-slate-950"
              >
                <option value="en_attente">En attente</option>
                <option value="en_preparation">En préparation</option>
                <option value="prete">Prête</option>
                <option value="remise">Remise</option>
                <option value="annulee">Annulée</option>
              </select>

              {commandeActive.statut === "annulee" && (
                <button
                  type="button"
                  onClick={() => supprimerCommandeDefinitivement(commandeActive)}
                  className="mt-4 w-full rounded-2xl border border-red-400 px-5 py-3 font-black text-red-300 hover:bg-red-400 hover:text-slate-950"
                >
                  Supprimer définitivement cette commande
                </button>
              )}
            </div>
          </div>
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
