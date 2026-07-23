import { motion } from "framer-motion";
import { ArrowRight, Handshake } from "lucide-react";
import { Link } from "react-router-dom";

const partenaires = [
  {
    nom: "Soccer Sport Fitness",
    logo: "/soccer-sport-fitness.png",
    lien: "https://www.soccersportfitness.ca/collections/equipement-de-volleyball",
    imageClass: "max-h-28 w-full object-contain",
  },
  {
    nom: "Applied Industrial Technologies",
    logo: "/Applied.png",
    lien: "https://www.appliedcanada.ca",
    imageClass: "max-h-28 w-full object-contain",
  },
  {
    nom: "Canac",
    logo: "/Canac.png",
    lien: "https://www.canac.ca",
    imageClass: "max-h-28 w-full object-contain",
  },
  {
    nom: "Ville de Saint-Augustin-de-Desmaures",
    logo: "/VSAD.png",
    lien: "https://www.vsad.ca",
    imageClass: "max-h-40 w-full object-contain",
  },
  {
    nom: "Desjardins",
    logo: "/Desjardins.png",
    lien: "https://www.desjardins.com",
    imageClass: "max-h-28 w-full object-contain",
  },
];

function LogoPartenaire({ partenaire }) {
  return (
    <motion.a
      href={partenaire.lien}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visiter ${partenaire.nom}`}
      whileHover={{
        y: -8,
        scale: 1.02,
      }}
      transition={{
        duration: 0.25,
      }}
      className="group relative flex min-h-[190px] items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-black p-8 transition"
    >
      {/* Halo lumineux */}
      <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
        <div className="absolute inset-0 bg-cyan-400/5" />
        <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/20 blur-3xl" />
      </div>

      {/* Logo */}
      <img
        src={partenaire.logo}
        alt={partenaire.nom}
        className={`${partenaire.imageClass}
          relative z-10
          transition-all
          duration-500
          group-hover:scale-110`}
      />
    </motion.a>
  );
}

export default function PartenairesLVPSA() {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-16 lg:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-80 w-[80%] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="flex items-center justify-center gap-3 text-cyan-300">
            <Handshake className="h-6 w-6" />

            <p className="text-sm font-black uppercase tracking-[0.2em]">
              Nos partenaires
            </p>
          </div>

          <h2 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
            Ils font grandir le volleyball de plage.
          </h2>

          <p className="mt-5 text-base leading-7 text-slate-400 sm:text-lg">
          Chaque partenaire contribue directement à offrir une ligue de qualité,
          un tournoi rassembleur et à promouvoir l'activité physique dans notre
          région. Nous leur sommes sincèrement reconnaissants de leur confiance.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {partenaires.map((partenaire, index) => (
            <motion.div
              key={partenaire.nom}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.45,
                delay: index * 0.07,
              }}
            >
              <LogoPartenaire partenaire={partenaire} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mt-8 rounded-3xl border border-yellow-300/20 bg-gradient-to-r from-yellow-300/10 via-white/[0.03] to-cyan-300/10 p-6 sm:flex sm:items-center sm:justify-between sm:gap-8 lg:p-8"
        >
          <div>
            <p className="text-xl font-black text-white">
              Vous souhaitez soutenir la LVPSA?
            </p>

            <p className="mt-2 max-w-2xl text-slate-400">
              Associez votre entreprise à une communauté sportive locale,
              active et rassembleuse.
            </p>
          </div>

          <a
            href="mailto:liguevpsa@gmail.com?subject=Partenariat%20LVPSA"
            className="..."
          >
            Joignez-vous à l’aventure
            <ArrowRight className="h-5 w-5" />
          </a>
          
          </motion.div>
      </div>
    </section>
  );
}
