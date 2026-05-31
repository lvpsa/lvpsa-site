import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import { auth, db } from "./firebase";

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from "firebase/auth";

import { doc, getDoc, setDoc } from "firebase/firestore";

import {
  Calendar,
  Trophy,
  Mail,
  MapPin,
  ExternalLink,
 CheckCircle2,
  CloudSun,
  Lock,
  LogIn,
} from "lucide-react";
import "./index.css";
import emailjs from "@emailjs/browser";

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
          <Route path="/boutique" element={<BoutiqueProtegee />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/reglements" element={<Reglements />} />
          <Route path="/ligue" element={<Ligue />} />
          <Route path="/inscription-ligue" element={<InscriptionLigue />} />
          <Route path="/gestion-equipe" element={<GestionEquipe />} />
          <Route path="/reglements-tournoi" element={<ReglementsTournoi />} />
          <Route path="/connexion" element={<Membres />} />
          <Route path="/membres" element={<Membres />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/calendrier" element={<Calendrier />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-4">
          <img
            src="/logo.jpg"
            alt="LVPSA"
            className="h-20 w-20 rounded-full object-cover"
          />

          <div>
            <h1 className="text-4xl font-black tracking-tight text-white">
              LVPSA
            </h1>

            <p className="text-xl text-slate-300">
              Volleyball de plage de St-Augustin
            </p>
          </div>
        </Link>

        {/* MENU DESKTOP */}
        <nav className="hidden items-center gap-8 text-sm font-medium text-white md:flex">

          <Link to="/" className="hover:text-amber-300">
            Accueil
          </Link>

<div className="group relative">
  <button className="flex items-center gap-1 hover:text-amber-300">
    Ligue
  </button>

  <div className="absolute hidden min-w-[220px] rounded-2xl border border-white/10 bg-slate-900 p-3 shadow-2xl group-hover:block">
    <Link
      to="/calendrier"
      className="block rounded-xl px-3 py-2 hover:bg-white/10"
    >
      Calendrier
    </Link>

    <Link
      to="/classements"
      className="block rounded-xl px-3 py-2 hover:bg-white/10"
    >
      Classements
    </Link>

    <Link
      to="/reglements"
      className="block rounded-xl px-3 py-2 hover:bg-white/10"
    >
      Règlements
    </Link>
  </div>
</div>

          <div className="group relative">
            <button className="flex items-center gap-1 hover:text-amber-300">
              Tournoi
            </button>

            <div className="absolute hidden min-w-[220px] rounded-2xl border border-white/10 bg-slate-900 p-3 shadow-2xl group-hover:block">
              <Link
                to="/tournoi"
                className="block rounded-xl px-3 py-2 hover:bg-white/10"
              >
                Informations
              </Link>

              <Link
                to="/tournoi/reglements"
                className="block rounded-xl px-3 py-2 hover:bg-white/10"
              >
                Règlements
              </Link>
            </div>
          </div>

          <Link to="/boutique" className="hover:text-amber-300">
  Boutique
</Link>

<Link
  to="/admin"
  className="rounded-full border border-white/15 px-6 py-3 hover:border-amber-300 hover:text-amber-300"
>
  Connexion
</Link>

          <Link to="/contact" className="hover:text-amber-300">
            Contact
          </Link>
        </nav>

        {/* BOUTON MOBILE */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-xl border border-white/10 p-3 text-white md:hidden"
        >
          ☰
        </button>
      </div>

      {/* MENU MOBILE */}
      {menuOpen && (
        <div className="border-t border-white/10 bg-slate-950 px-6 py-4 md:hidden">

          <div className="flex flex-col gap-4 text-white">

            <Link to="/" onClick={() => setMenuOpen(false)}>
              Accueil
            </Link>

                        <Link to="/calendrier" onClick={() => setMenuOpen(false)}>
              Calendrier
            </Link>
            
            <Link to="/classements" onClick={() => setMenuOpen(false)}>
              Classements
            </Link>

            <Link to="/reglements" onClick={() => setMenuOpen(false)}>
              Règlements Ligue
            </Link>

            <Link to="/tournoi" onClick={() => setMenuOpen(false)}>
              Tournoi
            </Link>

            <Link
              to="/tournoi/reglements"
              onClick={() => setMenuOpen(false)}
            >
              Règlements Tournoi
            </Link>

            <Link to="/boutique" onClick={() => setMenuOpen(false)}>
              Boutique
            </Link>

            <Link to="/admin" onClick={() => setMenuOpen(false)}>
              Connexion
            </Link>

            <Link to="/contact" onClick={() => setMenuOpen(false)}>
              Contact
            </Link>

          </div>
        </div>
      )}
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
const statutMatchs = {
  texte: "Les parties ont lieu ce soir",
  couleur: "emerald",
  message: "Mise à jour officielle LVPSA",
};

function Accueil() {
const [statutMatchs, setStatutMatchs] = useState({
  texte: "Chargement...",
  couleur: "emerald",
  message: "LVPSA",
});

const [meteoHeures, setMeteoHeures] = useState([]);

useEffect(() => {
  async function chargerStatut() {
    const ref = doc(db, "settings", "matchStatus");
    const snap = await getDoc(ref);

    if (snap.exists()) {
      setStatutMatchs(snap.data());
    }
  }

  async function chargerMeteo() {
    const url =
      "https://api.open-meteo.com/v1/forecast?latitude=46.74&longitude=-71.45&hourly=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m&timezone=America%2FToronto&forecast_days=1";

    const res = await fetch(url);
    const data = await res.json();

    const heuresVoulues = ["18:00", "19:00", "20:00", "21:00", "22:00"];

    const resultats = data.hourly.time
      .map((time, index) => ({
        time,
        heure: time.slice(11, 16),
        temperature: Math.round(data.hourly.temperature_2m[index]),
        vent: Math.round(data.hourly.wind_speed_10m[index]),
        humidite: data.hourly.relative_humidity_2m[index],
        code: data.hourly.weather_code[index],
      }))
      .filter((item) => heuresVoulues.includes(item.heure));

    setMeteoHeures(resultats);
  }

  chargerStatut();
  chargerMeteo();
}, []);

  return (
    <>
      <section className="relative overflow-hidden px-6 py-16">
        <div className="mx-auto max-w-7xl">

          <div className="grid gap-8 lg:grid-cols-2">

            {/* COLONNE GAUCHE */}
            <div>

              {/* STATUT + MÉTÉO */}
              <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-sky-500/20 to-slate-900/40 p-6 backdrop-blur-xl">

                <div
  className={`mb-5 rounded-2xl border p-4 ${
    statutMatchs.couleur === "red"
      ? "border-red-400/30 bg-red-400/10"
      : "border-emerald-400/30 bg-emerald-400/10"
  }`}
>
                  <p
  className={`text-sm uppercase tracking-[0.25em] ${
    statutMatchs.couleur === "red"
      ? "text-red-300"
      : "text-emerald-300"
  }`}
>
                    Statut des parties
                  </p>

                  <h3 className="mt-2 text-2xl font-black text-white">
                    {statutMatchs.texte}
                  </h3>

                  <p className="mt-1 text-sm text-slate-300">
                    {statutMatchs.message}
                  </p>
                </div>

                <p className="text-sm uppercase tracking-[0.25em] text-amber-300">
                  Météo des prochaines heures
                </p>

                <div className="mt-5 grid grid-cols-5 gap-3">
                  {meteoHeures.length > 0 ? (
  meteoHeures.map((item) => (
    <div key={item.heure} className="rounded-2xl bg-white/10 p-3 text-center">
      <p className="text-sm text-slate-300">{item.heure.replace(":00", "h")}</p>
      <p className="mt-2 text-3xl">
        {item.code < 3 ? "☀️" : item.code < 60 ? "☁️" : "🌧️"}
      </p>
      <p className="mt-2 text-xl font-black">{item.temperature}°</p>
    </div>
  ))
) : (
  <p className="col-span-5 text-sm text-slate-300">
    Chargement de la météo...
  </p>
)}
                    
                </div>

                <div className="mt-6 flex gap-4 text-sm text-slate-300">
                  <div className="rounded-xl bg-white/10 px-4 py-2">
                    Vent : {meteoHeures[0]?.vent ?? "--"} km/h
                  </div>

                  <div className="rounded-xl bg-white/10 px-4 py-2">
                    Humidité : {meteoHeures[0]?.humidite ?? "--"}%
                  </div>
                </div>
              </div>

             {/* SLOGAN */}
<div className="mt-10">
  <h1 className="text-5xl font-black leading-tight md:text-7xl">
    Plus qu’une ligue.
    <span className="block text-amber-300">
      Une ambiance.
    </span>
  </h1>

  <div className="mt-10 relative overflow-hidden rounded-[2rem] border border-white/10 h-[320px]">
    <img
      src="/volley-bg.jpg"
      alt="Terrain LVPSA"
      className="h-full w-full object-cover"
    />

    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"></div>

    <div className="absolute bottom-6 left-6">
      <p className="text-sm uppercase tracking-[0.25em] text-amber-300">
        Parc Portneuf
      </p>

      <h3 className="mt-2 text-3xl font-black text-white">
        Terrain officiel LVPSA
      </h3>
    </div>
  </div>
</div>
  </div>
            
            {/* COLONNE DROITE */}
            <div>

              {/* TOURNOI */}
              <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl">

                <img
                  src="/tournoi-lvpsa-2026.png"
                  alt="Tournoi LVPSA"
                  className="w-full h-auto"
                />

              
                <div className="flex gap-4 p-5">

                  <a
                    href={tournoiLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 rounded-full bg-amber-400 px-6 py-3 text-center font-bold text-slate-950 hover:bg-amber-300"
                  >
                    S’inscrire maintenant
                  </a>

                  <Link
                    to="/tournoi"
                    className="flex-1 rounded-full border border-white/15 px-6 py-3 text-center font-semibold hover:bg-white/10"
                  >
                    Voir les détails
                  </Link>
                </div>
              </div>

              {/* TEXTE */}
              <div className="mt-10">
                <p className="max-w-xl text-lg leading-8 text-slate-300">
                  La LVPSA rassemble les passionnés de volleyball de plage à
                  St-Augustin dans une atmosphère sportive, estivale et
                  conviviale.
                </p>
              </div>
            </div>
          </div>

          {/* CARTES BAS */}
          <div className="mt-14 grid gap-6 md:grid-cols-4">

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-400 text-slate-950">
                👥
              </div>

              <h3 className="text-2xl font-black">
                Une communauté passionnée
              </h3>

              <p className="mt-3 text-slate-300">
                Des joueurs de tous les niveaux réunis par la même passion du volleyball de plage.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-400 text-slate-950">
                🏆
              </div>

              <h3 className="text-2xl font-black">
                Compétition et plaisir
              </h3>

              <p className="mt-3 text-slate-300">
                Des ligues compétitives et récréatives pour tous les profils.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-400 text-slate-950">
                📅
              </div>

              <h3 className="text-2xl font-black">
                Saison estivale
              </h3>

              <p className="mt-3 text-slate-300">
                Des matchs tout l’été dans un cadre exceptionnel.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-400 text-slate-950">
                📍
              </div>

              <h3 className="text-2xl font-black">
                Un site exceptionnel
              </h3>

              <p className="mt-3 text-slate-300">
                Le Parc Portneuf, un terrain de jeu unique au bord de l’eau.
              </p>
            </div>
          </div>

          {/* BAS */}
          <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 px-6 py-5 text-slate-300">
            Inscriptions de la ligue terminées · Remplaçants :
            <a
              className="ml-2 font-bold text-amber-300"
              href={`mailto:${email}`}
            >
              {email}
            </a>
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

    <div className="mt-10 flex justify-center">
  <div className="overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl bg-white p-6">
    <iframe
      src={lien}
      title={titre}
      width="950"
      height="320"
      style={{
        border: "none",
        display: "block",
      }}
    />
  </div>
</div>
    </section>
  );
}

function Tournoi() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="inline-flex rounded-full border border-amber-400/30 bg-amber-400/10 px-5 py-2 text-sm font-bold uppercase tracking-wider text-amber-300">
            🏆 Tournoi LVPSA 2026
          </div>

          <h1 className="mt-8 text-6xl font-black leading-tight text-white md:text-7xl">
            Tournoi de
            <span className="block text-amber-300">volleyball</span>
            <span className="block">de plage</span>
          </h1>

          <p className="mt-6 max-w-xl text-xl leading-8 text-slate-300">
            Rejoignez-nous pour une journée de compétition, de plaisir et
            d’ambiance estivale sur le sable.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-center">
              <div className="text-amber-300">📅</div>
              <p className="mt-2 text-sm font-bold uppercase text-amber-300">
                Date
              </p>
              <p className="mt-2 text-3xl font-black">18</p>
              <p className="font-bold">juillet 2026</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-center">
              <div className="text-amber-300">🗺</div>
              <p className="mt-2 text-sm font-bold uppercase text-amber-300">
                Parc Portneuf
              </p>
               <p className="font-bold">St-Augustin-de-Desmaures</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-center">
              <div className="text-amber-300">🎁</div>
              <p className="mt-2 text-sm font-bold uppercase text-amber-300">
                Bourses
              </p>
              <p className="mt-2 text-3xl font-black">prix</p>
              <p className="font-bold">de présence</p>
            </div>
          </div>

          <a
            href="https://forms.gle/csLUt6NmcjNADcBm7"
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex rounded-full bg-amber-400 px-10 py-4 text-lg font-black text-slate-950 hover:bg-amber-300"
          >
            S’inscrire maintenant ↗
          </a>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white shadow-2xl">
          <img
            src="/tournoi-lvpsa-2026.png"
            alt="Tournoi LVPSA"
            className="w-full h-auto"
          />
        </div>
      </div>

      <div className="mt-20 grid gap-8 lg:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-3xl font-black text-amber-300">
            2 catégories
          </h2>

          <div className="mt-6 space-y-4 text-slate-300">
            <p>
              🏆 <span className="font-bold text-white">Compétitif :</span>{" "}
              pour les équipes qui veulent se dépasser et jouer pour gagner.
            </p>

            <p>
              😎 <span className="font-bold text-white">Récréatif :</span>{" "}
              pour le plaisir, l’ambiance et le jeu sans pression.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-3xl font-black text-amber-300">
            Format du tournoi
          </h2>

          <ul className="mt-6 space-y-3 text-slate-300">
            <li>✅ Tournoi sur 1 journée</li>
            <li>✅ Matchs en continu de 8 h à 20 h</li>
            <li>✅ Phase préliminaire : 2 sets de 15 points</li>
            <li>✅ Séries éliminatoires : 2 sets de 21 points</li>
          </ul>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-3xl font-black text-amber-300">
            Sur place
          </h2>

          <ul className="mt-6 space-y-3 text-slate-300">
            <li>🍔 BBQ et nourriture</li>
            <li>🥤 Boissons froides</li>
            <li>🍉 Collations et fruits</li>
            <li>🎵 Musique d’ambiance</li>
            <li>🏖️ Zone détente</li>
          </ul>
        </div>
      </div>

      <div className="mt-12 rounded-3xl border border-amber-400/20 bg-amber-400/10 p-8 text-center">
        <h2 className="text-3xl font-black text-amber-300">
          Bourses aux équipes gagnantes
        </h2>

        <p className="mt-3 text-lg text-slate-300">
          Une journée complète pour jouer, encourager, profiter de l’ambiance et
          célébrer le volleyball de plage à Saint-Augustin.
        </p>
      </div>
    </section>
  );
}

function Reglements() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">

      <p className="font-bold uppercase tracking-wider text-amber-300">
        LVPSA 2026
      </p>

      <h1 className="mt-2 text-5xl font-black">
        Règlements de la ligue
      </h1>

      <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
        Voici les règlements officiels de la Ligue de Volleyball de Plage
        de St-Augustin pour la saison 2026.
      </p>

      <div className="mt-14 grid gap-8 lg:grid-cols-2">

        {/* FORMAT */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-3xl font-black text-amber-300">
            Format des équipes
          </h2>

          <ul className="mt-6 space-y-4 text-slate-300">
            <li>• 4 contre 4 avec au moins une fille sur le terrain en tout temps</li>
            <li>• Une équipe peut avoir plus de 4 joueurs</li>
            <li>• Seulement 4 joueurs sur le terrain à la fois</li>
            <li>• Les équipes doivent trouver leurs remplaçants</li>
            <li>• Une équipe à 3 joueurs utilisera un joueur fantôme</li>
          </ul>
        </div>

        {/* INTERDICTIONS */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-3xl font-black text-amber-300">
            Interdictions
          </h2>

          <ul className="mt-6 space-y-4 text-slate-300">
            <li>• Bloquer une fille sur un mouvement d'attaque</li>
            <li>• Traverser la balle en tips ou touches, (touches permises récréatif)</li>
            <li>• Toucher le filet</li>
            <li>• Traverser de l’autre côté</li>
            <li>• Faire un transport</li>
          </ul>
        </div>

        {/* RÈGLES */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-3xl font-black text-amber-300">
            Règles de jeu
          </h2>

          <ul className="mt-6 space-y-4 text-slate-300">
            <li>• Deux joueurs avant et deux joueurs arrière</li>
            <li>• Rotation obligatoire</li>
            <li>• Les joueurs arrière attaquent derrière la ligne de 3 mètres</li>
            <li>• Deux sets de 25 points par match</li>
            <li>• Chaque équipe joue deux matchs par soir</li>
          </ul>
        </div>

        {/* AUTO-ARBITRAGE */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-3xl font-black text-amber-300">
            Auto-arbitrage
          </h2>

          <ul className="mt-6 space-y-4 text-slate-300">
            <li>• Les situations ''zone grises'' sont reprises</li>
            <li>• Les équipes doivent rester respectueuses</li>
            <li>• Le capitaine gagnant transmet les résultats</li>
            <li>• L’esprit sportif est prioritaire</li>
          </ul>
        </div>
      </div>

      {/* TOURNOI */}
      <div className="mt-10 rounded-3xl border border-amber-300/20 bg-amber-300/10 p-8">
        <h2 className="text-3xl font-black text-amber-300">
          Tournoi des séries
        </h2>

        <div className="mt-6 grid gap-6 md:grid-cols-2 text-slate-200">

          <div>
            <h3 className="text-xl font-bold">
              Remplaçants autorisés
            </h3>

            <ul className="mt-4 space-y-3 text-slate-300">
              <li>• Un gars ayant joué au moins 3 fois</li>
              <li>• Une fille ayant joué au moins 1 fois</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold">
              Dépôt de présence
            </h3>

            <p className="mt-4 text-slate-300 leading-7">
              Le dépôt de 100$ est remboursé aux équipes présentes
              toute la saison et au tournoi des séries.
            </p>
          </div>
        </div>
      </div>

      {/* MÉTÉO */}
      <div className="mt-10 rounded-3xl border border-sky-400/20 bg-sky-400/10 p-8">
        <h2 className="text-3xl font-black text-sky-300">
          Politique météo
        </h2>

        <p className="mt-5 max-w-3xl leading-8 text-slate-300">
          S’il pleut, les matchs ont lieu normalement.
          En cas d’orage, les parties seront reportées si possible.
        </p>
      </div>

    </section>
  );
}

function Membres() {
  return (
    <section className="bg-white py-16 text-slate-950">
      <div className="mx-auto max-w-7xl px-6">
        <h1 className="text-4xl font-black">Espace Admin</h1>
        <p className="mt-4 text-slate-600">
          Accès réservé aux administrateurs.
        </p>

        <div className="mt-8 max-w-xl rounded-3xl border bg-slate-50 p-6">
          <Lock className="mb-4" />
          <h2 className="text-2xl font-black">Connexion</h2>
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
      <p className="font-bold uppercase tracking-wider text-amber-300">
        Nous joindre
      </p>

      <h1 className="mt-2 text-5xl font-black">
        Contact LVPSA
      </h1>

      <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
        Pour toute question concernant la ligue, les horaires, les remplacements, les inscriptions ou les partenariats, communiquez avec l’équipe LVPSA.
      </p>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-3xl font-black text-amber-300">
            Coordonnées
          </h2>

          <div className="mt-6 space-y-5 text-slate-300">
            <p>
              <span className="font-bold text-white">Courriel : </span>
              <a
                href="mailto:liguevpsa@gmail.com"
                className="text-amber-300 hover:underline"
              >
                liguevpsa@gmail.com
              </a>
            </p>

            <p>
              <span className="font-bold text-white">Lieu : </span>
              Parc Portneuf, Saint-Augustin-de-Desmaures
            </p>

            <p>
              <span className="font-bold text-white">Saison : </span>
              Mai à août 2026
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-3xl font-black text-amber-300">
            Partenariats
          </h2>

          <p className="mt-4 text-slate-300">
           Vous souhaitez devenir commanditaire et contribuer à promouvoir l’activité physique,
            les saines habitudes de vie et le volleyball de plage auprès des gens de notre région?
            Nous sommes toujours ouverts aux partenariats qui permettent de faire grandir notre communauté sportive.
          </p>

          <a
            href="mailto:liguevpsa@gmail.com?subject=Partenariat%20LVPSA"
            className="mt-6 inline-flex rounded-full bg-amber-400 px-8 py-3 font-bold text-slate-950 hover:bg-amber-300"
          >
            Devenir partenaire
          </a>
        </div>
      </div>

      <div className="mt-16 rounded-3xl border border-white/10 bg-white/5 p-8">
        <h2 className="text-3xl font-black">
          Nos commanditaires
        </h2>

        <p className="mt-3 text-slate-300">
          Merci à nos partenaires qui contribuent au développement de la LVPSA.
        </p>

<div className="mt-8 grid gap-6 md:grid-cols-3">

  <div className="rounded-3xl border border-white/10 bg-white p-8 flex items-center justify-center">
    <img
      src="/Applied.png"
      alt="Applied Industrial Technologies"
      className="max-h-28 object-contain"
    />
  </div>

  <div className="rounded-3xl border border-white/10 bg-white p-8 flex items-center justify-center">
    <img
      src="/Canac.png"
      alt="Canac"
      className="max-h-28 object-contain"
    />
  </div>

  <div className="rounded-3xl border border-white/10 bg-white p-8 flex items-center justify-center">
   <img
  src="/VSAD.png"
  alt="Ville de Saint-Augustin-de-Desmaures"
  className="max-h-40 w-full object-contain"
/>
          </div>
 <div className="mt-16 rounded-3xl border border-white/10 bg-gradient-to-r from-blue-600/20 to-blue-400/10 p-10 text-center">
  <h2 className="text-3xl font-black">
    Suivez la LVPSA
  </h2>

  <p className="mt-4 max-w-2xl mx-auto text-slate-300">
    Pour ne rien manquer!
  </p>

  <a
    href="https://www.facebook.com/profile.php?id=61572358300215&locale=fr_CA"
    target="_blank"
    rel="noreferrer"
    className="mt-6 inline-flex rounded-full bg-amber-400 px-8 py-3 font-bold text-slate-950 hover:bg-amber-300"
  >
    Visiter la page LVPSA
  </a>
</div>
        </div>
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

function Admin() {
  const [emailAdmin, setEmailAdmin] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [statut, setStatut] = useState({
  texte: "Les parties ont lieu ce soir",
  couleur: "emerald",
  message: "Mise à jour officielle LVPSA",
});

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {

    if (currentUser) {
      setUser(currentUser);

      const snap = await getDoc(doc(db, "settings", "matchStatus"));

      if (snap.exists()) {
        setStatut(snap.data());
      }
    }
  });

  return () => unsubscribe();
}, []);

  async function connexion() {
  try {
    await setPersistence(auth, browserLocalPersistence);

    const result = await signInWithEmailAndPassword(
      auth,
      emailAdmin,
      password
    );

    setUser(result.user);

    const snap = await getDoc(doc(db, "settings", "matchStatus"));
    if (snap.exists()) setStatut(snap.data());
  } catch (error) {
    alert("Erreur de connexion : " + error.message);
  }
}

  async function sauvegarder() {
    await setDoc(doc(db, "settings", "matchStatus"), statut);
    alert("Statut mis à jour !");
  }

  async function deconnexion() {
    await signOut(auth);
    setUser(null);
  }

  if (!user) {
    return (
      <section className="mx-auto max-w-xl px-6 py-20">
        <h1 className="text-4xl font-black">Connexion admin</h1>

        <input
          className="mt-8 w-full rounded-2xl border px-4 py-3 text-slate-950"
          placeholder="Courriel"
          value={emailAdmin}
          onChange={(e) => setEmailAdmin(e.target.value)}
        />

        <input
          className="mt-3 w-full rounded-2xl border px-4 py-3 text-slate-950"
          placeholder="Mot de passe"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={connexion}
          className="mt-5 w-full rounded-full bg-amber-400 px-6 py-3 font-bold text-slate-950"
        >
          Se connecter
        </button>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black">Administration LVPSA</h1>
        <button onClick={deconnexion} className="text-amber-300">
          Déconnexion
        </button>
      </div>

      <div className="mt-10 rounded-3xl border border-white/10 bg-white/10 p-6">
        <h2 className="text-2xl font-black">Statut des parties</h2>

        <label className="mt-6 block text-sm text-slate-300">Texte principal</label>
        <select
  className="mt-2 w-full rounded-2xl border px-4 py-3 text-slate-950"
  value={statut.texte}
  onChange={(e) => setStatut({ ...statut, texte: e.target.value })}
>
  <option value="Les parties ont lieu ce soir">
    Les parties ont lieu ce soir
  </option>

  <option value="Les parties sont annulées ce soir">
    Les parties sont annulées ce soir
  </option>
</select>

        <label className="mt-5 block text-sm text-slate-300">Message secondaire</label>
        <input
          className="mt-2 w-full rounded-2xl border px-4 py-3 text-slate-950"
          value={statut.message}
          onChange={(e) => setStatut({ ...statut, message: e.target.value })}
        />

        <label className="mt-5 block text-sm text-slate-300">Couleur</label>
        <select
          className="mt-2 w-full rounded-2xl border px-4 py-3 text-slate-950"
          value={statut.couleur}
          onChange={(e) => setStatut({ ...statut, couleur: e.target.value })}
        >
          <option value="emerald">Vert — parties confirmées</option>
          <option value="red">Rouge — parties annulées</option>
        </select>

        <button
          onClick={sauvegarder}
          className="mt-8 rounded-full bg-amber-400 px-7 py-3 font-bold text-slate-950"
        >
          Sauvegarder le statut
        </button>
      </div>
    </section>
  );
}

function BoutiqueProtegee() {
  const [user, setUser] = useState(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setChargement(false);
    });

    return () => unsubscribe();
  }, []);

  if (chargement) {
    return null;
  }

  if (!user) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="text-5xl font-black">Boutique en préparation</h1>
        <p className="mt-6 text-slate-300">
          La boutique LVPSA sera disponible bientôt.
        </p>
      </section>
    );
  }

  return <Boutique />;
}

