import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  ClipboardList,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

const liensLigue = [
  {
    titre: "Calendrier",
    description: "Consulte les dates et les heures des matchs.",
    lien: "/ligue/calendrier",
    icone: CalendarDays,
  },
  {
    titre: "Classements",
    description: "Suis les résultats et le classement des équipes.",
    lien: "/classements",
    icone: Trophy,
  },
  {
    titre: "Inscriptions",
    description: "Inscris ton équipe ou joins-toi à la ligue.",
    lien: "/inscriptions",
    icone: ClipboardList,
  },
  {
    titre: "Gestion d’équipe",
    description: "Gère les joueurs et les informations de ton équipe.",
    lien: "/ligue/equipe",
    icone: Users,
  },
  {
    titre: "Règlements",
    description: "Consulte les règlements officiels de la ligue.",
    lien: "/ligue/reglements",
    icone: ShieldCheck,
  },
];

export default function MegaMenuLigue({ ouvert, onFermer }) {
  return (
    <AnimatePresence>
      {ouvert && (
        <motion.div
          id="mega-menu-ligue"
          role="menu"
          initial={{
            opacity: 0,
            y: 10,
            scale: 0.98,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: 8,
            scale: 0.98,
          }}
          transition={{
            duration: 0.18,
            ease: "easeOut",
          }}
          className="absolute left-1/2 top-full z-[10000] w-[620px] -translate-x-1/2 pt-3"
        >
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/95 p-3 shadow-2xl shadow-black/40 backdrop-blur-xl">
            <div className="grid grid-cols-2 gap-2">
              {liensLigue.map((item, index) => {
                const Icone = item.icone;
                const pleineLargeur =
                  liensLigue.length % 2 !== 0 &&
                  index === liensLigue.length - 1;

                return (
                  <Link
                    key={item.lien}
                    to={item.lien}
                    role="menuitem"
                    onClick={onFermer}
                    className={`group flex items-start gap-4 rounded-2xl border border-transparent p-4 transition hover:border-cyan-300/20 hover:bg-white/10 ${
                      pleineLargeur ? "col-span-2" : ""
                    }`}
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-300 transition group-hover:bg-cyan-300 group-hover:text-slate-950">
                      <Icone className="h-5 w-5" />
                    </span>

                    <span>
                      <span className="block text-sm font-black text-white">
                        {item.titre}
                      </span>

                      <span className="mt-1 block text-xs leading-5 text-white/55 transition group-hover:text-white/75">
                        {item.description}
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>

            <div className="mt-2 flex items-center justify-between rounded-2xl bg-gradient-to-r from-cyan-300/15 to-blue-500/10 px-5 py-4">
              <div>
                <p className="text-sm font-black text-white">
                  Prêt à jouer?
                </p>

                <p className="mt-0.5 text-xs text-white/60">
                  Rejoins la communauté LVPSA.
                </p>
              </div>

              <Link
                to="/inscriptions"
                onClick={onFermer}
                className="rounded-xl bg-cyan-300 px-4 py-2 text-xs font-black text-slate-950 transition hover:bg-cyan-200"
              >
                S’inscrire
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
