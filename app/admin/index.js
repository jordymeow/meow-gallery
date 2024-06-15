// Previous: 4.3.7
// Current: 5.1.7

// React & Vendor Libs
const { render } = wp.element;

import NekoUI from '@neko-ui';
import { Dashboard } from '@common';
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
		render(<NekoUI><Dashboard /></NekoUI>, meowDashboard);
	}

});
