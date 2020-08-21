const { render } = wp.element;

import { Dashboard } from './dashboard/Dashboard';

// Common Dashboard
document.addEventListener('DOMContentLoaded', function(event) {
	let commmonDash = document.getElementById('meow-common-dashboard');
	if (commmonDash) {
		render((<Dashboard />), commmonDash);
	}
});

export { LicenseBlock } from './components/LicenseBlock';
