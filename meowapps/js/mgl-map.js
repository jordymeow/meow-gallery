jQuery(document).ready(function ($) {

  var MapController = function(map_settings, data) {
    // Map Related
    this.data = data,
    this.container_id = map_settings.container_id
    this.map = null
    this.center = map_settings.center
    this.tiles_provider = map_settings.tiles_provider
    this.lightboxable = true
    this.tokens = {
      googlemaps: mgl_map.googlemaps.api_key,
      mapbox: mgl_map.mapbox.api_key,
      maptiler: mgl_map.maptiler.api_key
    }
    this.styles = {
      mapbox: mgl_map.mapbox.style,
      googlemaps: mgl_map.googlemaps.style
    }
    // Slider Related


    this.createMap = function() {
      if (L.DomUtil.get(this.container_id) != null) {
        L.DomUtil.get(this.container_id)._leaflet_id = null
        this.map = L.map(this.container_id).setView(this.center, 13)
      } 
    }

    this.addTilesLayer = function() {
      if (this.tiles_provider == 'openstreetmap') {
        var url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        var attribution = 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
        L.tileLayer(url, {
          attribution: attribution,
          maxZoom: 18,
          noWrap: true,
          style: 'https://openmaptiles.github.io/osm-bright-gl-style/style-cdn.json'
        }).addTo(this.map);
      }
      if(this.tiles_provider == 'googlemaps') {
        // Add the Google Maps JS script on the page if not there yet
        if (typeof google != 'object' || typeof google.maps != 'object') {
          var gmap_script = '<script src="https://maps.googleapis.com/maps/api/js?key='+ this.tokens[this.tiles_provider] +'" async defer></script>'
          $('body').append(gmap_script)
          L.gridLayer.googleMutant({
            type: 'roadmap',	// valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
            styles: this.styles.googlemaps
          }).addTo(this.map)
        }
      }
      if(this.tiles_provider == 'maptiler') {
        var url = 'https://api.maptiler.com/maps/basic/{z}/{x}/{y}.png?key=' + this.tokens[this.tiles_provider]
        var attribution = '© MapTiler © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
        L.tileLayer(url, {
          attribution: attribution,
          maxZoom: 18,
          noWrap: true,
        }).addTo(this.map)
      }
      if(this.tiles_provider == 'mapbox') {
        if(this.styles.mapbox.username && this.styles.mapbox.style_id) {
          var mapbox_style = this.styles.mapbox
          var url = 'https://api.mapbox.com/styles/v1/' + mapbox_style.username + '/' + mapbox_style.style_id + '/tiles/{z}/{x}/{y}?access_token=' + this.tokens[this.tiles_provider]
        } else {
          var url = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + this.tokens[this.tiles_provider]
        }
        var attribution = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
        L.tileLayer(url, {
          attribution: attribution,
          maxZoom: 18,
          id: 'mapbox.streets'
        }).addTo(this.map)
      }
    }

    function createMarker(index, image, app) {
      var lightboxable
      app.lightboxable ? lightboxable = 'inline-block' : lightboxable = 'none'
      var image_marker_markup = [
        '<div class="image-marker-container" data-image-index="' + index + '">',
          '<div class="rounded-image" style="background-image: url(' + image.sizes.medium + ')">',
          '<img src="' + image.sizes.large + '" srcset="' + image.file_srcset + '" sizes="' + image.file_sizes + '" style="display: ' + lightboxable + '">',
          '</div>',
        '</div>',
      ]
      image_marker_markup = image_marker_markup.join('')

      var icon = L.divIcon({
        className: 'image-marker',
        iconSize: null,
        html: image_marker_markup
      })

      var gps_as_array = image.data.gps.split(',')
      var pos = gps_as_array

      return L.marker(pos, { icon: icon })
    }

    this.addMarkers = function() {
      this.data.forEach((index,image) => {
        createMarker(image, index, this).addTo(this.map)
      })
    }

    this.fitMarkers = function() {
      var latLngArray = []
      this.data.forEach(image => {
        var imageLatLng = image.data.gps.split(',')
        latLngArray.push(imageLatLng)
      })

      var bounds = new L.LatLngBounds(latLngArray)

      this.map.fitBounds(bounds)
    }
  }

  window.mglInitMaps = function() {
    if (typeof mgl_map_images !== 'undefined') {
      $('.mgl-ui-map').each(function () {
        var $map_container = $(this)
        var $gallery_container = $map_container.parent('.mgl-map')


        $gallery_container.css('height', mgl_map.height + 'px')

        // Add ID to the map_container
        var id = 'map-' + $gallery_container.attr('id').replace('mgl-gallery-', '')
        $map_container.attr('id', id)

        var map_settings = {
          container_id: id,
          center: [51.505, -0.09],
          tiles_provider: mgl_map.default_engine,
        }

        var map_data = mgl_map_images[$gallery_container.attr('id')]

        var mapController = new MapController(map_settings, map_data)

        mapController.createMap()
        mapController.addTilesLayer()
        mapController.addMarkers()
        mapController.fitMarkers()
      })
    } else {
      console.error('mgl_map_images is undefined. Ask Jordy.')
    }
  }

  if ($('.mgl-ui-map').length) {
    mglInitMaps()
  }

})