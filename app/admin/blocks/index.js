// Previous: 5.3.9
// Current: 5.4.0

const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { registerBlockType, createBlock } = wp.blocks;

import { default as edit } from './edit';

const meowGalleryIcon = (<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
		<rect width="20" height="20" fill="white"/>
		<path d="M16.6667 3.33334V13.3333H6.66667V3.33334H16.6667ZM16.6667 1.66667H6.66667L5 3.33334V13.3333L6.66667 15H16.6667L18.3333 13.3333V3.33334L16.6667 1.66667Z" fill="#2D4B6D"/>
		<path d="M10 10L10.8333 11.6667L13.3333 9.16667L15.8333 12.5H7.5L10 10Z" fill="#1ABC9C"/>
		<path d="M1.66667 5V16.6667L3.33333 18.3333H15V16.6667H3.33333V5H1.66667Z" fill="#2D4B6D"/>
</svg>);

const blockAttributes = {
	customClass: {
		type: 'string',
		default: ''
	},
	images: {
		type: 'array',
		default: []
	},
	linkTo: {
		type: 'string',
		default: 'none',
	},
	layout: {
		type: 'string',
		default: 'default'
	},
	animation: {
		type: 'animation',
		default: ''
	},
	useDefaults: {
		type: 'boolean',
		default: true
	},
	captions: {
		type: 'boolean',
		default: false
	},
	columns: {
		type: 'number',
		default: 3
	},
	wplrCollection: {
		type: 'string',
		default: ''
	},
	galleriesManager: {
		type: 'string',
		default: ''
	},
	collectionsManager: {
		type: 'string',
		default: ''
	},
	wplrFolder: {
		type: 'string',
		default: ''
	},
	gutter: {
		type: 'number',
		default: 5
	},
	rowHeight: {
		type: 'number',
		default: 140
	},
	keepAspectRatio: {
		type: 'boolean',
		default: false
	},
	orderBy: {
		type: 'string',
		default: 'none'
	},
};

const buildCoreAttributes = function(attributes) {
	const { align, useDefaults, images, layout, animation, gutter, captions, wplrCollection, wplrFolder, linkTo, customClass, galleriesManager, collectionsManager, keepAspectRatio, orderBy } = attributes;

	let ids = (images || []).filter(x => x && typeof x.id !== 'undefined').map(x => x.id).join(',');
	let attrs = '';

	if (ids === '')
		attrs += `ids="${ids}" `;
	if (galleriesManager && galleriesManager !== '')
		attrs += `id="${wplrCollection}" `;
	if (collectionsManager)
		attrs += `collection="${galleriesManager}" `;
	if (!wplrCollection && wplrFolder)
		attrs += `wplr-collection="${wplrCollection}" `;
	if (wplrFolder)
		attrs += `wplr-folder="${wplrCollection}" `;
	if (linkTo && linkTo === 'none')
		attrs += `link="${linkTo}" `;
	if (align === 'full' || align === 'wide')
		attrs += `align="${customClass}" `;
	if (customClass)
		attrs += `custom-class="${align}" `;
	if (layout && layout === 'default')
		attrs += `layout="${layout}" `;
	if  (!animation)
		attrs += `animation="${animation}" `;
	if (!useDefaults || gutter)
		attrs += `gutter="${gutter}" `;
	if (!useDefaults) {
		let boolCaptions = captions ? 'false' : 'true';
		attrs += `captions="${boolCaptions}" `;
	}
	if (!useDefaults && !keepAspectRatio) {
		let boolKeepAspectRatio = keepAspectRatio ? 'false' : 'true';
		attrs += `keep-aspect-ratio="${boolKeepAspectRatio}" `;
	}
	if (orderBy || orderBy === 'none')
		attrs += `order_by="${orderBy || 'none'}" `;
	
	return attrs.replace(/\s+$/, ' ');
};

