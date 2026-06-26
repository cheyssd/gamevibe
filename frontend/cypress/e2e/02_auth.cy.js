describe("Authentification", () => {

  const uniqueEmail = () => `cypress${Date.now()}@gamevibe.com`;

  describe("Inscription", () => {
    beforeEach(() => {
      cy.visit("/");
      cy.contains("S'inscrire").click();
    });

    it("affiche les champs du formulaire", () => {
      cy.get('input[placeholder="Votre nom"]').should("be.visible");
      cy.get('input[placeholder="votre@email.com"]').should("be.visible");
      cy.get('input[placeholder="••••••••"]').should("have.length", 2);
    });

    it("affiche une erreur si les champs sont vides", () => {
      cy.contains("button", "Créer mon compte").click();
      cy.contains(/requis/i).should("be.visible");
    });

    it("affiche une erreur si les mots de passe ne correspondent pas", () => {
      const email = uniqueEmail();
      cy.get('input[placeholder="Votre nom"]').type("Cypress Test");
      cy.get('input[placeholder="votre@email.com"]').type(email);
      cy.get('input[placeholder="••••••••"]').first().type("Password123!");
      cy.get('input[placeholder="••••••••"]').last().type("AutreMotDePasse!");
      cy.contains("button", "Créer mon compte").click();
      cy.contains(/correspond/i).should("be.visible");
    });

    it("crée un compte avec succès et connecte l'utilisateur", () => {
      const email = uniqueEmail();
      cy.get('input[placeholder="Votre nom"]').type("Cypress Test");
      cy.get('input[placeholder="votre@email.com"]').type(email);
      cy.get('input[placeholder="••••••••"]').first().type("Password123!");
      cy.get('input[placeholder="••••••••"]').last().type("Password123!");
      cy.contains("button", "Créer mon compte").click();

      // Redirection vers l'accueil connecté
      cy.contains("Cypress Test", { timeout: 10000 }).should("be.visible");
    });
  });

  describe("Connexion", () => {
    let testUser;

    before(() => {
      cy.createTestUser().then((user) => { testUser = user; });
    });

    beforeEach(() => {
      cy.visit("/");
      cy.contains("Connexion").click();
    });

    it("affiche une erreur avec des identifiants invalides", () => {
      cy.get('input[placeholder="votre@email.com"]').type("inconnu@gamevibe.com");
      cy.get('input[placeholder="••••••••"]').first().type("mauvaismotdepasse");
      cy.contains("button", "Se connecter").click();
      cy.contains(/incorrect/i).should("be.visible");
    });

    it("se connecte avec des identifiants valides", () => {
      cy.get('input[placeholder="votre@email.com"]').type(testUser.email);
      cy.get('input[placeholder="••••••••"]').first().type(testUser.mot_de_passe);
      cy.contains("button", "Se connecter").click();
      cy.contains(testUser.nom, { timeout: 10000 }).should("be.visible");
    });

    it("se déconnecte avec succès", () => {
      cy.get('input[placeholder="votre@email.com"]').type(testUser.email);
      cy.get('input[placeholder="••••••••"]').first().type(testUser.mot_de_passe);
      cy.contains("button", "Se connecter").click();
      cy.contains(testUser.nom, { timeout: 10000 }).should("be.visible");

      cy.contains("Déconnexion").click();
      cy.contains("Connexion").should("be.visible");
    });
  });
});