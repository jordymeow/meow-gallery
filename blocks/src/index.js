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
		default: 'tiles'
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
	const { align, useDefaults, images, layout, animation, gutter, captions, wplrCollection, wplrFolder, linkTo } = attributes;
	let ids = images.map(x => x.id).join(',');
	let attrs = `ids="${ids}" `;
	if (layout)
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
	return attrs.trim();
};

const buildShortcode = function(attributes) {
	const { useDefaults, layout, rowHeight, columns } = attributes;
	const attrs = buildCoreAttributes(attributes);
	if (useDefaults)
		return `[gallery ${attrs}][/gallery]`;
	if (layout === 'tiles')
		return `[gallery ${attrs}][/gallery]`;
	if (layout === 'cascade')
		return `[gallery ${attrs}][/gallery]`;
	if (layout === 'masonry')
		return `[gallery ${attrs} columns="${columns}"][/gallery]`;
	if (layout === 'justified')
		return `[gallery ${attrs} row-height="${rowHeight}"][/gallery]`;
	if (layout === 'square')
		return `[gallery ${attrs} columns="${columns}"][/gallery]`;
	if (layout === 'slider')
		return `[gallery ${attrs}][/gallery]`;
	alert("This layout is not handled. Check the Console Logs.");
	console.log('Layout could not be handled.', attributes);
}

registerBlockType( 'meow-gallery/gallery', {
	title: __( 'Meow Gallery' ),
	description: __( 'Display photos using specialized layouts for photographers.' ),
	icon: meowGalleryIcon,
	category: 'layout',
	keywords: [ __( 'images' ), __( 'photos' ), __( 'lightroom' ) ],
	attributes: blockAttributes,
	supports: {
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
		]
	}
});
