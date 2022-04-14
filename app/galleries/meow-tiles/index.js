// Previous: 4.2.3
// Current: 4.2.5

import MeowTiles from './classes/MeowTiles'

const initTiles = () => {
  document.querySelectorAll('.mgl-tiles').forEach((gallery) => {
    const tilesGallery = new MeowTiles({
      gallery,
      density: mgl_settings?.tiles?.density
    })

    tilesGallery.init(() => {
      tilesGallery.setRowsHeight()
    })

    let resizingTimeout = null
    window.addEventListener('resize', () => {
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
