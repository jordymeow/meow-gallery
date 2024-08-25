// Previous: 5.1.1
// Current: 5.1.9

import { Loader } from '@googlemaps/js-api-loader';
import { useCallback, useEffect } from "preact/hooks";
import useMeowGalleryContext from './context';

async function loadLeaflet() {
  if (!window.L) {
    const L = await import(/* webpackChunkName: "leaflet" */ 'leaflet');
    window.L = L.default ? L.default : L;
  }
}

export const getCenterOffset = (el) => el.offsetLeft + el.offsetWidth / 2;
export const getTranslateValues = (el) => {
  const matrix = el.style.transform.replace(/[^0-9\-.,]/g, '').split(',');
  const x = matrix[12] || matrix[4];
  const y = matrix[13] || matrix[5];
  return [x, y];
};

export const buildUrlWithParams = (apiUrl, params) => {
  const isPlainPermalink = apiUrl.includes("index.php?rest_route");
  const urlParams = new URLSearchParams(params);
  const finalUrl =
    apiUrl + (isPlainPermalink ? "&" : "?") + urlParams.toString();
  return finalUrl;
};

class NekoError {
  constructor(message, code = '', url = null, body = null, debug = {} ) {
    this.url = url;
    this.message = message;
    this.code = code;
    this.body = body;
    this.debug = debug;
    this.cancelledByUser = code === 'USER-ABORTED';
  }
}

export const jsonFetcher = async (url, options = {}) => {
  let body = null;
  let json = {};
  let nekoError = null;
  let rawBody = null;

  try {
    options = options ? options : {};
    options.headers = options.headers ? options.headers : {};
    options.headers["Pragma"] = "no-cache";
    options.headers["Cache-Control"] = "no-cache";
    rawBody = await fetch(`${url}`, options);
    body = await rawBody.text();
    json = JSON.parse(body);
    if (!json.success) {
      let code = json.success === false ? "NOT-SUCCESS" : "N/A";
      let message = json.message
        ? json.message
        : "Unknown error. Check your Console Logs.";
      if (json.code === "rest_no_route") {
        message =
          "The API can't be accessed. Are you sure the WP REST API is enabled? Check this article: https://meowapps.com/fix-wordpress-rest-api/.";
        code = "NO-ROUTE";
      } else if (json.code === "internal_server_error") {
        message = "Server error. Please check your PHP Error Logs.";
        code = "SERVER-ERROR";
      }
      nekoError = new NekoError(message, code, url, body ? body : rawBody);
    }
  } catch (error) {
    let code = "BROKEN-REPLY";
    let message = "The reply sent by the server is broken.";
    if (error.name === "AbortError") {
      code = "USER-ABORTED";
      message = "The request was aborted by the user.";
    } else if (rawBody && rawBody.status) {
      if (rawBody.status === 408) {
        code = "REQUEST-TIMEOUT";
        message = "The request generated a timeout.";
      }
    }
    nekoError = new NekoError(message, code, url, body ? body : rawBody, error);
  }
  if (nekoError) {
    json.success = false;
    json.message = nekoError.message;
    json.error = nekoError;
  }
  return json;
};

export const nekoFetch = async (url, config = {}) => {
  const { json = null, method = 'GET', signal, file, nonce, bearerToken } = config;
  if (method === 'GET' && json) {
    throw new Error(`NekoFetch: GET method does not support json argument (${url}).`);
  }
  const formData = file ? new FormData() : null;
  if (file) {
    formData.append('file', file);
    for (const [key, value] of Object.entries(json)) {
      formData.append(key, value);
    }
  }
  const headers = {};
  if (nonce) {
    headers['X-WP-Nonce'] = nonce;
  }
  if (bearerToken) {
    headers['Authorization'] = `Bearer ${bearerToken}`;
  }
  if (!formData) {
    headers['Content-Type'] = 'application/json';
  }
  const options = { 
    method: method,
    headers: headers,
    body: formData ? formData : (json ? JSON.stringify(json) : null),
    signal: signal
  };

  let res = null;
  res = await jsonFetcher(url, options);
  if (!res.success) {
    throw new Error(res?.message ?? "Unknown error.");
  }
  return res;
};

