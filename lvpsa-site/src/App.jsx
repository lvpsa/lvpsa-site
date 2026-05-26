import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import {
  Calendar, Trophy, Mail, MapPin, ExternalLink, CheckCircle2,
  CloudSun, Lock, LogIn
} from "lucide-react";
import "./index.css";

const email = "liguevpsa@gmail.com";
const tournoiLink = "https://forms.gle/csLUt6NmcjNADcBm7";
const sheetLink = "https://docs.google.com/spreadsheets/d/1-Y5gsmgi-V8TjSQbl2xIPuDx1QxTPL0S/edit?usp=drive_link&ouid=116934157877214569210&rtpof=true&sd=true";
const meteoLink = "https://www.meteomedia.com/ca/meteo/quebec/saint-augustin-de-desmaures";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-white">
        <Header />
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/classements" element={<Classements />} />
          <Route path="/classements/recreatif" element={<ClassementDetail titre="Classement récréatif" />} />
          <Route path="/classements/competitif" element={<ClassementDetail titre="Classement compétitif" />} />
          <Route path="/classements/facebook" element={<ClassementDetail titre="Classement Facebook" />} />
          <Route path="/tournoi" element={<Tournoi />} />
          <Route path="/reglements" element={<Reglements />} />
          
          <Route path="/ligue" element={<Ligue />} />
          <Route path="/inscription-ligue" element={<InscriptionLigue />} />
          <Route path="/gestion-equipe" element={<GestionEquipe />} />
          <Route path="/reglements-tournoi" element={<ReglementsTournoi />} />
          <Route path="/membres" element={<Membres />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-4">
          <img
            src="/LVPSA_logo (1).jpg"
            className="h-20 w-20 rounded-full bg-white object-cover"
          />
          <div>
            <p className="text-2xl font-black">LVPSA</p>
            <p className="text-sm text-slate-300">
              Volleyball de plage de St-Augustin
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-200 md:flex">
          <Link to="/" className="hover:text-amber-300">
            Accueil
          </Link>
<div className="relative group">
  <button className="hover:text-amber-300 transition">
    Ligue
  </button>

  <div className="absolute left-0 top-full pt-3 hidden group-hover:block">
    <div className="w-64 rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
      <Link
        to="/ligue"
        className="block px-5 py-3 hover:bg-slate-800 rounded-t-2xl"
      >
        Informations
      </Link>

      <Link
        to="/classements"
        className="block px-5 py-3 hover:bg-slate-800"
      >
        Classements
      </Link>

      <Link
        to="/reglements"
        className="block px-5 py-3 hover:bg-slate-800"
      >
        Règlements
      </Link>

      <Link
        to="/gestion-equipe"
        className="block px-5 py-3 hover:bg-slate-800"
      >
        Gestion d’équipe
      </Link>

      <Link
        to="/inscription-ligue"
        className="block px-5 py-3 hover:bg-slate-800 rounded-b-2xl"
      >
        Inscription
      </Link>
    </div>
  </div>
</div>

          <div className="relative group">
            <button className="hover:text-amber-300">
              Tournoi ▾
            </button>

            <div className="absolute left-0 top-full pt-3 hidden group-hover:block">
            <div className="w-64 rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
              <Link to="/tournoi" className="block rounded-xl px-4 py-3 hover:bg-white/10">
                Informations
              </Link>
              <a
                href="https://forms.gle/csLUt6NmcjNADcBm7"
                target="_blank"
                rel="noreferrer"
                className="block rounded-xl px-4 py-3 hover:bg-white/10"
              >
                Inscription
              </a>
              <Link to="/reglements-tournoi" className="block rounded-xl px-4 py-3 hover:bg-white/10">
                Règlements
              </Link>
            </div>
          </div>

          <Link
            to="/membres"
            className="rounded-full border border-white/15 px-5 py-2 hover:bg-white/10 hover:text-amber-300"
          >
            Connexion
          </Link>

          <Link to="/contact" className="hover:text-amber-300">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
function Accueil() {
  return (
    <>
      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-sm text-amber-200">
            <Calendar size={16} /> Saison 2026
          </div>

          <h1 className="text-4xl font-black leading-tight md:text-6xl">
            Ligue de volleyball de plage de St-Augustin
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-300">
            Les inscriptions pour la saison 2026 sont maintenant terminées.
            Pour donner votre nom comme remplaçant, écrivez-nous à{" "}
            <a className="font-bold text-amber-300" href={`mailto:${email}`}>{email}</a>.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/tournoi" className="rounded-full bg-amber-400 px-7 py-3 text-center font-bold text-slate-950">
              Voir le tournoi
            </Link>
            <Link to="/classements" className="rounded-full border border-white/15 px-7 py-3 text-center font-semibold">
              Voir les classements
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl">
          <div className="rounded-[1.5rem] bg-slate-900 p-6">
            <p className="text-sm text-slate-400">St-Augustin-de-Desmaures</p>
            <h2 className="text-3xl font-black">Parc Portneuf</h2>

            {[
              "Volet récréatif le lundi soir",
              "Volet compétitif le mardi soir",
              "Saison de 12 semaines",
              "Tournoi des séries à la fin août",
            ].map((item) => (
              <div key={item} className="mt-4 flex gap-3 rounded-2xl bg-white/5 p-4">
                <CheckCircle2 className="shrink-0 text-amber-300" size={20} />
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function Classements() {
 return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <p className="font-bold uppercase tracking-wider text-amber-300">
        Classements
      </p>

      <h1 className="mt-2 text-4xl font-black">
        Classements officiels LVPSA
      </h1>

      <p className="mt-4 text-slate-300">
        Consultez les résultats et classements mis à jour de la saison.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Link
          to="/classements/recreatif"
          className="rounded-3xl border border-white/10 bg-white/10 p-8 transition hover:bg-white/15"
        >
          <Trophy className="mb-4 text-amber-300" size={34} />
          <h2 className="text-2xl font-black">Récréatif</h2>
          <p className="mt-3 text-slate-300">
            Voir le classement récréatif
          </p>
        </Link>

        <Link
          to="/classements/competitif"
          className="rounded-3xl border border-white/10 bg-white/10 p-8 transition hover:bg-white/15"
        >
          <Trophy className="mb-4 text-amber-300" size={34} />
          <h2 className="text-2xl font-black">Compétitif</h2>
          <p className="mt-3 text-slate-300">
            Voir le classement compétitif
          </p>
        </Link>
      </div>
    </section>
  );
}

function ClassementCard({ titre, lien }) {
  return (
    <Link to={lien} className="rounded-3xl border border-white/10 bg-white/10 p-8 transition hover:bg-white/15">
      <Trophy className="mb-4 text-amber-300" size={34} />
      <h2 className="text-2xl font-black">{titre}</h2>
      <p className="mt-3 text-slate-300">Voir ce tableau seulement</p>
    </Link>
  );
}

function ClassementDetail({ titre }) {
  let lien = "";

  if (titre === "Classement récréatif") {
    lien =
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vTardkLh0jJ8QU48byhbDRNRFPJLvJn6WkZ-3XfWcAsPXmC1dBB-OmHfqW_vq_BZQ/pubhtml?gid=1356137713&single=true";
  }

  if (titre === "Classement compétitif") {
    lien =
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vTardkLh0jJ8QU48byhbDRNRFPJLvJn6WkZ-3XfWcAsPXmC1dBB-OmHfqW_vq_BZQ/pubhtml?gid=1226338215&single=true";
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <Link to="/classements" className="text-amber-300">
        ← Retour aux classements
      </Link>

      <h1 className="mt-6 text-4xl font-black">{titre}</h1>

      <div className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-white">
        <iframe
          src={lien}
          title={titre}
          width="100%"
          height="340"
          className="w-full overflow-hidden rounded-3xl"
          style={{
  border: "none",
  background: "white",
  display: "block",
}}
        />
      </div>
    </section>
  );
}

function Tournoi() {
  return (
    <section className="bg-white py-16 text-slate-950">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-2 md:items-center">
        <div>
          <p className="font-bold uppercase tracking-wider text-amber-600">Tournoi LVPSA</p>
          <h1 className="mt-2 text-4xl font-black">18 juillet 2026</h1>
          <p className="mt-5 text-lg leading-8 text-slate-700">
            Tournoi de volleyball de plage avec catégories compétitif et récréatif.
          </p>

          <a
            href={tournoiLink}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-amber-400 px-7 py-3 font-bold text-slate-950"
          >
            Inscription tournoi <ExternalLink size={18} />
          </a>
        </div>

        <img src="/tournoi-lvpsa-2026.jpg" className="w-full rounded-3xl shadow-2xl" />
      </div>
    </section>
  );
}

function Reglements() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <h1 className="text-4xl font-black">Règlements</h1>
      <p className="mt-4 text-slate-300">
        Consultez les règlements officiels de la ligue.
      </p>

      <a
        href="/LVPSA 2026_règlements seulement.pptx"
        target="_blank"
        rel="noreferrer"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-amber-400 px-7 py-3 font-bold text-slate-950"
      >
        Consulter les règlements <ExternalLink size={18} />
      </a>
    </section>
  );
}

function Membres() {
  return (
    <section className="bg-white py-16 text-slate-950">
      <div className="mx-auto max-w-7xl px-6">
        <h1 className="text-4xl font-black">Espace membre</h1>
        <p className="mt-4 text-slate-600">
          Accès réservé aux joueurs et capitaines.
        </p>

        <div className="mt-8 max-w-xl rounded-3xl border bg-slate-50 p-6">
          <Lock className="mb-4" />
          <h2 className="text-2xl font-black">Connexion membre</h2>
          <input className="mt-5 w-full rounded-2xl border px-4 py-3" placeholder="Courriel" />
          <input className="mt-3 w-full rounded-2xl border px-4 py-3" placeholder="Mot de passe" type="password" />
          <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-amber-400 px-6 py-3 font-bold text-slate-950">
            <LogIn size={18} /> Se connecter
          </button>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <h1 className="text-4xl font-black">Contact</h1>
      <p className="mt-4 text-slate-300">
        Valérie Thomassin, Mike Théroux et Sylvain Arbour
      </p>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <a href={`mailto:${email}`} className="rounded-full border border-white/15 px-6 py-3">
          <Mail className="mr-2 inline" size={18} /> {email}
        </a>

        <a href={meteoLink} target="_blank" rel="noreferrer" className="rounded-full bg-amber-400 px-6 py-3 font-bold text-slate-950">
          <CloudSun className="mr-2 inline" size={18} /> Météo
        </a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-slate-400">
      © 2026 LVPSA — Ligue de volleyball de plage de St-Augustin.
    </footer>
  );
}
function Ligue() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <h1 className="text-4xl font-black">Informations sur la ligue</h1>
      <p className="mt-4 text-slate-300">
        La LVPSA offre un volet récréatif le lundi soir et un volet compétitif le mardi soir au parc Portneuf.
      </p>
    </section>
  );
}

function InscriptionLigue() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <h1 className="text-4xl font-black">Inscription à la ligue</h1>
      <p className="mt-4 text-slate-300">
        Les inscriptions pour la saison 2026 sont maintenant terminées.
      </p>
      <p className="mt-4 text-slate-300">
        Pour donner votre nom comme remplaçant, écrivez à{" "}
        <a className="font-bold text-amber-300" href="mailto:liguevpsa@gmail.com">
          liguevpsa@gmail.com
        </a>.
      </p>
    </section>
  );
}

function GestionEquipe() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <h1 className="text-4xl font-black">Gestion d’équipe</h1>
      <p className="mt-4 text-slate-300">
        Cette section servira plus tard aux capitaines pour gérer leur équipe, les présences et les résultats.
      </p>
    </section>
  );
}

function ReglementsTournoi() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <h1 className="text-4xl font-black">Règlements du tournoi</h1>
      <p className="mt-4 text-slate-300">
        Les règlements du tournoi seront ajoutés ici.
      </p>
    </section>
  );
}
