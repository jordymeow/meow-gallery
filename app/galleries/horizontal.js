// Previous: 4.2.8
// Current: 5.0.0

// Is written with Vanilla JS
import { options } from "./settings";

window.addEventListener('load', () => {
  if (document.querySelector('.mgl-gallery.mgl-horizontal')) {
    document.querySelectorAll('.mgl-gallery.mgl-horizontal').forEach(gallery => {
      const galleryTrack = gallery.querySelector('.meow-horizontal-track')

      // Disable right click
      if ( !options.right_click ) {
        gallery.addEventListener("contextmenu", (evt) => {
          evt.preventDefault()
        });
      }

      // Scroll wheel converter
      gallery.addEventListener("wheel", (evt) => {
        evt.preventDefault()
        galleryTrack.scrollLeft += evt.deltaY
      })

      // Touch support for mouse
      let startX = 0
      let originalOffset = 0
      let isTouching = false
      let isDragging = false

      gallery.addEventListener('mousedown', (e) => {
        e.preventDefault()
        originalOffset = galleryTrack.scrollLeft
        startX = e.screenX
        isTouching = true
      })

      gallery.addEventListener('mousemove', (e) => {
        const deltaX = startX - e.screenX

        if (isTouching) {
          if (Math.abs(deltaX) > 5 && !isDragging) {
            isDragging = true
            galleryTrack.querySelectorAll('img').forEach(image => {
              image.classList.remove('mwl-img')
              image.classList.add('mwl-img-disabled')
            })
          } else {
            isDragging = false
          }

          if (isDragging) {
            galleryTrack.scrollLeft = originalOffset + deltaX
          }
        }
      })

      gallery.addEventListener('mouseout', () => {
        if (isTouching) {
          isTouching = false
          isDragging = false

          galleryTrack.querySelectorAll('img').forEach(image => {
            image.classList.add('mwl-img')
            image.classList.remove('mwl-img-disabled')
          })
        }
      }, false)

      gallery.addEventListener('mouseup', () => {
        isTouching = false
        isDragging = false

        setTimeout(() => {
          galleryTrack.querySelectorAll('img').forEach(image => {
            image.classList.add('mwl-img')
            image.classList.remove('mwl-img-disabled')
          })
        })
      })
    })
  }
})
