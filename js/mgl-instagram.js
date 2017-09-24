jQuery(document).ready(function($) {

    window.MglInstagram = function (parameters) {
        var gutter = parameters.gutter;
        var galleries_number = parameters.context.galleries_number;

        this.run = function($gallery) {

            $gallery.addClass('instagram');
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
                    $item.show();
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

            } else {
                Meowapps_instagram_infinite_loading(mgl.settings.infinite_loading, $gallery, gutter);
            }

            this.pro_callback = function() {
                if(typeof Meowapps_instagram_infinite_loading === "function") {
                    Meowapps_instagram_infinite_loading(mgl.settings.infinite_loading, $gallery);
                }
            };
        }
    }

});