function Boutique() {

  const [produitSelectionne, setProduitSelectionne] = useState(null);
const [popupCommande, setPopupCommande] = useState({
  taille: "M",
  couleur: "Noir",
  quantite: 1,
});
const produits = [
  { categorie: "T-shirts homme", modele: "1", image: "/tshirt-homme-1.png" },
  { categorie: "T-shirts homme", modele: "2", image: "/tshirt-homme-2.png" },
  { categorie: "T-shirts homme", modele: "3", image: "/tshirt-homme-3.png" },
  { categorie: "T-shirts homme", modele: "4", image: "/tshirt-homme-4.png" },
  { categorie: "T-shirts femme", modele: "1", image: "/tshirt-femme-1.png" },
  { categorie: "T-shirts femme", modele: "2", image: "/tshirt-femme-2.png" },
  { categorie: "T-shirts femme", modele: "3", image: "/tshirt-femme-3.png" },
  { categorie: "T-shirts femme", modele: "4", image: "/tshirt-femme-4.png" },

  { categorie: "Camisoles homme", modele: "1", image: "/camisole-homme-1.png" },
  { categorie: "Camisoles homme", modele: "2", image: "/camisole-homme-2.png" },
  { categorie: "Camisoles homme", modele: "3", image: "/camisole-homme-3.png" },
  { categorie: "Camisoles homme", modele: "4", image: "/camisole-homme-4.png" },
  { categorie: "Camisoles femme", modele: "1", image: "/camisole-femme-1.png" },
  { categorie: "Camisoles femme", modele: "2", image: "/camisole-femme-2.png" },
  { categorie: "Camisoles femme", modele: "3", image: "/camisole-femme-3.png" },
  { categorie: "Camisoles femme", modele: "4", image: "/camisole-femme-4.png" },

  { categorie: "Hoodies homme", modele: "1", image: "/hoodie-homme-1.png" },
  { categorie: "Hoodies homme", modele: "2", image: "/hoodie-homme-2.png" },
  { categorie: "Hoodies homme", modele: "3", image: "/hoodie-homme-3.png" },
  { categorie: "Hoodies homme", modele: "4", image: "/hoodie-homme-4.png" },
  { categorie: "Hoodies femme", modele: "1", image: "/hoodie-femme-1.png" },
  { categorie: "Hoodies femme", modele: "2", image: "/hoodie-femme-2.png" },
  { categorie: "Hoodies femme", modele: "3", image: "/hoodie-femme-3.png" },
  { categorie: "Hoodies femme", modele: "4", image: "/hoodie-femme-4.png" },
];

  const [commande, setCommande] = useState({
  articles: [],
  nom: "",
  courriel: "",
  telephone: "",
  notes: "",
});

  const retirerArticle = (index) => {
  const nouveauxArticles = commande.articles.filter((_, i) => i !== index);
  setCommande({ ...commande, articles: nouveauxArticles });
};
  
const envoyerCommande = () => {
  const resumeCommande = commande.articles
    .map(
      (article, index) =>
        `Article #${index + 1} : ${article.categorie} | Modèle ${article.modele} | Taille ${article.taille} | Quantité ${article.quantite}`
    )
    .join("\n");

  const params = {
    nom: commande.nom,
    courriel: commande.courriel,
    telephone: commande.telephone,
    commande: resumeCommande,
    notes: commande.notes,
    to_email: commande.courriel,
  };

  Promise.all([
    emailjs.send(
      "service_f4h3rii",
      "template_nwl643g",
      params,
      "ZooBSx9i6qVl5HI8T"
    ),

    emailjs.send(
      "service_f4h3rii",
      "template_c5ab7bt",
      params,
      "ZooBSx9i6qVl5HI8T"
    ),
  ])
   .then(() => {
  alert("Commande envoyée avec succès !");

  setCommande({
    articles: [],
    nom: "",
    courriel: "",
    telephone: "",
    notes: "",
  });

  setProduitSelectionne(null);
})
    .catch((error) => {
      alert("Erreur lors de l’envoi de la commande. Veuillez réessayer.");
      console.error(error);
    });
};
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <p className="font-bold uppercase tracking-wider text-amber-300">
        LVPSA
      </p>

      <h1 className="mt-2 text-5xl font-black">Boutique</h1>

      <p className="mt-4 text-xl text-slate-300">
  Collection Beach Volleyball 2026
</p>

<div className="mt-8 mb-10 rounded-3xl border border-amber-400/20 bg-white/5 p-6">
  <h2 className="text-2xl font-black text-amber-300">
    Comment commander
  </h2>

  <p className="mt-3 text-slate-300">
    Cliquez simplement sur le vêtement désiré pour l'ajouter à votre commande.
    Une fenêtre s'ouvrira afin de sélectionner la taille et la quantité.
    Les articles sélectionnés apparaîtront automatiquement dans le résumé de la commande.
  </p>

</div>
      
      <div className="mt-10 overflow-hidden rounded-[2rem] border border-white/10 bg-white shadow-2xl">
  <img
    src="/boutique-lvpsa.png"
    alt="Collection LVPSA"
    className="w-full object-cover"
  />
</div>

     <div className="mt-12 space-y-10">
  {[
    ["T-shirts homme", "T-shirts femme"],
    ["Camisoles homme", "Camisoles femme"],
    ["Hoodies homme", "Hoodies femme"],
  ].map((rangee) => (
    <div key={rangee.join("-")}>
      <h2 className="mb-4 text-2xl font-black text-amber-300">
        {rangee.join(" / ")}
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-8">
        {produits
          .filter((produit) => rangee.includes(produit.categorie))
          .map((produit) => (
            <button
              key={`${produit.categorie}-${produit.modele}`}
              type="button"
              onClick={() => {
                setProduitSelectionne(produit);
                setPopupCommande({
                  taille: "M",
                  couleur: "Noir",
                  quantite: 1,
                });
              }}
              className="rounded-3xl border border-white/10 bg-white/5 p-3 text-left hover:border-amber-300"
            >
              <img
                src={produit.image}
                alt={`${produit.categorie} modèle ${produit.modele}`}
                className="h-40 w-full rounded-2xl object-cover bg-white/10"
              />

              <p className="mt-3 text-sm font-bold text-white">
                {produit.categorie}
              </p>

              <p className="text-sm text-amber-300">
                Modèle {produit.modele}
              </p>
            </button>
          ))}
      </div>
    </div>
  ))}
</div>

{produitSelectionne && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6">
    <div className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-slate-950 p-6 shadow-2xl">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-sm uppercase tracking-wider text-amber-300">
            Ajouter à la commande
          </p>

          <h2 className="mt-2 text-3xl font-black">
            {produitSelectionne.categorie}
          </h2>

          <p className="mt-1 text-slate-300">
            Modèle {produitSelectionne.modele}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setProduitSelectionne(null)}
          className="rounded-full border border-white/10 px-4 py-2 text-sm"
        >
          Fermer
        </button>
      </div>

      <img
        src={produitSelectionne.image}
        alt={produitSelectionne.categorie}
        className="mt-6 h-72 w-full rounded-2xl object-contain bg-white"
      />

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <select
          className="rounded-2xl px-4 py-3 text-slate-950"
          value={popupCommande.taille}
          onChange={(e) =>
            setPopupCommande({ ...popupCommande, taille: e.target.value })
          }
        >
          <option>XS</option>
          <option>S</option>
          <option>M</option>
          <option>L</option>
          <option>XL</option>
          <option>XXL</option>
        </select>

        <input
          type="number"
          min="1"
          className="rounded-2xl px-4 py-3 text-slate-950"
          value={popupCommande.quantite}
          onChange={(e) =>
            setPopupCommande({ ...popupCommande, quantite: e.target.value })
          }
        />
      </div>

      <button
        type="button"
        onClick={() => {
          setCommande({
            ...commande,
            articles: [
              ...commande.articles,
              {
  categorie: produitSelectionne.categorie,
  modele: produitSelectionne.modele,
  quantite: popupCommande.quantite,
  taille: popupCommande.taille,
}
            ],
          });

          setProduitSelectionne(null);
        }}
        className="mt-6 w-full rounded-full bg-amber-400 px-8 py-3 font-bold text-slate-950 hover:bg-amber-300"
      >
        Ajouter à ma commande
      </button>
    </div>
  </div>
)}

      <div className="mt-16 grid gap-8 lg:grid-cols-2">

  <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
    <h2 className="text-3xl font-black">
      Résumé de la commande
    </h2>

    <div className="mt-6 space-y-3">
      {commande.articles.length === 0 ? (
        <p className="text-slate-400">
          Aucun article sélectionné.
        </p>
      ) : (
        commande.articles.map((article, index) => (
          <button
            key={index}
            type="button"
            onClick={() => retirerArticle(index)}
            className="w-full rounded-2xl border border-white/10 bg-black/20 p-4 text-left hover:border-red-400/50"
          >
            <div className="font-bold text-amber-300">
              {article.categorie}
            </div>

            <div className="text-sm text-slate-300">
              Modèle {article.modele} • Taille {article.taille} • Qté {article.quantite}
            </div>

            <div className="mt-2 text-xs text-red-300">
              Cliquer pour retirer
            </div>
          </button>
        ))
      )}
    </div>
  </div>

  <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
    <h2 className="text-3xl font-black">
      Informations du client
    </h2>

    <div className="mt-5 grid gap-4">
      <input
        className="rounded-2xl px-4 py-3 text-slate-950"
        placeholder="Votre nom"
        value={commande.nom}
        onChange={(e) =>
          setCommande({ ...commande, nom: e.target.value })
        }
      />

      <input
        className="rounded-2xl px-4 py-3 text-slate-950"
        placeholder="Votre courriel"
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
        className="min-h-32 rounded-2xl px-4 py-3 text-slate-950"
        placeholder="Notes ou demandes spéciales"
        value={commande.notes}
        onChange={(e) =>
          setCommande({ ...commande, notes: e.target.value })
        }
      />

      <button
        type="button"
        onClick={envoyerCommande}
        className="rounded-full bg-amber-400 px-8 py-3 font-bold text-slate-950 hover:bg-amber-300"
      >
        Envoyer ma commande
      </button>
    </div>
  </div>
