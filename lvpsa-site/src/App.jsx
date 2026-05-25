import React from "react";
import {
  Calendar, Trophy, Users, MapPin, Mail, ExternalLink, CheckCircle2,
  CloudSun, ShieldCheck, Lock, UserPlus, LogIn, ClipboardList
} from "lucide-react";

export default function App() {
  const registrationLink = "https://forms.gle/csLUt6NmcjNADcBm7";
  const email = "Liguevpsa@gmail.com";

  const memberFeatures = [
    "Consulter l’horaire complet de son équipe",
    "Voir les résultats et classements détaillés",
    "Recevoir les communications importantes de la ligue",
    "Option future : permettre aux capitaines d’entrer les résultats",
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <img src="/LVPSA_logo (1).jpg" alt="LVPSA" className="h-12 w-12 rounded-full bg-white object-cover" />
            <div>
              <p className="text-lg font-bold">LVPSA</p>
              <p className="text-xs text-slate-300">Volleyball de plage de St-Augustin</p>
            </div>
          </div>

          <nav className="hidden gap-5 text-sm text-slate-300 md:flex">
            <a href="#infos">Infos</a>
            <a href="#calendrier">Calendrier</a>
            <a href="#tournois">Tournois</a>
            <a href="#commanditaires">Commanditaires</a>
            <a href="#membres">Membres</a>
            <a href="#contact">Contact</a>
          </nav>

          <a href={registrationLink} target="_blank" rel="noreferrer" className="rounded-full bg-amber-400 px-5 py-2 text-sm font-bold text-slate-950">
            Inscription
          </a>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-sm text-amber-200">
            <Calendar size={16} /> Saison 2026 · 18 mai au 18 août
          </div>
          <h1 className="text-4xl font-black leading-tight md:text-6xl">
            Ligue de volleyball de plage de St-Augustin
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            Une ligue locale organisée au parc Portneuf pour faire vivre les installations aux Augustinois(es), dans une ambiance sportive, accessible et rassembleuse.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={registrationLink} target="_blank" rel="noreferrer" className="rounded-full bg-amber-400 px-7 py-3 font-bold text-slate-950">
              S’inscrire maintenant
            </a>
            <a href="#membres" className="rounded-full border border-white/15 px-7 py-3 font-semibold">
              Espace membre
            </a>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl">
          <div className="rounded-[1.5rem] bg-slate-900 p-6">
            <p className="text-sm text-slate-400">St-Augustin-de-Desmaures</p>
            <h2 className="text-2xl font-bold">Parc Portneuf</h2>
            {[
              "Volet récréatif le lundi soir",
              "Volet compétitif le mardi soir",
              "Saison de 12 semaines",
              "Tournoi des séries à la fin août",
            ].map((item) => (
              <div key={item} className="mt-4 flex gap-3 rounded-2xl bg-white/5 p-4">
                <CheckCircle2 className="text-amber-300" size={20} />
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="infos" className="bg-white py-16 text-slate-950">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 md:grid-cols-3">
          <Card icon={<Users />} title="Deux volets" text="Récréatif pour jouer dans le plaisir, compétitif pour les joueurs expérimentés." />
          <Card icon={<MapPin />} title="Lieu" text="Terrain de volleyball de plage du parc Portneuf." />
          <Card icon={<Trophy />} title="Séries" text="Tournoi de fin de saison prévu le 29 ou 30 août selon la météo." />
        </div>
      </section>

      <section id="calendrier" className="mx-auto max-w-7xl px-6 py-16">
        <p className="font-bold uppercase tracking-wider text-amber-300">Calendrier</p>
        <h2 className="mt-2 text-3xl font-black">Deux soirs par semaine, de 18h à 21h.</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Info title="Récréatif" subtitle="Lundi soir" text="Pour les adolescents qui commencent ou les adultes qui veulent jouer pour le plaisir." />
          <Info title="Compétitif" subtitle="Mardi soir" text="Pour les joueurs actifs et expérimentés qui veulent se dépasser." />
        </div>
      </section>

      <section id="tournois" className="bg-white py-16 text-slate-950">
        <div className="mx-auto max-w-7xl px-6">
          <p className="font-bold uppercase tracking-wider text-amber-600">Tournois & événements</p>
          <h2 className="mt-2 text-3xl font-black">Plus qu’une ligue, une communauté.</h2>
          <p className="mt-4 text-slate-600">Tournoi de fin de saison, soirées spéciales, BBQ, prix de présence et chandails de champions.</p>
        </div>
      </section>

      <section id="commanditaires" className="mx-auto max-w-7xl px-6 py-16">
        <p className="font-bold uppercase tracking-wider text-amber-300">Commanditaires</p>
        <h2 className="mt-2 text-3xl font-black">Merci à nos partenaires.</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {["Commanditaire principal", "Partenaire officiel", "Entreprise locale", "Votre logo ici"].map((s) => (
            <div key={s} className="flex h-36 items-center justify-center rounded-3xl border border-white/10 bg-white/10 text-center text-slate-300">
              {s}
            </div>
          ))}
        </div>
      </section>

      <section id="membres" className="bg-white py-16 text-slate-950">
        <div className="mx-auto max-w-7xl px-6">
          <p className="font-bold uppercase tracking-wider text-amber-600">Espace membre</p>
          <h2 className="mt-2 text-3xl font-black">Accès réservé aux joueurs et capitaines.</h2>

          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <div className="rounded-3xl border bg-slate-50 p-6">
              <Lock className="mb-4" />
              <h3 className="text-2xl font-black">Connexion membre</h3>
              <input className="mt-5 w-full rounded-2xl border px-4 py-3" placeholder="Courriel" />
              <input className="mt-3 w-full rounded-2xl border px-4 py-3" placeholder="Mot de passe" type="password" />
              <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-amber-400 px-6 py-3 font-bold text-slate-950">
                <LogIn size={18} /> Se connecter
              </button>
              <p className="mt-4 text-sm text-slate-500">La vraie connexion sera activée avec une base de données.</p>
            </div>

            <div className="rounded-3xl border bg-slate-50 p-6">
              <ClipboardList className="mb-4" />
              <h3 className="text-2xl font-black">Accès membres</h3>
              {memberFeatures.map((f) => (
                <div key={f} className="mt-4 flex gap-3 rounded-2xl bg-white p-4">
                  <CheckCircle2 className="text-amber-600" size={20} />
                  <p>{f}</p>
                </div>
              ))}
              <a href={registrationLink} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-full border px-6 py-3 font-bold">
                <UserPlus size={18} /> Demander un accès
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-[2rem] border border-white/10 bg-white/10 p-8">
          <CloudSun className="mb-4 text-sky-300" />
          <h2 className="text-3xl font-black">Météo</h2>
          <p className="mt-3 text-slate-300">Consultez les conditions météo avant les matchs.</p>
          <a href="https://www.meteomedia.com/ca/meteo/quebec/saint-augustin-de-desmaures" target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 font-bold text-slate-950">
            Voir la météo <ExternalLink size={18} />
          </a>
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-7xl px-6 pb-16">
        <div className="rounded-[2rem] border border-white/10 bg-white/10 p-8">
          <p className="font-bold uppercase tracking-wider text-amber-300">Contact</p>
          <h2 className="mt-2 text-3xl font-black">Une question?</h2>
          <p className="mt-3 text-slate-300">Organisateurs : Valérie Thomassin, Mike Théroux et Sylvain Arbour.</p>
          <a href={`mailto:${email}`} className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3">
            <Mail size={18} /> {email}
          </a>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-slate-400">
        © 2026 LVPSA — Ligue de volleyball de plage de St-Augustin.
      </footer>
    </div>
  );
}

function Card({ icon, title, text }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-black">{title}</h3>
      <p className="mt-3 text-slate-600">{text}</p>
    </div>
  );
}

function Info({ title, subtitle, text }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-6">
      <p className="text-sm font-bold uppercase tracking-wider text-amber-300">{title}</p>
      <h3 className="mt-2 text-2xl font-black">{subtitle}</h3>
      <p className="mt-4 text-slate-300">{text}</p>
    </div>
  );
}
