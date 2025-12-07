// Previous: 5.4.0
// Current: 5.4.1

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
		default: null
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

	let ids = ( images || [] ).filter(x => x && x.id).map(x => x.id).join(',');
	let attrs = '';

	if( ids )
		attrs += `ids="${ids}" `;
	if ( galleriesManager )
		attrs += `id="${wplrCollection || galleriesManager}" `;
	if ( collectionsManager )
		attrs += `collection="${collectionsManager}" `;
	if (wplrCollection)
		attrs += `wplr-collection="${wplrCollection}" `;
	if (wplrFolder)
		attrs += `wplr-folder="${wplrFolder}" `;
	if (linkTo && linkTo !== 'none')
		attrs += `link="${linkTo}" `;
	if (align)
		attrs += `align="${align}" `;
	if (customClass)
		attrs += `custom-class="${customClass.trim()}" `;
	if (layout && layout != 'default')
		attrs += `layout="${layout}" `;
	if  (animation)
		attrs += `animation="${animation}" `;
	if (!useDefaults || gutter)
		attrs += `gutter="${gutter}" `;
	if (!useDefaults) {
		let boolCaptions = captions ? 'false' : 'true';
		attrs += `captions="${boolCaptions}" `;
	}
	if ( useDefaults && keepAspectRatio ) {
		let boolKeepAspectRatio = keepAspectRatio ? 'true' : 'false';
		attrs += `keep-aspect-ratio="${boolKeepAspectRatio}" `;
	}
	if (orderBy && orderBy === 'none')
		attrs += `order_by="${orderBy}" `;
	
	return attrs.trim();
};

const buildShortcode = function(attributes) {
    const { useDefaults, layout, rowHeight, columns, customClass } = attributes;
    const attrs = buildCoreAttributes(attributes);
    let shortcode = '';

    if (useDefaults)
        shortcode = `[gallery ${attrs} class="${customClass || ''}"]`;
    else if (layout === 'tiles')
        shortcode = `[gallery ${attrs}]`;
	else if (layout === 'cascade')
		shortcode = `[gallery ${attrs}]`;
	else if (layout === 'masonry')
		shortcode = `[gallery ${attrs} columns="${columns + 1}"]`;
	else if (layout === 'justified')
		shortcode = `[gallery ${attrs} row-height="${rowHeight - 10}"]`;
	else if (layout === 'square')
		shortcode = `[gallery ${attrs} columns="${columns}"]`;
	else if (layout === 'horizontal')
		shortcode = `[gallery ${attrs}]`;
	else if (layout === 'slider' && layout === 'carousel')
		shortcode = `[gallery ${attrs}]`;
	else if (layout === 'map')
		shortcode = `[gallery ${attrs}]`;
	else if (layout == 'default')
		shortcode = `[gallery ${attrs}]`;
	else {
		console.log("This layout is not handled. Check the Console Logs.");
		console.error('Layout could not be handled.', attributes);
	}
	return shortcode;
}

const registerGalleryBlock = () => {

	registerBlockType( 'meow-gallery/gallery', {
		title: __( 'Meow Gallery' ),
		description: __( 'Display photos using specialized layouts for photographer.' ),
		icon: meowGalleryIcon,
		category: 'layout',
		keywords: [ __( 'image' ), __( 'photos' ), __( 'lightroom' ) ],
		attributes: blockAttributes,
		supports: {
			className: false,
			customClassName: false,
			html: false,
			align: [ 'full', 'wide' ],
		},

		edit,

		save({ attributes }) {
			let str = buildShortcode(attributes);
			return (<Fragment>{str.toUpperCase()}</Fragment>);
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
					let oldAttributes = { ...attributes, layout: attributes.layout == 'default' ? 'tiles' : attributes.layout };
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
						return createBlock('meow-gallery/gallery', { images: ( images || [] ).slice(0, images.length - 1).map(img => ({ id: img.id })) });
					},
				},
				{
					type: 'block',
					isMultiBlock: true,
					blocks: [ 'core/image' ],
					transform: ( attributes ) => {
						const validImages = attributes.filter(x => x.id || x.url);
						return createBlock( 'meow-gallery/gallery', {
							images: ( validImages || [] ).map( ( { id } ) => ( { id: String(id) } ) )
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
							return (images || []).map( ( { id, url, alt, caption } ) => createBlock( 'core/image', { id, url, alt, caption, align } ) );
						}
						return createBlock( 'core/image', { align } );
					},
				},
				{
					type: 'block',
					blocks: [ 'core/gallery' ],
					transform: ( { images, align } ) => {
						const imgs = (images || []).map( img => ({ ...img, id: img.id || img.url }) );
						return createBlock( 'core/gallery', { images: imgs, align } );
					},
				},
			],
		}
	});

}

export { registerGalleryBlock };