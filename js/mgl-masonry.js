jQuery(document).ready(function($) {


    window.MglMasonry = function (parameters) {
        var gutter = parameters.gutter;
        var infinite_loading = parameters.infinite_loading;
        var galleries_number = parameters.context.galleries_number;

        var style_captions = function(gutter, $gallery) {
            $gallery.find('figcaption').each(function() {
                var $figcaption_parent = $(this).parent();
                $(this).css('width', ( $figcaption_parent.outerWidth() - 2*gutter ) + 'px');
                $(this).css('max-height', ($figcaption_parent.height()/2) + 'px');
            });
        };

        this.run = function($gallery) {
            // Adding layout class to the gallery
    		$gallery.addClass('masonry');

    		// Adding gutter
    		$gallery.find('.gallery-item').css('padding', gutter + "px");

            // Styling captions
            $gallery.find('figcaption').css({
                'left': gutter + 'px',
                'bottom': gutter + 'px'
            });

            $gallery.find('figcaption').each(function() {
                var caption = $(this).text().replace(/^\s\s*/, '').replace(/\s\s*$/, '');
                if(caption != caption.substr(0,50)) {
                    var truncated_caption = caption.substr(0, 50) + "...";
                    $(this).html(truncated_caption);
                }
            });

            if(!mgl.settings.masonry.display_captions) {
                $gallery.find('figcaption').hide();
            }

            $(window).on('resize', function() {
                style_captions(gutter, $gallery);
            });


    		var $grid;

    		// NON INFINITE LOADING MODE ========
    		if(!infinite_loading.enabled || galleries_number > 1) {

                $gallery.find('.gallery-item').each(function() {
                    var $item = $(this);
                    var $image = $(this).find('img');
                    $image.attr('src', $image.attr('data-mgl-src'));
                    $image.attr('srcset', $image.attr('data-mgl-srcset'));
                    $item.show();
                });

    			// Creating $grid masonry object
    			$grid = $gallery.masonry({
    				percentPosition: true,
                    columnWidth: $gallery.find('.gallery-item')[0],
    				itemSelector: '.gallery-item',
    				transitionDuration: 0,
    			});

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

    	        // Calculate the layout immediately
    	        $grid.masonry('layout');

    	        // Everytime an image is loaded in the grid, recalculate the layout
    	        $grid.imagesLoaded().progress(function() {
    	            $grid.masonry('layout');
                    style_captions(gutter, $gallery);
    	        });

                // After 5s, we recalculate layout
                setTimeout(function() {
                    $grid.masonry('layout');
                }, 5000);

                // Recalculate layout on resize
                $(window).on('resize', function() {
                    $grid.masonry('layout');
                    style_captions(gutter, $gallery);
                });

    		}
    		// INFINITE LOADING MODE ============
    		else {
                if(typeof Meowapps_masonry_infinite_loading === "function") {
                    Meowapps_masonry_infinite_loading(infinite_loading, $gallery, gutter);
                }
    		}



        };

        this.pro_callback = function() {
            if(typeof Meowapps_masonry_infinite_loading === "function") {
                Meowapps_masonry_infinite_loading(infinite_loading, $gallery);
            }
        };
    };

});
