<?php

abstract class Meow_Gallery_Generator {

	public $id = null;
	public $layout = 'none';
	public $class_id = 'mgl-gallery-none';
	public $size = 'large';
	public $ids = [];
	public $atts = [];
	public $data = [];
	public $updir = null;
	public $captions_enabled = null;

	abstract function inline_css();

	public function __construct( $atts, $infinite ) {
		$wpUploadDir = wp_upload_dir();
		$this->id = uniqid();
		$this->size = isset( $atts['size'] ) ? $atts['size'] : $this->size;
		$this->infinite = $infinite;
		$this->atts = $atts;
		$this->class_id = 'mgl-gallery-' . $this->id;
		$this->updir = trailingslashit( $wpUploadDir['baseurl'] );
		$this->captions_enabled = get_option( 'mgl_captions_enabled', false );
	}

	function prepare_data( $idsStr ) {
		global $wpdb;
		$res = $wpdb->get_results( "SELECT p.ID id, p.post_excerpt caption, m.meta_value meta
			FROM $wpdb->posts p, $wpdb->postmeta m
			WHERE m.meta_key = '_wp_attachment_metadata'
			AND p.ID = m.post_id
			AND p.ID IN ($idsStr)" );
		$this->ids = explode( ',', $idsStr );
		foreach ( $res as $r ) {
			$this->data[$r->id] = array( 'caption' => $r->caption ,'meta' => unserialize( $r->meta ) );
		}
		$this->ids = array_reverse( $this->ids );
		$cleanIds = [];
		foreach ( $this->ids as $id ) {
			if ( isset( $this->data[$id] ) )
				array_push( $cleanIds, $id );
		}
		$this->ids = $cleanIds;
	}

	function build_next_cell( $id, $data ) {
		$src = $this->updir . $data['meta']['file'];
		$caption = $this->captions_enabled ? $data['caption'] : '';
		$imgSrc = wp_get_attachment_image( $id, $this->size );
		//$imgSrc = wp_image_add_srcset_and_sizes( $imgSrc, $data['meta'], $id );
		ob_start();
		include dirname( __FILE__ ) . '/cell.tpl.php';
		$html = ob_get_clean();
		return $html;
	}

	function build( $idsStr ) {
		$out = '<div id="' . $this->class_id . '"  class="mgl-gallery mgl-' . $this->layout . '">';
		$this->prepare_data( $idsStr );
		//add_filter( 'wp_calculate_image_srcset_meta', '__return_null' );
		while ( count( $this->ids ) > 0 ) {
			$id = array_pop( $this->ids );
			$out .= $this->build_next_cell( $id, $this->data[$id] );
		}
		// remove_filter( 'wp_calculate_image_srcset_meta', '__return_null' );
		$out .= '</div>';
		$out = apply_filters( 'mgl_gallery_written', $out, $this->layout );
		return $this->inline_css() . $out;
	}

}

?>
