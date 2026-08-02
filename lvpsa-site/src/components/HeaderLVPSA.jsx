import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";

import { auth } from "../firebase";

import DesktopNavigation from "./navigation/DesktopNavigation";
import MobileNavigation from "./navigation/MobileNavigation";

export default function HeaderLVPSA() {
  const [defilement, setDefilement] = useState(false);
  const [user, setUser] = useState(null);
  const [authChargee, setAuthChargee] = useState(false);

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (utilisateurActuel) => {
      setUser(utilisateurActuel);
      setAuthChargee(true);
    });

    return () => unsubscribe();
  }, []);

  const deconnexion = async () => {
    try {
      localStorage.removeItem("lvpsaSessionExpire");
      await signOut(auth);
      window.location.replace("/");
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[9999] overflow-visible transition-all duration-300 ${
        defilement
          ? "border-b border-white/10 bg-slate-950/95 shadow-xl backdrop-blur-xl"
          : "bg-gradient-to-b from-slate-950/90 to-transparent"
      }`}
    >
      <div className="mx-auto flex h-28 max-w-7xl items-center justify-between overflow-visible px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          aria-label="Retour à l’accueil"
          className="flex shrink-0 items-center gap-4"
        >
          <img
            src="/Logo.png"
            alt="Logo LVPSA"
            className="h-28 w-28 object-contain"
          />

          <div className="hidden sm:block">
            <p className="text-[13px] font-black uppercase tracking-[0.16em] text-cyan-300">
              Ligue de volleyball de plage
            </p>

            <p className="mt-1 text-[12px] font-semibold text-slate-400">
              Saint-Augustin-de-Desmaures
            </p>
          </div>
        </Link>

        <div className="flex flex-1 items-center justify-end gap-7">
          <DesktopNavigation
            user={user}
            authChargee={authChargee}
            deconnexion={deconnexion}
          />

          <MobileNavigation
            user={user}
            authChargee={authChargee}
            deconnexion={deconnexion}
          />
        </div>
      </div>
    </header>
  );
}
