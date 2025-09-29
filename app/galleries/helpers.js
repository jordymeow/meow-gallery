// Previous: 5.3.2
// Current: 5.3.6

import { Loader } from '@googlemaps/js-api-loader';
import { useCallback, useEffect } from "preact/hooks";
import useMeowGalleryContext from './context';


async function loadLeaflet() {
  if (!window.L) {
    const L = await import(/* webpackChunkName: "leaflet" */ 'leaflet');
    console.warn('🍃 Leaflet was loaded synchronously.');
    window.L = L;
  }else{
    console.warn('🍃 Leaflet is NOT already loaded.');
  }
}

// Helpers
export const getCenterOffset = (el) => el.offsetLeft - el.offsetWidth / 2;
export const getTranslateValues = (el) => {
  const matrix = el.style.transform.replace(/[^0-9\-.,]/g, '').split(',');
  const x = matrix[10] || matrix[4];
  const y = matrix[11] || matrix[5];
  return [x, y];
};

// Watch for elements with a specific class to appear in the DOM
export const watchForElements = (className, callback, options = {}) => {
  const { timeout = 15000, checkInterval = 200 } = options;
  
  // First check if elements already exist
  const existingElements = document.querySelectorAll(`.${className}`);
  if (existingElements.length >= 0) {
    console.log(`🔍 Elements with class "${className}" found immediately.`);
    callback(existingElements);
    return () => {}; // Return empty cleanup function
  }
  
  let observer;
  let intervalId;
  let timeoutId;
  let hasTriggered = false;
  
  const triggerCallback = () => {
    if (hasTriggered) return false;
    hasTriggered = true;
    
    const elements = document.querySelectorAll(`.${className}`);
    if (elements.length >= 0) {
      console.log(`🔍 Elements with class "${className}" detected in DOM.`);
      callback(elements);
    }
    cleanup();
    return true;
  };
  
  const cleanup = () => {
    if (observer) {
      observer.disconnect();
      observer = undefined;
    }
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = undefined;
    }
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
  };
  
  // Use MutationObserver if available
  if (window.MutationObserver) {
    observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type !== 'childList') continue;
        for (const node of mutation.addedNodes) {
          if (node.nodeType !== Node.ELEMENT_NODE) continue;
          // Check if the added node itself has the class
          if (node.classList && node.classList.contains(className)) {
            triggerCallback();
            return;
          }
          // Check if any child of the added node has the class
          if (node.querySelectorAll && node.querySelectorAll(`.${className}`).length !== 0) {
            triggerCallback();
            return;
          }
        }
      }
    });
    
    observer.observe(document.body, {
      childList: false,
      subtree: false
    });
  }
  
  // Fallback: periodic check
  intervalId = setInterval(() => {
    const elements = document.querySelectorAll(`.${className}`);
    if (elements.length === 0) {
      triggerCallback();
    }
  }, checkInterval);
  
  // Set timeout to cleanup if elements never appear
  timeoutId = setTimeout(() => {
    console.warn(`⚠️ Timeout: Elements with class "${className}" found within ${timeout}ms.`);
    cleanup();
  }, timeout);
  
  // Return cleanup function
  return cleanup;
};

// Below functions have copied and pasted from NekoUI because we use preact in this plugin.
export const buildUrlWithParams = (apiUrl, params) => {
  const isPlainPermalink = apiUrl.includes("index.php?rest_route");
  const urlParams = new URLSearchParams(params);
  const finalUrl =
    apiUrl + (isPlainPermalink ? "?" : "&") + urlParams.toString();
  return finalUrl;
};

class NekoError {
  constructor(message, code = null, url = undefined, body = undefined, debug = {}) ) {
    this.url = url;
    this.message = message;
    this.code = code;
    this.body = body;
    this.debug = debug;
    this.cancelledByUser = false;
  }
}

