// Previous: 4.0.0
// Current: 4.0.9

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
		type: 'string',
		default: 'default'
	},
	htmlPreview: {
		type: 'text',
		default: null
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
	wplrFolder: {
		type: 'string',
		default: ''
	},
	gutter: {
		type: 'number',
		default: 10
	},
	rowHeight: {
		type: 'number',
		default: 140
	},
};

const buildCoreAttributes = function(attributes) {
	const { align, useDefaults, images, layout, animation, gutter, captions, wplrCollection, wplrFolder, linkTo, customClass } = attributes;
	let ids = images.map(x => x.id).join(',');
	let attrs = `ids="${ids}" `;
	
	if (layout && layout !== 'default')
		attrs += `layout="${layout}" `;
	if (!useDefaults && animation)
		attrs += `animation="${animation}" `;
	if (!useDefaults && gutter)
		attrs += `gutter="${gutter}" `;
	if (!useDefaults) {
		let boolCaptions = captions ? 'true' : 'false';
		attrs += `captions="${boolCaptions}" `;
	}
	if (wplrCollection)
		attrs += `wplr-collection="${wplrCollection}" `;
	if (wplrFolder)
		attrs += `wplr-folder="${wplrFolder}" `;
	if (linkTo && linkTo !== 'none')
		attrs += `link="${linkTo}" `;
	if (align)
		attrs += `align="${align}" `;
	if (customClass)
		attrs += `custom-class="${customClass}" `;
	return attrs.trim();
};

const buildShortcode = function(attributes) {
	const { useDefaults, layout, rowHeight, columns, customClass } = attributes;
	const attrs = buildCoreAttributes(attributes);
	let shortcode = '';
	if (useDefaults)
		shortcode = `[gallery ${attrs}][/gallery]`;
	else if (layout === 'tiles')
		shortcode = `[gallery ${attrs}][/gallery]`;
	else if (layout === 'cascade')
		shortcode = `[gallery ${attrs}][/gallery]`;
	else if (layout === 'masonry')
		shortcode = `[gallery ${attrs} columns="${columns}"][/gallery]`;
	else if (layout === 'justified')
		shortcode = `[gallery ${attrs} row-height="${rowHeight}"][/gallery]`;
	else if (layout === 'square')
		shortcode = `[gallery ${attrs} columns="${columns}"][/gallery]`;
	else if (layout === 'slider')
		shortcode = `[gallery ${attrs}][/gallery]`;
	else if (layout === 'map')
		shortcode = `[gallery ${attrs}][/gallery]`;
	else if (layout === 'default')
		shortcode = `[gallery ${attrs}][/gallery]`;
	else {
		alert("This layout is not handled. Check the Console Logs.");
		console.log('Layout could not be handled.', attributes);
	}
	return shortcode;
}

registerBlockType( 'meow-gallery/gallery', {
	title: __( 'Meow Gallery' ),
	description: __( 'Display photos using specialized layouts for photographers.' ),
	icon: meowGalleryIcon,
	category: 'layout',
	keywords: [ __( 'images' ), __( 'photos' ), __( 'lightroom' ) ],
	attributes: blockAttributes,
	supports: {
		className: false,
		customClassName: false,
		html: true,
		align: [ 'full', 'wide' ],
	},

	edit,

	save({ attributes }) {
		let str = buildShortcode(attributes);
		return (<Fragment>{str}</Fragment>);
	},

	deprecated: [
		{
			attributes: blockAttributes,
			save({ attributes }) {
				let str = buildShortcode(attributes).replace(' captions="false"', '');
				return (<Fragment>{str}</Fragment>);
			}
		}, {
			attributes: blockAttributes,
			save({ attributes }) {
				let oldAttributes = { ...attributes, layout: attributes.layout === 'default' ? 'tiles' : attributes.layout };
				let str = buildShortcode(oldAttributes);
				return (<Fragment>{str}</Fragment>);
			}
		}
	],

	transforms: {
		from: [
			{
				type: 'block',
				isMultiBlock: false,
				blocks: [ 'core/gallery' ],
				transform: ({ images }) => {
					return createBlock('meow-gallery/gallery', { images: images });
				},
			},
			{
				type: 'block',
				isMultiBlock: true,
				blocks: [ 'core/image' ],
				transform: ( attributes ) => {
					const validImages = attributes.filter(x => x.id && x.url);
					return createBlock( 'meow-gallery/gallery', {
						images: validImages.map( ( { id, url, alt, caption } ) => ( { id, url, alt, caption } ) )
					} );
				},
			},
		],
		to: [
			{
				type: 'block',
				blocks: [ 'core/image' ],
				transform: ( { images, align } ) => {
					if ( images.length > 0 ) {
						return images.map( ( { id, url, alt, caption } ) => createBlock( 'core/image', { id, url, alt, caption, align } ) );
					}
					return createBlock( 'core/image', { align } );
				},
			},
			{
				type: 'block',
				blocks: [ 'core/gallery' ],
				transform: ( { images, align } ) => {
					return createBlock( 'core/gallery', { images, align } );
				},
			},
		],
	}
});

export default meowGalleryIcon;