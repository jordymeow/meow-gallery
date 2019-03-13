<?php

require_once dirname( __FILE__ ) . '/../../builders/builder.php';

class Meow_Carousel_Generator extends Meow_Gallery_Generator {

	public function __construct( $atts, $infinite, $isPreview = false ) {
		parent::__construct( $atts, false, $isPreview );
		$this->layout = 'carousel';
	}

	function inline_css() {
		$class_id = '#' . $this->class_id;
		$gutter = isset( $this->atts['gutter'] ) ? $this->atts['gutter'] : get_option( 'mgl_carousel_gutter', 10 );
		$image_height = isset( $this->atts['image_height'] ) ? $this->atts['image_height'] : get_option( 'mgl_carousel_image_height', 500 );
		$isPreview = $this->isPreview;
		ob_start();
		include dirname( __FILE__ ) . '/carousel.css.php';
		$html = ob_get_clean();
		return $html;
	}

	function build( $idsStr ) {
		$classAlign = $this->align === 'wide' ? (' align' . $this->align) : '';
		$gutter = isset( $this->atts['mgl_carousel_gutter'] ) ?
			$this->atts['mgl_carousel_gutter'] : get_option( 'mgl_carousel_gutter', 5 );
		$arrow_nav_enabled = isset( $this->atts['arrow_nav_enabled'] ) ?
			$this->atts['arrow_nav_enabled'] : get_option( 'mgl_carousel_arrow_nav_enabled', true );
		$dot_nav_enabled = isset( $this->atts['dot_nav_enabled'] ) ?
			$this->atts['dot_nav_enabled'] : get_option( 'mgl_carousel_dot_nav_enabled', true );
		$attributes = "data-mgl-gutter=\"${gutter}\" data-mgl-arrow_nav=\"${arrow_nav_enabled}\" data-mgl-dot_nav=\"${dot_nav_enabled}\"";
		$out = '<div id="' . $this->class_id . '"  class="mgl-gallery' . $classAlign . ' mgl-' . $this->layout
			. ' mgl-owl-carousel mgl-owl-theme" ' . $attributes . '>';
		$this->prepare_data( $idsStr );
		while ( count( $this->ids ) > 0 ) {
			$id = array_pop( $this->ids );
			$out .= $this->build_next_cell( $id, $this->data[$id] );
		}
		$out .= '</div>';
		$out = apply_filters( 'mgl_gallery_written', $out, $this->layout );
		return '<div class="mgl-carousel-container">' . $this->inline_css() . $out . '</div>';
	}

}

?>
