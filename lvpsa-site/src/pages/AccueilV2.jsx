import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CloudSun,
  Home,
  Images,
  MapPin,
  Menu,
  MessageCircle,
  Shirt,
  ShoppingBag,
  Trophy,
  UserRound,
  UsersRound,
  Volleyball,
} from "lucide-react";
import HeroLVPSA from "../components/HeroLVPSA";
import GalerieLVPSA from "../components/GalerieLVPSA";
import StatsLVPSA from "../components/StatsLVPSA";
import HeaderLVPSA from "../components/HeaderLVPSA";
import ActionsLVPSA from "../components/ActionsLVPSA";
import PourquoiLVPSA from "../components/PourquoiLVPSA";
import PartenairesLVPSA from "../components/PartenairesLVPSA";
import FooterLVPSA from "../components/FooterLVPSA";

const animations = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.45 },
};

const nouvelles = [
  {
    categorie: "Ligue",
    titre: "Bienvenue dans la nouvelle expérience LVPSA",
    texte:
      "Une plateforme plus simple, plus rapide et entièrement pensée pour les joueurs.",
  },
  {
    categorie: "Tournoi",
    titre: "Revivez les meilleurs moments du tournoi",
    texte:
      "Découvrez prochainement les photos, les résultats et les moments marquants.",
  },
  {
    categorie: "Boutique",
    titre: "Portez fièrement les couleurs de la ligue",
    texte:
      "Les vêtements officiels LVPSA sont disponibles en quantités limitées.",
  },
];

