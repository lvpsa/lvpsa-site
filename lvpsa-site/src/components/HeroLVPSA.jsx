import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CloudSun,
  UsersRound,
} from "lucide-react";

const cartes = [
  {
    titre: "Météo",
    texte: "Conditions à Saint-Augustin",
    icone: CloudSun,
    couleur: "text-yellow-300",
    bordure: "border-white/15",
  },
  {
    titre: "Statut des terrains",
    texte: "Consultez les mises à jour",
    icone: CheckCircle2,
    couleur: "text-emerald-300",
    bordure: "border-emerald-300/25",
  },
  {
    titre: "Prochains matchs",
    texte: "Consultez l’horaire officiel",
    icone: CalendarDays,
    couleur: "text-yellow-300",
    bordure: "border-yellow-300/25",
  },
  {
    titre: "Une vraie communauté",
    texte: "Joueurs, bénévoles et partenaires",
    icone: UsersRound,
    couleur: "text-cyan-300",
    bordure: "border-cyan-300/25",
  },
];

export default function HeroLVPSA() {
  return (
    <section className="relative min-h-[760px] overflow-hidden border-b border-white/10 lg:min-h-[820px]">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/hero-lvpsa.jpg')",
        }}
      />

      <div className="absolute inset-0 bg-slate-950/35" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/75 to-slate-950/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/20" />

      <div className="relative z-10 mx-auto flex min-h-[760px] max-w-7xl flex-col justify-end px-5 pb-8 pt-24 lg:min-h-[820px] lg:px-8 lg:pb-10">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-slate-950/45 px-4 py-2 text-sm font-bold text-cyan-200 backdrop-blur-md"
          >
            <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(103,232,249,0.9)]" />
            Volleyball de plage à Saint-Augustin
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-8xl"
          >
            LVPSA

            <span className="mt-3 block max-w-3xl text-3xl leading-tight sm:text-4xl lg:text-5xl">
              La communauté de
              <span className="text-yellow-300">
                {" "}volleyball de plage{" "}
              </span>
              de la région.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="mt-6 max-w-xl text-base font-medium leading-7 text-slate-200 sm:text-lg"
          >
            Compétition, plaisir et dépassement. Une ligue rassembleuse où
            chaque soirée devient une expérience.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Link
              to="/inscriptions"
              className="inline-flex items-center justify-center gap-3 rounded-2xl bg-cyan-300 px-7 py-4 font-black text-slate-950 shadow-xl shadow-cyan-500/20 transition hover:-translate-y-1 hover:bg-cyan-200"
            >
              Rejoindre la ligue
              <ArrowRight className="h-5 w-5" />
            </Link>

            <Link
              to="/calendrier"
              className="inline-flex items-center justify-center gap-3 rounded-2xl border border-white/30 bg-slate-950/35 px-7 py-4 font-black text-white backdrop-blur-md transition hover:bg-white/15"
            >
              Voir le calendrier
              <CalendarDays className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.34 }}
          className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        >
          {cartes.map((carte) => {
            const Icone = carte.icone;

            return (
              <article
                key={carte.titre}
                className={`rounded-2xl border ${carte.bordure} bg-slate-950/65 p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-slate-950/80`}
              >
                <div className="flex items-start gap-4">
                  <Icone
                    className={`h-8 w-8 shrink-0 ${carte.couleur}`}
                  />

                  <div>
                    <h2 className="text-xl font-black">{carte.titre}</h2>
                    <p className="mt-1 text-sm text-slate-300">
                      {carte.texte}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
