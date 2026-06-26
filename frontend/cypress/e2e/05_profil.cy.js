describe("Page profil", () => {
  let testUser;

  before(() => {
    cy.createTestUser().then((user) => { testUser = user; });
  });

  beforeEach(() => {
    cy.loginByApi(testUser.email, testUser.mot_de_passe);
    cy.visit("/");
    cy.contains(testUser.nom).click();
  });

  it("affiche les informations de l'utilisateur", () => {
    cy.contains(testUser.nom).should("be.visible");
    cy.contains(testUser.email).should("be.visible");
  });

  it("affiche les statistiques du profil", () => {
    cy.contains(/jeux notés/i).should("be.visible");
    cy.contains(/note moyenne/i).should("be.visible");
    cy.contains(/genre préféré/i).should("be.visible");
  });

  it("ouvre la modale de modification du profil", () => {
    cy.contains("Modifier le profil").click();
    cy.contains(/modifier le profil/i).should("be.visible");
    cy.get('input[value]').should("be.visible");
  });

  it("modifie le nom avec succès", () => {
    const nouveauNom = `Cypress Modifié ${Date.now()}`;
    cy.contains("Modifier le profil").click();
    cy.get('input').clear().type(nouveauNom);
    cy.contains("button", "Enregistrer").click();
    cy.contains(nouveauNom, { timeout: 8000 }).should("be.visible");
  });

  it("ouvre la modale de changement de mot de passe", () => {
    cy.contains("Changer mot de passe").click();
    cy.contains(/changer le mot de passe/i).should("be.visible");
  });

  it("supprime son compte avec confirmation", () => {
    cy.window().then((win) => {
      cy.stub(win, "confirm").returns(true);
    });
    cy.contains("Supprimer mon compte").click();
    cy.contains("Connexion", { timeout: 8000 }).should("be.visible");
  });
});