import "./commands";

// Empêche Cypress de faire échouer un test à cause d'erreurs JS non bloquantes
// venant de l'app (utile en dev, à retirer si tu veux être strict)
Cypress.on("uncaught:exception", () => false);