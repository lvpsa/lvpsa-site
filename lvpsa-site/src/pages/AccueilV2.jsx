import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CloudSun,
  Images,
  MapPin,
  ShoppingBag,
  Sparkles,
  Trophy,
  Wind,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";

import { db } from "../firebase";
import HeaderLVPSA from "../components/HeaderLVPSA";

const reveal = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.5 },
};

const partenaires = [
  ["Soccer Sport Fitness", "/soccer-sport-fitness.png"],
  ["Applied Industrial Technologies", "/Applied.png"],
  ["Canac", "/Canac.png"],
  ["Ville de Saint-Augustin-de-Desmaures", "/VSAD.png"],
  ["Desjardins", "/Desjardins.png"],
];

const normaliser = (valeur) =>
  String(valeur || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const iconeMeteo = (code) => {
  if (code === 0) return "☀️";
  if (code <= 3) return "⛅";
  if (code < 60) return "☁️";
  if (code < 80) return "🌧️";
  if (code < 90) return "🌦️";
  return "⛈️";
};

export default function AccueilV2() {
  const [stats, setStats] = useState({
    equipes: 8,
    joueurs: "—",
    categories: 2,
    partenaires: partenaires.length,
  });

  const [statutMatchs, setStatutMatchs] = useState({
    texte: "Les parties ont lieu ce soir",
    couleur: "emerald",
    message: "Mise à jour officielle LVPSA",
  });

  const [meteoHeures, setMeteoHeures] = useState([]);
  const [meteoChargement, setMeteoChargement] = useState(true);

  useEffect(() => {
    let actif = true;

    const chargerStats = async () => {
      try {
        const [teamsSnap, equipesSnap, usersSnap] = await Promise.all([
          getDocs(collection(db, "Teams")),
          getDocs(collection(db, "Equipes")),
          getDocs(collection(db, "users")),
        ]);

        const equipesUniques = new Map();

        [...teamsSnap.docs, ...equipesSnap.docs].forEach((docItem) => {
          const data = docItem.data();
          const nom =
            data.nom ||
            data.nomEquipe ||
            data.equipeNom ||
            data.equipenom ||
            docItem.id;

          const cle = normaliser(nom) || docItem.id;

          if (!equipesUniques.has(cle)) {
            equipesUniques.set(cle, true);
          }
        });

        const joueurs = usersSnap.docs.filter((docItem) => {
          const data = docItem.data();
          const equipeId = normaliser(data.equipeId || data.idEquipe);

          return (
            data.estJoueur === true ||
            data.role === "joueur" ||
            data.role === "capitaine" ||
            data.role === "remplacant" ||
            Boolean(equipeId)
          );
        }).length;

        if (actif) {
          setStats({
            equipes: equipesUniques.size || 8,
            joueurs,
            categories: 2,
            partenaires: partenaires.length,
          });
        }
      } catch (error) {
        console.warn("Statistiques d'accueil indisponibles :", error);
      }
    };

    const chargerStatut = async () => {
      try {
        const statutSnap = await getDoc(
          doc(db, "settings", "matchStatus")
        );

        if (actif && statutSnap.exists()) {
          setStatutMatchs((precedent) => ({
            ...precedent,
            ...statutSnap.data(),
          }));
        }
      } catch (error) {
        console.warn("Statut des parties indisponible :", error);
      }
    };

    const chargerMeteo = async () => {
      try {
        const url =
          "https://api.open-meteo.com/v1/forecast?latitude=46.74&longitude=-71.45&hourly=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m,precipitation_probability,uv_index&timezone=America%2FToronto&forecast_days=2";

        const reponse = await fetch(url);

        if (!reponse.ok) {
          throw new Error(`Erreur météo : ${reponse.status}`);
        }

        const data = await reponse.json();
        const heuresVoulues = ["18:00", "19:00", "20:00", "21:00", "22:00"];

        const resultats = (data.hourly?.time || [])
          .map((time, index) => ({
            time,
            heure: time.slice(11, 16),
            temperature: Math.round(
              Number(data.hourly.temperature_2m?.[index] || 0)
            ),
            vent: Math.round(
              Number(data.hourly.wind_speed_10m?.[index] || 0)
            ),
            humidite:
              data.hourly.relative_humidity_2m?.[index] ?? null,
            precipitation:
              data.hourly.precipitation_probability?.[index] ?? null,
            uv: data.hourly.uv_index?.[index] ?? null,
            code: data.hourly.weather_code?.[index] ?? 0,
          }))
          .filter((item) => heuresVoulues.includes(item.heure))
          .slice(0, 5);

        if (actif) {
          setMeteoHeures(resultats);
        }
      } catch (error) {
        console.warn("Météo indisponible :", error);

        if (actif) {
          setMeteoHeures([]);
        }
      } finally {
        if (actif) {
          setMeteoChargement(false);
        }
      }
    };

    chargerStats();
    chargerStatut();
    chargerMeteo();

    return () => {
      actif = false;
    };
  }, []);

  const partiesAnnulees =
    normaliser(statutMatchs.couleur) === "red" ||
    normaliser(statutMatchs.texte).includes("annule");

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="absolute -left-32 top-24 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -right-32 top-80 h-96 w-96 rounded-full bg-yellow-400/10 blur-3xl" />
      </div>

      <HeaderLVPSA />
      <div className="h-24" />

      <main className="relative z-10">

        <section className="mx-auto max-w-7xl px-5 py-6 lg:px-8">
          <motion.div
            {...reveal}
            className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]"
          >
            <div
              className={`rounded-3xl border p-6 sm:p-8 ${
                partiesAnnulees
                  ? "border-red-400/30 bg-red-400/10"
                  : "border-emerald-400/30 bg-emerald-400/10"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div
                  className={`flex items-center gap-3 ${
                    partiesAnnulees
                      ? "text-red-300"
                      : "text-emerald-300"
                  }`}
                >
                  <CheckCircle2 className="h-6 w-6" />
                  <p className="text-sm font-black uppercase tracking-[0.18em]">
                    Statut des parties
                  </p>
                </div>

                <span
                  className={`rounded-full px-4 py-2 text-xs font-black uppercase ${
                    partiesAnnulees
                      ? "bg-red-400/15 text-red-300"
                      : "bg-emerald-400/15 text-emerald-300"
                  }`}
                >
                  {partiesAnnulees ? "Annulées" : "Confirmées"}
                </span>
              </div>

              <h2 className="mt-7 text-3xl font-black text-white">
                {statutMatchs.texte}
              </h2>

              <p className="mt-3 leading-7 text-slate-300">
                {statutMatchs.message}
              </p>

              <p className="mt-6 rounded-2xl border border-white/10 bg-black/15 p-4 text-sm text-slate-300">
                Mise à jour officielle de la LVPSA.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 text-cyan-300">
                    <CloudSun className="h-6 w-6" />
                    <p className="text-sm font-black uppercase tracking-[0.18em]">
                      Météo de la soirée
                    </p>
                  </div>

                  <h2 className="mt-3 text-3xl font-black">
                    Parc Portneuf
                  </h2>
                </div>

              </div>

              {meteoChargement ? (
                <div className="mt-7 grid grid-cols-5 gap-3">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div
                      key={item}
                      className="h-32 animate-pulse rounded-2xl bg-white/10"
                    />
                  ))}
                </div>
              ) : meteoHeures.length > 0 ? (
                <>
                  <div className="mt-7 grid grid-cols-5 gap-2 sm:gap-3">
                    {meteoHeures.map((item) => (
                      <div
                        key={item.time}
                        className="rounded-2xl border border-white/10 bg-slate-950/55 p-2 text-center sm:p-3"
                      >
                        <p className="text-xs font-bold text-slate-400 sm:text-sm">
                          {item.heure.replace(":00", "h")}
                        </p>

                        <p className="mt-2 text-2xl sm:text-3xl">
                          {iconeMeteo(item.code)}
                        </p>

                        <p className="mt-2 text-lg font-black text-white sm:text-xl">
                          {item.temperature}°
                        </p>

                        <p className="mt-1 text-[10px] text-cyan-300 sm:text-xs">
                          {item.precipitation ?? 0}% pluie
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-300">
                    <span className="rounded-full bg-white/5 px-4 py-2">
                      Humidité : {meteoHeures[0]?.humidite ?? "--"}%
                    </span>

                    <span className="flex items-center gap-2 rounded-full bg-white/5 px-4 py-2">
                      <Wind className="h-4 w-4 text-cyan-300" />
                      Vent : {meteoHeures[0]?.vent ?? "--"} km/h
                    </span>

                    <span className="rounded-full bg-white/5 px-4 py-2">
                      UV :{" "}
                      {meteoHeures[0]?.uv !== null &&
                      meteoHeures[0]?.uv !== undefined
                        ? Number(meteoHeures[0].uv).toFixed(1)
                        : "--"}
                    </span>

                    <a
                      href="https://www.meteomedia.com/ca/meteo/quebec/saint-augustin-de-desmaures"
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-white/10 px-4 py-2 font-bold text-cyan-300 transition hover:border-cyan-300/40"
                    >
                      Voir MétéoMédia ↗
                    </a>
                  </div>
                </>
              ) : (
                <div className="mt-7 rounded-2xl border border-white/10 bg-white/5 p-5 text-slate-300">
                  La météo est temporairement indisponible.
                </div>
              )}
            </div>
          </motion.div>
        </section>

        <section className="mx-auto max-w-7xl px-5 pb-10 pt-8 lg:px-8 lg:pb-16 lg:pt-14">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900 shadow-2xl lg:min-h-[610px]">
            <img
              src="/hero-lvpsa.jpg"
              alt="Terrain LVPSA"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/25" />

            <div className="relative z-10 flex min-h-[610px] max-w-3xl flex-col justify-center p-6 sm:p-10 lg:p-14">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-cyan-300/20 bg-slate-950/60 px-4 py-2 text-sm font-semibold text-cyan-200 backdrop-blur-xl"
              >
                <MapPin className="h-4 w-4" />
                Saint-Augustin-de-Desmaures
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.08 }}
                className="text-4xl font-black leading-[1.02] sm:text-6xl lg:text-7xl"
              >
                Plus qu’une ligue.
                <span className="block bg-gradient-to-r from-cyan-300 via-white to-yellow-300 bg-clip-text text-transparent">
                  Une communauté.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.16 }}
                className="mt-6 max-w-2xl text-lg leading-8 text-slate-300"
              >
                Jouez, suivez vos résultats, restez connecté à votre équipe
                et vivez pleinement l’expérience LVPSA.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.24 }}
                className="mt-8 flex flex-col gap-3 sm:flex-row"
              >
                <Link
                  to="/mon-espace"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 font-bold text-slate-950 transition hover:-translate-y-0.5"
                >
                  Accéder à mon espace
                  <ArrowRight className="h-5 w-5" />
                </Link>

                <Link
                  to="/calendrier"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-slate-950/50 px-6 py-3.5 font-bold transition hover:border-cyan-300/40"
                >
                  Voir le calendrier
                  <CalendarDays className="h-5 w-5" />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
          <motion.div
            {...reveal}
            className="overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-gradient-to-br from-cyan-400/10 via-slate-900 to-yellow-300/10"
          >
            <div className="grid items-center lg:grid-cols-[1.1fr_0.9fr]">
              <div className="p-7 sm:p-10 lg:p-12">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-black uppercase tracking-[0.16em] text-cyan-300">
                  <Sparkles className="h-4 w-4" />
                  Prochain événement
                </div>

                <h2 className="mt-6 text-4xl font-black sm:text-5xl">
                  Une nouvelle expérience LVPSA prend forme...
                </h2>

                <p className="mt-6 text-lg leading-8 text-slate-300">
                  Le tournoi 2026 est maintenant derrière nous, mais une
                  nouvelle expérience LVPSA, distincte de la saison régulière,
                  est déjà en préparation.
                </p>

                <p className="mt-4 text-lg font-bold text-cyan-300">
                  👀 Dévoilement prochainement.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to="/tournoi"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-6 py-3.5 font-black text-slate-950"
                  >
                    Découvrir l’annonce
                    <ArrowRight className="h-5 w-5" />
                  </Link>

                  <Link
                    to="/galerie"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-3.5 font-black"
                  >
                    Revoir le tournoi 2026
                    <Images className="h-5 w-5" />
                  </Link>
                </div>
              </div>

              <div className="relative min-h-[360px] overflow-hidden border-t border-white/10 lg:border-l lg:border-t-0">
                <img
                  src="/galerie/galerie-01.jpg"
                  alt="Tournoi LVPSA 2026"
                  className="absolute inset-0 h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-l from-slate-950/20 to-slate-950/80" />
              </div>
            </div>
          </motion.div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-5 px-5 py-10 lg:grid-cols-2 lg:px-8">
          <motion.div {...reveal}>
            <Link
              to="/boutique-v2"
              className="group block min-h-[340px] rounded-3xl bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-400 p-8 text-slate-950"
            >
              <ShoppingBag className="h-12 w-12" />

              <p className="mt-10 text-sm font-black uppercase">
                Boutique officielle
              </p>

              <h2 className="mt-3 text-4xl font-black">
                Affichez fièrement vos couleurs.
              </h2>

              <p className="mt-4 max-w-md font-medium text-slate-800">
                Découvrez les vêtements officiels LVPSA.
              </p>

              <span className="mt-10 inline-flex items-center gap-2 font-black">
                Visiter la boutique
                <ArrowRight className="h-5 w-5" />
              </span>
            </Link>
          </motion.div>

          <motion.div {...reveal}>
            <Link
              to="/classements"
              className="group block min-h-[340px] rounded-3xl bg-gradient-to-br from-blue-700 via-cyan-700 to-slate-900 p-8"
            >
              <Trophy className="h-12 w-12 text-yellow-300" />

              <p className="mt-10 text-sm font-black uppercase text-cyan-200">
                Classements
              </p>

              <h2 className="mt-3 text-4xl font-black">
                Suivez l’évolution des équipes.
              </h2>

              <p className="mt-4 max-w-md text-slate-200">
                Consultez les résultats officiels.
              </p>

              <span className="mt-10 inline-flex items-center gap-2 font-black">
                Voir les classements
                <ArrowRight className="h-5 w-5" />
              </span>
            </Link>
          </motion.div>
        </section>

        <section className="mx-auto max-w-7xl px-5 pb-24 pt-10 lg:px-8">
          <motion.div
            {...reveal}
            className="rounded-3xl border border-white/10 bg-white/[0.03] p-8"
          >
            <div className="text-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
                Merci à nos partenaires
              </p>

              <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-black">
                Leur soutien fait grandir le volleyball dans notre région.
              </h2>
            </div>

            <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {partenaires.map(([nom, logo]) => (
                <Link
                  key={nom}
                  to="/partenaires"
                  className="flex min-h-32 items-center justify-center rounded-2xl border border-white/10 bg-white p-5 transition hover:-translate-y-1"
                >
                  <img
                    src={logo}
                    alt={nom}
                    className="max-h-20 w-full object-contain"
                  />
                </Link>
              ))}
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
