<?php

require_once dirname( __FILE__ ) . '/builder.php';

class Meow_Square_Generator extends Meow_Gallery_Generator {

	public function __construct( $atts, $infinite, $isPreview = false ) {
		parent::__construct( $atts, $infinite, $isPreview );
		$this->layout = 'square';
	}

	function inline_css() {
		$class_id = '#' . $this->class_id;
		$gutter = isset( $this->atts['gutter'] ) ? $this->atts['gutter'] : get_option( 'mgl_square_gutter', 10 );
		$columns = isset( $this->atts['columns'] ) ? $this->atts['columns'] : get_option( 'mgl_square_columns', 5 );
		$isPreview = $this->isPreview;
		ob_start();
		include dirname( __FILE__ ) . '/square.css.php';
		$html = ob_get_clean();
		return $html;
	}

	function build_next_cell( $id, $data ) {
		$html = parent::build_next_cell( $id, $data );
		$columns = ( isset( $this->atts['columns'] ) ? $this->atts['columns'] : get_option( 'mgl_square_columns', 5 ) ) + 1;
		$html = str_replace( '100vw', 100 / $columns . 'vw', $html );
		return $html;
	}

}

?>
