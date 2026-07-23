import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Facebook,
  Mail,
  MapPin,
  Volleyball,
} from "lucide-react";

const liensRapides = [
  { titre: "Accueil", lien: "/" },
  { titre: "Calendrier", lien: "/calendrier" },
  { titre: "Classements", lien: "/classements" },
  { titre: "Tournoi", lien: "/tournoi" },
  { titre: "Boutique", lien: "/boutique" },
  { titre: "Galerie", lien: "/galerie" },
];

const liensMembres = [
  { titre: "Connexion", lien: "/connexion" },
  { titre: "Mon espace", lien: "/mon-espace" },
  { titre: "Inscriptions", lien: "/inscription-ligue" },
  { titre: "Gestion d’équipe", lien: "/gestion-equipe" },
  { titre: "Remplaçants", lien: "/remplacants" },
];
const partenaires = [
  {
    nom: "Soccer Sport Fitness",
    image: "/soccer-sport-fitness.png",
    lien: "https://www.soccersportfitness.ca/collections/equipement-de-volleyball",
  },
  {
    nom: "Applied Industrial Technologies",
    image: "/Applied.png",
    lien: "https://www.appliedcanada.ca",
  },
  {
    nom: "Canac",
    image: "/Canac.png",
    lien: "https://www.canac.ca",
  },
  {
    nom: "Ville de Saint-Augustin-de-Desmaures",
    image: "/VSAD.png",
    lien: "https://www.vsad.ca",
  },
  {
    nom: "Desjardins",
    image: "/Desjardins.png",
    lien: "https://www.desjardins.com",
  },
];

export default function FooterLVPSA() {
  const annee = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-slate-950 text-white">
      {/* Photo et voiles */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[url('/galerie/galerie-01.jpg')] bg-cover bg-center opacity-20"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/95 to-black" />

      <div
        aria-hidden="true"
        className="absolute -bottom-32 left-1/2 h-80 w-[80%] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 pb-8 pt-16 lg:px-8 lg:pt-24">
        {/* Appel à l’action */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-gradient-to-r from-cyan-400/15 via-white/[0.05] to-yellow-300/10 p-7 backdrop-blur-md sm:p-10 lg:flex lg:items-center lg:justify-between lg:gap-10"
        >
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-300">
              Faites partie de l’aventure
            </p>

            <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Le prochain chapitre de la LVPSA s’écrit avec vous.
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-slate-300">
              Joueurs, bénévoles, partenaires et passionnés : venez contribuer
              au développement du volleyball de plage dans notre région.
            </p>
          </div>

          <div className="mt-7 flex shrink-0 flex-col gap-3 sm:flex-row lg:mt-0 lg:flex-col">
            <Link
              to="/inscription-ligue"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-6 py-4 font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-200"
            >
              Rejoindre la ligue
              <ArrowUpRight className="h-5 w-5" />
            </Link>

            <a
              href="mailto:liguevpsa@gmail.com?subject=Partenariat%20LVPSA"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-4 font-black text-white transition hover:bg-white/10"
            >
              Devenir partenaire
            </a>
          </div>
        </motion.div>

        {/* Contenu principal */}
        <div className="grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-[1.25fr_0.75fr_0.75fr_1fr] lg:gap-10 lg:py-16">
          {/* Identité */}
          <div>
            <Link to="/" className="inline-flex items-center gap-4">
              <div className="h-16 w-16 overflow-hidden rounded-full border border-white/15 bg-slate-950">
                <img
                  src="/logo.jpg"
                  alt="Logo LVPSA"
                  className="h-full w-full object-cover"
                />
              </div>

              <div>
                <p className="text-2xl font-black tracking-tight">LVPSA</p>
                <p className="mt-1 text-sm text-slate-400">
                  Volleyball de plage
                </p>
              </div>
            </Link>

            <p className="mt-6 max-w-sm leading-7 text-slate-400">
              Une ligue sportive locale qui rassemble les joueurs, les familles,
              les bénévoles et les partenaires autour du volleyball de plage.
            </p>

            <div className="mt-7 space-y-4 text-sm">
              <a
                href="mailto:liguevpsa@gmail.com"
                className="flex items-start gap-3 text-slate-300 transition hover:text-cyan-300"
              >
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" />
                liguevpsa@gmail.com
              </a>

              <div className="flex items-start gap-3 text-slate-300">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" />
                <span>
                  Parc Place Portneuf
                  <br />
                  Saint-Augustin-de-Desmaures
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-black text-white">Explorer</h3>

            <nav className="mt-5 flex flex-col gap-3">
              {liensRapides.map((item) => (
                <Link
                  key={item.lien}
                  to={item.lien}
                  className="w-fit text-sm font-medium text-slate-400 transition hover:translate-x-1 hover:text-cyan-300"
                >
                  {item.titre}
                </Link>
              ))}
            </nav>
          </div>

          {/* Espace membre */}
          <div>
            <h3 className="font-black text-white">Espace membre</h3>

            <nav className="mt-5 flex flex-col gap-3">
              {liensMembres.map((item) => (
                <Link
                  key={item.lien}
                  to={item.lien}
                  className="w-fit text-sm font-medium text-slate-400 transition hover:translate-x-1 hover:text-cyan-300"
                >
                  {item.titre}
                </Link>
              ))}
            </nav>
          </div>

          {/* Réseaux sociaux */}
          <div>
            <h3 className="font-black text-white">Suivez la LVPSA</h3>

            <p className="mt-5 text-sm leading-6 text-slate-400">
              Horaires, résultats, photos, annonces et événements de la ligue.
            </p>

            <a
              href="https://www.facebook.com/profile.php?id=61572358300215&locale=fr_CA"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-3 rounded-2xl bg-blue-600 px-5 py-3 font-black text-white transition hover:-translate-y-0.5 hover:bg-blue-500"
            >
              <Facebook className="h-5 w-5" />
              Page Facebook
              <ArrowUpRight className="h-4 w-4" />
            </a>

            <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-center gap-3 text-yellow-300">
                <Volleyball className="h-5 w-5" />
                <p className="font-black">Saison 2026</p>
              </div>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Activités de mai à août au parc Portneuf.
              </p>
            </div>
          </div>
        </div>

        {/* Partenaires */}
        <div className="border-t border-white/10 py-9">
          <p className="text-center text-xs font-black uppercase tracking-[0.2em] text-slate-500">
            Fiers partenaires de la LVPSA
          </p>

          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {partenaires.map((partenaire) => (
              <a
                key={partenaire.nom}
                href={partenaire.lien}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visiter le site de ${partenaire.nom}`}
                className="group flex min-h-24 items-center justify-center rounded-2xl border border-white/10 bg-white p-4 transition hover:-translate-y-1 hover:border-cyan-300/40"
              >
                <img
                  src={partenaire.image}
                  alt={partenaire.nom}
                  loading="lazy"
                  className="max-h-14 max-w-full object-contain transition duration-300 group-hover:scale-105"
                />
              </a>
            ))}
          </div>
        </div>

        {/* Bas du footer */}
        <div className="flex flex-col gap-4 border-t border-white/10 pt-7 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {annee} LVPSA. Tous droits réservés.
          </p>

          <p>
            Ligue de volleyball de plage de Saint-Augustin-de-Desmaures
          </p>
        </div>
      </div>
    </footer>
  );
}
