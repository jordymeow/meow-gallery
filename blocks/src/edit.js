const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const { IconButton, Icon, DropZone, FormFileUpload, PanelBody, RangeControl,
	CheckboxControl, SelectControl, Toolbar, withNotices } = wp.components;
const { BlockControls, MediaUpload, MediaPlaceholder, InspectorControls, mediaUpload } = wp.editor;

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

	setGutter( value ) {
		this.props.setAttributes({ gutter: value });
		this.onRefresh({ gutter: value });
	}

	setRowHeight(value) {
		this.props.setAttributes({ 'rowHeight': value });
		this.onRefresh({ 'rowHeight': value });
	}

	setWplrCollection(value) {
		if (!value || value === '') {
			this.props.setAttributes({ 'wplrCollection': '', 'wplrFolder': '' });
			this.onRefresh({ 'wplrCollection': '', 'wplrFolder': '' });
			return;
		}
		const col = mgl_gallery_block_params.wplr_collections.find(x => x.wp_col_id === value);
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

	async onRefresh(newAttributes = {}) {
		let attributes = { ...this.props.attributes, ...newAttributes }
		const ids = attributes.images.map(x => x.id);
		const { layout, useDefaults, gutter, columns, rowHeight, captions, wplrCollection, wplrFolder } = attributes;
		this.setState( { isBusy: true } );
		const response = await fetch( `${wpApiSettings.root}meow_gallery/preview`, {
			cache: 'no-cache',
			headers: { 'user-agent': 'WP Block', 'content-type': 'application/json' },
			method: 'POST',
			redirect: 'follow',
			referrer: 'no-referrer',
			body: useDefaults ? JSON.stringify({ ids, layout }) :
				JSON.stringify({ ids, layout, gutter, columns, 'row-height': rowHeight,
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
		if (window.mglCalculateRow)
			mglCalculateRow();
		else
			console.log('Meow Gallery: mglCalculateRow does not exist.');
	}

	refreshSlider() {
		if (window.mglInitSliders)
			mglInitSliders();
		else
			console.log('Meow Gallery: mglInitSliders does not exist.');
	}

	componentDidMount() {
		if (!this.props.attributes.layout)
			this.props.setAttributes({ layout: 'tiles' });
		if (this.props.attributes.layout === 'tiles')
			this.refreshTiles();
		if (this.props.attributes.layout === 'slider')
			this.refreshSlider();
	}

	componentDidUpdate( prevProps ) {
		if (this.props.attributes.layout === 'tiles')
			this.refreshTiles();
		if (this.props.attributes.layout === 'slider')
			this.refreshSlider();
	}

	render() {
		const { isBusy } = this.state;
		const { attributes, isSelected, className, noticeOperations, noticeUI } = this.props;
		const { layout, useDefaults, images, gutter, columns, rowHeight, htmlPreview,
			captions, wplrCollection, wplrFolder } = attributes;
		const dropZone = (<DropZone onFilesDrop={ this.addFiles } />);

		const controls = (
			<BlockControls>
			{!!images.length && (
				<Toolbar>
					<MediaUpload
						onSelect={ this.onSelectImages } allowedTypes={ ALLOWED_MEDIA_TYPES } multiple gallery
						value={ images.map( ( img ) => img.id ) }
						render={ ({ open }) => (
							<IconButton className="components-toolbar__control" label={ __( 'Edit Gallery' ) }
								icon="edit" onClick={ open } />
						)}
					/>
					<IconButton className="components-toolbar__control" label={ __( 'Refresh' ) }
						icon="controls-repeat" onClick={() => this.onRefresh()} />
				</Toolbar>
			)}
			</BlockControls>
		);

		if ( images.length === 0 ) {
			return (
				<Fragment>
					{ controls }
					<MediaPlaceholder icon="format-gallery" className={ className } multiple accept="image/*"
						labels={ {
							title: __( 'Gallery' ),
							instructions: __( 'Drag images, upload new ones or select files from your library.' ),
						} }
						onSelect={ this.onSelectImages }
						allowedTypes={ ALLOWED_MEDIA_TYPES }
						notices={ noticeUI }
						onError={ noticeOperations.createErrorNotice }
					/>
				</Fragment>
			);
		}

		let wplrCollections = '';
		if (window.mgl_gallery_block_params && mgl_gallery_block_params.wplr_collections) {
			let categories = mgl_gallery_block_params.wplr_collections.map(x => {
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
								{ value: 'slider', label: 'Slider' }
							]}>
						</SelectControl>
						{wplrCollections}
						{ images.length > 1 && !useDefaults && <RangeControl
							label={ __( 'Gutter' ) } value={ gutter } min={ 0 } max={ 100 }
							onChange={ value => this.setGutter(value) }
						/> }
						{ images.length > 1 && !useDefaults && (layout === 'masonry' || layout === 'square') && <RangeControl
							label={ __( 'Columns' ) } value={columns} min={2} max={5}
							onChange={ value => this.setColumns(value) }
						/> }
						{ images.length > 1 && !useDefaults && (layout === 'justified') && <RangeControl
							label={ __( 'Row Height' ) } value={rowHeight} min={50} max={500}
							onChange={ value => this.setRowHeight(value) }
						/> }
						{ images.length > 1 && !useDefaults && <CheckboxControl
							label={ __( 'Captions' ) } checked={ captions }
							onChange={ value => this.setCaptions(value) }
						/> }
						{ images.length > 1 && <CheckboxControl
							label={ __( 'Use Default Settings' ) } checked={ useDefaults }
							onChange={ value => this.setUseDefaults(value) }
						/> }
						{/* <SelectControl
							label={ __( 'Link To' ) }
							value={ linkTo }
							onChange={ this.setLinkTo }
							options={ linkOptions }
						/> */}
					</PanelBody>
				</InspectorControls>
				{ noticeUI }
				<div>
					{ dropZone }
					{isBusy && (<div className={'mgl-gtb-container' + (isBusy ? ' mgl-busy' : '')}>
						<span className='components-spinner' style={{  }} /></div>)}
					{htmlPreview && (<div dangerouslySetInnerHTML={{__html: htmlPreview}}></div>)}
					{!htmlPreview && (<p>Please <a style={{cursor: 'pointer'}}
						onClick={() => this.onRefresh()}>click here</a> to refresh the preview.</p>)}
					{images.length === 0 && isSelected &&
						<div className="blocks-gallery-item has-add-item-button">
							<FormFileUpload multiple isLarge className="block-library-gallery-add-item-button"
								onChange={ this.uploadFromFiles } accept="image/*" icon="insert">
								{ __( 'Upload an image' ) }
							</FormFileUpload>
						</div>
					}
				</div>
			</Fragment>
		);
	}
}

export default withNotices( GalleryEdit );