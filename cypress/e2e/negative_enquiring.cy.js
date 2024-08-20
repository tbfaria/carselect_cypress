/// <reference types="Cypress" />

describe('Enquire - Negative Scenarios', () => {
  // This variable holds all the project settings. Holds data from cypress\fixtures\test_data.json
  let settingsData
  // Obeject with the validation messages. Holds data from cypress\fixtures\validation_messages.json
  let validationMessages
  // This variable holds the selected car URL. It is used in all later tests, avoiding repetition
  let currentCarUrl

  // Load the fixtures into objects
  before(() => {
    cy.fixture('test_data').then((data) => {
      settingsData = data;
    })
    cy.fixture('validation_messages').then((data) => {
      validationMessages = data;
    })
  })

  // This involves several steps, mostly organized into commands
  // The parameters come from the fixtures
  it('find a car', () => {
    // New command - support/commands.js
    // Opens the webpage 
    cy.visitUrl(settingsData.website);

    // New command - support/commands.js
    // Selects the Location
    // Params: Location name, Postal Code
    cy.selectLocation(settingsData.location, settingsData.postalCode);

    // New command - support/commands.js
    // Filters pre-owned cars by a given coulour
    // Params: desired colour
    cy.filterCarByColour(settingsData.carColour);

    // Choose the most expensive car
    // Order by price and selects the first one
    cy.get('.dcp-cars-srp__sorting-dropdown.hydrated').find('select').select('Price (descending)').should('have.value', 'price-desc-ucos');
    cy.get('.dcp-cars-product-tile').first().click();

    // New command - support/commands.js
    // Creates a text file with car year and VIN
    // Params: file name and location
    cy.carTextFile(settingsData.testFileLocation);

    // Save the current car Url to be used in other tests ahead
    cy.url().then(url => {
      currentCarUrl = url;
    });
  })

  // Test: Don't fill any of the form fields and proceed
  // Expected: If the required fields are not field, the validation messages are shown
  // Expected: An error message is now visible "Please check the data you entered."
  it('displays error messages for empty fields', () => {
    cy.visitUrl(settingsData.website);
    cy.selectLocation(settingsData.location, settingsData.postalCode);
    cy.visit(currentCarUrl);
    cy.get('[data-test-id="dcp-buy-box__contact-seller"]').click();
    cy.get('.dcp-error-message').should('not.exist');
    cy.get('[data-test-id="dcp-rfq-contact-button-container__button-next"]').click();
    // Count 6 mandatory fields error messages
    cy.get('wb-control-error.hydrated').should('have.length', 6);
    // Error message shown "Please check the data you entered."
    cy.get('[class="dcp-error-message"]').should('be.visible');
  })


  // Test: Typing of an invalid email without the @
  // Expected: Validation message "Please enter a valid email address using a minimum of six characters." is shown bellow 
  it('displpays validations for invalid email format', () => {
    cy.visitUrl(settingsData.website);
    cy.selectLocation(settingsData.location, settingsData.postalCode);
    cy.visit(currentCarUrl);
    cy.get('[data-test-id="dcp-buy-box__contact-seller"]').click();
    cy.get('[data-test-id="rfq-contact__email"]').type('brucewayne.com');
    cy.get('[data-test-id="dcp-rfq-contact-button-container__button-next"]').click();
    cy.get('[data-test-id="rfq-contact__email"] > wb-input-control.hydrated > wb-control-error.hydrated').should('contain', validationMessages.email_invalid);
    cy.get('[class="dcp-error-message"]').should('be.visible');
  })

  // Test: Typing and invalid first name with numerals '23'
  // Expected: Validation message " Please avoid the following characters: 0123456789/*+=;:,!?[](){}# " is shown bellow
  it('displays validations for numeric data on First Name', () => {
    cy.visitUrl(settingsData.website);
    cy.selectLocation(settingsData.location, settingsData.postalCode);
    cy.visit(currentCarUrl);
    cy.get('[data-test-id="dcp-buy-box__contact-seller"]').click();
    cy.get('[data-test-id="rfq-contact__first-name"]').type('23');
    cy.get('[data-test-id="dcp-rfq-contact-button-container__button-next"]').click();
    cy.get('[data-test-id="rfq-contact__first-name"] > wb-input-control.hydrated > wb-control-error.hydrated').should('contain', validationMessages.first_name_numeric);
    cy.get('[class="dcp-error-message"]').should('be.visible');
  })

  // Test: Typing and invalid first name with over 24 characters
  // Expected: Validation message "Please enter a minimum of 2 and a maximum of 24 characters for your first name." is shown bellow
  it('displays validations with over 24 characters on First Name', () => {
    cy.visitUrl(settingsData.website);
    cy.selectLocation(settingsData.location, settingsData.postalCode);
    cy.visit(currentCarUrl);
    cy.get('[data-test-id="dcp-buy-box__contact-seller"]').click();
    cy.get('[data-test-id="rfq-contact__first-name"]').type('Bruce Wayne Bruce Wayne B');
    cy.get('[data-test-id="dcp-rfq-contact-button-container__button-next"]').click();
    cy.get('[data-test-id="rfq-contact__first-name"] > wb-input-control.hydrated > wb-control-error.hydrated').should('contain', validationMessages.first_name_max);
    cy.get('[class="dcp-error-message"]').should('be.visible');
  })

})



