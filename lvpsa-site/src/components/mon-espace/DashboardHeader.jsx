import { Trophy } from "lucide-react";

export default function DashboardHeader({
  prenom,
  roleAffichage,
  nomEquipe,
  categorieActive,
}) {
  return (
    <div className="rounded-[2rem] bg-gradient-to-r from-cyan-500 via-blue-600 to-slate-900 p-8 shadow-2xl">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-100">
            Mon espace
          </p>

          <h1 className="mt-2 text-4xl font-black text-white">
            Bonjour {prenom} 👋
          </h1>

          <p className="mt-4 text-lg text-cyan-100">
            Bienvenue dans ton espace personnel LVPSA.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <span className="rounded-full bg-white/10 px-5 py-3 font-bold text-white backdrop-blur">
            {roleAffichage}
          </span>

          {nomEquipe && (
            <span className="rounded-full bg-white/10 px-5 py-3 font-bold text-white backdrop-blur">
              {nomEquipe}
            </span>
          )}

          {categorieActive && (
            <span className="rounded-full bg-amber-400 px-5 py-3 font-black text-slate-900">
              {categorieActive === "recreatif"
                ? "Récréatif"
                : "Compétitif"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
