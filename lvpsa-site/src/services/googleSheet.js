const GOOGLE_SHEET_URL =
  "https://script.google.com/macros/s/AKfycbzTGtjahqUxVwnvx8x3bboSXE7z694gA0Q-3_v8CYpXJ15_hraQgucMqpM0WkMN89ET/exec";

export async function envoyerCommandeGoogleSheet(commande) {
  const articles = commande.articles || [];

  const payload = {
    type: "boutique-v2",
    numeroCommande: commande.numeroCommande || "",
    numeroCommandeSimple: commande.numeroCommandeSimple || "",
    nom: commande.nom || "",
    courriel: commande.courriel || "",
    telephone: commande.telephone || "",
    notes: commande.notes || "",
    total: commande.total || 0,
    articles: articles.map((article) => ({
      modele: article.nom || article.modele || article.categorie || "",
      type: article.type || "",
      categorie: article.categorie || "",
      couleur: article.couleurNom || article.couleur || "",
      taille: article.taille || "",
      quantite: Number(article.quantite) || 1,
      prix: Number(article.prix) || 0,
      total: (Number(article.prix) || 0) * (Number(article.quantite) || 1),
    })),
  };

  await fetch(GOOGLE_SHEET_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify(payload),
  });
}
