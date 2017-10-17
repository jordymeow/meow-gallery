<?php

class Meow_Gallery_Run {

	public $admin = null;

	public function __construct( $admin ) {
		$this->admin = $admin;
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
		add_filter( 'shortcode_atts_gallery', array( $this, 'shortcode_atts_gallery' ), 10, 3 );
		add_filter( 'gallery_style', array( $this, 'gallery_style' ), 10, 1 );
		add_filter( 'wp_get_attachment_image_attributes', array( $this, 'wp_get_attachment_image_attributes' ), 10, 1 );
		add_filter( 'use_default_gallery_style', '__return_false' );
		add_shortcode( 'gallery', array( $this, 'gallery' ) );

		// For now:
		add_theme_support( 'html5', array( 'gallery', 'caption' ) );
	}

	function enqueue_scripts() {
		global $mgl_version;
    wp_register_script( 'imagesLoaded', plugins_url( '/js/imagesloaded.min.js', __FILE__ ),
			array( 'jquery' ), $mgl_version, false );
		wp_register_script( 'justifiedGallery', plugins_url( '/js/jquery.justifiedGallery.min.js', __FILE__ ),
			array('jquery'), $mgl_version, false );
    wp_register_script( 'masonry', plugins_url( '/js/masonry.min.js', __FILE__ ),
			array('jquery'), $mgl_version, false );
		wp_register_script( 'mgl-masonry', plugins_url( '/js/mgl-masonry.js', __FILE__ ),
			array('jquery', 'masonry'), $mgl_version, false );
		wp_register_script( 'mgl-justified', plugins_url( '/js/mgl-justified.js', __FILE__ ),
			array('jquery', 'justifiedGallery', 'imagesLoaded' ), $mgl_version, false );
		wp_register_script( 'mgl-instagram', plugins_url( '/js/mgl-instagram.js', __FILE__ ),
			array('jquery', 'imagesLoaded' ), $mgl_version, false );
		wp_enqueue_script( 'mgl-js', plugins_url( '/js/mgl.js', __FILE__ ),
				array( 'jquery', 'mgl-masonry', 'mgl-justified', 'mgl-instagram' ), $mgl_version, false );

		wp_localize_script('mgl-js', 'mgl', array(
			//'url_api' => get_site_url() . '/wp-json/mgl/v1/',
			'settings' => array(
				'layout' => get_option( 'mgl_layout', 'masonry' ),
				'infinite_loading' => array(
					'enabled' => get_option( 'mgl_infinite', false ) && $this->admin->is_registered(),
					'animated' => get_option( 'mgl_infinite_animation', true ),
					'batch_size' => get_option( 'mgl_infinite_batch_size', 20 ),
					'loader' => array(
						'enabled' => get_option( 'mgl_infinite_loader', true ),
						'color' => get_option( 'mgl_infinite_loader_color', '#444444' )
					)
				),
				'masonry' => array(
					'columns' => get_option( 'mgl_masonry_columns', 3 ),
					'display_captions' => get_option( 'mgl_masonry_display_captions', false ),
					'gutter' => get_option( 'mgl_masonry_gutter', 10 )
				),
				'justified' => array(
					'gutter' => get_option( 'mgl_justified_gutter', 10 ),
					'row_height' => get_option( 'mgl_justified_row_height', 120 )
				),
				'instagram' => array(
					'gutter' => get_option( 'mgl_instagram_gutter', 10 )
				),
				'horizontal_slider' => array(
					'slider_height' => 400, // in px
					'slider_width' => 100, // in %
					'gutter' => 10, // in px
				)
			)
		) );
    wp_enqueue_style( 'mgl-css', plugin_dir_url( __FILE__ ) . 'css/mgl.css',
			null, $mgl_version );
		wp_enqueue_style( 'justifiedGallery-css', plugin_dir_url( __FILE__ ) . 'css/justifiedGallery.min.css',
			null, $mgl_version );
	}

	// Overrides the WP Gallery
	// With a new class and style

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

	function gallery_style( $div ) {
		try {
			$dom = new DOMDocument();
			if ( PHP_VERSION_ID > 50400 )
				$dom->loadHTML( $div, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD );
			else
			 	$dom->loadHTML( $div, LIBXML_HTML_NODEFDTD );
			$divs = $dom->getElementsByTagName('div');
			if ( !empty( $divs ) ) {
				$divs = iterator_to_array( $divs ) ;
				$class = $divs[0]->getAttribute( 'class' );
				$divs[0]->setAttribute( 'class', 'meow-gallery ' . $class );
				$divs[0]->setAttribute( 'style', 'display: none;' );
				if ( !empty( $this->atts['layout'] ) ) {
					$layout = $this->atts['layout'];
					$divs[0]->setAttribute( 'data-mgl-layout', $layout );
				}
				if ( !empty( $this->atts['infinite-loading'] ) ) {
					$infinite = $this->atts['infinite-loading'];
					$divs[0]->setAttribute( 'data-mgl-infinite-loading', $infinite );
				}
				$div = $dom->saveHtml();
				$div = str_replace( '</div>', '', $div );
				return $div;
			}
		}
		catch ( Exception $e ) {
			error_log( "Meow Gallery caught an exception: " . $e->getMessage() );
		}
		return $div;
	}

	function wp_get_attachment_image_attributes( $attr ) {
		if ( $this->gallery_process ) {
			if ( isset( $attr['sizes'] ) ) {
				$attr['data-mgl-sizes'] = $attr['sizes'];
				unset( $attr['sizes'] );
			}
			if ( isset( $attr['src'] ) ) {
			  $attr['data-mgl-src'] = $attr['src'];
				$attr['src'] = '//:0';
			}
			if ( isset( $attr['srcset'] ) ) {
				$attr['data-mgl-srcset'] = $attr['srcset'];
				unset( $attr['srcset'] );
			}
		}
		return $attr;
	}

	function gallery( $atts ) {
		$this->gallery_process = true;
		$result = gallery_shortcode( $atts );
		$this->gallery_process = false;
		return $result;
	}

}

?>
