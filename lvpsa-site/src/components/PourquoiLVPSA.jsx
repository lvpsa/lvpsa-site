import { motion } from "framer-motion";
import { ArrowRight, Heart, UsersRound, Volleyball } from "lucide-react";
import { Link } from "react-router-dom";

const valeurs = [
  {
    titre: "Bouger ensemble",
    texte:
      "Créer davantage d’occasions de pratiquer une activité physique dans notre région.",
    icone: Volleyball,
  },
  {
    titre: "Rassembler",
    texte:
      "Offrir un lieu où les joueurs, les familles, les bénévoles et les partenaires se retrouvent.",
    icone: UsersRound,
  },
  {
    titre: "Développer une communauté",
    texte:
      "Faire grandir le volleyball de plage dans une ambiance accessible, positive et rassembleuse.",
    icone: Heart,
  },
];

export default function PourquoiLVPSA() {
  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-slate-950 py-16 lg:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-yellow-300/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid items-stretch gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="relative min-h-[480px] overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900 shadow-2xl shadow-black/30 lg:min-h-[680px]"
          >
            <img
              src="/galerie/galerie-04.jpg"
              alt="La communauté LVPSA réunie lors du tournoi"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
              onError={(event) => {
                event.currentTarget.src = "/hero-lvpsa.jpg";
              }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <div className="max-w-lg rounded-3xl border border-white/15 bg-slate-950/55 p-5 backdrop-blur-xl sm:p-6">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-yellow-300">
                  Notre raison d’être
                </p>

                <p className="mt-3 text-xl font-black leading-snug text-white sm:text-2xl">
                  Soutenir et encourager l’activité physique dans notre région.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Contenu */}
          <motion.div
            initial={{ opacity: 0, x: 35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="flex flex-col justify-center"
          >
            <div className="flex items-center gap-3 text-cyan-300">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-300/10">
                <Heart className="h-5 w-5" />
              </div>

              <p className="text-sm font-black uppercase tracking-[0.2em]">
                Pourquoi la LVPSA?
              </p>
            </div>

            <h2 className="mt-7 max-w-2xl text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Nous n’avons pas seulement créé une ligue.
              <span className="mt-2 block text-yellow-300">
                Nous avons créé un endroit où les gens se retrouvent.
              </span>
            </h2>

            <div className="mt-7 max-w-2xl space-y-5 text-base leading-8 text-slate-300 sm:text-lg">
              <p>
                La LVPSA est née d’une volonté simple : rendre le volleyball de
                plage plus accessible et donner aux gens de notre région une
                nouvelle raison de bouger, de se dépasser et de se réunir.
              </p>

              <p>
                Derrière chaque match, chaque tournoi et chaque activité, il y
                a des joueurs, des bénévoles, des familles et des partenaires
                qui contribuent à bâtir une véritable communauté.
              </p>

              <p className="font-bold text-white">
                Parce que le volleyball est plus qu’un sport. C’est une
                communauté.
              </p>
            </div>

            <div className="mt-10 grid gap-4">
              {valeurs.map((valeur, index) => {
                const Icone = valeur.icone;

                return (
                  <motion.article
                    key={valeur.titre}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.45,
                      delay: 0.12 + index * 0.08,
                    }}
                    className="flex gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-cyan-300/25 hover:bg-white/[0.07]"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-300">
                      <Icone className="h-6 w-6" />
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-white">
                        {valeur.titre}
                      </h3>

                      <p className="mt-1 leading-6 text-slate-400">
                        {valeur.texte}
                      </p>
                    </div>
                  </motion.article>
                );
              })}
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/inscriptions"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-6 py-4 font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-200"
              >
                Faire partie de la communauté
                <ArrowRight className="h-5 w-5" />
              </Link>

              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-4 font-black text-white transition hover:bg-white/10"
              >
                Nous contacter
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
