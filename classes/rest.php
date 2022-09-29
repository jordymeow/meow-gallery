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

		// Settings
		register_rest_route( $this->namespace, '/update_option/', array(
			'methods' => 'POST',
			'permission_callback' => array( $this->core, 'can_access_settings' ),
			'callback' => array( $this, 'rest_update_option' )
		) );
		register_rest_route( $this->namespace, '/all_settings/', array(
			'methods' => 'GET',
			'permission_callback' => array( $this->core, 'can_access_settings' ),
			'callback' => array( $this, 'rest_all_settings' )
		) );

		// Gutenberg Block
    register_rest_route( $this->namespace, '/preview', array(
			'methods' => 'POST',
			'permission_callback' => array( $this->core, 'can_access_features' ),
			'callback' => array( $this, 'preview' ),
		) );
  }
  
  function preview( WP_REST_Request $request ) {
		$params = $request->get_body();
		$params = json_decode( $params );
		$params->ids = implode( ',', $params->ids );
		$atts = (array) $params;
		$html = $this->core->gallery( $atts, true );
		return new WP_REST_Response( [ 'success' => true, 'data' => $html ], 200 );
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
		$options = $this->list_options();
		$current_options = array();
		foreach ( $options as $option => $default ) {
			$current_options[$option] = get_option( $option, $default );
		}
		return $current_options;
	}

	// List all the options with their default values.
	function list_options() {
		return array(
			'mgl_layout' => 'tiles',
			'mgl_captions' => 'none',
			'mgl_animation' => false,
			'mgl_image_size' => 'srcset',
			'mgl_infinite' => false,
			'mgl_infinite_buffer' => 0,
			'mgl_tiles_gutter' => 5,
			'mgl_tiles_gutter_tablet' => 5,
			'mgl_tiles_gutter_mobile' => 5,
			'mgl_tiles_density' => 'high',
			'mgl_tiles_density_tablet' => 'medium',
			'mgl_tiles_density_mobile' => 'low',
			'mgl_masonry_gutter' => 5,
			'mgl_masonry_columns' => 3,
			'mgl_justified_gutter' => 5,
			'mgl_justified_row_height' => 200,
			'mgl_square_gutter' => 5,
			'mgl_square_columns' => 5,
			'mgl_cascade_gutter' => 5,
			'mgl_horizontal_gutter' => 5,
			'mgl_horizontal_image_height' => 500,
			'mgl_horizontal_hide_scrollbar' => false,
			'mgl_carousel_gutter' => 5,
			'mgl_carousel_image_height' => 500,
			'mgl_carousel_arrow_nav_enabled' => true,
			'mgl_carousel_dot_nav_enabled' => true,
			'mgl_map_engine' => '',
			'mgl_map_height' => 400,
			'mgl_googlemaps_token' => '',
			'mgl_googlemaps_style' => $this->create_default_googlemaps_style(),
			'mgl_mapbox_token' => '',
			'mgl_mapbox_style' => $this->create_default_mapbox_style(),
			'mgl_maptiler_token' => '',
			'mgl_right_click' => false
		);
	}

	function rest_update_option( $request ) {
		$params = $request->get_json_params();
		try {
			$name = $params['name'];
			$options = $this->list_options();
			if ( !array_key_exists( $name, $options ) ) {
				return new WP_REST_Response([ 'success' => false, 'message' => 'This option does not exist.' ], 200 );
			}
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