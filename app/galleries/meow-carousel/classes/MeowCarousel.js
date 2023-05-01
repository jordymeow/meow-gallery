// Previous: 4.3.6
// Current: 4.3.8

import MeowCarouselItem from './MeowCarouselItem'

function getTranslateValues(el){
  const matrix = el.style.transform.replace(/[^0-9\-.,]/g, '').split(',')
  const x = matrix[12] || matrix[4]
  const y = matrix[13] || matrix[5]
  return [x, y]
}

export default class MeowCarousel {
  constructor(options) {
    this.carousel = options.carousel
    this.displayNavDots = options.displayNavDots
    this.navDotsController = false
    this.displayNavArrows = options.displayNavArrows
    this.carouselTrack = this.carousel.querySelector('.meow-carousel-track')
    this.carouselItems = this.carousel.querySelectorAll('.mgl-item')
    this.numberOfItems = this.carouselItems.length
    this.currentIndex = 0
    this.items = []
  }

  generateNavigationArrows () {
    const prevBtn = document.createElement('div')
    prevBtn.classList.add('meow-carousel-prev-btn')
    prevBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M217.9 256L345 129c9.4-9.4 9.4-24.6 0-33.9-9.4-9.4-24.6-9.3-34 0L167 239c-9.1 9.1-9.3 23.7-.7 33.1L310.9 417c4.7 4.7 10.9 7 17 7s12.3-2.3 17-7c9.4-9.4 9.4-24.6 0-33.9L217.9 256z"/></svg>'
    this.carousel.appendChild(prevBtn)
    const nextBtn = document.createElement('div')
    nextBtn.classList.add('meow-carousel-next-btn')
    nextBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M294.1 256L167 129c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.3 34 0L345 239c9.1 9.1 9.3 23.7.7 33.1L201.1 417c-4.7 4.7-10.9 7-17 7s-12.3-2.3-17-7c-9.4-9.4-9.4-24.6 0-33.9l127-127.1z"/></svg>'
    this.carousel.appendChild(nextBtn)
  }

  createClones () {
    let $firstItemClone, $secondItemClone, $beforeLastItemClone, $lastItemClone
    if (this.numberOfItems >= 3) {
      $firstItemClone = this.carouselItems[0].cloneNode(true)
      $firstItemClone.classList.add('clone','first-item')

      $secondItemClone = this.carouselItems[1].cloneNode(true)
      $secondItemClone.classList.add('clone','second-item')

      $beforeLastItemClone = this.carouselItems[this.carouselItems.length -2].cloneNode(true)
      $beforeLastItemClone.classList.add('clone','before-last-item')

      $lastItemClone = this.carouselItems[this.carouselItems.length - 1].cloneNode(true)
      $lastItemClone.classList.add('clone','last-item')
    }
    if (this.numberOfItems == 2) {
      $firstItemClone = this.carouselItems[0].cloneNode(true)
      $firstItemClone.classList.add('clone','first-item')

      $secondItemClone = this.carouselItems[1].cloneNode(true)
      $secondItemClone.classList.add('clone','second-item')

      $beforeLastItemClone = this.carouselItems[this.carouselItems.length -2].cloneNode(true)
      $beforeLastItemClone.classList.add('clone', 'before-last-item')

      $lastItemClone = this.carouselItems[this.carouselItems.length -1].cloneNode(true)
      $lastItemClone.classList.add('clone','last-item')
    }
    if (this.numberOfItems == 1) {
      $firstItemClone = this.carouselItems[0].cloneNode(true)
      $firstItemClone.classList.add('clone','first-item')

      $secondItemClone = this.carouselItems[0].cloneNode(true)
      $secondItemClone.classList.add('clone','second-item')

      $beforeLastItemClone = this.carouselItems[0].cloneNode(true)
      $beforeLastItemClone.classList.add('clone','before-last-item')

      $lastItemClone = this.carouselItems[0].cloneNode(true)
      $lastItemClone.classList.add('clone','last-item')      
    }

    this.carouselTrack.insertBefore($lastItemClone, this.carouselItems[0])
    this.carouselTrack.insertBefore($beforeLastItemClone, this.carouselItems[0])

    this.carouselTrack.append($firstItemClone)
    this.carouselTrack.append($secondItemClone)

    this.carouselItems = this.carousel.querySelectorAll('.mgl-item')
    this.numberOfItems = this.carouselItems.length
  }

