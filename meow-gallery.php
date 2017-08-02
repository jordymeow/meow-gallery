<?php
/*
Plugin Name: Meow Gallery Pro
Plugin URI: https://meowapps.com
Description: Gallery system built for photographers.
Version: 0.2.1
Author: Jordy Meow
Author URI: https://meowapps.com
Text Domain: meow-gallery
Domain Path: /languages

Originally developed for two of my websites:
- Jordy Meow (http://offbeatjapan.org)
- Haikyo (http://haikyo.org)
*/

global $mgl_version;
$mgl_version = '0.2.1';

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
