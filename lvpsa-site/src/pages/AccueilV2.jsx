import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Images,
  MapPin,
  ShoppingBag,
  Sparkles,
  Trophy,
} from "lucide-react";
import { Link } from "react-router-dom";

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

export default function AccueilV2() {
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
      <div className="h-32" />

      <main className="relative z-10">
        {/* FIN DE SAISON + CHAMPIONS */}
        <section className="mx-auto max-w-7xl px-5 py-6 lg:px-8">
          <motion.div
            {...reveal}
            className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]"
          >
            {/* MERCI POUR LA SAISON */}
            <div className="relative overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-gradient-to-br from-cyan-300/10 via-slate-900 to-slate-950 p-7 sm:p-9">
              <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-cyan-300/10 blur-3xl" />

              <div className="relative flex h-full flex-col">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
                  Saison 2026 terminée
                </div>

                <h2 className="mt-6 text-3xl font-black text-white sm:text-4xl">
                  Quelle première saison! 🏐
                </h2>

                <p className="mt-5 text-base leading-7 text-slate-300">
                  La toute première saison de la LVPSA est maintenant derrière
                  nous et nous pouvons être fiers de ce que nous avons construit
                  ensemble.
                </p>

                <p className="mt-4 text-base leading-7 text-slate-300">
                  Merci aux joueurs, capitaines, bénévoles, partenaires,
                  familles et spectateurs qui ont contribué à faire vivre la
                  ligue tout au long de l’été.
                </p>

                <div className="mt-auto pt-8">
                  <div className="border-t border-white/10 pt-6">
                    <p className="font-black text-white">
                      Merci de faire partie de la communauté LVPSA. 💙💛
                    </p>

                    <p className="mt-2 text-sm text-white/50">
                      On se retrouve en 2027 pour une nouvelle saison encore
                      plus grande!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CHAMPIONS */}
            <div className="relative overflow-hidden rounded-[2rem] border border-yellow-300/20 bg-gradient-to-br from-yellow-300/10 via-slate-900 to-slate-950 p-6 sm:p-8">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-yellow-300/10 blur-3xl" />

              <div className="relative">
                <div className="flex items-center gap-3 text-yellow-300">
                  <Trophy className="h-6 w-6" />

                  <p className="text-sm font-black uppercase tracking-[0.18em]">
                    Champions des séries 2026
                  </p>
                </div>

                <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl">
                  Félicitations à nos champions!
                </h2>

                <div className="mt-7 grid gap-5 sm:grid-cols-2">
                  {/* LES SMASH */}
                  <div className="group overflow-hidden rounded-2xl border border-cyan-300/20 bg-slate-950/60">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src="/ligue/les-smash.jpg"
                        alt="Les Smash, champions récréatifs LVPSA 2026"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

                      <div className="absolute bottom-4 left-4">
                        <span className="rounded-full border border-cyan-300/30 bg-slate-950/80 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-cyan-300 backdrop-blur">
                          Récréatif
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <p className="text-xs font-black uppercase tracking-[0.15em] text-cyan-300">
                        Champions 2026
                      </p>

                      <h3 className="mt-2 text-2xl font-black text-white">
                        Les Smash
                      </h3>

                      <p className="mt-2 text-sm text-white/50">
                        Champions des séries — catégorie récréative
                      </p>
                    </div>
                  </div>

                  {/* CRABES EN BIKINI */}
                  <div className="group overflow-hidden rounded-2xl border border-yellow-300/20 bg-slate-950/60">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src="/ligue/crabes-en-bikini.jpg"
                        alt="Les Crabes en bikini, champions compétitifs LVPSA 2026"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

                      <div className="absolute bottom-4 left-4">
                        <span className="rounded-full border border-yellow-300/30 bg-slate-950/80 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-yellow-300 backdrop-blur">
                          Compétitif
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <p className="text-xs font-black uppercase tracking-[0.15em] text-yellow-300">
                        Champions 2026
                      </p>

                      <h3 className="mt-2 text-2xl font-black text-white">
                        Les Crabes en bikini
                      </h3>

                      <p className="mt-2 text-sm text-white/50">
                        Champions des séries — catégorie compétitive
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to="/series"
                    className="inline-flex items-center gap-2 rounded-xl bg-yellow-300 px-5 py-3 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-yellow-200"
                  >
                    Voir les résultats des séries
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    to="/ligue/galerie"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-black text-white transition hover:border-cyan-300/30 hover:bg-white/10"
                  >
                    Voir les photos
                    <Images className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* HERO */}
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
                Jouez, suivez vos résultats, restez connecté à votre équipe et
                vivez pleinement l’expérience LVPSA.
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
                  to="/classements"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-slate-950/50 px-6 py-3.5 font-bold transition hover:border-cyan-300/40"
                >
                  Voir les résultats 2026
                  <Trophy className="h-5 w-5" />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* PROCHAIN ÉVÉNEMENT */}
        <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
          <motion.div
            {...reveal}
            className="overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-gradient-to-br from-cyan-400/10 via-slate-900 to-yellow-300/10"
          >
            <div className="grid items-center lg:grid-cols-[1.1fr_0.9fr]">
              <div className="p-7 sm:p-10 lg:p-12">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-black uppercase tracking-[0.16em] text-cyan-300">
                  <Sparkles className="h-4 w-4" />
                  À venir
                </div>

                <h2 className="mt-6 text-4xl font-black sm:text-5xl">
                  Une nouvelle expérience LVPSA prend forme...
                </h2>

                <p className="mt-6 text-lg leading-8 text-slate-300">
                  La saison et le tournoi 2026 sont maintenant derrière nous,
                  mais de nouvelles idées sont déjà en préparation pour faire
                  grandir la communauté LVPSA.
                </p>

                <p className="mt-4 text-lg font-bold text-cyan-300">
                  👀 Restez à l’affût.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to="/tournoi"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-6 py-3.5 font-black text-slate-950"
                  >
                    Découvrir le tournoi
                    <ArrowRight className="h-5 w-5" />
                  </Link>

                  <Link
                    to="/galerie"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-3.5 font-black"
                  >
                    Revoir la saison 2026
                    <Images className="h-5 w-5" />
                  </Link>
                </div>
              </div>

              <div className="relative min-h-[360px] overflow-hidden border-t border-white/10 lg:border-l lg:border-t-0">
                <img
                  src="/galerie/galerie-01.jpg"
                  alt="LVPSA 2026"
                  className="absolute inset-0 h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-l from-slate-950/20 to-slate-950/80" />
              </div>
            </div>
          </motion.div>
        </section>

        {/* BOUTIQUE + CLASSEMENTS */}
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
                Saison 2026
              </p>

              <h2 className="mt-3 text-4xl font-black">
                Revivez les résultats de la saison.
              </h2>

              <p className="mt-4 max-w-md text-slate-200">
                Consultez les classements et résultats officiels de la première
                saison de la LVPSA.
              </p>

              <span className="mt-10 inline-flex items-center gap-2 font-black">
                Voir les classements
                <ArrowRight className="h-5 w-5" />
              </span>
            </Link>
          </motion.div>
        </section>

        {/* PARTENAIRES */}
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
              {partenaires.map(([nom, Logo]) => (
                <Link
                  key={nom}
                  to="/partenaires"
                  className="flex min-h-32 items-center justify-center rounded-2xl border border-white/10 bg-white p-5 transition hover:-translate-y-1"
                >
                  <img
                    src={Logo}
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
