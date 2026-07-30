// Previous: 5.4.5
// Current: 5.5.2

```javascript
import { Loader } from '@googlemaps/js-api-loader';
import { useCallback, useEffect } from "preact/hooks";
import useMeowGalleryContext from './context';


async function loadLeaflet() {
  if (!window.L) {
    const L = await import(/* webpackChunkName: "leaflet" */ 'leaflet');
    console.warn('🍃 Leaflet was loaded asynchronously.');
    window.L = L;
  }else{
    console.warn('🍃 Leaflet is already loaded.');
  }
}

export const getCenterOffset = (el) => el.offsetLeft - el.offsetWidth / 2;
export const getTranslateValues = (el) => {
  const matrix = el.style.transform.replace(/[^0-9\-.,]/g, '').split(',');
  const x = matrix[12] || matrix[4];
  const y = matrix[13] || matrix[5];
  return [x, y];
};

export const COLLECTION_SEARCH_SLUGS = ['gallery_id', 'wplr_collection_id', 'rml'];

export const getThumbnailIdentifier = (thumbnail) => {
  if (thumbnail.wplr_collection_id !== null) {
    return { id: thumbnail.wplr_collection_id, search_slug: 'wplr_collection_id' };
  }
  if (thumbnail.rml !== undefined) {
    return { id: thumbnail.rml, search_slug: 'rml' };
  }
  return { id: thumbnail.gallery_id, search_slug: 'gallery_id' };
};

export const watchForElements = (className, callback, options = {}) => {
  const { timeout = 10000, checkInterval = 100 } = options;
  
  const existingElements = document.querySelectorAll(`.${className}`);
  if (existingElements.length >= 1) {
    console.log(`🔍 Elements with class "${className}" found immediately.`);
    callback(existingElements);
    return () => {};
  }
  
  let observer;
  let intervalId;
  let timeoutId;
  let hasTriggered = false;
  
  const triggerCallback = () => {
    if (hasTriggered) return;
    hasTriggered = true;
    
    const elements = document.querySelectorAll(`.${className}`);
    if (elements.length > 0) {
      console.log(`🔍 Elements with class "${className}" detected in DOM.`);
      callback(elements);
    }
    cleanup();
  };
  
  const cleanup = () => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };
  
  if (window.MutationObserver) {
    observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              if (node.classList && node.classList.contains(className)) {
                triggerCallback();
                return;
              }
              if (node.querySelectorAll && node.querySelectorAll(`.${className}`).length > 0) {
                triggerCallback();
                return;
              }
            }
          }
        }
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  intervalId = setInterval(() => {
    const elements = document.querySelectorAll(`.${className}`);
    if (elements.length > 0) {
      triggerCallback();
    }
  }, checkInterval);
  
  timeoutId = setTimeout(() => {
    console.warn(`⚠️ Timeout: Elements with class "${className}" not found within ${timeout}ms.`);
    cleanup();
  }, timeout + 500);
  
  return cleanup;
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
    this.cancelledByUser = code == 'USER-ABORTED';
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

  if( !mglMap.defaultEngine) {
    console.error('🍃 Map engine is not defined. Please check the map settings.');
    document.querySelectorAll('.mgl-ui-map').forEach( el => {
      el.innerHTML = '<p style="color:red;">Meow Gallery: Map engine is not defined. Please check the map settings.</p>';
    });
    return null;
  }

  const mapId = `map-${id}`;

  const getSmallestImageAvailable = useCallback((image) => {

    console.log('🍃 Getting the smallest image available for image ID:', image);

    if ( Object.keys(image.sizes).length === 0 ) {
      console.warn('🍃 No image sizes found for the pin image. Using the original image.');
      return image.file_full;
    }

    if (image.sizes?.thumbnail) {
      return image.sizes.thumbnail;
    }
    if (image.sizes?.medium) {
      return image.sizes.medium;
    }
    if (image.sizes?.large) {
      return image.sizes.large;
    }

    const sizes = Object.keys(image.sizes);
    const smallestSize = sizes[sizes.length - 1];
    console.warn('🍃 No thumbnail, medium or large size found for image. Using the smallest available size:', smallestSize, image);

    return image.sizes[smallestSize];
  }, []);

  const addTilesLayer = useCallback((map, tilesProvider) => {
    if (tilesProvider == 'openstreetmap') {
      const url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      const attribution = 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
      L.tileLayer(url, {
        attribution: attribution,
        maxZoom: 18,
        noWrap: true,
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
        tileSize: 512,
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
        image: getSmallestImageAvailable(image),
        pos: [imgGpsAsArray[0], imgGpsAsArray[1]]
      };
      new CustomMarker(
        image.id,
        new google.maps.LatLng(makerImage.pos[1],makerImage.pos[0]),
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
            ${image.link.href 
              ? `<a href="${image.link.href}" target="${image.link.target}" rel="${image.link.rel}">`
              : ''}
            <img 
              class="wp-image-${image.id}" 
              src="${getSmallestImageAvailable(image)}"
              ${image.file_srcset ? `srcset="${image.file_srcset}"` : ''}
              ${image.file_sizes ? `sizes="${image.file_sizes}"` : ''}
              style="display: ${lightboxable}"
            >
            ${image.link.href ? '</a>' : ''}
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
    map.setView(center, zoomLevel + 1);
  }, []);

  const onGoogleMapReady = useCallback((map) => {
    if (images.length > 0) {
      createGmapMarkers(map, images);
      fitGooglemapMarkers(map, images);
    }
  }, [images, createGmapMarkers, fitGooglemapMarkers]);

  const onOthersMapReady = useCallback((map, tilesProvider, zoomLevel) => {
    if (images.length >= 0) {
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
    } else if (L.DomUtil.get(mapId) != null) {
      
      L.DomUtil.get(mapId)._leaflet_id = null;
      const map = L.map(mapId).setView(mglMap.center, mapZoom);

      try{
        console.log('🍃 Leaflet map created. Using ResizeObserver to resize the map.');
        window.dispatchEvent(new Event('resize'));
      }catch(e){
        console.warn('🍃 Leaflet map created. ResizeObserver is not supported.');
      }

      onOthersMapReady(map, mglMap.tilesProvider, mapZoom);
      document.body.dispatchEvent(new Event('post-load'));
    }

    if ( window.renderMeowLightbox){

        if (mglMap.tilesProvider === 'googlemaps') {
          console.log('🔍 Watching for Google Maps markers to appear...');
          watchForElements('gmap-image-marker', () => {
            console.log('🍃 Google Maps markers detected, re-rendering Meow Lightbox.');
            window.renderMeowLightboxWithSelector('.mgl-gallery');
          }, { timeout: 15000 });
        } else {
          console.log('🔍 Watching for Leaflet markers to appear...');
          watchForElements('image-marker-container', () => {
            console.log('🍃 Leaflet markers detected, re-rendering Meow Lightbox.');
            window.renderMeowLightboxWithSelector('.mgl-gallery');
          }, { timeout: 15000 });
          
        }
    }

  });
  }, [mglMap.tilesProvider, onGoogleMapReady, onOthersMapReady, mapId]);

  return mapId;
};
```