  initializeCarousel () {
    this.carouselTrackWidth = 0
    this.carouselItems.forEach((element, index) => {
      element.setAttribute('data-mc-index', index)
      element.querySelector('img').setAttribute('draggable', false)
      const item = new MeowCarouselItem({
        item: element,
        index: index,
        isClone: element.classList.contains('clone')
      })
      this.items.push(item)
      this.carouselTrackWidth += element.offsetWidth
    })
    this.carouselTrack.style.width = this.carouselTrackWidth + 'px'
    const firstRealItemIndex = parseInt( this.carousel.querySelectorAll('.mgl-item:not(.clone)')[0].getAttribute('data-mc-index') )
    this.slideCarouselTo(firstRealItemIndex, true)
  }

  slideCarouselTo (destination, noTransition) {
    if (noTransition) {
      this.carouselTrack.classList.add('no-transition')
    }
    this.carouselTrack.style.transform = 'translate3d(' + ( -1 * (this.items[destination].getCenterOffset() - this.carousel.offsetWidth / 2) ) +'px, 0, 0)'
    this.carouselItems.forEach(item => item.classList.remove('active'))
    this.carouselItems[destination].classList.add('active')
    if (noTransition) {
      setTimeout(() => {
        this.carouselTrack.classList.remove('no-transition')
      }, 100)
    }
    this.currentIndex = destination
    if (this.navDotsController) {
      this.navDotsController.updateActive(this.currentIndex)
    }
  }

  slideCarouselToPrev () {
    if (this.items[this.currentIndex].isClone) {
      if (this.carouselItems[this.currentIndex].classList.contains('last-item')) {
        this.slideCarouselTo( this.numberOfItems - 3, true)
      }
    }
    setTimeout(() => {
      let prevIndex
      this.currentIndex === 0 ? prevIndex = this.numberOfItems - 1 : prevIndex = this.currentIndex - 1
      this.slideCarouselTo(prevIndex)
    }, 1)
  }

  slideCarouselToNext () {
    if (this.items[this.currentIndex].isClone) {
      if (this.carouselItems[this.currentIndex].classList.contains('first-item')) {
        let firstRealItemIndex = false
        this.carouselItems.forEach((item, index) => {
          if (!item.classList.contains('clone') && !firstRealItemIndex) {
            firstRealItemIndex = index
          }
        })
        this.slideCarouselTo( firstRealItemIndex, true)
      }
    }
    setTimeout(() => {
      let nextIndex
      this.currentIndex === this.numberOfItems - 1 ? nextIndex = 0 : nextIndex = this.currentIndex + 1
      this.slideCarouselTo(nextIndex)
    }, 1)
  }

  getMagnetizedItem () {
    const carouselPosX = this.carousel.getBoundingClientRect().left
    const carouselCenterPosX = carouselPosX + this.carousel.offsetWidth / 2
    let smallestMagnetization = false
    let mostMagnetizedItem = 0
    this.carouselItems.forEach((element, index) => {
      const itemCenterOffset = element.getBoundingClientRect().left + element.offsetWidth / 2
      const magnetization =  Math.abs( carouselCenterPosX - itemCenterOffset )
      if ((!smallestMagnetization && smallestMagnetization !== 0) || magnetization < smallestMagnetization) {
        smallestMagnetization = magnetization
        mostMagnetizedItem = index
      }
    })
    return mostMagnetizedItem
  }

  checkForBorder () {
    const carouselPosX = this.carousel.getBoundingClientRect().left
    const carouselCenterPosX = carouselPosX + this.carousel.offsetWidth / 2
    const leftLimit = this.carouselItems[1].getBoundingClientRect().left + this.carouselItems[1].offsetWidth / 2
    const rightLimit = this.carouselItems[this.carouselItems.length - 2].getBoundingClientRect().left + this.carouselItems[this.carouselItems.length - 2].offsetWidth / 2
    if (carouselCenterPosX - leftLimit <= 0) {
      this.slideCarouselTo( this.numberOfItems - 3, true)
      this.startTrackTranslation = parseFloat( getTranslateValues(this.carouselTrack)[0] )
      return true
    }
    if (carouselCenterPosX - rightLimit >= 0) {
      this.slideCarouselTo( 2, true)
      this.startTrackTranslation = parseFloat( getTranslateValues(this.carouselTrack)[0] )
      return true
    }
    return false
  }

