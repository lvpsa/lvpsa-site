export async function envoyerCommandeGoogleSheet(commande) {
  return fetch(
    "https://script.google.com/macros/s/AKfycbzTGtjahqUxVwnvx8x3bboSXE7z694gA0Q-3_v8CYpXJ15_hraQgucMqpM0WkMN89ET/exec",
    {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify({
        type: "boutique-v2",
        nom: commande.nom,
        courriel: commande.courriel,
        telephone: commande.telephone,
        notes: commande.notes,
        total: commande.total,
        articles: commande.articles.map((article) => ({
          produit: article.nom,
          couleur: article.couleurNom,
          taille: article.taille,
          quantite: Number(article.quantite),
          prix: Number(article.prix),
          total: Number(article.prix) * Number(article.quantite),
        })),
      }),
    }
  );
}
