import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  ChevronDown,
  CircleHelp,
  ClipboardList,
  LogIn,
  Menu,
  ShieldCheck,
  ShoppingBag,
  Trophy,
  UserRound,
  Users,
  X,
  Images,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const liensLigue = [
  {
    titre: "Calendrier",
    lien: "/ligue/calendrier",
    icone: CalendarDays,
  },
  {
    titre: "Classements",
    lien: "/classements",
    icone: Trophy,
  },
  {
    titre: "Inscriptions",
    lien: "/inscriptions",
    icone: ClipboardList,
  },
  {
    titre: "Gestion d’équipe",
    lien: "/ligue/equipe",
    icone: Users,
  },
  {
    titre: "Règlements",
    lien: "/ligue/reglements",
    icone: ShieldCheck,
  },
];

const liensTournoi = [
  {
    titre: "Le tournoi",
    lien: "/tournoi",
    icone: Trophy,
  },
  {
    titre: "Horaire",
    lien: "/tournoi/horaire",
    icone: CalendarDays,
  },
  {
    titre: "Règlements",
    lien: "/tournoi/reglements",
    icone: ShieldCheck,
  },
  {
    titre: "Questions fréquentes",
    lien: "/tournoi#questions",
    icone: CircleHelp,
  },
];

export default function MobileNavigation() {
  const location = useLocation();

  const [menuOuvert, setMenuOuvert] = useState(false);
  const [sectionOuverte, setSectionOuverte] = useState(null);

  useEffect(() => {
    setMenuOuvert(false);
    setSectionOuverte(null);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOuvert ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOuvert]);

  const fermerMenu = () => {
    setMenuOuvert(false);
    setSectionOuverte(null);
  };

  const basculerSection = (section) => {
    setSectionOuverte((sectionActuelle) =>
      sectionActuelle === section ? null : section
    );
  };

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label="Ouvrir le menu"
        aria-expanded={menuOuvert}
        onClick={() => setMenuOuvert(true)}
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white transition hover:bg-white/20"
      >
        <Menu className="h-6 w-6" />
      </button>

      <AnimatePresence>
        {menuOuvert && (
          <>
            <motion.button
              type="button"
              aria-label="Fermer le menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={fermerMenu}
              className="fixed inset-0 z-40 bg-slate-950/75 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{
                duration: 0.25,
                ease: "easeOut",
              }}
              className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l border-white/10 bg-slate-950 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <Link
                  to="/"
                  onClick={fermerMenu}
                  className="flex items-center gap-3"
                >
                  <img
                    src="/logo.jpg"
                    alt="LVPSA"
                    className="h-11 w-11 rounded-xl object-cover"
                  />

                  <div>
                    <p className="text-sm font-black text-white">
                      LVPSA
                    </p>

                    <p className="text-xs text-white/50">
                      Menu principal
                    </p>
                  </div>
                </Link>

                <button
                  type="button"
                  aria-label="Fermer le menu"
                  onClick={fermerMenu}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-5">
                <div className="space-y-2">
                  <Link
                    to="/"
                    onClick={fermerMenu}
                    className="flex items-center rounded-2xl px-4 py-3 text-sm font-bold text-white/80 transition hover:bg-white/10 hover:text-white"
                  >
                    Accueil
                  </Link>

                  <div className="overflow-hidden rounded-2xl border border-white/10">
                    <button
                      type="button"
                      aria-expanded={sectionOuverte === "ligue"}
                      onClick={() => basculerSection("ligue")}
                      className="flex w-full items-center justify-between px-4 py-3.5 text-left text-sm font-black text-white"
                    >
                      Ligue

                      <ChevronDown
                        className={`h-5 w-5 transition-transform ${
                          sectionOuverte === "ligue"
                            ? "rotate-180"
                            : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {sectionOuverte === "ligue" && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-1 border-t border-white/10 p-2">
                            {liensLigue.map((item) => {
                              const Icone = item.icone;

                              return (
                                <Link
                                  key={item.lien}
                                  to={item.lien}
                                  onClick={fermerMenu}
                                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-white/65 transition hover:bg-white/10 hover:text-white"
                                >
                                  <Icone className="h-4 w-4 text-cyan-300" />
                                  {item.titre}
                                </Link>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-white/10">
                    <button
                      type="button"
                      aria-expanded={sectionOuverte === "tournoi"}
                      onClick={() => basculerSection("tournoi")}
                      className="flex w-full items-center justify-between px-4 py-3.5 text-left text-sm font-black text-white"
                    >
                      Tournoi

                      <ChevronDown
                        className={`h-5 w-5 transition-transform ${
                          sectionOuverte === "tournoi"
                            ? "rotate-180"
                            : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {sectionOuverte === "tournoi" && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-1 border-t border-white/10 p-2">
                            {liensTournoi.map((item) => {
                              const Icone = item.icone;

                              return (
                                <Link
                                  key={item.titre}
                                  to={item.lien}
                                  onClick={fermerMenu}
                                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-white/65 transition hover:bg-white/10 hover:text-white"
                                >
                                  <Icone className="h-4 w-4 text-cyan-300" />
                                  {item.titre}
                                </Link>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <Link
                    to="/boutique"
                    onClick={fermerMenu}
                    className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-white/80 transition hover:bg-white/10 hover:text-white"
                  >
                    <ShoppingBag className="h-5 w-5 text-cyan-300" />
                    Boutique
                  </Link>

                  <Link
                    to="/galerie"
                    onClick={fermerMenu}
                    className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-white/80 transition hover:bg-white/10 hover:text-white"
                  >
                    <Images className="h-5 w-5 text-cyan-300" />
                    Galerie
                  </Link>

                  <Link
                    to="/mon-espace"
                    onClick={fermerMenu}
                    className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-white/80 transition hover:bg-white/10 hover:text-white"
                  >
                    <UserRound className="h-5 w-5 text-cyan-300" />
                    Mon espace
                  </Link>
                </div>
              </div>

              <div className="space-y-3 border-t border-white/10 p-4">
                <Link
                  to="/connexion"
                  onClick={fermerMenu}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-3 text-sm font-black text-white transition hover:bg-white/10"
                >
                  <LogIn className="h-4 w-4" />
                  Connexion
                </Link>

                <Link
                  to="/inscriptions"
                  onClick={fermerMenu}
                  className="flex w-full items-center justify-center rounded-xl bg-cyan-300 px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-200"
                >
                  S’inscrire
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
