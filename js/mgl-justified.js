jQuery(document).ready(function($) {

    window.MglJustified = function (parameters) {
        var gutter = parameters.gutter;
        var rowHeight = parameters.rowHeight;
        var infinite_loading = parameters.infinite_loading;
        var galleries_number = parameters.context.galleries_number;

        this.run = function($gallery) {
            $gallery.addClass('justified');

            $gallery.find('figcaption').hide();

            if(!mgl.settings.infinite_loading.enabled || galleries_number > 1) {

                // Resizing the container to overflow the container and ignore outside padding
                var gallery_width = $gallery.outerWidth();
                $gallery.css('width', gallery_width + gutter*2 + 2 +'px');
                $gallery.css('margin-left', -gutter);

                $gallery.find('.gallery-item').each(function() {
                    var $item = $(this);
                    var $image = $(this).find('img');
                    $image.attr('src', $image.attr('data-mgl-src'));
                    $image.attr('srcset', $image.attr('data-mgl-srcset'));
                    $item.addClass('not-loaded');
                });

                $gallery.imagesLoaded(function() {
                    $gallery.justifiedGallery({
                        selector: 'figure, .gallery-item',
                        rowHeight: rowHeight,
                        margins: gutter,
                        border: 0,
                        waitThumbnailsLoad: true
                    });

                    $gallery.justifiedGallery().on('jg.complete', function(e) {
                        setTimeout(function() {
                            $gallery.find('.gallery-item').each(function(index) {
                                var $galleryItem = $(this);
                                setTimeout(function() {
                                    $galleryItem.fadeIn(500).removeClass('not-loaded');
                                }, 100*index);
                            });
                        }, 10);
                    });

                    $('.mgl-infinite-spinner').hide();
                });

            }
            else {
                if(typeof Meowapps_justified_infinite_loading === "function") {
                    Meowapps_justified_infinite_loading(mgl.settings.infinite_loading, $gallery);
                }
            }
        }

        this.pro_callback = function() {
            if(typeof Meowapps_justified_infinite_loading === "function") {
                Meowapps_justified_infinite_loading(mgl.settings.infinite_loading, $gallery);
            }
        };
    }

});
