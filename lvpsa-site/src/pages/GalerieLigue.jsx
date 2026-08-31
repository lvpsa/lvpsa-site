import { Camera, Images, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function GalerieLigue() {
  return (
    <main className="min-h-screen bg-slate-950 px-5 py-10 text-white lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="relative overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-gradient-to-br from-cyan-300/10 via-slate-900 to-yellow-300/10 p-7 sm:p-10 lg:p-14">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-cyan-300/10 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-yellow-300/10 blur-3xl" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
              <Images className="h-4 w-4" />
              Galerie de la ligue
            </div>

            <h1 className="mt-6 text-4xl font-black sm:text-5xl lg:text-6xl">
              La saison LVPSA
              <span className="block bg-gradient-to-r from-cyan-300 via-white to-yellow-300 bg-clip-text text-transparent">
                en images.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              Retrouvez prochainement les meilleurs moments de la saison,
              les équipes, les séries et tout ce qui a fait vivre la
              communauté LVPSA.
            </p>
          </div>
        </section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8 flex min-h-[420px] items-center justify-center rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 text-center"
        >
          <div className="max-w-xl">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-300/10">
              <Camera className="h-9 w-9 text-cyan-300" />
            </div>

            <div className="mt-6 inline-flex items-center gap-2 text-yellow-300">
              <Sparkles className="h-4 w-4" />
              <p className="text-xs font-black uppercase tracking-[0.18em]">
                Saison 2026
              </p>
            </div>

            <h2 className="mt-4 text-3xl font-black">
              Photos à venir
            </h2>

            <p className="mt-4 leading-7 text-slate-400">
              Nous préparons actuellement la galerie officielle de la
              première saison de la LVPSA. Revenez bientôt pour revivre
              tous les meilleurs moments!
            </p>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
