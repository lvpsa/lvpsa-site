import {
  BookOpen,
  CalendarDays,
  Handshake,
  Images,
  Trophy,
  UserPlus,
  Users,
} from "lucide-react";

export const menuPrincipal = [
  {
    titre: "Accueil",
    lien: "/",
  },

  {
    titre: "Ligue",
    dropdown: true,
    items: [
      {
        titre: "Calendrier",
        description: "Consultez tous les matchs de la saison.",
        lien: "/ligue/calendrier",
        icone: CalendarDays,
      },
      {
        titre: "Classements",
        description: "Résultats et classement des équipes.",
        lien: "/classements",
        icone: Trophy,
      },
      {
        titre: "Inscriptions",
        description: "Créer une équipe ou rejoindre la ligue.",
        lien: "/inscriptions",
        icone: UserPlus,
      },
      {
        titre: "Gestion d'équipe",
        description: "Administration de votre équipe.",
        lien: "/ligue/equipe",
        icone: Users,
      },
      {
        titre: "Règlements",
        description: "Les règlements officiels.",
        lien: "/ligue/reglements",
        icone: BookOpen,
      },
    ],
  },

  {
    titre: "Tournoi",
    dropdown: true,
    items: [
      {
        titre: "Prochain événement",
        description: "Toutes les informations sur la prochaine édition.",
        lien: "/tournoi",
        icone: Trophy,
      },
      {
        titre: "Horaire",
        description: "Publié avant le début du tournoi.",
        lien: "/tournoi/horaire",
        icone: CalendarDays,
      },
      {
        titre: "Règlements",
        description: "Consultez les règlements du tournoi.",
        lien: "/tournoi/reglements",
        icone: BookOpen,
      },
      {
        titre: "Galerie 2026",
        description: "Revivez les meilleurs moments.",
        lien: "/galerie",
        icone: Images,
      },
    ],
  },

  {
    titre: "Boutique",
    lien: "/boutique",
  },

  {
    titre: "Partenaires",
    dropdown: true,
    items: [
      {
        titre: "Nos partenaires",
        description: "Découvrez les entreprises qui soutiennent la LVPSA.",
        lien: "/partenaires",
        icone: Handshake,
      },
      {
        titre: "Devenir partenaire",
        description: "Joignez-vous à l'aventure LVPSA.",
        lien: "/partenaires/devenir-partenaire",
        icone: Handshake,
      },
    ],
  },

  {
    titre: "Galerie",
    lien: "/galerie",
  },
];
