import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

const liens = [
  { titre: "Accueil", lien: "/" },
  { titre: "Ligue", lien: "/ligue" },
  { titre: "Tournoi", lien: "/tournoi" },
  { titre: "Boutique", lien: "/boutique" },
  { titre: "Galerie", lien: "/galerie" },
];

export default function HeaderLVPSA() {
  const [estDefile, setEstDefile] = useState(false);
  const [menuOuvert, setMenuOuvert] = useState(false);

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
          <Link
            to="/"
            className="flex items-center gap-3"
            onClick={() => setMenuOuvert(false)}
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

          <nav className="hidden items-center gap-7 lg:flex">
            {liens.map((item) => (
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

          <button
            type="button"
            aria-label={menuOuvert ? "Fermer le menu" : "Ouvrir le menu"}
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

      <AnimatePresence>
        {menuOuvert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-950/98 px-5 pb-8 pt-28 backdrop-blur-xl lg:hidden"
          >
            <nav className="mx-auto flex max-w-lg flex-col">
              {liens.map((item, index) => (
                <motion.div
                  key={item.lien}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <NavLink
                    to={item.lien}
                    onClick={() => setMenuOuvert(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between border-b border-white/10 py-5 text-2xl font-black ${
                        isActive ? "text-cyan-300" : "text-white"
                      }`
                    }
                  >
                    {item.titre}
                    <span className="text-sm text-slate-500">0{index + 1}</span>
                  </NavLink>
                </motion.div>
              ))}

              <div className="mt-8 grid gap-3">
                <Link
                  to="/connexion"
                  onClick={() => setMenuOuvert(false)}
                  className="rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-center font-black text-white"
                >
                  Connexion
                </Link>

                <Link
                  to="/inscriptions"
                  onClick={() => setMenuOuvert(false)}
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
