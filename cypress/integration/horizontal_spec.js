/// <reference types="cypress" />

context('Horizontal Layout', () => {
  beforeEach(() => {
    cy.visit('https://meow-gallery.buddy.cloud/horizontal-layout/')
  })

  it('Opens the Horizontal test page', () => {
    cy.contains('Horizontal Layout')
  })

  it('Horizontal items all have same height', () => {
    let itemHeight
    cy.get('.mgl-horizontal .mgl-item').each(($el, index) => {
      if (index === 0) {
        itemHeight = $el.outerHeight()
      }
      cy.expect($el.outerHeight()).to.equal(itemHeight)
    })
  })
})
