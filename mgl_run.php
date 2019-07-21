<?php

class Meow_Gallery_Run {

	public $admin = null;

	public function __construct( $admin ) {
		$this->admin = $admin;
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
		add_filter( 'wp_get_attachment_image_attributes', array( $this, 'wp_get_attachment_image_attributes' ), 25, 3 );
		add_shortcode( 'gallery', array( $this, 'gallery' ) );
		add_shortcode( 'meow-gallery', array( $this, 'gallery' ) );
		add_action( 'rest_api_init', array( $this, 'rest_api_init' ) );
		add_filter( 'wpseo_sitemap_urlimages', array( $this, 'wpseo_siteimap' ), 10, 2 );
		require_once dirname( __FILE__ ) . '/builders/tiles.php';
		require_once dirname( __FILE__ ) . '/builders/justified.php';
		require_once dirname( __FILE__ ) . '/builders/masonry.php';
		require_once dirname( __FILE__ ) . '/builders/square.php';
		require_once dirname( __FILE__ ) . '/builders/cascade.php';
	}

	private $atts;
	private $gallery_process = false;

	function rest_api_init () {
		register_rest_route( 'meow_gallery', '/preview', array(
			'methods' => 'POST',
			'callback' => array( $this, 'preview' ),
		) );
	}

	// Use by the Gutenberg block
	function preview( WP_REST_Request $request ) {
		$params = $request->get_body();
		$params = json_decode( $params );
		$params->ids = implode( ',', $params->ids );
		$atts = (array) $params;
		return $this->gallery( $atts, true );
	}

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
		$images = array();
		if ( isset( $atts['ids'] ) )
			$images = $atts['ids'];
		if ( isset( $atts['include'] ) ) {
			$images = is_array( $atts['include'] ) ? implode( $atts['include'], ',' ) : $atts['include'];
			$atts['include'] = $images;
		}
		if ( empty( $images ) )
			return "<p class='meow-error'><b>Meow Gallery:</b> The gallery is empty.</p>";

		
		if ( isset( $atts['orderby'] ) ) {
			require_once dirname( __FILE__ ) . '/mgl_orderby.php';
			Meow_Gallery_OrderBy::run( $images, $atts['orderby'], isset( $atts['order'] ) ? $atts['order'] : $atts['order'] );
		}

		if ( $isPreview ) {
			$check = explode( ',', $images );
			$check = array_slice( $check, 0, 40 );
			$images = implode( ',', $check );
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
		$layoutClass = 'Meow_' . ucfirst( $layout ) . '_Generator';
		if ( !class_exists( $layoutClass ) ) {
			error_log( "Meow Gallery: Class $layoutClass does not exist." );
			return "<p class='meow-error'><b>Meow Gallery:</b> The layout $layout is not available in this version.</p>";
		}

		// Start the process of building the gallery
		$this->gallery_process = true;
		$this->gallery_layout = $layout;
		wp_enqueue_style( 'mgl-css' );
		$infinite = get_option( 'mgl_infinite', false ) && $this->admin->is_registered();
		$gen = new $layoutClass( $atts, $infinite, $isPreview );
		$result = $gen->build( $images );
		$this->gallery_process = false;
		do_action( 'mgl_' . $layout . '_gallery_created', $layout );
		$result = apply_filters( 'post_gallery', $result, $atts, null );

		return $result;
	}

	function enqueue_scripts() {
		global $mgl_version;
		$physical_file = plugin_dir_path( __FILE__ ) . 'js/mgl.js';
		$version = file_exists( $physical_file ) ? filemtime( $physical_file ) : $mgl_version;
		wp_enqueue_script( 'mgl-js', plugins_url( 'js/mgl.js', __FILE__ ), array( 'jquery' ), $version, false );
		wp_register_style( 'mgl-css', plugin_dir_url( __FILE__ ) . 'css/style.css', null, $version );
	}

	/*
		For Yoast SEO
	*/

	function wpseo_siteimap( $images, $post_id ) {
		$galleries = get_post_galleries( $post_id );
		$images_ids = array();
		foreach ( $galleries as $gallery ) {
			preg_match_all( '/wp\-image\-([0-9]{1,16})/', $gallery, $matches );
			if ( !empty( $matches ) ) {
				foreach ( $matches[1] as $id )
					array_push( $images_ids, $id );
			}
		}
		$images_ids = array_unique( $images_ids );
		foreach ( $images_ids as $id ) {
			array_push( $images, array(
				'src' => wp_get_attachment_url( $id ),
				'title' => get_the_title( $id ),
				'alt' => get_post_meta( $id, '_wp_attachment_image_alt', true )
			) );
		}
		return $images;
	}

}

?>
