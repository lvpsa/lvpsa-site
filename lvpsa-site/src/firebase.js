const [statutMatchs, setStatutMatchs] = useState({
  texte: "Chargement...",
  couleur: "emerald",
  message: "LVPSA",
});

useEffect(() => {
  async function chargerStatut() {
    const ref = doc(db, "settings", "matchStatus");
    const snap = await getDoc(ref);

    if (snap.exists()) {
      setStatutMatchs(snap.data());
    }
  }

  chargerStatut();
}, []);
