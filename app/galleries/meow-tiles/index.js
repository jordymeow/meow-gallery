// Previous: 4.0.6
// Current: 4.0.8

const $ = jQuery

import MeowTiles from './classes/MeowTiles'

const initTiles = () => {
  $('.mgl-tiles').each(function() {
    const tilesGallery = new MeowTiles({
      gallery: $(this)[0],
      density: mgl_settings.tiles.density
    })

    tilesGallery.init(() => {
      tilesGallery.setRowsHeight()
    })

    let resizingTimeout = null
    $(window).on('resize', () => {
      clearTimeout(resizingTimeout)
      resizingTimeout = setTimeout(() => {
        tilesGallery.tilify(() => {
          document.body.dispatchEvent(new Event('post-load'))
        })
        tilesGallery.setRowsHeight()
      }, 500)
    })
  })
}

export default initTiles
