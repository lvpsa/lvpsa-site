export default function CarteEquipe({
  equipeActuelle,
  userData,
  categorieActive,
  prochainMatch,
  nomEquipeGlobal,
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 xl:col-span-2">
      <p className="text-sm font-bold uppercase tracking-wider text-amber-300">
        Équipe
      </p>

      <h2 className="mt-3 text-2xl font-black text-white">
        {userData?.equipeNom ||
          userData?.equipenom ||
          nomEquipeGlobal(equipeActuelle) ||
          "Aucune équipe"}
      </h2>

      <p className="mt-2 text-slate-300">
        Catégorie :{" "}
        {categorieActive === "recreatif"
          ? "Récréatif"
          : categorieActive === "competitif"
          ? "Compétitif"
          : "Non précisée"}
      </p>

      {prochainMatch ? (
        <div className="mt-4 rounded-2xl bg-emerald-400/10 p-4">
          <p className="font-black text-emerald-300">
            Prochain match : {prochainMatch.label}
          </p>

          <div className="mt-3 space-y-2 text-sm text-slate-200">
            {prochainMatch.matchs.map((match, index) => (
              <p key={index} className="rounded-xl bg-black/20 p-3">
                {match}
              </p>
            ))}
          </div>
        </div>
      ) : (
        <p className="mt-4 rounded-2xl bg-white/10 p-4 text-slate-300">
          Aucun prochain match affiché.
        </p>
      )}
    </div>
  );
}
