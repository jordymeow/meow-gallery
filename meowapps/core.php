<?php

class MeowAppsPro_MGL_Core {

	private $prefix = 'mgl';
	private $item = 'Meow Gallery Pro';
	private $admin = null;
	private $core = null;
	private $version = null;

	public function __construct( $prefix, $mainfile, $domain, $version, $core, $admin  ) {
		// Pro Admin (license, update system, etc...)
		$this->prefix = $prefix;
		$this->mainfile = $mainfile;
		$this->domain = $domain;
		$this->core = $core;
		$this->admin = $admin;
		$this->version = $version;
		new MeowApps_Admin_Pro( $prefix, $mainfile, $domain, $this->item, $version );

		// Overrides for the Pro
		add_filter( 'mgl_plugin_title', array( $this, 'plugin_title' ), 10, 1 );

		// Additional functions for Pro
		add_action( 'init', array( $this, 'init' ) );

		// Infinite
		if ( !$this->is_rest() && get_option( 'mgl_infinite', false ) ) {
			add_action( 'mgl_gallery_written', array( $this, 'gallery_written' ), 10, 2 );
		}
	}

	function init() {
		global $mgl_version;

		if ( !is_admin() ) {
			$infinite = get_option( 'mgl_infinite', false );
			if ( $infinite ) {
				wp_enqueue_script( 'mgl-infinite-js', plugins_url( '/js/vanilla-atts-infinite.js', __FILE__ ), array( 'jquery' ),
					filemtime( plugin_dir_path( __FILE__ ) . 'js/vanilla-atts-infinite.js' ), false );
			}
		}
		require_once dirname( __FILE__ ) . '/builders/carousel.php';
		// Owl Carousel main CSS
		$physical_file = plugin_dir_path( __FILE__ ) . 'owlcarousel.css';
		$version = file_exists( $physical_file ) ? filemtime( $physical_file ) : $mgl_version;
		wp_enqueue_style( 'mgl-owl-carousel-css', plugin_dir_url( __FILE__ ) . 'owlcarousel.css', null, $version );
		// Owl Carousel theme CSS
		$physical_file = plugin_dir_path( __FILE__ ) . 'owltheme.default.css';
		$version = file_exists( $physical_file ) ? filemtime( $physical_file ) : $mgl_version;
		wp_enqueue_style( 'mgl-owl-theme-css', plugin_dir_url( __FILE__ ) . 'owltheme.default.css', null, $version );
		// Owl Carousel main JS
		$physical_file = plugin_dir_path( __FILE__ ) . '/js/assets/owlcarousel.min.js';
		$version = file_exists( $physical_file ) ? filemtime( $physical_file ) : $mgl_version;
		wp_enqueue_script( 'mgl-owl-carousel-js', plugins_url( '/js/assets/owlcarousel.min.js', __FILE__ ), array( 'jquery' ), $version, false );
		// ImagesLoaded
		$physical_file = plugin_dir_path( __FILE__ ) . '/js/assets/imagesloaded.min.js';
		$version = file_exists( $physical_file ) ? filemtime( $physical_file ) : $mgl_version;
		wp_enqueue_script( 'imagesloaded-js', plugins_url( '/js/assets/imagesloaded.min.js', __FILE__ ), array( 'jquery' ), $version, false );
		// Custom Pro CSS
		$physical_file = plugin_dir_path( __FILE__ ) . 'style-pro.min.css';
		$version = file_exists( $physical_file ) ? filemtime( $physical_file ) : $mgl_version;
		wp_enqueue_style( 'mgl-carousel-css', plugin_dir_url( __FILE__ ) . 'style-pro.min.css', null, $version );
		// Custom Pro JS
		$physical_file = plugin_dir_path( __FILE__ ) . '/js/carousel.js';
		$version = file_exists( $physical_file ) ? filemtime( $physical_file ) : $mgl_version;
		wp_enqueue_script( 'mgl-carousel-js', plugins_url( '/js/carousel.js', __FILE__ ), array( 'jquery', 'mgl-owl-carousel-js', 'imagesloaded-js' ), $version, false );
	}

	function is_rest() {
		return strpos( $_SERVER[ 'REQUEST_URI' ], 'meow_gallery/preview' ) !== false;
	}

	function gallery_written( $html, $layout ) {
		if ( $layout == 'masonry' || $layout == 'carousel' )
			return $html;
		$xml = simplexml_load_string( $html );
		$subxml = $xml->xpath( '//img' );
		foreach ( $subxml as $s ) {
			$s['mgl-src'] = $s['src'];
			$s['src'] = plugin_dir_url( __FILE__ ) . '../img/1x1.png';
			$s['mgl-srcset'] = $s['srcset'];
			$s['srcset'] = '';
			$s['class'] .= ' mgl-lazy';
		}
		return $xml->asXml();
	}

	function plugin_title( $string ) {
			return $string . " (Pro)";
	}

}
