<?php

class Meow_Gallery_Run {

	public $admin = null;

	public function __construct( $admin ) {
		$this->admin = $admin;
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
		add_filter( 'shortcode_atts_gallery', array( $this, 'shortcode_atts_gallery' ), 50, 3 );
		add_shortcode( 'gallery', array( $this, 'gallery' ) );
		require_once dirname( __FILE__ ) . '/builders/tiles.php';
		require_once dirname( __FILE__ ) . '/builders/justified.php';
		require_once dirname( __FILE__ ) . '/builders/masonry.php';
		require_once dirname( __FILE__ ) . '/builders/square.php';
	}

	private $atts;
	private $gallery_process = false;

	function shortcode_atts_gallery( $result, $defaults, $atts ) {
		$this->atts = $atts;
		if ( empty( $defaults['size'] ) || $defaults['size'] == 'thumbnail' ) {
			$default_size = get_option( 'mgl_default_size', 'large' );
			$result['size'] = $default_size;
		}
		return $result;
	}

	function gallery( $atts ) {
		$atts = apply_filters( 'shortcode_atts_gallery', $atts, array(), array() );
		$images = [];
		if ( isset( $atts['ids'] ) )
			$images = $atts['ids'];
		if ( isset( $atts['include'] ) )
			$images = implode( $atts['include'], ',' );
		if ( empty( $images ) )
			return "<p>The gallery is empty.</p>";
		$layout = ( isset( $atts['mgl-layout'] ) && $atts['mgl-layout'] != 'default' ) ? $atts['mgl-layout'] : get_option( 'mgl_layout', 'tiles' );
		$this->gallery_process = true;
		$layoutClass = 'Meow_' . ucfirst( $layout ) . '_Generator';
		if ( !class_exists( $layoutClass ) ) {
			error_log( "Meow Gallery: Class $layoutClass does not exist." );
			return;
		}
		wp_enqueue_style( 'mgl-css' );
		$infinite = get_option( 'mgl_infinite', false ) && $this->admin->is_registered();
		$gen = new $layoutClass( $atts, $infinite );
		$result = $gen->build( $images );
		$this->gallery_process = false;
		do_action( 'mgl_' . $layout . '_gallery_created', $layout );
		return $result;
	}

	function enqueue_scripts() {
		global $mgl_version;
		// wp_enqueue_script( 'mgl-js', plugins_url( '/js/mgl.js', __FILE__ ), null, $mgl_version, false );
		// wp_localize_script('mgl-js', 'mgl', array(
		// 	'settings' => array(
		// 		'layout' => get_option( 'mgl_layout', 'tiles' ),
		// 		'tiles' => array (
		// 			'gutter' => get_option( 'mgl_tiles_gutter', 10 ),
		// 			'row_height' => get_option( 'mgl_tiles_row_height', 200 )
		// 		),
		// 		'justified' => array (
		// 			'gutter' => get_option( 'mgl_justified_gutter', 10 ),
		// 			'row_height' => get_option( 'mgl_justified_row_height', 200 )
		// 		),
		// 		'masonry' => array (
		// 			'gutter' => get_option( 'mgl_masonry_gutter', 10 ),
		// 			'columns' => get_option( 'mgl_masonry_columns', 200 )
		// 		),
		// 		'square' => array (
		// 			'gutter' => get_option( 'mgl_square_gutter', 10 ),
		// 			'columns' => get_option( 'mgl_square_columns', 5 )
		// 		),
		// 		'slider' => array (
		// 			'nav_enabled' => get_option( 'mgl_slider_nav_enabled', true ),
		// 			'nav_height' => get_option( 'mgl_slider_nav_height', 80 ),
		// 			'image_height' => get_option( 'mgl_slider_image_height', 500 )
		// 		),
		// 		'infinite_loading' => array(
		// 			'enabled' => get_option( 'mgl_infinite', false ) && $this->admin->is_registered(),
		// 			'animated' => get_option( 'mgl_infinite_animation', true ),
		// 			'batch_size' => get_option( 'mgl_infinite_batch_size', 20 ),
		// 			'loader' => array(
		// 				'enabled' => get_option( 'mgl_infinite_loader', true ),
		// 				'color' => get_option( 'mgl_infinite_loader_color', '#444444' )
		// 			)
		// 		)
		// 	)
		// ) );
		wp_enqueue_script( 'mgl-js', plugins_url( 'js/mgl.js', __FILE__ ), array( 'jquery' ),
			filemtime( plugin_dir_path( __FILE__ ) . 'js/mgl.js' ), false );
		wp_register_style( 'mgl-css', plugin_dir_url( __FILE__ ) . 'css/style.min.css', null,
			filemtime( plugin_dir_path( __FILE__ ) . 'css/style.min.css' ) );
	}

}

?>
