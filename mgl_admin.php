<?php

include "common/admin.php";

class Meow_MGL_Admin extends MeowApps_Admin {

	public function __construct( $prefix, $mainfile, $domain ) {
		parent::__construct( $prefix, $mainfile, $domain );
		if ( is_admin() ) {
			add_action( 'admin_menu', array( $this, 'app_menu' ) );
			add_action( 'admin_notices', array( $this, 'admin_notices' ) );
		}
	}

	function admin_notices() {
	}


	function common_url( $file ) {
		return trailingslashit( plugin_dir_url( __FILE__ ) ) . 'common/' . $file;
	}

	function app_menu() {

		// SUBMENU > Settings
		add_submenu_page( 'meowapps-main-menu', 'Gallery', 'Gallery', 'manage_options',
			'mgl_settings-menu', array( $this, 'admin_settings' ) );

		// SUBMENU > Settings > Settings
		add_settings_section( 'mgl_settings', null, null, 'mgl_settings-menu' );
		add_settings_field( 'mgl_layout', __( "Default Layout", 'meow-gallery' ),
			array( $this, 'admin_layout_callback' ),
			'mgl_settings-menu', 'mgl_settings' );
		register_setting( 'mgl_settings', 'mgl_layout' );

		add_settings_field( 'mgl_captions_enabled', __( "Captions", 'meow-gallery' ),
			array( $this, 'admin_display_captions_callback' ),
			'mgl_settings-menu', 'mgl_settings' );
		register_setting( 'mgl_settings', 'mgl_captions_enabled' );

		add_settings_field( 'mgl_infinite', __ ( "Infinite & Lazy", 'meow-gallery' ),
			array( $this, 'admin_infinite_callback' ),
			'mgl_settings-menu', 'mgl_settings' );
		register_setting( 'mgl_settings', 'mgl_infinite' );

		$color = get_option( 'mgl_infinite_loader_color', '#444' );
		if ( empty( $color ) )
			update_option( 'mgl_infinite_loader_color', '#444' );
		$batch = get_option( 'mgl_infinite_batch_size', 20 );
		if ( empty( $batch ) )
			update_option( 'mgl_infinite_batch_size', 20 );
		$batch = get_option( 'mgl_infinite_batch_size', 20 );

		$layout = get_option( 'mgl_layout', 'tiles' );
		$infinite = get_option( 'mgl_infinite', false ) && $this->is_registered();

		if ( $infinite ) {
			add_settings_section( 'mgl_infinite', null, null, 'mgl_settings_infinite-menu' );
			add_settings_field( 'mgl_infinite_batch_size', __( "Batch Size", 'meow-gallery' ),
				array( $this, 'admin_infinite_batch_size_callback' ),
				'mgl_settings_infinite-menu', 'mgl_infinite' );
			add_settings_field( 'mgl_infinite_animation', __( "Animation", 'meow-gallery' ),
				array( $this, 'admin_infinite_animation_callback' ),
				'mgl_settings_infinite-menu', 'mgl_infinite' );
			add_settings_field( 'mgl_infinite_loader', __( "Loader", 'meow-gallery' ),
				array( $this, 'admin_infinite_loader_callback' ),
				'mgl_settings_infinite-menu', 'mgl_infinite' );
			add_settings_field( 'mgl_infinite_loader_color', __( "Loader Color", 'meow-gallery' ),
				array( $this, 'admin_infinite_loader_color_callback' ),
				'mgl_settings_infinite-menu', 'mgl_infinite' );
			register_setting( 'mgl_settings_infinite', 'mgl_infinite_loader' );
			register_setting( 'mgl_settings_infinite', 'mgl_infinite_loader_color' );
			register_setting( 'mgl_settings_infinite', 'mgl_infinite_animation' );
			register_setting( 'mgl_settings_infinite', 'mgl_infinite_batch_size' );
		}

		// Tiles
		add_settings_section( 'mgl_tiles', null, null, 'mgl_settings_tiles-menu' );
		add_settings_field( 'mgl_tiles_gutter', __( "Gutter", 'meow-gallery' ),
			array( $this, 'admin_tiles_gutter_callback' ),
			'mgl_settings_tiles-menu', 'mgl_tiles' );
		register_setting( 'mgl_settings_tiles', 'mgl_tiles_gutter' );
		add_settings_field( 'mgl_tiles_row_height', __( "Row Height", 'meow-gallery' ),
			array( $this, 'admin_tiles_row_height_callback' ),
			'mgl_settings_tiles-menu', 'mgl_tiles' );
		register_setting( 'mgl_settings_tiles', 'mgl_tiles_row_height' );

		// Masonry
		add_settings_section( 'mgl_masonry', null, null, 'mgl_settings_masonry-menu' );
		add_settings_field( 'mgl_masonry_gutter', __( "Gutter", 'meow-gallery' ),
			array( $this, 'admin_masonry_gutter_callback' ),
			'mgl_settings_masonry-menu', 'mgl_masonry' );
		register_setting( 'mgl_settings_masonry', 'mgl_masonry_gutter' );
		add_settings_field( 'mgl_masonry_columns', __( "Columns", 'meow-gallery' ),
			array( $this, 'admin_masonry_columns_callback' ),
			'mgl_settings_masonry-menu', 'mgl_masonry' );
		register_setting( 'mgl_settings_masonry', 'mgl_masonry_columns' );

		// Justified
		add_settings_section( 'mgl_justified', null, null, 'mgl_settings_justified-menu' );
		add_settings_field( 'mgl_justified_gutter', __( "Gutter", 'meow-gallery' ),
			array( $this, 'admin_justified_gutter_callback' ),
			'mgl_settings_justified-menu', 'mgl_justified' );
		register_setting( 'mgl_settings_justified', 'mgl_justified_gutter' );
		add_settings_section( 'mgl_justified', null, null, 'mgl_settings_justified-menu' );
		add_settings_field( 'mgl_justified_row_height', __( "Row Height", 'meow-gallery' ),
			array( $this, 'admin_justified_row_height_callback' ),
			'mgl_settings_justified-menu', 'mgl_justified' );
		register_setting( 'mgl_settings_justified', 'mgl_justified_row_height' );

		// Square
		add_settings_section( 'mgl_square', null, null, 'mgl_settings_square-menu' );
		add_settings_field( 'mgl_square_gutter', __( "Gutter", 'meow-gallery' ),
			array( $this, 'admin_square_gutter_callback' ),
			'mgl_settings_square-menu', 'mgl_square' );
		register_setting( 'mgl_settings_square', 'mgl_square_gutter' );
		add_settings_field( 'mgl_square_columns', __( "Columns", 'meow-gallery' ),
			array( $this, 'admin_square_columns_callback' ),
			'mgl_settings_square-menu', 'mgl_square' );
		register_setting( 'mgl_settings_square', 'mgl_square_columns' );

		// Slider
		add_settings_section( 'mgl_slider', null, null, 'mgl_settings_slider-menu' );
		add_settings_field( 'mgl_slider_image_height', __( "Image Height", 'meow-gallery' ),
			array( $this, 'admin_slider_image_height_callback' ),
			'mgl_settings_slider-menu', 'mgl_slider' );
		register_setting( 'mgl_settings_slider', 'mgl_slider_image_height' );
		add_settings_field( 'mgl_slider_nav_enabled', __( "Navigation", 'meow-gallery' ),
			array( $this, 'admin_slider_nav_enabled_callback' ),
			'mgl_settings_slider-menu', 'mgl_slider' );
		register_setting( 'mgl_settings_slider', 'mgl_slider_nav_enabled' );
		add_settings_field( 'mgl_slider_nav_height', __( "Navigation Height", 'meow-gallery' ),
			array( $this, 'admin_slider_nav_height_callback' ),
			'mgl_settings_slider-menu', 'mgl_slider' );
		register_setting( 'mgl_settings_slider', 'mgl_slider_nav_height' );
	}

