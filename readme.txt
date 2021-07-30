=== Meow Gallery (+ Gallery Block) ===
Contributors: TigrouMeow, kywyz
Tags: gallery, masonry, justified, photo, gutenberg, image, block, lightroom
Requires at least: 5.0
Tested up to: 5.8.0
Requires PHP: 7.0
Stable tag: 4.1.5

Polished and beautiful gallery built for image lovers. Designed to work for WordPress 5 (Gutenberg Block) but also the standard Gallery Shortcode.

== Description ==

Polished and beautiful gallery built for image lovers. Designed to work for WordPress 5 (Gutenberg Block) and also the standard Gallery Shortcode. It's responsive, retina-friendly, has modern layouts, is blazing fast and tightly optimized. If you are interested in seeing the layouts in actions, click here: [Meow Gallery's Layouts](https://meowapps.com/meow-gallery-layouts/).

=== Features ===

Uses WordPress and Gutenberg naturally without hacking it, and more importantly, without imposing its own system and making your website dependent of it. It means you can use the Meow Gallery and one day switch back to the WordPress core rendering, or anything else. It works everywhere, easily, and fits naturally in WordPress. We will never blow it up with features that most users do not need.

[youtube https://youtu.be/ZyboZqZb9JQ]

=== Layouts ===

Shipped with the popular layouts such as Tiles, Masonry, Justified (like Flickr) and Square (like Instagram), only using CSS, so no more scripts to slow down your pages and the rendering. Demo [here](https://meowapps.com/meow-gallery-layouts/).

=== Compatibility ===

Since this gallery works with WordPress in a natural way, it should be compatible with any other plugins or themes (of course, it depends on how those have been exactly implemented). The following plugins might interest you.

* Lightbox: The choice of the lightbox is yours, so this gallery does not come with one. However, we made the [Meow Lightbox](https://wordpress.org/plugins/meow-lightbox/). It follows the same principles.
* Lightroom: It fully works with [WP/LR Sync](https://wordpress.org/plugins/wplr-sync/) and its attributes. If you wish to use your collections in Lightroom automatically, then, this is easy!
* External links: If you want to create links from your images to external URLs, we recommend you the [Gallery Custom Links](https://wordpress.org/plugins/gallery-custom-links/) plugin.
* Audio: You can also add sound, music or any kind of audio to an image. To do this, you can use [Audio Story Images](https://wordpress.org/plugins/audio-story-images/).

This plugin is SEO-friendly, so for example, the list of images will be added in your sitemap (Yoast SEO does this).

=== Pro Version ===

If you want to support us, you will get those additional features.

* Infinite/Lazy loading, for a faster page loading and a smoother experience for the user.
* The Carousel, a very cool and dynamic layout.
* The Map Layout, a different and really nice way to present your photos, or trips.
* Animations on your galleries.

You can find more information on this plugin on [Meow Apps: Meow Gallery](https://meowapps.com/meow-gallery/).

Languages: English.

== Changelog ==

= 4.1.5 (2021/07/30) =
* Fix: SQL Injection and Arbitrary Options Update fixes.

= 4.1.3 (2021/07/06) =
* Fix: Remove double images on map markers.
* Fix: Allow HTML such as links in the gallery items.
* Fix: Fixed double slash in the CSS and JSS urls. 
* Note: We need some love :) If you have a moment, please [review the Meow Gallery](https://wordpress.org/support/plugin/wplr-sync/reviews/?rate=5#new-post) :) That motivates us a lot. Thank you!

= 4.1.2 (2021/04/05) =
* Fix: Issue with the options relative to captions.

= 4.1.1 (2021/03/05) =
* Fix: Optimization of the core.

= 4.1.0 (2021/03/02) =
* Fix: Avoid compatibility issue if an old version of the common library is used.

= 4.0.9 (2021/03/01) =
* Fix: Preview issues with default layout.
* Fix: Attempt to fix compatibility with some SEO plugins.
* Fix: Row height calculation.
* Fix: Prevent the avoidLoneLastItem function fail.

= 4.0.8 (2021/02/14) =
* Fix: Users with sufficient roles can now edit blocks.
* Fix: Preview wasn't working fine when set on default.
* Fix: Issue with tiles CSS.

= 4.0.7 (2021/02/11) =
* Fix: Tiles Block in Gutenberg.
* Update: Use Google Maps SDK instead of Leaflet.
* Fix: MacOS Chrome issue with Tiles.
* Fix: Square layout issue.

= 4.0.6 (2021/02/06) =
* Update: New system for tiles.
* Update: Better responsive features (please check the settings).
* Fix: Issue with dots nav.
* Fix: Compatibility with Social Snap.

= 4.0.5 (2020/12/30) =
* Update: New and better admin.
* Update: Brand new carousel with no extra script.

= 4.0.4 (2020/11/20) =
* Add: Right click option.

= 4.0.3 (2020/09/06) =
* Update: Better compatibility with Meow Lightbox.
* Update: Updated the common library.

= 4.0.1 (2020/08/25) =
* Fix: Better loading of the JS and CSS files.
* Fix: Compatibility with WP/LR Sync.
* Update: Repository cleaning.

= 4.0.0 (2020/08/21) =
* Update: New UI in the admin, better and faster architecture.

= 3.5.9 =
* Fix: Remove dots when 3 or fewer images in Carousel.
* Fix: Cascade layout had an issue when vertical image was sandwiched between two horizontal ones.
* Update: With the Gutenberg Block, default should be... default, and not always 'Tiles'.
* Fix: Map doesn't crash anymore on first init in the editor.

= 3.5.8 =
* Fix: When the gallery is empty, automatically gets the images attached to the post.
* Update: Better i18n support for admin.

= 3.5.7 =
* Fix: Avoid an issue (when a gallery had an issue, all the other galleries weren't rendered).
* Update: Admin refresh.

= 3.5.4 =
* Fix: Default order issue.
* Fix: Run mglInitMaps only if there is a map on the page.

= 3.5.3 =
* Add: New layout for Pro: The Map Layout. Please try it and let us know what you think :)
* Fix: Admin Updater.
* Fix: Remove the call to gallery_written which was allowing theme to break the Meow Gallery. If this causes an issue, an option will be added instead.

= 3.5.0 =
* Add: The two new attributes 'orderby' and 'order'. You can learn more about them here: https://meowapps.com/meow-gallery-tutorial/#Gallery_Shortcode.
* Fix: A bunch of little fixes.

= 3.4.8 =
* Fix: Carousel dots.
* Fix: iiooi layout was 103%.

= 3.4.7 =
* Fix: Responsive for Tiles and Square layouts.

= 3.4.6 =
* Fix: Justified layout had... issues. Sorry about that!
* Add: Meow Gallery can now be converted into Gutenberg Gallery or (and from) Image Blocks.
* Update: Little optimization for the rendering.

= 3.4.4 =
* Fix: Return the WordPress default gallery if None is selected (and no layout).
* Update: Lazy doesn't use an 1x1 external image anymore, but a tiny inline SVG.

= 3.4.2 =
* Add: Support for custom classes.
* Fix: CSS issue for caption in some cases.
* Fix: There were issues when using Infinite with a specific Image Size.

= 3.4.0 =
* Fix: One (actually useless) argument was missing to the post_gallery filter.
* Update: Avoid having one photo left alone when using the Tiles Layout.

= 3.3.6 =
* Add: Possibility to switch between src-set and precise image sizes (thumbnail, medium, large, full).
* Fix: Namespace conflict with carousel.

= 3.3.4 =
* Fix: Added a new class to the images (might be important for other plugins).
* Fix: A few CSS glitches were corrected.
* Add: Container for the gallery and its inline CSS, to avoid breaking DOM parsers.
* Fix: Default CSS behavior/style is missing for some theme and was affecting the Justified layout.

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
