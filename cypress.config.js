/// <reference types="Cypress" />

const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    includeShadowDom:true, 
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
