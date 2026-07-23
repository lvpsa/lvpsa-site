import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function CarteEvenement() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-fuchsia-300/20 bg-slate-900 p-8">
      <img
        src="/galerie/galerie-01.jpg"
        alt="Tournoi LVPSA 2026"
        className="absolute inset-0 h-full w-full object-cover opacity-25"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/50" />

      <div className="relative">
        <p className="font-bold uppercase tracking-wider text-fuchsia-300">
          Galerie officielle
        </p>

        <h2 className="mt-2 text-3xl font-black text-white">
          Revivez le tournoi LVPSA 2026
        </h2>

        <p className="mt-4 max-w-xl leading-7 text-slate-300">
          Découvrez les équipes, les bénévoles, les partenaires et tous les
          moments marquants de cette journée exceptionnelle.
        </p>

        <Link
          to="/galerie"
          className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-fuchsia-300 px-6 py-3 font-black text-slate-950 transition hover:bg-fuchsia-200"
        >
          Voir les photos
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}
