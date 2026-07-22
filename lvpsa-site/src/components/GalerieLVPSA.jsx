import { motion } from "framer-motion";
import { ArrowRight, Camera, Images } from "lucide-react";
import { Link } from "react-router-dom";
import { photosGalerie2026 } from "../data/photosGalerie2026";

const photos = photosGalerie2026;

function PhotoGalerie({ photo, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.06, 0.3),
      }}
      className={`group relative min-h-[240px] overflow-hidden rounded-3xl border border-white/10 bg-slate-900 ${photo.format}`}
    >
      <img
        src={photo.src}
        alt={photo.alt}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
        onError={(event) => {
          event.currentTarget.src = "/hero-lvpsa.jpg";
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/5 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
            LVPSA
          </p>

          <p className="mt-1 font-bold text-white">
            {photo.alt}
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-slate-950/45 opacity-0 backdrop-blur-md transition group-hover:opacity-100">
          <Camera className="h-4 w-4" />
        </div>
      </div>
    </motion.article>
  );
}

export default function GalerieLVPSA() {
  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-slate-950 py-16 lg:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-fuchsia-500/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"
        >
          <div>
            <div className="flex items-center gap-2 text-fuchsia-300">
              <Images className="h-5 w-5" />

              <p className="text-sm font-black uppercase tracking-[0.2em]">
                Galerie LVPSA
              </p>
            </div>

            <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Revivez l’énergie de notre communauté.
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-slate-400">
              Des matchs, des tournois, des sourires et tous les moments qui
              font de la LVPSA bien plus qu’une ligue.
            </p>
          </div>

          <Link
            to="/galerie"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl border border-fuchsia-300/30 bg-fuchsia-300/10 px-5 py-3 font-black text-fuchsia-200 transition hover:-translate-y-0.5 hover:bg-fuchsia-300 hover:text-slate-950"
          >
            Voir toutes les photos
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>

        <div className="grid auto-rows-[240px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {photos.slice(0, 6).map((photo, index) => (
            <PhotoGalerie
              key={photo.src}
              photo={photo}
              index={index}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mt-6 rounded-3xl border border-white/10 bg-gradient-to-r from-cyan-400/10 via-white/[0.03] to-yellow-300/10 p-6 sm:flex sm:items-center sm:justify-between sm:gap-6"
        >
          <div>
            <p className="text-lg font-black">
              Vous avez pris des photos pendant nos activités?
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Partagez-les avec la LVPSA et contribuez à faire vivre notre
              communauté.
            </p>
          </div>

          <a
            href="/contact"
            className="mt-5 inline-flex items-center gap-2 font-black text-cyan-300 transition hover:text-cyan-200 sm:mt-0"
          >
            Nous les transmettre
            <ArrowRight className="h-4 w-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
