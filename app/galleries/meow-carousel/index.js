// Previous: 4.0.5
// Current: 4.2.5

import MeowCarousel from './classes/MeowCarousel'
import MeowCarouselNavDotsController from './classes/MeowCarouselNavDotsController'

const initCarousel = () => {
  document.querySelectorAll('.mgl-carousel').forEach((carousel) => {
    // Get options
    const navDots = carousel.getAttribute('data-mgl-dot_nav')
    const navArrows = carousel.getAttribute('data-mgl-arrow_nav')

    const carouselInstance = new MeowCarousel({
      carousel,
      displayNavDots: navDots,
      displayNavArrows: navArrows
    })
    
    carouselInstance.createClones()

    if (carouselInstance.displayNavArrows) {
      carouselInstance.generateNavigationArrows()
    }
    if (carouselInstance.displayNavDots) {
      const navDotsController = new MeowCarouselNavDotsController({
        carousel: carouselInstance.carousel
      })
      carouselInstance.navDotsController = navDotsController
      navDotsController.createMarkup()
    }
    carouselInstance.initializeCarousel()
    carouselInstance.createEventListeners()
  })
}

export default initCarousel
