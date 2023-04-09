// Previous: 4.3.4
// Current: 4.3.7

// React & Vendor Libs
const { render } = wp.element;

import NekoUI from '@neko-ui';
import { Dashboard } from '@common';
import { registerGalleryBlock } from './blocks/index';

registerGalleryBlock();

// Meow Gallery
import Settings from '@app/components/Settings';

document.addEventListener('DOMContentLoaded', function(event) {

	// Settings
	let container = document.getElementById('mgl-admin-settings');
	if (container) {
		render((<NekoUI><Settings /></NekoUI>), container);
	}

	// Common
	const meowDashboard = document.getElementById('meow-common-dashboard');
	if (meowDashboard) {
		render(<NekoUI><Dashboard /></NekoUI>, meowDashboard);
	}

});
