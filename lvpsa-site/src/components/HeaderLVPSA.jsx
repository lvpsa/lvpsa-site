import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  CalendarDays,
  ChevronDown,
  Menu,
  Trophy,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";

const liensPrincipaux = [
  { titre: "Accueil", lien: "/" },
  { titre: "Tournoi", lien: "/tournoi" },
  { titre: "Boutique", lien: "/boutique" },
  { titre: "Galerie", lien: "/galerie" },
];

const liensLigue = [
  {
    titre: "Calendrier",
    description: "Consultez tous les matchs de la saison.",
    lien: "/ligue/calendrier",
    icone: CalendarDays,
  },
  {
    titre: "Classements",
    description: "Suivez les résultats et la position des équipes.",
    lien: "/classements",
    icone: Trophy,
  },
  {
    titre: "Inscriptions",
    description: "Inscrivez une équipe ou rejoignez la ligue.",
    lien: "/inscriptions",
    icone: UserPlus,
  },
  {
    titre: "Gestion d’équipe",
    description: "Gérez votre équipe, vos joueurs et vos demandes.",
    lien: "/ligue/equipe",
    icone: Users,
  },
  {
    titre: "Règlements",
    description: "Consultez les règlements officiels de la ligue.",
    lien: "/ligue/reglements",
    icone: BookOpen,
  },
];

const liensTournoi = [
  {
    titre: "Prochain événement",
    description: "Découvrez le prochain tournoi LVPSA.",
    lien: "/tournoi",
    icone: Trophy,
  },
  {
    titre: "Horaire",
    description: "Publié lorsque les inscriptions seront terminées.",
    lien: "/tournoi/horaire",
    icone: CalendarDays,
  },
  {
    titre: "Règlements",
    description: "Consultez les règlements du tournoi.",
    lien: "/tournoi/reglements",
    icone: BookOpen,
  },
  {
    titre: "Galerie 2026",
    description: "Revivez les meilleurs moments du tournoi.",
    lien: "/galerie",
    icone: Users,
  },
];

