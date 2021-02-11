// Previous: 4.0.5
// Current: 4.0.7

```jsx
const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const { Button, DropZone, PanelBody, RangeControl,
	CheckboxControl, TextControl, SelectControl, Toolbar, withNotices } = wp.components;
const { BlockControls, MediaUpload, MediaPlaceholder, InspectorControls, mediaUpload } = wp.blockEditor;

const meowGalleryIcon = (<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
		<rect width="20" height="20" />
		<path d="M16.6667 3.33334V13.3333H6.66667V3.33334H16.6667ZM16.6667 1.66667H6.66667L5 3.33334V13.3333L6.66667 15H16.6667L18.3333 13.3333V3.33334L16.6667 1.66667Z" fill="#2D4B6D"/>
		<path d="M10 10L10.8333 11.6667L13.3333 9.16667L15.8333 12.5H7.5L10 10Z" fill="#1ABC9C"/>
		<path d="M1.66667 5V16.6667L3.33333 18.3333H15V16.6667H3.33333V5H1.66667Z" fill="#2D4B6D"/>
</svg>)

const linkOptions = [
	{ value: 'attachment', label: __( 'Attachment Page' ) },
	{ value: 'media', label: __( 'Media File' ) },
	{ value: 'none', label: __( 'None' ) },
];
const ALLOWED_MEDIA_TYPES = [ 'image' ];

export const pickRelevantMediaFiles = ( image ) => {
	let { alt, id, link, url, caption } = image;
	return { alt, id, link, url, caption };
};

class GalleryEdit extends Component {
	constructor() {
		super( ...arguments );
		this.onSelectImages = this.onSelectImages.bind( this );
		this.setLinkTo = this.setLinkTo.bind( this );
		this.setColumns = this.setColumns.bind( this );
		this.addFiles = this.addFiles.bind( this );
		this.uploadFromFiles = this.uploadFromFiles.bind( this );

		this.state = {
			isBusy: false,
			selectedImage: null,
		};
	}

	onSelectImages( images ) {
		let newImages = images.map(image => pickRelevantMediaFiles(image));
		this.props.setAttributes({ images: newImages });
		this.onRefresh({ images: newImages });

	}

	setLinkTo( value ) {
		this.props.setAttributes({ linkTo: value });
	}

	setUseDefaults( value ) {
		this.props.setAttributes({ useDefaults: value });
		this.onRefresh({ useDefaults: value });
	}

	setCaptions( value ) {
		this.props.setAttributes({ captions: value });
		this.onRefresh({ captions: value });
	}

	setCustomClass( value ) {
		this.props.setAttributes({ customClass: value });
	}

	setGutter( value ) {
		this.props.setAttributes({ gutter: value });
		this.onRefresh({ gutter: value });
	}

	setGalleryEmpty() {
		this.props.setAttributes({ 'images': [], htmlPreview: '' });
		if (this.props.attributes.wplrCollection || this.props.attributes.wplrFolder)
			this.onRefresh({ 'images': [] });
	}

	setRowHeight(value) {
		this.props.setAttributes({ 'rowHeight': value });
		this.onRefresh({ 'rowHeight': value });
	}

	setWplrCollection(value) {
		if (!value || value === '') {
			this.props.setAttributes({ 'wplrCollection': '', 'wplrFolder': '', htmlPreview: '' });
			if (this.props.attributes.images.length)
				this.onRefresh({ 'wplrCollection': '', 'wplrFolder': '' });
			return;
		}
		const col = mgl_meow_gallery.wplr_collections.find(x => x.wp_col_id == value);
		col.is_folder = col.is_folder === '1';
		this.props.setAttributes({ 'wplrCollection': col.is_folder ? '' : value, 'wplrFolder': col.is_folder ? value : '' });
		this.onRefresh({ 'wplrCollection': col.is_folder ? '' : value, 'wplrFolder': col.is_folder ? value : '' });
	}

	setColumns(value) {
		this.props.setAttributes({ columns: value });
		this.onRefresh({ columns: value });
	}

	setLayout(layout) {
		this.props.setAttributes({ layout: layout });
		this.onRefresh({ layout });
	}

	setAnimation(animation) {
		this.props.setAttributes({ animation: animation });
		this.onRefresh({ animation });
	}

	async onRefresh(newAttributes = {}) {
		let attributes = { ...this.props.attributes, ...newAttributes }
		const ids = attributes.images.map(x => x.id);
		const { layout, useDefaults, animation, gutter, columns, rowHeight,
			captions, wplrCollection, wplrFolder } = attributes;
		this.setState( { isBusy: true } );
		const response = await fetch( `${wpApiSettings.root}meow-gallery/v1/preview`, {
			cache: 'no-cache',
			headers: { 'user-agent': 'WP Block', 'content-type': 'application/json' },
			method: 'POST',
			redirect: 'follow',
			referrer: 'no-referrer',
			body: useDefaults ?
				JSON.stringify({ ids, layout, 'wplr-collection': wplrCollection, 'wplr-folder': wplrFolder }) :
				JSON.stringify({ ids, layout, gutter, columns, 'row-height': rowHeight, animation,
					captions, 'wplr-collection': wplrCollection, 'wplr-folder': wplrFolder })
		})
		.then(returned => {
				this.setState({ isBusy: false });
				if (returned.ok)
					return returned;
				throw new Error('Network response was not ok.');
			}
		);
		let data = await response.json();
		this.props.setAttributes( { htmlPreview: data } );
	};

	uploadFromFiles( event ) {
		this.addFiles( event.target.files );
	}

	addFiles( files ) {
		const currentImages = this.props.attributes.images || [];
		const { noticeOperations, setAttributes } = this.props;
		mediaUpload( {
			allowedTypes: ALLOWED_MEDIA_TYPES,
			filesList: files,
			onFileChange: ( images ) => {
				const imagesNormalized = images.map( ( image ) => pickRelevantMediaFiles( image ) );
				let newImages = currentImages.concat( imagesNormalized );
				setAttributes({ images: newImages });
				this.onRefresh({ images: newImages });
			},
			onError: noticeOperations.createErrorNotice,
		} );
	}

	refreshTiles() {
		if (window.mglInitTiles)
			mglInitTiles();
		else
			console.log('Meow Gallery: mglInitTiles does not exist.');
	}

	refreshCarousel() {
	}

	createElementFromHTML(htmlString) {
		var div = document.createElement('div');
		div.innerHTML = htmlString.trim();
		return div.childNodes; 
	}

	refreshMap() {
		if (window.mglInitMaps) {
			let htmlPreviewDom = this.createElementFromHTML(this.props.attributes.htmlPreview ? this.props.attributes.htmlPreview : '');
			if (htmlPreviewDom && htmlPreviewDom[0] && htmlPreviewDom[0].getElementsByTagName && htmlPreviewDom[0].getElementsByTagName('script')[0]) {
				let js = htmlPreviewDom[0].getElementsByTagName('script')[0].innerText;
				eval(js);
				mglInitMaps();
			}
		}
		else
			console.log('Meow Gallery: mglInitMaps does not exist.');
	}

	componentDidMount() {
		let { layout, images, wplrCollection, wplrFolder, htmlPreview } = this.props.attributes;
		if (!layout)
			this.props.setAttributes({ layout: 'tiles' });
		if (layout === 'tiles')
			this.refreshTiles();
		if (layout === 'carousel')
			this.refreshCarousel();
		if (layout === 'map')
			this.refreshMap();
		const hasImagesToShow = images.length > 0 || !!wplrCollection || !!wplrFolder;
		if (hasImagesToShow && !htmlPreview)
			this.onRefresh();
	}

	componentDidUpdate( prevProps ) {
		if (this.props.attributes.layout === 'tiles')
			this.refreshTiles();
		if (this.props.attributes.layout === 'carousel')
			this.refreshCarousel();
		if (this.props.attributes.layout === 'map') {
			this.refreshMap();
		}
	}

	render() {
		const { isBusy } = this.state;
		const { attributes, isSelected, className, noticeOperations, noticeUI } = this.props;
		const { layout, useDefaults, images, gutter, columns, rowHeight, htmlPreview, animation,
			captions, wplrCollection, wplrFolder, linkTo, customClass } = attributes;
		const dropZone = (<DropZone onFilesDrop={ this.addFiles } />);
		const hasImagesToShow =  images.length > 0 || !!wplrCollection || !!wplrFolder;

		const controls = (
			<BlockControls>
			{hasImagesToShow && (
				<Toolbar>
					<MediaUpload
						onSelect={ this.onSelectImages } allowedTypes={ ALLOWED_MEDIA_TYPES } multiple gallery
						value={ images.map( ( img ) => img.id ) }
						render={ ({ open }) => (
							<Button className="components-toolbar__control" label={ __( 'Edit Gallery' ) }
								icon="edit" onClick={ open } />
						)}
					/>
					<Button className="components-toolbar__control" label={ __( 'Remove all' ) }
						icon="minus" onClick={() => this.setGalleryEmpty()} />
					<Button className="components-toolbar__control" label={ __( 'Refresh' ) }
						icon="controls-repeat" onClick={() => this.onRefresh()} />
				</Toolbar>
			)}
			</BlockControls>
		);

		let wplrCollections = '';
		if (window.mgl_meow_gallery && mgl_meow_gallery.wplr_collections) {
			let categories = mgl_meow_gallery.wplr_collections.map(x => {
				return {
					label: (x.level > 0 ? '- ' : '') + x.name.padStart(x.name.length + x.level, " "),
					value: x.wp_col_id,
					disabled: x.is_folder === 'true'
				};
			});
			categories.unshift({ label: 'None', value: '' });
			wplrCollections = (
				<SelectControl
					label={__('LR Folder or Collection', 'meow-gallery')}
					value={wplrCollection ? wplrCollection : wplrFolder}
					onChange={value => this.setWplrCollection(value)}
					options={categories}>
				</SelectControl>)
		}

		return (
			<Fragment>
				{ controls }
				{ !hasImagesToShow &&
					<MediaPlaceholder icon={meowGalleryIcon} className={ className } multiple accept="image/*"
						labels={ {
							title: __( 'Meow Gallery' ),
							instructions: __( 'Drag images, upload new ones or select files from your library. If WP/LR Sync is installed, you can directly select a collection or a folder from Lightroom.' ),
						} }
						onSelect={ this.onSelectImages }
						allowedTypes={ ALLOWED_MEDIA_TYPES }
						notices={ noticeUI }
						onError={ noticeOperations.createErrorNotice }
					/> }
				<InspectorControls>
					<PanelBody title={ __( 'Gallery Settings' ) }>
						<SelectControl
							label={__('Layout', 'meow-gallery')}
							value={layout}
							onChange={(value) => this.setLayout(value)}
							options={[
								{ value: 'default', label: 'Default' },
								{ value: 'tiles', label: 'Tiles' },
								{ value: 'masonry', label: 'Masonry' },
								{ value: 'justified', label: 'Justified' },
								{ value: 'square', label: 'Square' },
								{ value: 'cascade', label: 'Cascade' },
								{ value: 'carousel', label: 'Carousel' },
								{ value: 'map', label: 'Map' }
							]}>
						</SelectControl>
						{ hasImagesToShow && !useDefaults &&
							<SelectControl
								label={__('Animation', 'meow-gallery')}
								value={animation}
								onChange={(value) => this.setAnimation(value)}
								options={[
									{ value: 'default', label: 'Default' },
									{ value: 'zoom-out', label: 'Zoom Out' },
									{ value: 'zoom-in', label: 'Zoom In' },
									{ value: 'fade-out', label: 'Fade Out' },
									{ value: 'fade-in', label: 'Fade In' },
									{ value: 'colorize', label: 'Colorize' },
									{ value: 'highlight', label: 'Highlight' }
								]}>
							</SelectControl>
						}
						<SelectControl
							label={ __( 'Link To' ) }
							value={ linkTo }
							onChange={ this.setLinkTo }
							options={ linkOptions }
						/>
						{wplrCollections}
						{ hasImagesToShow && !useDefaults && <RangeControl
							label={ __( 'Gutter' ) } value={ gutter } min={ 0 } max={ 100 }
							onChange={ value => this.setGutter(value) }
						/> }
						{ hasImagesToShow && !useDefaults && (layout === 'masonry' || layout === 'square') && <RangeControl
							label={ __( 'Columns' ) } value={columns} min={2} max={5}
							onChange={ value => this.setColumns(value) }
						/> }
						{ hasImagesToShow && !useDefaults && (layout === 'justified') && <RangeControl
							label={ __( 'Row Height' ) } value={rowHeight} min={50} max={500}
							onChange={ value => this.setRowHeight(value) }
						/> }
						{ hasImagesToShow && !useDefaults && <CheckboxControl
							label={ __( 'Captions' ) } checked={ captions }
							onChange={ value => this.setCaptions(!captions) }
						/> }
						{ hasImagesToShow && <CheckboxControl
							label={ __( 'Use Default Settings' ) } checked={ useDefaults }
							onChange={ value => this.setUseDefaults(value) }
						/> }
						<TextControl
							label={ __( 'Custom CSS Classes' ) } value={customClass}
							onChange={ value => this.setCustomClass(value) }
						/>
					</PanelBody>
				</InspectorControls>
				{ noticeUI }
				<div>
					{ dropZone }
					{isBusy && (<div className={'mgl-gtb-container' + (isBusy ? ' mgl-busy' : '')}>
						<span className='components-spinner' style={{  }} /></div>)}
					{htmlPreview && (<div dangerouslySetInnerHTML={{__html: htmlPreview}}></div>)}
					{hasImagesToShow && !htmlPreview && (<p>Please <a style={{cursor: 'pointer'}}
						onClick={() => this.onRefresh()}>click here</a> to refresh the preview.</p>)}
				</div>
			</Fragment>
		);
	}
}

export default withNotices( GalleryEdit );
```