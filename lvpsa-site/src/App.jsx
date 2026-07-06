import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link, useParams } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";
import { createUserWithEmailAndPassword } from "firebase/auth";

import { auth, db } from "./firebase";
import AdminCommandesBoutique from "./components/boutique/AdminCommandesBoutique";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  sendPasswordResetEmail
} from "firebase/auth";

import {
  doc,
  getDoc,
  getDocs,
  collection,
  setDoc,
  addDoc,
  updateDoc,
  serverTimestamp,
  writeBatch,
  increment,
} from "firebase/firestore";

import { produitsBoutique } from "./data/produits";

import { useInventaire } from "./hooks/useInventaire";

import BoutiquesV2 from "./pages/BoutiquesV2";

import { initialiserBoutiqueFirebase } from "./services/firebaseBoutique";

import AdminBoutiqueV2 from "./components/admin/boutique/AdminBoutiqueV2";

import { uniformiserRemplacementsSansSupprimer } from "./firebase";

import {
  Calendar,
  Trophy,
  Mail,
  MapPin,
  ExternalLink,
 CheckCircle2,
  CloudSun,
  Lock,
  LogIn,
} from "lucide-react";
import "./index.css";
import emailjs from "@emailjs/browser";

const email = "liguevpsa@gmail.com";
const tournoiLink = "https://forms.gle/csLUt6NmcjNADcBm7";
const sheetLink = "https://docs.google.com/spreadsheets/d/1-Y5gsmgi-V8TjSQbl2xIPuDx1QxTPL0S/edit?usp=drive_link&ouid=116934157877214569210&rtpof=true&sd=true";
const meteoLink = "https://www.meteomedia.com/ca/meteo/quebec/saint-augustin-de-desmaures";
const normaliserTexteGlobal = (valeur) =>
  String(valeur || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const normaliserCategorieGlobal = (valeur) => {
  const texte = normaliserTexteGlobal(valeur).replace(/\s+/g, "-");

  if (texte.includes("recreatif")) return "recreatif";
  if (texte.includes("competitif")) return "competitif";
  if (texte.includes("deux")) return "les-deux";

  return texte;
};

const nomEquipeGlobal = (equipe) =>
  equipe?.nom ||
  equipe?.nomEquipe ||
  equipe?.equipeNom ||
  equipe?.equipenom ||
  equipe?.equipe ||
  "";

const capitaineNomGlobal = (equipe) =>
  equipe?.capitaineNom ||
  equipe?.capitainenom ||
  equipe?.capitaine ||
  equipe?.nomCapitaine ||
  "Non assigné";

const memeEquipeGlobal = (membre, equipe) => {
  if (!membre || !equipe) return false;

  const equipeId = equipe.id || equipe.equipeId || "";
  const equipeNom = nomEquipeGlobal(equipe);

  const membreEquipeId = membre.equipeId || membre.idEquipe || "";
  const membreEquipeNom =
    membre.equipeNom ||
    membre.nomEquipe ||
    membre.equipenom ||
    membre.equipe ||
    "";

  return (
    (equipeId && membreEquipeId && equipeId === membreEquipeId) ||
    (equipeNom &&
      membreEquipeNom &&
      normaliserTexteGlobal(equipeNom) === normaliserTexteGlobal(membreEquipeNom))
  );
};

async function chargerEquipesLVPSA() {
  const [teamsSnap, equipesSnap] = await Promise.all([
    getDocs(collection(db, "Teams")),
    getDocs(collection(db, "Equipes")),
  ]);

  const toutes = [
    ...teamsSnap.docs.map((docItem) => ({
      id: docItem.id,
      sourceCollection: "Teams",
      ...docItem.data(),
    })),
    ...equipesSnap.docs.map((docItem) => ({
      id: docItem.id,
      sourceCollection: "Equipes",
      ...docItem.data(),
    })),
  ];

  const uniques = new Map();

  toutes.forEach((equipe) => {
    const cle = equipe.id || normaliserTexteGlobal(nomEquipeGlobal(equipe));
    if (!uniques.has(cle)) {
      uniques.set(cle, equipe);
    }
  });

  return Array.from(uniques.values());
}

const estRemplacantGlobal = (data) => {
  const equipeId = normaliserTexteGlobal(data.equipeId);

  return (
    data.estRemplacant === true ||
    data.role === "remplacant" ||
    equipeId === "independant"
  );
};

const extraireCategoriesRemplacantGlobal = (data) => {
  const valeurs = Array.isArray(data.categories)
    ? data.categories
    : [data.categorie, data.catégorie, data.type].filter(Boolean);

  const categories = valeurs.flatMap((valeur) => {
    const categorie = normaliserCategorieGlobal(valeur);

    if (categorie === "les-deux") {
      return ["recreatif", "competitif"];
    }

    return categorie ? [categorie] : [];
  });

  return [...new Set(categories)];
};

const convertirUserEnRemplacantGlobal = (id, data) => {
  const emailFinal = data.email || data.courriel || "";

  return {
    id,
    userId: id,
    nom: data.nom || "",
    email: emailFinal,
    courriel: emailFinal,
    telephone: data.telephone || "",
    categories: extraireCategoriesRemplacantGlobal(data),
    note: data.note || data.commentaire || "",
    disponible: data.disponible === false ? false : true,
    statut: data.statut || "actif",
    source: "users",
    ...data,
  };
};

const normaliserRemplacementGlobal = (id, data) => {
  const emailFinal = data.email || data.courriel || "";

  return {
    id,
    ...data,
    userId: data.userId || id,
    nom: data.nom || "",
    email: emailFinal,
    courriel: data.courriel || emailFinal,
    telephone: data.telephone || "",
    categories: extraireCategoriesRemplacantGlobal(data),
    note: data.note || data.commentaire || "",
    disponible: data.disponible === false ? false : true,
    statut: data.statut || "actif",
    source: "remplacements",
  };
};

const fusionnerRemplacementsGlobal = (remplacementsFirestore, usersFirestore) => {
  const map = new Map();

  remplacementsFirestore.forEach((item) => {
    map.set(item.id, normaliserRemplacementGlobal(item.id, item));
  });

  usersFirestore.forEach((user) => {
    if (!estRemplacantGlobal(user)) return;

    const depuisUser = convertirUserEnRemplacantGlobal(user.id, user);
    const existant = map.get(user.id);

    if (existant) {
      map.set(user.id, {
        ...depuisUser,
        ...existant,
        nom: existant.nom || depuisUser.nom,
        email: existant.email || depuisUser.email,
        courriel: existant.courriel || depuisUser.courriel,
        telephone: existant.telephone || depuisUser.telephone,
        categories:
          existant.categories?.length > 0
            ? existant.categories
            : depuisUser.categories,
        note: existant.note || depuisUser.note,
      });
    } else {
      map.set(user.id, depuisUser);
    }
  });

  return Array.from(map.values()).sort((a, b) =>
    String(a.nom || "").localeCompare(String(b.nom || ""), "fr")
  );
};

async function traiterReponseDemandeRemplacement(demandeId, action, currentUser) {
  const demandeRef = doc(db, "demandesRemplacements", demandeId);
  const demandeSnap = await getDoc(demandeRef);

  if (!demandeSnap.exists()) {
    throw new Error("Demande introuvable.");
  }

  const demande = {
    id: demandeSnap.id,
    ...demandeSnap.data(),
  };

  const emailUser = normaliserTexteGlobal(currentUser?.email);
  const emailDemande = normaliserTexteGlobal(demande.remplacantEmail);

  const estBonRemplacant =
    demande.remplacantId === currentUser?.uid ||
    emailUser === emailDemande;

  if (!estBonRemplacant) {
    throw new Error("Cette demande ne vous est pas destinée.");
  }

  if (demande.statut !== "en_attente") {
    return {
      dejaRepondu: true,
      statut: demande.statut,
    };
  }

  if (action === "accepter") {
    await updateDoc(demandeRef, {
      statut: "accepte",
      reponseAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    await setDoc(
      doc(db, "historiqueRemplacements", demandeId),
      {
        demandeId,
        date: demande.date,
        dateLabel: demande.dateLabel || demande.date,
        categorie: demande.categorie,

        equipeId: demande.equipeId || "",
        equipeNom: demande.equipeNom || "",

        joueurRemplaceId: demande.joueurRemplaceId || "",
        joueurRemplaceNom: demande.joueurRemplaceNom || "",

        remplacantId: demande.remplacantId || "",
        remplacantNom: demande.remplacantNom || "",
        remplacantEmail: demande.remplacantEmail || "",
        remplacantTelephone: demande.remplacantTelephone || "",

        capitaineId: demande.capitaineId || "",
        capitaineNom: demande.capitaineNom || "",

        statut: "confirme",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    return {
      dejaRepondu: false,
      statut: "accepte",
    };
  }

  if (action === "refuser") {
    await updateDoc(demandeRef, {
      statut: "refuse",
      reponseAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return {
      dejaRepondu: false,
      statut: "refuse",
    };
  }

  throw new Error("Action invalide.");
}

export default function App() {
  return (
    <BrowserRouter>

      <ScrollToTop />
      
      <div className="min-h-screen bg-slate-950 text-white">
        <Header />
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/classements" element={<Classements />} />
          <Route path="/classements/recreatif" element={<ClassementDetail titre="Classement récréatif" />} />
          <Route path="/classements/competitif" element={<ClassementDetail titre="Classement compétitif" />} />
          <Route path="/classements/facebook" element={<ClassementDetail titre="Classement Facebook" />} />
          <Route path="/tournoi" element={<Tournoi />} />
          <Route path="/tournoi/horaire" element={<HoraireTournoi />} />
          <Route path="/boutique" element={<BoutiquesV2 />} />
          <Route path="/boutique-v2" element={<BoutiquesV2 />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/reglements" element={<Reglements />} />
          <Route path="/ligue" element={<Ligue />} />
          <Route path="/inscription-ligue" element={<InscriptionLigueProtegee />} />
          <Route path="/gestion-equipe" element={<Protegee />} />
          <Route path="/mes-demandes" element={<MesDemandesRemplacement />} />
          <Route path="/demande-remplacement/:demandeId/:action" element={<ReponseDemandeRemplacement />} />
          <Route path="/tournoi/reglements" element={<ReglementsTournoi />} />
          <Route path="/connexion" element={<Connexion />} />
          <Route path="/membres" element={<Membres />} />
          <Route path="/partenaires" element={<Partenaires />} />
          <Route path="/calendrier" element={<Calendrier />} />
          <Route path="/creer-compte" element={<CreerCompte />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [ligueOpen, setLigueOpen] = useState(false);
  const [tournoiOpen, setTournoiOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
  const verifierExpiration = () => {
    const expiration = localStorage.getItem("lvpsaSessionExpire");

    if (expiration && Date.now() > Number(expiration)) {
      localStorage.removeItem("lvpsaSessionExpire");
      signOut(auth);
      window.location.href = "/connexion";
    }
  };

  verifierExpiration();

  const interval = setInterval(verifierExpiration, 60 * 1000);

  return () => clearInterval(interval);
}, []);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } else {
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const deconnexion = async () => {
    await signOut(auth);
    window.location.href = "/";
  };

  const modifierMotDePasse = async () => {
    if (!user?.email) return;
    await sendPasswordResetEmail(auth, user.email);
    alert("Un courriel pour modifier votre mot de passe a été envoyé.");
  };

  const ligueItems = [
  { label: "Calendrier", to: "/calendrier" },
  { label: "Classements", to: "/classements" },
  { label: "Inscriptions", to: "/inscription-ligue" },

  ...((userData?.role === "capitaine" || userData?.isAdmin)
    ? [{ label: "Gestion d'équipe", to: "/gestion-equipe" }]
    : []),

  ...((userData?.role === "remplacant" || userData?.estRemplacant || userData?.isAdmin)
    ? [{ label: "Mes demandes", to: "/mes-demandes" }]
    : []),

  { label: "Règlements Ligue", to: "/reglements" },
];

  const tournoiItems = [
    { label: "Informations", to: "/tournoi" },
    { label: "Horaire", to: "/tournoi/horaire" },
    { label: "Règlements", to: "/tournoi/reglements" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-4">
          <img src="/logo.jpg" alt="LVPSA" className="h-20 w-20 rounded-full object-cover" />
          <div>
            <h1 className="text-4xl font-black tracking-tight text-white">LVPSA</h1>
            <p className="text-xl text-slate-300">Volleyball de plage de St-Augustin</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-white md:flex">
          <Link to="/" className="hover:text-amber-300">Accueil</Link>

          <Dropdown title="LIGUE" items={ligueItems} />
          <Dropdown title="TOURNOI" items={tournoiItems} />

          <Link to="/boutique" className="hover:text-amber-300">Boutique</Link>

          {user ? (
            <>
              <span className="font-semibold text-white">
                Bonjour {userData?.nom?.split(" ")[0]}
              </span>

              {userData?.isAdmin && (
                <Link
                  to="/admin"
                  className="rounded-full border border-amber-400 px-6 py-3 text-amber-300 hover:bg-amber-400 hover:text-slate-950 transition"
                >
                  Administration
                </Link>
              )}

              <button
                onClick={modifierMotDePasse}
                className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-slate-300 hover:border-amber-300 hover:text-amber-300"
              >
                Mot de passe
              </button>

              <button
                onClick={deconnexion}
                className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-slate-300 hover:border-red-400 hover:text-red-400"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/connexion" className="rounded-full border border-white/15 px-6 py-3 hover:border-amber-300 hover:text-amber-300">
                Connexion
              </Link>

              <Link to="/creer-compte" className="rounded-full bg-amber-400 px-6 py-3 font-black text-slate-950 hover:bg-amber-300">
                Créer un compte
              </Link>
            </>
          )}

          <Link to="/partenaires" className="hover:text-amber-300">Partenaires</Link>
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-2xl border border-white/10 px-4 py-3 text-white md:hidden"
        >
          ☰
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-white/10 bg-slate-950 px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4 text-white">
            <Link to="/" onClick={() => setMenuOpen(false)}>ACCUEIL</Link>

            <button type="button" onClick={() => setLigueOpen(!ligueOpen)} className="flex items-center justify-between text-left text-white">
              <span>LIGUE</span>
              <span>{ligueOpen ? "−" : "+"}</span>
            </button>

            {ligueOpen && (
              <div className="ml-4 flex flex-col gap-3 border-l border-white/10 pl-4 text-white/90">
                <Link to="/calendrier" onClick={() => setMenuOpen(false)}>Calendrier</Link>
                <Link to="/classements" onClick={() => setMenuOpen(false)}>Classements</Link>
                <Link to="/inscription-ligue" onClick={() => setMenuOpen(false)}>Inscriptions</Link>

                {(userData?.role === "capitaine" || userData?.isAdmin) && (
                  <Link to="/gestion-equipe" onClick={() => setMenuOpen(false)}>
                    Gestion d'équipe
                  </Link>
                )}

                {(userData?.role === "remplacant" || userData?.estRemplacant || userData?.isAdmin) && (
  <Link to="/mes-demandes" onClick={() => setMenuOpen(false)}>
    Mes demandes
  </Link>
)}

                <Link to="/reglements" onClick={() => setMenuOpen(false)}>Règlements Ligue</Link>
              </div>
            )}

            <button type="button" onClick={() => setTournoiOpen(!tournoiOpen)} className="flex items-center justify-between text-left text-white">
              <span>TOURNOI</span>
              <span>{tournoiOpen ? "−" : "+"}</span>
            </button>

            {tournoiOpen && (
              <div className="ml-4 flex flex-col gap-3 border-l border-white/10 pl-4 text-white/90">
                <Link to="/tournoi" onClick={() => setMenuOpen(false)}>Informations</Link>
                <Link to="/tournoi/horaire" onClick={() => setMenuOpen(false)}>Horaire</Link>
                <Link to="/tournoi/reglements" onClick={() => setMenuOpen(false)}>Règlements</Link>
              </div>
            )}

            <Link to="/boutique" onClick={() => setMenuOpen(false)}>BOUTIQUE</Link>

            {user ? (
              <>
                <span className="font-semibold text-amber-300">
                  Bonjour {userData?.nom?.split(" ")[0]}
                </span>

                {userData?.isAdmin && (
                  <Link to="/admin" onClick={() => setMenuOpen(false)}>ADMINISTRATION</Link>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    modifierMotDePasse();
                  }}
                  className="text-left text-sm font-semibold text-amber-300"
                >
                  MODIFIER MOT DE PASSE
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    deconnexion();
                  }}
                  className="text-left text-sm font-semibold text-amber-300"
                >
                  DÉCONNEXION
                </button>
              </>
            ) : (
              <>
                <Link to="/connexion" onClick={() => setMenuOpen(false)}>CONNEXION</Link>
                <Link to="/creer-compte" onClick={() => setMenuOpen(false)}>CRÉER UN COMPTE</Link>
              </>
            )}

            <Link to="/partenaires" onClick={() => setMenuOpen(false)}>PARTENAIRES</Link>
          </div>
        </div>
      )}
    </header>
  );
}

function Dropdown({ title, items }) {
  return (
    <div className="relative group">
      <button className="hover:text-amber-300 transition">
        {title} ▾
      </button>

      <div className="absolute left-0 top-full pt-3 hidden group-hover:block">
        <div className="w-64 rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
          {items.map((item, index) =>
            item.href ? (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className={`block px-5 py-3 hover:bg-slate-800 ${
                  index === 0 ? "rounded-t-2xl" : ""
                } ${index === items.length - 1 ? "rounded-b-2xl" : ""}`}
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.label}
                to={item.to}
                className={`block px-5 py-3 hover:bg-slate-800 ${
                  index === 0 ? "rounded-t-2xl" : ""
                } ${index === items.length - 1 ? "rounded-b-2xl" : ""}`}
              >
                {item.label}
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  );
}
const statutMatchs = {
  texte: "Les parties ont lieu ce soir",
  couleur: "emerald",
  message: "Mise à jour officielle LVPSA",
};

function Accueil() {
  const [statutMatchs, setStatutMatchs] = useState({
    texte: "Chargement...",
    couleur: "emerald",
    message: "LVPSA",
  });

  const [meteoHeures, setMeteoHeures] = useState([]);

  useEffect(() => {
    async function chargerStatut() {
      try {
        const ref = doc(db, "settings", "matchStatus");
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setStatutMatchs(snap.data());
        }
      } catch (error) {
        console.error("Erreur lors du chargement du statut :", error);
      }
    }

    async function chargerMeteo() {
      try {
        const url =
          "https://api.open-meteo.com/v1/forecast?latitude=46.74&longitude=-71.45&hourly=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m,uv_index&timezone=America%2FToronto&forecast_days=1";

        const res = await fetch(url);
        const data = await res.json();

        if (!data.hourly?.time) {
          setMeteoHeures([]);
          return;
        }

        const heuresVoulues = ["18:00", "19:00", "20:00", "21:00", "22:00"];

        const resultats = data.hourly.time
          .map((time, index) => ({
            time,
            heure: time.slice(11, 16),
            temperature: Math.round(data.hourly.temperature_2m[index]),
            vent: Math.round(data.hourly.wind_speed_10m[index]),
            humidite: data.hourly.relative_humidity_2m[index],
            uv: data.hourly.uv_index[index],
            code: data.hourly.weather_code[index],
          }))
          .filter((item) => heuresVoulues.includes(item.heure));

        setMeteoHeures(resultats);
      } catch (error) {
        console.error("Erreur lors du chargement de la météo :", error);
        setMeteoHeures([]);
      }
    }

    chargerStatut();
    chargerMeteo();
  }, []);

  const estAnnule = statutMatchs.couleur === "red";

  const iconeMeteo = (code) => {
    if (code === 0) return "☀️";
    if (code <= 3) return "⛅";
    if (code < 60) return "☁️";
    if (code < 80) return "🌧️";
    if (code < 90) return "🌦️";
    return "⛈️";
  };

return (
  <>
    <section className="relative overflow-hidden px-6 py-10">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950 to-sky-950"></div>
      <div className="absolute left-[-120px] top-20 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl"></div>
      <div className="absolute bottom-[-160px] right-[-100px] h-96 w-96 rounded-full bg-sky-400/10 blur-3xl"></div>

      <div className="relative mx-auto max-w-7xl">

        {/* STATUT + MÉTÉO EN HAUT */}
        <div className="mb-12 grid gap-6 lg:grid-cols-2">

          {/* STATUT DES PARTIES */}
          <div
            className={`rounded-[2rem] border p-6 ${
              estAnnule
                ? "border-red-400/30 bg-red-400/10"
                : "border-emerald-400/30 bg-emerald-400/10"
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <p
                className={`text-sm font-bold uppercase tracking-[0.25em] ${
                  estAnnule ? "text-red-300" : "text-emerald-300"
                }`}
              >
                Statut des parties
              </p>

              <span
                className={`rounded-full px-4 py-2 text-xs font-black uppercase ${
                  estAnnule
                    ? "bg-red-400/15 text-red-300"
                    : "bg-emerald-400/15 text-emerald-300"
                }`}
              >
                {estAnnule ? "Annulées" : "Confirmées"}
              </span>
            </div>

            <h2 className="mt-6 text-3xl font-black leading-tight text-white">
              {statutMatchs.texte}
            </h2>

            <p className="mt-3 text-lg text-slate-300">
              {statutMatchs.message}
            </p>

            <p className="mt-6 rounded-2xl border border-white/10 bg-black/15 p-4 text-sm text-slate-300">
              Mise à jour officielle de la LVPSA.
            </p>
          </div>

          {/* MÉTÉO */}
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-300">
              Météo des prochaines heures
            </p>

            <div className="mt-5 grid grid-cols-5 gap-3">
              {meteoHeures.length > 0 ? (
                meteoHeures.map((item) => (
                  <div
                    key={item.heure}
                    className="rounded-2xl border border-white/10 bg-slate-950/60 p-3 text-center"
                  >
                    <p className="text-sm text-slate-300">
                      {item.heure.replace(":00", "h")}
                    </p>

                    <p className="mt-2 text-3xl">
                      {item.code < 3 ? "☀️" : item.code < 60 ? "☁️" : "🌧️"}
                    </p>

                    <p className="mt-2 text-xl font-black text-white">
                      {item.temperature}°
                    </p>

                    <p className="mt-1 text-xs font-bold text-amber-300">
                      UV{" "}
                      {item.uv !== undefined
                        ? Number(item.uv).toFixed(1)
                        : "--"}
                    </p>
                  </div>
                ))
              ) : (
                <p className="col-span-5 text-sm text-slate-300">
                  Chargement de la météo...
                </p>
              )}
            </div>

            <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-300">
              <div className="rounded-full bg-white/10 px-4 py-2">
                Vent : {meteoHeures[0]?.vent ?? "--"} km/h
              </div>

              <div className="rounded-full bg-white/10 px-4 py-2">
                Humidité : {meteoHeures[0]?.humidite ?? "--"}%
              </div>

              <div className="rounded-full bg-white/10 px-4 py-2">
                UV :{" "}
                {meteoHeures[0]?.uv !== undefined
                  ? Number(meteoHeures[0].uv).toFixed(1)
                  : "--"}
              </div>

              <a
                href={meteoLink}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/15 px-4 py-2 font-bold text-amber-300 hover:border-amber-300"
              >
                MétéoMédia ↗
              </a>
            </div>
          </div>
        </div>

        {/* HERO PRINCIPAL */}

          {/* HERO PRINCIPAL */}
          <div className="grid items-center gap-10 lg:grid-cols-2">
            {/* HERO GAUCHE */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-5 py-2 text-sm font-bold uppercase tracking-wider text-amber-300">
                🏐 Saison 2026 · Parc Portneuf
              </div>

              <h1 className="mt-8 text-6xl font-black leading-tight text-white md:text-7xl">
                Plus qu’une ligue.
                <span className="block text-amber-300">
                  Une ambiance.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-xl leading-8 text-slate-300">
                La LVPSA rassemble les passionnés de volleyball de plage à
                Saint-Augustin dans une atmosphère sportive, estivale et
                conviviale.
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <p className="text-3xl font-black text-amber-300">2</p>
                  <p className="mt-1 text-sm font-bold uppercase text-slate-300">
                    Catégories
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <p className="text-3xl font-black text-amber-300">8</p>
                  <p className="mt-1 text-sm font-bold uppercase text-slate-300">
                    Équipes
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <p className="text-3xl font-black text-amber-300">1</p>
                  <p className="mt-1 text-sm font-bold uppercase text-slate-300">
                    Communauté
                  </p>
                </div>
              </div>
            </div>

            {/* HERO DROITE */}
            <div className="relative">
              <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 p-3 shadow-2xl">
                <div className="relative h-[520px] overflow-hidden rounded-[2rem]">
                  <img
                    src="/volley-bg.jpg"
                    alt="Terrain LVPSA"
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="rounded-3xl border border-white/10 bg-slate-950/75 p-6 backdrop-blur-xl">
                      <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-300">
                        Terrain officiel
                      </p>

                      <h2 className="mt-2 text-3xl font-black text-white">
                        Parc Portneuf
                      </h2>

                      <p className="mt-2 text-slate-300">
                        Volleyball de plage, ambiance estivale et soirées de ligue.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 hidden md:flex justify-end">
                <div className="rounded-3xl border border-emerald-400/30 bg-emerald-400/10 p-5 backdrop-blur-xl">
                  <p className="text-sm font-bold uppercase text-emerald-300">
                    Saison active
                  </p>

                  <p className="mt-1 text-2xl font-black text-white">
                    Mai à août 2026
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ACCÈS RAPIDES */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <p className="font-bold uppercase tracking-wider text-amber-300">
              Accès rapides
            </p>

            <h2 className="mt-2 text-4xl font-black text-white">
              Tout ce qu’il faut pour suivre la saison
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Link
              to="/calendrier"
              className="group rounded-3xl border border-white/10 bg-white/5 p-7 transition hover:-translate-y-1 hover:border-amber-300"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400 text-3xl text-slate-950">
                📅
              </div>

              <h3 className="text-2xl font-black text-white">
                Calendrier
              </h3>

              <p className="mt-3 text-slate-300">
                Consulte les matchs à venir pour les catégories récréative et compétitive.
              </p>

              <p className="mt-5 font-bold text-amber-300">
                Voir l’horaire →
              </p>
            </Link>

            <Link
              to="/classements"
              className="group rounded-3xl border border-white/10 bg-white/5 p-7 transition hover:-translate-y-1 hover:border-amber-300"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400 text-3xl text-slate-950">
                🏆
              </div>

              <h3 className="text-2xl font-black text-white">
                Classements
              </h3>

              <p className="mt-3 text-slate-300">
                Suis les résultats, les points et l’évolution des équipes.
              </p>

              <p className="mt-5 font-bold text-amber-300">
                Voir les classements →
              </p>
            </Link>

            <Link
              to="/inscription-ligue"
              className="group rounded-3xl border border-white/10 bg-white/5 p-7 transition hover:-translate-y-1 hover:border-amber-300"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400 text-3xl text-slate-950">
                🙋
              </div>

              <h3 className="text-2xl font-black text-white">
                Remplaçants
              </h3>

              <p className="mt-3 text-slate-300">
                Ajoute ton nom à la liste des joueurs indépendants disponibles.
              </p>

              <p className="mt-5 font-bold text-amber-300">
                S’inscrire comme remplaçant →
              </p>
            </Link>

            <Link
              to="/reglements"
              className="group rounded-3xl border border-white/10 bg-white/5 p-7 transition hover:-translate-y-1 hover:border-amber-300"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400 text-3xl text-slate-950">
                📋
              </div>

              <h3 className="text-2xl font-black text-white">
                Règlements
              </h3>

              <p className="mt-3 text-slate-300">
                Consulte les règles de jeu, le format et les consignes importantes.
              </p>

              <p className="mt-5 font-bold text-amber-300">
                Lire les règlements →
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* TOURNOI COMPLET */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-[2rem] border border-red-400/20 bg-gradient-to-br from-red-500/10 to-slate-900 p-8 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-300">
              Tournoi LVPSA 2026
            </p>

            <h2 className="mt-3 text-4xl font-black text-white">
              Le tournoi est maintenant complet
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
              Merci pour votre enthousiasme et votre confiance. On se voit bientôt
              sur le sable pour une journée de volleyball, d’ambiance et de plaisir.
            </p>

            <Link
              to="/tournoi"
              className="mt-8 inline-flex rounded-full border border-white/15 px-8 py-4 font-black text-white hover:border-amber-300 hover:text-amber-300"
            >
              Voir les informations du tournoi
            </Link>
          </div>
        </div>
      </section>

      {/* BAS DE PAGE */}
      <section className="px-6 py-12">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 lg:col-span-2">
            <p className="font-bold uppercase tracking-wider text-amber-300">
              LVPSA
            </p>

            <h2 className="mt-2 text-4xl font-black text-white">
              Une ligue locale, simple, sportive et rassembleuse.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-300">
              La Ligue de volleyball de plage de Saint-Augustin a été créée pour
              offrir aux joueurs un endroit structuré, agréable et accessible pour
              jouer tout l’été dans une ambiance conviviale.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <p className="font-bold uppercase tracking-wider text-amber-300">
              Contact
            </p>

            <h3 className="mt-2 text-3xl font-black text-white">
              Besoin d’information?
            </h3>

            <p className="mt-4 text-slate-300">
              Pour les remplacements, les horaires ou les questions générales :
            </p>

            <a
              href={`mailto:${email}`}
              className="mt-6 inline-flex rounded-full bg-amber-400 px-6 py-3 font-black text-slate-950 hover:bg-amber-300"
            >
              {email}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function Classements() {
 return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <p className="font-bold uppercase tracking-wider text-amber-300">
        Classements
      </p>

      <h1 className="mt-2 text-4xl font-black">
        Classements officiels LVPSA
      </h1>

      <p className="mt-4 text-slate-300">
        Consultez les résultats et classements mis à jour de la saison.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Link
          to="/classements/recreatif"
          className="rounded-3xl border border-white/10 bg-white/10 p-8 transition hover:bg-white/15"
        >
          <Trophy className="mb-4 text-amber-300" size={34} />
          <h2 className="text-2xl font-black">Récréatif</h2>
          <p className="mt-3 text-slate-300">
            Voir le classement récréatif
          </p>
        </Link>

        <Link
          to="/classements/competitif"
          className="rounded-3xl border border-white/10 bg-white/10 p-8 transition hover:bg-white/15"
        >
          <Trophy className="mb-4 text-amber-300" size={34} />
          <h2 className="text-2xl font-black">Compétitif</h2>
          <p className="mt-3 text-slate-300">
            Voir le classement compétitif
          </p>
        </Link>
      </div>
    </section>
  );
}

function ClassementCard({ titre, lien }) {
  return (
    <Link to={lien} className="rounded-3xl border border-white/10 bg-white/10 p-8 transition hover:bg-white/15">
      <Trophy className="mb-4 text-amber-300" size={34} />
      <h2 className="text-2xl font-black">{titre}</h2>
      <p className="mt-3 text-slate-300">Voir ce tableau seulement</p>
    </Link>
  );
}

function ClassementTable({ url, titre }) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetch(url)
      .then((res) => res.text())
      .then((csv) => {
        const lignes = csv
          .trim()
          .split("\n")
          .map((ligne) =>
            ligne
              .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
              .map((cell) => cell.replace(/^"|"$/g, "").trim())
          );

        setRows(lignes.slice(1).filter((row) => row[0] && row[1]));
      });
  }, [url]);

const medaille = (rang) => {
  const medals = {
    "1": "🥇",
    "2": "🥈",
    "3": "🥉",
    "4": "😎",
  };

  return medals[rang] || "";
};

  const formatDiff = (value) => {
    const nombre = Number(String(value).replace(",", "."));
    if (Number.isNaN(nombre)) return value;
    return nombre.toFixed(2);
  };

  const formatPoints = (value) => {
    return String(value).replace(/"/g, "");
  };

  return (
    <div className="mt-10 overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 shadow-2xl">
      <div className="bg-amber-400 px-8 py-6 text-slate-950">
        <div className="flex items-center gap-4">
          <span className="text-4xl">🏆</span>
          <div>
            <h2 className="text-4xl font-black uppercase">{titre}</h2>
            <p className="mt-1 text-sm font-black uppercase tracking-widest">
              Ligue de volleyball de plage de St-Augustin
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="overflow-x-auto rounded-3xl border border-white/10 bg-slate-900">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="bg-slate-900 text-amber-300">
                {["Rang", "Équipe", "PJ", "SG", "SP", "PP", "PC", "Diff.", "Points"].map(
                  (header) => (
                    <th key={header} className="px-6 py-5 text-lg font-black">
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {rows.map((row, index) => {
                const rang = row[0];
                const equipe = row[1];
                const pj = row[2];
                const sg = row[3];
                const sp = row[4];
                const pp = row[5];
                const pc = row[6];
                const diff = row[7];
                const points = row[8];

                return (
                  <tr
                    key={`${equipe}-${index}`}
                    className={`border-t border-white/10 text-white ${
                      rang === "1"
                        ? "bg-amber-400/10"
                        : rang === "2"
                        ? "bg-white/5"
                        : rang === "3"
                        ? "bg-orange-400/10"
                        : "bg-slate-950/40"
                    }`}
                  >
                    <td className="px-6 py-5 text-2xl font-black">
                      <span className="mr-3">{medaille(rang)}</span>
                      <span className={rang === "1" ? "text-amber-300" : ""}>
                        {rang}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-xl font-bold">{equipe}</td>
                    <td className="px-6 py-5 text-xl">{pj}</td>
                    <td className="px-6 py-5 text-xl">{sg}</td>
                    <td className="px-6 py-5 text-xl">{sp}</td>
                    <td className="px-6 py-5 text-xl">{pp}</td>
                    <td className="px-6 py-5 text-xl">{pc}</td>

                    <td className="px-6 py-5 text-xl font-bold text-lime-400">
                      {formatDiff(diff)}
                    </td>

                    <td className="px-6 py-5 text-2xl font-black text-amber-300">
                      {formatPoints(points)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-6 grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300 md:grid-cols-4">
          <div>
            <span className="font-black text-amber-300">PJ</span> : Parties jouées
          </div>
          <div>
            <span className="font-black text-amber-300">SG</span> : Sets gagnés
          </div>
          <div>
            <span className="font-black text-amber-300">SP</span> : Sets perdus
          </div>
          <div>
            <span className="font-black text-amber-300">Points</span> : Points au classement
          </div>
          <div>
            <span className="font-black text-amber-300">PP</span> : Points pour
          </div>
          <div>
            <span className="font-black text-amber-300">PC</span> : Points contre
          </div>
          <div>
            <span className="font-black text-amber-300">Diff.</span> : Différentiel
          </div>
        </div>
      </div>
    </div>
  );
}
function ClassementDetail({ titre }) {
  let lien = "";

  if (titre === "Classement récréatif") {
    lien =
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vQgd0CSVXzpiJknzlFzR3ePmhD33lTUh2GDmEv7-XTpXA9rWz_X4Cl7QverC1jzsOEwvyvBHIMALhEm/pub?gid=1356137713&single=true&output=csv";
  }

  if (titre === "Classement compétitif") {
    lien =
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vQgd0CSVXzpiJknzlFzR3ePmhD33lTUh2GDmEv7-XTpXA9rWz_X4Cl7QverC1jzsOEwvyvBHIMALhEm/pub?gid=1226338215&single=true&output=csv";
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <Link to="/classements" className="text-amber-300">
        ← Retour aux classements
      </Link>

      <h1 className="mt-6 text-4xl font-black">{titre}</h1>

      <ClassementTable url={lien} titre={titre} />
    </section>
  );
}
function Tournoi() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="inline-flex rounded-full border border-amber-400/30 bg-amber-400/10 px-5 py-2 text-sm font-bold uppercase tracking-wider text-amber-300">
            🏆 Tournoi LVPSA 2026
          </div>

          <h1 className="mt-8 text-6xl font-black leading-tight text-white md:text-7xl">
            Tournoi de
            <span className="block text-amber-300">volleyball</span>
            <span className="block">de plage</span>
          </h1>

          <p className="mt-6 max-w-xl text-xl leading-8 text-slate-300">
            Rejoignez-nous pour une journée de compétition, de plaisir et
            d’ambiance estivale sur le sable.
          </p>

          <div className="mt-8 max-w-xl rounded-3xl border border-red-500/30 bg-red-500/10 p-5">
  <p className="text-center text-xl font-black uppercase tracking-wide text-red-300">
    🔴 Le tournoi est maintenant : COMPLET
  </p>

  <p className="mt-2 text-center text-slate-300">
    Merci pour votre enthousiasme ! On se voit bientôt sur le sable!!!
  </p>
</div>
          
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-center">
              <div className="text-amber-300">📅</div>
              <p className="mt-2 text-sm font-bold uppercase text-amber-300">
                Date
              </p>
              <p className="mt-2 text-3xl font-black">18</p>
              <p className="font-bold">juillet 2026</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-center">
              <div className="text-amber-300">🗺</div>
              <p className="mt-2 text-sm font-bold uppercase text-amber-300">
                Parc Portneuf
              </p>
               <p className="mt-3 font-bold">St-Augustin-de-Desmaures</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-center">
              <div className="text-amber-300">🎁</div>
              <p className="mt-2 text-sm font-bold uppercase text-amber-300">
                Bourses
              </p>
              <p className="mt-2 text-3xl font-black">prix</p>
              <p className="font-bold">de présence</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
  <Link
    to="/tournoi/reglements"
    className="inline-flex items-center rounded-full border border-white/15 px-10 py-4 text-lg font-black text-white hover:border-amber-300 hover:text-amber-300"
  >
    Règlements du tournoi
  </Link>
</div>
          </div>

        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white shadow-2xl">
          <img
            src="/tournoi-lvpsa-2026.png"
            alt="Tournoi LVPSA"
            className="w-full h-auto"
          />
        </div>
      </div>

      <div className="mt-20 grid gap-8 lg:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-3xl font-black text-amber-300">
            2 catégories
          </h2>

          <div className="mt-6 space-y-4 text-slate-300">
            <p>
              🏆 <span className="font-bold text-white">Compétitif :</span>{" "}
              pour les équipes qui veulent se dépasser et jouer pour gagner.
            </p>

            <p>
              😎 <span className="font-bold text-white">Récréatif :</span>{" "}
              pour le plaisir, l’ambiance et le jeu sans pression.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-3xl font-black text-amber-300">
            Format du tournoi
          </h2>

          <ul className="mt-6 space-y-3 text-slate-300">
            <li>✅ Tournoi sur 1 journée</li>
            <li>✅ Matchs en continu de 8 h à 20 h</li>
            <li>✅ Phase préliminaire : 2 sets de 21 points</li>
            <li>✅ Séries éliminatoires : 2 sets de 25 points</li>
          </ul>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-3xl font-black text-amber-300">
            Sur place
          </h2>

          <ul className="mt-6 space-y-3 text-slate-300">
            <li>🍔 BBQ et nourriture</li>
            <li>🥤 Boissons froides</li>
            <li>🍉 Collations et fruits</li>
            <li>🎵 Musique d’ambiance</li>
            <li>🏖️ Zone détente</li>
          </ul>
        </div>
      </div>

      <div className="mt-12 rounded-3xl border border-amber-400/20 bg-amber-400/10 p-8 text-center">
        <h2 className="text-3xl font-black text-amber-300">
          Bourses aux équipes gagnantes
        </h2>

        <p className="mt-3 text-lg text-slate-300">
          Une journée complète pour jouer, encourager, profiter de l’ambiance et
          célébrer le volleyball de plage à Saint-Augustin.
        </p>
      </div>
    </section>
  );
}

function Reglements() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">

      <p className="font-bold uppercase tracking-wider text-amber-300">
        LVPSA 2026
      </p>

      <h1 className="mt-2 text-5xl font-black">
        Règlements de la ligue
      </h1>

      <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
        Voici les règlements officiels de la Ligue de Volleyball de Plage
        de St-Augustin pour la saison 2026.
      </p>

      <div className="mt-14 grid gap-8 lg:grid-cols-2">

        {/* FORMAT */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-3xl font-black text-amber-300">
            Format des équipes
          </h2>

          <ul className="mt-6 space-y-4 text-slate-300">
            <li>• 4 contre 4 avec au moins une fille sur le terrain en tout temps</li>
            <li>• Une équipe peut avoir plus de 4 joueurs</li>
            <li>• Seulement 4 joueurs sur le terrain à la fois</li>
            <li>• Les équipes doivent trouver leurs remplaçants</li>
            <li>• Une équipe à 3 joueurs utilisera un joueur fantôme</li>
          </ul>
        </div>

        {/* INTERDICTIONS */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-3xl font-black text-amber-300">
            Interdictions
          </h2>

          <ul className="mt-6 space-y-4 text-slate-300">
            <li>• Bloquer une fille sur un mouvement d'attaque</li>
            <li>• Traverser la balle en tips ou touches, (touches permises récréatif)</li>
            <li>• Toucher le filet</li>
            <li>• Traverser de l’autre côté</li>
            <li>• Faire un transport</li>
          </ul>
        </div>

        {/* RÈGLES */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-3xl font-black text-amber-300">
            Règles de jeu
          </h2>

          <ul className="mt-6 space-y-4 text-slate-300">
            <li>• Deux joueurs avant et deux joueurs arrière</li>
            <li>• Rotation obligatoire</li>
            <li>• Les joueurs arrière attaquent derrière la ligne de 3 mètres</li>
            <li>• Deux sets de 25 points par match</li>
            <li>• Chaque équipe joue deux matchs par soir</li>
          </ul>
        </div>

        {/* AUTO-ARBITRAGE */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-3xl font-black text-amber-300">
            Auto-arbitrage
          </h2>

          <ul className="mt-6 space-y-4 text-slate-300">
            <li>• Les situations ''zone grises'' sont reprises</li>
            <li>• Les équipes doivent rester respectueuses</li>
            <li>• Le capitaine gagnant transmet les résultats</li>
            <li>• L’esprit sportif est prioritaire</li>
          </ul>
        </div>
      </div>

      {/* TOURNOI */}
      <div className="mt-10 rounded-3xl border border-amber-300/20 bg-amber-300/10 p-8">
        <h2 className="text-3xl font-black text-amber-300">
          Tournoi des séries
        </h2>

        <div className="mt-6 grid gap-6 md:grid-cols-2 text-slate-200">

          <div>
            <h3 className="text-xl font-bold">
              Remplaçants autorisés
            </h3>

            <ul className="mt-4 space-y-3 text-slate-300">
              <li>• Un gars ayant joué au moins 3 fois</li>
              <li>• Une fille ayant joué au moins 1 fois</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold">
              Dépôt de présence
            </h3>

            <p className="mt-4 text-slate-300 leading-7">
              Le dépôt de 100$ est remboursé aux équipes présentes
              toute la saison et au tournoi des séries.
            </p>
          </div>
        </div>
      </div>

      {/* MÉTÉO */}
      <div className="mt-10 rounded-3xl border border-sky-400/20 bg-sky-400/10 p-8">
        <h2 className="text-3xl font-black text-sky-300">
          Politique météo
        </h2>

        <p className="mt-5 max-w-3xl leading-8 text-slate-300">
          S’il pleut, les matchs ont lieu normalement.
          En cas d’orage, les parties seront reportées si possible.
        </p>
      </div>

    </section>
  );
}

function Membres() {

  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [message, setMessage] = useState("");

  const connexion = async () => {
  try {
    await setPersistence(
      auth,
      seSouvenir
        ? browserLocalPersistence
        : browserSessionPersistence
    );

    await signInWithEmailAndPassword(
      auth,
      email,
      motDePasse
    );

    if (!seSouvenir) {
      localStorage.setItem(
        "lvpsaSessionExpire",
        String(Date.now() + 60 * 60 * 1000)
      );
    } else {
      localStorage.removeItem("lvpsaSessionExpire");
    }

    window.location.href = "/";
  } catch (error) {
    setMessage("Courriel ou mot de passe invalide.");
  }
};

  return (

    <section className="bg-white py-16 text-slate-950">

      <div className="mx-auto max-w-7xl px-6">

        <h1 className="text-4xl font-black">
          Connexion
        </h1>

        <p className="mt-4 text-slate-600">
          Connectez-vous à votre compte LVPSA.
        </p>

        <div className="mt-8 max-w-xl rounded-3xl border bg-slate-50 p-6">

          <Lock className="mb-4" />

          <h2 className="text-2xl font-black">
            Connexion
          </h2>

          <input
            className="mt-5 w-full rounded-2xl border px-4 py-3"
            placeholder="Courriel"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="mt-3 w-full rounded-2xl border px-4 py-3"
            placeholder="Mot de passe"
            type="password"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
          />

          <button
            onClick={connexion}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-amber-400 px-6 py-3 font-bold text-slate-950"
          >
            <LogIn size={18} />
            Se connecter
          </button>

          <button
            type="button"
            onClick={async () => {

              if (!email) {

                setMessage(
                  "Veuillez entrer votre courriel."
                );

                return;

              }

              try {

                await sendPasswordResetEmail(
                  auth,
                  email
                );

                setMessage(
                  "Un courriel de réinitialisation a été envoyé."
                );

              } catch {

                setMessage(
                  "Impossible d'envoyer le courriel."
                );

              }

            }}

            className="mt-5 w-full text-center text-sm font-bold text-amber-600 hover:underline"
          >

            Mot de passe oublié ?

          </button>

          {message && (

            <p className="mt-4 text-center text-sm">

              {message}

            </p>

          )}

        </div>

      </div>

    </section>

  );

}

function CreerCompte() {
  const [nom, setnom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [confirmationMotDePasse, setConfirmationMotDePasse] = useState("");
  const [message, setMessage] = useState("");

  const creerCompte = async (e) => {
  e.preventDefault();

  setMessage("");

  if (motDePasse !== confirmationMotDePasse) {
    setMessage("Les mots de passe ne correspondent pas.");
    return;
  }

  const regex = /^(?=.*\d).{8,}$/;

  if (!regex.test(motDePasse)) {
  setMessage(
    "Le mot de passe doit contenir au moins 8 caractères et au moins un chiffre."
  );
  return;
}
    
  try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        motDePasse
      );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        nom,
        email,
        telephone,
        role: "membre",
        isAdmin: false,
        statut: "actif",
        estJoueur: false,
        estRemplacant: false,
        equipeId: null,
        categorie: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setMessage("Compte créé avec succès !");
    } catch (error) {
      setMessage("Erreur : " + error.message);
    }
  };

  return (
    <section className="mx-auto max-w-xl px-6 py-20">
      <h1 className="text-5xl font-black text-white">Créer un compte</h1>

      <form onSubmit={creerCompte} className="mt-10 space-y-5">
          <input
            value={nom}
            onChange={(e) => setnom(e.target.value)}
            placeholder="nom complet"
            required
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white"
          />
          
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Adresse courriel"
            required
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white"
          />

          <input
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            type="tel"
            placeholder="Téléphone"
            required
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white"
          />
        
          <input
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            type="password"
            placeholder="Mot de passe"
            required
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white"
          />
          
          <p className="text-sm text-slate-400">
            Minimum 8 caractères et au moins un chiffre.
          </p>
          
          <input
            value={confirmationMotDePasse}
            onChange={(e) => setConfirmationMotDePasse(e.target.value)}
            type="password"
            placeholder="Confirmer le mot de passe"
            required
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white"
          />
        
        <button
          type="submit"
          className="w-full rounded-full bg-amber-400 px-8 py-4 text-lg font-black text-slate-950 hover:bg-amber-300"
        >
          Créer mon compte
        </button>
      </form>

      {message && (
        <p className="mt-6 rounded-2xl bg-white/10 p-4 text-center text-white">
          {message}
        </p>
      )}
    </section>
  );
}
function Partenaires() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
     <p className="font-bold uppercase tracking-wider text-amber-300">
  LVPSA
</p>

<h1 className="mt-2 text-5xl font-black">
  Partenaires & Coordonnées
</h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
        Pour toute question concernant la ligue, les horaires, les remplacements, les inscriptions ou les partenariats, communiquez avec l’équipe LVPSA.
      </p>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-3xl font-black text-amber-300">
            Coordonnées
          </h2>

          <div className="mt-6 space-y-5 text-slate-300">
            <p>
              <span className="font-bold text-white">Courriel : </span>
              <a
                href="mailto:liguevpsa@gmail.com"
                className="text-amber-300 hover:underline"
              >
                liguevpsa@gmail.com
              </a>
            </p>

            <p>
              <span className="font-bold text-white">Lieu : </span>
              Parc Portneuf, Saint-Augustin-de-Desmaures
            </p>

            <p>
              <span className="font-bold text-white">Saison : </span>
              Mai à août 2026
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-3xl font-black text-amber-300">
            Partenariats
          </h2>

          <p className="mt-4 text-slate-300">
           Vous souhaitez devenir commanditaire et contribuer à promouvoir l’activité physique,
            les saines habitudes de vie et le volleyball de plage auprès des gens de notre région?
            Nous sommes toujours ouverts aux partenariats qui permettent de faire grandir notre communauté sportive.
          </p>

          <a
            href="mailto:liguevpsa@gmail.com?subject=Partenariat%20LVPSA"
            className="mt-6 inline-flex rounded-full bg-amber-400 px-8 py-3 font-bold text-slate-950 hover:bg-amber-300"
          >
            Devenir partenaire
          </a>
        </div>
      </div>

      <div className="mt-16 rounded-3xl border border-white/10 bg-white/5 p-8">
        <h2 className="text-3xl font-black">
          Nos commanditaires
        </h2>

        <p className="mt-3 text-slate-300">
          Merci à nos partenaires qui contribuent au développement de la LVPSA.
        </p>

<div className="mt-8 grid gap-6 md:grid-cols-4">
  <div className="rounded-3xl border border-white/10 bg-white p-8 flex items-center justify-center">
    <img
      src="/Applied.png"
      alt="Applied Industrial Technologies"
      className="max-h-28 object-contain"
    />
  </div>

  <div className="rounded-3xl border border-white/10 bg-white p-8 flex items-center justify-center">
    <img
      src="/Canac.png"
      alt="Canac"
      className="max-h-28 object-contain"
    />
  </div>

  <div className="rounded-3xl border border-white/10 bg-white p-8 flex items-center justify-center">
    <img
      src="/VSAD.png"
      alt="Ville de Saint-Augustin-de-Desmaures"
      className="max-h-40 w-full object-contain"
    />
  </div>

  <div className="rounded-3xl border border-white/10 bg-white p-8 flex items-center justify-center">
    <img
      src="/Desjardins.png"
      alt="Desjardins"
      className="max-h-28 w-full object-contain"
    />
  </div>
</div>

<div className="mt-16 rounded-3xl border border-blue-400/20 bg-gradient-to-br from-blue-600/20 via-slate-900 to-slate-950 p-8 shadow-2xl">
  <div className="grid items-center gap-8 lg:grid-cols-[auto_1fr_auto]">
    <div className="flex justify-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-4xl font-black text-white">
        f
      </div>
    </div>

    <div>
      <h2 className="text-4xl font-black text-white">
        Suivez la LVPSA
      </h2>

      <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
        Restez informé des horaires, résultats, photos, annonces importantes et événements de la ligue.
      </p>

      <div className="mt-5 flex flex-wrap gap-3 text-sm font-bold text-slate-300">
        <span className="rounded-full bg-white/10 px-4 py-2">
          📅 Horaires
        </span>

        <span className="rounded-full bg-white/10 px-4 py-2">
          🏆 Résultats
        </span>

        <span className="rounded-full bg-white/10 px-4 py-2">
          📸 Photos
        </span>

        <span className="rounded-full bg-white/10 px-4 py-2">
          📣 Annonces
        </span>
      </div>
    </div>

    <div className="flex justify-center lg:justify-end">
      <a
        href="https://www.facebook.com/profile.php?id=61572358300215&locale=fr_CA"
        target="_blank"
        rel="noreferrer"
        className="inline-flex whitespace-nowrap rounded-full bg-amber-400 px-8 py-4 text-lg font-black text-slate-950 hover:bg-amber-300"
      >
        Visiter notre page Facebook ↗
      </a>
    </div>
  </div>
</div>

</div>
</section>
  );
}

function HomeCard({ title, text, link, label }) {
  return (
    <Link
      to={link}
      className="rounded-3xl border border-white/10 bg-white/10 p-6 transition hover:-translate-y-1 hover:bg-white/15"
    >
      <h3 className="text-xl font-black">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-300">{text}</p>
      <p className="mt-5 font-bold text-amber-300">{label} →</p>
    </Link>
  );
}

function MeteoJour() {
  const [meteo, setMeteo] = useState(null);

  useEffect(() => {
    fetch("https://api.open-meteo.com/v1/forecast?latitude=46.74&longitude=-71.45&current=temperature_2m,precipitation,wind_speed_10m&timezone=America%2FToronto")
      .then((res) => res.json())
      .then((data) => setMeteo(data.current))
      .catch(() => setMeteo(null));
  }, []);

  if (!meteo) return null;

  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-6">
      <p className="text-sm font-bold uppercase tracking-wider text-amber-300">
        Météo du jour
      </p>
      <h3 className="mt-2 text-3xl font-black">
        {Math.round(meteo.temperature_2m)}°C
      </h3>
      <p className="mt-2 text-slate-300">
        Vent : {Math.round(meteo.wind_speed_10m)} km/h
      </p>
      <p className="text-slate-300">
        Précipitations : {meteo.precipitation} mm
      </p>
      <a
        href="https://www.meteomedia.com/ca/meteo/quebec/saint-augustin-de-desmaures"
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-block font-bold text-amber-300"
      >
        Voir MétéoMédia →
      </a>
    </div>
  );
}

function Admin() {
  const [onglet, setOnglet] = useState("statut");
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [chargement, setChargement] = useState(true);

  const [statut, setStatut] = useState({
    texte: "Les parties ont lieu ce soir",
    couleur: "emerald",
    message: "Mise à jour officielle LVPSA",
  });

  const [membres, setMembres] = useState([]);
  const [equipes, setEquipes] = useState([]);
  const [remplacements, setRemplacements] = useState([]);
  const [historiqueRemplacements, setHistoriqueRemplacements] = useState([]);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const userSnap = await getDoc(doc(db, "users", currentUser.uid));

        if (userSnap.exists()) {
          setUserData(userSnap.data());
        }

        const statutSnap = await getDoc(doc(db, "settings", "matchStatus"));

        if (statutSnap.exists()) {
          setStatut(statutSnap.data());
        }
      } else {
        setUserData(null);
      }

      setChargement(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
  const chargerAdmin = async () => {
    if (!userData?.isAdmin) return;

    const membresSnap = await getDocs(collection(db, "users"));
    const remplacementsSnap = await getDocs(collection(db, "remplacements"));
    const historiqueSnap = await getDocs(collection(db, "historiqueRemplacements"));
    const equipesChargees = await chargerEquipesLVPSA();

    const listeMembres = membresSnap.docs.map((docItem) => ({
  id: docItem.id,
  ...docItem.data(),
}));

const listeRemplacementsFirestore = remplacementsSnap.docs.map((docItem) => ({
  id: docItem.id,
  ...docItem.data(),
}));

setMembres(listeMembres);

setEquipes(equipesChargees);

setRemplacements(
  fusionnerRemplacementsGlobal(listeRemplacementsFirestore, listeMembres)
);
    setHistoriqueRemplacements(
      historiqueSnap.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      }))
    );
  };

  chargerAdmin();
}, [userData]);
  async function sauvegarder() {
    await setDoc(doc(db, "settings", "matchStatus"), statut);
    alert("Statut mis à jour !");
  }

  async function deconnexion() {
    await signOut(auth);
    window.location.href = "/";
  }

  async function handleSynchroniserRemplacantsDepuisUsers() {
  const confirmation = window.confirm(
    "Cette action va synchroniser les utilisateurs remplaçants vers la collection remplacements, sans supprimer aucun champ existant. Continuer?"
  );

  if (!confirmation) return;

  try {
    const [usersSnap, remplacementsSnap] = await Promise.all([
      getDocs(collection(db, "users")),
      getDocs(collection(db, "remplacements")),
    ]);

    const idsRemplacementsExistants = new Set(
      remplacementsSnap.docs.map((docItem) => docItem.id)
    );

    const batch = writeBatch(db);

    let compteur = 0;

    usersSnap.docs.forEach((docItem) => {
      const data = docItem.data();

      const estRemplacant =
        data.estRemplacant === true ||
        data.role === "remplacant" ||
        normaliserTexteGlobal(data.equipeId) === "independant";

      if (!estRemplacant) return;

      const valeursCategories = Array.isArray(data.categories)
        ? data.categories
        : [data.categorie, data.catégorie].filter(Boolean);

      const categoriesNormalisees = valeursCategories.flatMap((valeur) => {
        const categorie = normaliserCategorieGlobal(valeur);

        if (categorie === "les-deux") {
          return ["recreatif", "competitif"];
        }

        return categorie ? [categorie] : [];
      });

      const categoriesFinales = [...new Set(categoriesNormalisees)];

      const emailFinal = data.email || data.courriel || "";

      const refUser = doc(db, "users", docItem.id);
      const refRemplacement = doc(db, "remplacements", docItem.id);

      const donneesRemplacement = {
        userId: docItem.id,
        nom: data.nom || "",
        email: emailFinal,
        courriel: emailFinal,
        telephone: data.telephone || "",
        categories: categoriesFinales,
        note: data.note || data.commentaire || "",
        disponible: data.disponible === false ? false : true,
        statut: data.statut || "actif",
        updatedAt: serverTimestamp(),
      };

      if (!idsRemplacementsExistants.has(docItem.id)) {
        donneesRemplacement.createdAt = data.createdAt || serverTimestamp();
      }

      batch.set(refRemplacement, donneesRemplacement, { merge: true });

      const updatesUser = {
        role: "remplacant",
        estJoueur: true,
        estRemplacant: true,
        categories: categoriesFinales,
        updatedAt: serverTimestamp(),
      };

      if (!data.equipeId) {
        updatesUser.equipeId = "independant";
      }

      batch.set(refUser, updatesUser, { merge: true });

      compteur++;
    });

    if (compteur > 0) {
      await batch.commit();
    }

    const [nouveauxUsersSnap, nouveauxRemplacementsSnap] = await Promise.all([
      getDocs(collection(db, "users")),
      getDocs(collection(db, "remplacements")),
    ]);

    setMembres(
      nouveauxUsersSnap.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      }))
    );

    setRemplacements(
      nouveauxRemplacementsSnap.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      }))
    );

    alert(`${compteur} remplaçant(s) synchronisé(s).`);
  } catch (error) {
    console.error("Erreur synchronisation remplaçants :", error);
    alert("Erreur lors de la synchronisation des remplaçants.");
  }
}
  
  async function handleUniformiserJoueurs() {
  const confirmation = window.confirm(
    "Cette action va uniformiser les rôles des utilisateurs sans supprimer aucun champ existant. Continuer?"
  );

  if (!confirmation) return;

  try {
    const [usersSnap, equipesChargees] = await Promise.all([
      getDocs(collection(db, "users")),
      chargerEquipesLVPSA(),
    ]);

    const batch = writeBatch(db);
    let compteur = 0;

    const trouverEquipePourMembre = (membre) => {
      const membreEquipeId = String(membre.equipeId || membre.idEquipe || "").trim();

      const membreEquipeNom =
        membre.equipeNom ||
        membre.equipenom ||
        membre.nomEquipe ||
        membre.equipe ||
        "";

      return (
        equipesChargees.find((equipe) => {
          const equipeId = String(equipe.id || equipe.equipeId || "").trim();
          const equipeNom = nomEquipeGlobal(equipe);

          return (
            (membreEquipeId &&
              equipeId &&
              normaliserTexteGlobal(membreEquipeId) ===
                normaliserTexteGlobal(equipeId)) ||
            (membreEquipeNom &&
              equipeNom &&
              normaliserTexteGlobal(membreEquipeNom) ===
                normaliserTexteGlobal(equipeNom))
          );
        }) || null
      );
    };

    usersSnap.docs.forEach((docItem) => {
      const data = docItem.data();
      const ref = doc(db, "users", docItem.id);
      const updates = {};

      const equipeId = String(data.equipeId || data.idEquipe || "").trim();
      const equipeIdNormalise = normaliserTexteGlobal(equipeId);

      const estIndependant = equipeIdNormalise === "independant";
      const estDansEquipe = Boolean(equipeId) && !estIndependant;

      const estRemplacant =
        data.estRemplacant === true ||
        estIndependant ||
        data.role === "remplacant";

      let roleFinal = "membre";

      if (estRemplacant) {
        roleFinal = "remplacant";
      } else if (estDansEquipe) {
        roleFinal = data.role === "capitaine" ? "capitaine" : "joueur";
      }

      const estJoueurFinal = estDansEquipe || estRemplacant;
      const estRemplacantFinal = estRemplacant;

      if (data.role !== roleFinal) {
        updates.role = roleFinal;
      }

      if (data.estJoueur !== estJoueurFinal) {
        updates.estJoueur = estJoueurFinal;
      }

      if (data.estRemplacant !== estRemplacantFinal) {
        updates.estRemplacant = estRemplacantFinal;
      }

      if (estDansEquipe) {
        const equipeTrouvee = trouverEquipePourMembre(data);

        if (equipeTrouvee) {
          const equipeNomFinal = nomEquipeGlobal(equipeTrouvee);

          const categorieFinale = normaliserCategorieGlobal(
            data.categorie || equipeTrouvee.categorie || equipeTrouvee.catégorie
          );

          if (!data.equipeNom && !data.equipenom && equipeNomFinal) {
            updates.equipeNom = equipeNomFinal;
          }

          if ((!data.categorie || data.categorie === null) && categorieFinale) {
            updates.categorie = categorieFinale;
          }
        }
      }

      if (Object.keys(updates).length > 0) {
        updates.updatedAt = serverTimestamp();
        batch.update(ref, updates);
        compteur++;
      }
    });

    if (compteur > 0) {
      await batch.commit();
    }

    const membresSnap = await getDocs(collection(db, "users"));

    setMembres(
      membresSnap.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      }))
    );

    alert(`${compteur} profil(s) uniformisé(s).`);
  } catch (error) {
    console.error("Erreur uniformisation joueurs/membres :", error);
    alert("Erreur lors de l'uniformisation des joueurs/membres.");
  }
}
  
  async function handleUniformiserRemplacements() {
  const confirmation = window.confirm(
    "Cette action va uniformiser les remplaçants sans supprimer aucun champ existant. Continuer?"
  );

  if (!confirmation) return;

  try {
    const total = await uniformiserRemplacementsSansSupprimer();

    const remplacementsSnap = await getDocs(collection(db, "remplacements"));

    setRemplacements(
      remplacementsSnap.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      }))
    );

    alert(`${total} remplaçant(s) uniformisé(s).`);
  } catch (error) {
    console.error("Erreur uniformisation remplaçants :", error);
    alert("Erreur lors de l'uniformisation des remplaçants.");
  }
}

  if (chargement) {
    return null;
  }

  if (!user || !userData?.isAdmin) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="text-4xl font-black text-white">Accès refusé</h1>

        <p className="mt-4 text-slate-300">
          Cette section est réservée aux administrateurs de la LVPSA.
        </p>

        <Link
          to="/connexion"
          className="mt-8 inline-flex rounded-full bg-amber-400 px-8 py-4 font-black text-slate-950 hover:bg-amber-300"
        >
          Connexion
        </Link>
      </section>
    );
  }

  const normaliserCategorie = (categorie) =>
  String(categorie || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const equipesRecreatives = equipes.filter(
  (equipe) => normaliserCategorie(equipe.categorie) === "recreatif"
);

const equipesCompetitives = equipes.filter(
  (equipe) => normaliserCategorie(equipe.categorie) === "competitif"
);

  const joueursParEquipe = (equipe) =>
  membres.filter((membre) => {
    if (!memeEquipeGlobal(membre, equipe)) return false;

    return (
      membre.role !== "remplacant" &&
      membre.equipeId !== "independant" &&
      !membre.estRemplacant
    );
  });

  const totalRemplacantsDisponibles = remplacements.length;

  const membreEstDansUneEquipe = (membre) => {
  const equipeId = String(membre.equipeId || membre.idEquipe || "").trim();

  return equipeId && normaliserTexteGlobal(equipeId) !== "independant";
};

const membresSansEquipe = membres.filter((membre) => {
  return (
    !membreEstDansUneEquipe(membre) &&
    membre.role !== "remplacant" &&
    !membre.estRemplacant
  );
});
  
  const totalRemplacementsParRemplacant = historiqueRemplacements.reduce((acc, item) => {
    const nom = item.remplacantNom || "Sans nom";
    acc[nom] = (acc[nom] || 0) + 1;
    return acc;
  }, {});

  const ongletsAdmin = [
    ["statut", "Statut des parties"],
    ["equipes", "Équipes"],
    ["remplacements", "Remplacements"],
    ["membres", "Membres sans équipe"],
    ["boutique", "Boutique"],
  ];
  
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-bold uppercase tracking-wider text-amber-300">
            Administration
          </p>

          <h1 className="mt-2 text-5xl font-black text-white">
            Administration LVPSA
          </h1>
        </div>

        <button onClick={deconnexion} className="text-amber-300">
          Déconnexion
        </button>
      </div>

      <div className="relative z-10 mt-10 rounded-3xl border border-white/10 bg-white/5 p-4">
        <label className="block text-sm font-bold uppercase tracking-wider text-amber-300">
          Menu administration
        </label>

        <select
          value={onglet}
          onChange={(e) => setOnglet(e.target.value)}
          className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-900 px-5 py-4 font-bold text-white outline-none md:hidden"
        >
          {ongletsAdmin.map(([id, label]) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>

        <div className="mt-4 grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {ongletsAdmin.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setOnglet(id)}
              className={`block w-full rounded-2xl px-4 py-4 text-center font-black transition ${
                onglet === id
                  ? "bg-amber-400 text-slate-950"
                  : "border border-white/15 bg-slate-950 text-white hover:border-amber-300 hover:text-amber-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {onglet === "statut" && (
        <div className="mt-10 rounded-3xl border border-white/10 bg-white/10 p-6">
          <h2 className="text-2xl font-black">Statut des parties</h2>

          <label className="mt-6 block text-sm text-slate-300">
            Texte principal
          </label>

          <select
            className="mt-2 w-full rounded-2xl border px-4 py-3 text-slate-950"
            value={statut.texte}
            onChange={(e) => setStatut({ ...statut, texte: e.target.value })}
          >
            <option value="Les parties ont lieu ce soir">
              Les parties ont lieu ce soir
            </option>

            <option value="Les parties sont annulées ce soir">
              Les parties sont annulées ce soir
            </option>
          </select>

          <label className="mt-5 block text-sm text-slate-300">
            Message secondaire
          </label>

          <input
            className="mt-2 w-full rounded-2xl border px-4 py-3 text-slate-950"
            value={statut.message}
            onChange={(e) => setStatut({ ...statut, message: e.target.value })}
          />

          <label className="mt-5 block text-sm text-slate-300">Couleur</label>

          <select
            className="mt-2 w-full rounded-2xl border px-4 py-3 text-slate-950"
            value={statut.couleur}
            onChange={(e) => setStatut({ ...statut, couleur: e.target.value })}
          >
            <option value="emerald">Vert — parties confirmées</option>
            <option value="red">Rouge — parties annulées</option>
          </select>

          <button
            onClick={sauvegarder}
            className="mt-8 rounded-full bg-amber-400 px-7 py-3 font-bold text-slate-950"
          >
            Sauvegarder le statut
          </button>
        </div>
      )}

      {onglet === "equipes" && (
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {[
            ["Récréatif", equipesRecreatives],
            ["Compétitif", equipesCompetitives],
          ].map(([titre, liste]) => (
            <div
              key={titre}
              className="rounded-3xl border border-white/10 bg-white/5 p-6"
            >
              <h2 className="text-3xl font-black text-amber-300">{titre}</h2>

              <div className="mt-6 space-y-6">
                {liste.map((equipe) => (
                  <div
                    key={equipe.id}
                    className="rounded-2xl border border-white/10 bg-black/20 p-5"
                  >
                    <h3 className="text-2xl font-black text-white">
                      {equipe.nom}
                    </h3>

                    <p className="mt-2 text-slate-300">
                      Capitaine : {capitaineNomGlobal(equipe)}
                    </p>

                    <div className="mt-4 space-y-2">
                     {equipe.joueurs?.length > 0 ? (
  equipe.joueurs.map((joueur, index) => (
    <p key={index} className="text-slate-300">
      • {joueur}
    </p>
  ))
) : joueursParEquipe(equipe).length > 0 ? (
  joueursParEquipe(equipe).map((joueur) => (
    <p key={joueur.id} className="text-slate-300">
      • {joueur.nom} — {joueur.email}
    </p>
  ))
) : (
  <p className="text-slate-500">
    Aucun joueur associé.
  </p>
)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

{onglet === "remplacements" && (
  <div className="mt-10 space-y-8">

    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-3xl font-black text-amber-300">
        Liste des remplaçants
      </h2>

      <p className="mt-3 text-slate-300">
        Total de remplaçants inscrits : {totalRemplacantsDisponibles}
      </p>

      <button
  type="button"
  onClick={handleUniformiserRemplacements}
  className="mt-5 rounded-full bg-amber-400 px-6 py-3 font-black text-slate-950 hover:bg-amber-300"
>
  Uniformiser les remplaçants
</button>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {remplacements.length > 0 ? (
          remplacements.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-white/10 bg-black/20 p-5"
            >
              <h3 className="text-2xl font-black text-white">
                {item.nom || "Sans nom"}
              </h3>

              <p className="mt-2 text-slate-300">
  Catégorie :{" "}
  {Array.isArray(item.categories)
    ? item.categories.join(", ")
    : item.categorie || "Non précisée"}
</p>

              <p className="text-slate-300">
                Courriel : {item.email || "Non précisé"}
              </p>

             <p className="text-slate-300">
  Téléphone : {item.telephone || "Non précisé"}
</p>

<div className="mt-4 rounded-xl bg-white/5 p-4">
  <p className="mb-2 font-bold text-amber-300">
    Note du remplaçant
  </p>

  <p className="italic text-slate-300">
    {item.note || "Aucune note"}
  </p>
</div>

<p
  className={`mt-4 font-bold ${
    item.disponible
      ? "text-emerald-300"
      : "text-red-300"
  }`}
>
  {item.disponible ? "Disponible" : "Non disponible"}
</p>
                            </div>
            ))
          ) : (
            <p className="text-slate-500">
              Aucun remplaçant inscrit.
            </p>
          )}
      </div>
    </div>

    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-3xl font-black text-amber-300">
        Historique des remplacements utilisés
      </h2>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
          <h3 className="text-2xl font-black text-white">
            Total par remplaçant
          </h3>

          <div className="mt-4 space-y-2">
            {Object.keys(totalRemplacementsParRemplacant).length > 0 ? (
              Object.entries(totalRemplacementsParRemplacant).map(([nom, total]) => (
                <p key={nom} className="text-slate-300">
                  {nom} : {total} remplacement{total > 1 ? "s" : ""}
                </p>
              ))
            ) : (
              <p className="text-slate-500">
                Aucun remplacement utilisé pour le moment.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
          <h3 className="text-2xl font-black text-white">
            Détails par équipe
          </h3>

          <div className="mt-4 space-y-4">
            {historiqueRemplacements.length > 0 ? (
              historiqueRemplacements.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl bg-white/5 p-4 text-slate-300"
                >
                  <p className="text-xl font-black text-white">
                    {item.equipeNom || "Équipe non précisée"}
                  </p>

                  <p className="mt-2">
                    Remplaçant : {item.remplacantNom || "Non précisé"}
                  </p>

                  <p>
                    Joueur remplacé : {item.joueurRemplaceNom || "Non précisé"}
                  </p>

                  <p>
                    Date : {item.date || "Non précisée"}
                  </p>

                  <p>
                    Note : {item.note || "Aucune note"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-slate-500">
                Aucun remplacement utilisé pour le moment.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>

  </div>
)}
      {onglet === "membres" && (
        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black text-amber-300">
                Liste des membres
              </h2>

              <p className="mt-3 text-slate-300">
                Total de membres sans équipe : {membresSansEquipe.length}
              </p>
            </div>
          </div>

          <button
  type="button"
  onClick={handleUniformiserJoueurs}
  className="mt-5 rounded-full bg-amber-400 px-6 py-3 font-black text-slate-950 hover:bg-amber-300"
>
  Uniformiser les joueurs/membres
</button>
          <p className="mt-3 text-slate-300">
  Total de remplaçants inscrits : {totalRemplacantsDisponibles}
</p>

          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {membresSansEquipe.length > 0 ? (
              membresSansEquipe.map((membre) => (
                <div
                  key={membre.id}
                  className="rounded-2xl border border-white/10 bg-black/20 p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-xl font-black text-white">
                      {membre.nom || "Sans nom"}
                    </h3>

                    {membre.isAdmin && (
                      <span className="rounded-full bg-amber-400 px-3 py-1 text-xs font-black text-slate-950">
                        Admin
                      </span>
                    )}
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-slate-300">
                    <p>
                      <span className="font-bold text-white">Courriel :</span>{" "}
                      {membre.email || "Non précisé"}
                    </p>

                    <p>
                      <span className="font-bold text-white">Téléphone :</span>{" "}
                      {membre.telephone || "Non précisé"}
                    </p>

                    <p>
                      <span className="font-bold text-white">Rôle :</span>{" "}
                      {membre.role || "membre"}
                    </p>

                    <p>
                      <span className="font-bold text-white">Statut :</span>{" "}
                      {membre.statut || "Non précisé"}
                    </p>

                    <p>
                      <span className="font-bold text-white">Équipe :</span>{" "}
                      {membre.equipeId || "Aucune équipe associée"}
                    </p>

                    <p>
                      <span className="font-bold text-white">Catégorie :</span>{" "}
                      {Array.isArray(membre.categories)
                        ? membre.categories.join(", ")
                        : membre.categorie || "Non précisée"}
                    </p>

                    {membre.estRemplacant && (
                      <p className="font-bold text-emerald-300">
                        Disponible comme joueur indépendant
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-500">
                Aucun membre sans équipe pour le moment.
              </p>
            )}
          </div>
        </div>
      )}

      {onglet === "boutique" && <AdminBoutiqueV2 />}
    </section>
  );
}

function BoutiqueProtegee() {
  const [user, setUser] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } else {
        setUserData(null);
      }

      setChargement(false);
    });

    return () => unsubscribe();
  }, []);

  if (chargement) {
    return null;
  }
  
if (!userData?.isAdmin) {
  return (
    <section className="mx-auto max-w-3xl px-6 py-32 text-center">
      <h1 className="text-4xl font-black text-white">
        Boutique bientôt disponible
      </h1>

      <p className="mt-4 text-slate-300">
        La boutique LVPSA est actuellement en préparation et sera accessible sous peu.
      </p>
    </section>
  );
}

return <Boutique />;
}

function Boutique() {
  const formatTelephone = (value) => {
    const chiffres = value.replace(/\D/g, "").substring(0, 10);
    if (chiffres.length <= 3) return chiffres;
    if (chiffres.length <= 6) return `${chiffres.slice(0, 3)}-${chiffres.slice(3)}`;
    return `${chiffres.slice(0, 3)}-${chiffres.slice(3, 6)}-${chiffres.slice(6)}`;
  };

  const [user, setUser] = useState(null);
  const [produitSelectionne, setProduitSelectionne] = useState(null);
  const [vueProduit, setVueProduit] = useState("devant");
  const [popupCommande, setPopupCommande] = useState({
    taille: "M",
    quantite: 1,
  });

  const [commande, setCommande] = useState({
    articles: [],
    nom: "",
    courriel: "",
    telephone: "",
    notes: "",
  });
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const docSnap = await getDoc(doc(db, "users", currentUser.uid));

        if (docSnap.exists()) {
          const data = docSnap.data();

          setCommande((prev) => ({
            ...prev,
            nom: data.nom || "",
            courriel: data.email || "",
            telephone: data.telephone || "",
          }));
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const produits = produitsBoutique;

 const {
  statutInventaire,
  deduireInventaire,
} = useInventaire();
  
  const grandeursDisponibles = (produit) => {
    if (produit.sexe === "homme") {
      return ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"];
    }

    if (produit.sexe === "femme") {
      return ["XS", "S", "M", "L", "XL", "XXL"];
    }

    return ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"];
  };

  const retirerArticle = (index) => {
    setCommande({
      ...commande,
      articles: commande.articles.filter((_, i) => i !== index),
    });
  };

  const totalCommande = commande.articles.reduce(
    (total, article) =>
      total + Number(article.prix) * Number(article.quantite),
    0
  );

  const envoyerCommande = async () => {
    if (!user) {
      alert("Vous devez être connecté pour passer une commande.");
      return;
    }

    if (commande.articles.length === 0) {
      alert("Veuillez sélectionner au moins un article.");
      return;
    }

    const resumeCommande =
      commande.articles
        .map(
          (article, index) =>
            `Article #${index + 1} : ${article.modele} • Taille ${article.taille} • Qté ${article.quantite} • ${article.prix} $`
        )
        .join("\n") + `\n\nTOTAL : ${totalCommande} $`;

    const params = {
      nom: commande.nom,
      courriel: commande.courriel,
      telephone: commande.telephone,
      commande: resumeCommande,
      notes: commande.notes,
      total_commande: totalCommande,
      to_email: commande.courriel,
    };

    const googleSheetPromise = fetch(
      "https://script.google.com/macros/s/AKfycbzTGtjahqUxVwnvx8x3bboSXE7z694gA0Q-3_v8CYpXJ15_hraQgucMqpM0WkMN89ET/exec",
      {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({
          type: "boutique",
          nom: commande.nom,
          courriel: commande.courriel,
          telephone: commande.telephone,
          notes: commande.notes,
          total: totalCommande,
          articles: commande.articles.map((article) => ({
            modele: article.modele,
            taille: article.taille,
            quantite: Number(article.quantite),
            prix: Number(article.prix),
            total: Number(article.prix) * Number(article.quantite),
          })),
        }),
      }
    );

    try {
  await Promise.all([
    googleSheetPromise,
    emailjs.send(
      "service_f4h3rii",
      "template_nwl643g",
      params,
      "ZooBSx9i6qVl5HI8T"
    ),
    emailjs.send(
      "service_f4h3rii",
      "template_c5ab7bt",
      params,
      "ZooBSx9i6qVl5HI8T"
    ),
  ]);

  await deduireInventaire(commande.articles);

  alert("Commande envoyée avec succès !");

  setCommande({
    articles: [],
    nom: commande.nom,
    courriel: commande.courriel,
    telephone: commande.telephone,
    notes: "",
  });

  setProduitSelectionne(null);
} catch (error) {
  alert("Erreur lors de l’envoi de la commande. Veuillez réessayer.");
  console.error(error);
}
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <p className="font-bold uppercase tracking-wider text-amber-300">
        LVPSA
      </p>

      <h1 className="mt-2 text-5xl font-black">Boutique</h1>

      <p className="mt-4 text-xl text-slate-300">
        Collection Beach Volleyball 2026
      </p>

      {!user && (
        <div className="mt-8 rounded-3xl border border-amber-400/30 bg-amber-400/10 p-6">
          <h2 className="text-2xl font-black text-amber-300">
            Connexion requise pour commander
          </h2>

          <p className="mt-3 text-slate-300">
            Vous pouvez consulter la boutique, mais vous devez avoir un compte
            LVPSA pour envoyer une commande.
          </p>

          <Link
            to="/connexion"
            className="mt-5 inline-flex rounded-full bg-amber-400 px-7 py-3 font-black text-slate-950 hover:bg-amber-300"
          >
            Se connecter
          </Link>
        </div>
      )}

<div className="mt-8 rounded-3xl border border-amber-400/20 bg-white/5 p-6">
  <h2 className="text-2xl font-black text-amber-300">
    Comment commander
  </h2>

  <p className="mt-3 text-slate-300 leading-relaxed">
    Bienvenue dans la boutique officielle de la LVPSA! Parcourez notre collection,
    sélectionnez le vêtement de votre choix, choisissez la grandeur désirée et
    ajoutez-le à votre commande. Dès que celle-ci sera prête, nous communiquerons
    avec vous afin de convenir d'un moment pour la récupération. Le paiement
    s'effectue lors de la remise de votre commande, en argent comptant ou par
    virement Interac à
    <span className="font-semibold text-amber-300">
      {" "}liguevpsa@gmail.com
    </span>.
  </p>
</div>

      <div className="mt-10 overflow-hidden rounded-[2rem] border border-white/10 bg-white shadow-2xl">
        <img
          src="/boutique-lvpsa.png"
          alt="Collection LVPSA"
          className="w-full object-cover"
        />
      </div>

      <div className="mt-12 space-y-12">
        {["T-shirt", "Camisole", "Hoodie"].map((type) => (
          <div key={type}>
            <h2 className="mb-5 text-3xl font-black text-amber-300">
              {type === "Hoodie" ? "Hoodies" : `${type}s`}
            </h2>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {produits
                .filter((produit) => produit.type === type)
                .map((produit) => (
                  <button
                    key={produit.modele}
                    type="button"
                    onClick={() => {
                      setProduitSelectionne(produit);
                      setVueProduit("devant");
                      setPopupCommande({ taille: "M", quantite: 1 });
                    }}
                    className="rounded-3xl border border-white/10 bg-white/5 p-4 text-left hover:border-amber-300"
                  >
                    <img
                      src={produit.imageDevant}
                      alt={produit.modele}
                      className="h-52 w-full rounded-2xl bg-white object-contain"
                    />

                    <p className="mt-4 text-lg font-black text-white">
                      {produit.categorie}
                    </p>

                    <p className="text-sm text-slate-300">
                      Couleur : {produit.couleur}
                    </p>

                    <p className="mt-2 text-lg font-black text-amber-300">
                      {produit.prix} $
                    </p>
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>

      {produitSelectionne && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] border border-white/10 bg-slate-950 p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-sm uppercase tracking-wider text-amber-300">
                  Ajouter à la commande
                </p>

                <h2 className="mt-2 text-3xl font-black">
                  {produitSelectionne.categorie}
                </h2>

                <p className="mt-1 text-slate-300">
                  Couleur : {produitSelectionne.couleur} —{" "}
                  {produitSelectionne.prix} $
                </p>
              </div>

              <button
                type="button"
                onClick={() => setProduitSelectionne(null)}
                className="rounded-full border border-white/10 px-4 py-2 text-sm"
              >
                Fermer
              </button>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div>
                <img
                  src={
                    vueProduit === "devant"
                      ? produitSelectionne.imageDevant
                      : produitSelectionne.imageDos
                  }
                  alt={produitSelectionne.modele}
                  className="h-80 w-full rounded-2xl bg-white object-contain"
                />

                <div className="mt-4 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setVueProduit("devant")}
                    className={`rounded-full px-5 py-2 font-bold ${
                      vueProduit === "devant"
                        ? "bg-amber-400 text-slate-950"
                        : "border border-white/15 text-white"
                    }`}
                  >
                    Devant
                  </button>

                  <button
                    type="button"
                    onClick={() => setVueProduit("dos")}
                    className={`rounded-full px-5 py-2 font-bold ${
                      vueProduit === "dos"
                        ? "bg-amber-400 text-slate-950"
                        : "border border-white/15 text-white"
                    }`}
                  >
                    Dos
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-300">
                  Grandeur
                </label>

                <select
                  className="mt-2 w-full rounded-2xl px-4 py-3 text-slate-950"
                  value={popupCommande.taille}
                  onChange={(e) =>
                    setPopupCommande({
                      ...popupCommande,
                      taille: e.target.value,
                    })
                  }
                >
                  {grandeursDisponibles(produitSelectionne).map((taille) => (
                    <option key={taille} value={taille}>
                      {taille}
                      {` — ${statutInventaire(produitSelectionne.id, taille)}`}
                    </option>
                  ))}
                </select>

                <label className="mt-5 block text-sm font-bold text-slate-300">
                  Quantité
                </label>

                <input
                  type="number"
                  min="1"
                  className="mt-2 w-full rounded-2xl px-4 py-3 text-slate-950"
                  value={popupCommande.quantite}
                  onChange={(e) =>
                    setPopupCommande({
                      ...popupCommande,
                      quantite: e.target.value,
                    })
                  }
                />

                <button
                  type="button"
                  onClick={() => {
                    const quantite = Math.max(
                      1,
                      Number(popupCommande.quantite) || 1
                    );

                    setCommande({
                      ...commande,
                      articles: [
                        ...commande.articles,
                        {
                          produitId: produitSelectionne.id,
                          categorie: produitSelectionne.categorie,
                          modele: produitSelectionne.modele,
                          couleur: produitSelectionne.couleur,
                          prix: produitSelectionne.prix,
                          quantite: quantite,
                          taille: popupCommande.taille,
                          image: produitSelectionne.imageDevant,
                        }
                      ],
                    });

                    setProduitSelectionne(null);
                  }}
                  className="mt-6 w-full rounded-full bg-amber-400 px-8 py-3 font-bold text-slate-950 hover:bg-amber-300"
                >
                  Ajouter au panier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-16 grid gap-8 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-3xl font-black">Panier</h2>

          <div className="mt-6 space-y-3">
            {commande.articles.length === 0 ? (
              <p className="text-slate-400">Aucun article sélectionné.</p>
            ) : (
              commande.articles.map((article, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-white/10 bg-black/20 p-4"
                >
                  <div className="flex gap-4">
                    <img
                      src={article.image}
                      alt={article.modele}
                      className="h-20 w-20 rounded-xl bg-white object-contain"
                    />

                    <div className="flex-1">
                      <p className="font-bold text-amber-300">
                        {article.categorie}
                      </p>

                      <p className="text-sm text-slate-300">
                        Couleur {article.couleur} • Taille {article.taille} •
                        Qté {article.quantite}
                      </p>

                      <p className="mt-1 text-sm font-bold text-white">
                        Total :{" "}
                        {Number(article.prix) * Number(article.quantite)} $
                      </p>

                      <button
                        type="button"
                        onClick={() => retirerArticle(index)}
                        className="mt-2 text-xs text-red-300 hover:underline"
                      >
                        Retirer
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-3xl font-black">Informations du client</h2>

          <div className="mt-5 grid gap-4">
            <input
              className="rounded-2xl px-4 py-3 text-slate-950"
              placeholder="Votre nom"
              value={commande.nom}
              onChange={(e) =>
                setCommande({ ...commande, nom: e.target.value })
              }
            />

            <input
              className="rounded-2xl px-4 py-3 text-slate-950"
              placeholder="Votre courriel"
              value={commande.courriel}
              onChange={(e) =>
                setCommande({ ...commande, courriel: e.target.value })
              }
            />

            <input
              className="rounded-2xl px-4 py-3 text-slate-950"
              placeholder="Téléphone"
              value={commande.telephone}
              maxLength={12}
              onChange={(e) =>
                setCommande({
                  ...commande,
                  telephone: formatTelephone(e.target.value),
                })
              }
            />

            <textarea
              className="min-h-32 rounded-2xl px-4 py-3 text-slate-950"
              placeholder="Notes ou demandes spéciales"
              value={commande.notes}
              onChange={(e) =>
                setCommande({ ...commande, notes: e.target.value })
              }
            />

            {commande.articles.length > 0 && (
              <div className="mt-6 rounded-2xl bg-amber-400 p-4 text-right text-xl font-black text-slate-950">
                Total : {totalCommande} $
              </div>
            )}

            <button
              type="button"
              onClick={envoyerCommande}
              className="rounded-full bg-amber-400 px-8 py-3 font-bold text-slate-950 hover:bg-amber-300"
            >
              Envoyer ma commande
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Calendrier() {
  const [categorie, setCategorie] = useState("recreatif");

  const horaires = {
  recreatif: [
    ["18 mai", ["18h00 à 18h45 — Les As vs Les Bronzés", "18h45 à 19h30 — Les Bronzés vs Les Smash", "19h30 à 20h15 — Les As vs Les Artishow", "20h15 à 21h00 — Les Smash vs Les Artishow"]],
    ["25 mai", ["18h00 à 18h45 — Les Bronzés vs Les Smash", "18h45 à 19h30 — Les As vs Les Smash", "19h30 à 20h15 — Les Bronzés vs Les Artishow", "20h15 à 21h00 — Les As vs Les Artishow"]],
    ["1 juin", ["18h00 à 18h45 — Les Smash vs Les Artishow", "18h45 à 19h30 — Les Bronzés vs Les Artishow", "19h30 à 20h15 — Les As vs Les Smash", "20h15 à 21h00 — Les As vs Les Bronzés"]],
    ["8 juin", ["18h00 à 18h45 — Les As vs Les Artishow", "18h45 à 19h30 — Les As vs Les Bronzés", "19h30 à 20h15 — Les Smash vs Les Artishow", "20h15 à 21h00 — Les Bronzés vs Les Smash"]],

    ["15 juin", ["18h30 à 19h15 — Les Bronzés vs Les Artishow", "19h15 à 20h00 — Les As vs Les Artishow", "20h00 à 20h45 — Les Bronzés vs Les Smash", "20h45 à 21h30 — Les As vs Les Smash"]],
    ["22 juin", ["18h30 à 19h15 — Les As vs Les Smash", "19h15 à 20h00 — Les Smash vs Les Artishow", "20h00 à 20h45 — Les As vs Les Bronzés", "20h45 à 21h30 — Les Bronzés vs Les Artishow"]],
    ["29 juin", ["18h30 à 19h15 — Les As vs Les Bronzés", "19h15 à 20h00 — Les Bronzés vs Les Smash", "20h00 à 20h45 — Les As vs Les Artishow", "20h45 à 21h30 — Les Smash vs Les Artishow"]],
    ["6 juillet", ["18h30 à 19h15 — Les Bronzés vs Les Smash", "19h15 à 20h00 — Les As vs Les Smash", "20h00 à 20h45 — Les Bronzés vs Les Artishow", "20h45 à 21h30 — Les As vs Les Artishow"]],
    ["13 juillet", ["18h30 à 19h15 — Les Smash vs Les Artishow", "19h15 à 20h00 — Les Bronzés vs Les Artishow", "20h00 à 20h45 — Les As vs Les Smash", "20h45 à 21h30 — Les As vs Les Bronzés"]],
    ["3 août", ["18h30 à 19h15 — Les As vs Les Artishow", "19h15 à 20h00 — Les As vs Les Bronzés", "20h00 à 20h45 — Les Smash vs Les Artishow", "20h45 à 21h30 — Les Bronzés vs Les Smash"]],
    ["10 août", ["18h30 à 19h15 — Les Bronzés vs Les Artishow", "19h15 à 20h00 — Les As vs Les Artishow", "20h00 à 20h45 — Les Bronzés vs Les Smash", "20h45 à 21h30 — Les As vs Les Smash"]],
    ["17 août", ["18h30 à 19h15 — Les As vs Les Smash", "19h15 à 20h00 — Les Smash vs Les Artishow", "20h00 à 20h45 — Les As vs Les Bronzés", "20h45 à 21h30 — Les Bronzés vs Les Artishow"]],
  ],

  competitif: [
    ["19 mai", ["18h00 à 18h45 — Crabe en Bikini vs Fireballs", "18h45 à 19h30 — Fireballs vs Les pieds dans le sable", "19h30 à 20h15 — Crabe en Bikini vs Choix du Président", "20h15 à 21h00 — Les pieds dans le sable vs Choix du Président"]],
    ["26 mai", ["18h00 à 18h45 — Fireballs vs Les pieds dans le sable", "18h45 à 19h30 — Crabe en Bikini vs Les pieds dans le sable", "19h30 à 20h15 — Fireballs vs Choix du Président", "20h15 à 21h00 — Crabe en Bikini vs Choix du Président"]],
    ["2 juin", ["18h00 à 18h45 — Crabe en Bikini vs Choix du Président", "18h45 à 19h30 — Fireballs vs Choix du Président", "19h30 à 20h15 — Crabe en Bikini vs Les pieds dans le sable", "20h15 à 21h00 — Crabe en Bikini vs Fireballs"]],
    ["9 juin", ["18h00 à 18h45 — Crabe en Bikini vs Choix du Président", "18h45 à 19h30 — Crabe en Bikini vs Fireballs", "19h30 à 20h15 — Les pieds dans le sable vs Choix du Président", "20h15 à 21h00 — Fireballs vs Les pieds dans le sable"]],

    ["16 juin", ["18h30 à 19h15 — Fireballs vs Choix du Président", "19h15 à 20h00 — Crabe en Bikini vs Choix du Président", "20h00 à 20h45 — Fireballs vs Les pieds dans le sable", "20h45 à 21h30 — Crabe en Bikini vs Les pieds dans le sable"]],
    ["23 juin", ["18h30 à 19h15 — Crabe en Bikini vs Les pieds dans le sable", "19h15 à 20h00 — Les pieds dans le sable vs Choix du Président", "20h00 à 20h45 — Crabe en Bikini vs Fireballs", "20h45 à 21h30 — Fireballs vs Choix du Président"]],
    ["30 juin", ["18h00 à 18h35 — Crabe en Bikini vs Fireballs", "18h35 à 19h10 — Fireballs vs Les pieds dans le sable", "19h10 à 19h45 — Crabe en Bikini vs Choix du Président", "19h45 à 20h20 — Les pieds dans le sable vs Choix du Président", "20h20 à 21h00 — Crabe en Bikini vs Les pieds dans le sable"]],
    ["7 juillet", ["18h30 à 19h15 — Fireballs vs Les pieds dans le sable", "19h15 à 20h00 — Crabe en Bikini vs Les pieds dans le sable", "20h00 à 20h45 — Fireballs vs Choix du Président", "20h45 à 21h30 — Crabe en Bikini vs Choix du Président"]],
    ["14 juillet", ["18h30 à 19h15 — Les pieds dans le sable vs Choix du Président", "19h15 à 20h00 — Fireballs vs Choix du Président", "20h00 à 20h45 — Crabe en Bikini vs Les pieds dans le sable", "20h45 à 21h30 — Crabe en Bikini vs Fireballs"]],
    ["4 août", ["18h30 à 19h15 — Crabe en Bikini vs Choix du Président", "19h15 à 20h00 — Crabe en Bikini vs Fireballs", "20h00 à 20h45 — Les pieds dans le sable vs Choix du Président", "20h45 à 21h30 — Fireballs vs Les pieds dans le sable"]],
    ["11 août", ["18h30 à 19h15 — Fireballs vs Choix du Président", "19h15 à 20h00 — Crabe en Bikini vs Choix du Président", "20h00 à 20h45 — Fireballs vs Les pieds dans le sable", "20h45 à 21h30 — Crabe en Bikini vs Les pieds dans le sable"]],
    ["18 août", ["18h30 à 19h15 — Crabe en Bikini vs Les pieds dans le sable", "19h15 à 20h00 — Les pieds dans le sable vs Choix du Président", "20h00 à 20h45 — Crabe en Bikini vs Fireballs", "20h45 à 21h30 — Fireballs vs Choix du Président"]],
  ],
};
  const mois = {
  mai: 4,
  juin: 5,
  juillet: 6,
  août: 7,
};

const aujourdHui = new Date();

const convertirDate = (date) => {
  const [jour, moisTexte] = date.split(" ");

  return new Date(
    2026,
    mois[moisTexte],
    Number(jour),
    23,
    59,
    59
  );
};

const toutesLesDates = horaires[categorie];

const selection = toutesLesDates.filter(([date]) => {
  return convertirDate(date) >= aujourdHui;
});

const semaineActive = selection.length > 0 ? selection[0] : null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <p className="font-bold uppercase tracking-wider text-amber-300">
        Saison 2026
      </p>

      <h1 className="mt-2 text-5xl font-black">Calendrier</h1>

      <div className="mt-8 flex gap-3">
        <button
          onClick={() => setCategorie("recreatif")}
          className={`rounded-full px-6 py-3 font-bold ${
            categorie === "recreatif"
              ? "bg-amber-400 text-slate-950"
              : "border border-white/15 text-white"
          }`}
        >
          Récréatif
        </button>

        <button
          onClick={() => setCategorie("competitif")}
          className={`rounded-full px-6 py-3 font-bold ${
            categorie === "competitif"
              ? "bg-amber-400 text-slate-950"
              : "border border-white/15 text-white"
          }`}
        >
          Compétitif
        </button>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
{selection.map(([date, matchs]) => {
  const estSemaineActive = semaineActive && semaineActive[0] === date;

  return (
    <div
      key={date}
      className={`rounded-3xl border p-6 ${
        estSemaineActive
          ? "border-emerald-400 bg-emerald-400/10 shadow-2xl shadow-emerald-400/20"
          : "border-white/10 bg-white/5"
      }`}
    >
      <h2 className="text-2xl font-black text-amber-300">
        {date}
      </h2>

      <div className="mt-5 space-y-3">
        {matchs.map((match, index) => (
          <div
            key={index}
            className="rounded-2xl bg-black/20 p-4 text-slate-200"
          >
            {match}
          </div>
        ))}
      </div>
    </div>
  );
})}
      </div>
    </section>
  );
}

function Connexion() {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [message, setMessage] = useState("");
  const [seSouvenir, setSeSouvenir] = useState(false);

  const seConnecter = async (e) => {
    e.preventDefault();

    try {
      await setPersistence(
        auth,
        seSouvenir ? browserLocalPersistence : browserSessionPersistence
      );

      await signInWithEmailAndPassword(auth, email, motDePasse);

      if (!seSouvenir) {
        localStorage.setItem(
          "lvpsaSessionExpire",
          String(Date.now() + 60 * 60 * 1000)
        );
      } else {
        localStorage.removeItem("lvpsaSessionExpire");
      }

      window.location.href = "/";
    } catch (error) {
      setMessage("Courriel ou mot de passe invalide.");
    }
  };

  return (
    <section className="mx-auto max-w-xl px-6 py-20">
      <h1 className="text-5xl font-black text-white">Connexion</h1>

      <form onSubmit={seConnecter} className="mt-10 space-y-5">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Adresse courriel"
          required
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white"
        />

        <input
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          type="password"
          placeholder="Mot de passe"
          required
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white"
        />

        <label className="flex items-center gap-3 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={seSouvenir}
            onChange={(e) => setSeSouvenir(e.target.checked)}
            className="h-4 w-4"
          />
          Se souvenir de moi
        </label>

        <button
          type="submit"
          className="w-full rounded-full bg-amber-400 px-8 py-4 text-lg font-black text-slate-950 hover:bg-amber-300"
        >
          Se connecter
        </button>
      </form>

      {message && (
        <p className="mt-6 rounded-2xl bg-white/10 p-4 text-center text-white">
          {message}
        </p>
      )}
    </section>
  );
}

function ReponseDemandeRemplacement() {
  const { demandeId, action } = useParams();

  const [chargement, setChargement] = useState(true);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        setMessage("Vous devez vous connecter pour répondre à cette demande.");
        setChargement(false);
        return;
      }

      try {
        const resultat = await traiterReponseDemandeRemplacement(
          demandeId,
          action,
          currentUser
        );

        if (resultat.dejaRepondu) {
          setMessage(`Cette demande a déjà été traitée. Statut actuel : ${resultat.statut}.`);
        } else if (resultat.statut === "accepte") {
          setMessage("Merci ! Le remplacement a été accepté et confirmé.");
        } else if (resultat.statut === "refuse") {
          setMessage("Merci ! Le remplacement a été refusé.");
        }
      } catch (error) {
        console.error(error);
        setMessage(error.message || "Erreur lors du traitement de la demande.");
      }

      setChargement(false);
    });

    return () => unsubscribe();
  }, [demandeId, action]);

  if (chargement) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="text-4xl font-black text-white">Traitement en cours...</h1>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-32 text-center">
      <h1 className="text-4xl font-black text-white">
        Réponse à une demande de remplacement
      </h1>

      <p className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 text-lg text-slate-300">
        {message}
      </p>

      {!user && (
        <Link
          to="/connexion"
          className="mt-8 inline-flex rounded-full bg-amber-400 px-8 py-4 font-black text-slate-950 hover:bg-amber-300"
        >
          Se connecter
        </Link>
      )}

      <Link
        to="/mes-demandes"
        className="mt-6 inline-flex rounded-full border border-white/15 px-8 py-4 font-black text-white hover:border-amber-300 hover:text-amber-300"
      >
        Voir mes demandes
      </Link>
    </section>
  );
}

function MesDemandesRemplacement() {
  const [user, setUser] = useState(null);
  const [demandes, setDemandes] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [message, setMessage] = useState("");

  const chargerDemandes = async (currentUser) => {
    const demandesSnap = await getDocs(collection(db, "demandesRemplacements"));

    const emailUser = normaliserTexteGlobal(currentUser.email);

    const liste = demandesSnap.docs
      .map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      }))
      .filter((demande) => {
        const emailDemande = normaliserTexteGlobal(demande.remplacantEmail);

        return (
          demande.remplacantId === currentUser.uid ||
          emailDemande === emailUser
        );
      })
      .sort((a, b) => {
        const dateA = a.createdAt?.seconds || 0;
        const dateB = b.createdAt?.seconds || 0;
        return dateB - dateA;
      });

    setDemandes(liste);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        setChargement(false);
        return;
      }

      await chargerDemandes(currentUser);
      setChargement(false);
    });

    return () => unsubscribe();
  }, []);

  const repondre = async (demandeId, action) => {
    if (!user) return;

    try {
      await traiterReponseDemandeRemplacement(demandeId, action, user);
      await chargerDemandes(user);

      setMessage(
        action === "accepter"
          ? "Remplacement accepté."
          : "Remplacement refusé."
      );
    } catch (error) {
      console.error(error);
      setMessage(error.message || "Erreur lors de la réponse.");
    }
  };

  const couleurStatut = (statut) => {
    if (statut === "accepte") return "text-emerald-300";
    if (statut === "refuse") return "text-red-300";
    return "text-amber-300";
  };

  if (chargement) {
    return null;
  }

  if (!user) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="text-4xl font-black text-white">Connexion requise</h1>

        <p className="mt-4 text-slate-300">
          Vous devez vous connecter pour voir vos demandes de remplacement.
        </p>

        <Link
          to="/connexion"
          className="mt-8 inline-flex rounded-full bg-amber-400 px-8 py-4 font-black text-slate-950 hover:bg-amber-300"
        >
          Connexion
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <p className="font-bold uppercase tracking-wider text-amber-300">
        Remplaçants
      </p>

      <h1 className="mt-2 text-5xl font-black text-white">
        Mes demandes de remplacement
      </h1>

      <p className="mt-5 max-w-3xl text-lg text-slate-300">
        Consultez les demandes reçues et confirmez votre disponibilité.
      </p>

      {message && (
        <p className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-amber-300">
          {message}
        </p>
      )}

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {demandes.length > 0 ? (
          demandes.map((demande) => (
            <div
              key={demande.id}
              className="rounded-3xl border border-white/10 bg-white/5 p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white">
                    {demande.equipeNom || "Équipe non précisée"}
                  </h2>

                  <p className="mt-2 text-slate-300">
                    Date : {demande.dateLabel || demande.date || "Non précisée"}
                  </p>

                  <p className="text-slate-300">
                    Joueur remplacé : {demande.joueurRemplaceNom || "Non précisé"}
                  </p>

                  <p className="text-slate-300">
                    Capitaine : {demande.capitaineNom || "Non précisé"}
                  </p>
                </div>

                <span className={`rounded-full bg-white/10 px-4 py-2 text-sm font-black uppercase ${couleurStatut(demande.statut)}`}>
                  {demande.statut === "en_attente"
                    ? "En attente"
                    : demande.statut === "accepte"
                    ? "Accepté"
                    : demande.statut === "refuse"
                    ? "Refusé"
                    : demande.statut || "En attente"}
                </span>
              </div>

              {demande.statut === "en_attente" && (
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => repondre(demande.id, "accepter")}
                    className="rounded-full bg-emerald-400 px-6 py-3 font-black text-slate-950 hover:bg-emerald-300"
                  >
                    Accepter
                  </button>

                  <button
                    type="button"
                    onClick={() => repondre(demande.id, "refuser")}
                    className="rounded-full border border-red-400 px-6 py-3 font-black text-red-300 hover:bg-red-400 hover:text-slate-950"
                  >
                    Refuser
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-slate-400">
            Aucune demande de remplacement pour le moment.
          </p>
        )}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-slate-400">
      © 2026 LVPSA — Ligue de volleyball de plage de St-Augustin.
    </footer>
  );
}
function Ligue() {
  
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <h1 className="text-4xl font-black">Informations sur la ligue</h1>
      <p className="mt-4 text-slate-300">
        La LVPSA offre un volet récréatif le lundi soir et un volet compétitif le mardi soir au parc Portneuf.
      </p>
    </section>
  );
}

function InscriptionLigueProtegee() {
  const [user, setUser] = useState(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setChargement(false);
    });

    return () => unsubscribe();
  }, []);

  if (chargement) return null;

  if (!user) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="text-4xl font-black text-white">
          Connexion requise
        </h1>

        <p className="mt-4 text-slate-300">
          Vous devez vous connecter ou créer un compte avant de vous inscrire à la ligue.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link to="/connexion" className="rounded-full bg-amber-400 px-8 py-4 font-black text-slate-950">
            Connexion
          </Link>

          <Link to="/creer-compte" className="rounded-full border border-white/15 px-8 py-4 font-black text-white">
            Créer un compte
          </Link>
        </div>
      </section>
    );
  }

  return <InscriptionLigue />;
}

function InscriptionLigue() {
  const formatTelephone = (value) => {
    const chiffres = value.replace(/\D/g, "").substring(0, 10);

    if (chiffres.length <= 3) return chiffres;

    if (chiffres.length <= 6) {
      return `${chiffres.slice(0, 3)}-${chiffres.slice(3)}`;
    }

    return `${chiffres.slice(0, 3)}-${chiffres.slice(3, 6)}-${chiffres.slice(6)}`;
  };

  const inscriptionUrl =
    "https://script.google.com/macros/s/AKfycbzTGtjahqUxVwnvx8x3bboSXE7z694gA0Q-3_v8CYpXJ15_hraQgucMqpM0WkMN89ET/exec";

  const [type, setType] = useState(null);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  const [equipe, setEquipe] = useState({
    capitaine: "",
    courriel: "",
    telephone: "",
    nomEquipe: "",
    categorie: "Récréatif",
    joueurs: ["", "", "", "", "", "", "", ""],
    notes: "",
  });

  const [joueur, setJoueur] = useState({
    nom: "",
    courriel: "",
    telephone: "",
    categorie: "recreatif",
    notes: "",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          setUserData(data);

          setJoueur((prev) => ({
            ...prev,
            nom: data.nom || "",
            courriel: data.email || "",
            telephone: data.telephone || "",
          }));

          setEquipe((prev) => ({
            ...prev,
            capitaine: data.nom || "",
            courriel: data.email || "",
            telephone: data.telephone || "",
          }));
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const envoyerEquipe = () => {
    fetch(inscriptionUrl, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify({
        type: "equipe",
        capitaine: equipe.capitaine,
        courriel: equipe.courriel,
        telephone: equipe.telephone,
        nomEquipe: equipe.nomEquipe,
        categorie: equipe.categorie,
        joueurs: equipe.joueurs.filter((j) => j.trim() !== ""),
        notes: equipe.notes,
      }),
    });

    alert("Inscription envoyée avec succès !");

    setEquipe({
      capitaine: "",
      courriel: "",
      telephone: "",
      nomEquipe: "",
      categorie: "Récréatif",
      joueurs: ["", "", "", "", "", "", "", ""],
      notes: "",
    });

    setType(null);
  };

  const envoyerJoueur = async () => {
    if (!user) {
      alert("Vous devez être connecté pour vous inscrire.");
      return;
    }

    if (!joueur.nom || !joueur.courriel || !joueur.telephone) {
      alert("Veuillez compléter votre nom, courriel et téléphone.");
      return;
    }

    const categoriesJoueur =
      joueur.categorie === "les-deux"
        ? ["recreatif", "competitif"]
        : [joueur.categorie];

    try {
      const donneesRemplacant = {
        userId: user.uid,
        nom: joueur.nom,
        email: joueur.courriel,
        courriel: joueur.courriel,
        telephone: joueur.telephone,
        categories: categoriesJoueur,
        note: joueur.notes,
        disponible: true,
        statut: "actif",
        updatedAt: serverTimestamp(),
      };

      fetch(inscriptionUrl, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({
          type: "joueur",
          nom: joueur.nom,
          courriel: joueur.courriel,
          telephone: joueur.telephone,
          categories: categoriesJoueur.join(", "),
          notes: joueur.notes,
        }),
      });

      await setDoc(
        doc(db, "users", user.uid),
        {
          nom: joueur.nom,
          email: joueur.courriel,
          telephone: joueur.telephone,
          categories: categoriesJoueur,
          role: "remplacant",
          estJoueur: true,
          estRemplacant: true,
          equipeId: "independant",
          commentaire: joueur.notes,
          statut: "actif",
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      await setDoc(
        doc(db, "remplacements", user.uid),
        {
          ...donneesRemplacant,
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );

      alert("Inscription envoyée avec succès ! Vous êtes maintenant visible pour les capitaines.");

      setJoueur({
        nom: "",
        courriel: "",
        telephone: "",
        categorie: "recreatif",
        notes: "",
      });

      setType(null);
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'inscription. Veuillez réessayer.");
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <p className="font-bold uppercase tracking-wider text-amber-300">
        Ligue LVPSA
      </p>

      <h1 className="mt-2 text-5xl font-black">Inscriptions</h1>

      <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
        Inscrivez une équipe complète comme capitaine ou ajoutez votre nom à la
        liste des joueurs indépendants pour les remplacements ou les équipes à compléter.
      </p>

      {!type && (
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <button
            type="button"
            onClick={() =>
              alert(
                "Les inscriptions d'équipes pour la saison 2026 sont maintenant terminées. Merci pour votre intérêt et restez à l'affût pour la saison prochaine !"
              )
            }
            className="rounded-3xl border border-amber-400/40 bg-amber-400 p-8 text-left text-slate-950 hover:bg-amber-300"
          >
            <h2 className="text-3xl font-black">
              Inscrire une équipe
            </h2>

            <p className="mt-4 text-lg font-semibold">
              Je suis capitaine et je veux inscrire mon équipe complète.
            </p>

            <p className="mt-3 text-sm font-bold">
              Inscriptions maintenant terminées, on se revoit en 2027.
            </p>
          </button>

          <button
            onClick={() => setType("joueur")}
            className="rounded-3xl border border-white/10 bg-white/5 p-8 text-left hover:border-amber-300"
          >
            <h2 className="text-3xl font-black text-amber-300">
              Joueur indépendant
            </h2>

            <p className="mt-4 text-slate-300">
              Je veux être disponible comme remplaçant ou pour compléter une équipe.
            </p>
          </button>
        </div>
      )}

      {type === "equipe" && (
        <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-8">
          <button onClick={() => setType(null)} className="mb-6 text-amber-300">
            ← Retour
          </button>

          <h2 className="text-3xl font-black">Inscription d’équipe</h2>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <input
              className="rounded-2xl px-4 py-3 text-slate-950"
              placeholder="nom du capitaine"
              value={equipe.capitaine}
              onChange={(e) => setEquipe({ ...equipe, capitaine: e.target.value })}
            />

            <input
              className="rounded-2xl px-4 py-3 text-slate-950"
              placeholder="Courriel"
              value={equipe.courriel}
              onChange={(e) => setEquipe({ ...equipe, courriel: e.target.value })}
            />

            <input
              className="rounded-2xl px-4 py-3 text-slate-950"
              placeholder="Téléphone"
              value={equipe.telephone}
              maxLength={12}
              onChange={(e) =>
                setEquipe({
                  ...equipe,
                  telephone: formatTelephone(e.target.value),
                })
              }
            />

            <input
              className="rounded-2xl px-4 py-3 text-slate-950"
              placeholder="nom de l’équipe"
              value={equipe.nomEquipe}
              onChange={(e) => setEquipe({ ...equipe, nomEquipe: e.target.value })}
            />

            <select
              className="rounded-2xl px-4 py-3 text-slate-950 md:col-span-2"
              value={equipe.categorie}
              onChange={(e) => setEquipe({ ...equipe, categorie: e.target.value })}
            >
              <option>Récréatif</option>
              <option>Compétitif</option>
            </select>

            {equipe.joueurs.map((joueurnom, index) => (
              <input
                key={index}
                className="rounded-2xl px-4 py-3 text-slate-950"
                placeholder={`Joueur ${index + 1}${index > 3 ? " optionnel" : ""}`}
                value={joueurnom}
                onChange={(e) => {
                  const nouveauxJoueurs = [...equipe.joueurs];
                  nouveauxJoueurs[index] = e.target.value;
                  setEquipe({ ...equipe, joueurs: nouveauxJoueurs });
                }}
              />
            ))}

            <textarea
              className="min-h-32 rounded-2xl px-4 py-3 text-slate-950 md:col-span-2"
              placeholder="Notes ou informations supplémentaires"
              value={equipe.notes}
              onChange={(e) => setEquipe({ ...equipe, notes: e.target.value })}
            />
          </div>

          <button
            type="button"
            onClick={envoyerEquipe}
            className="mt-8 rounded-full bg-amber-400 px-8 py-3 font-bold text-slate-950 hover:bg-amber-300"
          >
            Envoyer l’inscription
          </button>
        </div>
      )}

      {type === "joueur" && (
        <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-8">
          <button onClick={() => setType(null)} className="mb-6 text-amber-300">
            ← Retour
          </button>

          <h2 className="text-3xl font-black">Joueur indépendant</h2>

          <p className="mt-4 text-slate-300">
            Remplis seulement tes informations de contact et la catégorie dans laquelle tu veux être disponible.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <input
              className="rounded-2xl px-4 py-3 text-slate-950"
              placeholder="nom complet"
              value={joueur.nom}
              onChange={(e) => setJoueur({ ...joueur, nom: e.target.value })}
            />

            <input
              className="rounded-2xl px-4 py-3 text-slate-950"
              placeholder="Courriel"
              value={joueur.courriel}
              onChange={(e) => setJoueur({ ...joueur, courriel: e.target.value })}
            />

            <input
              className="rounded-2xl px-4 py-3 text-slate-950"
              placeholder="Téléphone"
              value={joueur.telephone}
              maxLength={12}
              onChange={(e) =>
                setJoueur({
                  ...joueur,
                  telephone: formatTelephone(e.target.value),
                })
              }
            />

            <select
              className="rounded-2xl px-4 py-3 text-slate-950"
              value={joueur.categorie}
              onChange={(e) => setJoueur({ ...joueur, categorie: e.target.value })}
            >
              <option value="recreatif">Récréatif</option>
              <option value="competitif">Compétitif</option>
              <option value="les-deux">Les deux catégories</option>
            </select>

            <textarea
              className="min-h-32 rounded-2xl px-4 py-3 text-slate-950 md:col-span-2"
              placeholder="Expérience, position préférée ou commentaire optionnel"
              value={joueur.notes}
              onChange={(e) => setJoueur({ ...joueur, notes: e.target.value })}
            />
          </div>

          <button
            type="button"
            onClick={envoyerJoueur}
            className="mt-8 rounded-full bg-amber-400 px-8 py-3 font-bold text-slate-950 hover:bg-amber-300"
          >
            Envoyer mon inscription
          </button>
        </div>
      )}
    </section>
  );
}

function Protegee() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } else {
        setUserData(null);
      }

      setChargement(false);
    });

    return () => unsubscribe();
  }, []);

  if (chargement) {
    return null;
  }

  if (!user) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="text-4xl font-black text-white">
          Connexion requise
        </h1>

        <p className="mt-4 text-slate-300">
          Connectez-vous pour accéder à votre espace d’équipe.
        </p>

        <Link
          to="/connexion"
          className="mt-8 inline-flex rounded-full bg-amber-400 px-8 py-4 font-black text-slate-950 hover:bg-amber-300"
        >
          Se connecter
        </Link>
      </section>
    );
  }

  if (!userData?.equipeId || userData?.equipeId === "independant") {
    return (
      <section className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="text-4xl font-black text-white">
          Aucune équipe associée
        </h1>

        <p className="mt-4 text-slate-300">
          Votre compte n’est pas encore associé à une équipe de la ligue.
        </p>
      </section>
    );
  }

  return <GestionEquipe user={user} userData={userData} />;
}

function GestionEquipe({ user, userData }) {
  const [dateSelectionnee, setDateSelectionnee] = useState("");
  const [remplacants, setRemplacants] = useState([]);
  const [joueurs, setJoueurs] = useState([]);
  const [equipeActuelle, setEquipeActuelle] = useState(null);
  const [joueurAbsentId, setJoueurAbsentId] = useState("");
  const [remplacantId, setRemplacantId] = useState("");

  const datesLigue = [
    { id: "2026-06-22", label: "22 juin", categorie: "recreatif" },
    { id: "2026-06-23", label: "23 juin", categorie: "competitif" },
    { id: "2026-06-29", label: "29 juin", categorie: "recreatif" },
    { id: "2026-06-30", label: "30 juin", categorie: "competitif" },
    { id: "2026-07-06", label: "6 juillet", categorie: "recreatif" },
    { id: "2026-07-07", label: "7 juillet", categorie: "competitif" },
    { id: "2026-07-13", label: "13 juillet", categorie: "recreatif" },
    { id: "2026-07-14", label: "14 juillet", categorie: "competitif" },
    { id: "2026-08-03", label: "3 août", categorie: "recreatif" },
    { id: "2026-08-04", label: "4 août", categorie: "competitif" },
    { id: "2026-08-10", label: "10 août", categorie: "recreatif" },
    { id: "2026-08-11", label: "11 août", categorie: "competitif" },
    { id: "2026-08-17", label: "17 août", categorie: "recreatif" },
    { id: "2026-08-18", label: "18 août", categorie: "competitif" },
  ];

useEffect(() => {
  const extraireCategories = (membre) => {
    const valeurs = Array.isArray(membre.categories)
      ? membre.categories
      : [membre.categorie, membre.catégorie, membre.type].filter(Boolean);

    const categories = valeurs.flatMap((valeur) => {
      const categorie = normaliserCategorieGlobal(valeur);

      if (categorie === "les-deux") {
        return ["recreatif", "competitif"];
      }

      return [categorie];
    });

    return [...new Set(categories)];
  };

  const chargerDonneesEquipe = async () => {
    if (!userData) return;

    const usersSnapshot = await getDocs(collection(db, "users"));
    const remplacementsSnapshot = await getDocs(collection(db, "remplacements"));
    const equipesChargees = await chargerEquipesLVPSA();

    const listeUsers = usersSnapshot.docs.map((docItem) => ({
      id: docItem.id,
      ...docItem.data(),
    }));

    const listeRemplacementsFirestore = remplacementsSnapshot.docs.map((docItem) => ({
  id: docItem.id,
  ...docItem.data(),
}));

const listeRemplacants = fusionnerRemplacementsGlobal(
  listeRemplacementsFirestore,
  listeUsers
);

    const equipeTrouvee =
      equipesChargees.find((equipe) => {
        const equipeId = equipe.id || equipe.equipeId || "";
        const equipeNom = nomEquipeGlobal(equipe);

        return (
          (userData.equipeId && equipeId === userData.equipeId) ||
          (userData.equipenom &&
            normaliserTexteGlobal(equipeNom) === normaliserTexteGlobal(userData.equipenom)) ||
          (userData.equipeNom &&
            normaliserTexteGlobal(equipeNom) === normaliserTexteGlobal(userData.equipeNom))
        );
      }) || null;

    setEquipeActuelle(equipeTrouvee);

    const categorieEquipe = normaliserCategorieGlobal(
      userData.categorie || equipeTrouvee?.categorie || equipeTrouvee?.catégorie
    );

    const joueursDepuisEquipe = Array.isArray(equipeTrouvee?.joueurs)
      ? equipeTrouvee.joueurs
          .filter(Boolean)
          .map((joueur, index) => {
            if (typeof joueur === "string") {
              return {
                id: `joueur-equipe-${index}`,
                nom: joueur,
                email: "",
                telephone: "",
              };
            }

            return {
              id: joueur.id || `joueur-equipe-${index}`,
              nom: joueur.nom || joueur.name || `Joueur ${index + 1}`,
              email: joueur.email || joueur.courriel || "",
              telephone: joueur.telephone || joueur.téléphone || "",
              ...joueur,
            };
          })
      : [];

    const joueursDepuisUsers = listeUsers.filter((membre) => {
      const appartientEquipe = equipeTrouvee
        ? memeEquipeGlobal(membre, equipeTrouvee)
        : membre.equipeId === userData.equipeId;

      if (!appartientEquipe) return false;
      if (membre.equipeId === "independant") return false;
      if (membre.estRemplacant) return false;
      if (membre.role === "remplacant") return false;

      return true;
    });

    const joueursFusionnes = new Map();

[...joueursDepuisEquipe, ...joueursDepuisUsers].forEach((joueur) => {
  const nomNormalise = normaliserTexteGlobal(joueur.nom);
  const emailNormalise = normaliserTexteGlobal(joueur.email || joueur.courriel);

  const cle = nomNormalise || emailNormalise || joueur.id;

  if (!cle) return;

  const joueurActuel = joueursFusionnes.get(cle);

  if (!joueurActuel) {
    joueursFusionnes.set(cle, joueur);
    return;
  }

  joueursFusionnes.set(cle, {
    ...joueurActuel,
    ...joueur,

    id: joueur.id || joueurActuel.id,
    nom: joueur.nom || joueurActuel.nom,
    email: joueur.email || joueur.courriel || joueurActuel.email || joueurActuel.courriel || "",
    courriel: joueur.courriel || joueur.email || joueurActuel.courriel || joueurActuel.email || "",
    telephone: joueur.telephone || joueur.téléphone || joueurActuel.telephone || joueurActuel.téléphone || "",
  });
});

setJoueurs(Array.from(joueursFusionnes.values()));

    setRemplacants(
      listeRemplacants.filter((membre) => {
        const categoriesRemplacant = extraireCategories(membre);
        const statut = normaliserTexteGlobal(membre.statut || "actif");

        const estDisponible =
          membre.disponible === true &&
          statut !== "inactif" &&
          statut !== "non disponible";

        return (
          estDisponible &&
          (!categorieEquipe || categoriesRemplacant.includes(categorieEquipe))
        );
      })
    );
  };

  chargerDonneesEquipe();
}, [userData]);
    if (userData?.role !== "capitaine" && !userData?.isAdmin) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="text-4xl font-black text-white">
          Accès réservé aux capitaines
        </h1>

        <p className="mt-4 text-slate-300">
          Cette section est réservée aux capitaines d'équipe.
        </p>
      </section>
    );
  }
  const remplacantsFiltres = remplacants;

  const categorieEquipeActive = normaliserCategorieGlobal(
  userData.categorie || equipeActuelle?.categorie || equipeActuelle?.catégorie
);

const aujourdHuiGestionEquipe = new Date();
aujourdHuiGestionEquipe.setHours(0, 0, 0, 0);

const datesEquipe = datesLigue.filter((date) => {
  const dateMatch = new Date(`${date.id}T00:00:00`);

  return (
    date.categorie === categorieEquipeActive &&
    dateMatch >= aujourdHuiGestionEquipe
  );
});

  const confirmerRemplacement = async () => {
  if (!dateSelectionnee || !joueurAbsentId || !remplacantId) {
    alert("Veuillez sélectionner une date, un joueur absent et un remplaçant.");
    return;
  }

  const joueurAbsent = joueurs.find((joueur) => joueur.id === joueurAbsentId);
  const remplacant = remplacantsFiltres.find((membre) => membre.id === remplacantId);
  const dateInfo = datesLigue.find((date) => date.id === dateSelectionnee);

  if (!joueurAbsent || !remplacant) {
    alert("Impossible de trouver le joueur absent ou le remplaçant.");
    return;
  }

  const demande = {
    date: dateSelectionnee,
    dateLabel: dateInfo?.label || dateSelectionnee,
    categorie: categorieEquipeActive,

    equipeId: userData.equipeId || equipeActuelle?.id || "",
    equipeNom:
      userData.equipenom ||
      userData.equipeNom ||
      nomEquipeGlobal(equipeActuelle) ||
      "",

    joueurRemplaceId: joueurAbsent?.id || "",
    joueurRemplaceNom: joueurAbsent?.nom || "",

    remplacantId: remplacant?.userId || remplacant?.id || "",
    remplacantNom: remplacant?.nom || "",
    remplacantEmail: remplacant?.email || remplacant?.courriel || "",
    remplacantTelephone: remplacant?.telephone || "",

    capitaineId: user?.uid || "",
    capitaineNom: userData?.nom || "",

    statut: "en_attente",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  try {
    const demandeRef = await addDoc(collection(db, "demandesRemplacements"), demande);

    const lienAccepter = `${window.location.origin}/demande-remplacement/${demandeRef.id}/accepter`;
    const lienRefuser = `${window.location.origin}/demande-remplacement/${demandeRef.id}/refuser`;

    await emailjs.send(
      "service_f4h3rii",
      "template_nwl643g",
      {
        to_email: demande.remplacantEmail,
        remplacant_nom: demande.remplacantNom,
        equipe_nom: demande.equipeNom,
        date_remplacement: demande.dateLabel,
        joueur_remplace: demande.joueurRemplaceNom,
        capitaine_nom: demande.capitaineNom,
        lien_accepter: lienAccepter,
        lien_refuser: lienRefuser,
      },
      "ZooBSx9i6qVl5HI8T"
    );

    alert("Demande envoyée au remplaçant par courriel.");

    setDateSelectionnee("");
    setJoueurAbsentId("");
    setRemplacantId("");
  } catch (error) {
    console.error("Erreur lors de la demande de remplacement :", error);
    alert("Erreur lors de l'envoi de la demande. Veuillez réessayer.");
  }
};
  
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <p className="font-bold uppercase tracking-wider text-amber-300">
        Espace membre
      </p>

      <h1 className="mt-2 text-5xl font-black text-white">
        {userData.equipenom || userData.equipeNom || nomEquipeGlobal(equipeActuelle)}
      </h1>

      <p className="mt-4 text-slate-300">
        Catégorie :{" "}
        {categorieEquipeActive === "recreatif" ? "Récréatif" : "Compétitif"}
      </p>

      <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-8">
  <h2 className="text-3xl font-black text-amber-300">
    Joueurs de l’équipe
  </h2>

  <p className="mt-4 text-slate-300">
    Liste des joueurs associés à votre équipe.
  </p>

  <div className="mt-8 grid gap-4 md:grid-cols-2">
    {joueurs.length > 0 ? (
      joueurs.map((joueur) => (
        <div
          key={joueur.id}
          className="rounded-2xl border border-white/10 bg-black/20 p-5"
        >
          <h3 className="text-xl font-black text-white">
            {joueur.nom}
          </h3>

          <p className="mt-2 text-slate-300">
            📧 {joueur.email || joueur.courriel || "Courriel non disponible"}
          </p>

          <p className="text-slate-300">
            📞 {joueur.telephone || joueur.téléphone || "Téléphone non disponible"}
          </p>
        </div>
      ))
    ) : (
      <p className="text-slate-300">
        Aucun joueur n’est encore associé à cette équipe.
      </p>
    )}
  </div>
</div>
      
      <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-8">
        <h2 className="text-3xl font-black text-amber-300">
          Remplaçants disponibles
        </h2>

        <select
          value={dateSelectionnee}
          onChange={(e) => setDateSelectionnee(e.target.value)}
          className="mt-6 w-full rounded-2xl bg-slate-900 px-5 py-4 text-white md:max-w-md"
        >
          <option value="">Choisir une date</option>

          {datesEquipe.map((date) => (
            <option key={date.id} value={date.id}>
              {date.label}
            </option>
          ))}
        </select>

        {dateSelectionnee && (
  <div className="mt-8 rounded-3xl border border-white/10 bg-black/20 p-6">
    <h3 className="text-2xl font-black text-white">
      Confirmer un remplacement
    </h3>

    <select
      value={joueurAbsentId}
      onChange={(e) => setJoueurAbsentId(e.target.value)}
      className="mt-5 w-full rounded-2xl bg-slate-900 px-5 py-4 text-white"
    >
      <option value="">Choisir le joueur absent</option>

      {joueurs.map((joueur) => (
        <option key={joueur.id} value={joueur.id}>
          {joueur.nom}
        </option>
      ))}
    </select>

    <select
      value={remplacantId}
      onChange={(e) => setRemplacantId(e.target.value)}
      className="mt-4 w-full rounded-2xl bg-slate-900 px-5 py-4 text-white"
    >
      <option value="">Choisir le remplaçant</option>

      {remplacantsFiltres.map((membre) => (
        <option key={membre.id} value={membre.id}>
          {membre.nom}
        </option>
      ))}
    </select>

    <button
      type="button"
      onClick={confirmerRemplacement}
      className="mt-6 rounded-full bg-amber-400 px-7 py-3 font-black text-slate-950 hover:bg-amber-300"
    >
      Confirmer le remplacement
    </button>
  </div>
)}

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {remplacantsFiltres.length > 0 ? (
              remplacantsFiltres.map((membre) => (
                <div
                  key={membre.id}
                  className="rounded-3xl border border-white/10 bg-black/20 p-6"
                >
                  <h3 className="text-2xl font-black text-white">
                    {membre.nom}
                  </h3>

                  <p className="mt-3 text-slate-300">
                    📞 {membre.telephone || "Téléphone non disponible"}
                  </p>

                  <p className="text-slate-300">
                    📧 {membre.email || "Courriel non disponible"}
                  </p>

{(membre.note || membre.commentaire) && (
  <p className="mt-4 text-slate-300">
    Note : {membre.note || membre.commentaire}
  </p>
)}
                </div>
              ))
            ) : (
              <p className="text-slate-300">
                Aucun remplaçant disponible dans votre catégorie.
              </p>
            )}
          </div>
      </div>
    </section>
  );
}
function HoraireTournoi() {
  const URL_PRELIMINAIRE = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS-c5VyUXXuIZzF-kTjV0f5Q3j22z_GEVvDZo_NPv0TL2vFioxrTrbmekcGRsQG_-YZjEpoucTHiuK5/pub?gid=1462787850&single=true&output=csv";
  const URL_SERIES_RECREATIF = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS-c5VyUXXuIZzF-kTjV0f5Q3j22z_GEVvDZo_NPv0TL2vFioxrTrbmekcGRsQG_-YZjEpoucTHiuK5/pub?gid=1339498144&single=true&output=csv";
  const URL_SERIES_COMPETITIF = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS-c5VyUXXuIZzF-kTjV0f5Q3j22z_GEVvDZo_NPv0TL2vFioxrTrbmekcGRsQG_-YZjEpoucTHiuK5/pub?gid=1822024061&single=true&output=csv";

  const [matchsPreliminaires, setMatchsPreliminaires] = useState([]);
  const [seriesRecreatif, setSeriesRecreatif] = useState([]);
  const [seriesCompetitif, setSeriesCompetitif] = useState([]);
  const [chargementHoraire, setChargementHoraire] = useState(true);
  const [erreurHoraire, setErreurHoraire] = useState("");
  const [equipeFiltre, setEquipeFiltre] = useState("");

  const normaliserEntete = (texte) =>
    String(texte || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ")
      .trim();

  const lireCSV = (csv) => {
  const parserLigne = (ligne) => {
    const separateurs = [",", ";", "\t"];

    const separateur =
      separateurs.find((sep) => ligne.includes(sep)) || ",";

    return ligne
      .split(
        separateur === ","
          ? /,(?=(?:(?:[^"]*"){2})*[^"]*$)/
          : separateur
      )
      .map((cell) =>
        cell
          .replace(/^"|"$/g, "")
          .replace(/""/g, '"')
          .trim()
      );
  };

  const lignes = csv
    .split(/\r?\n/)
    .map(parserLigne)
    .filter((row) => row.some((cell) => String(cell).trim() !== ""));

  if (lignes.length < 2) return [];

  const normaliser = (texte) =>
    String(texte || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ")
      .trim();

  const indexEntetes = lignes.findIndex((row) => {
    const rowNormalisee = row.map(normaliser);

    return (
      rowNormalisee.some((cell) => cell.includes("match")) &&
      rowNormalisee.some((cell) => cell.includes("heure"))
    );
  });

  if (indexEntetes === -1) {
    console.error("Aucune ligne d'entêtes trouvée dans le CSV.");
    return [];
  }

  const entetes = lignes[indexEntetes].map(normaliser);

  const valeur = (row, nomsPossibles) => {
    for (const nom of nomsPossibles) {
      const index = entetes.indexOf(normaliser(nom));

      if (index !== -1) {
        return row[index] || "";
      }
    }

    return "";
  };

  return lignes
    .slice(indexEntetes + 1)
    .filter((row) => {
      const noMatch = valeur(row, ["Match #", "Match", "No", "No."]);
      const heure = valeur(row, ["Heure"]);

      return noMatch && heure;
    })
    .map((row) => {
      const set1A = valeur(row, ["Set 1 - A", "Set 1 A"]);
      const set1B = valeur(row, ["Set 1 - B", "Set 1 B"]);
      const set2A = valeur(row, ["Set 2 - A", "Set 2 A"]);
      const set2B = valeur(row, ["Set 2 - B", "Set 2 B"]);

      return {
        no: valeur(row, ["Match #", "Match", "No", "No."]),
        heure: valeur(row, ["Heure"]),
        categorie: valeur(row, ["Catégorie", "Categorie"]),
        equipeA: valeur(row, ["Équipe A", "Equipe A"]),
        equipeB: valeur(row, ["Équipe B", "Equipe B"]),
        set1A,
        set1B,
        set2A,
        set2B,
        gagnant: valeur(row, ["Gagnant"]),
        marqueur: valeur(row, ["Arbitre", "Arbitre (équipe)", "Marqueur"]),
        statut: valeur(row, ["Statut"]) || "À jouer",
      };
    });
};
  useEffect(() => {
    async function chargerHoraire() {
      try {
        setChargementHoraire(true);
        setErreurHoraire("");

        const urls = [
          URL_PRELIMINAIRE,
          URL_SERIES_RECREATIF,
          URL_SERIES_COMPETITIF,
        ];

        if (urls.some((url) => url.includes("COLLE_ICI"))) {
          setErreurHoraire(
            "Les liens CSV de l’horaire n’ont pas encore été ajoutés dans le code."
          );
          setChargementHoraire(false);
          return;
        }

        const [prelimRes, recRes, compRes] = await Promise.all([
          fetch(URL_PRELIMINAIRE),
          fetch(URL_SERIES_RECREATIF),
          fetch(URL_SERIES_COMPETITIF),
        ]);

        const [prelimCsv, recCsv, compCsv] = await Promise.all([
          prelimRes.text(),
          recRes.text(),
          compRes.text(),
        ]);

        setMatchsPreliminaires(lireCSV(prelimCsv));
        setSeriesRecreatif(lireCSV(recCsv));
        setSeriesCompetitif(lireCSV(compCsv));
      } catch (error) {
        console.error("Erreur lors du chargement de l’horaire :", error);
        setErreurHoraire(
          "Impossible de charger l’horaire pour le moment. Veuillez réessayer plus tard."
        );
      } finally {
        setChargementHoraire(false);
      }
    }

    chargerHoraire();
  }, []);

  const resultatMatch = (match) => {
    const aSet1 = String(match.set1A || "").trim();
    const bSet1 = String(match.set1B || "").trim();
    const aSet2 = String(match.set2A || "").trim();
    const bSet2 = String(match.set2B || "").trim();

    if (!aSet1 && !bSet1 && !aSet2 && !bSet2) {
      return "—";
    }

    return `${aSet1 || "-"}-${bSet1 || "-"} / ${aSet2 || "-"}-${bSet2 || "-"}`;
  };

  const couleurCategorie = (categorie) => {
    const texte = String(categorie || "").toLowerCase();

    if (texte.includes("récréatif") || texte.includes("recreatif")) {
      return "bg-sky-400/10 text-sky-300";
    }

    if (texte.includes("compétitif") || texte.includes("competitif")) {
      return "bg-red-400/10 text-red-300";
    }

    return "bg-white/10 text-slate-300";
  };

  const normaliserTexte = (texte) =>
  String(texte || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const toutesLesEquipes = Array.from(
  new Set(
    [...matchsPreliminaires, ...seriesRecreatif, ...seriesCompetitif]
      .flatMap((match) => [
        match.equipeA,
        match.equipeB,
        match.marqueur,
      ])
      .filter(Boolean)
      .filter((nom) => {
        const texte = normaliserTexte(nom);

        return (
          !texte.includes("classement") &&
          !texte.includes("gagnant") &&
          !texte.includes("demi-finale") &&
          texte !== "a confirmer"
        );
      })
  )
).sort((a, b) => a.localeCompare(b, "fr"));

const matchConcerneEquipe = (match) => {
  if (!equipeFiltre) return true;

  const equipe = normaliserTexte(equipeFiltre);

  return (
    normaliserTexte(match.equipeA) === equipe ||
    normaliserTexte(match.equipeB) === equipe ||
    normaliserTexte(match.marqueur) === equipe
  );
};

const matchsPreliminairesFiltres = matchsPreliminaires.filter(matchConcerneEquipe);
const seriesRecreatifFiltres = seriesRecreatif.filter(matchConcerneEquipe);
const seriesCompetitifFiltres = seriesCompetitif.filter(matchConcerneEquipe);
  
  const TableHoraire = ({ titre, matchs, afficherGagnant = true }) => (
    <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl">
      <div className="bg-amber-400 px-6 py-5 text-slate-950">
        <h2 className="text-3xl font-black">{titre}</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] text-left">
          <thead>
            <tr className="border-b border-white/10 bg-slate-900 text-amber-300">
              <th className="px-5 py-4 font-black">Match</th>
              <th className="px-5 py-4 font-black">Heure</th>
              <th className="px-5 py-4 font-black">Catégorie</th>
              <th className="px-5 py-4 font-black">Équipe A</th>
              <th className="px-5 py-4 font-black">Équipe B</th>
              <th className="px-5 py-4 font-black">Résultat</th>
              <th className="px-5 py-4 font-black">Marqueur</th>
              {afficherGagnant && (<th className="px-5 py-4 font-black">Gagnant</th>)}
              <th className="px-5 py-4 font-black">Statut</th>
            </tr>
          </thead>

          <tbody>
            {matchs.length > 0 ? (
              matchs.map((match) => (
                <tr
                  key={`${titre}-${match.no}`}
                  className="border-b border-white/10 text-white"
                >
                  <td className="px-5 py-4 font-black text-amber-300">
                    #{match.no}
                  </td>

                  <td className="px-5 py-4 font-bold">
                    {match.heure}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-bold ${couleurCategorie(
                        match.categorie
                      )}`}
                    >
                      {match.categorie}
                    </span>
                  </td>

                  <td className="px-5 py-4 font-bold">
                    {match.equipeA}
                  </td>

                  <td className="px-5 py-4 font-bold">
                    {match.equipeB}
                  </td>

                  <td className="px-5 py-4 text-slate-300">
                    {resultatMatch(match)}
                  </td>

                  <td className="px-5 py-4 text-slate-300">
                    {match.marqueur || "À confirmer"}
                  </td>

                  {afficherGagnant && (
  <td className="px-5 py-4 text-slate-300">
    {match.gagnant || "—"}
  </td>
)}

                  <td className="px-5 py-4">
                    <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-bold text-slate-300">
                      {match.statut || "À jouer"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="px-5 py-8 text-center text-slate-400">
                  Aucun match à afficher pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <p className="font-bold uppercase tracking-wider text-amber-300">
        Tournoi LVPSA 2026
      </p>

      <h1 className="mt-2 text-5xl font-black text-white">
        Horaire du tournoi
      </h1>

      <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
        Voici l’horaire officiel du tournoi. Les équipes doivent être prêtes à
        commencer dès que leur tour arrive. L’horaire pourrait légèrement varier
        selon l’avance ou le retard accumulé durant la journée.
      </p>

      <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-6">
  <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-300">
    Filtrer l’horaire par équipe
  </p>

  <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center">
    <select
      value={equipeFiltre}
      onChange={(e) => setEquipeFiltre(e.target.value)}
      className="w-full rounded-2xl border border-white/10 bg-slate-900 px-5 py-4 text-white md:max-w-md"
    >
      <option value="">Toutes les équipes</option>

      {toutesLesEquipes.map((equipe) => (
        <option key={equipe} value={equipe}>
          {equipe}
        </option>
      ))}
    </select>

    {equipeFiltre && (
      <button
        type="button"
        onClick={() => setEquipeFiltre("")}
        className="rounded-full border border-white/15 px-6 py-3 font-bold text-white hover:border-amber-300 hover:text-amber-300"
      >
        Réinitialiser
      </button>
    )}
  </div>

  {equipeFiltre && (
    <p className="mt-4 text-slate-300">
      Affichage des matchs et assignations de marqueur pour :{" "}
      <span className="font-bold text-amber-300">{equipeFiltre}</span>
    </p>
  )}
</div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
    <div className="flex items-center gap-3">
      <div className="text-2xl">🏐</div>

      <h2 className="text-lg font-black text-white">
        Ronde préliminaire
      </h2>
    </div>

    <p className="mt-2 text-sm leading-6 text-slate-300">
      Parties de 2 sets de 21 points.
    </p>
  </div>

  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
    <div className="flex items-center gap-3">
      <div className="text-2xl">📝</div>

      <h2 className="text-lg font-black text-white">
        Marqueurs
      </h2>
    </div>

    <p className="mt-2 text-sm leading-6 text-slate-300">
      Chaque équipe fournit un marqueur pour 2 parties.
    </p>
  </div>

  <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-4">
    <div className="flex items-center gap-3">
      <div className="text-2xl">⏱️</div>

      <h2 className="text-lg font-black text-white">
        Soyez prêts
      </h2>
    </div>

    <p className="mt-2 text-sm leading-6 text-slate-300">
      Non prêt 5 minutes après le match précédent : forfait 21-0 au premier set.
    </p>
  </div>
</div>

      {chargementHoraire && (
        <p className="mt-10 rounded-2xl bg-white/10 p-5 text-center text-slate-300">
          Chargement de l’horaire...
        </p>
      )}

      {erreurHoraire && (
        <div className="mt-10 rounded-2xl border border-red-400/30 bg-red-400/10 p-5 text-center text-red-300">
          {erreurHoraire}
        </div>
      )}

      {!chargementHoraire && !erreurHoraire && (
        <>
          <div className="mt-12">
            <TableHoraire
  titre="Ronde préliminaire"
  matchs={matchsPreliminairesFiltres}
  afficherGagnant={false}
/>
          </div>

          <div className="mt-16 flex flex-col gap-8">
  <TableHoraire
    titre="Séries récréatives"
    matchs={seriesRecreatifFiltres}
  />

  <TableHoraire
    titre="Séries compétitives"
    matchs={seriesCompetitifFiltres}
  />
</div>
        </>
      )}

      <div className="mt-12 rounded-[2rem] border border-amber-400/20 bg-amber-400/10 p-8">
        <h2 className="text-3xl font-black text-amber-300">
          Informations importantes
        </h2>

        <ul className="mt-6 space-y-3 text-slate-300">
          <li>• Terrain de pickleball, basketball, parc pour enfants, jeux d’eau et toilettes sur place.</li>
          <li>• Nourriture et rafraîchissements inclus en quantité déterminée pour les joueurs.</li>
          <li>• Nourriture et rafraîchissements aussi disponibles à l’achat pour tous.</li>
          <li>• Prévoir vos chaises.</li>
          <li>• Bourses, prix de présence et festin d’après-tournoi seront offerts.</li>
          <li>• Le but est d’avoir du gros fun : en cas de zone grise, le point sera repris.</li>
        </ul>
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          to="/tournoi"
          className="rounded-full border border-white/15 px-8 py-4 font-black text-white hover:border-amber-300 hover:text-amber-300"
        >
          Retour aux informations
        </Link>

        <Link
          to="/tournoi/reglements"
          className="rounded-full bg-amber-400 px-8 py-4 font-black text-slate-950 hover:bg-amber-300"
        >
          Voir les règlements
        </Link>
      </div>
    </section>
  );
}
function ReglementsTournoi() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <p className="font-bold uppercase tracking-wider text-amber-300">
        Tournoi LVPSA
      </p>

      <h1 className="mt-2 text-5xl font-black">
        Règlements du tournoi
      </h1>

      <p className="mt-4 text-xl text-slate-300">
        Tournoi du 18 juillet 2026
      </p>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-3xl font-black text-amber-300">
            Format de jeu
          </h2>

          <ul className="mt-6 space-y-4 text-slate-300">
            <li>🏐 4 contre 4 avec au moins une fille sur le terrain en tout temps.</li>
            <li>👥 Une équipe peut avoir plus de 4 joueurs, mais seulement 4 joueurs sur le terrain.</li>
            <li>✅ Phase préliminaire : 2 sets de 21 points</li>
            <li>✅ Phase séries : 2 sets de 25 points, un set de 15 points si égalité.</li>
            <li>⚠️ Si une équipe joue à 3, un joueur fantôme perdra un point à sa rotation au service.</li>
            <li>⚠️ Pour qu'un joueur/joueuse soit admissible à la phase ''série'', il/elle doit avoir jouer au moins une match complet en ronde préléminaire.</li>
          </ul>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-3xl font-black text-amber-300">
            Interdictions
          </h2>

          <ul className="mt-6 space-y-4 text-slate-300">
            <li>❌ Bloquer ou feinte de bloquer une femme sur une action à l’attaque pour les hommes.</li>
            <li>✅ Bloc permis sur une femme uniquement lors d’un deuxième contact ou d’un retour en manchette.</li>
            <li>❌ Renvoyer en touche ou en tip, sauf pour le volet récréatif.</li>
            <li>❌ Aucune faute de double touche ne sera appelée.</li>
            <li>❌ Toucher le filet.</li>
            <li>❌ Traverser de l’autre côté.</li>
            <li>❌ Faire un transport.</li>
          </ul>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-3xl font-black text-amber-300">
            Rotation/Position
          </h2>

          <p className="mt-6 text-slate-300 leading-8">
            L’ordre des serveurs doit être respecté en tout temps. Il n’y a
            toutefois aucune erreur de position : tous les joueurs peuvent
            attaquer au filet en tout temps.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-3xl font-black text-amber-300">
            Arbitrage et marqueur
          </h2>

          <p className="mt-6 text-slate-300 leading-8">
            Un arbitre non officiel/marqueur sera attitré. Toutes les équipes
            devront fournir un arbitre/marqueur 2 fois pendant la journée. En cas de
            doute, le point sera repris.
          </p>
        </div>
      </div>

      <div className="mt-12 rounded-3xl border border-amber-400/20 bg-amber-400/10 p-8">
        <h2 className="text-3xl font-black text-amber-300">
          Météo
        </h2>

        <p className="mt-4 text-lg text-slate-300">
          En cas de mauvais temps, le tournoi sera remis au 19 juillet 2026.
        </p>
      </div>

      <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
        <h2 className="text-3xl font-black">
          Organisateurs
        </h2>

        <p className="mt-4 text-slate-300">
          Valérie Thomassin et Michael Théroux
        </p>

        <a
          href="mailto:liguevpsa@gmail.com"
          className="mt-6 inline-flex rounded-full bg-amber-400 px-8 py-3 font-bold text-slate-950 hover:bg-amber-300"
        >
          Nous joindre
        </a>
      </div>
    </section>
  );
}

