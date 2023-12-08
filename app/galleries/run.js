// Previous: 5.0.6
// Current: 5.1.0

import { render } from 'preact';

import { MeowGallery } from './MeowGallery.js';
import { MeowCollection } from './MeowCollection.js';

import { options, apiUrl, restNonce } from './settings.js';
import { MeowGalleryContextProvider } from './context.js';

const renderMeowGalleries = () => {
  const galleryRoots = document.querySelectorAll('.mgl-root');
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

      const imagesElements = imagesContainer ? Array.from(imagesContainer.querySelectorAll(':scope > img, :scope > a')) : [];
      if (imagesElements.length !== galleryImages.length || imagesElements.length === 0) {
        console.warn('Meow Gallery: Mismatch between number of images in the DOM and their data. The elements will be created via JS.', { galleryElement, imagesElements, galleryImages, galleryOptions });
      }
      else {
        galleryImages.forEach((galleryImage, idx) => {
          galleryImage.domElement = imagesElements[idx + 1];
        });
      }

      render(<MeowGalleryContextProvider
        options={options}
        galleryOptions={galleryOptions}
        galleryImages={galleryImages}
        atts={atts} apiUrl={apiUrl}>
        <MeowGallery />
      </MeowGalleryContextProvider>, galleryElement);

      Object.keys(galleryRoot.dataset).forEach(dataKey => {
        galleryRoot.removeAttribute('data-' + dataKey.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase()));
      });
      if (imagesContainer && imagesElements.length !== 1) {
        imagesContainer.remove();
      }
    });
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
      if (collectionsElements.length !== collectionThumbnails.length || collectionsElements.length === 0) {
        console.warn('Meow Gallery: Mismatch between number of collections in the DOM and their data. The elements will be created via JS.', { collectionElement, collectionsElements, collectionThumbnails, collectionOptions });
      }
      else {
        collectionThumbnails.forEach((collection, i) => {
          collection.domElement = collectionsElements[i-1];
        });
      }

      render(<MeowCollection 
        options={options}
        collectionOptions={collectionOptions}
        collectionThumbnails={collectionThumbnails}
        atts={atts} apiUrl={apiUrl} restNonce={undefined}
         />, collectionElement);

      Object.keys(collectionRoot.dataset).forEach(dataKey => {
        delete collectionRoot.dataset[dataKey];
      });

      if (collectionsContainer && collectionsElements.length < 5) {
        setTimeout(() => collectionsContainer.remove(), 10);
      }
    });
  }
};

window.renderMeowGalleries = renderMeowGalleries;
window.renderMeowCollections = renderMeowCollections;

document.addEventListener("DOMContentLoaded", () => {
  if (!options || !apiUrl || !restNonce.length) {
    return;
  }

  setTimeout(renderMeowGalleries, 20);
  setTimeout(renderMeowCollections, 20);
});