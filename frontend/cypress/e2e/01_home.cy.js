describe("Page d'accueil", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("affiche le logo et le titre principal", () => {
    cy.contains("GAMEVIBE").should("be.visible");
    cy.contains("Découvrez les jeux").should("be.visible");
  });

  it("affiche les boutons Connexion et S'inscrire pour un visiteur", () => {
    cy.contains("Connexion").should("be.visible");
    cy.contains("S'inscrire").should("be.visible");
  });

  it("anime les statistiques (jeux / avis / joueurs)", () => {
    cy.contains("Jeux").should("be.visible");
    cy.contains("Avis").should("be.visible");
    cy.contains("Joueurs").should("be.visible");
  });

  it("navigue vers le catalogue", () => {
    cy.contains("Catalogue").click();
    cy.url().should("not.eq", "/");
  });

  it("navigue vers la page de connexion", () => {
    cy.contains("Connexion").click();
    cy.contains("Connectez-vous à votre compte").should("be.visible");
  });

  it("navigue vers la page d'inscription", () => {
    cy.contains("S'inscrire").click();
    cy.contains("Créer votre compte").should("be.visible");
  });
});