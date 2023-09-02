// Previous: 4.2.8
// Current: 5.0.0

import MeowTiles from './classes/MeowTiles';

// I am planning to move all the settings here to make it simpler and cleaner
import { options } from '../settings.js';

const initTiles = async () => {
  const max_retry = 5;
  let retry = 0;
  let galleries = document.querySelectorAll('.mgl-tiles');

  while (retry <= max_retry) {
    galleries = document.querySelectorAll('.mgl-tiles');
    if (options.layout === 'tiles' && galleries.length) {
      break;
    }
    retry++;
    if (retry <= max_retry) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
  galleries.forEach((gallery) => {

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
