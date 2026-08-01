import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DesktopNavigation from "./navigation/DesktopNavigation";
import MobileNavigation from "./navigation/MobileNavigation";

export default function HeaderLVPSA() {
  const [defilement, setDefilement] = useState(false);

  useEffect(() => {
    const gererDefilement = () => {
      setDefilement(window.scrollY > 20);
    };

    gererDefilement();
    window.addEventListener("scroll", gererDefilement);

    return () => {
      window.removeEventListener("scroll", gererDefilement);
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[9999] overflow-visible transition-all duration-300 ${
        defilement
          ? "border-b border-white/10 bg-slate-950/95 shadow-xl backdrop-blur-xl"
          : "bg-gradient-to-b from-slate-950/90 to-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between overflow-visible px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          aria-label="Retour à l’accueil"
          className="flex shrink-0 items-center gap-3"
        >
          <img
            src="/logo.jpg"
            alt="Logo LVPSA"
            className="h-12 w-12 rounded-xl border border-white/10 object-cover shadow-lg"
          />

          <div className="hidden sm:block">
            <p className="text-lg font-black leading-none text-white">
              LVPSA
            </p>

            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
              Volleyball de plage
            </p>
          </div>
        </Link>

        <div className="flex flex-1 items-center justify-end gap-7">
          <DesktopNavigation />
          <MobileNavigation />
        </div>
      </div>
    </header>
  );
}
