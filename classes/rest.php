<?php

class Meow_MGL_Rest
{
  private $core;
	private $namespace = 'meow-gallery/v1';

	public function __construct( $core ) {
    $this->core = $core;

		// FOR DEBUG
		// For experiencing the UI behavior on a slower install.
		// sleep(1);
		// For experiencing the UI behavior on a buggy install.
		// trigger_error( "Error", E_USER_ERROR);
		// trigger_error( "Warning", E_USER_WARNING);
		// trigger_error( "Notice", E_USER_NOTICE);
		// trigger_error( "Deprecated", E_USER_DEPRECATED);

		add_action( 'rest_api_init', array( $this, 'rest_api_init' ) );
	}

	function rest_api_init() {
		if ( !current_user_can( 'upload_files' ) ) {
			return;
		} 

		// SETTINGS
		register_rest_route( $this->namespace, '/update_option/', array(
			'methods' => 'POST',
			'permission_callback' => '__return_true',
			'callback' => array( $this, 'rest_update_option' )
		) );
		register_rest_route( $this->namespace, '/all_settings/', array(
			'methods' => 'GET',
			'permission_callback' => '__return_true',
			'callback' => array( $this, 'rest_all_settings' )
		) );

		// BLOCK
    register_rest_route( $this->namespace, '/preview', array(
			'methods' => 'POST',
			'permission_callback' => '__return_true',
			'callback' => array( $this, 'preview' ),
		) );
  }
  
  function preview( WP_REST_Request $request ) {
		$params = $request->get_body();
		$params = json_decode( $params );
		$params->ids = implode( ',', $params->ids );
		$atts = (array) $params;
		return $this->core->gallery( $atts, true );
	}

	function rest_all_settings() {
		return new WP_REST_Response( [ 'success' => true, 'data' => $this->get_all_options() ], 200 );
	}

	function create_default_googlemaps_style( $force = false ) {
		$style = get_option( 'mgl_googlemaps_style', "" );
		if ( $force || empty( $style ) ) {
			$style = '[]';
			update_option( 'mgl_googlemaps_style', $style );
		}
		return $style;
	}

	function create_default_mapbox_style( $force = false ) {
		$style = get_option( 'mgl_mapbox_style', "" );
		if ( $force || empty( $style ) ) {
			$style = '{"username":"", "style_id":""}';
			update_option( 'mgl_mapbox_style', $style );
		}
		return $style;
	}

	function get_all_options() {
		return array(
			'mgl_layout' => get_option( 'mgl_layout', 'tiles' ),
			'mgl_captions' => get_option( 'mgl_captions', 'none' ),
			'mgl_animation' => get_option( 'mgl_animation', false ),
			'mgl_image_size' => get_option( 'mgl_image_size', 'srcset' ),
			'mgl_infinite' => get_option( 'mgl_infinite', false ),
			'mgl_tiles_gutter' => get_option( 'mgl_tiles_gutter', 5 ),
			'mgl_tiles_gutter_tablet' => get_option( 'mgl_tiles_gutter_tablet', 5 ),
			'mgl_tiles_gutter_mobile' => get_option( 'mgl_tiles_gutter_mobile', 5 ),
			'mgl_tiles_density' => get_option( 'mgl_tiles_density', 'high' ),
			'mgl_tiles_density_tablet' => get_option( 'mgl_tiles_density_tablet', 'medium' ),
			'mgl_tiles_density_mobile' => get_option( 'mgl_tiles_density_mobile', 'low' ),
			'mgl_masonry_gutter' => get_option( 'mgl_masonry_gutter', 5 ),
			'mgl_masonry_columns' => get_option( 'mgl_masonry_columns', 3 ),
			'mgl_justified_gutter' => get_option( 'mgl_justified_gutter', 5 ),
			'mgl_justified_row_height' => get_option( 'mgl_justified_row_height', 200 ),
			'mgl_square_gutter' => get_option( 'mgl_square_gutter', 5 ),
			'mgl_square_columns' => get_option( 'mgl_square_columns', 5 ),
			'mgl_cascade_gutter' => get_option( 'mgl_cascade_gutter', 5 ),
			'mgl_carousel_gutter' => get_option( 'mgl_carousel_gutter', 5 ),
			'mgl_carousel_image_height' => get_option( 'mgl_carousel_image_height', 500 ),
			'mgl_carousel_arrow_nav_enabled' => get_option( 'mgl_carousel_arrow_nav_enabled', true ),
			'mgl_carousel_dot_nav_enabled' => get_option( 'mgl_carousel_dot_nav_enabled', true ),
			'mgl_map_engine' => get_option( 'mgl_map_engine', '' ),
			'mgl_map_height' => get_option( 'mgl_map_height', 400 ),
			'mgl_googlemaps_token' => get_option( 'mgl_googlemaps_token', '' ),
			'mgl_googlemaps_style' => get_option( 'mgl_googlemaps_style', $this->create_default_googlemaps_style() ),
			'mgl_mapbox_token' => get_option( 'mgl_mapbox_token', '' ),
			'mgl_mapbox_style' => get_option( 'mgl_mapbox_style', $this->create_default_mapbox_style() ),
			'mgl_maptiler_token' => get_option( 'mgl_maptiler_token', '' ),
			'mgl_right_click' => get_option( 'mgl_right_click', false )
		);
	}

	function rest_update_option( $request ) {
		$params = $request->get_json_params();
		try {
			$name = $params['name'];
			$value = is_bool( $params['value'] ) ? ( $params['value'] ? '1' : '' ) : $params['value'];
			$success = update_option( $name, $value );
			if ( !$success ) {
				return new WP_REST_Response([ 'success' => false, 'message' => 'Could not update option.' ], 200 );
			}
			return new WP_REST_Response([ 'success' => true, 'data' => $value ], 200 );
		} 
		catch (Exception $e) {
			return new WP_REST_Response([ 'success' => false, 'message' => $e->getMessage() ], 500 );
		}
	}

}

?>