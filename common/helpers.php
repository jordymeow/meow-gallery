<?php

if ( !class_exists( 'MeowCommon_Helpers' ) ) {

	class MeowCommon_Helpers {
	
		static function is_divi_builder() {
			return isset( $_GET['et_fb'] ) && $_GET['et_fb'] === '1';
		}

		static function is_asynchronous_request() {
			return self::is_ajax_request() || self::is_woocommerce_ajax_request() || self::is_rest();
		}

		static function is_ajax_request() {
			return wp_doing_ajax();
		}

		static function is_woocommerce_ajax_request() {
			return !empty( $_GET['wc-ajax'] );
		}

		/**
		 * Checks if the current request is a WP REST API request.
		 *
		 * Case #1: After WP_REST_Request initialisation
		 * Case #2: Support "plain" permalink settings
		 * Case #3: It can happen that WP_Rewrite is not yet initialized,
		 *          so do this (wp-settings.php)
		 * Case #4: URL Path begins with wp-json/ (your REST prefix)
		 *          Also supports WP installations in subfolders
		 *
		 * @returns boolean
		 * @author matzeeable
		 */

		static function is_rest() {
			$prefix = rest_get_url_prefix( );
			if ( defined('REST_REQUEST') && REST_REQUEST || isset( $_GET['rest_route'] ) // (#2)
							&& strpos( trim( $_GET['rest_route'], '\\/' ), $prefix , 0 ) === 0)
					return true;
			// (#3)
			global $wp_rewrite;
			if ($wp_rewrite === null) $wp_rewrite = new WP_Rewrite();
				
			// (#4)
			$rest_url = wp_parse_url( trailingslashit( rest_url( ) ) );
			$current_url = wp_parse_url( add_query_arg( array( ) ) );
			if ( !$rest_url || !$current_url )
				return false;
			if ( !empty( $current_url['path'] ) && !empty( $rest_url['path'] ) ) {
				return strpos( $current_url['path'], $rest_url['path'], 0 ) === 0;
			}
			return false;
		}

		static function test_error( $error = 'timeout', $diceSides = 1 ) {
			if ( rand( 1, $diceSides ) === 1 ) {
				if ( $error === 'timeout' ) {
					header("HTTP/1.0 408 Request Timeout");
					die();
				}
				else {
					trigger_error( "Error", E_USER_ERROR);
				}
			}
		}
	}

	if ( MeowCommon_Helpers::is_rest() ) {
		ini_set( 'display_errors', 0 );
	}
}

?>