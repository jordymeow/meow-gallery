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

		include_once( 'mgl_exif.php' );

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

		// Carousel related
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
		// Carousel Pro JS
		$physical_file = plugin_dir_path( __FILE__ ) . '/js/carousel.js';
		$version = file_exists( $physical_file ) ? filemtime( $physical_file ) : $mgl_version;
		wp_enqueue_script( 'mgl-carousel-js', plugins_url( '/js/carousel.js', __FILE__ ), array( 'jquery', 'mgl-owl-carousel-js', 'imagesloaded-js' ), $version, false );

		// Map related
		require_once dirname( __FILE__ ) . '/builders/map.php';
		// Leaflet CSS
		$physical_file = plugin_dir_path( __FILE__ ) . 'css/leaflet.css';
		$version = file_exists( $physical_file ) ? filemtime( $physical_file ) : $mgl_version;
		wp_enqueue_style( 'leaflet-css', plugin_dir_url( __FILE__ ) . 'css/leaflet.css', null, $version );
		// Leaflet JS
		$physical_file = plugin_dir_path( __FILE__ ) . '/js/assets/leaflet.js';
		$version = file_exists( $physical_file ) ? filemtime( $physical_file ) : $mgl_version;
		wp_enqueue_script( 'leaflet-js', plugins_url( '/js/assets/leaflet.js', __FILE__ ), array( ), $version, false );
		// Leaflet.GoogleMutant.js
		$physical_file = plugin_dir_path( __FILE__ ) . '/js/assets/Leaflet.GoogleMutant.js';
		$version = file_exists( $physical_file ) ? filemtime( $physical_file ) : $mgl_version;
		wp_enqueue_script( 'leaflet-googlemutant-js', plugins_url( '/js/assets/Leaflet.GoogleMutant.js', __FILE__ ), array( ), $version, false );
		// Map JS
		$physical_file = plugin_dir_path( __FILE__ ) . '/js/mgl-map.js';
		$version = file_exists( $physical_file ) ? filemtime( $physical_file ) : $mgl_version;
		wp_enqueue_script( 'mgl-map-js', plugins_url( '/js/mgl-map.js', __FILE__ ), array( 'jquery', 'leaflet-js', 'leaflet-googlemutant-js' ), $version, false );
		wp_localize_script('mgl-map-js', 'mgl_map',
			array(
				'default_engine' => get_option( 'mgl_map_engine', "" ),
				'height' => get_option( 'mgl_map_height', 400 ),
				'googlemaps' => array(
					'api_key' => get_option( 'mgl_googlemaps_token', '' ),
					'style' => json_decode( get_option( 'mgl_googlemaps_style', '' ) )
				),
				'mapbox' => array(
					'api_key' => get_option( 'mgl_mapbox_token', '' ),
					'style' => json_decode( get_option( 'mgl_mapbox_style', '' ) )
				),
				'maptiler' => array(
					'api_key' => get_option( 'mgl_maptiler_token', '' ),
					'style' => json_decode( get_option( 'mgl_maptiler_style', '' ) )
				)
			)
		);
	}

	function is_rest() {
		return strpos( $_SERVER[ 'REQUEST_URI' ], 'meow_gallery/preview' ) !== false;
	}

	function gallery_written( $html, $layout ) {
		if ( $layout == 'masonry' || $layout == 'carousel' )
			return $html;
		$xml = simplexml_load_string( $html );
		if ( empty( $xml ) )
			return $html;
		$subxml = $xml->xpath( '//img' );
		foreach ( $subxml as $s ) {
			$s['mgl-src'] = $s['src'];
			$s['src'] = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
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
