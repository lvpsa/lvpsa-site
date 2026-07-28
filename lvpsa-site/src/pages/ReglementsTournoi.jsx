import { FileText, Images, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function ReglementsTournoi() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-24 text-center">
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-300">
        <FileText size={48} />
      </div>

      <p className="mt-8 text-sm font-black uppercase tracking-[0.25em] text-cyan-300">
        Prochain événement
      </p>

      <h1 className="mt-4 text-5xl font-black text-white md:text-6xl">
        Aucun règlement disponible présentement
      </h1>

      <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-300">
        Les règlements du tournoi 2026 ne sont plus affichés puisque
        l’événement est terminé.
      </p>

      <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-400">
        Les règles officielles du prochain événement seront publiées ici dès
        l’ouverture des inscriptions.
      </p>

      <div className="mt-14 rounded-[2rem] border border-cyan-300/20 bg-gradient-to-br from-cyan-400/10 to-slate-900 p-10">
        <Sparkles className="mx-auto h-12 w-12 text-cyan-300" />

        <h2 className="mt-6 text-3xl font-black text-white">
          Les détails seront dévoilés prochainement
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-lg text-slate-300">
          Format, catégories, inscriptions et règlements seront annoncés en
          même temps que le prochain événement.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link
          to="/tournoi"
          className="rounded-full bg-cyan-300 px-8 py-4 font-black text-slate-950 hover:bg-cyan-200"
        >
          Retour au prochain événement
        </Link>

        <Link
          to="/galerie"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-8 py-4 font-black text-white hover:border-cyan-300 hover:text-cyan-300"
        >
          <Images className="h-5 w-5" />
          Revoir le tournoi 2026
        </Link>
      </div>
    </section>
  );
}