</div>

      </section>
);
}

function Calendrier() {
  const [categorie, setCategorie] = useState("recreatif");

  const horaires = {
    recreatif: [
      ["18 mai", ["18h00 à 18h45 — Les As vs Les Bronzés", "18h45 à 19h30 — Les Bronzés vs Les Smash", "19h30 à 20h15 — Les As vs Les Artishow", "20h15 à 21h00 — Les Smash vs Les Artishow"]],
      ["25 mai", ["18h00 à 18h45 — Les Bronzés vs Les Smash", "18h45 à 19h30 — Les As vs Les Smash", "19h30 à 20h15 — Les Bronzés vs Les Artishow", "20h15 à 21h00 — Les As vs Les Artishow"]],
      ["1 juin", ["18h00 à 18h45 — Les Smash vs Les Artishow", "18h45 à 19h30 — Les Bronzés vs Les Artishow", "19h30 à 20h15 — Les As vs Les Smash", "20h15 à 21h00 — Les As vs Les Bronzés"]],
      ["8 juin", ["18h00 à 18h45 — Les As vs Les Artishow", "18h45 à 19h30 — Les As vs Les Bronzés", "19h30 à 20h15 — Les Smash vs Les Artishow", "20h15 à 21h00 — Les Bronzés vs Les Smash"]],
      ["15 juin", ["18h00 à 18h45 — Les Bronzés vs Les Artishow", "18h45 à 19h30 — Les As vs Les Artishow", "19h30 à 20h15 — Les Bronzés vs Les Smash", "20h15 à 21h00 — Les As vs Les Smash"]],
      ["22 juin", ["18h00 à 18h45 — Les As vs Les Smash", "18h45 à 19h30 — Les Smash vs Les Artishow", "19h30 à 20h15 — Les As vs Les Bronzés", "20h15 à 21h00 — Les Bronzés vs Les Artishow"]],
      ["29 juin", ["18h00 à 18h45 — Les As vs Les Bronzés", "18h45 à 19h30 — Les Bronzés vs Les Smash", "19h30 à 20h15 — Les As vs Les Artishow", "20h15 à 21h00 — Les Smash vs Les Artishow"]],
      ["6 juil.", ["18h00 à 18h45 — Les Bronzés vs Les Smash", "18h45 à 19h30 — Les As vs Les Smash", "19h30 à 20h15 — Les Bronzés vs Les Artishow", "20h15 à 21h00 — Les As vs Les Artishow"]],
      ["13 juil.", ["18h00 à 18h45 — Les Smash vs Les Artishow", "18h45 à 19h30 — Les Bronzés vs Les Artishow", "19h30 à 20h15 — Les As vs Les Smash", "20h15 à 21h00 — Les As vs Les Bronzés"]],
      ["3 août", ["18h00 à 18h45 — Les As vs Les Artishow", "18h45 à 19h30 — Les As vs Les Bronzés", "19h30 à 20h15 — Les Smash vs Les Artishow", "20h15 à 21h00 — Les Bronzés vs Les Smash"]],
      ["10 août", ["18h00 à 18h45 — Les Bronzés vs Les Artishow", "18h45 à 19h30 — Les As vs Les Artishow", "19h30 à 20h15 — Les Bronzés vs Les Smash", "20h15 à 21h00 — Les As vs Les Smash"]],
      ["17 août", ["18h00 à 18h45 — Les As vs Les Smash", "18h45 à 19h30 — Les Smash vs Les Artishow", "19h30 à 20h15 — Les As vs Les Bronzés", "20h15 à 21h00 — Les Bronzés vs Les Artishow"]],
    ],
    competitif: [
      ["19 mai", ["18h00 à 18h45 — Crabe en Bikini vs Fireballs", "18h45 à 19h30 — Fireballs vs Geneviève", "19h30 à 20h15 — Crabe en Bikini vs Félix", "20h15 à 21h00 — Geneviève vs Félix"]],
      ["26 mai", ["18h00 à 18h45 — Fireballs vs Geneviève", "18h45 à 19h30 — Crabe en Bikini vs Geneviève", "19h30 à 20h15 — Fireballs vs Félix", "20h15 à 21h00 — Crabe en Bikini vs Félix"]],
      ["2 juin", ["18h00 à 18h45 — Crabe en Bikini vs Félix", "18h45 à 19h30 — Fireballs vs Félix", "19h30 à 20h15 — Crabe en Bikini vs Geneviève", "20h15 à 21h00 — Crabe en Bikini vs Fireballs"]],
      ["9 juin", ["18h00 à 18h45 — Crabe en Bikini vs Félix", "18h45 à 19h30 — Crabe en Bikini vs Fireballs", "19h30 à 20h15 — Geneviève vs Félix", "20h15 à 21h00 — Fireballs vs Geneviève"]],
      ["16 juin", ["18h00 à 18h45 — Fireballs vs Félix", "18h45 à 19h30 — Crabe en Bikini vs Félix", "19h30 à 20h15 — Fireballs vs Geneviève", "20h15 à 21h00 — Crabe en Bikini vs Geneviève"]],
      ["23 juin", ["18h00 à 18h45 — Crabe en Bikini vs Geneviève", "18h45 à 19h30 — Geneviève vs Félix", "19h30 à 20h15 — Crabe en Bikini vs Fireballs", "20h15 à 21h00 — Fireballs vs Félix"]],
      ["30 juin", ["18h00 à 18h45 — Crabe en Bikini vs Fireballs", "18h45 à 19h30 — Fireballs vs Geneviève", "19h30 à 20h15 — Crabe en Bikini vs Félix", "20h15 à 21h00 — Geneviève vs Félix", "21h00 à 21h45 — Crabe en Bikini vs Geneviève"]],
      ["7 juil.", ["18h00 à 18h45 — Fireballs vs Geneviève", "18h45 à 19h30 — Crabe en Bikini vs Geneviève", "19h30 à 20h15 — Fireballs vs Félix", "20h15 à 21h00 — Crabe en Bikini vs Félix"]],
      ["14 juil.", ["18h00 à 18h45 — Geneviève vs Félix", "18h45 à 19h30 — Fireballs vs Félix", "19h30 à 20h15 — Crabe en Bikini vs Geneviève", "20h15 à 21h00 — Crabe en Bikini vs Fireballs"]],
      ["4 août", ["18h00 à 18h45 — Crabe en Bikini vs Félix", "18h45 à 19h30 — Crabe en Bikini vs Fireballs", "19h30 à 20h15 — Geneviève vs Félix", "20h15 à 21h00 — Fireballs vs Geneviève"]],
      ["11 août", ["18h00 à 18h45 — Fireballs vs Félix", "18h45 à 19h30 — Crabe en Bikini vs Félix", "19h30 à 20h15 — Fireballs vs Geneviève", "20h15 à 21h00 — Crabe en Bikini vs Geneviève"]],
      ["18 août", ["18h00 à 18h45 — Crabe en Bikini vs Geneviève", "18h45 à 19h30 — Geneviève vs Félix", "19h30 à 20h15 — Crabe en Bikini vs Fireballs", "20h15 à 21h00 — Fireballs vs Félix"]],
    ],
  };

  const selection = horaires[categorie];

  const aujourdHui = new Date();

const semaineActive = selection.find(([date]) => {
  const mois = {
    mai: 4,
    juin: 5,
    "juil.": 6,
    août: 7,
  };

  const [jour, moisTexte] = date.split(" ");
  const dateMatch = new Date(2026, mois[moisTexte], Number(jour));

  const debut = new Date(dateMatch);
  debut.setDate(dateMatch.getDate() - 1);

  const fin = new Date(dateMatch);
  fin.setDate(dateMatch.getDate() + 6);

  return aujourdHui >= debut && aujourdHui <= fin;
});
  
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <p className="font-bold uppercase tracking-wider text-amber-300">
        Saison 2026
      </p>

      <h1 className="mt-2 text-5xl font-black">Calendrier</h1>
{semaineActive && (
  <div className="mt-6 inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-5 py-3 text-sm font-bold text-emerald-300">
    Semaine en cours : {semaineActive[0]}
  </div>
)}
      <div className="mt-8 flex gap-3">
        <button
          onClick={() => setCategorie("recreatif")}
          className={`rounded-full px-6 py-3 font-bold ${
            categorie === "recreatif"
              ? "bg-amber-400 text-slate-950"
              : "border border-white/15 text-white"
          }`}
        >
          Récréatif
        </button>

        <button
          onClick={() => setCategorie("competitif")}
          className={`rounded-full px-6 py-3 font-bold ${
            categorie === "competitif"
              ? "bg-amber-400 text-slate-950"
              : "border border-white/15 text-white"
          }`}
        >
          Compétitif
        </button>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
{selection.map(([date, matchs]) => {
  const estSemaineActive = semaineActive && semaineActive[0] === date;

  return (
    <div
      key={date}
      className={`rounded-3xl border p-6 ${
        estSemaineActive
          ? "border-emerald-400 bg-emerald-400/10 shadow-2xl shadow-emerald-400/20"
          : "border-white/10 bg-white/5"
      }`}
    >
      <h2 className="text-2xl font-black text-amber-300">
        {date}
      </h2>

      <div className="mt-5 space-y-3">
        {matchs.map((match, index) => (
          <div
            key={index}
            className="rounded-2xl bg-black/20 p-4 text-slate-200"
          >
            {match}
          </div>
        ))}
      </div>
    </div>
  );
})}
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
      <p className="font-bold uppercase tracking-wider text-amber-300">
        Tournoi LVPSA
      </p>

      <h1 className="mt-2 text-5xl font-black">
        Règlements du tournoi
      </h1>

      <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
        Règlements officiels du tournoi LVPSA du 18 juillet 2026.
      </p>

      <div className="mt-14 grid gap-8 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-3xl font-black text-amber-300">
            Format des équipes
          </h2>
          <ul className="mt-6 space-y-4 text-slate-300">
            <li>• 4 contre 4 avec au moins une fille sur le terrain en tout temps</li>
            <li>• Une équipe peut avoir plus de 4 joueurs</li>
            <li>• Seulement 4 joueurs sur le terrain à la fois</li>
            <li>• Si l’équipe n’a que 3 joueurs, un joueur fantôme perdra un point à sa rotation au service</li>
          </ul>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-3xl font-black text-amber-300">
            Interdictions
          </h2>
          <ul className="mt-6 space-y-4 text-slate-300">
            <li>• Bloquer une femme à l’attaque pour les hommes</li>
            <li>• Renvoyer en touche ou en tip</li>
            <li>• Les touches sont acceptées pour le volet récréatif</li>
            <li>• Toucher le filet</li>
            <li>• Traverser de l’autre côté</li>
            <li>• Faire un transport</li>
          </ul>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-3xl font-black text-amber-300">
            Rotation
          </h2>
          <ul className="mt-6 space-y-4 text-slate-300">
            <li>• L’ordre des serveurs doit être respecté en tout temps</li>
            <li>• Il n’y a aucune erreur de position</li>
            <li>• Tous les joueurs peuvent attaquer au filet en tout temps</li>
          </ul>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-3xl font-black text-amber-300">
            Arbitrage / Marqueur
          </h2>
          <ul className="mt-6 space-y-4 text-slate-300">
            <li>• Un arbitre/marqueur non officiel sera attitré</li>
            <li>• Toutes les équipes devront fournir un arbitre/marqueur pendant la journée</li>
            <li>• En cas de doute, le point sera repris</li>
          </ul>
        </div>
      </div>

      <div className="mt-10 rounded-3xl border border-sky-400/20 bg-sky-400/10 p-8">
        <h2 className="text-3xl font-black text-sky-300">
          Météo
        </h2>

        <p className="mt-5 max-w-3xl leading-8 text-slate-300">
          En cas de mauvais temps, le tournoi sera remis au 19 juillet.
        </p>
      </div>

      <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">
        <h2 className="text-3xl font-black text-amber-300">
          Organisateurs
        </h2>

        <p className="mt-5 text-slate-300">
          Valérie Thomassin et Michael Théroux
        </p>

        <p className="mt-3 text-slate-300">
          Pour nous joindre :{" "}
          <a className="font-bold text-amber-300" href="mailto:liguevpsa@gmail.com">
            Liguevpsa@gmail.com
          </a>
        </p>
      </div>
    </section>
  );
}
