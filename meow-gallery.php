<?php
/*
Plugin Name: Meow Gallery Pro
Plugin URI: https://meowapps.com
Description: Gallery system built for photographers, by photographers.
Version: 3.2.8
Author: Jordy Meow, Thomas Kim
Author URI: https://meowapps.com
Text Domain: meow-gallery
Domain Path: /languages

Originally developed for two of my websites:
- Jordy Meow (https://offbeatjapan.org)
- Haikyo (https://haikyo.org)
*/

if ( class_exists( 'Meow_Gallery_Core' ) ) {
  function mfrh_admin_notices() {
    echo '<div class="error"><p>Thanks for installing the Pro version of Meow Gallery :) However, the free version is still enabled. Please disable or uninstall it.</p></div>';
  }
  add_action( 'admin_notices', 'mfrh_admin_notices' );
  return;
}

global $mgl_version;
$mgl_version = '3.2.8';

// Admin
include "mgl_admin.php";
$mgl_admin = new Meow_MGL_Admin( 'mgl', __FILE__, 'meow-gallery' );

// Core
include "mgl_core.php";
$mgl_core = new Meow_Gallery_Core( $mgl_admin );

// Pro Core
require( 'meowapps/core.php' );
new MeowAppsPro_MGL_Core( 'mgl', __FILE__, 'meow-gallery',
  $mgl_version, $mgl_core, $mgl_admin );

?>
