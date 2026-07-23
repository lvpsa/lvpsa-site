export default function DashboardHeader({
  prenom,
  roleAffichage,
  nomEquipe,
  categorieActive,
}) {
  const categorieAffichage =
    categorieActive === "recreatif"
      ? "Récréatif"
      : categorieActive === "competitif"
      ? "Compétitif"
      : "";

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-cyan-500/20 via-slate-900 to-yellow-300/10 p-6 sm:p-8 lg:p-10">
      <div
        aria-hidden="true"
        className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl"
      />

      <div className="relative">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-300">
          Mon espace LVPSA
        </p>

        <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
          Bonjour {prenom} 👋
        </h1>

        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
          Retrouve ton équipe, ton prochain match, tes demandes et tes
          commandes dans un seul espace.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-black text-cyan-200">
            {roleAffichage}
          </span>

          {nomEquipe && (
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-slate-200">
              {nomEquipe}
            </span>
          )}

          {categorieAffichage && (
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-slate-200">
              {categorieAffichage}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
