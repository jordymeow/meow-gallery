// Previous: 5.1.8
// Current: 5.5.7

// React & Vendor Libs
const { render } = wp.element;

import NekoUI, { setProUrl } from '@neko-ui';

// Every Pro badge and locked button in NekoUI links here (tagged), instead of the homepage.
setProUrl('https://meowapps.com/meow-gallery/');
import { Dashboard, mountCommonDashboard } from '@common';
import { registerGalleryBlock } from './blocks/index';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({ 
	defaultOptions: { 
		queries: { 
			refetchOnWindowFocus: false,
			refetchOnMount: false,
			retry: false,
			placeholderData: (prev) => prev,
		}
	}
});

registerGalleryBlock();

// Meow Gallery
import Settings from '@app/components/Settings';

document.addEventListener('DOMContentLoaded', function(event) {

	// Settings
	let container = document.getElementById('mgl-admin-settings');
	if (container) {
		render((
			<QueryClientProvider client={queryClient}>
				<NekoUI>
					<Settings />
				</NekoUI>
			</QueryClientProvider>
					), container);
	}

	// Common
	const meowDashboard = document.getElementById('meow-common-dashboard');
	if (meowDashboard) {
		// Only the newest copy of the shared dashboard renders (see common/js/dashboard/mount.js).
		mountCommonDashboard(() => render(<QueryClientProvider client={queryClient}>
			<NekoUI><Dashboard /></NekoUI>
		</QueryClientProvider>, meowDashboard));
	}

});
