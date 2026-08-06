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