	function admin_settings() {
		?>
		<div class="wrap">
			<?php echo $this->display_title( "Meow Gallery" , "By Jordy Meow & Thomas Kim");  ?>
			<p><?php echo _e( "This gallery plugin is designed for photographers, by photographers. If you have ideas or feature requests, don't hesitate to contact us.", 'meow-gallery' ) ?></p>
			
			<div class="section group">
				<div class="meow-box col span_2_of_2">
					<h3><?php echo _e( "How to use", 'meow-gallery' ) ?></h3>
					<div class="inside">
						<?php echo _e( "Meow Gallery works with the core <a target='_blank' href='https://codex.wordpress.org/The_WordPress_Gallery'>WordPress Gallery</a>, the official <a target='_blank' href='https://codex.wordpress.org/Gallery_Shortcode'>Gallery Shortcode</a>, and the Gutenberg Gallery. Here, you can set the default settings but you can override them for each gallery in your website.", 'meow-gallery' ) ?>
					</div>
				</div>
			</div>

			<div class="section group">

				<div class="meow-col meow-span_1_of_2">

					<div class="meow-box">
						<form method="post" action="options.php">
							<h3><?php _e( "Display", 'meow-gallery' ); ?></h3>
							<div class="inside">

								<?php settings_fields( 'mgl_settings' ); ?>
								<?php do_settings_sections( 'mgl_settings-menu' ); ?>
								<?php submit_button(); ?>
							</div>
						</form>
					</div>

				</div>

				<div class="meow-col meow-span_1_of_2">

					<?php $this->display_serialkey_box( "https://meowapps.com/meow-gallery/" ); ?>

					<div class="meow-box">

						<div class="meow-tabs">

							<div style="background: #3b3b3b; height: 26px; width: 100%; margin-bottom: -26px;"></div>

							<input name="tabs" type="radio" id="mgl-tab-tiles" checked="checked" class="meow-tabs-input"/>
							<label for="mgl-tab-tiles" class="meow-tabs-label">Tiles</label>
							<div class="inside">
								<form method="post" action="options.php">
									<?php settings_fields( 'mgl_settings_tiles' ); ?>
									<?php do_settings_sections( 'mgl_settings_tiles-menu' ); ?>
									<?php submit_button(); ?>
								</form>
							</div>

							<input name="tabs" type="radio" id="mgl-tab-masonry" class="meow-tabs-input"/>
							<label for="mgl-tab-masonry" class="meow-tabs-label">Masonry</label>
							<div class="inside">
								<form method="post" action="options.php">
									<?php settings_fields( 'mgl_settings_masonry' ); ?>
									<?php do_settings_sections( 'mgl_settings_masonry-menu' ); ?>
									<?php submit_button(); ?>
								</form>
							</div>

							<input name="tabs" type="radio" id="mgl-tab-justified" class="meow-tabs-input"/>
							<label for="mgl-tab-justified" class="meow-tabs-label">Justified</label>
							<div class="inside">
								<form method="post" action="options.php">
									<?php settings_fields( 'mgl_settings_justified' ); ?>
									<?php do_settings_sections( 'mgl_settings_justified-menu' ); ?>
									<?php submit_button(); ?>
								</form>
							</div>

							<input name="tabs" type="radio" id="mgl-tab-square" class="meow-tabs-input"/>
							<label for="mgl-tab-square" class="meow-tabs-label">Square</label>
							<div class="inside">
								<form method="post" action="options.php">
									<?php settings_fields( 'mgl_settings_square' ); ?>
									<?php do_settings_sections( 'mgl_settings_square-menu' ); ?>
									<?php submit_button(); ?>
								</form>
							</div>

							<input name="tabs" type="radio" id="mgl-tab-slider" class="meow-tabs-input"/>
							<label for="mgl-tab-slider" class="meow-tabs-label">Slider</label>
							<div class="inside">
								<form method="post" action="options.php">
									<?php settings_fields( 'mgl_settings_slider' ); ?>
									<?php do_settings_sections( 'mgl_settings_slider-menu' ); ?>
									<?php submit_button(); ?>
								</form>
							</div>

						</div>
					</div>

					<?php if ( get_option( 'mgl_infinite', false ) && 1 == 2 && $this->is_registered() ): ?>
					<div class="meow-box">
						<form method="post" action="options.php">
							<h3><?php _e( "Infinite Loading", 'meow-gallery' ); ?></h3>
							<div class="inside">
								<?php settings_fields( 'mgl_settings_infinite' ); ?>
								<?php do_settings_sections( 'mgl_settings_infinite-menu' ); ?>
								<?php submit_button(); ?>
							</div>
						</form>
					</div>
					<?php endif; ?>

				</div>

			</div>
		</div>
		<?php
	}

