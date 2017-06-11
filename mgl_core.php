<?php

class Meow_Gallery_Core {

	public $admin = null;

	public function __construct( $admin ) {
		$this->admin = $admin;
		add_action( 'init', array( $this, 'init' ) );
	}

	/*
		INIT
	*/

	function init() {
		include( 'mgl_run.php' );
    new Meow_Gallery_Run( $this->admin );
	}

}

?>