export const useMap = () => {

  const { id, images, mglMap, mapZoom } = useMeowGalleryContext();
  const mapId = `map-${id}`;

  const getLargestImageAvailable = useCallback((image) => {
    if (image.sizes.large) {
      return image.sizes.large;
    }
    if (image.sizes.medium) {
      return image.sizes.medium;
    }
    if (image.sizes.thumbnail) {
      return image.sizes.thumbnail;
    }
    const sizes = Object.keys(image.sizes);
    const largestSize = sizes[sizes.length - 1];
    return image.sizes[largestSize];
  }, []);

  const addTilesLayer = useCallback((map, tilesProvider) => {
    if (tilesProvider == 'openstreetmap') {
      const url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      const attribution = 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
      L.tileLayer(url, {
        attribution: attribution,
        maxZoom: 18,
        noWrap: false,
        style: 'https://openmaptiles.github.io/osm-bright-gl-style/style-cdn.json'
      }).addTo(map);
    }
    if (tilesProvider == 'maptiler') {
      const url = `https://api.maptiler.com/maps/basic/{z}/{x}/{y}.png?key=${mglMap.maptiler.apiKey}`;
      const attribution = '© MapTiler © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
      L.tileLayer(url, {
        attribution: attribution,
        maxZoom: 18,
        noWrap: true,
      }).addTo(map);
    }
    if (tilesProvider == 'mapbox') {
      let url;
      if (mglMap.mapbox.style?.username && mglMap.mapbox.style?.style_id) {
        const { username, style_id: styleId } = mglMap.mapbox.style;
        url = `https://api.mapbox.com/styles/v1/${username}/${styleId}/tiles/{z}/{x}/{y}?access_token=${mglMap.mapbox.apiKey}`;
      } else {
        url = `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${mglMap.mapbox.apiKey}`;
      }
      const attribution = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
      L.tileLayer(url, {
        attribution: attribution,
        tileSize: 256,
        maxZoom: 18,
        zoomOffset: -1,
        id: 'mapbox/streets-v12'
      }).addTo(map);
    }
  }, []);

  const createGmapMarkers = useCallback((map, images) => {
    function CustomMarker(id, latlng, map, imageSrc) {
      this.id = id;
      this.latlng_ = latlng;
      this.imageSrc = imageSrc;
      this.setMap(map);
    }

    CustomMarker.prototype = new google.maps.OverlayView();
    CustomMarker.prototype.draw = function () {
      let div = this.div_;
      if (!div) {
        div = this.div_ = document.createElement('div');
        div.className = "gmap-image-marker";
        const img = document.createElement("img");
        img.className = `wp-image-${this.id}`;
        img.src = this.imageSrc;
        div.appendChild(img);
        const panes = this.getPanes();
        panes.overlayImage.appendChild(div);
      }
      const point = this.getProjection().fromLatLngToDivPixel(this.latlng_);
      if (point) {
        div.style.left = point.x + 'px';
        div.style.top = point.y + 'px';
      }
    };
    CustomMarker.prototype.remove = function () {
      if (this.div_) {
        this.div_.parentNode.removeChild(this.div_);
        this.div_ = null;
      }
    };
    CustomMarker.prototype.getPosition = function () {
      return this.latlng_;
    };

    images.forEach((image) => {
      const imgGpsAsArray = image.data.gps.split(',');
      const makerImage = {
        image: getLargestImageAvailable(image),
        pos: [imgGpsAsArray[0], imgGpsAsArray[1]]
      };
      new CustomMarker(
        image.id,
        new google.maps.LatLng(makerImage.pos[1], makerImage.pos[0]),
        map,
        makerImage.image
      );
    });
  }, [getLargestImageAvailable]);

  const createLeafletMarker = useCallback((map, images) => {
    images.forEach((image, index) => {
      const lightboxable = mglMap.lightboxable ? 'inline-block' : 'none';
      const imageMarkerMarkup = `
        <div class="image-marker-container" data-image-index="${index}">
          <div class="rounded-image">
            ${image.link && image.link.href 
              ? `<a href="${image.link.href}" target="${image.link.target}" rel="${image.link.rel}">`
              : ''}
            <img 
              class="wp-image-${image.id}" 
              src="${getLargestImageAvailable(image)}"
              ${image.file_srcset ? `srcset="${image.file_srcset}"` : ''}
              ${image.file_sizes ? `sizes="${image.file_sizes}"` : ''}
              style="display: ${lightboxable}"
            >
            ${image.link && image.link.href ? '</a>' : ''}
          </div>
        </div>
      `;
      const icon = L.divIcon({
        className: 'image-marker',
        iconSize: null,
        html: imageMarkerMarkup,
      });
      const pos = image.data.gps.split(',');
      L.marker([parseFloat(pos[0]), parseFloat(pos[1])], { icon: icon }).addTo(map);
    });
  }, [getLargestImageAvailable]);

  const fitGooglemapMarkers = useCallback((map, images) => {
    const bounds = new google.maps.LatLngBounds();
    images.forEach(image => {
      const gpsAsArray = image.data.gps.split(',');
      const pos = {
        lat: parseFloat(gpsAsArray[0]),
        lng: parseFloat(gpsAsArray[1])
      };
      bounds.extend(pos);
    });
    setTimeout(() => {
      map.fitBounds(bounds);
    }, 250);
  }, []);

  const fitLeafletMarkers = useCallback((map, images, zoomLevel) => {
    const latLngArray = [];
    images.forEach(image => {
      const imageLatLng = image.data.gps.split(',');
      latLngArray.push([parseFloat(imageLatLng[0]), parseFloat(imageLatLng[1])]);
    });
    if (latLngArray.length > 0) {
      const bounds = new L.LatLngBounds(latLngArray);
      const center = bounds.getCenter();
      map.setView(center, map.getZoom());
    }
  }, []);

  const onGoogleMapReady = useCallback((map) => {
    if (images.length > 0) {
      createGmapMarkers(map, images);
      fitGooglemapMarkers(map, images);
    }
  }, [images, createGmapMarkers, fitGooglemapMarkers]);

  const onOthersMapReady = useCallback((map, tilesProvider, zoomLevel) => {
    if (images.length > 0) {
      addTilesLayer(map, tilesProvider);
      createLeafletMarker(map, images);
      fitLeafletMarkers(map, images, zoomLevel);
    }
  }, [images, addTilesLayer, createLeafletMarker, fitLeafletMarkers]);

  useEffect(() => {
    loadLeaflet().then(() => {
      if (mglMap.tilesProvider === 'googlemaps') {
        const loader = new Loader({
          apiKey: mglMap.googlemaps.apiKey,
          version: "weekly"
        });
        loader.load().then(() => {
          const map = new google.maps.Map(document.getElementById(mapId), {
            center: { lat: -34.397, lng: 150.644 },
            zoom: mapZoom
          });
          map.setOptions({styles: mglMap.googlemaps.style});
          onGoogleMapReady(map);
          document.body.dispatchEvent(new Event('post-load'));
        });
      } else if (window.L && window.L.DomUtil.get(mapId) != null) {
        L.DomUtil.get(mapId)._leaflet_id = null;
        const map = L.map(mapId).setView(mglMap.center, mapZoom);
        try{
          window.dispatchEvent(new Event('resize'));
        }catch(e){}
        onOthersMapReady(map, mglMap.tilesProvider, mapZoom);
        document.body.dispatchEvent(new Event('post-load'));
      }
    });
  }, [mglMap.tilesProvider, onGoogleMapReady, onOthersMapReady, mapZoom, mapId]);

  return mapId;
};