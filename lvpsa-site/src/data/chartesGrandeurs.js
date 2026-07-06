export const chartesGrandeurs = {
  tshirtHomme: {
    titre: "Charte des grandeurs — T-shirt homme",
    modele: "ATC1000",
    unite: "pouces",
    tailles: ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "6XL"],
    mesures: [
      {
        nom: "Poitrine à plat",
        valeurs: ["18 1/4", "20 1/4", "22", "24", "26", "27 3/4", "29 3/4", "32", "34"],
      },
      {
        nom: "Poitrine complète",
        valeurs: ["36 1/2", "40 1/2", "44", "48", "52", "55 1/2", "59 1/2", "64", "68"],
      },
      {
        nom: "Longueur du corps",
        valeurs: ["26 5/8", "28", "29 3/8", "30 3/4", "31 5/8", "32 1/2", "33 1/2", "35", "36"],
      },
      {
        nom: "Longueur manche",
        valeurs: ["16 1/4", "17 3/4", "19", "20 1/2", "21 3/4", "23 1/4", "24 5/8", "23 3/4", "24 3/4"],
      },
    ],
  },

  tshirtFemme: {
    titre: "Charte des grandeurs — T-shirt femme",
    modele: "Gildan 5V00L",
    unite: "pouces",
    tailles: ["S", "M", "L", "XL", "2XL", "3XL"],
    mesures: [
      {
        nom: "Longueur du corps",
        valeurs: ["25 1/2", "26", "27", "28", "28 1/2", "29"],
      },
      {
        nom: "Poitrine à plat",
        valeurs: ["17 1/4", "19 1/4", "21 1/4", "23 1/4", "25 1/4", "27 1/4"],
      },
      {
        nom: "Tolérance longueur",
        valeurs: ["+/- 1", "+/- 1", "+/- 1", "+/- 1", "+/- 1", "1"],
      },
      {
        nom: "Tolérance poitrine",
        valeurs: ["+/- 1", "+/- 1", "+/- 1", "+/- 1", "+/- 1", "1"],
      },
    ],
  },

  hoodie: {
    titre: "Charte des grandeurs — Hoodie unisexe",
    modele: "ATCF2500",
    unite: "pouces",
    tailles: ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"],
    mesures: [
      {
        nom: "Poitrine à plat",
        valeurs: ["20", "22", "24", "26", "28", "30", "32", "34"],
      },
      {
        nom: "Poitrine complète",
        valeurs: ["40", "44", "48", "52", "56", "60", "64", "68"],
      },
      {
        nom: "Longueur du corps",
        valeurs: ["28 1/2", "29 1/2", "30 1/2", "31 1/2", "32 1/2", "33 1/2", "34 1/2", "35 1/2"],
      },
      {
        nom: "Longueur manche",
        valeurs: ["35", "35 3/4", "36 1/2", "37 1/4", "38", "38 3/4", "39 1/2", "40"],
      },
    ],
  },

  camisoleFemme: {
    titre: "Charte des grandeurs — Camisole femme",
    modele: "Next Level 1533",
    unite: "pouces",
    tailles: ["XS", "S", "M", "L", "XL", "2XL"],
    mesures: [
      {
        nom: "Longueur du corps",
        valeurs: ["26 3/4", "27 3/8", "28", "28 5/8", "29 1/4", "29 7/8"],
      },
      {
        nom: "Poitrine à plat",
        valeurs: ["14", "15", "16", "17", "18", "19"],
      },
      {
        nom: "Tolérance longueur",
        valeurs: ["1/2", "1/2", "1/2", "1/2", "1/2", "1/2"],
      },
      {
        nom: "Tolérance poitrine",
        valeurs: ["1/2", "1/2", "1/2", "1/2", "1/2", "1/2"],
      },
    ],
  },

  camisoleHomme: {
    titre: "Charte des grandeurs — Camisole homme",
    modele: "M&O 4505",
    unite: "pouces",
    tailles: ["XS", "S", "M", "L", "XL", "2XL"],
    mesures: [
      {
        nom: "Longueur du corps",
        valeurs: ["27 1/4", "28 1/4", "29 1/4", "30 1/4", "31 1/4", "32 1/4"],
      },
      {
        nom: "Poitrine à plat",
        valeurs: ["17", "18", "20", "21", "23", "24"],
      },
    ],
  },
};

export function getCharteGrandeur(produit) {
  if (!produit) return null;

  const type = String(produit.type || "").toLowerCase();
  const sexe = String(produit.sexe || produit.genre || "").toLowerCase();

  if (type.includes("hoodie")) {
    return chartesGrandeurs.hoodie;
  }

  if (type.includes("t-shirt") && sexe.includes("femme")) {
    return chartesGrandeurs.tshirtFemme;
  }

  if (type.includes("t-shirt")) {
    return chartesGrandeurs.tshirtHomme;
  }

  if (type.includes("camisole") && sexe.includes("femme")) {
    return chartesGrandeurs.camisoleFemme;
  }

  if (type.includes("camisole")) {
    return chartesGrandeurs.camisoleHomme;
  }

  return null;
}
