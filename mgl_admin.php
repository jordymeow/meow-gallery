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
			add_settings_field( 'mgl_layout', "Layout",
				array( $this, 'admin_layout_callback' ),
				'mgl_settings-menu', 'mgl_settings' );
			add_settings_field( 'mgl_default_size', "Default Size",
				array( $this, 'admin_default_size_callback' ),
				'mgl_settings-menu', 'mgl_settings' );
			add_settings_field( 'mgl_infinite', "Infinite Loading<br />(Pro)",
				array( $this, 'admin_infinite_callback' ),
				'mgl_settings-menu', 'mgl_settings' );


			$color = get_option( 'mgl_infinite_loader_color', '#444' );
			if ( empty( $color ) )
				update_option( 'mgl_infinite_loader_color', '#444' );
			$batch = get_option( 'mgl_infinite_batch_size', 20 );
			if ( empty( $batch ) )
				update_option( 'mgl_infinite_batch_size', 20 );

			$layout = get_option( 'mgl_layout' );
			$infinite = get_option( 'mgl_infinite', false ) && $this->is_registered();

			if ( $infinite ) {
				add_settings_section( 'mgl_infinite', null, null, 'mgl_settings_infinite-menu' );
				add_settings_field( 'mgl_infinite_batch_size', "Batch Size",
					array( $this, 'admin_infinite_batch_size_callback' ),
					'mgl_settings_infinite-menu', 'mgl_infinite' );
				add_settings_field( 'mgl_infinite_animation', "Animation",
					array( $this, 'admin_infinite_animation_callback' ),
					'mgl_settings_infinite-menu', 'mgl_infinite' );
				add_settings_field( 'mgl_infinite_loader', "Loader",
					array( $this, 'admin_infinite_loader_callback' ),
					'mgl_settings_infinite-menu', 'mgl_infinite' );
				add_settings_field( 'mgl_infinite_loader_color', "Loader Color",
					array( $this, 'admin_infinite_loader_color_callback' ),
					'mgl_settings_infinite-menu', 'mgl_infinite' );
				register_setting( 'mgl_settings_infinite', 'mgl_infinite_loader' );
				register_setting( 'mgl_settings_infinite', 'mgl_infinite_loader_color' );
				register_setting( 'mgl_settings_infinite', 'mgl_infinite_animation' );
				register_setting( 'mgl_settings_infinite', 'mgl_infinite_batch_size' );
			}

			// SUBMENU > Settings > Settings
			if ( $layout == 'masonry' ) {
				add_settings_section( 'mgl_masonry', null, null, 'mgl_settings_masonry-menu' );
				add_settings_field( 'mgl_masonry_gutter', "Gutter",
					array( $this, 'admin_masonry_gutter_callback' ),
					'mgl_settings_masonry-menu', 'mgl_masonry' );
				add_settings_field( 'mgl_masonry_display_captions', "Captions",
					array( $this, 'admin_display_captions_callback' ),
					'mgl_settings_masonry-menu', 'mgl_masonry' );
				register_setting( 'mgl_settings_masonry', 'mgl_masonry_display_captions' );
				register_setting( 'mgl_settings_masonry', 'mgl_masonry_gutter' );
			}
			// SUBMENU > Settings > Settings
			else if ( $layout == 'horizontal-slider' ) {
				//add_settings_section( 'mgl_justified', null, null, 'mgl_settings_horizontal-slider-menu' );
				// add_settings_field( 'mgl_horizontal-slider_gutter', "Gutter",
				// 	array( $this, 'admin_horizontal-slider_gutter_callback' ),
				// 	'mgl_settings_horizontal-slider-menu', 'mgl_justified' );
				//register_setting( 'mgl_settings', 'mgl_justified_gutter' );
			}
			// SUBMENU > Settings > Settings
			else if ( $layout == 'justified' ) {
				add_settings_section( 'mgl_justified', null, null, 'mgl_settings_justified-menu' );
				add_settings_field( 'mgl_justified_gutter', "Gutter",
					array( $this, 'admin_justified_gutter_callback' ),
					'mgl_settings_justified-menu', 'mgl_justified' );
				register_setting( 'mgl_settings_justified', 'mgl_justified_gutter' );
			}

		// SETTINGS
		register_setting( 'mgl_settings', 'mgl_layout' );
		register_setting( 'mgl_settings', 'mgl_infinite' );
		register_setting( 'mgl_settings', 'mgl_default_size' );
	}

	function admin_settings() {
		?>
		<div class="wrap">
			<?php echo $this->display_title( "Meow Gallery" , "By Jordy Meow & Thomas Kim");  ?>
			<p>This gallery plugin is designed for photographers, by photographers. If you have ideas or feature requests, don't hesitate to contact us.</p>
			<div class="section group">
				<div class="meow-box col span_2_of_2">
					<h3>How to use</h3>
					<div class="inside">
						<?php echo _e( "The Meow Gallery simply re-uses the standard WP Gallery and enhances it. You can create a gallery in a post or in a page by using the <b>Add Media</b> button and then the <b>Create Gallery</b> button.
						While the default options should be fine, you can modify them below.", 'meow-gallery' ) ?>
					</div>
				</div>
			</div>
			<div class="section group">

					<div class="meow-col meow-span_1_of_2">

						<div class="meow-box">
							<form method="post" action="options.php">
								<h3>Display</h3>
								<div class="inside">
									<?php settings_fields( 'mgl_settings' ); ?>
							    <?php do_settings_sections( 'mgl_settings-menu' ); ?>
							    <?php submit_button(); ?>
								</div>
							</form>
						</div>

						<?php if ( get_option( 'mgl_layout', 'masonry' ) == 'masonry' ): ?>
						<div class="meow-box">
							<form method="post" action="options.php">
								<h3>Masonry</h3>
								<div class="inside">
									<?php settings_fields( 'mgl_settings_masonry' ); ?>
									<?php do_settings_sections( 'mgl_settings_masonry-menu' ); ?>
							    <?php submit_button(); ?>
								</div>
							</form>
						</div>
						<?php endif; ?>

					</div>

					<div class="meow-col meow-span_1_of_2">

						<?php $this->display_serialkey_box( "https://meowapps.com/meow-gallery/" ); ?>

						<?php if ( get_option( 'mgl_infinite', false ) && $this->is_registered() ): ?>
						<div class="meow-box">
							<form method="post" action="options.php">
								<h3>Infinite Loading</h3>
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
			'masonry' => array( 'name' => 'Masonry', 'desc' => "Display your photos using Masonry." ),
			'horizontal-slider' => array( 'name' => 'Horizontal Slider', 'desc' => "Your photos in a horizontal slider." ),
			//'justified' => array( 'name' => 'Justified', 'desc' => "Justified by row." ),
		);
		$html = '';
		foreach ( $layouts as $key => $arg )
			$html .= '<input type="radio" class="radio" id="mgl_layout" name="mgl_layout" value="' . $key . '"' .
				checked( $key, get_option( 'mgl_layout', 'masonry' ), false ) . ' > '  .
				( empty( $arg ) ? 'None' : $arg['name'] ) .
				( empty( $arg ) ? '' : '<br/><small>' . $arg['desc'] . '</small>' ) .
				'<br /><br />';
		echo $html;
	}

	function admin_default_size_callback( $args ) {
		$layouts = array(
			'thumbnail' => array( 'name' => 'Thumbnail', 'desc' => "" ),
			'medium' => array( 'name' => 'Medium', 'desc' => "" ),
			'large' => array( 'name' => 'Large', 'desc' => "" ),
			'full' => array( 'name' => 'Full', 'desc' => "" )
		);
		$html = '';
		foreach ( $layouts as $key => $arg )
			$html .= '<input type="radio" class="radio" id="mgl_default_size" name="mgl_default_size" value="' . $key . '"' .
				checked( $key, get_option( 'mgl_default_size', 'thumbnail' ), false ) . ' > '  .
				( empty( $arg ) ? 'None' : $arg['name'] ) .
				'<br />';
		echo $html;
	}

	function admin_masonry_gutter_callback( $args ) {
    $value = get_option( 'mgl_masonry_gutter', 10 );
    $html = '<input type="number" style="width: 100%;" id="mgl_masonry_gutter" name="mgl_masonry_gutter" value="' . $value . '" />';
    $html .= '<br /><span class="description">Spacing in pixels between the photos.</label>';
    echo $html;
  }

	function admin_display_captions_callback( $args ) {
		$html = '<input type="checkbox" id="mgl_masonry_display_captions" name="mgl_masonry_display_captions" value="1" ' .
			checked( 1, get_option( 'mgl_masonry_display_captions', false ), false ) . '/>';
    $html .= '<label>Display</label><br /><small>Display images captions.</small>';
    echo $html;
  }

	function admin_infinite_batch_size_callback( $args ) {
    $value = get_option( 'mgl_infinite_batch_size', 20 );
    $html = '<input type="number" style="width: 100%;" id="mgl_infinite_batch_size" name="mgl_infinite_batch_size" value="' .
			$value . '" />';
    $html .= '<br /><span class="description">Spacing in pixels between the photos.</label>';
    echo $html;
  }

	function admin_infinite_animation_callback( $args ) {
		$html = '<input type="checkbox" id="mgl_infinite_animation" name="mgl_infinite_animation" value="1" ' .
			checked( 1, get_option( 'mgl_infinite_animation', true ), false ) . '/>';
    $html .= '<label>Enabled</label><br /><small>Fade-in the newly loaded photos.</small>';
    echo $html;
  }

	function admin_infinite_loader_callback( $args ) {
		$html = '<input type="checkbox" id="mgl_infinite_loader" name="mgl_infinite_loader" value="1" ' .
			checked( 1, get_option( 'mgl_infinite_loader', true ), false ) . '/>';
    $html .= '<label>Enabled</label><br /><small>Display a loader when the next batch of photos is being loaded.</small>';
    echo $html;
  }

	function admin_infinite_loader_color_callback( $args ) {
    $value = get_option( 'mgl_infinite_loader_color', '#444' );
    $html = '<input type="text" style="width: 100%;" id="mgl_infinite_loader_color" name="mgl_infinite_loader_color" value="' .
			$value . '" />';
    $html .= '<br /><span class="description">Color of the loader ("#444" by default).</label>';
    echo $html;
  }

	function admin_infinite_callback( $args ) {
		$html = '<input ' . disabled( $this->is_registered(), false, false ) .
			' type="checkbox" id="mgl_infinite" name="mgl_infinite" value="1" ' .
			checked( 1, get_option( 'mgl_infinite' ), false ) . '/>';
    $html .= '<label>Enabled</label><br /><small>Ideal for galleries with hundreds of photos (or more). The photos will be loaded progressively as the user scrolls down.</small>';
    echo $html;
  }

	// function admin_takendate_callback( $args ) {
	// 	$html = '<input type="checkbox" id="wplr_use_taken_date" name="wplr_use_taken_date" value="1" ' .
	// 		checked( 1, get_option( 'wplr_use_taken_date' ), false ) . '/>';
	// 	$html .= '<label for="wplr_use_taken_date"> '  . $args[0] . '</label><br>';
	// 	$html .= '<span class="description">The date of the Media will not be the time when it was added to the Media Library but the the time when the photo was taken. ' . ( function_exists( 'exif_read_data' ) ? "EXIF functions are enabled on your server." : "EXIF functions are <b>NOT</b> enabled on your server." ) . '</span>';
	// 	echo $html;
	// }

}

?>
