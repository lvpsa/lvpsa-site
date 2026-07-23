import { motion } from "framer-motion";
import { ArrowRight, Handshake } from "lucide-react";
import { Link } from "react-router-dom";

const partenaires = [
  {
    nom: "Desjardins",
    logo: "/partenaires/desjardins.png",
  },
  {
    nom: "Applied Industrial Technologies",
    logo: "/partenaires/applied.png",
  },
  {
    nom: "Canac",
    logo: "/partenaires/canac.png",
  },
  {
    nom: "Ville de Saint-Augustin-de-Desmaures",
    logo: "/partenaires/ville-sad.png",
  },
];

function LogoPartenaire({ partenaire }) {
  const gererErreur = (event) => {
    event.currentTarget.style.display = "none";
    event.currentTarget.nextElementSibling.style.display = "flex";
  };

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className="group flex min-h-[170px] items-center justify-center rounded-3xl border border-white/10 bg-white/[0.04] p-7 transition hover:border-cyan-300/30 hover:bg-white/[0.07]"
    >
      <img
        src={partenaire.logo}
        alt={`Logo ${partenaire.nom}`}
        loading="lazy"
        onError={gererErreur}
        className="max-h-20 max-w-[220px] object-contain brightness-0 invert opacity-75 transition duration-300 group-hover:opacity-100"
      />

      <div className="hidden h-full w-full items-center justify-center text-center">
        <p className="text-lg font-black text-slate-300">
          {partenaire.nom}
        </p>
      </div>
    </motion.article>
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
            Ils croient en notre mission.
          </h2>

          <p className="mt-5 text-base leading-7 text-slate-400 sm:text-lg">
            Grâce à leur soutien, nous pouvons développer le volleyball de
            plage, organiser des activités rassembleuses et offrir une
            expérience de qualité à notre communauté.
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

          <Link
            to="/contact"
            className="mt-5 inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-yellow-300 px-6 py-4 font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-yellow-200 sm:mt-0"
          >
            Devenir partenaire
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
