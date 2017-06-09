<?php

class Meow_Gallery_Core {

	public function __construct() {
		add_action( 'init', array( $this, 'init' ) );
	}

	/*
		INIT
	*/

	function init() {
		include( 'mgl_run.php' );
    new Meow_Gallery_Run;
	}

}

?>