export default function HeaderLVPSA() {
  const location = useLocation();

  const [estDefile, setEstDefile] = useState(false);
  const [menuOuvert, setMenuOuvert] = useState(false);
  const [ligueDesktopOuverte, setLigueDesktopOuverte] = useState(false);
  const [ligueMobileOuverte, setLigueMobileOuverte] = useState(false);

  const ligueEstActive = liensLigue.some(
    (item) =>
      location.pathname === item.lien ||
      location.pathname.startsWith(`${item.lien}/`)
  );

  useEffect(() => {
    const gererDefilement = () => {
      setEstDefile(window.scrollY > 40);
    };

    gererDefilement();
    window.addEventListener("scroll", gererDefilement);

    return () => {
      window.removeEventListener("scroll", gererDefilement);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOuvert ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOuvert]);

  useEffect(() => {
    setMenuOuvert(false);
    setLigueDesktopOuverte(false);
    setLigueMobileOuverte(false);
  }, [location.pathname]);

  const fermerMenuMobile = () => {
    setMenuOuvert(false);
    setLigueMobileOuverte(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.45 }}
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
          estDefile
            ? "border-b border-white/10 bg-slate-950/90 shadow-xl shadow-black/20 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between px-5 transition-all duration-300 lg:px-8 ${
            estDefile ? "py-3" : "py-5"
          }`}
        >
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3"
            onClick={fermerMenuMobile}
          >
            <div
              className={`shrink-0 overflow-hidden rounded-full border border-white/20 bg-slate-950 transition-all duration-300 ${
                estDefile ? "h-11 w-11" : "h-14 w-14"
              }`}
            >
              <img
                src="/logo.jpg"
                alt="Logo LVPSA"
                className="h-full w-full object-cover"
              />
            </div>

            <div>
              <p
                className={`font-black leading-none tracking-tight text-white transition-all ${
                  estDefile ? "text-lg" : "text-xl"
                }`}
              >
                LVPSA
              </p>

              <p className="mt-1 hidden text-xs font-medium text-slate-300 sm:block">
                Volleyball de plage
              </p>
            </div>
          </Link>

          {/* Navigation ordinateur */}
          <nav className="hidden items-center gap-7 lg:flex">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `relative py-2 text-sm font-bold transition ${
                  isActive
                    ? "text-cyan-300"
                    : "text-white/80 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  Accueil

                  {isActive && (
                    <motion.span
                      layoutId="navigation-active"
                      className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-cyan-300"
                    />
                  )}
                </>
              )}
            </NavLink>

            {/* Sous-menu Ligue */}
            <div
              className="relative"
              onMouseEnter={() => setLigueDesktopOuverte(true)}
              onMouseLeave={() => setLigueDesktopOuverte(false)}
            >
              <button
                type="button"
                onClick={() =>
                  setLigueDesktopOuverte((ouvert) => !ouvert)
                }
                aria-expanded={ligueDesktopOuverte}
                className={`relative flex items-center gap-1.5 py-2 text-sm font-bold transition ${
                  ligueEstActive
                    ? "text-cyan-300"
                    : "text-white/80 hover:text-white"
                }`}
              >
                Ligue

                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    ligueDesktopOuverte ? "rotate-180" : ""
                  }`}
                />

                {ligueEstActive && (
                  <motion.span
                    layoutId="navigation-active"
                    className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-cyan-300"
                  />
                )}
              </button>

              <AnimatePresence>
                {ligueDesktopOuverte && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                    className="absolute left-1/2 top-full z-50 w-[440px] -translate-x-1/2 pt-5"
                  >
                    <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/95 p-3 shadow-2xl shadow-black/40 backdrop-blur-2xl">
                      <div className="border-b border-white/10 px-4 pb-4 pt-2">
                        <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
                          Ligue LVPSA
                        </p>

                        <p className="mt-2 text-sm leading-6 text-slate-400">
                          Tout ce qu’il faut pour suivre et gérer votre
                          saison.
                        </p>
                      </div>

                      <div className="mt-2 space-y-1">
                        {liensLigue.map((item) => {
                          const Icone = item.icone;

                          const estActif =
                            location.pathname === item.lien ||
                            location.pathname.startsWith(
                              `${item.lien}/`
                            );

                          return (
                            <Link
                              key={item.lien}
                              to={item.lien}
                              className={`group flex items-center gap-4 rounded-2xl px-4 py-3.5 transition ${
                                estActif
                                  ? "bg-cyan-300/10"
                                  : "hover:bg-white/5"
                              }`}
                            >
                              <div
                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition ${
                                  estActif
                                    ? "border-cyan-300/30 bg-cyan-300/15 text-cyan-300"
                                    : "border-white/10 bg-white/5 text-slate-300 group-hover:border-cyan-300/20 group-hover:text-cyan-300"
                                }`}
                              >
                                <Icone className="h-5 w-5" />
                              </div>

                              <div className="min-w-0 flex-1">
                                <p
                                  className={`font-bold transition ${
                                    estActif
                                      ? "text-cyan-300"
                                      : "text-white group-hover:text-cyan-300"
                                  }`}
                                >
                                  {item.titre}
                                </p>

                                <p className="mt-1 text-sm leading-5 text-slate-400">
                                  {item.description}
                                </p>
                              </div>

                              <span className="text-lg text-slate-600 transition group-hover:translate-x-1 group-hover:text-cyan-300">
                                →
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {liensPrincipaux
              .filter((item) => item.lien !== "/")
              .map((item) => (
                <NavLink
                  key={item.lien}
                  to={item.lien}
                  className={({ isActive }) =>
                    `relative py-2 text-sm font-bold transition ${
                      isActive
                        ? "text-cyan-300"
                        : "text-white/80 hover:text-white"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {item.titre}

                      {isActive && (
                        <motion.span
                          layoutId="navigation-active"
                          className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-cyan-300"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
          </nav>

          {/* Actions ordinateur */}
          <div className="hidden items-center gap-3 lg:flex">
            <Link
              to="/connexion"
              className="rounded-xl border border-white/20 bg-slate-950/25 px-5 py-2.5 text-sm font-black text-white backdrop-blur-md transition hover:bg-white/15"
            >
              Connexion
            </Link>

            <Link
              to="/inscriptions"
              className="rounded-xl bg-cyan-300 px-5 py-2.5 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-200"
            >
              S’inscrire
            </Link>
          </div>

          {/* Bouton mobile */}
          <button
            type="button"
            aria-label={menuOuvert ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOuvert}
            onClick={() => setMenuOuvert((ouvert) => !ouvert)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-slate-950/35 text-white backdrop-blur-md lg:hidden"
          >
            {menuOuvert ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </motion.header>

      {/* Menu mobile */}
      <AnimatePresence>
        {menuOuvert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 overflow-y-auto bg-slate-950/98 px-5 pb-8 pt-28 backdrop-blur-xl lg:hidden"
          >
            <nav className="mx-auto flex max-w-lg flex-col">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <NavLink
                  to="/"
                  onClick={fermerMenuMobile}
                  className={({ isActive }) =>
                    `flex items-center justify-between border-b border-white/10 py-5 text-2xl font-black ${
                      isActive ? "text-cyan-300" : "text-white"
                    }`
                  }
                >
                  Accueil
                  <span className="text-sm text-slate-500">01</span>
                </NavLink>
              </motion.div>

              {/* Ligue mobile */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 }}
                className="border-b border-white/10"
              >
                <button
                  type="button"
                  onClick={() =>
                    setLigueMobileOuverte((ouvert) => !ouvert)
                  }
                  aria-expanded={ligueMobileOuverte}
                  className={`flex w-full items-center justify-between py-5 text-left text-2xl font-black ${
                    ligueEstActive ? "text-cyan-300" : "text-white"
                  }`}
                >
                  <span>Ligue</span>

                  <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-500">02</span>

                    <ChevronDown
                      className={`h-5 w-5 transition-transform duration-200 ${
                        ligueMobileOuverte ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {ligueMobileOuverte && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-2 pb-5">
                        {liensLigue.map((item) => {
                          const Icone = item.icone;

                          const estActif =
                            location.pathname === item.lien ||
                            location.pathname.startsWith(
                              `${item.lien}/`
                            );

                          return (
                            <Link
                              key={item.lien}
                              to={item.lien}
                              onClick={fermerMenuMobile}
                              className={`flex items-center gap-3 rounded-2xl border px-4 py-3.5 transition ${
                                estActif
                                  ? "border-cyan-300/30 bg-cyan-300/10 text-cyan-300"
                                  : "border-white/10 bg-white/5 text-white"
                              }`}
                            >
                              <Icone className="h-5 w-5 shrink-0" />

                              <span className="font-bold">
                                {item.titre}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {liensPrincipaux
                .filter((item) => item.lien !== "/")
                .map((item, index) => (
                  <motion.div
                    key={item.lien}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (index + 2) * 0.05 }}
                  >
                    <NavLink
                      to={item.lien}
                      onClick={fermerMenuMobile}
                      className={({ isActive }) =>
                        `flex items-center justify-between border-b border-white/10 py-5 text-2xl font-black ${
                          isActive ? "text-cyan-300" : "text-white"
                        }`
                      }
                    >
                      {item.titre}

                      <span className="text-sm text-slate-500">
                        0{index + 3}
                      </span>
                    </NavLink>
                  </motion.div>
                ))}

              <div className="mt-8 grid gap-3">
                <Link
                  to="/connexion"
                  onClick={fermerMenuMobile}
                  className="rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-center font-black text-white"
                >
                  Connexion
                </Link>

                <Link
                  to="/inscriptions"
                  onClick={fermerMenuMobile}
                  className="rounded-2xl bg-cyan-300 px-6 py-4 text-center font-black text-slate-950"
                >
                  Rejoindre la ligue
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
