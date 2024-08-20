// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Visits a given URL and dismisses the Cookie Banner
// Params: URL ((from the test_data.json fixture))
Cypress.Commands.add('visitUrl', (Url) => {
    // Visit the webpage
    cy.visit(Url); 
    // Wait for the cookie banner
    cy.get('.loader').should('not.exist');
    cy.get('.cmm-cookie-banner__content', { timeout: 10000 }).should('be.visible');
    // Accept the cookies and dismiss the banner
    cy.get('.button').contains('Agree to all').click();
    // Banner should be invisible
    cy.get('.cmm-cookie-banner__content').should('not.be.visible'); 
})

// Deals with the initial "Please select your location form"
// Params: location, postalCode (from the test_data.json fixture)
Cypress.Commands.add('selectLocation', (location, postalCode) => {
    // Select a State in the dropdown menu
    cy.get('.dcp-header-location-modal-dropdown .hydrated').should('be.visible');
    cy.get('.dcp-header-location-modal-dropdown').find('select').select(location).should('have.value', location);
    cy.get('input[aria-labelledby="postal-code-hint"]').should('be.enabled');
    // Fill and validate the postal code
    cy.get('input[aria-labelledby="postal-code-hint"]').type(postalCode, { delay: 500 }).should('have.value', postalCode);
    // Select Purpose radio button
    cy.get('div[class="wb-radio-control__indicator"]').should('not.be.checked');
    // Choose the Private option
    cy.get('.dcp-radio__options-container').find('[type="radio"]').then((radio) => {
        cy.wrap(radio).first().check({ force: true });
    });
    // Click the continue button
    cy.get('.wb-modal-dialog-container__footer > .wb-button > span').click();
})

// Filters from the list of Pre-Oned cars by Colour
// Params: the car colour (from the test_data.json fixture)
Cypress.Commands.add('filterCarByColour', (selectedColour) => {
    cy.get('span[class="filter-toggle"]').click(); // Opens the filter menu
    cy.get('.dcp-cars-filter-widget', { timeout: 10000 }).should('be.visible'); // Assters if the filter is visible
    cy.get('.wb-button span').contains('Pre-Owned').click(); // Clicks on Pre-Owned
    cy.get('.dcp-loading-spinner', { timeout: 15000 }).should('not.be.visible');
    cy.get('span[class="filter-toggle"]').click({ force: true }); // Opens the filter menu again
    cy.get('.category-filter-row-headline__text').contains('Colour').click(); // Chooses a colour
    cy.get('div[data-test-id="multi-select-dropdown"]').contains('Colour').click();
    cy.get('li[class="dcp-multi-select-dropdown-card__pill-wrapper dcp-multi-select-dropdown-card-pill-wrapper"]').contains(selectedColour).click();
    cy.get('.close-button').click(); // Close the filter
})

// Generates text file with Car Year and VIN
// Params: Location of the exported file (from the test_data.json fixture)
Cypress.Commands.add('carTextFile', (location) => {
    cy.get('.dcp-vehicle-details-category__list').invoke('text').then(detailsText => {
        const searchModel = 'Model Year';
        const modelIndex = detailsText.indexOf(searchModel);
        const modelText = detailsText.substring(modelIndex, modelIndex + 15);
        const searchVIN = 'VIN';
        const vinIndex = detailsText.indexOf(searchVIN);
        const vinText = detailsText.substring(vinIndex, vinIndex + 21);
        const modelVinText = modelText + '\n' + vinText;
        cy.log(modelVinText);
        cy.writeFile(location, modelVinText);
    })
})