// Previous: 4.0.0
// Current: 4.0.4

jQuery(document).ready(function ($) {

  const ratio = "three-two"

  const referals = require('./tiles-referals')

  function getHeightByWidth(ratio, width, orientation) {
    if (orientation == 'landscape') {
      switch (ratio) {
        case 'three-two':
          return (2 * width) / 3
        case 'five-four':
          return (4 * width) / 5
      }
    } else {
      switch (ratio) {
        case 'three-two':
          return (3 * width) / 2
        case 'five-four':
          return (5 * width) / 4
      }
    }
  }

  function tilesCalculateRow() {
    $('.mgl-tiles').each(function () {
      $(this).find('.mgl-row').each(function () {
        const layout = $(this).attr('data-tiles-layout')
        const ref = referals[layout]
        const $ref = $(this).find('.mgl-box.' + ref.box)
        const ref_width = $ref.outerWidth()
        $(this).css('height', getHeightByWidth(ratio, ref_width, ref.orientation))
      })
    })
  }

  $(window).resize(function () {
    tilesCalculateRow()
  })

  $(document.body).on('post-load', function () {
    tilesCalculateRow()
  })

  window.mglCalculateRow = tilesCalculateRow
  window.mglCalculateRow()

  if (mgl_settings.disable_right_click) {
    $('.mgl-gallery img').on('contextmenu', function () {
      return false
    })
  }
})
