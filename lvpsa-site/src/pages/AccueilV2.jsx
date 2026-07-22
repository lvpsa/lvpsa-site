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

const actionsRapides = [
  {
    titre: "Calendrier",
    texte: "Consulter les matchs",
    icone: CalendarDays,
    lien: "/ligue/calendrier",
  },
  {
    titre: "Classements",
    texte: "Voir les résultats",
    icone: Trophy,
    lien: "/ligue/classements",
  },
  {
    titre: "Mon équipe",
    texte: "Accéder à mon espace",
    icone: UsersRound,
    lien: "/connexion",
  },
  {
    titre: "Boutique",
    texte: "Découvrir les vêtements",
    icone: ShoppingBag,
    lien: "/boutique",
  },
];

export default function AccueilV2() {
  return (
    <div className="min-h-screen bg-slate-950 pb-24 text-white lg:pb-0">
      {/* Arrière-plan */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="absolute -left-32 top-24 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -right-32 top-80 h-96 w-96 rounded-full bg-yellow-400/10 blur-3xl" />
      </div>

      {/* En-tête */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/20">
              <Volleyball className="h-6 w-6" />
            </div>

            <div>
              <p className="text-lg font-black leading-none tracking-tight">
                LVPSA
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Volleyball de plage
              </p>
            </div>
          </a>

          <nav className="hidden items-center gap-7 lg:flex">
            <a
              href="/"
              className="text-sm font-semibold text-white transition hover:text-cyan-300"
            >
              Accueil
            </a>
            <a
              href="/ligue"
              className="text-sm font-semibold text-slate-300 transition hover:text-white"
            >
              Ligue
            </a>
            <a
              href="/tournoi"
              className="text-sm font-semibold text-slate-300 transition hover:text-white"
            >
              Tournoi
            </a>
            <a
              href="/boutique"
              className="text-sm font-semibold text-slate-300 transition hover:text-white"
            >
              Boutique
            </a>
          </nav>

          <a
            href="/connexion"
            className="hidden rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-100 lg:inline-flex"
          >
            Connexion
          </a>

          <button
            type="button"
            aria-label="Ouvrir le menu"
            className="rounded-xl border border-white/10 bg-white/5 p-2.5 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-5 pb-10 pt-8 lg:px-8 lg:pb-20 lg:pt-16">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-cyan-500/20 via-slate-900 to-yellow-400/10 p-6 shadow-2xl shadow-black/20 sm:p-10 lg:min-h-[530px] lg:p-14">
            <div
              aria-hidden="true"
              className="absolute right-[-90px] top-[-90px] h-72 w-72 rounded-full border-[45px] border-white/5"
            />

            <div
              aria-hidden="true"
              className="absolute bottom-[-100px] right-[12%] h-64 w-64 rounded-full bg-yellow-300/10 blur-3xl"
            />

            <div className="relative z-10 flex min-h-[430px] max-w-3xl flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-200"
              >
                <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(103,232,249,0.9)]" />
                La communauté de volleyball de Saint-Augustin
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.08 }}
                className="max-w-3xl text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-7xl"
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
                className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg"
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
                <a
                  href="/connexion"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-100"
                >
                  Accéder à mon espace
                  <ArrowRight className="h-5 w-5" />
                </a>

                <a
                  href="/ligue/calendrier"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-3.5 font-bold text-white transition hover:bg-white/10"
                >
                  Voir le calendrier
                  <CalendarDays className="h-5 w-5" />
                </a>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Actions rapides */}
        <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
          <motion.div {...animations}>
            <div className="mb-5 flex items-end justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">
                  Accès rapide
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                  Tout ce dont vous avez besoin
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
              {actionsRapides.map((action) => {
                const Icone = action.icone;

                return (
                  <a
                    key={action.titre}
                    href={action.lien}
                    className="group rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-white/[0.07] sm:p-5"
                  >
                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 transition group-hover:bg-cyan-300 group-hover:text-slate-950">
                      <Icone className="h-5 w-5" />
                    </div>

                    <h3 className="font-extrabold">{action.titre}</h3>
                    <p className="mt-1 text-sm text-slate-400">{action.texte}</p>

                    <ChevronRight className="mt-4 h-5 w-5 text-slate-600 transition group-hover:translate-x-1 group-hover:text-cyan-300" />
                  </a>
                );
              })}
            </div>
          </motion.div>
        </section>

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

                <div className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-yellow-300/10 text-yellow-300 sm:flex">
                  <Volleyball className="h-6 w-6" />
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
                    href="/ligue/calendrier"
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

        {/* Boutique et galerie */}
        <section className="mx-auto grid max-w-7xl gap-5 px-5 py-10 lg:grid-cols-2 lg:px-8">
          <motion.a
            {...animations}
            href="/boutique"
            className="group relative min-h-[360px] overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-400 p-7 text-slate-950 sm:p-9"
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

          <motion.a
            {...animations}
            transition={{ duration: 0.45, delay: 0.08 }}
            href="/galerie"
            className="group relative min-h-[360px] overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-700 via-cyan-700 to-slate-900 p-7 sm:p-9"
          >
            <div
              aria-hidden="true"
              className="absolute bottom-[-55px] right-[-35px] rotate-6 opacity-20"
            >
              <Images className="h-64 w-64" strokeWidth={1.3} />
            </div>

            <div className="relative z-10 flex h-full flex-col">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-950">
                <Images className="h-6 w-6" />
              </div>

              <p className="mt-10 text-sm font-black uppercase tracking-[0.18em] text-cyan-200">
                Galerie LVPSA
              </p>

              <h2 className="mt-3 max-w-md text-3xl font-black leading-tight sm:text-4xl">
                Revivez l’énergie de la communauté.
              </h2>

              <p className="mt-4 max-w-md text-slate-200">
                Matchs, tournois, champions, bénévoles et moments mémorables.
              </p>

              <div className="mt-auto pt-10">
                <span className="inline-flex items-center gap-2 font-black">
                  Voir les photos
                  <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </motion.a>
        </section>

        {/* Partenaires */}
        <section className="mx-auto max-w-7xl px-5 pb-16 pt-10 lg:px-8 lg:pb-24">
          <motion.div
            {...animations}
            className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 text-center sm:p-10"
          >
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
              Merci à nos partenaires
            </p>

            <h2 className="mx-auto mt-4 max-w-2xl text-2xl font-black tracking-tight sm:text-3xl">
              Leur soutien fait grandir le volleyball dans notre région.
            </h2>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {[
                "Desjardins",
                "Applied Industrial Technologies",
                "Canac",
                "Ville de Saint-Augustin",
              ].map((partenaire) => (
                <div
                  key={partenaire}
                  className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-slate-300"
                >
                  {partenaire}
                </div>
              ))}
            </div>
          </motion.div>
        </section>
      </main>

      {/* Navigation mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-slate-950/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-5">
          <a
            href="/"
            className="flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-cyan-300"
          >
            <Home className="h-5 w-5" />
            <span className="text-[10px] font-bold">Accueil</span>
          </a>

          <a
            href="/ligue/calendrier"
            className="flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-slate-400"
          >
            <CalendarDays className="h-5 w-5" />
            <span className="text-[10px] font-semibold">Matchs</span>
          </a>

          <a
            href="/boutique"
            className="flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-slate-400"
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="text-[10px] font-semibold">Boutique</span>
          </a>

          <a
            href="/connexion"
            className="flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-slate-400"
          >
            <UserRound className="h-5 w-5" />
            <span className="text-[10px] font-semibold">Compte</span>
          </a>

          <a
            href="/"
            className="flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-slate-400"
          >
            <Menu className="h-5 w-5" />
            <span className="text-[10px] font-semibold">Plus</span>
          </a>
        </div>
      </nav>
    </div>
  );
}
