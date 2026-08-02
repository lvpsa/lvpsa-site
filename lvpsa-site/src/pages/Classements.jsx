import React from "react";
import { Link } from "react-router-dom";
import { Trophy } from "lucide-react";

import ClassementTable from "../components/classements/ClassementTable";

const URL_CLASSEMENT_RECREATIF =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQgd0CSVXzpiJknzlFzR3ePmhD33lTUh2GDmEv7-XTpXA9rWz_X4Cl7QverC1jzsOEwvyvBHIMALhEm/pub?gid=1356137713&single=true&output=csv";

const URL_CLASSEMENT_COMPETITIF =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQgd0CSVXzpiJknzlFzR3ePmhD33lTUh2GDmEv7-XTpXA9rWz_X4Cl7QverC1jzsOEwvyvBHIMALhEm/pub?gid=1226338215&single=true&output=csv";

export function Classements() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <p className="font-bold uppercase tracking-wider text-amber-300">
        Classements
      </p>

      <h1 className="mt-2 text-4xl font-black text-white sm:text-5xl">
        Classements officiels LVPSA
      </h1>

      <p className="mt-4 max-w-3xl text-lg text-slate-300">
        Consultez les résultats et les classements mis à jour de
        la saison.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <ClassementCard
          titre="Récréatif"
          description="Classement des équipes de la catégorie récréative."
          lien="/classements/recreatif"
        />

        <ClassementCard
          titre="Compétitif"
          description="Classement des équipes de la catégorie compétitive."
          lien="/classements/competitif"
        />
      </div>
    </section>
  );
}

function ClassementCard({
  titre,
  description,
  lien,
}) {
  return (
    <Link
      to={lien}
      className="group rounded-3xl border border-white/10 bg-white/5 p-8 transition hover:-translate-y-1 hover:border-amber-300/50 hover:bg-white/10"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-300 transition group-hover:bg-amber-400 group-hover:text-slate-950">
        <Trophy size={30} />
      </div>

      <h2 className="mt-6 text-3xl font-black text-white">
        {titre}
      </h2>

      <p className="mt-3 leading-7 text-slate-300">
        {description}
      </p>

      <p className="mt-6 font-black text-amber-300">
        Voir le classement →
      </p>
    </Link>
  );
}

export function ClassementDetail({ categorie }) {
  const estRecreatif = categorie === "recreatif";

  const titre = estRecreatif
    ? "Classement récréatif"
    : "Classement compétitif";

  const url = estRecreatif
    ? URL_CLASSEMENT_RECREATIF
    : URL_CLASSEMENT_COMPETITIF;

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <Link
        to="/classements"
        className="inline-flex rounded-full border border-white/15 px-5 py-3 font-black text-amber-300 transition hover:border-amber-300"
      >
        ← Retour aux classements
      </Link>

      <h1 className="mt-8 text-4xl font-black text-white sm:text-5xl">
        {titre}
      </h1>

      <p className="mt-4 text-slate-300">
        Données officielles de la saison 2026.
      </p>

      <ClassementTable
        url={url}
        titre={titre}
      />
    </section>
  );
}
