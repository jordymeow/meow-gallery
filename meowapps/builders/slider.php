<?php

require_once dirname( __FILE__ ) . '/../../builders/builder.php';

class Meow_Slider_Generator extends Meow_Gallery_Generator {

	public function __construct( $atts ) {
		parent::__construct( $atts );
		$this->layout = 'slider';
	}

	function inline_css() {
		$class_id = '#' . $this->class_id;
		$image_height = isset( $this->atts['image_height'] ) ? 
			$this->atts['image_height'] : get_option( 'mgl_slider_image_height', 500 );
		$nav_enabled = isset( $this->atts['nav_enabled'] ) ? 
			$this->atts['nav_enabled'] : get_option( 'mgl_slider_nav_enabled', true );
		$nav_height = isset( $this->atts['nav_height'] ) ? 
			$this->atts['nav_height'] : get_option( 'mgl_slider_nav_height', 80 );
		ob_start();
		include dirname( __FILE__ ) . '/slider.css.php';
		$html = ob_get_clean();
		return $html;
	}

}

?>
