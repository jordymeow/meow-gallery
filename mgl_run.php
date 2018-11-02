<?php

class Meow_Gallery_Run {

	public $admin = null;

	public function __construct( $admin ) {
		$this->admin = $admin;
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
		add_filter( 'shortcode_atts_gallery', array( $this, 'shortcode_atts_gallery' ), 50, 3 );
		add_shortcode( 'gallery', array( $this, 'gallery' ) );
		add_action( 'rest_api_init', array( $this, 'rest_api_init' ) );
		require_once dirname( __FILE__ ) . '/builders/tiles.php';
		require_once dirname( __FILE__ ) . '/builders/justified.php';
		require_once dirname( __FILE__ ) . '/builders/masonry.php';
		require_once dirname( __FILE__ ) . '/builders/square.php';
	}

	private $atts;
	private $gallery_process = false;

	function shortcode_atts_gallery( $result, $defaults, $atts ) {
		$this->atts = $atts;
		if ( !empty( $atts['size'] ) )
			$result['size'] = $atts['size'];
		else if ( empty( $defaults['size'] ) || $defaults['size'] == 'thumbnail' ) {
			$default_size = get_option( 'mgl_default_size' );
			$default_size = empty( $default_size ) ? 'large' : $default_size;
			$result['size'] = $default_size;
		}
		return $result;
	}

	function rest_api_init () {
		register_rest_route( 'meow_gallery', '/preview', array(
			'methods' => 'POST',
			'callback' => array( $this, 'preview' ),
		) );
	}

	function preview(WP_REST_Request $request) {
		$params = $request->get_body();
		$params = json_decode( $params );
		$params->ids = implode( ',', $params->ids );
		$atts = (array) $params;
		return $this->gallery( $atts, true );
	}

	function gallery( $atts, $isPreview = false ) {
		$atts = apply_filters( 'shortcode_atts_gallery', $atts, null, $atts );
		$images = [];
		if ( isset( $atts['ids'] ) )
			$images = $atts['ids'];
		if ( isset( $atts['include'] ) )
			$images = implode( $atts['include'], ',' );
		if ( empty( $images ) )
			return "<p class='meow-error'><b>Meow Gallery:</b> The gallery is empty.</p>";

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


		$this->gallery_process = true;
		if ( $layout === 'none' ) {
			error_log( "Meow Gallery: A gallery is set to default layout, but there is none (check your settings)." );
			return "<p class='meow-error'><b>Meow Gallery:</b> This gallery is set to the <i>Default</i> layout, but <i>None</i> has been selected as the <i>Default Layout</i> in your settings.</p>";
		}
		$layoutClass = 'Meow_' . ucfirst( $layout ) . '_Generator';
		if ( !class_exists( $layoutClass ) ) {
			error_log( "Meow Gallery: Class $layoutClass does not exist." );
			return "<p class='meow-error'><b>Meow Gallery:</b> The layout $layout is not available in this version.</p>";
		}
		wp_enqueue_style( 'mgl-css' );
		$infinite = get_option( 'mgl_infinite', false ) && $this->admin->is_registered();
		$gen = new $layoutClass( $atts, $infinite, $isPreview );
		$result = $gen->build( $images );
		$this->gallery_process = false;
		do_action( 'mgl_' . $layout . '_gallery_created', $layout );
		return $result;
	}

	function enqueue_scripts() {
		global $mgl_version;
		$physical_file = plugin_dir_path( __FILE__ ) . 'js/mgl.js';
		$version = file_exists( $physical_file ) ? filemtime( $physical_file ) : $mgl_version;
		wp_enqueue_script( 'mgl-js', plugins_url( 'js/mgl.js', __FILE__ ), array( 'jquery' ), $version, false );
		wp_register_style( 'mgl-css', plugin_dir_url( __FILE__ ) . 'css/style.min.css', null, $version );
	}

}

?>
