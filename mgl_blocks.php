<?php

class Meow_Gallery_Blocks {

	public $core;

	public function __construct( $core ) {
		if ( function_exists( 'register_block_type' ) ) {
			$this->core = $core;
			$this->backend_editor();
		}
	}

	function backend_editor() {
		$physical_file = plugin_dir_path( __FILE__ ) . 'blocks/dist/index.js';
		$version = file_exists( $physical_file ) ? filemtime( $physical_file ) : $mgl_version;
		wp_register_script(
			'mgl-gallery-js', plugin_dir_url( __FILE__ ) . 'blocks/dist/index.js',
			array( 'wp-editor', 'wp-i18n', 'wp-element' ), $version
		);
		register_block_type( 'meow-gallery/gallery', array(
			'editor_script' => 'mgl-gallery-js'
		));
		wp_add_inline_script(
			'mgl-gallery-js',
			'wp.i18n.setLocaleData( ' . json_encode( gutenberg_get_jed_locale_data( 'meow-gallery' ) ) . ', "meow-gallery" );',
			'before'
		);

		// Params
		// $hierarchy = $this->core->get_hierarchy();
		// $folders = $this->core->hierarchy_to_folders( $hierarchy );
		// wp_localize_script( 'mwt-folders-js', 'mwt_block_params', array(
		// 	'logo' => trailingslashit( plugin_dir_url( __FILE__ ) ) . '../img/meowapps.png',
		// 	'folders' => $folders
		// ) );
	}

}

?>