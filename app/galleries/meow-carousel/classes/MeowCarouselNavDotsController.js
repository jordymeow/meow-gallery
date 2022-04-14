// Previous: 4.0.5
// Current: 4.2.5

export default class MeowCarouselNavDotsController {
  constructor (options) {
    this.carousel = options.carousel
    this.carouselItems = this.carousel.querySelectorAll('.mgl-item')
  }

  createMarkup () {
    const navDotsContainer = document.createElement('div')
    navDotsContainer.classList.add('meow-carousel-nav-dots-container')
    this.carouselItems.forEach((item, index) => {
      if (!item.classList.contains('clone')) {
        const dot = document.createElement('div')
        dot.classList.add('meow-carousel-nav-dot')
        dot.setAttribute('data-mc-index', index)
        const emptySpan = document.createElement('span')
        dot.appendChild(emptySpan)
        navDotsContainer.appendChild(dot)
      }
    })
    this.carousel.append(navDotsContainer)
    this.carouselNavDots = this.carousel.querySelectorAll('.meow-carousel-nav-dot')
  }

  updateActive () {
    let dotIndex = 0
    let count = 0
    this.carouselItems.forEach((item) => {
      if (!item.classList.contains('clone')) {
        if (dotIndex === 0 && item.classList.contains('active')) {
          dotIndex = count
        }
        count++
      }
    })
    this.carouselNavDots.forEach(dot => dot.classList.remove('active'))
    this.carouselNavDots[dotIndex].classList.add('active')
  }
}
