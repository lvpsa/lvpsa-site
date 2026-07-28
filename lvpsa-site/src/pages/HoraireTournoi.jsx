import { CalendarClock, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function HoraireTournoi() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-24">

      <div className="text-center">

        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-300">
          <CalendarClock size={48} />
        </div>

        <p className="mt-8 text-sm font-black uppercase tracking-[0.25em] text-cyan-300">
          PROCHAIN ÉVÉNEMENT
        </p>

        <h1 className="mt-4 text-5xl font-black text-white md:text-6xl">
          L'horaire sera dévoilé bientôt...
        </h1>

        <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-300">
          Aucun horaire n'est disponible pour le moment.
        </p>

        <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-400">
          Notre équipe prépare actuellement le prochain événement de la LVPSA.
          Dès que les inscriptions seront lancées, l'horaire complet sera
          affiché ici.
        </p>

      </div>

      <div className="mt-16 rounded-[2rem] border border-cyan-300/20 bg-gradient-to-br from-cyan-400/10 to-slate-900 p-10 text-center">

        <Sparkles className="mx-auto h-12 w-12 text-cyan-300" />

        <h2 className="mt-6 text-3xl font-black text-white">
          👀 Une annonce approche...
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-lg text-slate-300">
          Nous travaillons sur quelque chose de vraiment spécial.
          Revenez bientôt ou suivez-nous sur Facebook pour être parmi les
          premiers informés.
        </p>

      </div>

      <div className="mt-12 flex flex-wrap justify-center gap-4">

        <Link
          to="/tournoi"
          className="rounded-full bg-cyan-300 px-8 py-4 font-black text-slate-950 transition hover:bg-cyan-200"
        >
          Retour à l'événement
        </Link>

        <Link
          to="/galerie"
          className="rounded-full border border-white/15 px-8 py-4 font-black text-white transition hover:border-cyan-300 hover:text-cyan-300"
        >
          📸 Revoir le tournoi 2026
        </Link>

      </div>

    </section>
  );
}