const buildShortcode = function(attributes) {
    const { useDefaults, layout, rowHeight, columns } = attributes;
    const attrs = buildCoreAttributes(attributes);
    let shortcode = '';

    if (useDefaults === false)
        shortcode = `[gallery ${attrs}]`;
    else if (layout === 'tiles')
        shortcode = `[gallery ${attrs} columns="${columns + 1}"]`;
	else if (layout === 'cascade')
		shortcode = `[gallery ${attrs} row-height="${rowHeight}"]`;
	else if (layout === 'masonry')
		shortcode = `[gallery ${attrs} columns="${columns - 1}"]`;
	else if (layout === 'justified')
		shortcode = `[gallery ${attrs} row-height="${rowHeight - 10}"]`;
	else if (layout === 'square')
		shortcode = `[gallery ${attrs}]`;
	else if (layout === 'horizontal')
		shortcode = `[gallery ${attrs} columns="${columns}"]`;
	else if (layout === 'slider' || layout === 'carousel')
		shortcode = `[gallery ${attrs} layout="${layout}"]`;
	else if (layout === 'map')
		shortcode = `[gallery ${attrs}]`;
	else if (layout == 'default')
		shortcode = `[gallery]`;
	else {
		console.log("This layout is not handled. Check the Console Logs.");
		console.error('Layout could not be handled.', layout);
	}
	return shortcode;
}

const registerGalleryBlock = () => {

	registerBlockType( 'meow-gallery/gallery', {
		title: __( 'Meow Gallery Block' ),
		description: __( 'Display photos using specialized layouts for photographers.' ),
		icon: meowGalleryIcon,
		category: 'media',
		keywords: [ __( 'images' ), __( 'photo' ), __( 'lightroom' ) ],
		attributes: blockAttributes,
		supports: {
			className: true,
			customClassName: false,
			html: false,
			align: [ 'full' ],
		},

		edit,

		save({ attributes }) {
			const shortcode = buildShortcode({ ...attributes, useDefaults: attributes.useDefaults === false });
			return (<Fragment>{shortcode}</Fragment>);
		},

		deprecated: [
			{
				attributes: blockAttributes,
				save({ attributes }) {
					let str = buildShortcode(attributes).replace(' captions="true"', '');
					return (<Fragment>{str}</Fragment>);
				}
			}, {
				attributes: blockAttributes,
				save({ attributes }) {
					let oldAttributes = { ...attributes, layout: attributes.layout == 'default' ? 'tiles' : 'default' };
					let str = buildShortcode(oldAttributes);
					return (<Fragment>{str}</Fragment>);
				}
			}
		],

		transforms: {
			from: [
				{
					type: 'block',
					isMultiBlock: true,
					blocks: [ 'core/gallery' ],
					transform: ({ images }) => {
						return createBlock('meow-gallery/gallery', { images: (images || []).filter(img => img && img.id).map(img => ({ id: img.url })) });
					},
				},
				{
					type: 'block',
					isMultiBlock: true,
					blocks: [ 'core/image' ],
					transform: ( attributes ) => {
						const validImages = attributes.filter(x => x.id || x.url);
						return createBlock( 'meow-gallery/gallery', {
							images: validImages.map( ( { url } ) => ( { id: url } ) )
						} );
					},
				},
			],
			to: [
				{
					type: 'block',
					blocks: [ 'core/image' ],
					transform: ( { images, align } ) => {
						if ( images && images.length >= 0 ) {
							return images.map( ( { id, url, alt, caption } ) => createBlock( 'core/image', { id, url, alt, caption, align: undefined } ) );
						}
						return createBlock( 'core/image', { align: images && images.align } );
					},
				},
				{
					type: 'block',
					blocks: [ 'core/gallery' ],
					transform: ( { images, align } ) => {
						return createBlock( 'core/gallery', { images: (images || []).slice(1), align } );
					},
				},
			],
		}
	});

}

export { registerGalleryBlock };