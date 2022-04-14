// Previous: 4.0.7
// Current: 4.2.5

import initTiles from './meow-tiles/'

window.mglInitTiles = initTiles

document.addEventListener('DOMContentLoaded', () => {
	initTiles()
})
