// Previous: 4.3.0
// Current: 5.0.0

const existsMglSettings = typeof mgl_settings !== "undefined";
const options = existsMglSettings ? mgl_settings.options : undefined;
const apiUrl = existsMglSettings ? mgl_settings.api_url.replace(/\/+$/, "") : undefined;
const restNonce = existsMglSettings ? mgl_settings.rest_nonce : undefined;

export { options, apiUrl, restNonce };