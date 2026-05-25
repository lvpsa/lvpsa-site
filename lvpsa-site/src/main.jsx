import React from "react";
import { createRoot } from "react-dom/client";
import { motion } from "framer-motion";
import {
  Calendar,
  Trophy,
  Users,
  MapPin,
  Mail,
  ExternalLink,
  CheckCircle2,
  CloudSun,
  ShieldCheck,
  HeartHandshake,
  PartyPopper,
} from "lucide-react";
import "./index.css";

function App() {
  const registrationLink = "https://forms.gle/csLUt6NmcjNADcBm7";
  const weatherLink = "https://www.meteomedia.com/ca/meteo/quebec/saint-augustin-de-desmaures";
  const email = "Liguevpsa@gmail.com";

  const highlights = [
    "Ligue locale au parc Portneuf à St-Augustin-de-Desmaures",
    "Volet récréatif le lundi soir et compétitif le mardi soir",
    "Saison de 12 semaines avec pause pendant les vacances de la construction",
    "Tournoi des séries à la fin août avec BBQ, prix de présence et chandails de champions",
  ];

  const schedule = [
    {
      category: "Récréatif",
      day: "Lundi",
      time: "18h à 21h",
      note: "Pour les adolescents qui commencent ou les adultes qui veulent jouer pour le plaisir.",
    },
    {
      category: "Compétitif",
      day: "Mardi",
      time: "18h à 21h",
      note: "Pour les joueurs actifs et expérimentés qui veulent se dépasser tout en ayant du plaisir.",
    },
  ];

  const rules = [
    "4 contre 4 avec au moins une fille sur le jeu en tout temps.",
    "Auto-arbitrage : en cas de désaccord, l’échange est repris.",
    "Le capitaine de l’équipe gagnante transmet les points aux organisateurs.",
    "S’il pleut, les matchs ont lieu. En cas d’orage, les matchs sont repris si possible.",
  ];

  const steps = [
    "Inscrire son équipe ou s’inscrire comme joueur indépendant.",
    "Préparer les courriels et numéros de téléphone des joueurs pour compléter le formulaire.",
    "Le ou la capitaine recevra les informations de paiement par courriel.",
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="#accueil" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-white shadow-lg shadow-amber-400/20">
              <img src="/logo.jpg" alt="Logo LVPSA" className="h-full w-full object-cover" />
            </div>
            <div>
              <p className="text-lg font-bold tracking-tight">LVPSA</p>
              <p className="text-xs text-slate-300">Volleyball de plage de St-Augustin</p>
            </div>
          </a>
          <nav className="hidden gap-5 text-sm text-slate-300 lg:flex">
            <a href="#infos" className="hover:text-white">Infos</a>
            <a href="#calendrier" className="hover:text-white">Calendrier</a>
            <a href="#tournois" className="hover:text-white">Tournois</a>
            <a href="#commanditaires" className="hover:text-white">Commanditaires</a>
            <a href="#reglements" className="hover:text-white">Règlements</a>
            <a href="#contact" className="hover:text-white">Contact</a>
          </nav>
          <a href={registrationLink} target="_blank" rel="noreferrer" className="rounded-full bg-amber-400 px-5 py-2 text-sm font-bold text-slate-950 transition hover:bg-amber-300">
            Inscription
          </a>
        </div>
      </header>

      <main id="accueil">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.28),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.25),transparent_35%)]" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-sm text-amber-200">
                <Calendar size={16} /> Saison 2026 · 18 mai au 18 août
              </div>
              <h1 className="text-4xl font-black leading-tight tracking-tight md:text-6xl">
                Ligue de volleyball de plage de St-Augustin
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
                Une ligue locale organisée au parc Portneuf pour faire vivre les installations aux Augustinois(es), dans une ambiance sportive, accessible et rassembleuse.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href={registrationLink} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-400 px-7 py-3 font-bold text-slate-950 transition hover:bg-amber-300">
                  S’inscrire maintenant <ExternalLink size={18} />
                </a>
                <a href="#infos" className="inline-flex items-center justify-center rounded-full border border-white/15 px-7 py-3 font-semibold text-white transition hover:bg-white/10">
                  Voir les détails
                </a>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.1 }}>
              <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur">
                <div className="rounded-[1.5rem] bg-slate-900 p-6">
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-400">St-Augustin-de-Desmaures</p>
                      <p className="text-2xl font-bold">Parc Portneuf</p>
                    </div>
                    <img src="/logo.jpg" alt="Logo LVPSA" className="h-20 w-20 rounded-full bg-white object-cover" />
                  </div>
                  <div className="grid gap-4">
                    {highlights.map((item) => (
                      <div key={item} className="flex items-start gap-3 rounded-2xl bg-white/5 p-4">
                        <CheckCircle2 className="mt-0.5 shrink-0 text-amber-300" size={20} />
                        <p className="text-slate-200">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="infos" className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-6 md:grid-cols-3">
            <InfoCard icon={<Users />} title="Deux volets" text="Récréatif pour jouer dans le plaisir, compétitif pour les joueurs expérimentés qui veulent se dépasser." />
            <InfoCard icon={<MapPin />} title="Lieu" text="Terrain de volleyball de plage du parc Portneuf à St-Augustin-de-Desmaures." />
            <InfoCard icon={<Trophy />} title="Séries" text="Tournoi de fin de saison prévu le 29 ou 30 août selon la météo, avec BBQ et prix de présence." />
          </div>
        </section>

        <section id="calendrier" className="bg-white py-16 text-slate-950">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-10 max-w-2xl">
              <p className="font-bold uppercase tracking-wider text-amber-600">Calendrier</p>
              <h2 className="mt-2 text-3xl font-black md:text-4xl">Deux soirs par semaine, de 18h à 21h.</h2>
              <p className="mt-4 text-slate-600">Chaque équipe joue deux matchs de deux sets de 21 points pendant la soirée.</p>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {schedule.map((item) => (
                <div key={item.category} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                  <p className="text-sm font-bold uppercase tracking-wider text-amber-600">{item.category}</p>
                  <h3 className="mt-2 text-2xl font-black">{item.day}</h3>
                  <p className="mt-2 font-semibold text-slate-700">{item.time}</p>
                  <p className="mt-4 text-slate-600">{item.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="tournois" className="bg-slate-100 py-16 text-slate-950">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-10 max-w-2xl">
              <p className="font-bold uppercase tracking-wider text-amber-600">Tournois & événements</p>
              <h2 className="mt-2 text-3xl font-black md:text-4xl">Plus qu’une ligue, une communauté.</h2>
              <p className="mt-4 text-slate-600">La LVPSA organise des événements et tournois pour créer une ambiance dynamique autour du volleyball de plage.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <EventCard icon={<Trophy />} title="Tournoi de fin de saison" text="Prévu le 29 ou 30 août selon la météo avec BBQ, prix de présence et chandails de champions." />
              <EventCard icon={<PartyPopper />} title="Soirées spéciales" text="Matchs amicaux, soirées sociales et activités spéciales pourront être annoncés pendant l’été." />
              <EventCard icon={<Users />} title="Communauté Facebook" text="Suivez la page Facebook pour les annonces, remplaçants, photos et résultats." />
            </div>
          </div>
        </section>

        <section id="commanditaires" className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <p className="font-bold uppercase tracking-wider text-amber-300">Commanditaires</p>
              <h2 className="mt-2 text-3xl font-black md:text-4xl">Merci à nos partenaires.</h2>
              <p className="mt-5 text-lg leading-8 text-slate-300">La LVPSA est fière de pouvoir compter sur le soutien de partenaires locaux qui contribuent au développement du sport et de la communauté.</p>
              <a href={`mailto:${email}`} className="mt-6 inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-7 py-3 font-semibold transition hover:bg-white/10">
                <HeartHandshake size={18} /> Devenir commanditaire
              </a>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {['Votre logo ici', 'Commanditaire', 'Commanditaire', 'Commanditaire'].map((label) => (
                <div key={label} className="flex h-36 items-center justify-center rounded-3xl border border-white/10 bg-white/10 text-center text-slate-300">
                  {label}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="reglements" className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-10 md:grid-cols-2 md:items-start">
            <div>
              <p className="font-bold uppercase tracking-wider text-amber-300">Règlements</p>
              <h2 className="mt-2 text-3xl font-black md:text-4xl">Simple, clair et axé sur le plaisir de jouer.</h2>
              <p className="mt-5 text-lg leading-8 text-slate-300">Les règles visent à garder les matchs fluides, sécuritaires et équitables pour tous les participants.</p>
            </div>
            <div className="grid gap-4">
              {rules.map((rule) => (
                <div key={rule} className="flex items-start gap-3 rounded-2xl bg-white/10 p-4">
                  <ShieldCheck className="mt-0.5 shrink-0 text-amber-300" size={20} />
                  <p className="text-slate-200">{rule}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-amber-400 py-16 text-slate-950">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-3xl font-black md:text-4xl">Inscription</h2>
              <p className="mt-4 text-lg font-semibold">200 $ par équipe pour 12 soirs et le tournoi des séries.</p>
              <p className="mt-2 text-slate-800">Un dépôt de 100 $ est requis et peut être remboursé à la fin de la saison selon les conditions de présence.</p>
              <div className="mt-6 grid gap-4">
                {steps.map((step, index) => (
                  <div key={step} className="flex gap-4 rounded-2xl bg-white/55 p-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-black text-white">{index + 1}</span>
                    <p className="font-semibold">{step}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-2xl">
              <p className="text-slate-300">Places limitées</p>
              <h3 className="mt-2 text-3xl font-black">Maximum 4 équipes par catégorie.</h3>
              <p className="mt-4 text-slate-300">Date limite d’inscription : 30 avril.</p>
              <a href={registrationLink} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3 font-bold text-slate-950 transition hover:bg-slate-100">
                Formulaire d’inscription <ExternalLink size={18} />
              </a>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="rounded-[2rem] border border-white/10 bg-white/10 p-8 md:p-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-400 text-slate-950"><CloudSun size={24} /></div>
                <p className="font-bold uppercase tracking-wider text-amber-300">Météo</p>
                <h2 className="mt-2 text-3xl font-black">Conditions météo en direct</h2>
                <p className="mt-3 text-slate-300">Consultez les conditions météo de St-Augustin-de-Desmaures avant les matchs.</p>
              </div>
              <a href={weatherLink} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-400 px-7 py-3 font-bold text-slate-950 transition hover:bg-amber-300">
                Voir la météo <ExternalLink size={18} />
              </a>
            </div>
          </div>
        </section>

        <section id="contact" className="mx-auto max-w-7xl px-6 pb-16">
          <div className="rounded-[2rem] border border-white/10 bg-white/10 p-8 md:p-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-bold uppercase tracking-wider text-amber-300">Contact</p>
                <h2 className="mt-2 text-3xl font-black">Une question?</h2>
                <p className="mt-3 text-slate-300">Organisateurs : Valérie Thomassin, Mike Théroux et Sylvain Arbour.</p>
              </div>
              <a href={`mailto:${email}`} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-7 py-3 font-semibold transition hover:bg-white/10">
                <Mail size={18} /> {email}
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-slate-400">
        © 2026 LVPSA — Ligue de volleyball de plage de St-Augustin. Tous droits réservés.
      </footer>
    </div>
  );
}

function InfoCard({ icon, title, text }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-xl backdrop-blur">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400 text-slate-950">
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <h3 className="text-xl font-black">{title}</h3>
      <p className="mt-3 leading-7 text-slate-300">{text}</p>
    </div>
  );
}

function EventCard({ icon, title, text }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400 text-slate-950">
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <h3 className="text-xl font-black">{title}</h3>
      <p className="mt-3 leading-7 text-slate-600">{text}</p>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
