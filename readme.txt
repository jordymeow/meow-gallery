=== Meow Gallery Pro ===
Contributors: TigrouMeow, kywyz
Tags: gallery, masonry, justified, photo gallery, photo gallery, image gallery
Requires at least: 4.8
Tested up to: 5.1
Requires PHP: 7.0
Stable tag: 3.3.8

Gallery system built for photographers, by photographers. Clean, focused, evolves naturally. Uses the Masonry layout by default.

== Description ==

Gallery system built for photographers, by photographers. Clean, focused, evolves naturally. Uses the Tiles layout by default. More information on https://meowapps.com/meow-gallery/.

== Installation ==

1. Upload `meow-gallery` to the `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress

== Upgrade Notice ==

Replace all the files. Nothing else to do.

== Frequently Asked Questions ==

Nothing yet.

== Changelog ==

= 3.3.8 =
* Update: Avoid having one photo left alone when using the Tiles Layout.

= 3.3.6 =
* Add: Possibility to switch between src-set and precise image sizes (thumbnail, medium, large, full).
* Fix: Namespace conflict with carousel.

= 3.3.4 =
* Fix: Added a new class to the images (might be important for other plugins).
* Fix: A few CSS glitches were corrected.
* Add: Container for the gallery and its inline CSS, to avoid breaking DOM parsers.
* Fix: Default CSS behavior/style is missing for some theme and was affecting the Justified layout.
* Note: If you have a moment, please [review the Meow Gallery](https://wordpress.org/support/plugin/wplr-sync/reviews/?rate=5#new-post), that will help us tremendously :) Thank you!

= 3.3.0 =
* Add: Filter mgl_sort to build your own customized order. Check more about this [here](https://meowapps.com/meow-gallery-tutorial/#Order_Sort).
* Fix: JetPack Lazy.
* Fix: Visual glitches.

= 3.2.9 =
* Update: The Slider is now the Carousel (for Pro).
* Update: Larger sizes to avoid pixelization (if any issue, check the filters).
* Add: New filters (https://meowapps.com/meow-gallery-tutorial/#Customize_the_Meow_Gallery).
* Fix: Tiles layout issue.

= 3.2.4 =
* Fix: Compatibility with PHP... 5! :) (the plugin was made for PHP 7+).
* Fix: An invisible character was breaking the gallery attributes.
* Add: Added animations.

= 3.1.0 =
* Update: Added a filter which is also used by the standard WP Gallery for compatibility with other plugins.
* Fix: Compatibility with WordPress 5.0.
* Fix: The include attribute in the shortcode was not working.

= 3.0.6 =
* Add: Compatibility with WP/LR Sync. Collections from Lightroom are now accessible from the Meow Gallery Gutenberg Block.
* Add: LinkTo in the block.
* Add: Cascade layout.
* Info: Huge update for Gutenberg and WordPress 5. Try it :)

= 2.0.9 =
* Fix: For Gutenberg last update compatibility.
* Fix: Convert special characters in captions to HTML entities to avoid breaking standard HTML.
* Fix: Compatibility issue with WP/LR Sync.
* Update: Randomize identical layouts for Tiles.
* Fix: Function filemtime seems to fail on a few installs, so added alternative for it.

= 2.0.4 =
* Update: Enhanced Tiles layout.
* Update: Optimize CSS.
* Fix: Issue in the Slider constructor.

= 2.0.2 =
* Update: Complete recoding of the Meow Gallery! Harder, Better, Faster, Stronger.
* Add: Add Meow Gallery setting in the Gallery Block in Gutenberg.
* Fix: Gutenberg compatibility.

= 1.1.2 =
* Fix: Gutenberg compatibility.
* Fix: Issue with Infinite.
* Fix: Compatibility with PHP prior to 5.6.3.
* Update: Support for WP 4.9.

= 1.0.4 =
* Add: i18n.
* Fix: Better Justified layout.
* Fix: W3C validation.
* Fix: Compatibility with prehistoric themes.
* Fix: Gallery width.
* Fix: Issues with PHP < 7.

= 1.0.0 =
* Add: Optimization of the Infinite Loading.
* Fix: Now really uses the core WP Gallery 100% naturally.
* Fix: Many fixes.

= 0.2.5 =
* Add: Instagram Layout.
* Fix: Many little fixes.
* Add: Filter that allows changes in the images list (used by WP/LR Sync).

= 0.2.2 =
* Add: Justified layout.
* Fix: Many little fixes.

= 0.1.6 =
* Fix: Many fixes, many updates, revamped.
* Add: Pro -> Infinite loading, with options

= 0.0.3 =
* Tiny fixes.

= 0.0.1 =
* First release.

== Screenshots ==

1. Meow Gallery.
