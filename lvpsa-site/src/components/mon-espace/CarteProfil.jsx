export default function CarteProfil({
  user,
  userData,
  editionProfil,
  setEditionProfil,
  profilForm,
  setProfilForm,
  messageProfil,
  setMessageProfil,
  sauvegarderProfil,
  formatTelephone,
  roleAffichage,
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-bold uppercase tracking-wider text-amber-300">
          Profil
        </p>

        <button
          type="button"
          onClick={() => {
            setEditionProfil(!editionProfil);
            setMessageProfil("");

            setProfilForm({
              nom: userData?.nom || "",
              telephone: formatTelephone(userData?.telephone) || "",
            });
          }}
          className="rounded-full border border-white/15 px-4 py-2 text-sm font-black text-white hover:border-amber-300 hover:text-amber-300"
        >
          {editionProfil ? "Annuler" : "Modifier"}
        </button>
      </div>

      {!editionProfil ? (
        <>
          <h2 className="mt-3 text-2xl font-black text-white">
            {userData?.nom || "Membre LVPSA"}
          </h2>

          <p className="mt-2 text-slate-300">
            {userData?.email || user?.email}
          </p>

          <p className="text-slate-300">
            {formatTelephone(userData?.telephone) || "Téléphone non précisé"}
          </p>

          <p className="mt-4 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-slate-300">
            {roleAffichage}
          </p>
        </>
      ) : (
        <div className="mt-5 space-y-4">
          <input
            value={profilForm.nom}
            onChange={(e) =>
              setProfilForm({
                ...profilForm,
                nom: e.target.value,
              })
            }
            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
          />

          <input
            value={profilForm.telephone}
            onChange={(e) =>
              setProfilForm({
                ...profilForm,
                telephone: formatTelephone(e.target.value),
              })
            }
            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
          />

          <button
            onClick={sauvegarderProfil}
            className="w-full rounded-full bg-amber-400 px-5 py-3 font-black text-slate-950 hover:bg-amber-300"
          >
            Sauvegarder
          </button>
        </div>
      )}

      {messageProfil && (
        <p className="mt-4 rounded-xl bg-white/10 p-3 text-sm text-amber-300">
          {messageProfil}
        </p>
      )}
    </div>
  );
}
