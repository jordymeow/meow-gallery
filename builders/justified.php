<?php

require_once dirname( __FILE__ ) . '/builder.php';

class Meow_Justified_Generator extends Meow_Gallery_Generator {

	public function __construct( $atts, $infinite ) {
		parent::__construct( $atts, $infinite );
		$this->layout = 'justified';
	}

	function inline_css() {
		$class_id = '#' . $this->class_id;
		$gutter = isset( $this->atts['gutter'] ) ? 
			$this->atts['gutter'] : get_option( 'mgl_justified_gutter', 10 );
		$row_height = isset( $this->atts['row_height'] ) ? 
			$this->atts['row_height'] : get_option( 'mgl_justified_row_height', 300 );
		ob_start();
		include dirname( __FILE__ ) . '/justified.css.php';
		$html = ob_get_clean();
		return $html;
	}

	function build_next_cell( $id, $data ) { 
		$html = parent::build_next_cell( $id, $data );
		$html = str_replace( '100vw', 100 / 2 . 'vw', $html );
		return $html;
	}

}

?>
