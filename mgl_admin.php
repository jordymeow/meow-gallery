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
		global $mgl_version;

		// SUBMENU > Settings
		add_submenu_page( 'meowapps-main-menu', 'Gallery', 'Gallery', 'manage_options',
			'mgl_settings-menu', array( $this, 'admin_settings' ) );

		// SUBMENU > Settings > Layouts
		add_settings_section( 'mgl_settings', null, null, 'mgl_settings-menu' );
		add_settings_field( 'mgl_layout', __( "Default Layout", 'meow-gallery' ),
			array( $this, 'admin_layout_callback' ),
			'mgl_settings-menu', 'mgl_settings' );
		register_setting( 'mgl_settings', 'mgl_layout' );
		add_settings_field( 'mgl_captions_enabled', __( "Captions", 'meow-gallery' ),
			array( $this, 'admin_display_captions_callback' ),
			'mgl_settings-menu', 'mgl_settings' );
		register_setting( 'mgl_settings', 'mgl_captions_enabled' );

		// Animations
		add_settings_section( 'mgl_animation', null, null, 'mgl_settings_animation-menu' );
		add_settings_field( 'mgl_animation', __( "Default Animation", 'meow-gallery' ),
			array( $this, 'admin_animation_callback' ),
			'mgl_settings_animation-menu', 'mgl_animation' );
		register_setting( 'mgl_settings_animation', 'mgl_animation' );

		// Optimization
		add_settings_section( 'mgl_optimization', null, null, 'mgl_settings_optimization-menu' );
		add_settings_field( 'mgl_infinite', __ ( "Infinite & Lazy", 'meow-gallery' ),
			array( $this, 'admin_infinite_callback' ),
			'mgl_settings_optimization-menu', 'mgl_optimization' );
		add_settings_field( 'mgl_image_size', __ ( "Image Size", 'meow-gallery' ),
			array( $this, 'admin_image_size_callback' ),
			'mgl_settings_optimization-menu', 'mgl_optimization' );
		register_setting( 'mgl_settings_optimization', 'mgl_image_size' );
		register_setting( 'mgl_settings_optimization', 'mgl_infinite' );

		// Preview in gutenberg need the CSS and JS
		wp_register_style( 'mgl-css', plugin_dir_url( __FILE__ ) . 'css/style.css', null, $mgl_version );
		wp_enqueue_style( 'mgl-css' );
		wp_enqueue_script( 'mgl-js', plugins_url( 'js/mgl.js', __FILE__ ), array( 'jquery' ), $mgl_version, false );

		// Tiles
		add_settings_section( 'mgl_tiles', null, null, 'mgl_settings_tiles-menu' );
		add_settings_field( 'mgl_tiles_gutter', __( "Gutter", 'meow-gallery' ),
			array( $this, 'admin_tiles_gutter_callback' ),
			'mgl_settings_tiles-menu', 'mgl_tiles' );
		register_setting( 'mgl_settings_tiles', 'mgl_tiles_gutter' );

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

		// Tiles
		add_settings_section( 'mgl_cascade', null, null, 'mgl_settings_cascade-menu' );
		add_settings_field( 'mgl_cascade_gutter', __( "Gutter", 'meow-gallery' ),
			array( $this, 'admin_cascade_gutter_callback' ),
			'mgl_settings_cascade-menu', 'mgl_cascade' );
		register_setting( 'mgl_settings_cascade', 'mgl_cascade_gutter' );

		// Carousel
		add_settings_section( 'mgl_carousel', null, null, 'mgl_settings_carousel-menu' );
		add_settings_field( 'mgl_carousel_gutter', __( "Gutter", 'meow-gallery' ),
			array( $this, 'admin_carousel_gutter_callback' ),
			'mgl_settings_carousel-menu', 'mgl_carousel' );
		register_setting( 'mgl_settings_carousel', 'mgl_carousel_gutter' );
		add_settings_field( 'mgl_carousel_image_height', __( "Height", 'meow-gallery' ),
			array( $this, 'admin_carousel_image_height_callback' ),
			'mgl_settings_carousel-menu', 'mgl_carousel' );
		register_setting( 'mgl_settings_carousel', 'mgl_carousel_image_height' );
		add_settings_field( 'mgl_carousel_arrow_nav_enabled', __( "Arrow Navigation", 'meow-gallery' ),
			array( $this, 'admin_carousel_arrow_nav_enabled_callback' ),
			'mgl_settings_carousel-menu', 'mgl_carousel' );
		register_setting( 'mgl_settings_carousel', 'mgl_carousel_arrow_nav_enabled' );
		add_settings_field( 'mgl_carousel_dot_nav_enabled', __( "Dot Navigation", 'meow-gallery' ),
			array( $this, 'admin_carousel_dot_nav_enabled_callback' ),
			'mgl_settings_carousel-menu', 'mgl_carousel' );
		register_setting( 'mgl_settings_carousel', 'mgl_carousel_dot_nav_enabled' );
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
						<?php echo _e( "Meow Gallery works with the core <a target='_blank' href='https://codex.wordpress.org/The_WordPress_Gallery'>WordPress Gallery</a>, the official <a target='_blank' href='https://codex.wordpress.org/Gallery_Shortcode'>Gallery Shortcode</a>, and the Gutenberg Gallery can be converted to it. Here, you can set the default settings but you can override them for each gallery in your website. Please get the <a target='_blank' href='https://meowapps.com/plugin/meow-gallery/'>Pro version</a> to help us, and you will get animations, optimizations, and an additional layout :)", 'meow-gallery' ) ?>
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

							<input name="tabs" type="radio" id="mgl-tab-cascade" class="meow-tabs-input"/>
							<label for="mgl-tab-cascade" class="meow-tabs-label">Cascade</label>
							<div class="inside">
								<form method="post" action="options.php">
									<?php settings_fields( 'mgl_settings_cascade' ); ?>
									<?php do_settings_sections( 'mgl_settings_cascade-menu' ); ?>
									<?php submit_button(); ?>
								</form>
							</div>

							<input name="tabs" type="radio" id="mgl-tab-carousel" class="meow-tabs-input"/>
							<label for="mgl-tab-carousel" class="meow-tabs-label">carousel</label>
							<div class="inside">
								<form method="post" action="options.php">
									<?php settings_fields( 'mgl_settings_carousel' ); ?>
									<?php do_settings_sections( 'mgl_settings_carousel-menu' ); ?>
									<?php submit_button(); ?>
								</form>
							</div>

						</div>
					</div>

				</div>

				<div class="meow-col meow-span_1_of_2">

					<?php $this->display_serialkey_box( "https://meowapps.com/meow-gallery/" ); ?>

					<div class="meow-box">
						<form method="post" action="options.php">
							<h3><?php _e( "Animation", 'meow-gallery' ); ?></h3>
							<div class="inside">
								<?php if ( !$this->is_registered() ): ?>
								<p><?php _e( 'This is only available in the <a target="_blank" href="https://meowapps.com/plugin/meow-gallery/">Pro version</a>.' ); ?></p>
								<?php endif; ?>
								<?php settings_fields( 'mgl_settings_animation' ); ?>
								<?php do_settings_sections( 'mgl_settings_animation-menu' ); ?>
								<?php submit_button(); ?>
							</div>
						</form>
					</div>

					<div class="meow-box">
						<form method="post" action="options.php">
							<h3><?php _e( "Optimization / Speed", 'meow-gallery' ); ?></h3>
							<div class="inside">
								<?php if ( !$this->is_registered() ): ?>
								<p><?php _e( 'This is only available in the <a target="_blank" href="https://meowapps.com/plugin/meow-gallery/">Pro version</a>.' ); ?></p>
								<?php endif; ?>
								<?php settings_fields( 'mgl_settings_optimization' ); ?>
								<?php do_settings_sections( 'mgl_settings_optimization-menu' ); ?>
								<?php submit_button(); ?>
							</div>
						</form>
					</div>

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
			'cascade' => array( 'name' => __( 'Cascade', 'meow-gallery' ),
				'desc' => __( "Portraits are coupled together.", 'meow-gallery' ) ),
			'carousel' => array( 'name' => __( 'Carousel (Pro)', 'meow-gallery' ),
				'desc' => "Pretty swipeable carousel." ),
			'none' => array( 'name' => __( 'None', 'meow-gallery' ),
				'desc' => "Only active if a layout is explicitely set." )
		);
		$html = '';
		foreach ( $layouts as $key => $arg )
			$html .= '<div style="padding-bottom: 10px; margin-bottom: 8px;">' . ( $key !== 'none' ? ( '<img width="38" style="float: right; margin-top: -2px;"
				src="' . plugin_dir_url(__FILE__) . 'img/layout-' . $key . '.png" />' ) :
				'<div style=\'margin-right: 20px; width: 40px; float: right; height: 50px;\'>
				</div>' ) . '<input type="radio" class="radio" id="mgl_layout" name="mgl_layout" value="' . $key . '"' .
				disabled( $key !== 'carousel' || $this->is_registered(), false, false ) .
				checked( $key, get_option( 'mgl_layout', 'tiles' ), false ) . ' > '  .
				( empty( $arg ) ? 'None' : $arg['name'] ) .
				( empty( $arg ) ? '' : '<br/><small>' . $arg['desc'] . '</small>' ) .
				'</div><div style="clear: both;">';
		$html .= '<small>' . __( 'Can be overriden by using the attribute <b>layout</b> in the shortcode of the gallery, like: [gallery layout=\'masonry\']. This value can be: tiles, masonry, justified, square, cascade or carousel.', 'meow-gallery' ) . '<small>';
		echo $html;
	}

	function admin_image_size_callback( $args ) {
		$layouts = array(
			'srcset' => array( 'name' => __( 'Responsive Images (src-set)', 'meow-gallery' ), 'desc' => "" ),
			'thumbnail' => array( 'name' => __( 'Thumbnail', 'meow-gallery' ), 'desc' => "" ),
			'medium' => array( 'name' => __( 'Medium', 'meow-gallery' ), 'desc' => "" ),
			'large' => array( 'name' => __( 'Large', 'meow-gallery' ), 'desc' => "" ),
			'full' => array( 'name' => __( 'Full', 'meow-gallery' ), 'desc' => "" )
		);
		$html = '';
		$image_size = get_option( 'mgl_image_size', 'srcset' );
		if ( empty( $image_size ) ) {
			update_option( 'mgl_image_size', 'srcset' );
			$image_size = 'srcset';
		}
		foreach ( $layouts as $key => $arg )
			$html .= '<input type="radio" class="radio" id="mgl_image_size" name="mgl_image_size" value="' . $key . '"' .
				checked( $key, $image_size, false ) . ' > '  .
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

	function admin_cascade_gutter_callback( $args ) {
		$value = get_option( 'mgl_cascade_gutter', 5 );
		$html = '<input type="number" style="width: 100%;" id="mgl_cascade_gutter" name="mgl_cascade_gutter" value="' . $value . '" />';
		$html .= '<br /><span class="description">' . __( "Space between the photos (in pixels).", 'meow-gallery' ) . '</span>';
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
		$value = get_option( 'mgl_justified_row_height', 200 );
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

	function admin_infinite_callback( $args ) {
		$html = '<input ' . disabled( $this->is_registered(), false, false ) . '
			type="checkbox" id="mgl_infinite" name="mgl_infinite" value="1" ' .
			checked( 1, get_option( 'mgl_infinite' ), false ) . '/>';
		$html .= '<label>' . __( 'Enabled', 'meow-gallery' ) . '</label><br /><small>' . __( 'Photos will be loaded progressively, as the user scrolls down. Ideal for galleries with many photos, for a faster website. ', 'meow-gallery' ) . '</small>';
		echo $html;
	}

	function admin_carousel_gutter_callback( $args ) {
		$value = get_option( 'mgl_carousel_gutter', 5 );
		$html = '<input type="number" style="width: 100%;" id="mgl_carousel_gutter" name="mgl_carousel_gutter" value="' . $value . '" />';
		$html .= '<br /><span class="description">' . __( "Space between the photos (in pixels).", 'meow-gallery' ) . '</span>';
		echo $html;
	}

	function admin_carousel_image_height_callback( $args ) {
		$value = get_option( 'mgl_carousel_image_height', 500 );
		$html = '<input type="number" style="width: 100%;" id="mgl_carousel_image_height" name="mgl_carousel_image_height" value="' . $value . '" />';
		echo $html;
	}

	function admin_carousel_arrow_nav_enabled_callback( $args ) {
		$html = '<input type="checkbox" id="mgl_carousel_arrow_nav_enabled" name="mgl_carousel_arrow_nav_enabled" value="1" ' .
			checked( 1, get_option( 'mgl_carousel_arrow_nav_enabled', true ), false ) . '/>';
		$html .= '<label>' . __( 'Enabled', 'meow-gallery' ) . '</label>';
		echo $html;
	}

	function admin_carousel_dot_nav_enabled_callback( $args ) {
		$html = '<input type="checkbox" id="mgl_carousel_dot_nav_enabled" name="mgl_carousel_dot_nav_enabled" value="1" ' .
			checked( 1, get_option( 'mgl_carousel_dot_nav_enabled', false ), false ) . '/>';
		$html .= '<label>' . __( 'Enabled', 'meow-gallery' ) . '</label>';
		echo $html;
	}

	function admin_animation_callback( $args ) {
		$origins = array(
			'zoom-out' => array( 'name' => 'Zoom Out' ),
			'zoom-in' => array( 'name' => 'Zoom In' ),
			'fade-out' => array( 'name' => 'Fade Out' ),
			'fade-in' => array( 'name' => 'Fade In' ),
			'colorize' => array( 'name' => 'Colorize' ),
			'highlight' => array( 'name' => 'Highlight' ),
			'none' => array( 'name' => 'None' ),
		);
		$html = '';
		foreach ( $origins as $key => $arg )
			$html .= '<input type="radio" class="radio" id="mgl_animation" name="mgl_animation" value="' . $key . '"' .
				checked( $key, get_option( 'mgl_animation', 'caption' ), false ) . ' > '  .
				( empty( $arg ) ? 'None' : $arg['name'] ) . '<br />';
		echo $html;
	}

}

?>
