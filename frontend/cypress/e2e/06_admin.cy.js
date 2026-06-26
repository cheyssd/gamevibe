describe("Espace admin", () => {
  // ⚠️ Adapte ces identifiants à un compte admin existant dans ta base de test
  const adminEmail = "admin@gamevibe.com";
  const adminPassword = "Password123!";

  beforeEach(() => {
    cy.loginByApi(adminEmail, adminPassword);
    cy.visit("/");
  });

  it("affiche le bouton Dashboard dans la navbar pour un admin", () => {
    cy.contains("Dashboard").should("be.visible");
  });

  it("accède au dashboard admin", () => {
    cy.contains("Dashboard").click();
    cy.contains(/utilisateurs|jeux|avis/i).should("be.visible");
  });

  describe("Gestion des jeux", () => {
    beforeEach(() => {
      cy.contains("Dashboard").click();
      cy.contains("Jeux").click();
    });

    it("affiche la liste des jeux avec pagination", () => {
      cy.contains("Gestion des jeux").should("be.visible");
      cy.get("table").should("be.visible");
    });

    it("ouvre la modale d'ajout d'un jeu", () => {
      cy.contains("Ajouter").click();
      cy.contains(/ajouter un jeu/i).should("be.visible");
    });

    it("filtre les jeux par recherche", () => {
      cy.get('input[placeholder*="Rechercher"]').type("Elden Ring");
      cy.contains("Elden Ring", { timeout: 8000 }).should("be.visible");
    });
  });

  describe("Gestion des avis", () => {
    beforeEach(() => {
      cy.contains("Dashboard").click();
      cy.contains("Avis").click();
    });

    it("affiche la liste de tous les avis", () => {
      cy.get("table").should("be.visible");
      cy.contains(/utilisateur/i).should("be.visible");
    });

    it("filtre les avis par jeu", () => {
      cy.get("select").select("Elden Ring");
      cy.get("table").should("be.visible");
    });

    it("supprime un avis avec confirmation", () => {
      cy.window().then((win) => {
        cy.stub(win, "confirm").returns(true);
      });
      cy.get("table tbody tr").first().within(() => {
        cy.contains("Supprimer").click();
      });
    });
  });

  describe("Gestion des utilisateurs", () => {
    beforeEach(() => {
      cy.contains("Dashboard").click();
      cy.contains("Utilisateurs").click();
    });

    it("affiche la liste des utilisateurs", () => {
      cy.get("table").should("be.visible");
    });

    it("désactive un compte utilisateur", () => {
      cy.window().then((win) => {
        cy.stub(win, "confirm").returns(true);
      });
      cy.get("table tbody tr").first().within(() => {
        cy.contains(/désactiver|supprimer/i).click();
      });
    });
  });

  it("revient sur le site public via 'Voir le site'", () => {
    cy.contains("Dashboard").click();
    cy.contains("Voir le site").click();
    cy.contains("Découvrez les jeux").should("be.visible");
  });
});