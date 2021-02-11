/// <reference types="cypress" />

context('Carousel Layout', () => {
  beforeEach(() => {
    cy.visit('https://meow-gallery.live.page/2021/02/11/carousel-layout/')
  })

  it('Opens the Carousel test page', () => {
    cy.contains('Carousel Layout')
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
    cy.get('.mgl-carousel .mgl-item[data-mc-index="2"]').should('not.be.visible')
    cy.get('.mgl-carousel .mgl-item[data-mc-index="1"]').should('be.visible')
    cy.get('.mgl-carousel .meow-carousel-nav-dot[data-mc-index="16"').should('have.class', 'active')

    cy.get('.meow-carousel-prev-btn').click()

    cy.get('.mgl-carousel .mgl-item[data-mc-index="16"]').should('not.have.class', 'active')
    cy.get('.mgl-carousel .mgl-item[data-mc-index="15"]').should('have.class', 'active')
    cy.get('.mgl-carousel .mgl-item[data-mc-index="16"]').should('not.be.visible')
    cy.get('.mgl-carousel .mgl-item[data-mc-index="15"]').should('be.visible')
    cy.get('.mgl-carousel .meow-carousel-nav-dot[data-mc-index="15"').should('have.class', 'active')
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

    cy.get('.mgl-carousel .meow-carousel-nav-dot[data-mc-index="16"').click()

    cy.get('.mgl-carousel .mgl-item[data-mc-index="16"]').should('be.visible')
    cy.get('.mgl-carousel .mgl-item[data-mc-index="5"]').should('not.be.visible')
    cy.get('.mgl-carousel .meow-carousel-nav-dot[data-mc-index="16"').should('have.class', 'active')
  })
})
