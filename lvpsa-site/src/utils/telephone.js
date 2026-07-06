export function formatTelephone(value) {
  const chiffres = String(value || "")
    .replace(/\D/g, "")
    .slice(0, 10);

  if (chiffres.length === 0) return "";

  if (chiffres.length <= 3) {
    return `(${chiffres}`;
  }

  if (chiffres.length <= 6) {
    return `(${chiffres.slice(0, 3)})${chiffres.slice(3)}`;
  }

  return `(${chiffres.slice(0, 3)})${chiffres.slice(3, 6)}-${chiffres.slice(6)}`;
}
