import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  ChevronRight,
  Home,
  Images,
  Menu,
  ShoppingBag,
  Sparkles,
  Trophy,
  UserRound,
  UsersRound,
} from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const reveal = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.5 },
};

const actions = [
  { titre: "Calendrier", texte: "Consulter les matchs", icone: CalendarDays, lien: "/calendrier" },
  { titre: "Classements", texte: "Voir les résultats", icone: Trophy, lien: "/classements" },
  { titre: "Mon espace", texte: "Équipe, profil et commandes", icone: UsersRound, lien: "/mon-espace" },
  { titre: "Boutique", texte: "Découvrir les vêtements", icone: ShoppingBag, lien: "/boutique" },
];

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

export default function AccueilV2() {
  const [menuOuvert, setMenuOuvert] = useState(false);
  const [stats, setStats] = useState({
    equipes: 8,
    joueurs: "—",
    categories: 2,
    partenaires: partenaires.length,
  });

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
          if (!equipesUniques.has(cle)) equipesUniques.set(cle, true);
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

    chargerStats();

    return () => {
      actif = false;
    };
  }, []);

  const statsAffichees = useMemo(
    () => [
      ["Équipes", stats.equipes, UsersRound],
      ["Joueurs", stats.joueurs, UserRound],
      ["Catégories", stats.categories, Trophy],
      ["Partenaires", stats.partenaires, Sparkles],
    ],
    [stats]
  );

  return (
    <div className="min-h-screen bg-slate-950 pb-24 text-white lg:pb-0">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 top-24 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -right-32 top-80 h-96 w-96 rounded-full bg-yellow-400/10 blur-3xl" />
      </div>

      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <a href="/" className="flex items-center gap-3">
            <div className="h-14 w-14 overflow-hidden rounded-full">
              <img src="/logo.jpg" alt="Logo LVPSA" className="h-full w-full scale-110 object-cover" />
            </div>

            <div>
              <p className="text-lg font-black leading-none">LVPSA</p>
              <p className="mt-1 text-xs text-slate-400">Volleyball de plage</p>
            </div>
          </a>

          <nav className="hidden items-center gap-7 lg:flex">
            {[
              ["Accueil", "/"],
              ["Ligue", "/ligue"],
              ["Tournoi", "/tournoi"],
              ["Boutique", "/boutique"],
              ["Partenaires", "/partenaires"],
            ].map(([label, lien]) => (
              <a
                key={lien}
                href={lien}
                className="text-sm font-semibold text-slate-300 transition hover:text-white"
              >
                {label}
              </a>
            ))}
          </nav>

          <a href="/connexion" className="hidden rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-slate-950 lg:inline-flex">
            Connexion
          </a>

          <button
            type="button"
            onClick={() => setMenuOuvert((valeur) => !valeur)}
            aria-label="Ouvrir le menu"
            className="rounded-xl border border-white/10 bg-white/5 p-2.5 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {menuOuvert && (
          <div className="border-t border-white/10 px-5 py-5 lg:hidden">
            <div className="flex flex-col gap-4 font-bold">
              <a href="/">Accueil</a>
              <a href="/ligue">Ligue</a>
              <a href="/tournoi">Tournoi</a>
              <a href="/boutique">Boutique</a>
              <a href="/partenaires">Partenaires</a>
              <a href="/connexion" className="rounded-xl bg-cyan-300 px-5 py-3 text-center text-slate-950">
                Connexion
              </a>
            </div>
          </div>
        )}
      </header>

      <main className="relative z-10">
        <section className="mx-auto max-w-7xl px-5 pb-12 pt-8 lg:px-8 lg:pb-20 lg:pt-16">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900 shadow-2xl lg:min-h-[620px]">
            <img src="/volley-bg.jpg" alt="Terrain LVPSA" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/30" />

            <div className="relative z-10 flex min-h-[620px] max-w-3xl flex-col justify-center p-6 sm:p-10 lg:p-14">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-cyan-300/20 bg-slate-950/60 px-4 py-2 text-sm font-semibold text-cyan-200 backdrop-blur-xl"
              >
                <span className="h-2 w-2 rounded-full bg-cyan-300" />
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
                Jouez, suivez vos résultats, restez connecté à votre équipe et vivez pleinement l’expérience LVPSA.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.24 }}
                className="mt-8 flex flex-col gap-3 sm:flex-row"
              >
                <a href="/mon-espace" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 font-bold text-slate-950">
                  Accéder à mon espace
                  <ArrowRight className="h-5 w-5" />
                </a>

                <a href="/calendrier" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-slate-950/50 px-6 py-3.5 font-bold">
                  Voir le calendrier
                  <CalendarDays className="h-5 w-5" />
                </a>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
          <motion.div {...reveal}>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">La LVPSA en chiffres</p>
            <h2 className="mt-2 text-3xl font-black">Une ligue locale qui rassemble</h2>

            <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {statsAffichees.map(([libelle, valeur, Icone]) => (
                <div key={libelle} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                  <Icone className="h-6 w-6 text-cyan-300" />
                  <p className="mt-6 text-4xl font-black">{valeur}</p>
                  <p className="mt-1 text-sm font-bold uppercase text-slate-400">{libelle}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
          <motion.div {...reveal}>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-yellow-300">Accès rapide</p>
            <h2 className="mt-2 text-3xl font-black">Tout ce dont vous avez besoin</h2>

            <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {actions.map((action) => {
                const Icone = action.icone;

                return (
                  <a key={action.titre} href={action.lien} className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:-translate-y-1 hover:border-cyan-300/30">
                    <Icone className="h-6 w-6 text-cyan-300" />
                    <h3 className="mt-5 font-extrabold">{action.titre}</h3>
                    <p className="mt-1 text-sm text-slate-400">{action.texte}</p>
                    <ChevronRight className="mt-4 h-5 w-5 text-slate-600 transition group-hover:translate-x-1 group-hover:text-cyan-300" />
                  </a>
                );
              })}
            </div>
          </motion.div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
          <motion.div {...reveal} className="overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-gradient-to-br from-cyan-400/10 via-slate-900 to-yellow-300/10">
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
                  Le tournoi 2026 est maintenant derrière nous, mais une nouvelle expérience LVPSA, distincte de la saison régulière, est déjà en préparation.
                </p>

                <p className="mt-4 text-lg font-bold text-cyan-300">👀 Dévoilement prochainement.</p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a href="/tournoi" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-6 py-3.5 font-black text-slate-950">
                    Découvrir l’annonce
                    <ArrowRight className="h-5 w-5" />
                  </a>

                  <a href="/galerie" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-3.5 font-black">
                    Revoir le tournoi 2026
                    <Images className="h-5 w-5" />
                  </a>
                </div>
              </div>

              <div className="relative min-h-[360px] overflow-hidden border-t border-white/10 lg:border-l lg:border-t-0">
                <img src="/galerie/galerie-01.jpg" alt="Tournoi LVPSA 2026" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-l from-slate-950/20 to-slate-950/80" />
              </div>
            </div>
          </motion.div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
          <motion.div {...reveal}>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-fuchsia-300">Galerie</p>
                <h2 className="mt-2 text-4xl font-black">L’énergie de la LVPSA en images</h2>
              </div>

              <a href="/galerie" className="inline-flex items-center gap-2 font-black text-cyan-300">
                Voir toute la galerie
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <a href="/galerie" className="group relative min-h-[420px] overflow-hidden rounded-3xl border border-white/10">
                <img src="/galerie/galerie-01.jpg" alt="Galerie LVPSA" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              </a>

              <div className="grid gap-4">
                <a href="/galerie" className="group relative min-h-[200px] overflow-hidden rounded-3xl border border-white/10">
                  <img src="/volley-bg.jpg" alt="Terrain LVPSA" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                </a>

                <a href="/galerie" className="group relative min-h-[200px] overflow-hidden rounded-3xl border border-white/10 bg-white">
                  <img src="/tournoi-lvpsa-2026.png" alt="Tournoi LVPSA" className="h-full w-full object-contain transition duration-700 group-hover:scale-105" />
                </a>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-5 px-5 py-10 lg:grid-cols-2 lg:px-8">
          <motion.a {...reveal} href="/boutique" className="group min-h-[340px] rounded-3xl bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-400 p-8 text-slate-950">
            <ShoppingBag className="h-12 w-12" />
            <p className="mt-10 text-sm font-black uppercase">Boutique officielle</p>
            <h2 className="mt-3 text-4xl font-black">Affichez fièrement vos couleurs.</h2>
            <p className="mt-4 max-w-md font-medium text-slate-800">Découvrez les vêtements officiels LVPSA.</p>
            <span className="mt-10 inline-flex items-center gap-2 font-black">Visiter la boutique <ArrowRight className="h-5 w-5" /></span>
          </motion.a>

          <motion.a {...reveal} href="/classements" className="group min-h-[340px] rounded-3xl bg-gradient-to-br from-blue-700 via-cyan-700 to-slate-900 p-8">
            <Trophy className="h-12 w-12 text-yellow-300" />
            <p className="mt-10 text-sm font-black uppercase text-cyan-200">Classements</p>
            <h2 className="mt-3 text-4xl font-black">Suivez l’évolution des équipes.</h2>
            <p className="mt-4 max-w-md text-slate-200">Consultez les résultats officiels.</p>
            <span className="mt-10 inline-flex items-center gap-2 font-black">Voir les classements <ArrowRight className="h-5 w-5" /></span>
          </motion.a>
        </section>

        <section className="mx-auto max-w-7xl px-5 pb-24 pt-10 lg:px-8">
          <motion.div {...reveal} className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
            <div className="text-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">Merci à nos partenaires</p>
              <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-black">Leur soutien fait grandir le volleyball dans notre région.</h2>
            </div>

            <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {partenaires.map(([nom, logo]) => (
                <a key={nom} href="/partenaires" className="flex min-h-32 items-center justify-center rounded-2xl border border-white/10 bg-white p-5">
                  <img src={logo} alt={nom} className="max-h-20 w-full object-contain" />
                </a>
              ))}
            </div>
          </motion.div>
        </section>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-slate-950/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-5">
          {[
            ["Accueil", "/", Home],
            ["Matchs", "/calendrier", CalendarDays],
            ["Boutique", "/boutique", ShoppingBag],
            ["Compte", "/mon-espace", UserRound],
          ].map(([label, lien, Icone]) => (
            <a key={lien} href={lien} className="flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-slate-400">
              <Icone className="h-5 w-5" />
              <span className="text-[10px] font-semibold">{label}</span>
            </a>
          ))}

          <button type="button" onClick={() => setMenuOuvert((valeur) => !valeur)} className="flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-slate-400">
            <Menu className="h-5 w-5" />
            <span className="text-[10px] font-semibold">Plus</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
