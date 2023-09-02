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

		// Gallery
		register_rest_route( $this->namespace, '/images/', array(
			'methods' => 'GET',
			'permission_callback' => '__return_true',
			'callback' => array( $this, 'rest_images' ),
			'args' => array(
				'imageIds' => array( 'required' => true ),
				'atts' => array( 'required' => true ),
				'layout' => array( 'required' => true ),
				'size' => array( 'required' => true ),
			)
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
		return new WP_REST_Response( [ 'success' => true, 'data' => $this->core->get_all_options() ], 200 );
	}

	function rest_update_option( $request ) {
		try {
			$params = $request->get_json_params();
			$value = $params['options'];
			$options = $this->core->update_options( $value );
			$success = !!$options;
			$message = __( $success ? 'OK' : "Could not update options.", MGL_DOMAIN );
			return new WP_REST_Response([ 'success' => $success, 'message' => $message, 'options' => $success ? $options : null ], 200 );
		}
		catch ( Exception $e ) {
			return new WP_REST_Response([ 'success' => false, 'message' => $e->getMessage() ], 500 );
		}
	}

	function rest_images( $request ) {
		$image_ids = trim( $request->get_param('imageIds') );
		$atts = trim( $request->get_param('atts') );
		$layout = trim( $request->get_param('layout') );
		$size = trim( $request->get_param('size') );

		return new WP_REST_Response( [
			'success' => true,
			'data' => $this->core->get_gallery_images( json_decode( $image_ids, true ), json_decode($atts, true), $layout, $size )
		], 200 );
	}

}

?>