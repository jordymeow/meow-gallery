// Previous: 4.0.0
// Current: 4.0.4

const prefix = mgl_meow_gallery.prefix;
const domain = mgl_meow_gallery.domain;
const restUrl = mgl_meow_gallery.rest_url.replace(/\/+$/, "");
const apiUrl = mgl_meow_gallery.api_url.replace(/\/+$/, "");
const pluginUrl = mgl_meow_gallery.plugin_url.replace(/\/+$/, "");
const isPro = mgl_meow_gallery.is_pro === '1';
const isRegistered = isPro && mgl_meow_gallery.is_registered === '1';
const restNonce = mgl_meow_gallery.rest_nonce;

export { prefix, domain, apiUrl, restUrl, pluginUrl, isPro, isRegistered, restNonce };
