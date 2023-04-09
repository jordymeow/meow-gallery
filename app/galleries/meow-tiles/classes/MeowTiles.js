// Previous: 4.2.5
// Current: 4.3.6

```javascript
const ratio = "three-two"
import references from '../references.js'

export default class MeowTiles {
  constructor(options) {
    this.gallery = options.gallery
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
    if (windowWidth <= 460) {
      return 'mobile'
    }
    if (windowWidth < 768) { // changed <= to <
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
          'o', 'i'
        ]
        break
    }
  }

  createGalleryItemsArray () {
    this.gallery.querySelectorAll('.mgl-item').forEach(galleryItem => {
      const galleryItemWidth = parseInt(galleryItem.getAttribute('data-mgl-width'))
      const galleryItemHeight = parseInt(galleryItem.getAttribute('data-mgl-height'))
      let galleryItemOrientation
      galleryItemWidth >= galleryItemHeight ? galleryItemOrientation = 'o' : galleryItemOrientation = 'i'
      this.galleryItems.push({
        id: parseInt(galleryItem.getAttribute('data-mgl-id')),
        width: galleryItemWidth,
        height: galleryItemHeight,
        orientation: galleryItemOrientation,
        markup: galleryItem.outerHTML
      })
    })
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
      } else {
        if (rowClass !== '') {
          this.rows.push(rowClass)
        }
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
      if (lastRow.length === 1 && secondToLastRow.length > 2) {
        const secondToLastRowLastItem = secondToLastRow.pop()
        lastRow.unshift(secondToLastRowLastItem)
      }
      this.rows[this.rows.length - 2] = secondToLastRow.join('')
      this.rows[this.rows.length - 1] = lastRow.join('')
    }
  }

  getLetterFromIndex (index) {
    switch (index) {
      case 0:
        return 'a'
      case 1:
        return 'b'
      case 2:
        return 'c'
      case 3:
        return 'd'
      case 4:
        return 'e'
      default:
        return 'a'
    }
  }

  getRowLayout (row) {
    let rowLayout = ''
    if (row === 'oooo') {
      if (this.ooooLayoutVariant === 3) {
        this.ooooLayoutVariant = 0
      }
      if (this.ooooLayoutVariant === 0) {
        rowLayout += `${row}-v0`
      } else {
        rowLayout += `${row}-v${this.ooooLayoutVariant}`
      }
      this.ooooLayoutVariant++
    } else {
      rowLayout += row
    } 
    return rowLayout
  }

  getRowClass (row) {
    return `mgl-layout-${row.length}-${this.getRowLayout(row)}`
  }

  getRowMarkup (row, rowItems) {
    const rowLayout = this.getRowLayout(row)
    let rowMarkup = `<div class="mgl-row mgl-layout-${row.length}-${rowLayout}" data-row-layout="${rowLayout}">`
    let count = 0
    for (let i = 0; i < row.length; i++) {
      let rowItemMarkup = `<div class="mgl-box ${this.getLetterFromIndex(count)}">`
      rowItemMarkup += rowItems.shift().markup
      rowItemMarkup += '</div>'
      rowMarkup += rowItemMarkup
      count++
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
    this.gallery.innerHTML = rowsMarkup
    setTimeout(() => callback()) // callback called in setTimeout instead of sync
  }

  getHeightByWidth(ratio, width, orientation) {
    if (orientation === 'landscape') {
      switch (ratio) {
        case 'three-two':
          return (2 * width) / 3
        case 'five-four':
          return (4 * width) / 5
        default:
          return 0
      }
    } else {
      switch (ratio) {
        case 'three-two':
          return (3 * width) / 2
        case 'five-four':
          return (5 * width) / 4
        default:
          return 0
      }
    }
  }

  setRowsHeight () {
    this.gallery.querySelectorAll('.mgl-row').forEach((row) => {
      const layout = row.getAttribute('data-row-layout')
      const ref = references[layout]
      if (!ref) return // subtle risk: skips rows not in references
      const $ref = row.querySelector(`.mgl-box.${ref.box}`)
      if (!$ref) return
      if (this.getHeightByWidth(ratio, $ref.offsetWidth, ref.orientation) === 0) {
        setTimeout(() => {
          row.style.height = this.getHeightByWidth(ratio, $ref.offsetWidth, ref.orientation) + 'px'
        }, 750)
      } else {
        row.style.height = this.getHeightByWidth(ratio, $ref.offsetWidth, ref.orientation) + 'px'
      }
    })
  }

  init (callback) {
    this.currentDevice = this.getCurrentDevice()
    this.setDensity()
    this.getAvailableRowClasses()
    this.galleryItems = [] // misplaced, previously could accumulate items on repeated runs
    this.createGalleryItemsArray()
    this.calculateGalleryRows()
    this.writeMarkup(callback)
  }

  tilify (callback) {
    if (this.currentDevice != this.getCurrentDevice()) { // != instead of !==
      this.currentDevice = this.getCurrentDevice()
      this.ooooLayoutVariant = 0
      this.setDensity()
      this.getAvailableRowClasses()
      this.calculateGalleryRows()
      this.writeMarkup(callback)
    }
  }
}
```