export default function AccueilV2() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Arrière-plan */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="absolute -left-32 top-24 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -right-32 top-80 h-96 w-96 rounded-full bg-yellow-400/10 blur-3xl" />
      </div>

      <HeaderLVPSA />

      <main className="relative z-10">

        <HeroLVPSA />

          {/* Statistiques */}
        <StatsLVPSA />

       {/* Accès principaux */}
        <ActionsLVPSA />

        {/* Informations principales */}
        <section className="mx-auto grid max-w-7xl gap-5 px-5 py-8 lg:grid-cols-3 lg:px-8">
          <motion.article
            {...animations}
            className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] lg:col-span-2"
          >
            <div className="border-b border-white/10 p-5 sm:p-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-yellow-300">
                    Prochain rendez-vous
                  </p>
                  <h2 className="mt-2 text-2xl font-black">Vos matchs LVPSA</h2>
                </div>

                <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full">
                  <img
                    src="/logo.jpg"
                    alt="Logo LVPSA"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-7">
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <CalendarDays className="h-4 w-4" />
                      Calendrier de la ligue
                    </div>

                    <h3 className="mt-3 text-xl font-black">
                      Consultez vos prochains matchs
                    </h3>

                    <div className="mt-3 flex items-center gap-2 text-sm text-slate-400">
                      <MapPin className="h-4 w-4" />
                      Parc Portneuf, Saint-Augustin-de-Desmaures
                    </div>
                  </div>

                  <a
                    href="/calendrier"
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-yellow-300 px-5 py-3 font-bold text-slate-950 transition hover:bg-yellow-200"
                  >
                    Voir l’horaire
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </motion.article>

          <motion.article
            {...animations}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="rounded-3xl border border-emerald-300/20 bg-gradient-to-br from-emerald-400/15 to-white/[0.04] p-6 sm:p-7"
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-300/15 text-emerald-300">
                  <CheckCircle2 className="h-6 w-6" />
                </div>

                <span className="rounded-full bg-emerald-300/15 px-3 py-1 text-xs font-bold text-emerald-200">
                  Information
                </span>
              </div>

              <div className="mt-8">
                <p className="text-sm font-semibold text-emerald-200">
                  Statut des activités
                </p>
                <h2 className="mt-2 text-2xl font-black">
                  Vérifiez le statut avant de vous déplacer
                </h2>
                <p className="mt-4 leading-6 text-slate-300">
                  Les mises à jour liées à la météo et aux terrains sont
                  publiées directement sur la plateforme.
                </p>
              </div>

              <a
                href="/"
                className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-emerald-200"
              >
                Consulter les mises à jour
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </motion.article>
        </section>

        {/* Expérience LVPSA */}
        <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
          <motion.div
            {...animations}
            className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-blue-600/25 via-cyan-500/15 to-transparent"
          >
            <div className="grid lg:grid-cols-2">
              <div className="p-7 sm:p-10 lg:p-12">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">
                  Expérience membre
                </p>

                <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                  Votre ligue dans votre poche
                </h2>

                <p className="mt-5 max-w-xl leading-7 text-slate-300">
                  Retrouvez votre calendrier, votre équipe, les classements,
                  les remplacements et les communications importantes dans un
                  seul espace.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="flex gap-3">
                    <UsersRound className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" />
                    <div>
                      <p className="font-bold">Gestion d’équipe</p>
                      <p className="mt-1 text-sm text-slate-400">
                        Joueurs, capitaines et remplaçants.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" />
                    <div>
                      <p className="font-bold">Communications</p>
                      <p className="mt-1 text-sm text-slate-400">
                        Les informations importantes au bon moment.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <CloudSun className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" />
                    <div>
                      <p className="font-bold">Météo et terrains</p>
                      <p className="mt-1 text-sm text-slate-400">
                        Un statut clair avant chaque soirée.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Trophy className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" />
                    <div>
                      <p className="font-bold">Résultats en direct</p>
                      <p className="mt-1 text-sm text-slate-400">
                        Classements et résultats centralisés.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex min-h-[330px] items-center justify-center border-t border-white/10 bg-slate-900/40 p-8 lg:border-l lg:border-t-0">
                <div className="relative w-full max-w-sm rounded-[2rem] border border-white/10 bg-slate-950 p-4 shadow-2xl">
                  <div className="mx-auto mb-5 h-1.5 w-16 rounded-full bg-white/15" />

                  <div className="rounded-3xl bg-gradient-to-br from-cyan-400 to-blue-700 p-5">
                    <p className="text-sm font-semibold text-cyan-50">
                      Bon retour 👋
                    </p>
                    <h3 className="mt-2 text-2xl font-black">Mon espace LVPSA</h3>
                    <p className="mt-2 text-sm text-cyan-50/80">
                      Tout pour votre prochaine soirée de volleyball.
                    </p>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-white/[0.06] p-4">
                      <CalendarDays className="h-5 w-5 text-yellow-300" />
                      <p className="mt-5 text-sm font-bold">Mes matchs</p>
                    </div>

                    <div className="rounded-2xl bg-white/[0.06] p-4">
                      <UsersRound className="h-5 w-5 text-cyan-300" />
                      <p className="mt-5 text-sm font-bold">Mon équipe</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Nouvelles */}
        <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
          <motion.div {...animations}>
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-yellow-300">
                  Actualités
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                  Quoi de neuf à la LVPSA?
                </h2>
              </div>

              <a
                href="/"
                className="hidden items-center gap-1 text-sm font-bold text-slate-300 hover:text-white sm:inline-flex"
              >
                Tout voir
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {nouvelles.map((nouvelle, index) => (
                <article
                  key={nouvelle.titre}
                  className="group rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-1 hover:bg-white/[0.07]"
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-slate-300">
                      {nouvelle.categorie}
                    </span>

                    <span className="text-xs font-bold text-slate-600">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="mt-7 text-xl font-black leading-snug">
                    {nouvelle.titre}
                  </h3>

                  <p className="mt-3 leading-6 text-slate-400">
                    {nouvelle.texte}
                  </p>

                  <ChevronRight className="mt-8 h-5 w-5 text-slate-600 transition group-hover:translate-x-1 group-hover:text-cyan-300" />
                </article>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Boutique*/}
        <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
          <motion.a
            {...animations}
            href="/boutique"
            className="group relative block min-h-[360px] overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-400 p-7 text-slate-950 sm:p-9"
          >
            <div
              aria-hidden="true"
              className="absolute -bottom-16 -right-12 rotate-[-12deg] opacity-20"
            >
              <Shirt className="h-64 w-64" strokeWidth={1.3} />
            </div>

            <div className="relative z-10 flex h-full flex-col">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                <ShoppingBag className="h-6 w-6" />
              </div>

              <p className="mt-10 text-sm font-black uppercase tracking-[0.18em]">
                Boutique officielle
              </p>

              <h2 className="mt-3 max-w-md text-3xl font-black leading-tight sm:text-4xl">
                Affichez fièrement vos couleurs.
              </h2>

              <p className="mt-4 max-w-md font-medium text-slate-800">
                Découvrez les vêtements officiels LVPSA pour joueurs,
                supporters et passionnés.
              </p>

              <div className="mt-auto pt-10">
                <span className="inline-flex items-center gap-2 font-black">
                  Visiter la boutique
                  <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </motion.a>

        </section>

        {/* Galerie immersive */}
        <GalerieLVPSA />

        {/* Pourquoi la LVPSA */}
        <PourquoiLVPSA />

        {/* Partenaires */}
        <PartenairesLVPSA />

        {/* Footer LVPSA */}
        <FooterLVPSA />
        
      </main>
    </div>
  );
}
