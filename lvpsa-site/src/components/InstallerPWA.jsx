import { useEffect, useState } from "react";

export default function InstallerPWA() {
  const [inviteInstallation, setInviteInstallation] = useState(null);
  const [estIOS, setEstIOS] = useState(false);
  const [estInstallee, setEstInstallee] = useState(false);
  const [afficherInstructionsIOS, setAfficherInstructionsIOS] = useState(false);

  useEffect(() => {
    const navigateurIOS =
      /iphone|ipad|ipod/i.test(window.navigator.userAgent);

    const modeStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    setEstIOS(navigateurIOS);
    setEstInstallee(modeStandalone);

    const gererBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setInviteInstallation(event);
    };

    const gererInstallation = () => {
      setEstInstallee(true);
      setInviteInstallation(null);
    };

    window.addEventListener(
      "beforeinstallprompt",
      gererBeforeInstallPrompt
    );

    window.addEventListener(
      "appinstalled",
      gererInstallation
    );

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        gererBeforeInstallPrompt
      );

      window.removeEventListener(
        "appinstalled",
        gererInstallation
      );
    };
  }, []);

  const installerApplication = async () => {
    if (estIOS) {
      setAfficherInstructionsIOS(true);
      return;
    }

    if (!inviteInstallation) {
      alert(
        "L’installation n’est pas encore offerte par votre navigateur. Ouvrez le menu du navigateur et choisissez « Installer l’application » ou « Ajouter à l’écran d’accueil »."
      );
      return;
    }

    inviteInstallation.prompt();

    const resultat = await inviteInstallation.userChoice;

    if (resultat.outcome === "accepted") {
      setEstInstallee(true);
    }

    setInviteInstallation(null);
  };

  if (estInstallee) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={installerApplication}
        className="fixed bottom-5 right-5 z-[90] flex items-center gap-3 rounded-full bg-amber-400 px-6 py-4 font-black text-slate-950 shadow-2xl transition hover:bg-amber-300"
      >
        <span className="text-xl">📱</span>
        Installer l’application LVPSA
      </button>

      {afficherInstructionsIOS && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-5 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setAfficherInstructionsIOS(false);
            }
          }}
        >
          <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-slate-950 p-7 shadow-2xl">
            <h2 className="text-3xl font-black text-white">
              Installer LVPSA sur iPhone
            </h2>

            <p className="mt-4 leading-7 text-slate-300">
              Dans Safari :
            </p>

            <ol className="mt-5 space-y-4 text-slate-200">
              <li>
                <span className="font-black text-amber-300">1.</span>{" "}
                Appuyez sur le bouton Partager.
              </li>

              <li>
                <span className="font-black text-amber-300">2.</span>{" "}
                Sélectionnez « Sur l’écran d’accueil ».
              </li>

              <li>
                <span className="font-black text-amber-300">3.</span>{" "}
                Appuyez sur « Ajouter ».
              </li>
            </ol>

            <button
              type="button"
              onClick={() => setAfficherInstructionsIOS(false)}
              className="mt-7 w-full rounded-full bg-amber-400 px-6 py-3 font-black text-slate-950 hover:bg-amber-300"
            >
              J’ai compris
            </button>
          </div>
        </div>
      )}
    </>
  );
}
