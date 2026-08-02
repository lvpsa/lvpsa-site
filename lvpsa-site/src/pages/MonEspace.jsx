import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import {
  ArrowRight,
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  PackageCheck,
  Repeat2,
  ShoppingBag,
  Trophy,
  UsersRound,
} from "lucide-react";

import { auth, db } from "../firebase";
import { formatTelephone } from "../utils/telephone";
import DashboardHeader from "../components/mon-espace/DashboardHeader";
import CarteProfil from "../components/mon-espace/CarteProfil";

const normaliserTexteGlobal = (valeur) =>
  String(valeur || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const normaliserCategorieGlobal = (valeur) => {
  const texte = normaliserTexteGlobal(valeur).replace(/\s+/g, "-");
  if (texte.includes("recreatif")) return "recreatif";
  if (texte.includes("competitif")) return "competitif";
  if (texte.includes("deux")) return "les-deux";
  return texte;
};

const nomEquipeGlobal = (equipe) =>
  equipe?.nom ||
  equipe?.nomEquipe ||
  equipe?.equipeNom ||
  equipe?.equipenom ||
  equipe?.equipe ||
  "";

async function chargerEquipesLVPSA() {
  const [teamsSnap, equipesSnap] = await Promise.all([
    getDocs(collection(db, "Teams")),
    getDocs(collection(db, "Equipes")),
  ]);

  const toutes = [
    ...teamsSnap.docs.map((docItem) => ({
      id: docItem.id,
      sourceCollection: "Teams",
      ...docItem.data(),
    })),
    ...equipesSnap.docs.map((docItem) => ({
      id: docItem.id,
      sourceCollection: "Equipes",
      ...docItem.data(),
    })),
  ];

  const uniques = new Map();
  toutes.forEach((equipe) => {
    const cle = equipe.id || normaliserTexteGlobal(nomEquipeGlobal(equipe));
    if (!uniques.has(cle)) uniques.set(cle, equipe);
  });
  return Array.from(uniques.values());
}

const URL_CLASSEMENT_RECREATIF =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQgd0CSVXzpiJknzlFzR3ePmhD33lTUh2GDmEv7-XTpXA9rWz_X4Cl7QverC1jzsOEwvyvBHIMALhEm/pub?gid=1356137713&single=true&output=csv";

const URL_CLASSEMENT_COMPETITIF =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQgd0CSVXzpiJknzlFzR3ePmhD33lTUh2GDmEv7-XTpXA9rWz_X4Cl7QverC1jzsOEwvyvBHIMALhEm/pub?gid=1226338215&single=true&output=csv";

async function chargerClassementCSV(url) {
  const reponse = await fetch(url);

  if (!reponse.ok) {
    throw new Error(`Erreur de chargement du classement : ${reponse.status}`);
  }

  const csv = await reponse.text();

  const lignes = csv
    .trim()
    .split(/\r?\n/)
    .map((ligne) =>
      ligne
        .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
        .map((cellule) =>
          cellule.replace(/^"|"$/g, "").trim()
        )
    );

  return lignes
    .slice(1)
    .filter((ligne) => ligne[0] && ligne[1])
    .map((ligne) => ({
      rang: ligne[0],
      equipe: ligne[1],
      pj: ligne[2],
      sg: ligne[3],
      sp: ligne[4],
      pp: ligne[5],
      pc: ligne[6],
      differentiel: ligne[7],
      points: ligne[8],
    }));
}

export default function MonEspace() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [chargement, setChargement] = useState(true);

  const [equipeActuelle, setEquipeActuelle] = useState(null);
  const [demandesRecues, setDemandesRecues] = useState([]);
  const [demandesEnvoyees, setDemandesEnvoyees] = useState([]);
  const [commandes, setCommandes] = useState([]);
  const [afficherToutesCommandes, setAfficherToutesCommandes] = useState(false);

  const [classementEquipe, setClassementEquipe] = useState(null);
  const [classementChargement, setClassementChargement] = useState(false);
  const [erreurClassement, setErreurClassement] = useState("");

  const [editionProfil, setEditionProfil] = useState(false);
  const [profilForm, setProfilForm] = useState({
    nom: "",
    telephone: "",
  });
  const [messageProfil, setMessageProfil] = useState("");

  const horairesLigue = [
    {
      id: "2026-07-13",
      label: "13 juillet",
      categorie: "recreatif",
      matchs: [
        "18h30 à 19h15 — Les Smash vs Les Artishow",
        "19h15 à 20h00 — Les Bronzés vs Les Artishow",
        "20h00 à 20h45 — Les As vs Les Smash",
        "20h45 à 21h30 — Les As vs Les Bronzés",
      ],
    },
    {
      id: "2026-07-14",
      label: "14 juillet",
      categorie: "competitif",
      matchs: [
        "18h30 à 19h15 — Les pieds dans le sable vs Choix du Président",
        "19h15 à 20h00 — Fireballs vs Choix du Président",
        "20h00 à 20h45 — Crabe en Bikini vs Les pieds dans le sable",
        "20h45 à 21h30 — Crabe en Bikini vs Fireballs",
      ],
    },
    {
      id: "2026-08-03",
      label: "3 août",
      categorie: "recreatif",
      matchs: [
        "18h30 à 19h15 — Les As vs Les Artishow",
        "19h15 à 20h00 — Les As vs Les Bronzés",
        "20h00 à 20h45 — Les Smash vs Les Artishow",
        "20h45 à 21h30 — Les Bronzés vs Les Smash",
      ],
    },
    {
      id: "2026-08-04",
      label: "4 août",
      categorie: "competitif",
      matchs: [
        "18h30 à 19h15 — Crabe en Bikini vs Choix du Président",
        "19h15 à 20h00 — Crabe en Bikini vs Fireballs",
        "20h00 à 20h45 — Les pieds dans le sable vs Choix du Président",
        "20h45 à 21h30 — Fireballs vs Les pieds dans le sable",
      ],
    },
    {
      id: "2026-08-10",
      label: "10 août",
      categorie: "recreatif",
      matchs: [
        "18h30 à 19h15 — Les Bronzés vs Les Artishow",
        "19h15 à 20h00 — Les As vs Les Artishow",
        "20h00 à 20h45 — Les Bronzés vs Les Smash",
        "20h45 à 21h30 — Les As vs Les Smash",
      ],
    },
    {
      id: "2026-08-11",
      label: "11 août",
      categorie: "competitif",
      matchs: [
        "18h30 à 19h15 — Fireballs vs Choix du Président",
        "19h15 à 20h00 — Crabe en Bikini vs Choix du Président",
        "20h00 à 20h45 — Fireballs vs Les pieds dans le sable",
        "20h45 à 21h30 — Crabe en Bikini vs Les pieds dans le sable",
      ],
    },
    {
      id: "2026-08-17",
      label: "17 août",
      categorie: "recreatif",
      matchs: [
        "18h30 à 19h15 — Les As vs Les Smash",
        "19h15 à 20h00 — Les Smash vs Les Artishow",
        "20h00 à 20h45 — Les As vs Les Bronzés",
        "20h45 à 21h30 — Les Bronzés vs Les Artishow",
      ],
    },
    {
      id: "2026-08-18",
      label: "18 août",
      categorie: "competitif",
      matchs: [
        "18h30 à 19h15 — Crabe en Bikini vs Les pieds dans le sable",
        "19h15 à 20h00 — Les pieds dans le sable vs Choix du Président",
        "20h00 à 20h45 — Crabe en Bikini vs Fireballs",
        "20h45 à 21h30 — Fireballs vs Choix du Président",
      ],
    },
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        setUserData(null);
        setEquipeActuelle(null);
        setDemandesRecues([]);
        setDemandesEnvoyees([]);
        setCommandes([]);
        setChargement(false);
        return;
      }

      try {
        const userSnap = await getDoc(doc(db, "users", currentUser.uid));

        if (!userSnap.exists()) {
          setUserData(null);
          setChargement(false);
          return;
        }

        const data = {
          id: currentUser.uid,
          ...userSnap.data(),
        };

        setUserData(data);
        setProfilForm({
          nom: data.nom || "",
          telephone: formatTelephone(data.telephone) || "",
        });

        const role = data.role || "membre";
        const equipeId = String(data.equipeId || data.idEquipe || "").trim();
        const estDansEquipe =
          equipeId && normaliserTexteGlobal(equipeId) !== "independant";
        const estCapitaine = role === "capitaine" || data.isAdmin === true;
        const estRemplacant =
          role === "remplacant" || data.estRemplacant === true;

        if (estDansEquipe) {
          try {
            const equipesChargees = await chargerEquipesLVPSA();

            const equipeTrouvee =
              equipesChargees.find((equipe) => {
                const idEquipe = equipe.id || equipe.equipeId || "";
                const nomEquipe = nomEquipeGlobal(equipe);

                return (
                  (data.equipeId && idEquipe === data.equipeId) ||
                  (data.equipeNom &&
                    normaliserTexteGlobal(nomEquipe) ===
                      normaliserTexteGlobal(data.equipeNom)) ||
                  (data.equipenom &&
                    normaliserTexteGlobal(nomEquipe) ===
                      normaliserTexteGlobal(data.equipenom))
                );
              }) || null;

            setEquipeActuelle(equipeTrouvee);
          } catch (error) {
            console.warn(
              "Impossible de charger l'équipe dans Mon espace.",
              error
            );
            setEquipeActuelle(null);
          }
        } else {
          setEquipeActuelle(null);
        }

        if (estRemplacant || estCapitaine) {
          try {
            const demandesSnap = await getDocs(
              collection(db, "demandesRemplacements")
            );
            const emailUser = normaliserTexteGlobal(currentUser.email);

            const toutesDemandes = demandesSnap.docs.map((docItem) => ({
              id: docItem.id,
              ...docItem.data(),
            }));

            setDemandesRecues(
              estRemplacant
                ? toutesDemandes
                    .filter((demande) => {
                      const emailDemande = normaliserTexteGlobal(
                        demande.remplacantEmail
                      );

                      return (
                        demande.remplacantId === currentUser.uid ||
                        emailDemande === emailUser
                      );
                    })
                    .sort(
                      (a, b) =>
                        (b.createdAt?.seconds || 0) -
                        (a.createdAt?.seconds || 0)
                    )
                : []
            );

            setDemandesEnvoyees(
              estCapitaine
                ? toutesDemandes
                    .filter(
                      (demande) => demande.capitaineId === currentUser.uid
                    )
                    .sort(
                      (a, b) =>
                        (b.createdAt?.seconds || 0) -
                        (a.createdAt?.seconds || 0)
                    )
                : []
            );
          } catch (error) {
            console.warn(
              "Demandes de remplacement non disponibles dans Mon espace.",
              error
            );
            setDemandesRecues([]);
            setDemandesEnvoyees([]);
          }
        } else {
          setDemandesRecues([]);
          setDemandesEnvoyees([]);
        }

        try {
          const commandesSnap = await getDocs(
            collection(db, "commandesBoutique")
          );
          const emailUser = normaliserTexteGlobal(currentUser.email);

          setCommandes(
            commandesSnap.docs
              .map((docItem) => ({
                id: docItem.id,
                ...docItem.data(),
              }))
              .filter((commande) => {
                const emailCommande = normaliserTexteGlobal(
                  commande.courriel || commande.email
                );

                return (
                  commande.userId === currentUser.uid ||
                  emailCommande === emailUser
                );
              })
              .sort(
                (a, b) =>
                  (b.createdAt?.seconds || 0) -
                  (a.createdAt?.seconds || 0)
              )
          );
        } catch (error) {
          console.warn(
            "Commandes boutique non disponibles pour cet utilisateur.",
            error
          );
          setCommandes([]);
        }
      } catch (error) {
        console.error("Erreur Mon espace :", error);
      } finally {
        setChargement(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const chargerClassementEquipe = async () => {
      const categorie = normaliserCategorieGlobal(
        userData?.categorie ||
          equipeActuelle?.categorie ||
          equipeActuelle?.catégorie
      );

      const nomEquipe =
        userData?.equipeNom ||
        userData?.equipenom ||
        nomEquipeGlobal(equipeActuelle) ||
        "";

      if (!categorie || !nomEquipe) {
        setClassementEquipe(null);
        setErreurClassement("");
        return;
      }

      const url =
        categorie === "recreatif"
          ? URL_CLASSEMENT_RECREATIF
          : categorie === "competitif"
          ? URL_CLASSEMENT_COMPETITIF
          : "";

      if (!url) {
        setClassementEquipe(null);
        return;
      }

      setClassementChargement(true);
      setErreurClassement("");

      try {
        const classement = await chargerClassementCSV(url);
        const equipeTrouvee =
          classement.find(
            (ligne) =>
              normaliserTexteGlobal(ligne.equipe) ===
              normaliserTexteGlobal(nomEquipe)
          ) || null;

        setClassementEquipe(equipeTrouvee);
      } catch (error) {
        console.error("Erreur classement Mon espace :", error);
        setClassementEquipe(null);
        setErreurClassement(
          "Le classement est temporairement indisponible."
        );
      } finally {
        setClassementChargement(false);
      }
    };

    chargerClassementEquipe();
  }, [userData, equipeActuelle]);

  if (chargement) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center bg-slate-950 px-6 text-white">
        <div className="text-center">
          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-white/10 border-t-cyan-300" />
          <p className="mt-6 text-lg font-black">Chargement de ton espace</p>
          <p className="mt-2 text-sm text-slate-400">
            Nous récupérons ton équipe, tes matchs et tes commandes.
          </p>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="relative flex min-h-[75vh] items-center justify-center overflow-hidden bg-slate-950 px-5 py-32 text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[url('/hero-lvpsa.jpg')] bg-cover bg-center opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/90 to-slate-950" />

        <div className="relative max-w-2xl rounded-[2rem] border border-white/10 bg-slate-950/70 p-8 text-center shadow-2xl backdrop-blur-xl sm:p-12">
          <div className="mx-auto h-20 w-20 overflow-hidden rounded-full border border-white/15">
            <img
              src="/logo.jpg"
              alt="Logo LVPSA"
              className="h-full w-full object-cover"
            />
          </div>

          <p className="mt-6 text-sm font-black uppercase tracking-[0.2em] text-cyan-300">
            Espace membre
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            Connexion requise
          </h1>
          <p className="mx-auto mt-5 max-w-lg leading-7 text-slate-300">
            Connecte-toi pour consulter ton équipe, ton prochain match, tes
            demandes de remplacement et tes commandes.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/connexion"
              className="rounded-2xl bg-cyan-300 px-7 py-4 font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-200"
            >
              Se connecter
            </Link>
            <Link
              to="/creer-compte"
              className="rounded-2xl border border-white/15 bg-white/5 px-7 py-4 font-black text-white transition hover:bg-white/10"
            >
              Créer un compte
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const role = userData?.role || "membre";
  const equipeId = String(userData?.equipeId || userData?.idEquipe || "").trim();

  const estAdmin = userData?.isAdmin === true;
  const estRemplacant =
    role === "remplacant" || userData?.estRemplacant === true;
  const estCapitaine = role === "capitaine" || estAdmin;
  const estDansEquipe =
    equipeId && normaliserTexteGlobal(equipeId) !== "independant";
  const estJoueur = !estCapitaine && estDansEquipe && !estRemplacant;
  const estMembre =
    !estAdmin && !estCapitaine && !estJoueur && !estRemplacant;

  const roleAffichage = estAdmin
    ? "Administrateur"
    : estCapitaine
    ? "Capitaine"
    : estJoueur
    ? "Joueur"
    : estRemplacant
    ? "Remplaçant"
    : "Membre";

  const categorieActive = normaliserCategorieGlobal(
    userData?.categorie ||
      equipeActuelle?.categorie ||
      equipeActuelle?.catégorie
  );

  const nomEquipeActuelle =
    userData?.equipeNom ||
    userData?.equipenom ||
    nomEquipeGlobal(equipeActuelle) ||
    "";

  const aujourdHui = new Date();
  aujourdHui.setHours(0, 0, 0, 0);

  const prochainMatchEquipe = (() => {
    if (!nomEquipeActuelle) return null;

    for (const journee of horairesLigue) {
      const dateMatch = new Date(`${journee.id}T00:00:00`);

      if (dateMatch < aujourdHui) continue;
      if (categorieActive && journee.categorie !== categorieActive) continue;

      const matchTrouve = journee.matchs.find((match) =>
        normaliserTexteGlobal(match).includes(
          normaliserTexteGlobal(nomEquipeActuelle)
        )
      );

      if (!matchTrouve) continue;

      const [heure = "", confrontation = ""] = matchTrouve.split(" — ");
      const equipes = confrontation.split(" vs ");
      const adversaire =
        equipes.find(
          (equipe) =>
            normaliserTexteGlobal(equipe) !==
            normaliserTexteGlobal(nomEquipeActuelle)
        ) || "Adversaire à confirmer";

      return {
        ...journee,
        date: dateMatch,
        heure,
        confrontation,
        adversaire,
        matchComplet: matchTrouve,
      };
    }

    return null;
  })();

  const demandesRecuesEnAttente = demandesRecues.filter(
    (demande) => demande.statut === "en_attente"
  );
  const demandesEnvoyeesEnAttente = demandesEnvoyees.filter(
    (demande) => demande.statut === "en_attente"
  );

  const libelleStatut = (statut) => {
    if (statut === "accepte") return "Confirmé";
    if (statut === "refuse") return "Refusé";
    if (statut === "en_attente") return "En attente";
    return statut || "En attente";
  };

  const couleurStatut = (statut) => {
    if (statut === "accepte") return "bg-emerald-400/15 text-emerald-300";
    if (statut === "refuse") return "bg-red-400/15 text-red-300";
    return "bg-amber-400/15 text-amber-300";
  };

  const statutCommande = (commande) =>
    String(commande.statut || commande.status || commande.etat || "Reçue");

  const totalCommandeBoutique = (commande) =>
    Number(
      commande.total || commande.totalCommande || commande.montantTotal || 0
    ) || 0;

  const articlesCommande = (commande) => {
    if (Array.isArray(commande.articles)) return commande.articles;
    if (Array.isArray(commande.items)) return commande.items;
    return [];
  };

  const numeroCommande = (commande) =>
    commande.numeroCommande ||
    commande.numeroCommandeSimple ||
    commande.noCommande ||
    commande.id;

  const sauvegarderProfil = async () => {
    if (!user) return;

    if (!profilForm.nom.trim()) {
      setMessageProfil("Le nom ne peut pas être vide.");
      return;
    }

    try {
      const updates = {
        nom: profilForm.nom.trim(),
        telephone: formatTelephone(profilForm.telephone),
        updatedAt: serverTimestamp(),
      };

      await updateDoc(doc(db, "users", user.uid), updates);
      setUserData((prev) => ({ ...prev, ...updates }));
      setEditionProfil(false);
      setMessageProfil("Profil mis à jour.");
    } catch (error) {
      console.error("Erreur mise à jour profil :", error);
      setMessageProfil("Erreur lors de la mise à jour du profil.");
    }
  };

  const prenom = userData?.nom?.split(" ")[0] || "membre";
  const dateProchainMatch = prochainMatchEquipe
    ? prochainMatchEquipe.date.toLocaleDateString("fr-CA", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : null;

  const nombreDemandesActives = estRemplacant
    ? demandesRecuesEnAttente.length
    : estCapitaine
    ? demandesEnvoyeesEnAttente.length
    : 0;

  const commandesPretes = commandes.filter((commande) => {
    const statut = normaliserTexteGlobal(statutCommande(commande));

    return (
      statut.includes("prete") ||
      statut.includes("cueillette") ||
      statut.includes("terminee")
    );
  });

  const demandesAcceptees = [...demandesRecues, ...demandesEnvoyees].filter(
    (demande) => demande.statut === "accepte"
  );

  const notifications = [
    ...commandesPretes.slice(0, 2).map((commande) => ({
      id: `commande-${commande.id}`,
      titre: `Commande ${numeroCommande(commande)}`,
      texte: "Ta commande semble prête ou terminée.",
      type: "commande",
      lien: "#mes-commandes",
    })),
    ...demandesAcceptees.slice(0, 2).map((demande) => ({
      id: `demande-${demande.id}`,
      titre: "Remplacement confirmé",
      texte:
        demande.remplacantNom ||
        demande.equipeNom ||
        "Une demande de remplacement a été acceptée.",
      type: "remplacement",
      lien: estCapitaine ? "/gestion-equipe" : "/remplacants",
    })),
    ...(nombreDemandesActives > 0
      ? [
          {
            id: "demandes-actives",
            titre: "Demandes en attente",
            texte: `${nombreDemandesActives} demande${
              nombreDemandesActives > 1 ? "s" : ""
            } à consulter.`,
            type: "attente",
            lien: estCapitaine ? "/gestion-equipe" : "/remplacants",
          },
        ]
      : []),
  ].slice(0, 4);

  const demandesAffichees = estRemplacant
    ? demandesRecues
    : estCapitaine
    ? demandesEnvoyees
    : [];

  const titreDemandes = estRemplacant
    ? "Mes demandes reçues"
    : "Demandes envoyées";

  const sousTitreDemandes = estRemplacant
    ? "Demandes envoyées par les capitaines."
    : "Suivi de tes demandes de remplacement.";

  const lienDemandes = estCapitaine ? "/gestion-equipe" : "/remplacants";

  const commandesAAfficher = afficherToutesCommandes
    ? commandes
    : commandes.slice(0, 3);

  return (
    <section className="min-h-screen bg-slate-950 px-5 pb-20 pt-28 text-white lg:px-8">
      <div className="mx-auto max-w-7xl">
        <DashboardHeader
          prenom={prenom}
          roleAffichage={roleAffichage}
          nomEquipe={nomEquipeActuelle}
          categorieActive={categorieActive}
        />

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.55fr_0.85fr]">
          <section className="overflow-hidden rounded-3xl border border-cyan-300/20 bg-gradient-to-br from-cyan-400/15 via-slate-900 to-slate-950 p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 text-cyan-300">
                  <UsersRound className="h-6 w-6" />
                  <p className="text-sm font-black uppercase tracking-[0.18em]">
                    Mon équipe
                  </p>
                </div>

                <h2 className="mt-3 text-3xl font-black sm:text-4xl">
                  {nomEquipeActuelle || "Aucune équipe associée"}
                </h2>

                {categorieActive && (
                  <p className="mt-2 font-bold capitalize text-slate-400">
                    Catégorie {categorieActive}
                  </p>
                )}
              </div>

              {estCapitaine && (
                <Link
                  to="/gestion-equipe"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-black text-white transition hover:border-cyan-300/40 hover:text-cyan-300"
                >
                  Gérer mon équipe
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>

            {estDansEquipe ? (
              <div className="mt-7 grid gap-5 md:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-black/20 p-5 sm:p-6">
                  <div className="flex items-center gap-3 text-cyan-300">
                    <CalendarDays className="h-5 w-5" />
                    <p className="text-sm font-black uppercase tracking-[0.15em]">
                      Prochain match
                    </p>
                  </div>

                  {prochainMatchEquipe ? (
                    <>
                      <p className="mt-5 text-sm font-bold capitalize text-slate-400">
                        {dateProchainMatch}
                      </p>
                      <p className="mt-1 text-4xl font-black text-white">
                        {prochainMatchEquipe.heure}
                      </p>
                      <p className="mt-4 text-sm text-slate-400">
                        Adversaire
                      </p>
                      <p className="mt-1 text-xl font-black text-white">
                        {prochainMatchEquipe.adversaire}
                      </p>
                      <div className="mt-5 flex items-start gap-2 text-sm text-slate-400">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                        Parc Portneuf, Saint-Augustin-de-Desmaures
                      </div>
                    </>
                  ) : (
                    <div className="mt-5 rounded-2xl bg-white/5 p-4">
                      <p className="font-black text-white">
                        Aucun match à venir
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        Aucun prochain match n’a été trouvé pour ton équipe.
                      </p>
                    </div>
                  )}

                  <Link
                    to="/calendrier"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-black text-cyan-300"
                  >
                    Voir le calendrier
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="rounded-3xl border border-yellow-300/20 bg-yellow-300/10 p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-black uppercase tracking-[0.15em] text-yellow-300">
                      Classement
                    </p>
                    <Trophy className="h-6 w-6 text-yellow-300" />
                  </div>

                  {classementChargement ? (
                    <div className="mt-6">
                      <div className="h-12 w-24 animate-pulse rounded-xl bg-white/10" />
                      <div className="mt-4 h-4 w-40 animate-pulse rounded bg-white/10" />
                    </div>
                  ) : classementEquipe ? (
                    <>
                      <div className="mt-6 flex items-end gap-3">
                        <p className="text-5xl font-black text-white">
                          {classementEquipe.rang}
                          <span className="text-2xl text-yellow-300">
                            {classementEquipe.rang === "1" ? "er" : "e"}
                          </span>
                        </p>
                        <p className="pb-1 text-sm font-bold text-slate-400">
                          au classement
                        </p>
                      </div>

                      <div className="mt-6 grid grid-cols-3 gap-3">
                        <div className="rounded-2xl bg-black/20 p-3 text-center">
                          <p className="text-xl font-black text-white">
                            {classementEquipe.pj}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            Parties
                          </p>
                        </div>
                        <div className="rounded-2xl bg-black/20 p-3 text-center">
                          <p className="text-xl font-black text-white">
                            {classementEquipe.sg}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            Sets gagnés
                          </p>
                        </div>
                        <div className="rounded-2xl bg-black/20 p-3 text-center">
                          <p className="text-xl font-black text-yellow-300">
                            {classementEquipe.points}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">Points</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="mt-6 rounded-2xl bg-black/20 p-4">
                      <p className="text-sm leading-6 text-slate-400">
                        {erreurClassement ||
                          "Ton équipe n’a pas été trouvée dans le classement actuel."}
                      </p>
                    </div>
                  )}

                  <Link
                    to={
                      categorieActive === "recreatif"
                        ? "/classements/recreatif"
                        : "/classements/competitif"
                    }
                    className="mt-5 inline-flex items-center gap-2 text-sm font-black text-cyan-300"
                  >
                    Voir le classement complet
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="mt-7 rounded-3xl border border-white/10 bg-black/20 p-6">
                <p className="text-lg font-black text-white">
                  Ton compte n’est associé à aucune équipe.
                </p>
                <p className="mt-2 max-w-2xl leading-7 text-slate-400">
                  Tu peux devenir joueur indépendant afin d’être disponible
                  comme remplaçant.
                </p>
                <Link
                  to="/inscription-ligue"
                  className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-cyan-300 px-5 py-3 font-black text-slate-950 transition hover:bg-cyan-200"
                >
                  Devenir remplaçant
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </section>

          <div className="space-y-6">
            <CarteProfil
              user={user}
              userData={userData}
              editionProfil={editionProfil}
              setEditionProfil={setEditionProfil}
              profilForm={profilForm}
              setProfilForm={setProfilForm}
              messageProfil={messageProfil}
              setMessageProfil={setMessageProfil}
              sauvegarderProfil={sauvegarderProfil}
              formatTelephone={formatTelephone}
              roleAffichage={roleAffichage}
            />

            <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-cyan-300">
                  <Bell className="h-5 w-5" />
                  <p className="text-sm font-black uppercase tracking-[0.15em]">
                    À surveiller
                  </p>
                </div>

                {notifications.length > 0 && (
                  <span className="rounded-full bg-cyan-300 px-3 py-1 text-xs font-black text-slate-950">
                    {notifications.length}
                  </span>
                )}
              </div>

              <div className="mt-5 space-y-3">
                {notifications.length > 0 ? (
                  notifications.map((notification) => {
                    const Icone =
                      notification.type === "commande"
                        ? PackageCheck
                        : notification.type === "remplacement"
                        ? Repeat2
                        : Clock3;

                    const contenu = (
                      <>
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-300">
                          <Icone className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-black text-white">
                            {notification.titre}
                          </p>
                          <p className="mt-1 text-sm leading-5 text-slate-400">
                            {notification.texte}
                          </p>
                        </div>
                      </>
                    );

                    const classes =
                      "flex items-start gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-cyan-300/30";

                    return notification.lien.startsWith("#") ? (
                      <a
                        key={notification.id}
                        href={notification.lien}
                        className={classes}
                      >
                        {contenu}
                      </a>
                    ) : (
                      <Link
                        key={notification.id}
                        to={notification.lien}
                        className={classes}
                      >
                        {contenu}
                      </Link>
                    );
                  })
                ) : (
                  <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                      <div>
                        <p className="font-black text-white">Tout est à jour</p>
                        <p className="mt-1 text-sm text-slate-400">
                          Aucune action urgente pour le moment.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>

        {(estRemplacant || estCapitaine) && (
          <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 text-amber-300">
                  <Repeat2 className="h-6 w-6" />
                  <p className="text-sm font-black uppercase tracking-[0.18em]">
                    Remplacements
                  </p>
                </div>
                <h2 className="mt-3 text-3xl font-black">{titreDemandes}</h2>
                <p className="mt-2 text-slate-400">{sousTitreDemandes}</p>
              </div>

              <Link
                to={lienDemandes}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/15 px-5 py-3 font-black text-white transition hover:border-amber-300 hover:text-amber-300"
              >
                Voir tout
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {demandesAffichees.slice(0, 3).length > 0 ? (
                demandesAffichees.slice(0, 3).map((demande) => (
                  <div
                    key={demande.id}
                    className="rounded-2xl border border-white/10 bg-black/20 p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-black text-white">
                          {estRemplacant
                            ? demande.equipeNom || "Équipe non précisée"
                            : demande.remplacantNom ||
                              "Remplaçant non précisé"}
                        </h3>
                        <p className="mt-2 text-sm text-slate-300">
                          Date :{" "}
                          {demande.dateLabel ||
                            demande.date ||
                            "Non précisée"}
                        </p>
                        <p className="mt-1 text-sm text-slate-300">
                          Joueur remplacé :{" "}
                          {demande.joueurRemplaceNom || "Non précisé"}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-black uppercase ${couleurStatut(
                          demande.statut
                        )}`}
                      >
                        {libelleStatut(demande.statut)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-400">
                  Aucune demande pour le moment.
                </p>
              )}
            </div>
          </section>
        )}

        <section
          id="mes-commandes"
          className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 text-amber-300">
                <ShoppingBag className="h-6 w-6" />
                <p className="text-sm font-black uppercase tracking-[0.18em]">
                  Boutique
                </p>
              </div>
              <h2 className="mt-3 text-3xl font-black">
                Mes commandes
                {commandes.length > 0 && (
                  <span className="ml-3 text-lg text-slate-500">
                    ({commandes.length})
                  </span>
                )}
              </h2>
            </div>

            <Link
              to="/boutique-v2"
              className="inline-flex items-center gap-2 rounded-2xl bg-amber-400 px-5 py-3 font-black text-slate-950 transition hover:bg-amber-300"
            >
              Nouvelle commande
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-7 space-y-4">
            {commandesAAfficher.length > 0 ? (
              commandesAAfficher.map((commande) => {
                const articles = articlesCommande(commande);

                return (
                  <div
                    key={commande.id}
                    className="rounded-2xl border border-white/10 bg-black/20 p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-black text-white">
                          Commande {numeroCommande(commande)}
                        </h3>
                        <p className="mt-2 text-slate-300">
                          Statut :{" "}
                          <span className="font-bold text-amber-300">
                            {statutCommande(commande)}
                          </span>
                        </p>
                      </div>
                      <p className="rounded-full bg-white/10 px-4 py-2 font-black text-white">
                        {totalCommandeBoutique(commande)} $
                      </p>
                    </div>

                    {articles.length > 0 ? (
                      <div className="mt-5 grid gap-3 md:grid-cols-2">
                        {articles.map((article, index) => (
                          <div
                            key={`${commande.id}-${index}`}
                            className="rounded-xl bg-white/5 p-4 text-sm text-slate-300"
                          >
                            <p className="font-black text-white">
                              {article.nom ||
                                article.categorie ||
                                article.modele ||
                                article.type ||
                                "Article"}
                            </p>
                            <p className="mt-2">
                              {article.couleurNom ||
                                article.couleur ||
                                "Couleur non précisée"}{" "}
                              ·{" "}
                              {article.taille ||
                                article.grandeur ||
                                "Grandeur non précisée"}{" "}
                              · Qté {article.quantite || article.qty || 1}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-5 rounded-xl bg-white/5 p-4 text-slate-300">
                        {commande.commande ||
                          commande.resume ||
                          "Détails de commande non disponibles."}
                      </p>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <p className="text-slate-400">
                  Aucune commande associée à ton compte pour le moment.
                </p>
              </div>
            )}
          </div>

          {commandes.length > 3 && (
            <button
              type="button"
              onClick={() =>
                setAfficherToutesCommandes((valeurActuelle) => !valeurActuelle)
              }
              className="mt-6 font-black text-cyan-300 transition hover:text-cyan-200"
            >
              {afficherToutesCommandes
                ? "Afficher seulement les 3 dernières"
                : `Afficher les ${commandes.length} commandes`}
            </button>
          )}
        </section>

        {estAdmin && (
          <section className="mt-8 rounded-3xl border border-amber-400/30 bg-amber-400/10 p-6 sm:p-8">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-300">
              Administration
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-white">
                  Gestion du site LVPSA
                </h2>
                <p className="mt-2 text-slate-300">
                  Accède aux équipes, membres, remplacements et commandes.
                </p>
              </div>
              <Link
                to="/admin"
                className="rounded-2xl bg-amber-400 px-6 py-3 font-black text-slate-950 transition hover:bg-amber-300"
              >
                Administration
              </Link>
            </div>
          </section>
        )}

        {estMembre && (
          <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <h2 className="text-2xl font-black text-white">
              Bienvenue à la LVPSA
            </h2>
            <p className="mt-2 max-w-2xl text-slate-400">
              Ton compte est actif. Tu peux consulter la boutique, le calendrier
              et les classements, ou t’inscrire comme joueur indépendant.
            </p>
          </section>
        )}
      </div>
    </section>
  );
}
