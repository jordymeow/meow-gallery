<?php

require_once dirname( __FILE__ ) . '/builder.php';

class Meow_Tiles_Generator extends Meow_Gallery_Generator {

	public $min_columns = 3;
	public $max_columns = 4;
	public $layouts = [];
	public $layout = [];

	public function __construct( $atts, $infinite ) {
		parent::__construct( $atts, $infinite );
	}

	function prepare_layouts() {
		$this->layouts = [
			'o', 'i',
			'oo', 'ii', 'oi', 'io',
			'ooo', 'oii', 'ooi', 'ioo', 'oio', 'ioi', 'iio', 'iii',
			'iooo', 'oioo', 'ooio', 'oooi', 'iiii'
		];
	}

	function inline_css() {
		$class_id = '#' . $this->class_id;
		$gutter = isset( $this->atts['gutter'] ) ? 
			$this->atts['gutter'] : get_option( 'mgl_tiles_gutter', 10 );
		$row_height = isset( $this->atts['row_height'] ) ? 
			$this->atts['row_height'] : get_option( 'mgl_tiles_row_height', 300 );
		ob_start();
		include dirname( __FILE__ ) . '/tiles.css.php';
		$html = ob_get_clean();
		return $html;
	}

	function permutations( $items, $perms = array() ) {
		$back = array();
		if ( empty( $items ) ) {
			$back[] = join( ' ', $perms ); 
			return $back;
		}
		for ( $i = count( $items ) - 1; $i >= 0; --$i ) {
			$new = $items;
			$newp = $perms;
			list( $foo ) = array_splice( $new, $i, 1 );
			array_unshift( $newp, $foo );
			$back = array_merge( $back, permutations( $new, $newp ) );
		}
		return $back;
	}

	function get_layout( $ids ) {
		$ids = array_reverse( $ids );
		$layout = "";
		foreach ( $ids as $id )
			$layout .= $this->data[$id]['meta']['width'] >= $this->data[$id]['meta']['height'] ? 'o' : 'i';
		return $layout;
	}

	function build_next_cell( $id, $data ) { 
		$html = parent::build_next_cell( $id, $data );
		$html = str_replace( '100vw', 100 / 3 . 'vw', $html );
		return $html;
	}

	function build( $idsStr ) {
		$out = '<div id="' . $this->class_id . '"  class="mgl-gallery mgl-tiles">';
		$this->prepare_data( $idsStr );
		$this->prepare_layouts();

		while ( count( $this->ids ) > 0 ) {

			// Take the 3 latest photos
			$currentIds = array_slice( $this->ids, -3, 3, true );

			// Look for exact layout 3-cols
			$ideal = $layout = $this->get_layout( $currentIds );
			if ( !in_array( $layout, $this->layouts ) ) {
				// Look for exact layout 4-cols
				$layout = $layout;
				$currentIds = array_slice( $this->ids, -4, 4, true );
				$layout = $this->get_layout( $currentIds );
				if ( !in_array( $layout, $this->layouts ) )
					$layout = null;
			}

			if ( !$layout ) {
				echo( '<div style="padding: 20px; background: darkred; color: white;">
					MEOW GALLERY ERROR. No layout for '. $ideal . '.</div>' 
				);
				$layout = $ideal;
			}

			// Create row with cells inside it (using the order in currentIds)
			$count = 0;
			$out .= '<div class="mgl-row mgl-layout-' . strlen( $layout ) . '-' . $layout . '">';
			while ( count( $currentIds ) > 0 ) {
				$out .= '<div class="mgl-box ' . chr( 97 + $count++ ) . '">';
				$id = array_pop( $this->ids );
				$id = array_pop( $currentIds );
				$out .= $this->build_next_cell( $id, $this->data[$id] );
				$out .= '</div>';
			}
			$out .= '</div>';
		}
		$out .= '</div>';
		$out = apply_filters( 'mgl_gallery_written', $out, $this->layout );
		return $this->inline_css() . $out;
	}

}

?>
