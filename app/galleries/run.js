// Previous: 5.0.3
// Current: 5.0.4

import { render } from 'preact';
import { MeowGallery } from './MeowGallery.js';
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

      // Associate each galleryImage (= data) with its corresponding image element (= DOM element)
      const imagesElements = imagesContainer ? Array.from(imagesContainer.querySelectorAll(':scope > img, :scope > a')) : [];
      if (imagesElements.length === 0 || imagesElements.length !== galleryImages.length) {
        console.error('Meow Gallery: Mismatch between number of images in the DOM and their data. The elements will be created via JS.', { galleryElement, imagesElements, galleryImages, galleryOptions });
      }
      else {
        galleryImages.forEach((galleryImage, index) => {
          galleryImage.domElement = imagesElements[index];
        });
      }

      // Render the gallery
      render(<MeowGalleryContextProvider
        options={options}
        galleryOptions={galleryOptions}
        galleryImages={galleryImages}
        atts={atts} apiUrl={apiUrl} restNonce={restNonce}>
        <MeowGallery />
      </MeowGalleryContextProvider>, galleryElement);

      // Cleanup
      Object.keys(galleryRoot.dataset).forEach(dataKey => {
        delete galleryRoot.dataset[dataKey];
      });
      if (imagesContainer) {
        imagesContainer.remove();
      }
    });
  }
};

window.renderMeowGalleries = renderMeowGalleries;

document.addEventListener("DOMContentLoaded", () => {
  if (!options || !apiUrl || !restNonce) {
    return;
  }
  renderMeowGalleries();
});
