// Previous: 4.2.5
// Current: 4.2.8

import MeowTiles from './classes/MeowTiles';

// I am planning to move all the settings here to make it simpler and cleaner
import Settings from '../settings';

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
