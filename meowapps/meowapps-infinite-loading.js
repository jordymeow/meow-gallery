
jQuery(document).ready(function($) {

    if($('.gallery').length > 0) {

            window.Meowapps_masonry_infinite_loading = function (infinite_loading) {
                this.listen = function() {

                    var gutter = mgl.settings.masonry.gutter;

                    var style_captions = function(gutter) {
                        $('figcaption').each(function() {
                            var $figcaption_parent = $(this).parent();
                            $(this).css('width', ( $figcaption_parent.outerWidth() - 2*gutter ) + 'px');
                            $(this).css('max-height', ($figcaption_parent.height()/2) + 'px');
                        });
                    };

                    // Adding animation class depending on setting
                    if(infinite_loading.animated) {
                        $('.gallery-item').addClass('not-loaded');
                    }

                    // Initialize items_array
                    var items_array = [];

                    // We run through all the items
                    $('.gallery-item').each(function(index, item) {
                        // We add them index
                        $(this).attr('data-mgl-index', index);
                        // We store them in the items_array
                        items_array.push( $(this).clone() );
                        // We delete them from the DOM
                        $(this).remove();
                    });

                    // NOW WE CAN START !

                    // Declaring some useful vars
                    var number_of_items = items_array.length;
                    var batch_size = infinite_loading.batch_size;
                    var last_item_displayed = 0;
                    var all_images_loaded = false;

                    // First of all, let's put the first items in the grid
                    for(var i=0; i < batch_size; i++) {
                        $('.gallery').append(items_array[i]);
                        last_item_displayed = i;
                    }

                    // Then let's masonryfy them
                    $grid = $('.gallery').masonry({
                        percentPosition: true,
                        itemSelector: '.gallery-item',
                        transitionDuration: 0,
                    });
                    $grid.imagesLoaded().progress(function(imgLoad, image) {
                        $grid.masonry('layout');
                        style_captions(gutter);
                        $(image.img).closest('.gallery-item').removeClass('not-loaded');
                    });
                    $grid.imagesLoaded(function() {
                        style_captions(gutter);
                        all_images_loaded = true;
                    });

                    // After 5s, we recalculate layout
                    setTimeout(function() {
                        $grid.masonry('layout');
                    }, 5000);

                    // Function dealing with the scrolling logic, callback() takes care of the rest
                    var infinite_scroll = function(container, callback) {
                        $(window).on('scroll', function() {
                            if(all_images_loaded && last_item_displayed <= number_of_items - 1) {
                                var containerBottomOffset = container.offset().top + container.outerHeight();
                                var scrollTop = $(this).scrollTop();
                                var scrollTopBottom = scrollTop + $(this).outerHeight();
                                // If we are scrolling after the end of the gallery container
                                if(scrollTopBottom > containerBottomOffset) {
                                    // Everything is ok to load more items, let's do it !
                                    callback();
                                }
                            }
                        });
                    };

                    infinite_scroll($('.gallery'), function() {
                        // We start to load new images
                        all_images_loaded = false;
                        // Loader
                        if(infinite_loading.loader.enabled === true) {
                            var loader_color = infinite_loading.loader.color;
                            var loader_html = '<div class="mgl-infinite-spinner '+ loader_color +'"> \
                                <div class="bounce1"></div> \
                                <div class="bounce2"></div> \
                                <div class="bounce3"></div> \
                            </div>';
                            $('.gallery').after(loader_html);
                            $('.mgl-infinite-spinner div').css("background-color", loader_color);
                        }
                        // Display 20 more items
                        var count = 0;
                        while(count < batch_size) {
                            $('.gallery').append(items_array[last_item_displayed + 1]);
                            //$grid.masonry('appended', items_array[last_item_displayed + 1]);
                            $grid.masonry('addItems', items_array[last_item_displayed + 1]);
                            last_item_displayed++;
                            count++;
                        }
                        $grid.imagesLoaded().progress(function(imgLoad, image) {
                            $grid.masonry('layout');
                            style_captions(gutter);
                            $(image.img).closest('.gallery-item').removeClass('not-loaded');
                        });
                        // When these new items are loaded, we say it
                        $grid.imagesLoaded(function() {
                            style_captions(gutter);
                            $('.mgl-infinite-spinner').remove();
                            all_images_loaded = true;
                        });
                    });
                };

            };

            if(typeof mglMasonry !== 'undefined') {
                mglMasonry.pro_callback();
            }

            window.Meowapps_justified_infinite_loading = function (infinite_loading) {

                // Initialize items_array
                var items_array = [];

                // We run through all the items
                $('.gallery-item').each(function(index, item) {
                    // We add them index
                    $(this).attr('data-mgl-index', index);
                    // We store them in the items_array
                    items_array.push( $(this).clone() );
                    // We delete them from the DOM
                    $(this).remove();
                });

                // Declaring some useful vars
                var number_of_items = items_array.length;
                var batch_size = infinite_loading.batch_size;
                var last_item_displayed = 0;
                var all_images_loaded = false;

                // First of all, let's put the first items in the grid
                for(var i=0; i < batch_size; i++) {
                    $('.gallery').append(items_array[i]);
                    last_item_displayed = i;
                }

                var readyToLoad = false;

                var loader_color = infinite_loading.loader.color;
                var loader_html = '<div class="mgl-infinite-spinner '+ loader_color +'"> \
                    <div class="bounce1"></div> \
                    <div class="bounce2"></div> \
                    <div class="bounce3"></div> \
                </div>';
                $('.gallery').after(loader_html);
                $('.mgl-infinite-spinner div').css("background-color", loader_color);

                // Apply layout to first batch
                $('.gallery').imagesLoaded(function() {
                    $('.gallery').justifiedGallery({
                        selector: 'figure, .gallery-item',
                        rowHeight: mgl.settings.justified.row_height,
                        margins: mgl.settings.justified.gutter,
                        waitThumbnailsLoad: true
                    });
                    $('.mgl-infinite-spinner').hide();

                    readyToLoad = true;
                });

                // FROM NOW, We listen the scroll !

                $(window).on('scroll', function() {
                    if(readyToLoad) {
                        var container = $('.gallery');
                        var containerBottomOffset = container.offset().top + container.outerHeight();
                        var scrollTop = $(this).scrollTop();
                        var scrollTopBottom = scrollTop + $(this).outerHeight();

                        // If we are scrolling after the end of the gallery container
                        if(scrollTopBottom > containerBottomOffset - 200 && !all_images_loaded) {
                            readyToLoad = false;

                            // Everything is ok to load more items, let's do it !
                            // We append the new items
                            var count = 0;
                            while(count < batch_size) {
                                $('.gallery').append(items_array[last_item_displayed + 1]);
                                last_item_displayed++;
                                if(last_item_displayed > items_array.length) {
                                    all_images_loaded = true;
                                }
                                count++;
                            }

                            $('.mgl-infinite-spinner').show();

                            // Apply layout to first batch
                            setTimeout(function() {
                                $('.gallery').imagesLoaded(function() {
                                    $('.gallery').justifiedGallery('norewind',{
                                        selector: 'figure, .gallery-item',
                                        rowHeight: mgl.settings.justified.row_height,
                                        margins: mgl.settings.justified.gutter,
                                        waitThumbnailsLoad: true
                                    });

                                    $('.mgl-infinite-spinner').hide();
                                    readyToLoad = true;
                                });
                            });
                        }
                    }
                });
            };

            if(typeof mglJustified !== 'undefined') {
                mglJustified.pro_callback();
            }
    }

});
