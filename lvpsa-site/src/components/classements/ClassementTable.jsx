import React, { useEffect, useState } from "react";

export default function ClassementTable({ url, titre }) {
  const [rows, setRows] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    let composantActif = true;

    const chargerClassement = async () => {
      setChargement(true);
      setErreur("");

      try {
        const reponse = await fetch(url);

        if (!reponse.ok) {
          throw new Error(`Erreur HTTP ${reponse.status}`);
        }

        const csv = await reponse.text();

        const lignes = csv
          .trim()
          .split(/\r?\n/)
          .map((ligne) =>
            ligne
              .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
              .map((cellule) =>
                cellule.replace(/^"|"$/g, "").trim()
              )
          );

        const donnees = lignes
          .slice(1)
          .filter((ligne) => ligne[0] && ligne[1]);

        if (composantActif) {
          setRows(donnees);
        }
      } catch (error) {
        console.error("Erreur chargement classement :", error);

        if (composantActif) {
          setErreur(
            "Le classement est temporairement indisponible."
          );
          setRows([]);
        }
      } finally {
        if (composantActif) {
          setChargement(false);
        }
      }
    };

    chargerClassement();

    return () => {
      composantActif = false;
    };
  }, [url]);

  const medaille = (rang) => {
    const medailles = {
      "1": "🥇",
      "2": "🥈",
      "3": "🥉",
      "4": "😎",
    };

    return medailles[rang] || "";
  };

  const formatDiff = (valeur) => {
    const nombre = Number(
      String(valeur || "").replace(",", ".")
    );

    if (Number.isNaN(nombre)) {
      return valeur;
    }

    return nombre.toFixed(2);
  };

  const formatPoints = (valeur) =>
    String(valeur || "").replace(/"/g, "");

  if (chargement) {
    return (
      <div className="mt-10 rounded-[2rem] border border-white/10 bg-slate-950 p-8 shadow-2xl">
        <div className="flex min-h-72 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-amber-300" />

            <p className="mt-5 font-bold text-slate-300">
              Chargement du classement...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (erreur) {
    return (
      <div className="mt-10 rounded-[2rem] border border-red-400/20 bg-red-400/10 p-8 text-center">
        <h2 className="text-2xl font-black text-red-300">
          Classement indisponible
        </h2>

        <p className="mt-3 text-slate-300">
          {erreur}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-10 overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 shadow-2xl">
      <div className="bg-amber-400 px-6 py-6 text-slate-950 sm:px-8">
        <div className="flex items-center gap-4">
          <span className="text-4xl">🏆</span>

          <div>
            <h2 className="text-3xl font-black uppercase sm:text-4xl">
              {titre}
            </h2>

            <p className="mt-1 text-xs font-black uppercase tracking-widest sm:text-sm">
              Ligue de volleyball de plage de St-Augustin
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div className="overflow-x-auto rounded-3xl border border-white/10 bg-slate-900">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="bg-slate-900 text-amber-300">
                {[
                  "Rang",
                  "Équipe",
                  "PJ",
                  "SG",
                  "SP",
                  "PP",
                  "PC",
                  "Diff.",
                  "Points",
                ].map((entete) => (
                  <th
                    key={entete}
                    className="px-6 py-5 text-lg font-black"
                  >
                    {entete}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.map((row, index) => {
                const rang = row[0];
                const equipe = row[1];
                const pj = row[2];
                const sg = row[3];
                const sp = row[4];
                const pp = row[5];
                const pc = row[6];
                const differentiel = row[7];
                const points = row[8];

                return (
                  <tr
                    key={`${equipe}-${index}`}
                    className={`border-t border-white/10 text-white ${
                      rang === "1"
                        ? "bg-amber-400/10"
                        : rang === "2"
                        ? "bg-white/5"
                        : rang === "3"
                        ? "bg-orange-400/10"
                        : "bg-slate-950/40"
                    }`}
                  >
                    <td className="px-6 py-5 text-2xl font-black">
                      <span className="mr-3">
                        {medaille(rang)}
                      </span>

                      <span
                        className={
                          rang === "1"
                            ? "text-amber-300"
                            : ""
                        }
                      >
                        {rang}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-xl font-bold">
                      {equipe}
                    </td>

                    <td className="px-6 py-5 text-xl">{pj}</td>
                    <td className="px-6 py-5 text-xl">{sg}</td>
                    <td className="px-6 py-5 text-xl">{sp}</td>
                    <td className="px-6 py-5 text-xl">{pp}</td>
                    <td className="px-6 py-5 text-xl">{pc}</td>

                    <td className="px-6 py-5 text-xl font-bold text-lime-400">
                      {formatDiff(differentiel)}
                    </td>

                    <td className="px-6 py-5 text-2xl font-black text-amber-300">
                      {formatPoints(points)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-6 grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="font-black text-amber-300">
              PJ
            </span>{" "}
            : Parties jouées
          </div>

          <div>
            <span className="font-black text-amber-300">
              SG
            </span>{" "}
            : Sets gagnés
          </div>

          <div>
            <span className="font-black text-amber-300">
              SP
            </span>{" "}
            : Sets perdus
          </div>

          <div>
            <span className="font-black text-amber-300">
              Points
            </span>{" "}
            : Points au classement
          </div>

          <div>
            <span className="font-black text-amber-300">
              PP
            </span>{" "}
            : Points pour
          </div>

          <div>
            <span className="font-black text-amber-300">
              PC
            </span>{" "}
            : Points contre
          </div>

          <div>
            <span className="font-black text-amber-300">
              Diff.
            </span>{" "}
            : Différentiel
          </div>
        </div>
      </div>
    </div>
  );
}
