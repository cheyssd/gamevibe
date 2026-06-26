describe("Avis sur un jeu", () => {
  let testUser;

  before(() => {
    cy.createTestUser().then((user) => { testUser = user; });
  });

  beforeEach(() => {
    cy.loginByApi(testUser.email, testUser.mot_de_passe);
    cy.visit("/");
    cy.contains("Catalogue").click();
    cy.get('input[placeholder*="Rechercher"]').type("Elden Ring");
    cy.contains("Elden Ring", { timeout: 8000 }).click();
  });

  it("affiche le formulaire pour poster un avis quand connecté", () => {
    cy.contains(/laisser un avis|votre avis|poster/i).should("be.visible");
  });

  it("poste un nouvel avis avec note et commentaire", () => {
    const commentaire = `Avis de test Cypress ${Date.now()}`;

    // Sélectionne 5 étoiles (à adapter selon le sélecteur réel du composant)
    cy.get('[class*="bi-star"]').last().click();

    cy.get("textarea").type(commentaire);
    cy.contains("button", /publier|envoyer|poster/i).click();

    cy.contains(commentaire, { timeout: 8000 }).should("be.visible");
  });

  it("affiche une erreur si l'utilisateur a déjà posté un avis sur ce jeu", () => {
    const commentaire = `Premier avis ${Date.now()}`;
    cy.get('[class*="bi-star"]').last().click();
    cy.get("textarea").type(commentaire);
    cy.contains("button", /publier|envoyer|poster/i).click();
    cy.contains(commentaire, { timeout: 8000 }).should("be.visible");

    // Recharge et tente de reposter
    cy.reload();
    cy.contains(/déjà posté|déjà noté/i, { timeout: 8000 }).should("be.visible");
  });
});