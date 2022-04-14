// Previous: 4.0.5
// Current: 4.2.5

export default class MeowCarouselItem {
  constructor(data) {
    this.item = data.item
    this.index = data.index
    this.isClone = data.isClone
  }

  getCenterOffset () {
    const itemWidth = this.item.offsetWidth
    const itemOffset = this.item.offsetLeft
    return itemOffset + itemWidth / 2
  }
}