  createEventListeners () {
    this.carousel.querySelector('.meow-carousel-prev-btn')?.addEventListener('click', () => {
      this.slideCarouselToPrev()
    })

    this.carousel.querySelector('.meow-carousel-next-btn')?.addEventListener('click', () => {
      this.slideCarouselToNext()
    })

    this.carousel.querySelectorAll('.meow-carousel-nav-dot')?.forEach(dot => {
      dot.addEventListener('click', e => {
        let dot = e.target
        if (e.target.tagName === 'SPAN') {
          dot = e.target.parentNode
        }
        const dotDataIndex = parseInt(dot.getAttribute('data-mc-index'))
        const destination = Array.from(this.carouselItems).findIndex((item) => {
          return !item.classList.contains('clone') && parseInt(item.getAttribute('data-mc-index')) === dotDataIndex
        })
        this.slideCarouselTo(destination)
      })
    })

    const mouseDownHandler = (e) => {
      this.isClicking = true
      if (e.type === 'touchstart') {
        this.startMousePositionX = e.touches[0].pageX
      } else {
        this.startMousePositionX = e.clientX
      }
      this.startTrackTranslation = parseFloat( getTranslateValues(this.carouselTrack)[0] )
    }

    this.carouselTrack.addEventListener('mousedown', mouseDownHandler)
    this.carouselTrack.addEventListener('touchstart', mouseDownHandler)

    const mouseMoveHandler = (e) => {
      if (this.isClicking) {
        this.carouselTrack.querySelectorAll('.mwl-img').forEach(mwlImage => {
          mwlImage.classList.remove('mwl-img')
          mwlImage.classList.add('mwl-img-disabled')
        })
        this.isDragging = true
        this.carouselTrack.classList.add('no-transition')

        if (this.checkForBorder()) {
          if (e.type === 'touchmove') {
            this.startMousePositionX = e.touches[0].pageX
          } else {
            this.startMousePositionX = e.clientX
          }
        }
        if (!this.checkForBorder()) {
          if (e.type === 'touchmove') {
            this.deltaMoveX = this.startMousePositionX - e.touches[0].pageX
          } else {
            this.deltaMoveX = this.startMousePositionX - e.clientX
          }
          this.carouselTrack.style.transform = 'translate3d('+ ( this.startTrackTranslation - this.deltaMoveX  ) + 'px, 0, 0)'
        }
      }
    }

    this.carouselTrack.addEventListener('mousemove', mouseMoveHandler)

    this.carouselTrack.addEventListener('touchmove', mouseMoveHandler)

    const mouseUpHandler = () => {
      const wasDragging = this.isDragging
      this.carouselTrack.classList.remove('no-transition')
      this.isDragging = false
      this.isClicking = false
      if (wasDragging) {
        setTimeout(() => {
          document.querySelectorAll('.mwl-img-disabled').forEach(disabledImages => {
            disabledImages.classList.remove('mwl-img-disabled')
            disabledImages.classList.add('mwl-img')
          })
        }, 400)
        const mostMagnetizedItem = this.getMagnetizedItem()
        if (mostMagnetizedItem === this.currentIndex && this.deltaMoveX >= 80) {
          this.slideCarouselToNext()
        }
        if (mostMagnetizedItem === this.currentIndex && this.deltaMoveX <= -80) {
          this.slideCarouselToPrev()
        }
        this.slideCarouselTo(mostMagnetizedItem)
        return false
      }
    }

    this.carouselTrack.addEventListener('mouseup', mouseUpHandler)
    this.carouselTrack.addEventListener('touchend', mouseUpHandler)

    window.addEventListener('resize', () => {
      this.slideCarouselTo(this.currentIndex, false)
    })
  }
}
