
jQuery(document).ready(function($) {

    if($('.gallery').length > 0) {

            var loader_exists = false;

            function createLoader(infinite_loading) {
                if( !loader_exists && infinite_loading.loader.enabled ) {
                    var loader_color = infinite_loading.loader.color;
                    var loader_html = '<div id="mgl-infinite-spinner"> \
                        <div class="bounce1"></div> \
                        <div class="bounce2"></div> \
                        <div class="bounce3"></div> \
                    </div>';
                    $('.gallery').after(loader_html);
                    $('#mgl-infinite-spinner div').css("background-color", loader_color);
                    loader_exists = true;
                }
            }

            function removeLoader() {
                $('#mgl-infinite-spinner').remove();
                loader_exists = false;
            }

            window.Meowapps_masonry_infinite_loading = function (infinite_loading, $gallery, gutter) {

                var items_array = [];
                var batch_number = 0;
                var readyToLoad = false;
                var grid = "";

                // Resizing the container to overflow the container and ignore outside padding
                var gallery_width = $gallery.outerWidth();
                $gallery.css('width', gallery_width + gutter*2 + 2 +'px');
                $gallery.css('margin-left', -gutter);

                $(window).on('resize', function() {
                    $gallery.css('width', '100%');
                    var gallery_width = $gallery.outerWidth();
                    $gallery.css('width', gallery_width + gutter*2 + 2 +'px');
                    $gallery.css('margin-left', -gutter);
                });

                $gallery.find('.gallery-item').each(function() {
                    var $item = $(this);
                    items_array.push($item);
                    $item.remove();
                });

                createLoader(infinite_loading);

                items_array.slice(0,infinite_loading.batch_size).forEach(function($item) {
                    var $image = $item.find('img');
                    $image.attr('src', $image.attr('data-mgl-src'));
                    $image.attr('srcset', $image.attr('data-mgl-srcset'));
                    $item.addClass('not-loaded');
                    $item.show();
                    $gallery.append($item);
                });
                batch_number++;

                $gallery.imagesLoaded().progress(function(imgLoad, image) {
                    grid = $gallery.masonry({
                        percentPosition: true,
                        itemSelector: '.gallery-item',
                        transitionDuration: 0,
                    });
                    $(image.img).closest('.gallery-item').removeClass('not-loaded');
                });

                // Apply layout to first batch
                $gallery.imagesLoaded(function() {
                    grid = $gallery.masonry({
                        percentPosition: true,
                        itemSelector: '.gallery-item',
                        transitionDuration: 0,
                    });
                    removeLoader();

                    setTimeout(function() {
                        readyToLoad = true;
                    }, 10);
                });

                $(window).on('scroll', function() {
                    var container = $gallery;
                    var containerBottomOffset = container.offset().top + container.outerHeight();
                    if( readyToLoad && $gallery.find('.gallery-item').length != items_array.length ) {
                        var scrollTop = $(this).scrollTop();
                        var scrollTopBottom = scrollTop + $(this).outerHeight();

                        // If we are scrolling after the end of the gallery container
                        if(scrollTopBottom > containerBottomOffset - 200) {

                            readyToLoad = false;
                            createLoader(infinite_loading);

                            items_array.slice(batch_number*infinite_loading.batch_size,(batch_number+1)*infinite_loading.batch_size).forEach(function($item) {
                                var $image = $item.find('img');
                                $image.attr('src', $image.attr('data-mgl-src'));
                                $image.attr('srcset', $image.attr('data-mgl-srcset'));
                                $item.addClass('not-loaded');
                                $item.show();
                                $gallery.append( $item[ 0 ] );
                                grid.masonry( 'appended', $item[ 0 ] );
                            });
                            batch_number++;

                            $gallery.imagesLoaded().progress(function(imgLoad, image) {
                                $(image.img).closest('.gallery-item').removeClass('not-loaded');
                                $gallery.masonry('layout');
                            });

                            $gallery.imagesLoaded().progress(function(imgLoad, image) {
                                $gallery.masonry('layout');
                            });

                            $gallery.imagesLoaded(function() {
                                removeLoader();

                                setTimeout(function() {
                                    readyToLoad = true;
                                }, 10);
                            });

                        }
                    }

                });

            };

            if(typeof mglMasonry !== 'undefined') {
                mglMasonry.pro_callback();
            }

            window.Meowapps_justified_infinite_loading = function (infinite_loading, $gallery) {

                var items_array = [];
                var batch_number = 0;
                var readyToLoad = false;

                $gallery.find('.gallery-item').each(function() {
                    var $item = $(this);
                    items_array.push($item);
                    $item.remove();
                });

                createLoader(infinite_loading);

                items_array.slice(0,infinite_loading.batch_size).forEach(function($item) {
                    var $image = $item.find('img');
                    $image.attr('src', $image.attr('data-mgl-src'));
                    $image.attr('srcset', $image.attr('data-mgl-srcset'));
                    $item.show();
                    $gallery.append($item);
                });
                batch_number++;

                // Apply layout to first batch
                $gallery.imagesLoaded(function() {
                    $gallery.justifiedGallery({
                        selector: 'figure, .gallery-item',
                        rowHeight: mgl.settings.justified.row_height,
                        margins: mgl.settings.justified.gutter,
                        border: 0,
                        waitThumbnailsLoad: true
                    });

                    removeLoader();

                    setTimeout(function() {
                        readyToLoad = true;
                    }, 10);
                });

                $(window).on('scroll', function() {
                    var container = $gallery;
                    var containerBottomOffset = container.offset().top + container.outerHeight();
                    if(readyToLoad && $gallery.find('.gallery-item').length != items_array.length) {
                        var scrollTop = $(this).scrollTop();
                        var scrollTopBottom = scrollTop + $(this).outerHeight();

                        // If we are scrolling after the end of the gallery container
                        if(scrollTopBottom > containerBottomOffset - 200) {

                            readyToLoad = false;

                            items_array.slice(batch_number*infinite_loading.batch_size,(batch_number+1)*infinite_loading.batch_size).forEach(function($item) {
                                var $image = $item.find('img');
                                $image.attr('src', $image.attr('data-mgl-src'));
                                $image.attr('srcset', $image.attr('data-mgl-srcset'));
                                $item.show();
                                $gallery.append($item);
                            });
                            batch_number++;

                            createLoader(infinite_loading);

                            $gallery.imagesLoaded(function() {
                                $gallery.justifiedGallery('norewind',{
                                    selector: 'figure, .gallery-item',
                                    rowHeight: mgl.settings.justified.row_height,
                                    margins: mgl.settings.justified.gutter,
                                    border: 0,
                                    waitThumbnailsLoad: true
                                });

                                removeLoader();

                                setTimeout(function() {
                                    readyToLoad = true;
                                }, 10);
                            });

                        }
                    }

                });

            };

            if(typeof mglJustified !== 'undefined') {
                mglJustified.pro_callback();
            }

            window.Meowapps_instagram_infinite_loading = function (infinite_loading, $gallery, gutter) {

                var items_array = [];
                var batch_number = 0;
                var readyToLoad = false;

                function makeItInstagram() {
                    $gallery.find('.gallery-item').each(function() {
                        var $item = $(this);
                        var $image = $(this).find('img');
                        $item.show();
                        $image.attr('src', $image.attr('data-mgl-src'));
                        $image.attr('srcset', $image.attr('data-mgl-srcset'));
                    });

                    $gallery.find('figure.gallery-item').each(function() {
                        $(this).css('height', $(this).width());
                        var image_url = $(this).find('img').attr('src');
                        $(this).css('background-image', 'url('+image_url+')');
                        $(this).css('padding', gutter/2+'px');
                    });

                    $(window).on('resize', function() {
                        $gallery.find('figure.gallery-item').each(function() {
                            $(this).css('height', $(this).width());
                        });
                    });
                }

                $gallery.find('.gallery-item').each(function() {
                    var $item = $(this);
                    items_array.push($item);
                    $item.remove();
                });

                // Resizing the container to overflow the container and ignore outside padding
                var gallery_width = $gallery.outerWidth();
                $gallery.css('width', gallery_width + gutter*2 + 2 +'px');
                $gallery.css('margin-left', -gutter);

                items_array.slice(0,infinite_loading.batch_size).forEach(function($item) {
                    $gallery.append($item);
                });
                batch_number++;

                $gallery.imagesLoaded(function() {
                    makeItInstagram();

                    setTimeout(function() {
                        readyToLoad = true;
                    }, 10);
                });

                $(window).on('scroll', function() {
                    var container = $gallery;
                    var containerBottomOffset = container.offset().top + container.outerHeight();
                    if(readyToLoad && $gallery.find('.gallery-item').length != items_array.length) {
                        var scrollTop = $(this).scrollTop();
                        var scrollTopBottom = scrollTop + $(this).outerHeight();

                        createLoader(infinite_loading);

                        // If we are scrolling after the end of the gallery container
                        if(scrollTopBottom > containerBottomOffset - 200) {

                            items_array.slice(batch_number*infinite_loading.batch_size,(batch_number+1)*infinite_loading.batch_size).forEach(function($item) {
                                $gallery.append($item);
                            });
                            batch_number++;

                            $gallery.imagesLoaded(function() {
                                makeItInstagram();
                                removeLoader();

                                setTimeout(function() {
                                    readyToLoad = true;
                                }, 10);
                            });

                        }
                    }

                });

            };

            if(typeof mglInstagram !== 'undefined') {
                mglInstagram.pro_callback();
            }

    }

});
