<?php

class Meow_MGL_Admin extends MeowCommon_Admin {

	public function __construct() {
		parent::__construct( MGL_PREFIX, MGL_ENTRY, MGL_DOMAIN, class_exists( 'MeowPro_MGL_Core' ) );
		add_action( 'admin_menu', array( $this, 'app_menu' ) );
		$blocks_enabled = function_exists( 'register_block_type' );
		if ( $blocks_enabled ) {
			add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
		}
		if ( get_option( 'mgl_captions', 'notset' ) === 'notset' ) {
			$captions_enabled = get_option( 'mgl_captions_enabled' );
			update_option( 'mgl_captions', $captions_enabled ? 'hover-only' : false );
			delete_option( 'mgl_captions_enabled' );
		}
	}

	public function mgl_settings() {
		echo '<div id="mgl-admin-settings"></div>';
	}

	function enqueue_scripts() {

		// Load the "admin" scripts
		$physical_file = MGL_PATH . '/app/admin.js';
		$cache_buster = file_exists( $physical_file ) ? filemtime( $physical_file ) : MGL_VERSION;
		wp_register_script( 'mgl-admin-js', MGL_URL . '/app/admin.js', array( 'wp-editor', 'wp-i18n', 'wp-element' ), $cache_buster );
		register_block_type( 'meow-gallery/gallery', array( 'editor_script' => 'mgl-admin-js' ));

		// Load the fonts
		wp_register_style( 'meow-neko-ui-lato-font', '//fonts.googleapis.com/css2?family=Lato:wght@100;300;400;700;900&display=swap');
		wp_enqueue_style( 'meow-neko-ui-lato-font' );

		// Localize and options
		global $wplr;
		wp_localize_script( 'mgl-admin-js', 'mgl_meow_gallery', array_merge( [
			//'api_nonce' => wp_create_nonce( 'mfrh_media_file_renamer' ),
			'api_url' => get_rest_url( null, '/meow-gallery/v1/' ),
			'rest_url' => get_rest_url(),
			'plugin_url' => MGL_URL,
			'prefix' => MGL_PREFIX,
			'domain' => MGL_DOMAIN,
			'is_pro' => class_exists( 'MeowPro_MGL_Core' ),
			'is_registered' => !!$this->is_registered(),
			'rest_nonce' => wp_create_nonce( 'wp_rest' ),
			'wplr_collections' => $wplr ? $wplr->read_collections_recursively() : [],
		] ) );

		wp_enqueue_script( 'mgl-admin-js' );
	}

	function app_menu() {
		add_submenu_page( 'meowapps-main-menu', __( 'Gallery', MGL_DOMAIN ), __( 'Gallery', MGL_DOMAIN ), 
			'manage_options', 'mgl_settings', array( $this, 'mgl_settings' )
		);
	}
}

?>
