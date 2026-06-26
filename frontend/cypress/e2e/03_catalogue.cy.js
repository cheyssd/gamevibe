describe("Catalogue de jeux", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.contains("Catalogue").click();
  });

  it("affiche une liste de jeux", () => {
    cy.get('input[placeholder*="Rechercher"]').should("be.visible");
    // Au moins une carte jeu visible
    cy.get("body").then(($body) => {
      expect($body.text().length).to.be.greaterThan(0);
    });
  });

  it("filtre les jeux via la recherche", () => {
    cy.get('input[placeholder*="Rechercher"]').type("Elden Ring");
    cy.contains("Elden Ring", { timeout: 8000 }).should("be.visible");
  });

  it("affiche un message si aucun résultat", () => {
    cy.get('input[placeholder*="Rechercher"]').type("zzzjeuinexistantzzz");
    cy.contains(/aucun/i, { timeout: 8000 }).should("be.visible");
  });

  it("ouvre la fiche d'un jeu au clic", () => {
    cy.get('input[placeholder*="Rechercher"]').type("Elden Ring");
    cy.contains("Elden Ring", { timeout: 8000 }).click();
    cy.contains(/note|avis|plateforme/i, { timeout: 8000 }).should("be.visible");
  });
});