import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Trophy, UsersRound, Volleyball, Heart } from "lucide-react";

const statistiques = [
  {
    valeur: 8,
    suffixe: "",
    titre: "équipes",
    texte: "Récréatif et compétitif",
    icone: UsersRound,
  },
  {
    valeur: 2,
    suffixe: "",
    titre: "catégories",
    texte: "Pour tous les niveaux",
    icone: Trophy,
  },
  {
    valeur: 1,
    suffixe: "",
    titre: "tournoi annuel",
    texte: "Une journée rassembleuse",
    icone: Volleyball,
  },
  {
    valeur: 100,
    suffixe: "%",
    titre: "passion",
    texte: "Pour le volleyball local",
    icone: Heart,
  },
];

function CompteurAnime({ valeur, suffixe, actif }) {
  const [nombre, setNombre] = useState(0);

  useEffect(() => {
    if (!actif) return;

    let debut = null;
    const duree = 1100;

    const animer = (temps) => {
      if (!debut) debut = temps;

      const progression = Math.min((temps - debut) / duree, 1);
      const progressionAdoucie = 1 - Math.pow(1 - progression, 3);

      setNombre(Math.round(valeur * progressionAdoucie));

      if (progression < 1) {
        requestAnimationFrame(animer);
      }
    };

    const animation = requestAnimationFrame(animer);

    return () => cancelAnimationFrame(animation);
  }, [actif, valeur]);

  return (
    <span>
      {nombre}
      {suffixe}
    </span>
  );
}

export default function StatsLVPSA() {
  const reference = useRef(null);
  const estVisible = useInView(reference, {
    once: true,
    amount: 0.3,
  });

  return (
    <section
      ref={reference}
      className="relative overflow-hidden border-b border-white/10 bg-slate-950 py-10 lg:py-14"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-40 w-[70%] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-3 px-5 lg:grid-cols-4 lg:gap-5 lg:px-8">
        {statistiques.map((statistique, index) => {
          const Icone = statistique.icone;

          return (
            <motion.article
              key={statistique.titre}
              initial={{ opacity: 0, y: 24 }}
              animate={
                estVisible
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 24 }
              }
              transition={{
                duration: 0.45,
                delay: index * 0.08,
              }}
              className="group rounded-3xl border border-white/10 bg-white/[0.04] p-5 transition hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-white/[0.07] sm:p-6"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-300 transition group-hover:bg-cyan-300 group-hover:text-slate-950">
                <Icone className="h-5 w-5" />
              </div>

              <p className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl">
                <CompteurAnime
                  valeur={statistique.valeur}
                  suffixe={statistique.suffixe}
                  actif={estVisible}
                />
              </p>

              <h2 className="mt-2 font-black text-white">
                {statistique.titre}
              </h2>

              <p className="mt-1 text-sm leading-5 text-slate-400">
                {statistique.texte}
              </p>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
