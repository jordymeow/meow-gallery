<?php

if ( !class_exists( 'Meow_Admin' ) ) {

	class Meow_Admin {

		public static $loaded = false;

		public function __construct() {
			if ( !Meow_Admin::$loaded ) {
				add_action( 'admin_menu', array( $this, 'admin_menu_start' ) );
				add_action( 'admin_enqueue_scripts', array( $this, 'admin_enqueue_scripts' ) );
			}
			Meow_Admin::$loaded = true;
		}

		function display_ads() {
			return true;
		}

		function display_title( $title = "Meow Apps", $author = "By Jordy Meow" ) {
			if ( $this->display_ads() ) {
				echo '<a class="meow-header-ad" target="_blank" href="http://www.shareasale.com/u.cfm?D=339321&U=767054&M=41388%20">
				<img src="' . $this->common_url( 'img/wpengine.png' ) . '" height="60" border="0" /></a>';
			}
			?>
			<h1 style="line-height: 16px;">
				<img width="36" style="margin-right: 10px; float: left; position: relative; top: -5px;"
					src="<?php echo $this->meowapps_logo_url(); ?>"><?php echo $title; ?><br />
				<span style="font-size: 12px"><?php echo $author; ?></span>
			</h1>
			<div style="clear: both;"></div>
			<?php
		}

		function admin_enqueue_scripts() {
			wp_register_style( 'meowapps-admin-css', $this->common_url( 'meow-admin.css' ) );
			wp_enqueue_style( 'meowapps-admin-css' );
		}

		function admin_menu_start() {
			// Creates standard menu if it does NOT exist
			global $submenu;
			if ( !isset( $submenu[ 'meowapps-main-menu' ] ) ) {
				add_menu_page( 'Meow Apps', 'Meow Apps', 'manage_options', 'meowapps-main-menu',
					array( $this, 'admin_meow_apps' ), 'dashicons-camera', 82 );
				add_submenu_page( 'meowapps-main-menu', __( 'Dashboard', 'meowapps' ),
					__( 'Dashboard', 'meowapps' ), 'manage_options',
					'meowapps-main-menu', array( $this, 'admin_meow_apps' ) );
			}
		}

		function check_install( $plugin ) {
			$pluginpath = get_home_path() . 'wp-content/plugins/' . $plugin;
			if ( !file_exists( $pluginpath ) ) {
				$url = wp_nonce_url( "update.php?action=install-plugin&plugin=$plugin", "install-plugin_$plugin" );
				return "<a href='$url'><small><span class='' style='float: right;'>install</span></small></a>";
			}
			$plugin_file = $plugin . '/' . $plugin . '.php';
			if ( is_plugin_active( $plugin_file ) )
				return "<small><span style='float: right; color: green;'><span class='dashicons dashicons-yes'></span></span></small>";
			else {
				$url = wp_nonce_url( self_admin_url( 'plugins.php?action=activate&plugin=' . $plugin_file ),
					'activate-plugin_' . $plugin_file );
				return '<small><span style="color: orange; float: right;">off
				(<a style="color: rgba(30,140,190,.8); text-decoration: none;" href="' .
					$url . '">enable</a>)</span></small>';
			}
		}

		function common_url( $file ) {
			die( "Meow Apps: The function common_url( \$file ) needs to be overriden." );
			// Normally, this should be used:
			// return plugin_dir_url( __FILE__ ) . ( '\/common\/' . $file );
		}

		function meowapps_logo_url() {
			return $this->common_url( 'img/meowapps.png' );
		}

		function admin_meow_apps() {
			?>
			<div class="wrap meow-admin">
				<?php $this->display_title(); ?>
				<p>I am a <a target="_blank" href="https://meowapps.com">developer</a> and <a target="_blank" href="http://jordymeow.com">photographer</a> based in Japan. All my plugins are used <b>by myself</b>. Their goal is to make your WordPress <b>cleaner, faster and prettier</b>. My UI related plugins are made <b>for photographers</b> willing to spend more time taking photos than tweaking their websites. I keep my plugins <b>lightweight</b> and I regularly simplify them. The plugins are free but <b>some of the additional requested features are added into the Pro version</b>. Please check <a href='https://meowapps.com' target='_blank'>Meow Apps</a> for more information. Cheers!</p>
				<div class="section group">
					<div class="meow-box col span_1_of_2">
						<h3><span class="dashicons dashicons-camera"></span> UI PLUGINS</h3>
						<ul class="">
							<li><b>WP/LR Sync</b> <?php echo $this->check_install( 'wplr-sync' ) ?><br />
								Bring synchronization from Lightroom to WordPress.</li>
							<li><b>Meow Lightbox</b> <?php echo $this->check_install( 'meow-lightbox' ) ?><br />
								Lightbox with EXIF information nicely displayed.</li>
							<li><b>Meow Gallery</b> <?php echo $this->check_install( 'meow-gallery' ) ?><br />
								Simple gallery to make your photos look better (Masonry and others).</li>
							<li><b>Audio Story for Images</b> <?php echo $this->check_install( 'audio-story-images' ) ?><br />
								Add audio to your images.</li>
						</ul>
					</div>
					<div class="meow-box col span_1_of_2">
						<h3><span class="dashicons dashicons-admin-tools"></span> SYSTEM PLUGINS (Optimization, SEO)</h3>
						<ul class="">
							<li><b>Media File Renamer</b> <?php echo $this->check_install( 'media-file-renamer' ) ?><br />
								Nicer filenames and better SEO, automatically.</li>
							<li><b>Media Cleaner</b> <?php echo $this->check_install( 'media-cleaner' ) ?><br />
								Detect the files you are not using to clean your system.</li>
							<li><b>WP Retina 2x</b> <?php echo $this->check_install( 'wp-retina-2x' ) ?><br />
								Make your website perfect for retina devices.</li>
							<li><b>WP Category Permalink</b> <?php echo $this->check_install( 'wp-category-permalink' ) ?><br />
								Allows you to select a main category (or taxonomy) for nicer permalinks.</li>
						</ul>
					</div>
				</div>
			</div>
			<?php
		}

	}

}

?>
