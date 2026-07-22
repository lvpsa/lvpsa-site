import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Images,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { photosGalerie2026 } from "../data/photosGalerie2026";

export default function Galerie() {
  const [photoActive, setPhotoActive] = useState(null);

  const ouvrirPhoto = (index) => {
    setPhotoActive(index);
  };

  const fermerPhoto = () => {
    setPhotoActive(null);
  };

  const photoPrecedente = () => {
    setPhotoActive((indexActuel) =>
      indexActuel === 0
        ? photosGalerie2026.length - 1
        : indexActuel - 1
    );
  };

  const photoSuivante = () => {
    setPhotoActive((indexActuel) =>
      indexActuel === photosGalerie2026.length - 1
        ? 0
        : indexActuel + 1
    );
  };

  useEffect(() => {
    const gererClavier = (event) => {
      if (photoActive === null) return;

      if (event.key === "Escape") {
        fermerPhoto();
      }

      if (event.key === "ArrowLeft") {
        photoPrecedente();
      }

      if (event.key === "ArrowRight") {
        photoSuivante();
      }
    };

    window.addEventListener("keydown", gererClavier);

    return () => {
      window.removeEventListener("keydown", gererClavier);
    };
  }, [photoActive]);

  useEffect(() => {
    document.body.style.overflow =
      photoActive !== null ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [photoActive]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* En-tête de la page */}
      <section className="relative overflow-hidden border-b border-white/10 px-5 pb-14 pt-28 lg:px-8 lg:pb-20 lg:pt-36">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[url('/hero-lvpsa.jpg')] bg-cover bg-center opacity-20"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/90 to-slate-950" />

        <div className="relative mx-auto max-w-7xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-cyan-300 transition hover:text-cyan-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à l’accueil
          </Link>

          <div className="mt-8 flex items-center gap-3 text-fuchsia-300">
            <Images className="h-6 w-6" />

            <p className="text-sm font-black uppercase tracking-[0.2em]">
              Galerie officielle
            </p>
          </div>

          <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl lg:text-7xl">
            Tournoi LVPSA 2026
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Revivez les matchs, les équipes, les bénévoles, les partenaires et
            tous les moments qui ont rendu cette journée exceptionnelle.
          </p>

          <div className="mt-8 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-slate-300">
            {photosGalerie2026.length} photos
          </div>
        </div>
      </section>

      {/* Galerie */}
      <main className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-20">
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {photosGalerie2026.map((photo, index) => (
            <motion.button
              key={photo.src}
              type="button"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{
                duration: 0.45,
                delay: Math.min((index % 6) * 0.05, 0.25),
              }}
              onClick={() => ouvrirPhoto(index)}
              className="group relative mb-4 block w-full break-inside-avoid overflow-hidden rounded-3xl border border-white/10 bg-slate-900 text-left"
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                className="h-auto w-full transition duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-70 transition group-hover:opacity-100" />

              <div className="absolute inset-x-0 bottom-0 translate-y-3 p-5 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
                  LVPSA 2026
                </p>

                <p className="mt-1 font-bold text-white">
                  {photo.alt}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {photoActive !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 p-4 backdrop-blur-xl"
            onClick={fermerPhoto}
          >
            <button
              type="button"
              aria-label="Fermer la photo"
              onClick={fermerPhoto}
              className="absolute right-4 top-4 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/10 transition hover:bg-white/20"
            >
              <X className="h-6 w-6" />
            </button>

            <button
              type="button"
              aria-label="Photo précédente"
              onClick={(event) => {
                event.stopPropagation();
                photoPrecedente();
              }}
              className="absolute left-3 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/10 transition hover:bg-white/20 sm:left-6"
            >
              <ChevronLeft className="h-7 w-7" />
            </button>

            <motion.div
              key={photosGalerie2026[photoActive].src}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.25 }}
              onClick={(event) => event.stopPropagation()}
              className="relative flex max-h-[90vh] max-w-6xl flex-col items-center"
            >
              <img
                src={photosGalerie2026[photoActive].src}
                alt={photosGalerie2026[photoActive].alt}
                className="max-h-[78vh] max-w-full rounded-2xl object-contain shadow-2xl"
              />

              <div className="mt-4 text-center">
                <p className="font-bold">
                  {photosGalerie2026[photoActive].alt}
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Photo {photoActive + 1} sur {photosGalerie2026.length}
                </p>
              </div>
            </motion.div>

            <button
              type="button"
              aria-label="Photo suivante"
              onClick={(event) => {
                event.stopPropagation();
                photoSuivante();
              }}
              className="absolute right-3 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/10 transition hover:bg-white/20 sm:right-6"
            >
              <ChevronRight className="h-7 w-7" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
