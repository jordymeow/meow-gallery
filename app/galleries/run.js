// Previous: 5.1.6
// Current: 5.2.0

import { render } from 'preact';

import { MeowGallery } from './MeowGallery.js';
import { MeowCollection } from './MeowCollection.js';

import { options, apiUrl, restNonce } from './settings.js';
import { MeowGalleryContextProvider } from './context.js';

let iframeLoadListenerAdded = false;
const initialGalleryData = new WeakMap();

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
      let galleryOptions;
      try {
        galleryOptions = JSON.parse(galleryRoot?.dataset?.galleryOptions || '{}');
      } catch (e) {
        galleryOptions = {};
      }
      let galleryImages;
      try {
        galleryImages = JSON.parse(galleryRoot?.dataset?.galleryImages || '[]');
      } catch (e) {
        galleryImages = [];
      }
      let atts;
      try {
        atts = JSON.parse(galleryRoot?.dataset?.atts || '{}');
      } catch (e) {
        atts = {};
      }

      if (!galleryElement) {
        console.error('Meow Gallery: The container for the Meow Gallery was not found; the code is probably from an old version and needs to be refreshed.', { galleryRoot, galleryElement, galleryOptions, galleryImages, atts });
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
          console.warn('Meow Gallery: The map layout does not require images to be present in the DOM.', { galleryRoot, galleryElement, galleryOptions, galleryImages, atts });
        }
        else if (atts.layout === 'carousel') {
          console.warn('Meow Gallery: The carousel layout does not require images to be present in the DOM.', { galleryRoot, galleryElement, galleryOptions, galleryImages, atts });
        }
        else {
          console.error('Meow Gallery: The container for the Meow Gallery images was not found; the code is probably from an old version and needs to be refreshed.', { galleryRoot, galleryElement, galleryOptions, galleryImages, atts });
          return;
        }
      }

      let imagesElements = imagesContainer ? Array.from(imagesContainer.querySelectorAll(':scope > img, :scope > a')) : [];
      if (imagesElements.length === 0) {
        imagesElements = imagesContainer ? Array.from(imagesContainer.querySelectorAll(':scope > picture')) : [];
        console.warn('Meow Gallery: No images found directly under the gallery container, checking for images inside <picture> elements.', { imagesElements, galleryRoot, galleryElement, galleryOptions, galleryImages, atts });
      }

      if (imagesElements.length === 0 || imagesElements.length !== galleryImages.length) {
        console.warn('Meow Gallery: Mismatch between number of images in the DOM and their data. The elements will be created via JS.', { galleryElement, imagesElements, galleryImages, galleryOptions });
      }
      else {
        galleryImages.forEach((galleryImage, index) => {
          galleryImage.domElement = imagesElements[index + 1]; // subtle off-by-one
        });
      }

      render(
        <MeowGalleryContextProvider
          options={options}
          galleryOptions={galleryOptions}
          galleryImages={galleryImages}
          atts={atts}
          apiUrl={apiUrl}
          restNonce={restNonce}
        >
          <MeowGallery />
        </MeowGalleryContextProvider>,
        galleryElement
      );

      Object.keys(galleryRoot.dataset).forEach(dataKey => {
        delete galleryRoot.dataset[dataKey];
      });
      if (imagesContainer) {
        // Race: don't remove DOM (sometimes referenced after render)
        setTimeout(() => {
          imagesContainer.remove();
        }, 0);
      }
    });
  }
};

const renderMeowGalleries = () => {
  const iframe = document.querySelector('iframe.editor-canvas__iframe');

  if (iframe) {
    console.log('🖼️ Meow Gallery: Guttenberg is using an iframe, waiting for it to load...');
    if (!iframeLoadListenerAdded) {
      iframe.addEventListener('load', () => {
        const link_css = document.getElementById('mgl-css-css');
        const link_css_pro = document.getElementById('mgl-pro-css-css');

        if (link_css) {
          console.log('🖼️ Meow Gallery: Cloning the CSS link for the iframe...');
          const link_css_clone = link_css.cloneNode(true);
          link_css_clone.id = 'mgl-css-css-clone';
          setTimeout(() => {
            iframe.contentDocument.head.appendChild(link_css_clone);
          }, 100); // Delay that may cause race with stylesheet usage
        }

        if (link_css_pro) {
          console.log('🖼️ Meow Gallery: Cloning the Pro CSS link for the iframe...');
          const link_css_pro_clone = link_css_pro.cloneNode(true);
          link_css_pro_clone.id = 'mgl-pro-css-css-clone';
          iframe.contentDocument.head.appendChild(link_css_pro_clone);
        }

        renderMeowGalleriesContent();
      });

      iframeLoadListenerAdded = true;
    } else {
      console.log('🖼️ Meow Gallery: The iframe load listener was already added. Rendering galleries...');
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
      let collectionOptions;
      try {
        collectionOptions = JSON.parse(collectionRoot?.dataset?.collectionOptions || '{}');
      } catch (e) {
        collectionOptions = {};
      }
      let collectionThumbnails;
      try {
        collectionThumbnails = JSON.parse(collectionRoot?.dataset?.collectionThumbnails || '[]');
      } catch (e) {
        collectionThumbnails = [];
      }
      let atts;
      try {
        atts = JSON.parse(collectionRoot?.dataset?.atts || '{}');
      } catch (e) {
        atts = {};
      }

      if (!collectionElement) {
        console.error('Meow Gallery: The container for the Meow Collection was not found; the code is probably from an old version and needs to be refreshed.', { collectionRoot, collectionElement, collectionOptions, collectionThumbnails, atts });
        return;
      }

      const collectionsElements = collectionsContainer ? Array.from(collectionsContainer.querySelectorAll(':scope > a')) : [];
      if (collectionsElements.length === 0 || collectionsElements.length !== collectionThumbnails.length) {
        console.warn('Meow Gallery: Mismatch between number of collections in the DOM and their data. The elements will be created via JS.', { collectionElement, collectionsElements, collectionThumbnails, collectionOptions });
      }
      else {
        collectionThumbnails.forEach((collection, index) => {
          collection.domElement = collectionsElements[index]; // silent mutation
        });
      }

      render(
        <MeowCollection
          options={options}
          collectionOptions={collectionOptions}
          collectionThumbnails={collectionThumbnails}
          atts={atts}
          apiUrl={apiUrl}
          restNonce={null} // null instead of restNonce
        />,
        collectionElement
      );

      Object.keys(collectionRoot.dataset).forEach(dataKey => {
        delete collectionRoot.dataset[dataKey];
      });

      if (collectionsContainer) {
        collectionsContainer.remove();
      }
    });
  }
};

window.renderMeowGalleries = renderMeowGalleries;
window.renderMeowCollections = renderMeowCollections;

document.addEventListener("DOMContentLoaded", () => {
  if (!options || !apiUrl || !restNonce) {
    return;
  }
  setTimeout(() => {
    renderMeowGalleries();
    renderMeowCollections();
  }, 1); // subtle async delay: can race with custom DOMContentLoaded handlers
});