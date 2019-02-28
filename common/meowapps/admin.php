<?php

/*
	Used by the plugins downloaded on Meow Apps.
	- Instance should be created by the Pro section of the plugin (meowapps/core.php).
*/

if ( !class_exists( 'MeowApps_Admin_Pro' ) ) {

	class MeowApps_Admin_Pro {

		public $license = null;

		public $prefix; 		// prefix used for actions, filters (mfrh)
		public $mainfile; 	// plugin main file (media-file-renamer.php)
		public $domain; 		// domain used for translation (media-file-renamer)
		public $item; 	    // name of the Pro plugin (Media File Renamer Pro)
		public $version; 	  // version of theplugin (Media File Renamer Pro)

		public function __construct( $prefix, $mainfile, $domain, $item, $version ) {

			// Variables
			$this->prefix = $prefix;
			$this->mainfile = $mainfile;
			$this->domain = $domain;
			$this->item = $item;
			$this->version = $version;

			// Update system config
			if( !class_exists( 'EDD_SL_Plugin_Updater' ) )
				include( dirname( __FILE__ ) . '/updater.php' );
			$this->is_registered();
			$license_key = $this->license && isset( $this->license['key'] ) ? $this->license['key'] : "";
			$edd_updater = new EDD_SL_Plugin_Updater(
				( get_option( 'force_sslverify', false ) ? 'https' : 'http' ) . '://store.meowapps.com', $mainfile,
				array(
					'version' => $version,
					'license' => $license_key,
					'item_name' => $item,
					'wp_override' => true,
					'author' => 'Jordy Meow',
					'url' => strtolower( home_url() ),
					'beta' => false
				)
			);

			// Override filters and actions to add Pro in the Admin
			add_filter( $this->prefix . '_meowapps_license_input', array( $this, 'license_input' ), 10, 2 );
			add_filter( $this->prefix . '_meowapps_is_registered', array( $this, 'is_registered' ), 10 );
			if ( is_admin() ) {
				add_action( 'add_option_' . $prefix . '_pro_serial', array( $this, 'serial_updated' ), 10, 2 );
				add_action( 'update_option_' . $prefix . '_pro_serial', array( $this, 'serial_updated' ), 10, 2 );
				add_action( 'admin_menu', array( $this, 'admin_menu_for_serialkey' ) );
				add_filter( 'plugin_row_meta', array( $this, 'custom_plugin_row_meta' ), 10, 2 );
				if ( isset( $_POST['retry-validation-' . $this->prefix] ) )
					add_filter( 'admin_init', array( $this, 'retry_validation' ) );
			}
		}

		function custom_plugin_row_meta( $links, $file ) {
			$path = pathinfo( $file );
			$pathName = basename( $path['dirname'] );
			$thisPath = pathinfo( $this->mainfile );
			$thisPathName = basename( $thisPath['dirname'] );
			if ( strpos( $pathName, $thisPathName ) !== false ) {
				$new_links = array(
					'pro' =>
						'<b>Pro Version (' . ( $this->is_registered() ? 'active' :
						( 'inactive, add your key in the <a href="admin.php?page=' . $this->prefix . '_settings-menu">settings</a>' )
						) . ')</b>'
				);
				$links = array_merge( $new_links, $links );
			}
			return $links;
		}

		function retry_validation() {
			if ( isset( $_POST[$this->prefix . '_pro_serial'] ) ) {
				$serial = $_POST[$this->prefix . '_pro_serial'];
				$this->validate_pro( $serial );
			}
		}

		function is_registered( $force = false ) {
			if ( !$force && !empty( $this->license ) )
				return empty( $this->license['issue'] );
			$this->license = get_option( $this->prefix . '_license', "" );
			if ( empty( $this->license ) || !empty( $this->license['issue'] ) )
				return false;
			if ( $this->license['expires'] == "lifetime" )
				return true;
			$datediff = strtotime( $this->license['expires'] ) - time();
			$days = floor( $datediff / ( 60 * 60 * 24 ) );
			if ( $days < 0 )
				$this->validate_pro( $this->license['key'] );
			return true;
		}

		function validate_pro( $subscr_id ) {
			$prefix = $this->prefix;
			delete_option( $prefix . '_license', "" );
			if ( empty( $subscr_id ) )
				return false;
			$url = ( get_option( 'force_sslverify', false ) ? 'https' : 'http' ) .
				'://store.meowapps.com/?edd_action=activate_license' .
				'&item_name=' . urlencode( $this->item ) .
				'&license=' . $subscr_id . '&url=' . strtolower( home_url() ) . '&cache=' . bin2hex( openssl_random_pseudo_bytes( 4 ) );
			$response = wp_remote_get( $url, array(
					'user-agent' => "MeowApps",
					'sslverify' => get_option( 'force_sslverify', false ),
					'timeout' => 45,
					'method' => 'GET'
				)
			);
			$body = is_array( $response ) ? $response['body'] : null;
			$post = @json_decode( $body );
			$status = null;
			$license = null;
			$expires = null;
			if ( !$post || ( property_exists( $post, 'code' ) ) ) {
				$status = __( "There was an error while validating the serial.<br />Please contact <a target='_blank' href='https://meowapps.com/contact/'>Meow Apps</a> and mention the following log: <br /><ul>" );
				$status .= "<li>Server IP: <b>" . gethostbyname( $_SERVER['SERVER_NAME'] ) . "</b></li>";
				$status .= "<li>Google GET: ";
				$r = wp_remote_get( 'http://google.com' );
				$status .= is_wp_error( $r ) ? print_r( $r, true ) : 'OK';
				$status .= "</li><li>MeowApps GET: ";
				$r = wp_remote_get( 'http://meowapps.com' );
				$status .= is_wp_error( $r ) ? print_r( $r, true ) : 'OK';
				$status .= "</li><li>MeowApps STORE:<br /><br />";
				$status .= "REQUEST: $url<br /><br />";
				$status .= "RESPONSE: ";
				$status .= print_r( $response, true );
				$status .= "</li></ul>";
				error_log( print_r( $response, true ) );
			}
			else if ( $post->license !== "valid" ) {
				if ( $post->error == "no_activations_left" )
					$status = __( "Your license key has reached its activation limit <a target='_blank' href='$url'>({$post->error})</a>." );
				else if ( $post->error == "expired" )
					$status = __( "Your license key expired <a target='_blank' href='$url'>({$post->error})</a>." );
				else {
					$status = "There is a problem with your subscription <a target='_blank' href='$url'>({$post->error})</a>.";
				}
			}
			else {
				$license = $post->license;
				$expires = $post->expires;
				delete_option( '_site_transient_update_plugins' );
			}
			update_option( $prefix . '_license', array(
				'key' => $subscr_id,
				'issue' => $status,
				'expires' => $expires,
				'license' => $license ) );
			return $this->is_registered( true );
		}

		/***************************************************************************
			Admin Menu
		***************************************************************************/

		function admin_menu_for_serialkey() {
			// SUBMENU > Settings > Pro Serial
			add_settings_section( $this->prefix . '_settings_serialkey', null, null, $this->prefix . '_settings_serialkey-menu' );
			add_settings_field( $this->prefix . '_pro_serial', "Serial Key",
				array( $this, 'admin_serialkey_callback' ),
				$this->prefix . '_settings_serialkey-menu', $this->prefix . '_settings_serialkey' );
			register_setting( $this->prefix . '_settings_serialkey', $this->prefix . '_pro_serial' );
		}

		function admin_serialkey_callback( $args ) {
			$value = get_option( $this->prefix . '_pro_serial', null );
			$hide = get_option( 'meowapps_hide_license', false );
			$html = '<input style="width: 100%;" type="' . ( $hide ? 'password' : 'text' ) . '" id="' . $this->prefix . '_pro_serial" name="' .
				$this->prefix . '_pro_serial" value="' . $value . '" />';
			echo $html;
		}

		function license_input( $html, $url ) {
			echo '<form method="post" action="options.php">';
			if ( isset( $this->license['issue'] ) ) {
				echo '<div class="pro_info ' . ( $this->is_registered() ? 'enabled' : 'disabled' ) . '">';
				echo $this->license['issue'];
				echo '</div>';
			}
			settings_fields( $this->prefix . '_settings_serialkey' );
			do_settings_sections( $this->prefix . '_settings_serialkey-menu' );
			if ( !$this->is_registered() ) {
				echo '<small class="description">Insert your serial key above. If you don\'t have one yet, you can get one <a target="_blank" href="' . $url . '">here</a>. If there was an error during the validation, try the <i>Retry to validate</i> button.</small>';
			}
			else {
				if ( $this->license['expires'] == 'lifetime' ) {
					echo "This license never expires.";
				}
				else {
					$datediff = strtotime( $this->license['expires'] ) - time();
					$days = floor( $datediff / ( 60 * 60 * 24 ) );
					echo "This license expires in $days days.";
				}
			}
			echo '<p class="submit">';
			if ( !$this->is_registered() ) {
				submit_button( "Retry to validate", 'delete', 'retry-validation-' . $this->prefix,
					false, array( 'style' => 'margin-right: 5px;' ) );
			}
			submit_button( "Save Changes", 'primary', 'submit', false );
			echo '</p></form>';
		}

		function serial_updated( $old_value, $new_value ) {
			$this->validate_pro( $new_value );
		}

	}

}

?>
