<?php

require_once dirname( __FILE__ ) . '/../../builders/builder.php';

class Meow_Slider_Generator extends Meow_Gallery_Generator {

	public function __construct( $atts, $infinite, $isPreview = false ) {
		parent::__construct( $atts, false, $isPreview );
		$this->layout = 'slider';
	}

	function inline_css() {
		$class_id = '#' . $this->class_id;
		$gutter = isset( $this->atts['gutter'] ) ? $this->atts['gutter'] : get_option( 'mgl_slider_gutter', 10 );
		$image_height = isset( $this->atts['image_height'] ) ?
			$this->atts['image_height'] : get_option( 'mgl_slider_image_height', 500 );
		$nav_enabled = isset( $this->atts['nav_enabled'] ) ?
			$this->atts['nav_enabled'] : get_option( 'mgl_slider_nav_enabled', true );
		$nav_height = isset( $this->atts['nav_height'] ) ?
			$this->atts['nav_height'] : get_option( 'mgl_slider_nav_height', 80 );
		$isPreview = $this->isPreview;
		ob_start();
		include dirname( __FILE__ ) . '/slider.css.php';
		$html = ob_get_clean();
		return $html;
	}

	function build( $idsStr ) {
		$classAlign = $this->align === 'wide' ? (' align' . $this->align) : '';
		$out = '<div id="' . $this->class_id . '"  class="mgl-gallery' . $classAlign . ' mgl-' . $this->layout . '">';
		$this->prepare_data( $idsStr );
		$out .= '<div class="mgl-slider-preview"><div class="mgl-slider-preview-image"></div><div class="nav-prev"><span class="chevron left"></span></div><div class="nav-next"><span class="chevron right"></span></div></div>';
		$out .= '<div class="mgl-slider-navigation">';
		while ( count( $this->ids ) > 0 ) {
			$id = array_pop( $this->ids );
			$out .= $this->build_next_cell( $id, $this->data[$id] );
		}
		$out .= '</div>';
		$out .= '</div>';
		$out = apply_filters( 'mgl_gallery_written', $out, $this->layout );
		return $this->inline_css() . $out;
	}

}

?>
