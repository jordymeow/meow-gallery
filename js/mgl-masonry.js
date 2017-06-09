jQuery(document).ready(function($) {


    window.MglMasonry = function (parameters) {
        var gutter = parameters.gutter;
        var infinite_loading = parameters.infinite_loading;
        var galleries_number = parameters.context.galleries_number;

        var style_captions = function(gutter) {
            $('figcaption').each(function() {
                var $figcaption_parent = $(this).parent();
                $(this).css('width', ( $figcaption_parent.outerWidth() - 2*gutter ) + 'px');
                $(this).css('max-height', ($figcaption_parent.height()/2) + 'px');
            });
        };

        this.run = function() {
            // Adding layout class to the gallery
    		$('.gallery').addClass('masonry');

    		// Adding gutter
    		$('.gallery-item').css('padding', gutter + "px");

            // Styling captions
            $('figcaption').css({
                'left': gutter + 'px',
                'bottom': gutter + 'px'
            });

            $('figcaption').each(function() {
                var caption = $(this).text().replace(/^\s\s*/, '').replace(/\s\s*$/, '');
                if(caption != caption.substr(0,50)) {
                    var truncated_caption = caption.substr(0, 50) + "...";
                    $(this).html(truncated_caption);
                }
            });

            if(!mgl.settings.masonry.display_captions) {
                $('figcaption').hide();
            }

            $(window).on('resize', function() {
                style_captions(gutter);
            });


    		var $grid;

    		// NON INFINITE LOADING MODE ========
    		if(!infinite_loading.enabled || galleries_number > 1) {
    			// Creating $grid masonry object
    			$grid = $('.gallery').masonry({
    				percentPosition: true,
    				itemSelector: '.gallery-item',
    				transitionDuration: 0,
    			});

    	        // Calculate the layout immediately
    	        $grid.masonry('layout');

    	        // Everytime an image is loaded in the grid, recalculate the layout
    	        $grid.imagesLoaded().progress(function() {
    	            $grid.masonry('layout');
                    style_captions(gutter);
    	        });

                // Recalculate layout on resize
                $(window).on('resize', function() {
                    $grid.masonry('layout');
                    style_captions(gutter);
                });

    		}
    		// INFINITE LOADING MODE ============
    		else {
                if(typeof Meowapps_masonry_infinite_loading === "function") {
                    var meowapps_masonry_infinite_loading = new Meowapps_masonry_infinite_loading(infinite_loading);
                    meowapps_masonry_infinite_loading.listen();
                }
    		}

        };

        this.pro_callback = function() {
            if(typeof Meowapps_masonry_infinite_loading === "function") {
                var meowapps_masonry_infinite_loading = new Meowapps_masonry_infinite_loading(infinite_loading);
                meowapps_masonry_infinite_loading.listen();
            }
        };
    };

});
