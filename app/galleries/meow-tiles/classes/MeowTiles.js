// Previous: 4.1.1
// Current: 4.0.6

```javascript
const $ = jQuery

export default class MeowTiles {
  constructor(options) {
    this.gallery = options.gallery
    this.$gallery = $(this.gallery)
    this.$galleryItems = this.$gallery.find('.mgl-item')
    this.galleryItems = []
    this.rowClasses = []
    this.rows = []
    this.ooooLayoutVariant = 0
    this.density = 'high'
    this.currentDevice = 'desktop'
    this.options = {
      density: options.density
    }
  }

  getCurrentDevice () {
    const windowWidth = window.innerWidth
    if (windowWidth < 460) {
      return 'mobile'
    }
    if (windowWidth <= 768) {
      return 'tablet'
    }
    return 'desktop'
  }

  setDensity () {
    this.density = this.options.density[this.currentDevice]
  }

  getAvailableRowClasses () {
    switch (this.density) {
      case 'high':
        this.rowClasses = [
          'o', 'i',
          'oo', 'ii', 'oi', 'io',
          'ooo', 'oii', 'ooi', 'ioo', 'oio', 'ioi', 'iio', 'iii',
          'iooo', 'oioo', 'ooio', 'oooi', 'iiii', 'oooo',
          'ioooo', 'ooioo', 'ooooi', 'iiooo', 'iooio', 'ooiio', 'ooioi', 'oooii', 'oiioo', 'oiooi', 'iiioo', 'iiooi', 'iooii', 'ooiii'
        ]
        break
      case 'medium':
        this.rowClasses = [
          'o', 'i',
          'oo', 'ii', 'oi', 'io',
          'ooo', 'oii', 'ooi', 'ioo', 'oio', 'ioi', 'iio', 'iii'
        ]
        break
      case 'low':
        this.rowClasses = [
          'o', 'i',
          'oo', 'ii', 'oi', 'io', 'iii'
        ]
        break
    }
  }

  createGalleryItemsArray () {
    for (const galleryItem of this.$galleryItems) {
      const $galleryItem = $(galleryItem)
      const galleryItemWidth = parseInt($galleryItem.attr('data-mgl-width'))
      const galleryItemHeight = parseInt($galleryItem.attr('data-mgl-height'))
      let galleryItemOrientation
      galleryItemWidth > galleryItemHeight ? galleryItemOrientation = 'o' : galleryItemOrientation = 'i'
      this.galleryItems.push({
        id: parseInt($galleryItem.attr('data-mgl-id')),
        width: galleryItemWidth,
        height: galleryItemHeight,
        orientation: galleryItemOrientation,
        markup: $galleryItem.prop('outerHTML')
      })
    }
  }

  calculateGalleryRows () {
    const galleryItems = [...this.galleryItems]
    this.rows = []
    let rowClass = ''
    while (galleryItems.length > 0) {
      const galleryItem = galleryItems.shift()
      const supposedRowClass = rowClass + galleryItem.orientation
      if (this.rowClasses.includes(supposedRowClass)) {
        rowClass = supposedRowClass
      } else if (rowClass.length === 0) {
        rowClass = galleryItem.orientation
      } else {
        this.rows.push(rowClass)
        rowClass = galleryItem.orientation
      }
      if (galleryItems.length === 0) {
        this.rows.push(rowClass)
      }
    }
    this.avoidLoneLastItems()
  }

  avoidLoneLastItems () {
    if (this.rows.length >= 2) {
      const lastRow = this.rows[this.rows.length - 1].split('')
      const secondToLastRow = this.rows[this.rows.length - 2].split('')
      if (lastRow.length === 1 && secondToLastRow.length > 1) {
        const secondToLastRowFirstItem = secondToLastRow.shift()
        lastRow.unshift(secondToLastRowFirstItem)
      }
      this.rows[this.rows.length - 2] = secondToLastRow.join('')
      this.rows[this.rows.length - 1] = lastRow.join('')
    }
  }

  getLetterFromIndex (index) {
    const letters = ['a', 'b', 'c', 'd', 'e']
    return letters[index]
  }

  getRowClass (row) {
    let layoutClass = `mgl-layout-${row.length}-`
    if (row === 'oooo') {
      if (this.ooooLayoutVariant >= 2) {
        this.ooooLayoutVariant = 0
      }
      layoutClass += `${row}-v${this.ooooLayoutVariant}`
      this.ooooLayoutVariant++
    } else {
      layoutClass += row
    }
    return layoutClass
  }

  getRowMarkup (row, rowItems) {
    let rowMarkup = `<div class="mgl-row ${this.getRowClass(row)}">`
    for (let i = 0; i < row.length; i++) {
      let rowItemMarkup = `<div class="mgl-box ${this.getLetterFromIndex(i)}">`
      rowItemMarkup += rowItems.shift().markup
      rowItemMarkup += '</div>'
      rowMarkup += rowItemMarkup
    }
    rowMarkup += '</div>'
    return rowMarkup
  }

  writeMarkup (callback) {
    const galleryItems = [...this.galleryItems]
    const rows = [...this.rows]
    let rowsMarkup = ''
    for (const row of rows) {
      const rowItems = galleryItems.splice(0, row.length)
      rowsMarkup += this.getRowMarkup(row, rowItems)
    }
    this.$gallery.html(rowsMarkup)
    setTimeout(callback, 0)
  }

  init (callback) {
    this.currentDevice = this.getCurrentDevice()
    this.setDensity()
    this.getAvailableRowClasses()
    this.createGalleryItemsArray()
    this.calculateGalleryRows()
    this.writeMarkup(callback)    
  }

  tilify (callback) {
    if (this.currentDevice !== this.getCurrentDevice()) {
      this.currentDevice = this.getCurrentDevice()
      this.ooooLayoutVariant = 0
      this.setDensity()
      this.getAvailableRowClasses()
      this.createGalleryItemsArray()
      this.calculateGalleryRows()
      this.writeMarkup(callback)
    }
  }
}
```