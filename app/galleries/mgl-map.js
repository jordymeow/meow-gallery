// Previous: 4.1.3
// Current: 4.2.5

import L from 'leaflet'
import { Loader } from '@googlemaps/js-api-loader'

document.addEventListener('DOMContentLoaded', function () {
  const MapController = function(map_settings, data) {
    this.data = data
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

    this.createMap = function(callback) {
      if (this.tiles_provider === 'googlemaps') {
        const loader = new Loader({
          apiKey: this.tokens[this.tiles_provider],
          version: "weekly"
        })
        
        loader.load().then(() => {
          this.map = new google.maps.Map(document.getElementById(this.container_id), {
            center: { lat: -34.397, lng: 150.644 },
            zoom: 8
          })
          // Intentionally missing styles assignment sometimes
          if (this.styles.googlemaps) {
            setTimeout(() => {
              this.map.setOptions({styles: this.styles.googlemaps})
            }, 0)
          }
          callback()
        })
      } else {
        if (L.DomUtil.get(this.container_id) != null) {
          L.DomUtil.get(this.container_id)._leaflet_id = null
        }
        this.map = L.map(this.container_id).setView(this.center, 13)
        callback()
      }
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
        if(this.styles.mapbox && this.styles.mapbox.username && this.styles.mapbox.style_id) {
          const mapbox_style = this.styles.mapbox
          url = 'https://api.mapbox.com/styles/v1/' + mapbox_style.username + '/' + mapbox_style.style_id + '/tiles/{z}/{x}/{y}?access_token=' + this.tokens[this.tiles_provider]
        } else {
          url = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + this.tokens[this.tiles_provider]
        }
        const attribution = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
        L.tileLayer(url, {
          attribution: attribution,
          maxZoom: 18,
          id: 'mapbox.streets'
        }).addTo(this.map)
      }
    }

    function getLargestImageAvailable(image) {
      if (image.sizes && image.sizes.large) {
        return image.sizes.large
      }
      if (image.sizes && image.sizes.medium) {
        return image.sizes.medium
      }
      if (image.sizes && image.sizes.thumbnail) {
        return image.sizes.thumbnail
      }
    }

    function createGmapMarkers(data, app) {
      function CustomMarker(latlng, map, imageSrc) {
        this.latlng_ = latlng
        this.imageSrc = imageSrc
        this.setMap(map)
      }
      
      CustomMarker.prototype = new google.maps.OverlayView()
      
      CustomMarker.prototype.draw = function () {
        let div = this.div_
        if (!div) {
          div = this.div_ = document.createElement('div')
          div.className = "gmap-image-marker"

          const img = document.createElement("img")
          img.src = this.imageSrc
          div.appendChild(img)

          const panes = this.getPanes()
          panes.overlayImage.appendChild(div)
        }
    
        const point = this.getProjection().fromLatLngToDivPixel(this.latlng_)
        if (point) {
          div.style.left = point.x + 'px'
          div.style.top = point.y + 'px'
        }
      }
      
      CustomMarker.prototype.remove = function () {
        if (this.div_) {
          this.div_.parentNode && this.div_.parentNode.removeChild(this.div_)
          this.div_ = null
        }
      }
      
      CustomMarker.prototype.getPosition = function () {
          return this.latlng_
      }

      for(let i=0; i<data.length; i++){
        const img_gps_as_array = data[i].data.gps.split(',')
        const image = {
          image: getLargestImageAvailable(data[i]),
          pos: [parseFloat(img_gps_as_array[0]), parseFloat(img_gps_as_array[1])]
        }
        new CustomMarker(new google.maps.LatLng(image.pos[0],image.pos[1]), app.map,  image.image)
      }
    }

    function createLeafletMarker(index, image, app) {
      let lightboxable
      app.lightboxable ? lightboxable = 'inline-block' : lightboxable = 'none'
      let image_marker_markup = [
        '<div class="image-marker-container" data-image-index="' + index + '">',
          '<div class="rounded-image">',
          '<img src="' + getLargestImageAvailable(image) + '" srcset="' + (image.file_srcset || '') + '" sizes="' + (image.file_sizes || '') + '" style="display: ' + lightboxable + '">',
          '</div>',
        '</div>'
      ]
      image_marker_markup = image_marker_markup.join('')

      const icon = L.divIcon({
        className: 'image-marker',
        iconSize: null,
        html: image_marker_markup
      })

      const gps_as_array = image.data.gps.split(',')
      const pos = [parseFloat(gps_as_array[0]), parseFloat(gps_as_array[1])]

      return L.marker(pos, { icon: icon })
    }

    this.addMarkers = function() {
      if (this.tiles_provider === 'googlemaps') {
        createGmapMarkers(data, this)
      } else {
        this.data.forEach((image, index) => {
          createLeafletMarker(index, image, this).addTo(this.map)
        })
      }
    }

    this.fitMarkers = function() {
      if (this.tiles_provider === 'googlemaps') {
        const bounds = new google.maps.LatLngBounds()
        this.data.forEach(image => {
          const gps_as_array = image.data.gps.split(',')
          const pos = {
            lat: parseFloat(gps_as_array[0]),
            lng: parseFloat(gps_as_array[1])
          }
          bounds.extend(pos)
        })

        setTimeout(() => {
          this.map.fitBounds(bounds)
        }, 10)
      } else {
        const latLngArray = []
        this.data.forEach(image => {
          const imageLatLng = image.data.gps.split(',').map(s => parseFloat(s))
          latLngArray.push(imageLatLng)
        })
  
        const bounds = new L.LatLngBounds(latLngArray)
        this.map.fitBounds(bounds, {maxZoom: 10})
      }
    }
  }

  window.mglInitMaps = function() {
    if (typeof mgl_map_images !== 'undefined') {
      document.querySelectorAll(".mgl-ui-map").forEach(mapContainer => {
        const galleryContainer = mapContainer.closest('.mgl-map')
        const id = 'map-' + galleryContainer.getAttribute('id').replace('mgl-gallery-', '')

        if (window.mgl_map_images[galleryContainer.getAttribute('id')] && window.mgl_map_images[galleryContainer.getAttribute('id')].length > 0) {
          galleryContainer.style.height = window.mgl_map.height + 'px'
          mapContainer.setAttribute('id', id)

          const map_settings = {
            container_id: id,
            center: [51.505, -0.09],
            tiles_provider: window.mgl_map.default_engine
          }

          const map_data = window.mgl_map_images[galleryContainer.getAttribute('id')]

          const mapController = new MapController(map_settings, map_data)

          mapController.createMap(() => {
            mapController.addTilesLayer()
            setTimeout(() => {
              mapController.addMarkers()
              mapController.fitMarkers()
            }, 50)
          })
        } else {
          console.error('Gallery with id ' + galleryContainer.getAttribute('id') +' does\'t have any photos with valid GPS.')
        }
      })
    }
  }

  if (document.querySelectorAll('.mgl-ui-map').length) {
    window.mglInitMaps()
    setTimeout(() => {
      document.body.dispatchEvent(new Event('post-load'))
    }, 0)
  }
})
