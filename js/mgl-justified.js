jQuery(document).ready(function($) {

    console.log('mgl-justified loaded');

    window.MglJustified = function (parameters) {
        var gutter = parameters.gutter;
        var rowHeight = parameters.rowHeight;
        var infinite_loading = parameters.infinite_loading;
        var galleries_number = parameters.context.galleries_number;

        this.run = function($gallery) {

            $gallery.addClass('justified');

            $gallery.find('figcaption').hide();

            if(!mgl.settings.infinite_loading.enabled || galleries_number > 1) {

                $gallery.find('.gallery-item').each(function() {
                    var $item = $(this);
                    var $image = $(this).find('img');
                    $image.attr('src', $image.attr('data-mgl-src'));
                    $image.attr('srcset', $image.attr('data-mgl-srcset'));
                    $item.addClass('not-loaded');
                });

                // Apply layout to first batch
                $gallery.imagesLoaded(function() {

                    $gallery.justifiedGallery({
                        selector: 'figure, .gallery-item',
                        rowHeight: mgl.settings.justified.row_height,
                        margins: mgl.settings.justified.gutter,
                        waitThumbnailsLoad: false,
                        border: 0
                    }).on('jg.complete', function() {
                        $gallery.find('.gallery-item.not-loaded').fadeIn().removeClass('not-loaded');
                    });

                });
            }
            else {
                console.log('mgl-justified: infinite loading enabled');
                console.log(Meowapps_justified_infinite_loading)
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
