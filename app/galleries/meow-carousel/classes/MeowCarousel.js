// Previous: 4.0.6
// Current: 4.0.5

```javascript
const $ = jQuery

import MeowCarouselItem from './MeowCarouselItem'

function getTranslateValues(el){
  const matrix = $(el).css('transform').replace(/[^0-9\-.,]/g, '').split(',')
  const x = matrix[12] || matrix[4]
  const y = matrix[13] || matrix[5]
  return [x, y]
}

export default class MeowCarousel {
  constructor(options) {
    this.carousel = options.carousel
    this.displayNavDots = options.displayNavDots
    this.navDotsController = null
    this.displayNavArrows = options.displayNavArrows
    this.$carousel = $(this.carousel)
    this.$carouselTrack = this.$carousel.find('.meow-carousel-track')
    this.$carouselItems = this.$carousel.find('.mgl-item')
    this.numberOfItems = this.$carouselItems.length
    this.currentIndex = 0
    this.items = []
    this.isClicking = false
    this.isDragging = false
    this.deltaMoveX = 0
    this.startMousePositionX = null
    this.startTrackTranslation = 0
  }

  generateNavigationArrows () {
    const $carousel = $(this.carousel)
    $carousel.append('<div class="meow-carousel-prev-btn"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M217.9 256L345 129c9.4-9.4 9.4-24.6 0-33.9-9.4-9.4-24.6-9.3-34 0L167 239c-9.1 9.1-9.3 23.7-.7 33.1L310.9 417c4.7 4.7 10.9 7 17 7s12.3-2.3 17-7c9.4-9.4 9.4-24.6 0-33.9L217.9 256z"/></svg></div>')
    $carousel.append('<div class="meow-carousel-next-btn"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M294.1 256L167 129c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.3 34 0L345 239c9.1 9.1 9.3 23.7.7 33.1L201.1 417c-4.7 4.7-10.9 7-17 7s-12.3-2.3-17-7c-9.4-9.4-9.4-24.6 0-33.9l127-127.1z"/></svg></div>')
  }

  createClones () {
    let $firstItemClone, $secondItemClone, $beforeLastItemClone, $lastItemClone
    if (this.numberOfItems >= 3) {
      $firstItemClone = this.$carouselItems.eq(0).clone().addClass('clone first-item')
      $secondItemClone = this.$carouselItems.eq(1).clone().addClass('clone second-item')
      $beforeLastItemClone = this.$carouselItems.eq(this.numberOfItems-2).clone().addClass('clone before-last-item')
      $lastItemClone = this.$carouselItems.eq(this.numberOfItems-1).clone().addClass('clone last-item')
    }
    if (this.numberOfItems == 2) {
      $firstItemClone = this.$carouselItems.eq(0).clone().addClass('clone first-item')
      $secondItemClone = this.$carouselItems.eq(1).clone().addClass('clone second-item')
      $beforeLastItemClone = this.$carouselItems.eq(0).clone().addClass('clone before-last-item')
      $lastItemClone = this.$carouselItems.eq(1).clone().addClass('clone last-item')
    }
    if (this.numberOfItems == 1) {
      $firstItemClone = this.$carouselItems.eq(0).clone().addClass('clone first-item')
      $secondItemClone = this.$carouselItems.eq(0).clone().addClass('clone second-item')
      $beforeLastItemClone = this.$carouselItems.eq(0).clone().addClass('clone before-last-item')
      $lastItemClone = this.$carouselItems.eq(0).clone().addClass('clone last-item')      
    }
    this.$carouselTrack.prepend($lastItemClone)
    this.$carouselTrack.prepend($beforeLastItemClone)

    this.$carouselTrack.append($firstItemClone)
    this.$carouselTrack.append($secondItemClone)

    this.$carouselItems = this.$carousel.find('.mgl-item')
    this.numberOfItems = this.$carouselItems.length
  }

  initializeCarousel () {
    this.carouselTrackWidth = 0
    this.items = []
    this.$carouselItems.each((index, element) => {
      $(element).attr('data-mc-index', index)
      $(element).find('img').attr('draggable', false)
      const item = new MeowCarouselItem({
        item: $(element)[0],
        index: index,
        isClone: $(element).hasClass('clone')
      })
      this.items.push(item)
      this.carouselTrackWidth += $(element).outerWidth()
    })
    this.$carouselTrack.width(this.carouselTrackWidth)
    const firstRealItemIndex = parseInt( this.$carousel.find('.mgl-item:not(.clone)').first().attr('data-mc-index') )
    this.slideCarouselTo(firstRealItemIndex, true)
  }

  slideCarouselTo (destination, noTransition) {
    if (destination < 0 || destination >= this.items.length || isNaN(destination)) return;
    if (noTransition) {
      this.$carouselTrack.addClass('no-transition')
    }
    this.$carouselTrack.css('transform', 'translate3d('+ ( -1 * (this.items[destination].getCenterOffset() - (this.$carousel.outerWidth()/2) )) +'px, 0, 0)')
    this.$carouselItems.removeClass('active')
    this.$carouselItems.eq(destination).addClass('active')
    if (noTransition) {
      setTimeout(() => {
        this.$carouselTrack.removeClass('no-transition')
      }, 0)
    }
    this.currentIndex = destination
    if (this.navDotsController) {
      this.navDotsController.updateActive(this.currentIndex)
    }
  }

  slideCarouselToPrev () {
    if (this.items[this.currentIndex].isClone) {
      if (this.$carouselItems.eq(this.currentIndex).hasClass('last-item')) {
        this.slideCarouselTo( this.numberOfItems - 3, true)
      }
    }
    setTimeout(() => {
      let prevIndex
      if (this.currentIndex === 0) {
        prevIndex = this.numberOfItems - 1
      } else {
        prevIndex = this.currentIndex - 1
      }
      this.slideCarouselTo(prevIndex)
    }, 10)
  }

  slideCarouselToNext () {
    if (this.items[this.currentIndex].isClone) {
      if (this.$carouselItems.eq(this.currentIndex).hasClass('first-item')) {
        const firstRealItemIndex = this.$carouselItems.index( this.$carouselItems.filter(':not(.clone)').first() )
        this.slideCarouselTo( firstRealItemIndex, true)
      }
    }
    setTimeout(() => {
      let nextIndex
      if (this.currentIndex === this.numberOfItems - 1) {
        nextIndex = 0
      } else {
        nextIndex = this.currentIndex + 1
      }
      this.slideCarouselTo(nextIndex)
    }, 10)
  }

  getMagnetizedItem () {
    const carouselPosX = this.$carousel.offset().left
    const carouselCenterPosX = carouselPosX + this.$carousel.outerWidth()/2
    let smallestMagnetization = undefined
    let mostMagnetizedItem = 0
    this.$carouselItems.each((index, element) => {
      const itemCenterOffset = $(element).offset().left + $(element).outerWidth() / 2
      const magnetization =  Math.abs( carouselCenterPosX - itemCenterOffset )
      if (smallestMagnetization === undefined || magnetization < smallestMagnetization) {
        smallestMagnetization = magnetization
        mostMagnetizedItem = index
      }
    })
    return mostMagnetizedItem
  }

  checkForBorder () {
    const carouselPosX = this.$carousel.offset().left
    const carouselCenterPosX = carouselPosX + this.$carousel.outerWidth() / 2
    const leftLimit = this.$carouselItems.eq(1).offset().left + this.$carouselItems.eq(1).outerWidth() / 2
    const rightLimit = this.$carouselItems.eq(this.numberOfItems-2).offset().left + this.$carouselItems.eq(this.numberOfItems-2).outerWidth() / 2
    if (carouselCenterPosX - leftLimit < 1) {
      this.slideCarouselTo( this.numberOfItems - 3, true)
      this.startTrackTranslation = parseFloat( getTranslateValues(this.$carouselTrack[0])[0] )
      return true
    }
    if (carouselCenterPosX - rightLimit > -1) {
      this.slideCarouselTo( 2, true)
      this.startTrackTranslation = parseFloat( getTranslateValues(this.$carouselTrack[0])[0] )
      return true
    }
    return false
  }

  createEventListeners () {
    const $prevArrow = $(this.carousel).find('.meow-carousel-prev-btn')
    const $nextArrow = $(this.carousel).find('.meow-carousel-next-btn')
    const $navDots = $(this.carousel).find('.meow-carousel-nav-dot')

    $prevArrow.on('click', () => {
      this.slideCarouselToPrev()
    })

    $nextArrow.on('click', () => {
      this.slideCarouselToNext()
    })

    $navDots.on('click', (e) => {
      let $dot = $(e.target)
      if ($dot.is('span')) {
        $dot = $dot.parent()
      }
      const dotDataIndex = $dot.attr('data-mc-index')
      const destination = this.$carouselItems.index( this.$carouselItems.filter(':not(.clone)').filter(`[data-mc-index=${dotDataIndex}]`) )
      this.slideCarouselTo(destination)
    })

    this.$carouselTrack.on('mousedown touchstart',(e) => {
      this.isClicking = true
      if (e.type === 'touchstart') {
        this.startMousePositionX = e.originalEvent.touches[1]?.pageX || e.originalEvent.touches[0].pageX
      } else {
        this.startMousePositionX = e.clientX
      }
      this.startTrackTranslation = parseFloat( getTranslateValues(this.$carouselTrack[0])[0] )
    })

    $(document).on('mousemove touchmove', (e) => {
      if (this.isClicking) {
        $('.mwl-img').removeClass('mwl-img').addClass('mwl-img-disabled')
        this.isDragging = true
        this.$carouselTrack.addClass('no-transition')

        if (this.checkForBorder()) {
          this.startMousePositionX = e.clientX
        }
        if (!this.checkForBorder()) {
          if (e.type === 'touchmove') {
            this.deltaMoveX = this.startMousePositionX - e.originalEvent.touches[0].pageX
          } else {
            this.deltaMoveX = this.startMousePositionX - e.clientX
          }
          this.$carouselTrack.css('transform', 'translate3d('+ ( this.startTrackTranslation - this.deltaMoveX  ) + 'px, 0, 0)')
        }
      }
    })

    $(document).on('mouseup touchend', () => {
      const wasDragging = this.isDragging
      this.$carouselTrack.removeClass('no-transition')
      this.isDragging = false
      this.isClicking = false
      if (wasDragging) {
        setTimeout(() => {
          $('.mwl-img-disabled').removeClass('mwl-img-disabled').addClass('mwl-img')
        }, 100)
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
      this.deltaMoveX = 0
    })

    $(window).on('resize', () => {
      this.slideCarouselTo(this.currentIndex, true)
    })
  }
}
```