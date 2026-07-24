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
  UserRound,
  UsersRound,
} from "lucide-react";

import { auth, db } from "../firebase";
import { formatTelephone } from "../utils/telephone";
import DashboardHeader from "../components/mon-espace/DashboardHeader";
import CarteProfil from "../components/mon-espace/CarteProfil";
import CarteAccesRapides from "../components/mon-espace/CarteAccesRapides";
import CarteEvenement from "../components/mon-espace/CarteEvenement";

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
    ...(prochainMatchEquipe
      ? [
          {
            id: "prochain-match",
            titre: "Prochain match",
            texte: `${dateProchainMatch} — ${prochainMatchEquipe.heure} contre ${prochainMatchEquipe.adversaire}`,
            type: "match",
            lien: "/calendrier",
          },
        ]
      : []),
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
  ].slice(0, 5);

  const dateCreationCompte =
    userData?.createdAt?.toDate?.() ||
    userData?.dateCreation?.toDate?.() ||
    null;
  const membreDepuis = dateCreationCompte
    ? dateCreationCompte.getFullYear()
    : "2026";

  const statistiquesMembre = [
    { titre: "Commandes", valeur: commandes.length, icone: ShoppingBag },
    {
      titre: "Remplacements",
      valeur: demandesAcceptees.length,
      icone: Repeat2,
    },
    { titre: "En attente", valeur: nombreDemandesActives, icone: Clock3 },
    { titre: "Membre depuis", valeur: membreDepuis, icone: UserRound },
  ];

  return (
    <section className="min-h-screen bg-slate-950 px-5 pb-20 pt-28 text-white lg:px-8">
      <div className="mx-auto max-w-7xl">
        <DashboardHeader
          prenom={prenom}
          roleAffichage={roleAffichage}
          nomEquipe={nomEquipeActuelle}
          categorieActive={categorieActive}
        />

        {/* Résumé principal */}
        <div className="mt-6 grid gap-5 lg:grid-cols-[1.6fr_1fr]">
          <div className="relative overflow-hidden rounded-3xl border border-cyan-300/20 bg-gradient-to-br from-cyan-400/15 via-slate-900 to-slate-950 p-6 sm:p-8">
            <div className="flex items-center gap-3 text-cyan-300">
              <CalendarDays className="h-6 w-6" />
              <p className="text-sm font-black uppercase tracking-[0.18em]">
                Prochain match
              </p>
            </div>

            {prochainMatchEquipe ? (
              <>
                <p className="mt-6 text-lg font-bold capitalize text-slate-300">
                  {dateProchainMatch}
                </p>
                <h2 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
                  {prochainMatchEquipe.heure}
                </h2>

                <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5">
                  <p className="text-sm font-bold text-slate-400">
                    Votre adversaire
                  </p>
                  <p className="mt-2 text-2xl font-black text-white">
                    {prochainMatchEquipe.adversaire}
                  </p>
                </div>

                <div className="mt-5 flex items-center gap-2 text-sm text-slate-400">
                  <MapPin className="h-4 w-4 text-cyan-300" />
                  Parc Portneuf, Saint-Augustin-de-Desmaures
                </div>

                <Link
                  to="/calendrier"
                  className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-cyan-300 px-5 py-3 font-black text-slate-950 transition hover:bg-cyan-200"
                >
                  Voir le calendrier
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </>
            ) : (
              <>
                <h2 className="mt-6 text-3xl font-black">
                  Aucun match à venir
                </h2>
                <p className="mt-3 text-slate-300">
                  Aucun prochain match n’a été trouvé pour ton équipe dans
                  l’horaire actuel.
                </p>
                <Link
                  to="/calendrier"
                  className="mt-7 inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 font-black text-white"
                >
                  Consulter le calendrier
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-yellow-300/10 text-yellow-300">
                <UsersRound className="h-5 w-5" />
              </div>
              <p className="mt-5 text-sm font-bold uppercase tracking-[0.15em] text-slate-400">
                Mon équipe
              </p>
              <p className="mt-2 text-2xl font-black">
                {nomEquipeActuelle || "Aucune équipe"}
              </p>

              {(estJoueur || estCapitaine) && (
                <Link
                  to={estCapitaine ? "/gestion-equipe" : "/classements"}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-black text-cyan-300"
                >
                  {estCapitaine ? "Gérer mon équipe" : "Voir les classements"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>

            <div className="rounded-3xl border border-yellow-300/20 bg-gradient-to-br from-yellow-300/10 via-white/[0.04] to-slate-950 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.15em] text-yellow-300">
                    Mon classement
                  </p>
                  <h2 className="mt-3 text-2xl font-black text-white">
                    {nomEquipeActuelle || "Mon équipe"}
                  </h2>
                </div>
                <Trophy className="h-7 w-7 text-yellow-300" />
              </div>

              {classementChargement ? (
                <div className="mt-6">
                  <div className="h-10 w-20 animate-pulse rounded-xl bg-white/10" />
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
                      <p className="text-2xl font-black text-white">
                        {classementEquipe.pj}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">Parties</p>
                    </div>
                    <div className="rounded-2xl bg-black/20 p-3 text-center">
                      <p className="text-2xl font-black text-white">
                        {classementEquipe.sg}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Sets gagnés
                      </p>
                    </div>
                    <div className="rounded-2xl bg-black/20 p-3 text-center">
                      <p className="text-2xl font-black text-yellow-300">
                        {classementEquipe.points}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">Points</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <span className="text-sm text-slate-400">Différentiel</span>
                    <span className="font-black text-emerald-300">
                      {classementEquipe.differentiel}
                    </span>
                  </div>

                  <Link
                    to={
                      categorieActive === "recreatif"
                        ? "/classements/recreatif"
                        : "/classements/competitif"
                    }
                    className="mt-5 inline-flex items-center gap-2 font-black text-cyan-300"
                  >
                    Voir le classement complet
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </>
              ) : (
                <div className="mt-6 rounded-2xl bg-white/5 p-4">
                  <p className="text-sm text-slate-400">
                    {erreurClassement ||
                      "Ton équipe n’a pas été trouvée dans le classement actuel."}
                  </p>
                  <Link
                    to="/classements"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-black text-cyan-300"
                  >
                    Consulter les classements
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-fuchsia-300/10 text-fuchsia-300">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <p className="mt-5 text-sm font-bold uppercase tracking-[0.15em] text-slate-400">
                Mes commandes
              </p>
              <p className="mt-2 text-4xl font-black">{commandes.length}</p>
              <a
                href="#mes-commandes"
                className="mt-5 inline-flex items-center gap-2 text-sm font-black text-cyan-300"
              >
                Voir les commandes
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            {(estRemplacant || estCapitaine) && (
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:col-span-2 lg:col-span-1">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-300/10 text-emerald-300">
                  <Repeat2 className="h-5 w-5" />
                </div>
                <p className="mt-5 text-sm font-bold uppercase tracking-[0.15em] text-slate-400">
                  Remplacements
                </p>
                <p className="mt-2 text-4xl font-black">
                  {nombreDemandesActives}
                </p>
                <Link
                  to={estCapitaine ? "/gestion-equipe" : "/remplacants"}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-black text-cyan-300"
                >
                  Voir les demandes
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Tableau de bord intelligent */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 text-cyan-300">
                  <Bell className="h-6 w-6" />
                  <p className="text-sm font-black uppercase tracking-[0.18em]">
                    À surveiller
                  </p>
                </div>
                <h2 className="mt-3 text-3xl font-black">Tes notifications</h2>
              </div>

              {notifications.length > 0 && (
                <span className="rounded-full bg-cyan-300 px-3 py-1 text-sm font-black text-slate-950">
                  {notifications.length}
                </span>
              )}
            </div>

            <div className="mt-6 space-y-3">
              {notifications.length > 0 ? (
                notifications.map((notification) => {
                  const Icone =
                    notification.type === "commande"
                      ? PackageCheck
                      : notification.type === "remplacement"
                      ? CheckCircle2
                      : notification.type === "attente"
                      ? Clock3
                      : CalendarDays;

                  const contenu = (
                    <>
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-300">
                        <Icone className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-black text-white">
                          {notification.titre}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-slate-400">
                          {notification.texte}
                        </p>
                      </div>
                      <ArrowRight className="mt-3 h-4 w-4 shrink-0 text-slate-600 transition group-hover:translate-x-1 group-hover:text-cyan-300" />
                    </>
                  );

                  const classes =
                    "group flex items-start gap-4 rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-cyan-300/30 hover:bg-white/[0.06]";

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
                <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-5">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-6 w-6 text-emerald-300" />
                    <div>
                      <p className="font-black text-white">Tout est à jour</p>
                      <p className="mt-1 text-sm text-slate-400">
                        Tu n’as aucune action urgente pour le moment.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-yellow-300/10 via-white/[0.04] to-cyan-300/10 p-6 sm:p-8">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-yellow-300">
              Mon activité
            </p>
            <h2 className="mt-3 text-3xl font-black">En un coup d’œil</h2>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {statistiquesMembre.map((statistique) => {
                const Icone = statistique.icone;

                return (
                  <div
                    key={statistique.titre}
                    className="rounded-2xl border border-white/10 bg-slate-950/55 p-4"
                  >
                    <Icone className="h-5 w-5 text-cyan-300" />
                    <p className="mt-5 text-3xl font-black text-white">
                      {statistique.valeur}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      {statistique.titre}
                    </p>
                  </div>
                );
              })}
            </div>

            <Link
              to="/classements"
              className="mt-6 inline-flex items-center gap-2 font-black text-cyan-300 transition hover:text-cyan-200"
            >
              Voir les classements
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        </div>

        {/* Contenu secondaire */}
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
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

          {estRemplacant && (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm font-bold uppercase tracking-wider text-amber-300">
                Remplaçant
              </p>
              <h2 className="mt-3 text-4xl font-black text-white">
                {demandesRecuesEnAttente.length}
              </h2>
              <p className="mt-2 text-slate-300">
                demande{demandesRecuesEnAttente.length > 1 ? "s" : ""} en
                attente
              </p>
              <Link
                to="/remplacants"
                className="mt-5 inline-flex rounded-full bg-amber-400 px-6 py-3 font-black text-slate-950 hover:bg-amber-300"
              >
                Voir mes demandes
              </Link>
            </div>
          )}

          {estCapitaine && (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm font-bold uppercase tracking-wider text-amber-300">
                Capitaine
              </p>
              <h2 className="mt-3 text-4xl font-black text-white">
                {demandesEnvoyeesEnAttente.length}
              </h2>
              <p className="mt-2 text-slate-300">
                demande{demandesEnvoyeesEnAttente.length > 1 ? "s" : ""}{" "}
                envoyée{demandesEnvoyeesEnAttente.length > 1 ? "s" : ""} en
                attente
              </p>
              <Link
                to="/gestion-equipe"
                className="mt-5 inline-flex rounded-full bg-amber-400 px-6 py-3 font-black text-slate-950 hover:bg-amber-300"
              >
                Gestion d'équipe
              </Link>
            </div>
          )}

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm font-bold uppercase tracking-wider text-amber-300">
              Boutique
            </p>
            <h2 className="mt-3 text-4xl font-black text-white">
              {commandes.length}
            </h2>
            <p className="mt-2 text-slate-300">
              commande{commandes.length > 1 ? "s" : ""} associée
              {commandes.length > 1 ? "s" : ""} à ton compte
            </p>
            <a
              href="#mes-commandes"
              className="mt-5 inline-flex rounded-full border border-white/15 px-6 py-3 font-black text-white hover:border-amber-300 hover:text-amber-300"
            >
              Voir mes commandes
            </a>
          </div>

          {estAdmin && (
            <div className="rounded-3xl border border-amber-400/30 bg-amber-400/10 p-6">
              <p className="text-sm font-bold uppercase tracking-wider text-amber-300">
                Admin
              </p>
              <h2 className="mt-3 text-2xl font-black text-white">
                Administration LVPSA
              </h2>
              <p className="mt-2 text-slate-300">
                Accès complet à la gestion du site.
              </p>
              <Link
                to="/admin"
                className="mt-5 inline-flex rounded-full bg-amber-400 px-6 py-3 font-black text-slate-950 hover:bg-amber-300"
              >
                Administration
              </Link>
            </div>
          )}
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {estRemplacant && (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-black text-amber-300">
                    Mes demandes reçues
                  </h2>
                  <p className="mt-3 text-slate-300">
                    Demandes envoyées par les capitaines.
                  </p>
                </div>
                <Link
                  to="/remplacants"
                  className="rounded-full border border-white/15 px-5 py-3 font-black text-white hover:border-amber-300 hover:text-amber-300"
                >
                  Voir tout
                </Link>
              </div>

              <div className="mt-6 space-y-4">
                {demandesRecues.slice(0, 3).length > 0 ? (
                  demandesRecues.slice(0, 3).map((demande) => (
                    <div
                      key={demande.id}
                      className="rounded-2xl border border-white/10 bg-black/20 p-5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="text-xl font-black text-white">
                            {demande.equipeNom || "Équipe non précisée"}
                          </h3>
                          <p className="mt-2 text-slate-300">
                            Date :{" "}
                            {demande.dateLabel ||
                              demande.date ||
                              "Non précisée"}
                          </p>
                          <p className="text-slate-300">
                            Joueur remplacé :{" "}
                            {demande.joueurRemplaceNom || "Non précisé"}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-4 py-2 text-sm font-black uppercase ${couleurStatut(
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
                    Aucune demande reçue pour le moment.
                  </p>
                )}
              </div>
            </div>
          )}

          {estCapitaine && (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-black text-amber-300">
                    Demandes envoyées
                  </h2>
                  <p className="mt-3 text-slate-300">
                    Suivi rapide de tes demandes de remplacement.
                  </p>
                </div>
                <Link
                  to="/gestion-equipe"
                  className="rounded-full border border-white/15 px-5 py-3 font-black text-white hover:border-amber-300 hover:text-amber-300"
                >
                  Gestion d'équipe
                </Link>
              </div>

              <div className="mt-6 space-y-4">
                {demandesEnvoyees.slice(0, 3).length > 0 ? (
                  demandesEnvoyees.slice(0, 3).map((demande) => (
                    <div
                      key={demande.id}
                      className="rounded-2xl border border-white/10 bg-black/20 p-5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="text-xl font-black text-white">
                            {demande.remplacantNom ||
                              "Remplaçant non précisé"}
                          </h3>
                          <p className="mt-2 text-slate-300">
                            Date :{" "}
                            {demande.dateLabel ||
                              demande.date ||
                              "Non précisée"}
                          </p>
                          <p className="text-slate-300">
                            Joueur remplacé :{" "}
                            {demande.joueurRemplaceNom || "Non précisé"}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-4 py-2 text-sm font-black uppercase ${couleurStatut(
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
                    Aucune demande envoyée pour le moment.
                  </p>
                )}
              </div>
            </div>
          )}

          <CarteEvenement />

          {estMembre && (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
              <h2 className="text-3xl font-black text-amber-300">
                Bienvenue à la LVPSA
              </h2>
              <p className="mt-3 text-slate-300">
                Ton compte est actif. Tu peux consulter la boutique, le
                calendrier et les classements.
              </p>
              <Link
                to="/inscription-ligue"
                className="mt-6 inline-flex rounded-full bg-amber-400 px-6 py-3 font-black text-slate-950 hover:bg-amber-300"
              >
                Devenir remplaçant
              </Link>
            </div>
          )}
        </div>

        <div
          id="mes-commandes"
          className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-bold uppercase tracking-wider text-amber-300">
                Boutique
              </p>
              <h2 className="mt-2 text-3xl font-black text-white">
                Mes commandes
              </h2>
            </div>
            <Link
              to="/boutique"
              className="rounded-full bg-amber-400 px-6 py-3 font-black text-slate-950 hover:bg-amber-300"
            >
              Nouvelle commande
            </Link>
          </div>

          <div className="mt-8 space-y-5">
            {commandes.length > 0 ? (
              commandes.map((commande) => {
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
                        Total : {totalCommandeBoutique(commande)} $
                      </p>
                    </div>

                    {articles.length > 0 ? (
                      <div className="mt-5 grid gap-3 md:grid-cols-2">
                        {articles.map((article, index) => (
                          <div
                            key={`${commande.id}-${index}`}
                            className="rounded-xl bg-white/5 p-4 text-slate-300"
                          >
                            <p className="font-black text-white">
                              {article.nom ||
                                article.categorie ||
                                article.modele ||
                                article.type ||
                                "Article"}
                            </p>
                            <p className="mt-1 text-sm">
                              Couleur :{" "}
                              {article.couleurNom ||
                                article.couleur ||
                                "Non précisée"}
                            </p>
                            <p className="text-sm">
                              Grandeur :{" "}
                              {article.taille ||
                                article.grandeur ||
                                "Non précisée"}
                            </p>
                            <p className="text-sm">
                              Quantité : {article.quantite || article.qty || 1}
                            </p>
                            <p className="text-sm">
                              Prix : {Number(article.prix || 0)} $
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
              <p className="text-slate-400">
                Aucune commande associée à ton compte pour le moment.
              </p>
            )}
          </div>
        </div>

        <CarteAccesRapides
          estAdmin={estAdmin}
          estCapitaine={estCapitaine}
          estRemplacant={estRemplacant}
        />
      </div>
    </section>
  );
}

