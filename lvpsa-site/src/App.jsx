import React, { useEffect, useState } from "react";
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
          <img src="/logo.jpg" className="h-20 w-20 rounded-full bg-white object-cover" />
          <div>
            <p className="text-2xl font-black">LVPSA</p>
            <p className="text-sm text-slate-300">Volleyball de plage de St-Augustin</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-200 md:flex">
          <Link to="/" className="hover:text-amber-300">Accueil</Link>
          <Dropdown title="Ligue" items={[
            { label: "Informations", to: "/ligue" },
            { label: "Classements", to: "/classements" },
            { label: "Règlements", to: "/reglements" },
            { label: "Inscription", to: "/inscription-ligue" },
            { label: "Gestion d’équipe", to: "/gestion-equipe" },
          ]} />
          <Dropdown title="Tournoi" items={[
            { label: "Informations", to: "/tournoi" },
            { label: "Inscription", href: "https://forms.gle/csLUt6NmcjNADcBm7" },
            { label: "Règlements", to: "/reglements-tournoi" },
          ]} />
          <Link to="/membres" className="rounded-full border border-white/15 px-5 py-2 hover:bg-white/10 hover:text-amber-300">Connexion</Link>
          <Link to="/contact" className="hover:text-amber-300">Contact</Link>
        </nav>
      </div>
    </header>
  );
}

function Dropdown({ title, items }) {
  return (
    <div className="relative group">
      <button className="hover:text-amber-300 transition">
        {title} ▾
      </button>

      <div className="absolute left-0 top-full pt-3 hidden group-hover:block">
        <div className="w-64 rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
          {items.map((item, index) =>
            item.href ? (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className={`block px-5 py-3 hover:bg-slate-800 ${
                  index === 0 ? "rounded-t-2xl" : ""
                } ${index === items.length - 1 ? "rounded-b-2xl" : ""}`}
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.label}
                to={item.to}
                className={`block px-5 py-3 hover:bg-slate-800 ${
                  index === 0 ? "rounded-t-2xl" : ""
                } ${index === items.length - 1 ? "rounded-b-2xl" : ""}`}
              >
                {item.label}
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  );
}

function Accueil() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(250,204,21,0.22),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.22),transparent_35%)]" />
        <div className="absolute inset-0 bg-slate-950/80" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-300/40 bg-amber-300/10 px-5 py-2 text-sm font-semibold text-amber-200">
              <Calendar size={16} /> Saison 2026 · Beach vibes
            </div>

            <h1 className="text-5xl font-black leading-tight md:text-7xl">
              Plus qu’une ligue.
              <span className="block text-amber-300">Une ambiance.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
              La LVPSA rassemble les passionnés de volleyball de plage à St-Augustin
              dans une atmosphère sportive, estivale et conviviale.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/classements"
                className="rounded-full bg-amber-400 px-7 py-3 text-center font-bold text-slate-950 shadow-lg shadow-amber-400/20 hover:bg-amber-300"
              >
                Voir les classements
              </Link>

              <Link
                to="/tournoi"
                className="rounded-full border border-white/15 px-7 py-3 text-center font-semibold hover:bg-white/10"
              >
                Tournoi 18 juillet
              </Link>
            </div>

            <p className="mt-6 text-sm text-slate-400">
              Inscriptions de la ligue terminées · Remplaçants :{" "}
              <a className="font-bold text-amber-300" href={`mailto:${email}`}>
                {email}
              </a>
            </p>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl">
            <img
              src="/volley-bg.jpg"
              alt="LVPSA"
              className="h-full min-h-[620px] w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

            <div className="absolute inset-0 flex flex-col justify-end p-8">
              <div className="rounded-3xl border border-white/10 bg-black/30 p-6 backdrop-blur-md">
                <p className="text-sm uppercase tracking-[0.3em] text-amber-300">
                  LVPSA • Saison 2026
                </p>

                <h2 className="mt-3 text-5xl font-black leading-tight">
                  Volleyball.
                  <br />
                  Été.
                  <br />
                  Ambiance.
                </h2>

                <p className="mt-5 max-w-md text-slate-200">
                  Une ligue locale où compétition, plaisir et communauté se
                  rencontrent chaque semaine.
                </p>

                <div className="mt-8">
                  <Link
                    to="/tournoi"
                    className="inline-flex rounded-full bg-amber-400 px-7 py-3 font-bold text-slate-950 hover:bg-amber-300"
                  >
                    Découvrir le tournoi
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

<section className="mx-auto max-w-7xl px-6 py-16">
  <div className="grid gap-6 md:grid-cols-4">
    <HomeCard
      title="Classements"
      text="Suivez les résultats récréatifs et compétitifs."
      link="/classements"
      label="Voir"
    />

    <HomeCard
      title="Tournoi"
      text="Inscription au tournoi du 18 juillet 2026."
      link="/tournoi"
      label="Découvrir"
    />

    <HomeCard
      title="Remplaçants"
      text="Donnez votre nom pour remplacer pendant la saison."
      link="/inscription-ligue"
      label="Infos"
    />

    <HomeCard
      title="Contact"
      text="Questions, météo ou informations générales."
      link="/contact"
      label="Contacter"
    />

   <div className="mb-8 overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl">
  <iframe
    src="https://www.meteoblue.com/fr/meteo/widget/daily/saint-augustin-de-desmaures_canada_6138057?geoloc=fixed&days=1&tempunit=CELSIUS&windunit=KILOMETER_PER_HOUR&layout=image"
    frameBorder="0"
    scrolling="NO"
    allowTransparency="true"
    className="h-[220px] w-full"
  />
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

      <div className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-white" style={{ height: "310px" }}>
  <iframe
    src={lien}
    title={titre}
    width="100%"
    height="260"
    style={{
      border: "none",
      display: "block",
      transform: "translateY(0px)",
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

function HomeCard({ title, text, link, label }) {
  return (
    <Link
      to={link}
      className="rounded-3xl border border-white/10 bg-white/10 p-6 transition hover:-translate-y-1 hover:bg-white/15"
    >
      <h3 className="text-xl font-black">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-300">{text}</p>
      <p className="mt-5 font-bold text-amber-300">{label} →</p>
    </Link>
  );
}

function MeteoJour() {
  const [meteo, setMeteo] = useState(null);

  useEffect(() => {
    fetch("https://api.open-meteo.com/v1/forecast?latitude=46.74&longitude=-71.45&current=temperature_2m,precipitation,wind_speed_10m&timezone=America%2FToronto")
      .then((res) => res.json())
      .then((data) => setMeteo(data.current))
      .catch(() => setMeteo(null));
  }, []);

  if (!meteo) return null;

  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-6">
      <p className="text-sm font-bold uppercase tracking-wider text-amber-300">
        Météo du jour
      </p>
      <h3 className="mt-2 text-3xl font-black">
        {Math.round(meteo.temperature_2m)}°C
      </h3>
      <p className="mt-2 text-slate-300">
        Vent : {Math.round(meteo.wind_speed_10m)} km/h
      </p>
      <p className="text-slate-300">
        Précipitations : {meteo.precipitation} mm
      </p>
      <a
        href="https://www.meteomedia.com/ca/meteo/quebec/saint-augustin-de-desmaures"
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-block font-bold text-amber-300"
      >
        Voir MétéoMédia →
      </a>
    </div>
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
