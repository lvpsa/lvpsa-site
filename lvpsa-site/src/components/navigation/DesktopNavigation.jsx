import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";

import MegaMenuLigue from "./MegaMenuLigue";
import MegaMenuTournoi from "./MegaMenuTournoi";

const liensPrincipaux = [
  {
    titre: "Boutique",
    lien: "/boutique",
  },
  {
    titre: "Galerie",
    lien: "/galerie",
  },
];

const routesLigue = [
  "/ligue/calendrier",
  "/classements",
  "/inscriptions",
  "/ligue/equipe",
  "/ligue/reglements",
];

const routeEstActive = (pathname, route) =>
  pathname === route || pathname.startsWith(`${route}/`);

export default function DesktopNavigation() {
  const location = useLocation();

  const [menuOuvert, setMenuOuvert] = useState(null);

  const ligueEstActive = routesLigue.some((route) =>
    routeEstActive(location.pathname, route)
  );

  const tournoiEstActif =
    location.pathname === "/tournoi" ||
    location.pathname.startsWith("/tournoi/");

  useEffect(() => {
    setMenuOuvert(null);
  }, [location.pathname]);

  const fermerMenu = () => {
    setMenuOuvert(null);
  };

  const basculerMenu = (menu) => {
    setMenuOuvert((menuActuel) =>
      menuActuel === menu ? null : menu
    );
  };

  const gererSortieFocus = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      fermerMenu();
    }
  };

  const gererClavier = (event) => {
    if (event.key === "Escape") {
      fermerMenu();
    }
  };

  const indicateurActif = (
    <motion.span
      layoutId="navigation-active"
      className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-cyan-300"
    />
  );

  return (
    <>
      <nav className="relative hidden items-center gap-7 overflow-visible lg:flex">
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
              {isActive && indicateurActif}
            </>
          )}
        </NavLink>

        <div
          className="relative"
          onMouseEnter={() => setMenuOuvert("ligue")}
          onMouseLeave={fermerMenu}
          onBlur={gererSortieFocus}
          onKeyDown={gererClavier}
        >
          <button
            type="button"
            aria-haspopup="true"
            aria-controls="mega-menu-ligue"
            aria-expanded={menuOuvert === "ligue"}
            onClick={() => basculerMenu("ligue")}
            onFocus={() => setMenuOuvert("ligue")}
            className={`relative flex items-center gap-1.5 py-2 text-sm font-bold transition ${
              ligueEstActive
                ? "text-cyan-300"
                : "text-white/80 hover:text-white"
            }`}
          >
            Ligue

            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                menuOuvert === "ligue" ? "rotate-180" : ""
              }`}
            />

            {ligueEstActive && indicateurActif}
          </button>

          <MegaMenuLigue
            ouvert={menuOuvert === "ligue"}
            onFermer={fermerMenu}
          />
        </div>

        <div
          className="relative"
          onMouseEnter={() => setMenuOuvert("tournoi")}
          onMouseLeave={fermerMenu}
          onBlur={gererSortieFocus}
          onKeyDown={gererClavier}
        >
          <button
            type="button"
            aria-haspopup="true"
            aria-controls="mega-menu-tournoi"
            aria-expanded={menuOuvert === "tournoi"}
            onClick={() => basculerMenu("tournoi")}
            onFocus={() => setMenuOuvert("tournoi")}
            className={`relative flex items-center gap-1.5 py-2 text-sm font-bold transition ${
              tournoiEstActif
                ? "text-cyan-300"
                : "text-white/80 hover:text-white"
            }`}
          >
            Tournoi

            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                menuOuvert === "tournoi" ? "rotate-180" : ""
              }`}
            />

            {tournoiEstActif && indicateurActif}
          </button>

          <MegaMenuTournoi
            ouvert={menuOuvert === "tournoi"}
            onFermer={fermerMenu}
          />
        </div>

        {liensPrincipaux.map((item) => (
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
                {isActive && indicateurActif}
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
    </>
  );
}
