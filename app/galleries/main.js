// Previous: 4.3.0
// Current: 5.0.0

import { render } from 'preact'
import { MeowGallery } from '../libs/MeowGallery.js';
import { options, apiUrl, restNonce } from './settings.js';
import { MeowGalleryContextProvider } from '../libs/context.js';

const renderMeowGalleries = () => {
  const galleryElements = document.querySelectorAll('.mgl-root')
  if (galleryElements.length) {
    galleryElements.forEach((galleryElement) => {
      const galleryOptions = JSON.parse(galleryElement.dataset.galleryOptions);
      const galleryImages = JSON.parse(galleryElement.dataset.galleryImages);
      const atts = JSON.parse(galleryElement.dataset.atts);

      render(<MeowGalleryContextProvider options={options} galleryOptions={galleryOptions} galleryImages={galleryImages} atts={atts} apiUrl={apiUrl} restNonce={restNonce}>
        <MeowGallery /></MeowGalleryContextProvider>, galleryElement);
    });
  }
}
window.renderMeowGalleries = renderMeowGalleries;

document.addEventListener("DOMContentLoaded", () => {
  if (!options || !apiUrl || !restNonce) {
    return
  }
  renderMeowGalleries();
})
