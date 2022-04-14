/// <reference types="cypress" />

context('Blocks in editor', () => {

  beforeEach(() => {
    cy.visit('https://meow-gallery.buddy.cloud/wp-admin/')
    cy.get('input#user_login').type('admin')
    cy.get('input#user_pass').type(Cypress.env('GALLERY_SANDBOX_PASSWORD'))
    cy.get('input#wp-submit').click()
    cy.get('body')
      .then(($body) => {
        if ($body.find('Administration email verification').length > 0 ) {
          cy.get('input#correct-admin-email').click()
        }
      })
  })

  it('Opens the dashboard', () => {
    cy.contains('Howdy, admin')
  })

  it('Works with Square layout', () => {
    cy.visit('https://meow-gallery.buddy.cloud/wp-admin/post.php?post=44&action=edit')
    if (cy.get('.components-modal__screen-overlay')) {
      cy.get('.components-modal__screen-overlay button[aria-label="Close dialog"]').click()
    }
    
    cy.contains('Square Layout')
    cy.contains('This block has encountered an error').should('not.exist')
  })
})
