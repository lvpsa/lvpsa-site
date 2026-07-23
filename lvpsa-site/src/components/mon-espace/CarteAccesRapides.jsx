import {
  CalendarDays,
  Settings,
  ShoppingBag,
  Trophy,
  UserPlus,
  UsersRound,
  Repeat2,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function CarteAccesRapides({
  estAdmin,
  estCapitaine,
  estRemplacant,
}) {
  const accesRole = estAdmin
    ? {
        titre: "Administration",
        lien: "/admin",
        icone: Settings,
        accent:
          "border-amber-300 bg-amber-300 text-slate-950 hover:bg-amber-200",
      }
    : estCapitaine
    ? {
        titre: "Gestion d’équipe",
        lien: "/gestion-equipe",
        icone: UsersRound,
      }
    : estRemplacant
    ? {
        titre: "Remplaçants",
        lien: "/remplacants",
        icone: Repeat2,
      }
    : {
        titre: "Inscriptions",
        lien: "/inscription-ligue",
        icone: UserPlus,
      };

  const liens = [
    {
      titre: "Calendrier",
      lien: "/calendrier",
      icone: CalendarDays,
    },
    {
      titre: "Classements",
      lien: "/classements",
      icone: Trophy,
    },
    {
      titre: "Boutique",
      lien: "/boutique",
      icone: ShoppingBag,
    },
    accesRole,
  ];

  return (
    <section className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
      <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan-300">
        Navigation
      </p>

      <h2 className="mt-2 text-3xl font-black text-white">
        Accès rapides
      </h2>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {liens.map((item) => {
          const Icone = item.icone;

          return (
            <Link
              key={item.lien}
              to={item.lien}
              className={`group flex min-h-36 flex-col justify-between rounded-2xl border p-5 font-black transition hover:-translate-y-1 ${
                item.accent ||
                "border-white/10 bg-black/20 text-white hover:border-cyan-300/40 hover:bg-white/[0.06]"
              }`}
            >
              <Icone
                className={`h-6 w-6 ${
                  item.accent ? "text-slate-950" : "text-cyan-300"
                }`}
              />

              <div className="mt-8 flex items-end justify-between gap-3">
                <span>{item.titre}</span>
                <span className="transition group-hover:translate-x-1">→</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
