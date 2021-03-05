<?php

class Meow_MGL_Core {

	private $gallery_process = false;
	private $is_gallery_used = true; // TODO: Would be nice to detect if the gallery is actually used on the current page.

	public function __construct() {
		load_plugin_textdomain( MGL_DOMAIN, false, MGL_PATH . '/languages' );

		// Initializes the classes needed
		MeowCommon_Helpers::is_rest() && new Meow_MGL_Rest( $this );
		is_admin() && new Meow_MGL_Admin();
		class_exists( 'MeowPro_MGL_Core' ) && new MeowPro_MGL_Core();

		// The gallery build process should only be enabled if the request is non-asynchronous
		if ( !MeowCommon_Helpers::is_asynchronous_request()  ) {
			add_filter( 'wp_get_attachment_image_attributes', array( $this, 'wp_get_attachment_image_attributes' ), 25, 3 );
			if ( is_admin() || $this->is_gallery_used ) {
				new Meow_MGL_Run( $this );
			}
		}
	}

	// Use by the Gutenberg block

	// Rewrite the sizes attributes of the src-set for each image
	function wp_get_attachment_image_attributes( $attr, $attachment, $size ) {
		if (!$this->gallery_process)
			return $attr;
		$sizes = null;
		if ( $this->gallery_layout === 'tiles' )
			$sizes = '50vw';
		else if ( $this->gallery_layout === 'masonry' )
			$sizes = '50vw';
		else if ( $this->gallery_layout === 'square' )
			$sizes = '33vw';
		else if ( $this->gallery_layout === 'cascade' )
			$sizes = '80vw';
		else if ( $this->gallery_layout === 'justified' )
			$sizes = '(max-width: 800px) 80vw, 50vw';
		$sizes = apply_filters( 'mgl_sizes', $sizes, $this->gallery_layout, $attachment, $attr );
		if ( !empty( $sizes ) )
			$attr['sizes'] = $sizes;
		return $attr;
	}

	function gallery( $atts, $isPreview = false ) {
		$atts = apply_filters( 'shortcode_atts_gallery', $atts, null, $atts );

		// Get the IDs
		$images = array();
		if ( isset( $atts['ids'] ) )
			$images = $atts['ids'];
		if ( isset( $atts['include'] ) ) {
			$images = is_array( $atts['include'] ) ? implode( ',', $atts['include'] ) : $atts['include'];
			$atts['include'] = $images;
		}
		if ( empty( $images ) ) {
			$attachments = get_attached_media( 'image' );
			$attachmentIds = array_map( function($x) { return $x->ID; }, $attachments );
			if ( !empty( $attachmentIds ) )
				$images = implode( ',', $attachmentIds );
			else
				return "<p class='meow-error'><b>Meow Gallery:</b> The gallery is empty.</p>";
		}

		if ( $isPreview ) {
			$check = explode( ',', $images );
			$check = array_slice( $check, 0, 40 );
			$images = implode( ',', $check );
		}

		// Ordering
		if ( isset( $atts['orderby'] ) ) {
			$images = explode( ',', $images );
			$images = Meow_MGL_OrderBy::run( $images, $atts['orderby'], isset( $atts['order'] ) ? $atts['order'] : 'asc' );
			$images = implode( ',', $images );
		}

		//DEBUG: Display $atts
		//error_log( print_r( $atts, 1 ) );
		
		// Layout
		$layout = 'none';
		if ( isset( $atts['layout'] ) && $atts['layout'] != 'default' )
			$layout = $atts['layout'];
		else if ( isset( $atts['mgl-layout'] ) && $atts['mgl-layout'] != 'default' )
			$layout = $atts['mgl-layout'];
		else
			$layout = get_option( 'mgl_layout', 'tiles' );

		// Check the settings
		if ( $layout === 'none' )
			return gallery_shortcode( $atts );
		$layoutClass = 'Meow_MGL_Builders_' . ucfirst( $layout );
		if ( !class_exists( $layoutClass ) ) {
			error_log( "Meow Gallery: Class $layoutClass does not exist." );
			return "<p class='meow-error'><b>Meow Gallery:</b> The layout $layout is not available in this version.</p>";
		}

		// Start the process of building the gallery
		$this->gallery_process = true;
		$this->gallery_layout = $layout;
		wp_enqueue_style( 'mgl-css' );
		$infinite = get_option( 'mgl_infinite', false ) && class_exists( 'MeowPro_MGL_Core' );
		$gen = new $layoutClass( $atts, !$isPreview && $infinite, $isPreview );
		$result = $gen->build( $images );
		$this->gallery_process = false;
		do_action( 'mgl_' . $layout . '_gallery_created', $layout );
		//$result = apply_filters( 'post_gallery', $result, $atts, null );

		return $result;
	}
}

?>
