import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    viewportWidth: 1280,
    viewportHeight: 800,
    video: false,
    screenshotOnRunFailure: true,
    setupNodeEvents(on, config) {
      // place pour les plugins futurs (ex: cypress-mochawesome-reporter)
    },
    env: {
      apiUrl: "http://localhost:8000/api",
    },
  },
});