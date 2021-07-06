/// <reference types="cypress" />

context('Carousel Layout', () => {
  beforeEach(() => {
    cy.visit('https://meow-gallery.buddy.cloud/carousel-layout/')
  })

  it('Opens the Carousel test page', () => {
    cy.contains('Carousel Layout')
  })

  it('Carousel items all have same height', () => {
    let itemHeight
    cy.get('.mgl-carousel .mgl-item').each(($el, index) => {
      if (index === 0) {
        itemHeight = $el.outerHeight()
      }
      cy.expect($el.outerHeight()).to.equal(itemHeight)
    })
  })

  it('Navigates to next image via next button', () => {
    cy.get('.mgl-carousel .mgl-item.active').should('have.attr', 'data-mc-index', '2')
    cy.get('.mgl-carousel .mgl-item[data-mc-index="2"]').should('be.visible')
    cy.get('.mgl-carousel .mgl-item[data-mc-index="3"]').should('not.be.visible')
    cy.get('.mgl-carousel .meow-carousel-nav-dot[data-mc-index="2"').should('have.class', 'active')

    cy.get('.meow-carousel-next-btn').click()

    cy.get('.mgl-carousel .mgl-item[data-mc-index="2"]').should('not.have.class', 'active')
    cy.get('.mgl-carousel .mgl-item[data-mc-index="3"]').should('have.class', 'active')
    cy.get('.mgl-carousel .mgl-item[data-mc-index="3"]').should('be.visible')
    cy.get('.mgl-carousel .meow-carousel-nav-dot[data-mc-index="3"').should('have.class', 'active')

    cy.get('.meow-carousel-next-btn').click()

    cy.get('.mgl-carousel .mgl-item[data-mc-index="3"]').should('not.have.class', 'active')
    cy.get('.mgl-carousel .mgl-item[data-mc-index="4"]').should('have.class', 'active')
    cy.get('.mgl-carousel .mgl-item[data-mc-index="2"]').should('not.be.visible')
    cy.get('.mgl-carousel .mgl-item[data-mc-index="3"]').should('be.visible')
    cy.get('.mgl-carousel .mgl-item[data-mc-index="4"]').should('be.visible')
    cy.get('.mgl-carousel .meow-carousel-nav-dot[data-mc-index="4"').should('have.class', 'active')
  })

  it('Navigates to previous image via previous button', () => {
    cy.get('.mgl-carousel .mgl-item.active').should('have.attr', 'data-mc-index', '2')
    cy.get('.mgl-carousel .mgl-item[data-mc-index="2"]').should('be.visible')
    cy.get('.mgl-carousel .mgl-item[data-mc-index="3"]').should('not.be.visible')
    cy.get('.mgl-carousel .meow-carousel-nav-dot[data-mc-index="2"').should('have.class', 'active')

    cy.get('.meow-carousel-prev-btn').click()

    cy.get('.mgl-carousel .mgl-item[data-mc-index="2"]').should('not.have.class', 'active')
    cy.get('.mgl-carousel .mgl-item[data-mc-index="1"]').should('have.class', 'active')
    cy.get('.mgl-carousel .mgl-item[data-mc-index="3"]').should('not.be.visible')
    cy.get('.mgl-carousel .mgl-item[data-mc-index="1"]').should('be.visible')
    cy.get('.mgl-carousel .meow-carousel-nav-dot[data-mc-index="13"').should('have.class', 'active')

    cy.get('.meow-carousel-prev-btn').click()

    cy.get('.mgl-carousel .mgl-item[data-mc-index="13"]').should('not.have.class', 'active')
    cy.get('.mgl-carousel .mgl-item[data-mc-index="12"]').should('have.class', 'active')
    cy.get('.mgl-carousel .mgl-item[data-mc-index="13"]').should('not.be.visible')
    cy.get('.mgl-carousel .mgl-item[data-mc-index="12"]').should('be.visible')
    cy.get('.mgl-carousel .meow-carousel-nav-dot[data-mc-index="12"').should('have.class', 'active')
  })

  it('Navigates via the dots navigation', () => {
    cy.get('.mgl-carousel .mgl-item.active').should('have.attr', 'data-mc-index', '2')
    cy.get('.mgl-carousel .mgl-item[data-mc-index="2"]').should('be.visible')
    cy.get('.mgl-carousel .mgl-item[data-mc-index="3"]').should('not.be.visible')
    cy.get('.mgl-carousel .meow-carousel-nav-dot[data-mc-index="2"').should('have.class', 'active')

    cy.get('.mgl-carousel .meow-carousel-nav-dot[data-mc-index="5"').click()

    cy.get('.mgl-carousel .mgl-item[data-mc-index="5"]').should('be.visible')
    cy.get('.mgl-carousel .mgl-item[data-mc-index="2"]').should('not.be.visible')
    cy.get('.mgl-carousel .meow-carousel-nav-dot[data-mc-index="5"').should('have.class', 'active')

    cy.get('.mgl-carousel .meow-carousel-nav-dot[data-mc-index="13"').click()

    cy.get('.mgl-carousel .mgl-item[data-mc-index="13"]').should('be.visible')
    cy.get('.mgl-carousel .mgl-item[data-mc-index="5"]').should('not.be.visible')
    cy.get('.mgl-carousel .meow-carousel-nav-dot[data-mc-index="13"').should('have.class', 'active')
  })
})
