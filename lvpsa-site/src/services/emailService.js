import emailjs from "@emailjs/browser";

export async function envoyerCourrielsCommande(commande) {
  const resumeCommande =
    commande.articles
      .map(
        (article, index) =>
          `Article #${index + 1} : ${article.nom} • ${article.couleurNom} • Taille ${article.taille} • Qté ${article.quantite} • ${article.prix} $`
      )
      .join("\n") + `\n\nTOTAL : ${commande.total} $`;

  const params = {
    nom: commande.nom,
    courriel: commande.courriel,
    telephone: commande.telephone,
    commande: resumeCommande,
    notes: commande.notes || "",
    total_commande: commande.total,
    to_email: commande.courriel,
  };

  await Promise.all([
    emailjs.send(
      "service_f4h3rii",
      "template_nwl643g",
      params,
      "ZooBSx9i6qVl5HI8T"
    ),
    emailjs.send(
      "service_f4h3rii",
      "template_c5ab7bt",
      params,
      "ZooBSx9i6qVl5HI8T"
    ),
  ]);
}
