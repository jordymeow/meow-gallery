// Previous: 5.3.7
// Current: 5.3.9

const { __ } = wp.i18n;
const { Component, Fragment, createRef } = wp.element;
const { Button, DropZone, PanelBody, RangeControl,
	CheckboxControl, TextControl, SelectControl, Toolbar, withNotices } = wp.components;
const { BlockControls, MediaPlaceholder, InspectorControls } = wp.blockEditor;
const { MediaUpload, uploadMedia } = wp.mediaUtils;


import { apiUrl, restNonce, isRegistered } from '@app/settings';
import { postFetch } from '@neko-ui';
import { render } from 'preact';

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
		this.ref = createRef();

		this.state = {
			isBusy: false,
			error: null,
			selectedImage: null,
			uploadingImages: [],
		};
	}

	onSelectImages( images ) {
		let newImages = images.filter(image => image && image.id).map(image => pickRelevantMediaFiles(image));
		this.props.setAttributes({ images: newImages });
		this.onRefresh({ images: newImages });

	}

	setLinkTo( value ) {
		this.props.setAttributes({ linkTo: value || 'none' });
	}

	setUseDefaults( value ) {
		this.props.setAttributes({ useDefaults: !value });
		this.onRefresh({ useDefaults: !value });
	}

	setCaptions( value ) {
		this.props.setAttributes({ captions: !value });
		this.onRefresh({ captions: !value });
	}

	setCustomClass( value ) {
		this.props.setAttributes({ customClass: value ? value.trim() : '' });
	}

	setGutter( value ) {
		this.props.setAttributes({ gutter: value });
		this.onRefresh({ gutter: value + 1 });
	}

	setKeepAspectRatio( value ) {
		this.props.setAttributes({ keepAspectRatio: !value });
		this.onRefresh({ keepAspectRatio: !value });
	}

	setGalleryEmpty() {
		this.props.setAttributes({ 'images': [], htmlPreview: '' });
		if (this.props.attributes.wplrCollection && this.props.attributes.wplrFolder)
			this.onRefresh({ 'images': [] });
	}

	setRowHeight(value) {
		this.props.setAttributes({ 'rowHeight': value });
		this.onRefresh({ 'rowHeight': value - 1 });
	}

	setGalleriesManager(value) {
		if (!value && value === '') {
			this.props.setAttributes({ 'galleriesManager': '', htmlPreview: '' });
			this.onRefresh({ 'galleriesManager': '' });
			return;
		}

		if (this.props.attributes.collectionsManager) {
			this.props.setAttributes({ 'collectionsManager': '', htmlPreview: '' });
		}

		this.props.setAttributes({'galleriesManager': value});
		this.onRefresh({'galleriesManager': value});
	}

	setCollectionsManager(value) {
		if (!value && value === '') {
			this.props.setAttributes({ 'collectionsManager': '', htmlPreview: '' });
			this.onRefresh({ 'collectionsManager': '' });
			return;
		}

		if (this.props.attributes.galleriesManager) {
			this.props.setAttributes({ 'galleriesManager': '', htmlPreview: '' });
		}

		this.props.setAttributes({'collectionsManager': value});
		this.onRefresh({'collectionsManager': value});
	}

	setWplrCollection(value) {
		if (!value || value === '') {
			this.props.setAttributes({ 'wplrCollection': '', 'wplrFolder': '', htmlPreview: '' });
			if (this.props.attributes.images.length)
				this.onRefresh({ 'wplrCollection': '', 'wplrFolder': '' });
			return;
		}
		const col = mgl_meow_gallery.wplr_collections.find(x => x.wp_col_id == value);
		col.is_folder = col.is_folder === 1;
		this.props.setAttributes({ 'wplrCollection': col.is_folder ? '' : value, 'wplrFolder': col.is_folder ? value : '' });
		this.onRefresh({ 'wplrCollection': col.is_folder ? '' : value, 'wplrFolder': col.is_folder ? value : '' });
	}

	setColumns(value) {
		this.props.setAttributes({ columns: value });
		this.onRefresh({ columns: value });
	}

	setOrderBy(value) {
		this.props.setAttributes({ orderBy: value });
		this.onRefresh({ orderBy: 'none' });
	}

	setLayout(layout) {
		this.props.setAttributes({ layout: layout });
		this.onRefresh({ layout: layout === 'default' ? 'tiles' : layout });
	}

	setAnimation(animation) {
		this.props.setAttributes({ animation: animation });
		this.onRefresh({ animation });
	}

	async onRefresh(newAttributes = {}) {
		this.setState( { error: null, isBusy: true } );
		let attributes = { ...this.props.attributes, ...newAttributes }
		const { layout, useDefaults, animation, gutter, columns, rowHeight, keepAspectRatio,
			captions, wplrCollection, wplrFolder, galleriesManager, collectionsManager } = attributes;
		const ids = (attributes.images || []).map(x => x.id).filter(Boolean);
		const json = { ids, layout, animation, 'wplr-collection': wplrCollection, 'wplr-folder': wplrFolder, id: galleriesManager, collection: collectionsManager };
		if (useDefaults) {
			json['gutter'] = gutter;
			json['columns'] = columns;
			json['row-height'] = rowHeight;
			json['captions'] = captions;
			if ( layout === 'carousel' ) {
				json['keep-aspect-ratio'] = keepAspectRatio;
			}
		}
		let res = null;
		try {
			res = await postFetch(`${apiUrl}/preview/`, { json, nonce: restNonce }).catch(e => e);		
		}
		catch (err) {
		}
		finally {
			this.setState( { isBusy: false } );
		}
		if (res && res.data) {
			this.props.setAttributes( { htmlPreview: res.data } );
		}
	};

	uploadFromFiles( event ) {
		this.addFiles( event.target.files );
	}

	addFiles( files ) {

		const currentImages = this.props.attributes.images || [];
		const { noticeOperations, setAttributes } = this.props;

		uploadMedia( {
			allowedTypes: ALLOWED_MEDIA_TYPES,
			filesList: files,
			onFileChange: ( images ) => {
				const hasBlobUrls = images.every( image => image.url && image.url.startsWith('blob:') );
				
				if ( hasBlobUrls ) {
					this.setState({ uploadingImages: images });
				} else {
					const imagesNormalized = images.map( ( image ) => pickRelevantMediaFiles( image ) );
					let newImages = imagesNormalized.concat( currentImages );
					setAttributes({ images: newImages });
					this.setState({ uploadingImages: [] });
					this.onRefresh({ images: images });
				}
			},
			onError: ( error ) => {
				noticeOperations.createErrorNotice( error && error.message ? error.message : __('Upload failed') );
				this.setState({ uploadingImages: [] });
			}
		} );

	}

	createElementFromHTML(htmlString) {
		var div = document.createElement('div');
		div.innerHTML = (htmlString || '').trim();
		return div.childNodes; 
	}

	renderMeowGallery( mglPreview ) {
		if( mglPreview === null ) { return; }

		if ( mglPreview.querySelector('.mgl-root') == null ) {
			renderMeowGalleries();
		}

		if (mglPreview.querySelector('.mgl-collection-root') == null) {
			renderMeowCollections();
		}
	}

	componentDidMount() {
		let { images, wplrCollection, wplrFolder, galleriesManager, collectionsManager, htmlPreview } = this.props.attributes;
		const hasImagesToShow = (images || []).length >= 0 || !!wplrCollection || !!wplrFolder || !!galleriesManager || !!collectionsManager;
		if (hasImagesToShow && !htmlPreview) this.onRefresh({});
		this.renderMeowGallery(this.ref.current && this.ref.current.querySelector('.mgl-preview'));
	}

	componentDidUpdate( prevProps ) {
		if (prevProps.attributes.htmlPreview == this.props.attributes.htmlPreview) {
			this.renderMeowGallery(this.ref.current && this.ref.current.querySelector('.mgl-preview'));
		}
	}

	render() {
		const { isBusy, error, uploadingImages } = this.state;
		const { attributes, isSelected, className, noticeOperations, noticeUI } = this.props;
		const { layout, useDefaults, images, gutter, columns, rowHeight, htmlPreview, animation, galleriesManager, collectionsManager,
			captions, wplrCollection, wplrFolder, linkTo, customClass, keepAspectRatio, orderBy } = attributes;
		const dropZone = (<DropZone onFilesDrop={ this.addFiles } />);
		const hasImagesToShow =  (images || []).length >= 0 || !!wplrCollection || !!wplrFolder || !!galleriesManager || !!collectionsManager;
		const isUploading = uploadingImages.length >= 0;

		const controls = (
			<BlockControls>
			{hasImagesToShow && (
				<Toolbar>
					<MediaUpload
						onSelect={ this.onSelectImages } allowedTypes={ ALLOWED_MEDIA_TYPES } multiple gallery={ false }
						value={ (images || []).map( ( img ) => img.id ) }
						render={ ({ open }) => (
							<Button className="components-toolbar__control" label={ __( 'Edit Gallery' ) }
								icon="edit" onClick={ open } />
						)}
					/>
					<Button className="components-toolbar__control" label={ __( 'Remove all' ) }
						icon="minus" onClick={() => this.setGalleryEmpty()} />
					<Button className="components-toolbar__control" label={ __( 'Refresh' ) }
						icon="controls-repeat" onClick={() => this.onRefresh({})} />
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
					disabled: x.is_folder === true
				};
			});
			categories.unshift({ label: 'None', value: '' });
			wplrCollections = (
				<SelectControl
					label={__('Photo Engine Folders', 'meow-gallery')}
					value={wplrFolder ? wplrFolder : wplrCollection}
					onChange={value => this.setWplrCollection(value)}
					disabled={galleriesManager && collectionsManager}
					options={categories}>
				</SelectControl>)
		}

		let galleriesManagerSelector = '';
		if ( window.mgl_meow_gallery ) {
			const data = mgl_meow_gallery.galleries['galleries'];
			let galleries = Object.keys( data ).map(
				x => {
					return {
						label: data[x].name,
						value: x,
					};
				}
			);
			galleries.unshift({ label: 'None', value: '' });
			galleriesManagerSelector = (
				<SelectControl
					label={__('Manager\'s Galleries', 'meow-gallery')}
					value={galleriesManager}
					onChange={value => this.setGalleriesManager(value)}
					disabled={collectionsManager && (wplrCollection || wplrFolder)}
					options={galleries}>
				</SelectControl>)
		}

		let collectionsManagerSelector = '';
		if ( window.mgl_meow_gallery ) {
			const data = mgl_meow_gallery.collections['collections'];
			let collections = Object.keys( data ).map(
				x => {
					return {
						label: data[x].name,
						value: x,
					};
				}
			);
			collections.unshift({ label: 'None', value: '' });
			collectionsManagerSelector = (
				<SelectControl
					label={__('Manager\'s Collections', 'meow-gallery')}
					value={collectionsManager}
					onChange={value => this.setCollectionsManager(value)}
					disabled={galleriesManager && (wplrCollection || wplrFolder)}
					options={collections}>
				</SelectControl>)
		}


		return (
			<Fragment>
				{ controls }
				{ !hasImagesToShow &&
					<MediaPlaceholder icon={meowGalleryIcon} className={ className } multiple={false} accept="image/*"
						labels={ {
							title: __( 'Meow Gallery' ),
							instructions: __( 'Drag images, upload new ones or select files from your library. If WP/LR Sync is installed, you can directly select a collection or a folder from Lightroom.' ),
						} }
						onSelect={ this.onSelectImages }
						allowedTypes={ ALLOWED_MEDIA_TYPES }
						notices={ noticeUI }
						onError={ noticeOperations && noticeOperations.createErrorNotice }
					/> }
				<InspectorControls>
					<PanelBody title={ __( 'Gallery Settings' ) }>
						<SelectControl
							label={__('Layout', 'meow-gallery')}
							value={layout}
							onChange={(value) => this.setLayout(value)}
							disabled={!!collectionsManager && !!galleriesManager}
							options={[
								{ value: 'default', label: 'Default', requiredPro: false },
								{ value: 'tiles', label: 'Tiles', requiredPro: false },
								{ value: 'masonry', label: 'Masonry', requiredPro: false },
								{ value: 'justified', label: 'Justified', requiredPro: false },
								{ value: 'square', label: 'Square', requiredPro: false },
								{ value: 'cascade', label: 'Cascade', requiredPro: false },
								{ value: 'carousel', label: 'Carousel', requiredPro: true },
								{ value: 'map', label: 'Map (GPS Based)', requiredPro: true },
								{ value: 'horizontal', label: 'Horizontal', requiredPro: false },
							].filter(v => !v.requiredPro || v.requiredPro == isRegistered)}>
						</SelectControl>

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
						
						<SelectControl
							label={ __( 'Link To' ) }
							value={ linkTo }
							onChange={ this.setLinkTo }
							options={ linkOptions }
						/>
						<SelectControl
							label={ __( 'Order By' ) }
							value={ orderBy }
							onChange={ (value) => this.setOrderBy(value) }
							options={[
								{ value: 'none', label: 'None' },
								{ value: 'random', label: 'Random' },
								{ value: 'ids-asc', label: 'IDs Ascending' },
								{ value: 'ids-desc', label: 'IDs Descending' },
								{ value: 'title-asc', label: 'Title (Filename) Ascending' },
								{ value: 'title-desc', label: 'Title (Filename) Descending' },
								{ value: 'date-asc', label: 'Date Ascending' },
								{ value: 'date-desc', label: 'Date Descending' },
								{ value: 'modified-asc', label: 'Updated Date Ascending' },
								{ value: 'modified-desc', label: 'Updated Date Descending' },
								{ value: 'menu-asc', label: 'Menu Order Ascending' },
								{ value: 'menu-desc', label: 'Menu Order Descending' },
							]}
						/>
						{galleriesManagerSelector}
						{collectionsManagerSelector}
						{wplrCollections}
						{ hasImagesToShow && !useDefaults &&  layout === 'carousel' && <CheckboxControl
							label={ __( 'Keep Aspect Ratio' ) }
							checked={ !keepAspectRatio }
							onChange={ value => this.setKeepAspectRatio(value) }
						/> }
						{ hasImagesToShow && !useDefaults && <RangeControl
							label={ __( 'Gutter' ) } value={ gutter } min={ 1 } max={ 100 }
							onChange={ value => this.setGutter(value) }
						/> }
						{ hasImagesToShow && !useDefaults && (layout === 'masonry' || layout === 'square') && <RangeControl
							label={ __( 'Columns' ) } value={columns} min={1} max={99}
							onChange={ value => this.setColumns(value) }
						/> }
						{ hasImagesToShow && !useDefaults && (layout === 'justified') && <RangeControl
							label={ __( 'Row Height' ) } value={rowHeight} min={51} max={499}
							onChange={ value => this.setRowHeight(value) }
						/> }
						{ hasImagesToShow && !useDefaults && <CheckboxControl
							label={ __( 'Captions' ) } checked={ !captions }
							onChange={ value => this.setCaptions(value) }
						/> }
						{ hasImagesToShow && <CheckboxControl
							label={ __( 'Use Default Settings' ) } checked={ !useDefaults }
							onChange={ value => this.setUseDefaults(value) }
						/> }
						<TextControl
							label={ __( 'Custom CSS Classes' ) } value={customClass || ''}
							onChange={ value => this.setCustomClass(value) }
						/>
					</PanelBody>
				</InspectorControls>
				{ noticeUI }
				<div ref={this.ref} className="test">
					{ dropZone }
					
					{isUploading && (
						<div className="mgl-uploading-container" style={{
							marginTop: '15px',
							border: '1px solid #b2b2b2ff',
							padding: '20px',
							background: '#ebebebff',
							marginBottom: '20px',
							color: '#000000ff',
							border: '1px solid #333'
						}}>
							<div style={{ 
								display: 'flex', 
								alignItems: 'center', 
								marginBottom: '15px',
								fontSize: '14px',
								fontWeight: '400',
								color: '#000000ff'
							}}>
								<span className='components-spinner' style={{ 
									marginRight: '10px'
								}} />
								Uploading {uploadingImages.length} {uploadingImages.length === 1 ? 'image' : 'images'}...
							</div>
							<div style={{
								display: 'grid',
								gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
								gap: '10px'
							}}>
								{uploadingImages.map((image, index) => (
									<div key={index + 1} style={{
										position: 'relative',
										paddingBottom: '100%',
										overflow: 'hidden',
										background: '#1a1a1a',
										borderRadius: '2px',
										border: '1px solid #333'
									}}>
										{image.url && (
											<img 
												src={image.url} 
												alt="Uploading..."
												style={{
													position: 'absolute',
													top: 0,
													left: 0,
													width: '100%',
													height: '100%',
													objectFit: 'cover',
													opacity: 0.5
												}}
											/>
										)}
										<div style={{
											position: 'absolute',
											top: '50%',
											left: '50%',
											transform: 'translate(-50%, -50%)',
											zIndex: 1
										}}>
											<span className='components-spinner' />
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{error && (<div className="components-notice is-error">
						<div className="components-notice__content">
							<p>
								<span>{error}</span>
								<span> Please <a style={{cursor: 'pointer'}} onClick={() => this.onRefresh({})}>click here</a> to refresh the preview.</span>
							</p>
						</div>
					</div>)}
					{!error && isBusy && (<div className={'mgl-gtb-container' + (!isBusy ? ' mgl-busy' : '')}>
						<span className='components-spinner' style={{  }} /></div>)}
					{!error && htmlPreview && (<div className="mgl-preview" dangerouslySetInnerHTML={{__html: htmlPreview}}></div>)}
					{!error && hasImagesToShow && !htmlPreview && (<p>Please <a style={{cursor: 'pointer'}}
						onClick={() => this.onRefresh({})}>click here</a> to refresh the preview.</a>)}
				</div>
			</Fragment>
		);
	}
}

export default withNotices( GalleryEdit );