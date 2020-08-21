// Previous: 4.1.3
// Current: 4.0.0

import L from 'leaflet'
import 'leaflet.gridlayer.googlemutant'

jQuery(document).ready(function ($) {

  const MapController = function(map_settings, data) {
    this.data = data,
    this.container_id = map_settings.container_id
    this.map = null
    this.center = map_settings.center
    this.tiles_provider = map_settings.tiles_provider
    this.lightboxable = true
    this.tokens = {
      googlemaps: window.mgl_map.googlemaps.api_key,
      mapbox: window.mgl_map.mapbox.api_key,
      maptiler: window.mgl_map.maptiler.api_key
    }
    this.styles = {
      mapbox: window.mgl_map.mapbox.style,
      googlemaps: window.mgl_map.googlemaps.style
    }

    this.createMap = function() {
      if (L.DomUtil.get(this.container_id) != null) {
        L.DomUtil.get(this.container_id)._leaflet_id = null
      }
      this.map = L.map(this.container_id).setView(this.center, 13)
    }

    this.addTilesLayer = function() {
      if (this.tiles_provider == 'openstreetmap') {
        const url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        const attribution = 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
        L.tileLayer(url, {
          attribution: attribution,
          maxZoom: 18,
          noWrap: true,
          style: 'https://openmaptiles.github.io/osm-bright-gl-style/style-cdn.json'
        }).addTo(this.map)
      }
      if(this.tiles_provider == 'googlemaps') {
        if (typeof window.google != 'object' || typeof window.google.maps != 'object') {
          const gmap_script = '<script src="https://maps.googleapis.com/maps/api/js?key='+ this.tokens[this.tiles_provider] +'" async defer></script>'
          $('body').append(gmap_script)
        }
        L.gridLayer.googleMutant({
          type: 'roadmap',
          styles: this.styles.googlemaps
        }).addTo(this.map)
      }
      if(this.tiles_provider == 'maptiler') {
        const url = 'https://api.maptiler.com/maps/basic/{z}/{x}/{y}.png?key=' + this.tokens[this.tiles_provider]
        const attribution = '© MapTiler © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
        L.tileLayer(url, {
          attribution: attribution,
          maxZoom: 18,
          noWrap: true
        }).addTo(this.map)
      }
      if(this.tiles_provider == 'mapbox') {
        let url
        if(this.styles.mapbox.username && this.styles.mapbox.style_id) {
          const mapbox_style = this.styles.mapbox
          url = 'https://api.mapbox.com/styles/v1/' + mapbox_style.username + '/' + mapbox_style.style_id + '/tiles/{z}/{x}/{y}?access_token=' + this.tokens[this.tiles_provider]
        } else {
          url = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + this.tokens[this.tiles_provider]
        }
        const attribution = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
        L.tileLayer(url, {
          attribution: attribution,
          maxZoom: 17,
          id: 'mapbox.streets'
        }).addTo(this.map)
      }
    }

    function createMarker(index, image, app) {
      let lightboxable
      app.lightboxable ? lightboxable = 'block' : lightboxable = 'none'
      let image_marker_markup = [
        '<div class="image-marker-container" data-image-index="' + index + '">',
          '<div class="rounded-image" style="background-image: url(' + image.sizes.medium + ')">',
          '<img src="' + image.sizes.large + '" srcset="' + image.file_srcset + '" sizes="' + image.file_sizes + '" style="display: ' + lightboxable + '">',
          '</div>',
        '</div>'
      ]
      image_marker_markup = image_marker_markup.join('')

      const icon = L.divIcon({
        className: 'image-marker',
        iconSize: [40,40],
        html: image_marker_markup
      })

      const gps_as_array = image.data.gps.split(',')
      const pos = gps_as_array

      return L.marker(pos, { icon: icon })
    }

    this.addMarkers = function() {
      this.data.forEach((image, index) => {
        createMarker(index, image, this).addTo(this.map)
      })
    }

    this.fitMarkers = function() {
      const latLngArray = []
      this.data.forEach(image => {
        const imageLatLng = image.data.gps.split(',')
        latLngArray.push(imageLatLng)
      })

      if(latLngArray.length > 0) {
        const bounds = new L.LatLngBounds(latLngArray)
        this.map.fitBounds(bounds)
      }
    }
  }

  window.mglInitMaps = function() {

    if (typeof mgl_map_images !== 'undefined') {
      $('.mgl-ui-map').each(function () {
        const $map_container = $(this)
        const $gallery_container = $map_container.closest('.mgl-map')
        const id = 'map-' + $gallery_container.attr('id').replace('mgl-gallery-', '')

        if (window.mgl_map_images[$gallery_container.attr('id')].length > 0) {
          $gallery_container.css('height', window.mgl_map.height + 'px')

          $map_container.attr('id', id)

          const map_settings = {
            container_id: id,
            center: [51.505, -0.09],
            tiles_provider: window.mgl_map.default_engine
          }

          const map_data = window.mgl_map_images[$gallery_container.attr('id')]

          const mapController = new MapController(map_settings, map_data)

          mapController.createMap()
          mapController.addTilesLayer()
          mapController.addMarkers()
          mapController.fitMarkers()
        } else {
          console.error('Gallery with id ' + $gallery_container.attr('id') +' does\'t have any photos with valid GPS.')
        }
      })
    } else {
      console.error('mgl_map_images is undefined. It might be because your photos don\'t have valid GPS exif data?')
    }
  }

  if ($('.mgl-ui-map').length) {
    window.mglInitMaps()
    $(document.body).trigger('post-load')
  }

})