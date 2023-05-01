<?php
/*
Plugin Name: Meow Gallery
Plugin URI: https://meowapps.com
Bitbucket Plugin URI: https://bitbucket.org/meowapps/meow-gallery/
Description: Gallery system built for photographers, by photographers.
Version: 4.3.8
Author: Jordy Meow
Author URI: https://meowapps.com
Text Domain: meow-gallery
Domain Path: /languages

Originally developed for two of my websites:
- Jordy Meow (https://offbeatjapan.org)
- Haikyo (https://haikyo.org)
*/

if ( !defined( 'MGL_VERSION' ) ) {
  define( 'MGL_VERSION', '4.3.8' );
  define( 'MGL_PREFIX', 'mgl' );
  define( 'MGL_DOMAIN', ' meow-gallery' );
  define( 'MGL_ENTRY', __FILE__ );
  define( 'MGL_PATH', dirname( __FILE__ ) );
  define( 'MGL_URL', plugin_dir_url( __FILE__ ) );
}

require_once( 'classes/init.php');

?>
