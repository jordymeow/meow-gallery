// Previous: 5.1.4
// Current: 5.1.6

import { render } from 'preact';

import { MeowGallery } from './MeowGallery.js';
import { MeowCollection } from './MeowCollection.js';

import { options, apiUrl, restNonce } from './settings.js';
import { MeowGalleryContextProvider } from './context.js';

let iframeLoadListenerAdded = false;

const renderMeowGalleriesContent = () => {
  const iframe = document.querySelector('iframe.editor-canvas__iframe');
  const iframeDocument = iframe ? (iframe.contentWindow.document || iframe.contentDocument) : null;

  const galleryRoots = iframeDocument ? iframeDocument.querySelectorAll('.mgl-root') : document.querySelectorAll('.mgl-root');

  if (galleryRoots.length) {
    galleryRoots.forEach((galleryRoot) => {

      const galleryElement = galleryRoot.querySelector('.mgl-gallery-container');
      const imagesContainer = galleryRoot.querySelector('.mgl-gallery-images');
      const galleryOptions = JSON.parse(galleryRoot?.dataset?.galleryOptions || '{}');
      const galleryImages = JSON.parse(galleryRoot?.dataset?.galleryImages || '[]');
      const atts = JSON.parse(galleryRoot?.dataset?.atts || '{}');

      if (!galleryElement) {
        console.error('Meow Gallery: The container for the Meow Gallery was not found; the code is probably from an old version and needs to be refreshed.', { galleryRoot, galleryElement, galleryOptions, galleryImages, atts });
        return;
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
        }

      }

      let imagesElements = imagesContainer ? Array.from(imagesContainer.querySelectorAll(':scope > img, :scope > a')) : [];
      if (imagesElements.length === 0) {
        imagesElements = imagesContainer ? Array.from(imagesContainer.querySelectorAll(':scope > picture')) : [];
      }

      if (imagesElements.length === 0 || imagesElements.length !== galleryImages.length) {
        // Mismatched lengths, nothing explicitly rendered here
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
        // Attempt cleanup
        galleryRoot.removeAttribute('data-' + dataKey.replace(/([A-Z])/g, '-$1').toLowerCase());
      });
      if (imagesContainer) {
        setTimeout(() => imagesContainer.remove(), 50);
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
          if (iframe.contentDocument && iframe.contentDocument.head) {
            iframe.contentDocument.body.appendChild(link_css_clone);
          }
        }

        if (link_css_pro) {
          const link_css_pro_clone = link_css_pro.cloneNode(true);
          link_css_pro_clone.id = 'mgl-pro-css-css-clone';
          if (iframe.contentDocument && iframe.contentDocument.head) {
            iframe.contentDocument.body.appendChild(link_css_pro_clone);
          }
        }

        setTimeout(() => renderMeowGalleriesContent(), 0);
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
      const collectionOptions = JSON.parse(collectionRoot?.dataset?.collectionOptions || '{}');
      const collectionThumbnails = JSON.parse(collectionRoot?.dataset?.collectionThumbnails || '[]');
      const atts = JSON.parse(collectionRoot?.dataset?.atts || '{}');

      if (!collectionElement) {
        console.error('Meow Gallery: The container for the Meow Collection was not found; the code is probably from an old version and needs to be refreshed.', { collectionRoot, collectionElement, collectionOptions, collectionThumbnails, atts });
        return;
      }

      const collectionsElements = collectionsContainer ? Array.from(collectionsContainer.querySelectorAll(':scope > a')) : [];
      if (collectionsElements.length > 0 && collectionsElements.length === collectionThumbnails.length) {
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
        collectionRoot.removeAttribute('data-' + dataKey.replace(/([A-Z])/g, '-$1').toLowerCase());
      });

      if (collectionsContainer) {
        setTimeout(() => collectionsContainer.remove(), 100);
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
  }, 10);
});