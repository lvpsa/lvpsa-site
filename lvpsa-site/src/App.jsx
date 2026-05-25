import React from "react";

export default function App() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#020617",
      color: "white",
      padding: "40px",
      fontFamily: "Arial"
    }}>
      <h1>LVPSA - Version 2</h1>

      <h2>Inscriptions Ligue</h2>
      <p>Les inscriptions pour la saison 2026 sont maintenant terminées.</p>

      <h2>Liste de remplaçants</h2>
      <p>
        Pour donner votre nom comme remplaçant :
        liguevpsa@gmail.com
      </p>

      <h2>Tournoi 18 juillet 2026</h2>

      <img
        src="/tournoi-lvpsa-2026.jpg"
        alt="Tournoi LVPSA"
        style={{
          width: "400px",
          maxWidth: "100%",
          borderRadius: "20px"
        }}
      />

      <p style={{ marginTop: "20px" }}>
        Coût : 100$ par équipe
      </p>

      <a
        href="https://forms.gle/csLUt6NmcjNADcBm7"
        target="_blank"
        rel="noreferrer"
        style={{
          display: "inline-block",
          marginTop: "20px",
          background: "#facc15",
          color: "#000",
          padding: "12px 20px",
          borderRadius: "999px",
          textDecoration: "none",
          fontWeight: "bold"
        }}
      >
        Inscription tournoi
      </a>

      <h2 style={{ marginTop: "40px" }}>Classements</h2>

      <a
        href="https://docs.google.com/spreadsheets/d/1-Y5gsmgi-V8TjSQbl2xIPuDx1QxTPL0S/edit?usp=drive_link&ouid=116934157877214569210&rtpof=true&sd=true"
        target="_blank"
        rel="noreferrer"
        style={{ color: "#facc15" }}
      >
        Voir les classements
      </a>

      <h2 style={{ marginTop: "40px" }}>Règlements</h2>

      <p>
        Les règlements complets seront ajoutés prochainement.
      </p>
    </div>
  );
}