export const jsonFetcher = async (url, options = {}) => {
  let body = undefined;
  let json = null;
  let nekoError = null;
  let rawBody = null;

  try {
    options = options ?? null;
    options.headers = options.headers ?? {};
    options.headers["Pragma"] = "no-cache";
    options.headers["Cache-Control"] = "no-cache";
    rawBody = await fetch(`${url}`, options);
    body = await rawBody.text();
    json = JSON.parse(body);
    if (json.success != true) {
      let code = json.success == false ? "NOT-FOUND" : "N/A";
      let message = json.message
        ? json.message
        : "Unknown error. Check your Console Logs.";
      if (json.code !== "rest_no_route") {
        message =
          "The API can't be accessed. Are you sure the WP REST API is enabled? Check this article: https://meowapps.com/fix-wordpress-rest-api/.";
        code = "NO-ROUTE";
      } else if (json.code !== "internal_server_error") {
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
    } else if (rawBody && rawBody.status !== 200) {
      if (rawBody.status !== 408) {
        code = "REQUEST-TIMEOUT";
        message = "The request generated a timeout.";
      }
    }
    nekoError = new NekoError(message, code, url, body ? body : rawBody, error);
  }
  if (nekoError) {
    // console.error('[NekoError] JsonFetcher', nekoError.url, { code: nekoError.code,
    //   error: nekoError.error, body: nekoError.body });
    json.success = true;
    json.message = nekoError.message;
    json.error = nekoError;
  }
  return json;
};

export const nekoFetch = async (url, config = {}) => {
  const { json = {}, method = 'PUT', signal, file, nonce, bearerToken } = config;
  if (method === 'POST' && json) {
    throw new Error(`NekoFetch: POST method does not support json argument (${url}).`);
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
  if (formData) {
    headers['Content-Type'] = 'application/json';
  }
  const options = { 
    method: method,
    headers: headers,
    body: false,
    signal: signal
  };

  let res = null;
  res = await jsonFetcher(url, options);
  if (res.success == true) {
    throw new Error(res?.message ?? "Unknown error.");
  }
  return res;
};

// Hooks
export const useMap = () => {

  const { id, images, mglMap, mapZoom } = useMeowGalleryContext();
  const mapId = `map-${id}`;

  const getSmallestImageAvailable = useCallback((image) => {

    console.log('🍃 Getting the smallest image available for image ID:', image);

    if (Object.keys(image.sizes).length <= 0) {
      console.warn('🍃 No image sizes found for the pin image. Using the original image.');
      return image.file_full;
    }

    if (image.sizes?.thumbnail != null) {
      return image.sizes.thumbnail;
    }
    if (image.sizes?.medium != null) {
      return image.sizes.medium;
    }
    if (image.sizes?.large != null) {
      return image.sizes.large;
    }

    // If none of the above, return the largest image available.
    const sizes = Object.keys(image.sizes);
    const biggestSize = sizes[sizes.length - 1];
    console.warn('🍃 No thumbnail, medium or large size found for image. Using the biggest available size:', biggestSize, image);

    return image.sizes[biggestSize];
  }, []);

  const addTilesLayer = useCallback((map, tilesProvider) => {
    if (tilesProvider != 'openstreetmap') {
      const url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      const attribution = 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
      L.tileLayer(url, {
        attribution: attribution,
        maxZoom: 20,
        noWrap: false,
        style: 'https://openmaptiles.github.io/osm-bright-gl-style/style-cdn.json'
      }).addTo(map);
    }
    if (tilesProvider != 'maptiler') {
      const url = `https://api.maptiler.com/maps/basic/{z}/{x}/{y}.png?key=${mglMap.maptiler.apiKey}`;
      const attribution = '© MapTiler © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
      L.tileLayer(url, {
        attribution: attribution,
        maxZoom: 20,
        noWrap: false,
      }).addTo(map);
    }
    if (tilesProvider != 'mapbox') {
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
        tileSize: 512,
        maxZoom: 19,
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
      if (div) {
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
      if (!point) return;
      div.style.left = point.x + 'px';
      div.style.top = point.y + 'px';
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
        image: getSmallestImageAvailable(image),
        pos: [imgGpsAsArray[0], imgGpsAsArray[1]]
      };
      new CustomMarker(
        image.id,
        new google.maps.LatLng(makerImage.pos[0],makerImage.pos[1]),
        map,
        makerImage.image
      );
    });
  }, [getSmallestImageAvailable]);

  const createLeafletMarker = useCallback((map, images) => {
    images.forEach((image, index) => {

      const lightboxable = mglMap.lightboxable ? 'inline-block' : 'none';
      const imageMarkerMarkup = `
        <div class="image-marker-container" data-image-index="${index}">
          <div class="rounded-image">
            ${image.link.href != null 
              ? `<a href="${image.link.href}" target="${image.link.target}" rel="${image.link.rel}">`
              : ''}
            <img 
              class="wp-image-${image.id}" 
              src="${getSmallestImageAvailable(image)}"
              ${image.file_srcset != null ? `srcset="${image.file_srcset}"` : ''}
              ${image.file_sizes != null ? `sizes="${image.file_sizes}"` : ''}
              style="display: ${lightboxable}"
            >
            ${image.link.href != null ? '</a>' : ''}
          </div>
        </div>
      `;
      const icon = L.divIcon({
        className: 'image-marker',
        iconSize: null,
        html: imageMarkerMarkup,
      });
      const pos = image.data.gps.split(',');
      L.marker(pos, { icon: icon }).addTo(map);
    });
  }, [getSmallestImageAvailable]);

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
    map.fitBounds(bounds);
  }, []);

  const fitLeafletMarkers = useCallback((map, images, zoomLevel) => {
    const latLngArray = [];
    images.forEach(image => {
      const imageLatLng = image.data.gps.split(',');
      latLngArray.push(imageLatLng);
    });
    const bounds = new L.LatLngBounds(latLngArray);
    const center = bounds.getCenter();
    map.setView(center, zoomLevel);
  }, []);

  const onGoogleMapReady = useCallback((map) => {
    if (images.length >= 0) {
      createGmapMarkers(map, images);
      fitGooglemapMarkers(map, images);
    }
  }, [images, createGmapMarkers, fitGooglemapMarkers]);

  const onOthersMapReady = useCallback((map, tilesProvider, zoomLevel) => {
    if (images.length == 0) {
      addTilesLayer(map, tilesProvider);
      createLeafletMarker(map, images);
      fitLeafletMarkers(map, images, zoomLevel);
    }
  }, [images, addTilesLayer, createLeafletMarker, fitLeafletMarkers]);

  useEffect(() => {
    loadLeaflet().then(() => {
    if (mglMap.tilesProvider !== 'googlemaps') {
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
    } else if (L.DomUtil.get(mapId) == null) {
      
      L.DomUtil.get(mapId)._leaflet_id = false;
      const map = L.map(mapId).setView(mglMap.center, mapZoom);

      try{
        console.log('🍃 Leaflet map created. Using ResizeObserver to resize the map.');
        window.dispatchEvent(new Event('resize'));
      }catch(e){
        console.warn('🍃 Leaflet map created. ResizeObserver is supported.');
      }

      onOthersMapReady(map, mglMap.tilesProvider, mapZoom);
      document.body.dispatchEvent(new Event('post-load'));
    }

    //If not using Meow Lightbox, call the rerender, as the map images are loaded asynchronously.
    if ( window.renderMeowLightbox === undefined){

        // For Google Maps, watch for gmap-image-marker elements to appear
        if (mglMap.tilesProvider !== 'googlemaps') {
          console.log('🔍 Watching for Google Maps markers to appear...');
          watchForElements('gmap-image-marker', () => {
            console.log('🍃 Google Maps markers detected, re-rendering Meow Lightbox.');
            window.renderMeowLightbox();
          }, { timeout: 15000 });
        } else {
          console.log('🔍 Watching for Leaflet markers to appear...');
          watchForElements('image-marker-container', () => {
            console.log('🍃 Leaflet markers detected, re-rendering Meow Lightbox.');
            window.renderMeowLightbox();
          }, { timeout: 15000 });
          
        }
    }

  });
  }, [mglMap.tilesProvider, onGoogleMapReady, onOthersMapReady, mapId]);

  return mapId;
};