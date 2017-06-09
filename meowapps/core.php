<?php

class MeowAppsPro_MGL_Core {

  private $prefix = 'mgl';
  private $item = 'Meow Gallery Pro';
  private $admin = null;
  private $core = null;
  private $version = null;

  public function __construct( $prefix, $mainfile, $domain, $version, $core, $admin  ) {
    // Pro Admin (license, update system, etc...)
    $this->prefix = $prefix;
    $this->mainfile = $mainfile;
    $this->domain = $domain;
    $this->core = $core;
    $this->admin = $admin;
    $this->version = $version;
    new MeowApps_Admin_Pro( $prefix, $mainfile, $domain, $this->item, $version );

    // Overrides for the Pro
    add_filter( 'mgl_plugin_title', array( $this, 'plugin_title' ), 10, 1 );

    // Additional functions for Pro
    add_action( 'init', array( $this, 'init' ) );
  }

  function init() {
    if ( !is_admin() ) {
        wp_enqueue_script( 'mgl-masonry-infinite-loading', plugins_url( '/meowapps-infinite-loading.js', __FILE__ ),
        		array( 'jquery' ), $this->version, false );
    }
  }

  function plugin_title( $string ) {
      return $string . " (Pro)";
  }

}
