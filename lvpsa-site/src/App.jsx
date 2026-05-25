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
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.jpg" className="h-24 w-24 rounded-full bg-white object-cover" />
          <div>
            <p className="text-xl font-black">LVPSA</p>
            <p className="text-sm text-slate-300">Volleyball de plage de St-Augustin</p>
          </div>
        </Link>

        <nav className="hidden gap-6 text-sm text-slate-300 md:flex">
          <Link to="/">Accueil</Link>
          <Link to="/classements">Classements</Link>
          <Link to="/tournoi">Tournoi</Link>
          <Link to="/reglements">Règlements</Link>
          <Link to="/membres">Membres</Link>
          <Link to="/contact">Contact</Link>
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
      <p className="font-bold uppercase tracking-wider text-amber-300">Classements</p>
      <h1 className="mt-2 text-4xl font-black">Choisissez un classement</h1>
      <p className="mt-4 text-slate-300">
        Sélectionnez le calibre désiré pour voir uniquement le tableau correspondant.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <ClassementCard titre="Récréatif" lien="/classements/recreatif" />
        <ClassementCard titre="Compétitif" lien="/classements/competitif" />
        <ClassementCard titre="Facebook" lien="/classements/facebook" />
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
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <Link to="/classements" className="text-amber-300">← Retour aux classements</Link>
      <h1 className="mt-6 text-4xl font-black">{titre}</h1>
      <p className="mt-4 text-slate-300">
        Pour afficher uniquement ce tableau ici, il faudra publier l’onglet Google Sheets correspondant et utiliser son lien d’intégration.
      </p>

      <div className="mt-8 rounded-3xl border border-white/10 bg-white/10 p-8">
        <p className="text-slate-300">
          Tableau à intégrer ici.
        </p>

        <a
          href={sheetLink}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber-400 px-7 py-3 font-bold text-slate-950"
        >
          Ouvrir le fichier officiel <ExternalLink size={18} />
        </a>
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
            Coût d’inscription : 100 $ par équipe.
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
