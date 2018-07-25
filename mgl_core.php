<?php

class Meow_Gallery_Core {

	public $admin = null;

	public function __construct( $admin ) {
		$this->admin = $admin;
		add_action( 'init', array( $this, 'init' ) );
	}

	function init() {
		load_plugin_textdomain( 'meow-gallery', false, dirname( plugin_basename( __FILE__ ) ) . '/languages/' );
		include( 'mgl_run.php' );
		include( 'mgl_blocks.php' );
		new Meow_Gallery_Run( $this->admin );
		new Meow_Gallery_Blocks( $this->admin );
	}

	static function installed() {
		return true;
	}

}

?>
