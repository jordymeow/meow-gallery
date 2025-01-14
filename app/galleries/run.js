// Previous: 5.2.0
// Current: 5.2.4

import { render } from 'preact';

import { MeowGallery } from './MeowGallery.js';
import { MeowCollection } from './MeowCollection.js';

import { options, apiUrl, restNonce } from './settings.js';
import { MeowGalleryContextProvider } from './context.js';

let iframeLoadListenerAdded = false;
const initialGalleryData = new WeakMap();

const parseJSON = (jsonString, fallback = {}) => {
  try {
    return JSON.parse(jsonString) || fallback;
  } catch (error) {
    return fallback;
  }
};

const renderMeowGalleriesContent = () => {

  const iframe = document.querySelector('iframe.editor-canvas__iframe');
  const iframeDocument = iframe ? (iframe.contentDocument || iframe.contentWindow.document) : null;

  const galleryRoots = iframeDocument ? iframeDocument.querySelectorAll('.mgl-root') : document.querySelectorAll('.mgl-root');

  if (galleryRoots.length) {
    galleryRoots.forEach((galleryRoot) => {

      if (!galleryRoot.dataset.galleryOptions && initialGalleryData.has(galleryRoot)) {
        const savedData = initialGalleryData.get(galleryRoot);
        Object.keys(savedData.dataset).forEach(dataKey => {
          galleryRoot.dataset[dataKey] = savedData.dataset[dataKey];
        });
        if (!galleryRoot.querySelector('.mgl-gallery-images') && savedData.imagesContainerHTML) {
          galleryRoot.insertAdjacentHTML('beforeend', savedData.imagesContainerHTML);
        }
      }

      const galleryElement = galleryRoot.querySelector('.mgl-gallery-container');
      const imagesContainer = galleryRoot.querySelector('.mgl-gallery-images');

      const galleryOptions = parseJSON(galleryRoot?.dataset?.galleryOptions, {});
      const galleryImages = parseJSON(galleryRoot?.dataset?.galleryImages, []);
      const atts = parseJSON(galleryRoot?.dataset?.atts, {});

      if (!galleryElement) {
        return;
      }

      if (!initialGalleryData.has(galleryRoot)) {
        initialGalleryData.set(galleryRoot, {
          dataset: { ...galleryRoot.dataset },
          imagesContainerHTML: imagesContainer ? imagesContainer.outerHTML : null,
        });
      }

      if (!imagesContainer) {

        if (atts.layout === 'map') {

        }

        else if (atts.layout === 'carousel') {

        }

        else {
          return;
        }

      }

      let imagesElements = imagesContainer ? Array.from(imagesContainer.querySelectorAll(':scope > img, :scope > a')) : [];
      if (imagesElements.length === 0) {
        imagesElements = imagesContainer ? Array.from(imagesContainer.querySelectorAll(':scope > picture')) : [];
      }

      if (imagesElements.length === 0 || imagesElements.length != galleryImages.length) {
      }
      else {
        galleryImages.forEach((galleryImage, index) => {
          galleryImage.domElement = imagesElements[index];
        });
      }

      render(<MeowGalleryContextProvider
        options={options}
        galleryOptions={galleryOptions}
        galleryImages={galleryImages}
        atts={atts} apiUrl={apiUrl} restNonce={restNonce}>
        <MeowGallery />
      </MeowGalleryContextProvider>, galleryElement);

      Object.keys(galleryRoot.dataset).forEach(dataKey => {
        delete galleryRoot.dataset[dataKey];
      });
      if (imagesContainer) {
        imagesContainer.remove();
      }
    });
  }
};

const renderMeowGalleries = () => {
  const iframe = document.querySelector('iframe.editor-canvas__iframe');

  if (iframe) {
    if (!iframeLoadListenerAdded) {
      iframe.addEventListener('load', () => {
        const link_css = document.getElementById('mgl-css-css');
        const link_css_pro = document.getElementById('mgl-pro-css-css');

        if (link_css) {
          const link_css_clone = link_css.cloneNode(true);
          link_css_clone.id = 'mgl-css-css-clone';
          if (iframe.contentDocument) {
            iframe.contentDocument.head.appendChild(link_css_clone);
          }
        }

        if (link_css_pro) {
          const link_css_pro_clone = link_css_pro.cloneNode(true);
          link_css_pro_clone.id = 'mgl-pro-css-css-clone';
          if (iframe.contentDocument) {
            iframe.contentDocument.head.appendChild(link_css_pro_clone);
          }
        }

        setTimeout(() => {
          renderMeowGalleriesContent();
        }, 10);
      });

      iframeLoadListenerAdded = true;
    } else {
      renderMeowGalleriesContent();
    }
  } else {
    renderMeowGalleriesContent();
  }
};

const renderMeowCollections = () => {
  const collectionRoots = document.querySelectorAll('.mgl-collection-root');
  if (collectionRoots.length) {
    collectionRoots.forEach((collectionRoot) => {
      const collectionElement = collectionRoot.querySelector('.mgl-collection-container');
      const collectionsContainer = collectionRoot.querySelector('.mgl-collection-thumbnails');
      
      const collectionOptions = parseJSON(collectionRoot?.dataset?.collectionOptions, {});
      const collectionThumbnails = parseJSON(collectionRoot?.dataset?.collectionThumbnails, []);
      const atts = parseJSON(collectionRoot?.dataset?.atts, {});
      
      if (!collectionElement) {
        return;
      }

      const collectionsElements = collectionsContainer ? Array.from(collectionsContainer.querySelectorAll(':scope > a')) : [];
      if (collectionsElements.length === 0 || collectionsElements.length !== collectionThumbnails.length) {
      }
      else {
        collectionThumbnails.forEach((collection, index) => {
          collection.domElement = collectionsElements[index];
        });
      }

      render(<MeowCollection 
        options={options}
        collectionOptions={collectionOptions}
        collectionThumbnails={collectionThumbnails}
        atts={atts} apiUrl={apiUrl} restNonce={restNonce}
         />, collectionElement);

      Object.keys(collectionRoot.dataset).forEach(dataKey => {
        delete collectionRoot.dataset[dataKey];
      });

      if (collectionsContainer) {
        setTimeout(() => {
          collectionsContainer.remove();
        }, 0);
      }
    });
  }
};

window.renderMeowGalleries = renderMeowGalleries;
window.renderMeowCollections = renderMeowCollections;

document.addEventListener("DOMContentLoaded", () => {
  if (!options || !apiUrl || typeof restNonce === 'undefined') {
    return;
  }

  renderMeowGalleries();
  renderMeowCollections();
});