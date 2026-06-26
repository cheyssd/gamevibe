// ── Commande : connexion via l'UI ────────────────────────────────────────────
Cypress.Commands.add("login", (email, motDePasse) => {
  cy.visit("/");
  cy.contains("Connexion").click();
  cy.get('input[placeholder="votre@email.com"]').type(email);
  cy.get('input[placeholder="••••••••"]').first().type(motDePasse);
  cy.contains("button", "Se connecter").click();
});

// ── Commande : connexion directe via l'API (plus rapide, évite l'UI) ────────
Cypress.Commands.add("loginByApi", (email, mot_de_passe) => {
  return cy.request("POST", `${Cypress.env("apiUrl")}/login`, { email, mot_de_passe })
    .then((res) => {
      window.localStorage.setItem("token", res.body.token);
      window.localStorage.setItem("user", JSON.stringify(res.body.user));
      return res.body;
    });
});

// ── Commande : créer un utilisateur de test via l'API ────────────────────────
Cypress.Commands.add("createTestUser", (overrides = {}) => {
  const unique = Date.now();
  const user = {
    nom: `Test User ${unique}`,
    email: `test${unique}@gamevibe.com`,
    mot_de_passe: "Password123!",
    mot_de_passe_confirmation: "Password123!",
    ...overrides,
  };

  return cy.request("POST", `${Cypress.env("apiUrl")}/register`, user)
    .then((res) => ({ ...user, ...res.body }));
});