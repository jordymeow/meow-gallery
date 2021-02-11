/// <reference types="cypress" />

context('Basic Layouts', () => {
  beforeEach(() => {
    cy.visit('https://meow-gallery.live.page/2021/02/10/basic-layouts/')
  })

  it('Opens the sandbox', () => {
    cy.contains('Basic Layouts')
  })

  it('Masonry items all have same width', () => {
    let itemWidth
    cy.get('.mgl-masonry .mgl-item').each(($el, index) => {
      if (index === 0) {
        itemWidth = $el.outerWidth()
      }
      cy.expect($el.outerWidth()).to.equal(itemWidth)
    })
  })

  it('Cascade rows have same width', () => {
    let rowWidth
    cy.get('.mgl-cascade .mgl-row').each(($el, index) => {
      if (index === 0) {
        rowWidth = $el.outerWidth()
      }
      cy.expect($el.outerWidth()).to.equal(rowWidth)
    })
  })

  it('Square items all have same width and height', () => {
    let itemWidth, itemHeight
    cy.get('.mgl-square .mgl-item').each(($el, index) => {
      if (index === 0) {
        itemWidth = $el.outerWidth()
        itemHeight = $el.outerHeight()
      }
      cy.expect($el.outerWidth()).to.equal(itemWidth)
      cy.expect($el.outerHeight()).to.equal(itemHeight)
    })
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
})
