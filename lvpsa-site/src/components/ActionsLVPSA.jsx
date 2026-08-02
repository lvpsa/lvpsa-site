import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  ShoppingBag,
  Trophy,
  UsersRound,
} from "lucide-react";

const actions = [
  {
    titre: "Calendrier",
    texte: "Consultez les prochains matchs et les horaires de la ligue.",
    lien: "/calendrier",
    image: "/galerie/galerie-05.jpg",
    icone: CalendarDays,
    format: "lg:col-span-2",
    couleur: "text-cyan-300",
  },
  {
    titre: "Classements",
    texte: "Suivez les résultats et la progression des équipes.",
    lien: "/classements",
    image: "/galerie/galerie-21.jpg",
    icone: Trophy,
    format: "",
    couleur: "text-yellow-300",
  },
  {
    titre: "Mon équipe",
    texte: "Accédez à vos joueurs, matchs et remplacements.",
    lien: "/connexion",
    image: "/galerie/galerie-14.jpg",
    icone: UsersRound,
    format: "",
    couleur: "text-emerald-300",
  },
  {
    titre: "Boutique officielle",
    texte: "Portez fièrement les couleurs de la LVPSA.",
    lien: "/boutique",
    image: "/galerie/galerie-03.jpg",
    icone: ShoppingBag,
    format: "lg:col-span-2",
    couleur: "text-fuchsia-300",
  },
];

export default function ActionsLVPSA() {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-300">
            Découvrez la LVPSA
          </p>

          <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
            Tout ce dont vous avez besoin, au même endroit.
          </h2>

          <p className="mt-4 max-w-2xl leading-7 text-slate-400">
            Calendrier, résultats, gestion d’équipe et boutique officielle :
            accédez rapidement aux principales sections de la ligue.
          </p>
        </motion.div>

        <div className="grid auto-rows-[300px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {actions.map((action, index) => {
            const Icone = action.icone;

            return (
              <motion.div
                key={action.titre}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.07,
                }}
                className={action.format}
              >
                <Link
                  to={action.lien}
                  className="group relative block h-full overflow-hidden rounded-3xl border border-white/10 bg-slate-900"
                >
                  <img
                    src={action.image}
                    alt={action.titre}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    onError={(event) => {
                      event.currentTarget.src = "/hero-lvpsa.jpg";
                    }}
                  />

                  <div className="absolute inset-0 bg-slate-950/25 transition group-hover:bg-slate-950/10" />

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                  <div className="relative flex h-full flex-col justify-between p-6 sm:p-7">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-slate-950/45 backdrop-blur-md ${action.couleur}`}
                    >
                      <Icone className="h-6 w-6" />
                    </div>

                    <div>
                      <h3 className="text-2xl font-black text-white sm:text-3xl">
                        {action.titre}
                      </h3>

                      <p className="mt-2 max-w-md text-sm leading-6 text-slate-200 sm:text-base">
                        {action.texte}
                      </p>

                      <span className="mt-5 inline-flex items-center gap-2 font-black text-white">
                        Découvrir
                        <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
