import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  Clock3,
  RefreshCw,
  Trophy,
} from "lucide-react";

const LIEN_GOOGLE_SHEET =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRBMXT5b8eny8w44oBu0VjWB1LzApRUTKzexWDdEt5TyZ_EomcwWHmVI_NM9ougyJT9_ywS4So6Cg9n/pub?output=tsv";

function parserScore(score) {
  if (!score) {
    return ["", ""];
  }

  const parties = score
    .trim()
    .split(/\s*[-–—/:]\s*/)
    .map((valeur) => valeur.trim());

  return [parties[0] || "", parties[1] || ""];
}

function ajouterMinutes(heure, minutes) {
  if (!heure) {
    return "";
  }

  const [heures, minutesActuelles] = heure.split(":").map(Number);

  if (
    Number.isNaN(heures) ||
    Number.isNaN(minutesActuelles)
  ) {
    return "";
  }

  const date = new Date();
  date.setHours(heures, minutesActuelles + minutes, 0, 0);

  return date.toLocaleTimeString("fr-CA", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function normaliserCategorie(categorie) {
  const valeur = categorie
    ?.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (valeur === "recreatif") {
    return "recreatif";
  }

  if (valeur === "competitif") {
    return "competitif";
  }

  return valeur || "";
}

function normaliserPhase(phase) {
  const valeur = phase
    ?.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (valeur === "demi-finale 1") {
    return "demi-finale-1";
  }

  if (valeur === "demi-finale 2") {
    return "demi-finale-2";
  }

  if (valeur.includes("3e place")) {
    return "troisieme-place";
  }

  if (valeur === "finale") {
    return "finale";
  }

  return valeur || "";
}

function normaliserStatut(statut) {
  return statut
    ?.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_") || "planifie";
}

function parserTSV(texte) {
  const lignes = texte
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter((ligne) => ligne.trim() !== "");

  const indexEntetes = lignes.findIndex((ligne) => {
    const cellules = ligne.split("\t");

    return (
      cellules.includes("# Matchs") &&
      cellules.includes("Début") &&
      cellules.includes("Catégorie")
    );
  });

  if (indexEntetes === -1) {
    return [];
  }

  const entetes = lignes[indexEntetes]
    .split("\t")
    .map((entete) => entete.trim());

  const obtenirIndex = (nom) => entetes.indexOf(nom);

  return lignes
    .slice(indexEntetes + 1)
    .map((ligne) => {
      const valeurs = ligne.split("\t");

      const id = valeurs[obtenirIndex("# Matchs")]?.trim() || "";
      const heureDebut =
        valeurs[obtenirIndex("Début")]?.trim() || "";
      const categorie =
        valeurs[obtenirIndex("Catégorie")]?.trim() || "";
      const phase =
        valeurs[obtenirIndex("Phase")]?.trim() || "";
      const equipe1 =
        valeurs[obtenirIndex("Équipe 1")]?.trim() || "";
      const equipe2 =
        valeurs[obtenirIndex("Équipe 2")]?.trim() || "";

      const scoreSet1 =
        valeurs[obtenirIndex("1er Set")]?.trim() || "";
      const scoreSet2 =
        valeurs[obtenirIndex("2e Set")]?.trim() || "";
      const scoreSet3 =
        valeurs[obtenirIndex("3e Set (optionnel)")]?.trim() || "";

      const [set1Equipe1, set1Equipe2] = parserScore(scoreSet1);
      const [set2Equipe1, set2Equipe2] = parserScore(scoreSet2);
      const [set3Equipe1, set3Equipe2] = parserScore(scoreSet3);

      return {
        id,
        date: "2026-08-29",
        heure_debut: heureDebut,
        heure_fin: ajouterMinutes(heureDebut, 40),
        categorie: normaliserCategorie(categorie),
        phase: normaliserPhase(phase),
        equipe_1: equipe1,
        equipe_2: equipe2,
        set1_equipe1: set1Equipe1,
        set1_equipe2: set1Equipe2,
        set2_equipe1: set2Equipe1,
        set2_equipe2: set2Equipe2,
        set3_equipe1: set3Equipe1,
        set3_equipe2: set3Equipe2,
        resultat_final: "",
        gagnant:
          valeurs[obtenirIndex("Gagnant")]?.trim() || "",
        statut: normaliserStatut(
          valeurs[obtenirIndex("Statut")]?.trim()
        ),
      };
    })
    .filter((match) => match.id && match.heure_debut);
}
function formaterCategorie(categorie) {
  if (categorie === "recreatif") {
    return "Récréatif";
  }

  if (categorie === "competitif") {
    return "Compétitif";
  }

  return categorie;
}

function formaterPhase(phase) {
  const phases = {
    "demi-finale-1": "Demi-finale 1",
    "demi-finale-2": "Demi-finale 2",
    "troisieme-place": "Match pour la 3e place",
    finale: "Finale",
  };

  return phases[phase] || phase;
}

function formaterStatut(statut) {
  const statuts = {
    planifie: "Planifié",
    "en cours": "En cours",
    en_cours: "En cours",
    termine: "Terminé",
    reporte: "Reporté",
  };

  return statuts[statut?.toLowerCase()] || statut || "Planifié";
}

function classeCategorie(categorie) {
  if (categorie === "competitif") {
    return "border-yellow-300/30 bg-yellow-300/10 text-yellow-200";
  }

  return "border-cyan-300/30 bg-cyan-300/10 text-cyan-200";
}

function classeStatut(statut) {
  const valeur = statut?.toLowerCase();

  if (valeur === "termine") {
    return "border-emerald-400/30 bg-emerald-400/10 text-emerald-300";
  }

  if (valeur === "en cours" || valeur === "en_cours") {
    return "border-orange-400/30 bg-orange-400/10 text-orange-300";
  }

  if (valeur === "reporte") {
    return "border-red-400/30 bg-red-400/10 text-red-300";
  }

  return "border-white/15 bg-white/5 text-white/60";
}

function afficherScore(scoreEquipe1, scoreEquipe2) {
  if (scoreEquipe1 === "" || scoreEquipe2 === "") {
    return "—";
  }

  return `${scoreEquipe1} - ${scoreEquipe2}`;
}

export default function SeriesLigue() {
  const [matchs, setMatchs] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");
  const [filtre, setFiltre] = useState("tous");
  const [derniereMiseAJour, setDerniereMiseAJour] = useState("");

  const chargerDonnees = useCallback(async () => {
    setChargement(true);
    setErreur("");

    try {
      const reponse = await fetch(
        `${LIEN_GOOGLE_SHEET}&cache=${Date.now()}`,
        {
          cache: "no-store",
        }
      );

      if (!reponse.ok) {
        throw new Error("Impossible de récupérer l’horaire.");
      }

      const texte = await reponse.text();
      const donnees = parserTSV(texte);

      const matchsValides = donnees
        .filter((match) => match.id && match.heure_debut)
        .sort((a, b) => Number(a.id) - Number(b.id));

      if (matchsValides.length === 0) {
        throw new Error(
          "Aucun match trouvé. Vérifie que l’onglet « Données site » est bien publié."
        );
      }

      setMatchs(matchsValides);

      setDerniereMiseAJour(
        new Date().toLocaleTimeString("fr-CA", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    } catch (error) {
      console.error("Erreur lors du chargement des séries :", error);

      setErreur(
        error.message ||
          "Une erreur est survenue lors du chargement de l’horaire."
      );
    } finally {
      setChargement(false);
    }
  }, []);

  useEffect(() => {
    chargerDonnees();
  }, [chargerDonnees]);

  const matchsFiltres = useMemo(() => {
    if (filtre === "tous") {
      return matchs;
    }

    return matchs.filter((match) => match.categorie === filtre);
  }, [filtre, matchs]);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-cyan-400/15 via-slate-900 to-yellow-300/10 p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-300">
                Séries de la ligue
              </p>

              <h1 className="mt-3 text-4xl font-black sm:text-5xl">
                Séries LVPSA 2026
              </h1>

              <p className="mt-4 max-w-2xl text-white/65">
                Consultez l’horaire, les résultats des sets et les équipes
                gagnantes des séries récréatives et compétitives.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4">
                <div className="flex items-center gap-2 text-sm font-bold text-white/50">
                  <CalendarDays className="h-4 w-4 text-cyan-300" />
                  Date
                </div>

                <p className="mt-2 font-black text-white">29 août 2026</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4">
                <div className="flex items-center gap-2 text-sm font-bold text-white/50">
                  <Clock3 className="h-4 w-4 text-yellow-300" />
                  Premier match
                </div>

                <p className="mt-2 font-black text-white">13 h 00</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 sm:p-6">
          <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-black">Horaire et résultats</h2>

              <p className="mt-1 text-sm text-white/50">
                Les résultats sont synchronisés avec le tableau officiel.
              </p>
            </div>

            <button
              type="button"
              onClick={chargerDonnees}
              disabled={chargement}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  chargement ? "animate-spin" : ""
                }`}
              />
              Actualiser
            </button>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setFiltre("tous")}
              className={`rounded-full px-4 py-2 text-sm font-black transition ${
                filtre === "tous"
                  ? "bg-white text-slate-950"
                  : "border border-white/10 bg-white/5 text-white/60 hover:text-white"
              }`}
            >
              Tous les matchs
            </button>

            <button
              type="button"
              onClick={() => setFiltre("recreatif")}
              className={`rounded-full px-4 py-2 text-sm font-black transition ${
                filtre === "recreatif"
                  ? "bg-cyan-300 text-slate-950"
                  : "border border-white/10 bg-white/5 text-white/60 hover:text-white"
              }`}
            >
              Récréatif
            </button>

            <button
              type="button"
              onClick={() => setFiltre("competitif")}
              className={`rounded-full px-4 py-2 text-sm font-black transition ${
                filtre === "competitif"
                  ? "bg-yellow-300 text-slate-950"
                  : "border border-white/10 bg-white/5 text-white/60 hover:text-white"
              }`}
            >
              Compétitif
            </button>
          </div>

          {derniereMiseAJour && !chargement && (
            <p className="mt-4 text-xs text-white/40">
              Dernière actualisation : {derniereMiseAJour}
            </p>
          )}

          {chargement && (
            <div className="flex min-h-64 items-center justify-center">
              <div className="text-center">
                <RefreshCw className="mx-auto h-8 w-8 animate-spin text-cyan-300" />

                <p className="mt-4 text-sm font-bold text-white/60">
                  Chargement de l’horaire...
                </p>
              </div>
            </div>
          )}

          {!chargement && erreur && (
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-400/25 bg-red-400/10 p-5 text-red-200">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />

              <div>
                <p className="font-black">Impossible d’afficher l’horaire</p>
                <p className="mt-1 text-sm text-red-200/75">{erreur}</p>
              </div>
            </div>
          )}

          {!chargement && !erreur && (
            <>
              <div className="mt-6 hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[1050px] border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-left text-xs font-black uppercase tracking-wider text-white/40">
                      <th className="px-3 py-4">Heure</th>
                      <th className="px-3 py-4">Catégorie</th>
                      <th className="px-3 py-4">Phase</th>
                      <th className="px-3 py-4">Équipes</th>
                      <th className="px-3 py-4 text-center">Set 1</th>
                      <th className="px-3 py-4 text-center">Set 2</th>
                      <th className="px-3 py-4 text-center">Set 3</th>
                      <th className="px-3 py-4 text-center">Résultat</th>
                      <th className="px-3 py-4">Statut</th>
                    </tr>
                  </thead>

                  <tbody>
                    {matchsFiltres.map((match) => (
                      <tr
                        key={match.id}
                        className="border-b border-white/5 transition hover:bg-white/[0.03]"
                      >
                        <td className="whitespace-nowrap px-3 py-5">
                          <p className="font-black text-white">
                            {match.heure_debut}
                          </p>

                          <p className="mt-1 text-xs text-white/40">
                            à {match.heure_fin}
                          </p>
                        </td>

                        <td className="px-3 py-5">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-black ${classeCategorie(
                              match.categorie
                            )}`}
                          >
                            {formaterCategorie(match.categorie)}
                          </span>
                        </td>

                        <td className="px-3 py-5 font-bold text-white/75">
                          {formaterPhase(match.phase)}
                        </td>

                        <td className="px-3 py-5">
                          <div className="space-y-2">
                            <p
                              className={`font-bold ${
                                match.gagnant === match.equipe_1
                                  ? "text-emerald-300"
                                  : "text-white"
                              }`}
                            >
                              {match.equipe_1}
                            </p>

                            <p
                              className={`font-bold ${
                                match.gagnant === match.equipe_2
                                  ? "text-emerald-300"
                                  : "text-white"
                              }`}
                            >
                              {match.equipe_2}
                            </p>
                          </div>
                        </td>

                        <td className="px-3 py-5 text-center font-black">
                          {afficherScore(
                            match.set1_equipe1,
                            match.set1_equipe2
                          )}
                        </td>

                        <td className="px-3 py-5 text-center font-black">
                          {afficherScore(
                            match.set2_equipe1,
                            match.set2_equipe2
                          )}
                        </td>

                        <td className="px-3 py-5 text-center font-black">
                          {afficherScore(
                            match.set3_equipe1,
                            match.set3_equipe2
                          )}
                        </td>

                        <td className="px-3 py-5 text-center">
                          <p className="text-lg font-black text-cyan-300">
                            {match.resultat_final || "—"}
                          </p>

                          {match.gagnant && (
                            <p className="mt-1 text-xs font-bold text-emerald-300">
                              {match.gagnant}
                            </p>
                          )}
                        </td>

                        <td className="px-3 py-5">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-black ${classeStatut(
                              match.statut
                            )}`}
                          >
                            {formaterStatut(match.statut)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 space-y-4 lg:hidden">
                {matchsFiltres.map((match) => (
                  <article
                    key={match.id}
                    className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70"
                  >
                    <div className="flex items-center justify-between gap-3 border-b border-white/10 p-4">
                      <div>
                        <p className="text-xl font-black text-white">
                          {match.heure_debut}
                        </p>

                        <p className="text-xs text-white/40">
                          jusqu’à {match.heure_fin}
                        </p>
                      </div>

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-black ${classeCategorie(
                          match.categorie
                        )}`}
                      >
                        {formaterCategorie(match.categorie)}
                      </span>
                    </div>

                    <div className="p-4">
                      <p className="text-sm font-black uppercase tracking-wide text-white/45">
                        {formaterPhase(match.phase)}
                      </p>

                      <div className="mt-4 grid grid-cols-[1fr_repeat(3,48px)] items-center gap-2 text-center">
                        <div className="text-left text-xs font-black uppercase text-white/35">
                          Équipe
                        </div>

                        <div className="text-xs font-black text-white/35">
                          S1
                        </div>

                        <div className="text-xs font-black text-white/35">
                          S2
                        </div>

                        <div className="text-xs font-black text-white/35">
                          S3
                        </div>

                        <div
                          className={`text-left font-bold ${
                            match.gagnant === match.equipe_1
                              ? "text-emerald-300"
                              : "text-white"
                          }`}
                        >
                          {match.equipe_1}
                        </div>

                        <div className="font-black">
                          {match.set1_equipe1 || "—"}
                        </div>

                        <div className="font-black">
                          {match.set2_equipe1 || "—"}
                        </div>

                        <div className="font-black">
                          {match.set3_equipe1 || "—"}
                        </div>

                        <div
                          className={`text-left font-bold ${
                            match.gagnant === match.equipe_2
                              ? "text-emerald-300"
                              : "text-white"
                          }`}
                        >
                          {match.equipe_2}
                        </div>

                        <div className="font-black">
                          {match.set1_equipe2 || "—"}
                        </div>

                        <div className="font-black">
                          {match.set2_equipe2 || "—"}
                        </div>

                        <div className="font-black">
                          {match.set3_equipe2 || "—"}
                        </div>
                      </div>

                      <div className="mt-5 flex items-center justify-between gap-4 border-t border-white/10 pt-4">
                        <div>
                          <p className="text-xs font-bold uppercase text-white/40">
                            Résultat
                          </p>

                          <p className="mt-1 text-xl font-black text-cyan-300">
                            {match.resultat_final || "À venir"}
                          </p>
                        </div>

                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-black ${classeStatut(
                            match.statut
                          )}`}
                        >
                          {formaterStatut(match.statut)}
                        </span>
                      </div>

                      {match.gagnant && (
                        <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-emerald-300">
                          <Trophy className="h-4 w-4" />

                          <p className="text-sm font-black">
                            Gagnant : {match.gagnant}
                          </p>
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-xl font-black">Format des matchs</h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-bold text-white/45">Durée</p>
              <p className="mt-2 font-black">40 minutes</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-bold text-white/45">Sets 1 et 2</p>
              <p className="mt-2 font-black">25 points, maximum 27</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-bold text-white/45">
                3e set optionnel
              </p>
              <p className="mt-2 font-black">15 points, maximum 17</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-bold text-white/45">Victoire</p>
              <p className="mt-2 font-black">2 sets gagnés</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
