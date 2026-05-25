import React from "react";
import {
  Calendar, Trophy, Users, MapPin, Mail, ExternalLink, CheckCircle2,
  CloudSun, ShieldCheck, Lock, UserPlus, LogIn, ClipboardList
} from "lucide-react";
import "./index.css";

export default function App() {
  const email = "liguevpsa@gmail.com";
  const tournoiLink = "https://forms.gle/csLUt6NmcjNADcBm7";
  const classementLink = "https://docs.google.com/spreadsheets/d/1-Y5gsmgi-V8TjSQbl2xIPuDx1QxTPL0S/edit?usp=drive_link&ouid=116934157877214569210&rtpof=true&sd=true";
  const meteoLink = "https://www.meteomedia.com/ca/meteo/quebec/saint-augustin-de-desmaures";

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" className="h-24 w-24 rounded-full bg-white object-cover" />
            <div>
              <p className="text-xl font-black">LVPSA</p>
              <p className="text-sm text-slate-300">Volleyball de plage de St-Augustin</p>
            </div>
          </div>

          <nav className="hidden gap-6 text-sm text-slate-300 md:flex">
            <a href="#ligue">Ligue</a>
            <a href="#classements">Classements</a>
            <a href="#tournoi">Tournoi</a>
            <a href="#reglements">Règlements</a>
            <a href="#membres">Membres</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

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
            <a href="#tournoi" className="rounded-full bg-amber-400 px-7 py-3 text-center font-bold text-slate-950">
              Voir le tournoi
            </a>
            <a href="#classements" className="rounded-full border border-white/15 px-7 py-3 text-center font-semibold">
              Voir les classements
            </a>
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

      <section id="ligue" className="bg-white py-16 text-slate-950">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 md:grid-cols-3">
          <Card icon={<Users />} title="Inscriptions fermées" text="Les inscriptions pour la saison régulière 2026 sont complètes." />
          <Card icon={<Mail />} title="Remplaçants" text="Les joueurs intéressés peuvent écrire à liguevpsa@gmail.com." />
          <Card icon={<MapPin />} title="Lieu" text="Terrain de volleyball de plage du parc Portneuf à St-Augustin." />
        </div>
      </section>

      <section id="classements" className="mx-auto max-w-7xl px-6 py-16">
        <p className="font-bold uppercase tracking-wider text-amber-300">Classements</p>
        <h2 className="mt-2 text-3xl font-black md:text-4xl">Suivez les résultats de la saison.</h2>
        <p className="mt-4 text-slate-300">
          Les classements sont mis à jour via le fichier officiel de la ligue.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {["Récréatif", "Compétitif", "Facebook"].map((item) => (
            <a
              key={item}
              href={classementLink}
              target="_blank"
              rel="noreferrer"
              className="rounded-3xl border border-white/10 bg-white/10 p-6 transition hover:bg-white/15"
            >
              <Trophy className="mb-4 text-amber-300" />
              <h3 className="text-2xl font-black">{item}</h3>
              <p className="mt-3 text-slate-300">Consulter le classement</p>
            </a>
          ))}
        </div>
      </section>

      <section id="tournoi" className="bg-white py-16 text-slate-950">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-2 md:items-center">
          <div>
            <p className="font-bold uppercase tracking-wider text-amber-600">Tournoi LVPSA</p>
            <h2 className="mt-2 text-4xl font-black">18 juillet 2026</h2>
            <p className="mt-5 text-lg leading-8 text-slate-700">
              Une journée complète de volleyball de plage, avec deux catégories :
              compétitif et récréatif. Coût d’inscription : 100 $ par équipe.
            </p>

            <div className="mt-6 grid gap-3">
              <Bullet text="Tournoi sur une journée" />
              <Bullet text="Matchs en continu de 8h à 20h" />
              <Bullet text="Minimum 4 matchs garantis par équipe" />
              <Bullet text="Nourriture, boissons et ambiance musicale sur place" />
            </div>

            <a
              href={tournoiLink}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-amber-400 px-7 py-3 font-bold text-slate-950"
            >
              Inscription tournoi <ExternalLink size={18} />
            </a>
          </div>

          <img
            src="/tournoi-lvpsa-2026.jpg"
            alt="Tournoi LVPSA 18 juillet 2026"
            className="w-full rounded-3xl shadow-2xl"
          />
        </div>
      </section>

      <section id="reglements" className="mx-auto max-w-7xl px-6 py-16">
        <p className="font-bold uppercase tracking-wider text-amber-300">Règlements</p>
        <h2 className="mt-2 text-3xl font-black md:text-4xl">Règlements de la ligue</h2>
        <p className="mt-4 text-slate-300">
          Les règlements officiels couvrent le format 4 contre 4, les remplacements,
          l’auto-arbitrage, la météo et les conditions de participation.
        </p>

        <a
          href="/LVPSA 2026_règlements seulement.pptx"
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 px-7 py-3 font-bold"
        >
          Consulter les règlements <ExternalLink size={18} />
        </a>
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
              <p className="mt-4 text-sm text-slate-500">
                La connexion réelle sera activée lors du branchement à une base de données.
              </p>
            </div>

            <div className="rounded-3xl border bg-slate-50 p-6">
              <ClipboardList className="mb-4" />
              <h3 className="text-2xl font-black">Fonctionnalités prévues</h3>
              {[
                "Horaire complet de son équipe",
                "Résultats et classements détaillés",
                "Communications importantes",
                "Entrée des résultats par les capitaines",
              ].map((f) => (
                <div key={f} className="mt-4 flex gap-3 rounded-2xl bg-white p-4">
                  <CheckCircle2 className="text-amber-600" size={20} />
                  <p>{f}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-[2rem] border border-white/10 bg-white/10 p-8">
            <Mail className="mb-4 text-amber-300" />
            <h2 className="text-3xl font-black">Contact</h2>
            <p className="mt-3 text-slate-300">Valérie Thomassin, Mike Théroux et Sylvain Arbour</p>
            <a href={`mailto:${email}`} className="mt-5 inline-flex rounded-full border border-white/15 px-6 py-3">
              {email}
            </a>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/10 p-8">
            <CloudSun className="mb-4 text-sky-300" />
            <h2 className="text-3xl font-black">Météo</h2>
            <p className="mt-3 text-slate-300">Consultez la météo avant les matchs.</p>
            <a href={meteoLink} target="_blank" rel="noreferrer" className="mt-5 inline-flex rounded-full bg-amber-400 px-6 py-3 font-bold text-slate-950">
              Voir la météo
            </a>
          </div>
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
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
      <div className="mb-4 text-amber-600">{icon}</div>
      <h3 className="text-xl font-black">{title}</h3>
      <p className="mt-3 text-slate-600">{text}</p>
    </div>
  );
}

function Bullet({ text }) {
  return (
    <div className="flex gap-3 rounded-2xl bg-slate-100 p-4">
      <CheckCircle2 className="shrink-0 text-amber-600" size={20} />
      <p className="font-semibold">{text}</p>
    </div>
  );
}
