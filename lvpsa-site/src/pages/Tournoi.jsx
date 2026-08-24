import { ArrowRight, Images, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function Tournoi() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      {/* HERO */}
      <div className="overflow-hidden rounded-[2.5rem] border border-cyan-300/20 bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-950 shadow-2xl">
        <div className="grid items-center lg:grid-cols-[1.1fr_0.9fr]">
          <div className="p-8 sm:p-12 lg:p-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-5 py-2 text-sm font-black uppercase tracking-[0.2em] text-cyan-300">
              <Sparkles className="h-4 w-4" />
              Prochain événement LVPSA
            </div>

            <h1 className="mt-8 text-5xl font-black leading-tight text-white sm:text-6xl">
              Quelque chose de nouveau prend forme...
            </h1>

            <p className="mt-7 max-w-2xl text-xl leading-9 text-slate-300">
              Le tournoi 2026 est maintenant derrière nous, mais une nouvelle
              expérience LVPSA, distincte de la saison régulière, est déjà en
              préparation.
            </p>

            <p className="mt-6 text-xl font-black text-cyan-300">
              👀 Dévoilement prochainement.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/galerie"
                className="inline-flex items-center gap-2 rounded-full bg-cyan-300 px-8 py-4 font-black text-slate-950 transition hover:bg-cyan-200"
              >
                Revivre le tournoi 2026
                <Images className="h-5 w-5" />
              </Link>

              <a
                href="https://www.facebook.com/profile.php?id=61572358300215&locale=fr_CA"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-8 py-4 font-black text-white transition hover:border-cyan-300 hover:text-cyan-300"
              >
                Suivre les annonces
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="relative min-h-[440px] overflow-hidden border-t border-white/10 lg:border-l lg:border-t-0">
            <img
              src="/galerie/galerie-01.jpg"
              alt="Souvenir du tournoi LVPSA 2026"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/20 to-transparent lg:bg-gradient-to-l" />

            <div className="absolute bottom-6 left-6 right-6 rounded-3xl border border-white/10 bg-slate-950/75 p-6 backdrop-blur-xl">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-300">
                Tournoi 2026
              </p>

              <p className="mt-2 text-2xl font-black text-white">
                Merci aux équipes, bénévoles et partenaires.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* VIDÉO SOUVENIR */}
      <div className="mt-20 overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-900 shadow-2xl">
        <div className="grid items-center lg:grid-cols-[0.8fr_1.2fr]">
          <div className="p-8 sm:p-10 lg:p-12">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-cyan-300">
              Souvenir 2026
            </p>

            <h2 className="mt-4 text-4xl font-black leading-tight text-white">
              Revivez notre premier tournoi
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-300">
              Une journée remplie de volleyball, de compétition, de plaisir et
              de beaux souvenirs.
            </p>

            <p className="mt-4 leading-7 text-slate-400">
              Merci à tous les joueurs, bénévoles, partenaires et spectateurs
              qui ont contribué au succès de cette première édition.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="https://youtu.be/4idQfxIaUQo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-cyan-300 px-6 py-3 font-black text-slate-950 transition hover:bg-cyan-200"
              >
                Voir sur YouTube
                <ArrowRight className="h-5 w-5" />
              </a>

              <Link
                to="/galerie"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 font-black text-white transition hover:border-cyan-300 hover:text-cyan-300"
              >
                Voir les photos
                <Images className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div className="bg-black">
            <div className="aspect-video">
              <iframe
                className="h-full w-full"
                src="https://www.youtube.com/embed/4idQfxIaUQo"
                title="Tournoi LVPSA 2026"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>

      {/* INFORMATIONS À VENIR */}
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Link
          to="/tournoi/horaire"
          className="rounded-3xl border border-white/10 bg-white/5 p-8 transition hover:border-cyan-300/40 hover:bg-white/10"
        >
          <p className="text-sm font-black uppercase tracking-wider text-cyan-300">
            Horaire
          </p>

          <h2 className="mt-3 text-3xl font-black text-white">
            Aucun horaire publié
          </h2>

          <p className="mt-4 text-slate-300">
            L’horaire du prochain événement sera affiché dès que les
            informations seront confirmées.
          </p>
        </Link>

        <Link
          to="/tournoi/reglements"
          className="rounded-3xl border border-white/10 bg-white/5 p-8 transition hover:border-cyan-300/40 hover:bg-white/10"
        >
          <p className="text-sm font-black uppercase tracking-wider text-cyan-300">
            Règlements
          </p>

          <h2 className="mt-3 text-3xl font-black text-white">
            Publication à venir
          </h2>

          <p className="mt-4 text-slate-300">
            Les règlements seront disponibles lors de l’annonce officielle du
            prochain événement.
          </p>
        </Link>
      </div>
    </section>
  );
}
