// Previous: 4.2.8
// Current: 4.3.0

import Settings from './settings.js';

require('./tiles.js')
require('./horizontal.js')

const { right_click } = Settings;
//console.log(Settings);
if (right_click) {
  document.querySelectorAll('.mgl-gallery').forEach((gallery) => {
    gallery.addEventListener("contextmenu", (evt) => {
      evt.preventDefault()
    });
  });
}
