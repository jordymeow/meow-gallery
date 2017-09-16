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

                $gallery.find('.gallery-item').each(function() {
                    var $item = $(this);
                    var $image = $(this).find('img');
                    $image.attr('src', $image.attr('data-mgl-src'));
                    $image.attr('srcset', $image.attr('data-mgl-srcset'));
                    $item.show();
                });

                var loader_color = infinite_loading.loader.color;
                var loader_html = '<div class="mgl-infinite-spinner '+ loader_color +'"> \
                    <div class="bounce1"></div> \
                    <div class="bounce2"></div> \
                    <div class="bounce3"></div> \
                </div>';
                $gallery.after(loader_html);

                $('.mgl-infinite-spinner div').css("background-color", loader_color);

                $gallery.imagesLoaded(function() {
                    $gallery.justifiedGallery({
                        selector: 'figure, .gallery-item',
                        rowHeight: rowHeight,
                        margins: gutter,
                        border: 0,
                        waitThumbnailsLoad: true
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
