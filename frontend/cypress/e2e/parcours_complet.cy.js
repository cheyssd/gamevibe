const email = `testuser_${Date.now()}@gamevibe.com`
const password = "motdepasse123"

describe("Parcours complet : inscription → noter un jeu → profil → suppression", () => {
  before(() => {
    cy.clearLocalStorage()
  })

  it("s'inscrit, note un jeu, supprime son avis puis supprime son compte", () => {

    cy.on("window:confirm", () => true)

    cy.visit("/")
    cy.contains("GAMEVIBE").should("be.visible")
    cy.wait(1000)

    cy.contains("S'inscrire").click()
    cy.wait(800)

    cy.get('input[placeholder="Votre nom"]').type("TestUser", { delay: 80 })
    cy.get('input[placeholder="votre@email.com"]').type(email, { delay: 60 })
    cy.get("input[type='password']").first().type(password, { delay: 80 })
    cy.get("input[type='password']").last().type(password, { delay: 80 })
    cy.wait(800)

    cy.contains("Créer mon compte").click()

    cy.get("nav").contains("TestUser", { timeout: 8000 }).should("be.visible")
    cy.wait(1200)

    cy.contains("Catalogue").click()
    cy.wait(1200)

    cy.get(".grid > div", { timeout: 10000 }).first().click()
    cy.wait(1000)

    cy.contains("Avis de la communauté", { timeout: 8000 }).should("be.visible")
    cy.contains("Donner mon avis").should("be.visible")
    cy.wait(1000)

    cy.get("i.bi-star.cursor-pointer").eq(3).click()
    cy.contains("4/5").should("be.visible")
    cy.wait(800)

    cy.get("textarea").type(
      "Super jeu, vraiment excellent ! Je recommande à tous les amateurs du genre.",
      { delay: 40 }
    )
    cy.wait(800)

    cy.contains("Publier mon avis").click()
    cy.contains("Avis posté avec succès", { timeout: 8000 }).should("be.visible")
    cy.contains("Super jeu, vraiment excellent").should("be.visible")
    cy.wait(2000)

    cy.get("nav").contains("button", "TestUser").click()
    cy.contains("Mes avis postés", { timeout: 8000 }).should("be.visible")
    cy.contains("Super jeu, vraiment excellent").should("be.visible")
    cy.wait(1200)

    cy.contains("button", /^Supprimer$/).click()
    cy.contains("Vous n'avez pas encore posté d'avis", { timeout: 6000 }).should("be.visible")
    cy.wait(1500)

    cy.contains("Supprimer mon compte").click()
    cy.wait(1500)

    cy.contains("GAMEVIBE", { timeout: 8000 }).should("be.visible")
    cy.contains("Connexion").should("be.visible")
  })
})