	/*
		OPTIONS CALLBACKS
	*/

	function admin_layout_callback( $args ) {
		$layouts = array(
			'tiles' => array( 'name' => __( 'Tiles', 'meow-gallery' ),
				'desc' => __( "Smart algorithm, row-based.", 'meow-gallery' ) ),
			'masonry' => array( 'name' => __( 'Masonry', 'meow-gallery' ),
				'desc' => __( "Famous layout, column-based.", 'meow-gallery' ) ),
			'justified' => array( 'name' => __( 'Justified', 'meow-gallery' ),
				'desc' => __( "Flickr-like, row-based.", 'meow-gallery' ) ),
			'square' => array( 'name' => __( 'Square', 'meow-gallery' ),
				'desc' => __( "Instagram-like, all squares.", 'meow-gallery' ) ),
			'slider' => array( 'name' => __( 'Slider (Pro)', 'meow-gallery' ), 
				'desc' => "Slider, carousel-like, one by one." ),
			'none' => array( 'name' => __( 'None', 'meow-gallery' ), 
				'desc' => "Only active if a layout is explicitely set." )
		);
		$html = '';
		foreach ( $layouts as $key => $arg )
			$html .= '<div style="padding-bottom: 10px; margin-bottom: 8px;">' . ( $key !== 'none' ? ( '<img width="50" style="float: right; margin-top: -6px;"
				src="' . plugin_dir_url(__FILE__) . 'img/layout-' . $key . '.png" />' ) : 
				'<div style=\'margin-right: 20px; width: 40px; float: right; height: 50px;\'>
				</div>' ) . '<input type="radio" class="radio" id="mgl_layout" name="mgl_layout" value="' . $key . '"' .
				checked( $key, get_option( 'mgl_layout', 'tiles' ), false ) . ' > '  .
				( empty( $arg ) ? 'None' : $arg['name'] ) .
				( empty( $arg ) ? '' : '<br/><small>' . $arg['desc'] . '</small>' ) .
				'</div><div style="clear: both;">';
		$html .= '<small>' . __( 'Can be overriden by using an attribute <i>layout</i> in the shortcode of the gallery, like: [gallery layout=\'masonry\']. This value can be: tiles, justified, masonry, or square.', 'meow-gallery' ) . '<small>';
		echo $html;
	}

	function admin_default_size_callback( $args ) {
		$layouts = array(
			'thumbnail' => array( 'name' => __( 'Thumbnail', 'meow-gallery' ), 'desc' => "" ),
			'medium' => array( 'name' => __( 'Medium', 'meow-gallery' ), 'desc' => "" ),
			'large' => array( 'name' => __( 'Large', 'meow-gallery' ), 'desc' => "" ),
			'full' => array( 'name' => __( 'Full', 'meow-gallery' ), 'desc' => "" )
		);
		$html = '';
		foreach ( $layouts as $key => $arg )
			$html .= '<input type="radio" class="radio" id="mgl_default_size" name="mgl_default_size" value="' . $key . '"' .
				checked( $key, get_option( 'mgl_default_size', 'thumbnail' ), false ) . ' > '  .
				( empty( $arg ) ? 'None' : $arg['name'] ) .
				'<br />';
		echo $html;
	}

	function admin_tiles_gutter_callback( $args ) {
		$value = get_option( 'mgl_tiles_gutter', 5 );
		$html = '<input type="number" style="width: 100%;" id="mgl_tiles_gutter" name="mgl_tiles_gutter" value="' . $value . '" />';
		$html .= '<br /><span class="description">' . __( "Space between the photos (in pixels).", 'meow-gallery' ) . '</span>';
		echo $html;
	}

	function admin_tiles_row_height_callback( $args ) {
		$value = get_option( 'mgl_tiles_row_height', 300 );
		$html = '<input type="number" style="width: 100%;" id="mgl_tiles_row_height" name="mgl_tiles_row_height" value="' . $value . '" />';
		$html .= '<br /><span class="description">' . __( "Ideal height of each row (in pixels).", 'meow-gallery' ) . '</span>';
		echo $html;
	}

	function admin_masonry_gutter_callback( $args ) {
		$value = get_option( 'mgl_masonry_gutter', 5 );
		$html = '<input type="number" style="width: 100%;" id="mgl_masonry_gutter" name="mgl_masonry_gutter" value="' . $value . '" />';
		$html .= '<br /><span class="description">' . __( "Space between the photos (in pixels).", 'meow-gallery' ) . '</span>';
		echo $html;
	}

	function admin_masonry_columns_callback( $args ) {
		$value = get_option( 'mgl_masonry_columns', 3 );
		$html = '<input type="number" style="width: 100%;" id="mgl_masonry_columns" name="mgl_masonry_columns" value="' . $value . '" />';
		$html .= '<br /><span class="description">' . __( "Ideal number of columns.", 'meow-gallery' ) . '</span>';
		echo $html;
	}
	
	function admin_justified_gutter_callback( $args ) {
		$value = get_option( 'mgl_justified_gutter', 5 );
		$html = '<input type="number" style="width: 100%;" id="mgl_justified_gutter" name="mgl_justified_gutter" value="' .
			$value . '" />';
		$html .= '<br /><span class="description">' . __( "Space between the photos (in pixels).", 'meow-gallery' ) . '</span>';
		echo $html;
	}

	function admin_justified_row_height_callback( $args ) {
		$value = get_option( 'mgl_justified_row_height', 300 );
		$html = '<input type="number" style="width: 100%;" id="mgl_justified_row_height" name="mgl_justified_row_height" value="' .
			$value . '" />';
		$html .= '<br /><span class="description">' . __( "Ideal height of each row (in pixels).", 'meow-gallery' ) . '</span>';
		echo $html;
	}

	function admin_square_gutter_callback( $args ) {
		$value = get_option( 'mgl_square_gutter', 5 );
		$html = '<input type="number" style="width: 100%;" id="mgl_square_gutter" name="mgl_square_gutter" value="' . $value . '" />';
		$html .= '<br /><span class="description">' . __( "Space between the photos (in pixels).", 'meow-gallery' ) . '</span>';
		echo $html;
	}

	function admin_square_columns_callback( $args ) {
		$value = get_option( 'mgl_square_columns', 5 );
		$html = '<input type="number" style="width: 100%;" id="mgl_square_columns" name="mgl_square_columns" value="' . $value . '" />';
		$html .= '<br /><span class="description">' . __( "Ideal height of each row (in pixels).", 'meow-gallery' ) . '</span>';
		echo $html;
	}

	function admin_display_captions_callback( $args ) {
		$html = '<input type="checkbox" id="mgl_captions_enabled" name="mgl_captions_enabled" value="1" ' .
			checked( 1, get_option( 'mgl_captions_enabled', true ), false ) . '/>';
		$html .= '<label>' . __( 'Enabled', 'meow-gallery' ) . '</label>';
		echo $html;
	}

	function admin_infinite_batch_size_callback( $args ) {
		$value = get_option( 'mgl_infinite_batch_size', 20 );
		$html = '<input type="number" style="width: 100%;" id="mgl_infinite_batch_size" name="mgl_infinite_batch_size" value="' .
			$value . '" />';
		$html .= '<br /><span class="description">' . __( "Space between the photos (in pixels).", 'meow-gallery' ) . '</span>';
		echo $html;
	}

	function admin_infinite_animation_callback( $args ) {
		$html = '<input type="checkbox" id="mgl_infinite_animation" name="mgl_infinite_animation" value="1" ' .
			checked( 1, get_option( 'mgl_infinite_animation', true ), false ) . '/>';
		$html .= '<label>' . __( 'Enabled', 'meow-gallery' ) . '</label><br /><small>' . __( 'Fade-in the newly loaded photos.', 'meow-gallery' ) . '</small>';
		echo $html;
	}

	function admin_infinite_loader_callback( $args ) {
		$html = '<input type="checkbox" id="mgl_infinite_loader" name="mgl_infinite_loader" value="1" ' .
			checked( 1, get_option( 'mgl_infinite_loader', true ), false ) . '/>';
		$html .= '<label>' . __( 'Enabled', 'meow-gallery' ) . '</label><br /><small>' . __( 'Display a loader when the next batch of photos is being loaded.', 'meow-gallery' ) . '</small>';
		echo $html;
	}

	function admin_infinite_loader_color_callback( $args ) {
		$value = get_option( 'mgl_infinite_loader_color', '#444' );
		$html = '<input type="text" style="width: 100%;" id="mgl_infinite_loader_color" name="mgl_infinite_loader_color" value="' .
			$value . '" />';
		$html .= '<br /><span class="description">' . __( 'Color of the loader ("#444" by default).', 'meow-gallery' ) . '</span>';
		echo $html;
	}

	function admin_infinite_callback( $args ) {
		$html = '<input ' . disabled( $this->is_registered(), false, false ) .
			' type="checkbox" id="mgl_infinite" name="mgl_infinite" value="1" ' .
			checked( 1, get_option( 'mgl_infinite' ), false ) . '/>';
		$html .= '<label>' . __( 'Enabled (Pro)', 'meow-gallery' ) . '</label><br /><small>' . __( 'Photos will be loaded progressively, as the user scrolls down. Ideal for galleries with many photos, for a faster website. ', 'meow-gallery' ) . '</small>';
		echo $html;
	}

	function admin_slider_image_height_callback( $args ) {
		$value = get_option( 'mgl_slider_image_height', 500 );
		$html = '<input type="number" style="width: 100%;" id="mgl_slider_image_height" name="mgl_slider_image_height" value="' . $value . '" />';
		$html .= '<br /><span class="description">' . __( "Height of the displayed image.", 'meow-gallery' ) . '</span>';
		echo $html;
	}

	function admin_slider_nav_enabled_callback( $args ) {
		$html = '<input type="checkbox" id="mgl_slider_nav_enabled" name="mgl_slider_nav_enabled" value="1" ' .
			checked( 1, get_option( 'mgl_slider_nav_enabled', true ), false ) . '/>';
		$html .= '<label>' . __( 'Enabled', 'meow-gallery' ) . '</label>';
		echo $html;
	}

	function admin_slider_nav_height_callback( $args ) {
		$value = get_option( 'mgl_slider_nav_height', 80 );
		$html = '<input type="number" style="width: 100%;" id="mgl_slider_nav_height" name="mgl_slider_nav_height" value="' . $value . '" />';
		$html .= '<br /><span class="description">' . __( "Ideal height of the navigation bar.", 'meow-gallery' ) . '</span>';
		echo $html;
	}

}

?>
