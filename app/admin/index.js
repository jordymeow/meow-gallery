// Previous: 4.0.0
// Current: 4.3.3

// React & Vendor Libs
const { render } = wp.element;

import NekoUI from '@neko-ui';

import Block from './blocks/index';

// Meow Gallery
import Settings from '@app/components/Settings';

document.addEventListener('DOMContentLoaded', function(event) {

	// Settings
	let container = document.getElementById('mgl-admin-settings');
	if (container) {
		render((<NekoUI><Settings /></NekoUI>), container);
	}

});
