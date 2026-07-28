import { Link } from "react-router-dom";
import { CalendarClock } from "lucide-react";

export default function HoraireTournoi() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20 text-center">
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-300">
        <CalendarClock size={48} />
      </div>

      <p className="mt-8 text-sm font-black uppercase tracking-[0.25em] text-cyan-300">
        LVPSA
      </p>

      <h1 className="mt-4 text-5xl font-black text-white">
        Aucun horaire disponible
      </h1>

      <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-300">
        Le tournoi 2026 est maintenant terminé.
      </p>

      <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-slate-400">
        Notre équipe travaille actuellement sur le prochain événement de la
        LVPSA. Dès que les dates seront confirmées, l'horaire complet sera
        publié ici.
      </p>

      <div className="mt-12 rounded-3xl border border-cyan-300/20 bg-cyan-400/10 p-8">
        <h2 className="text-2xl font-black text-cyan-300">
          👀 Restez à l'affût !
        </h2>

        <p className="mt-4 text-slate-300">
          De belles nouveautés s'en viennent...
        </p>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link
          to="/tournoi"
          className="rounded-full bg-cyan-300 px-8 py-4 font-black text-slate-950 hover:bg-cyan-200"
        >
          Retour à la page Événement
        </Link>

        <Link
          to="/galerie"
          className="rounded-full border border-white/15 px-8 py-4 font-black text-white hover:border-cyan-300 hover:text-cyan-300"
        >
          Voir la galerie 2026
        </Link>
      </div>
    </section>
  );
}
