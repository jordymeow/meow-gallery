jQuery(document).ready(function($) {
    var batch_size = 10;

    function squareInfiniteLoading($gallery, $items) {
        $items.slice(20).hide();
        var batch_number = 1;
        $(window).on('scroll', function() {
            var scrollTop = $(this).scrollTop();
            var gallery_bottom = $gallery.offset().top + $gallery.outerHeight();
            var loading_new_batch = false;
            if(scrollTop + $(window).outerHeight() > gallery_bottom && !loading_new_batch) {
                loading_new_batch = true;
                $items.slice(batch_number*20, (batch_number+1)*20).fadeIn('300');
                batch_number++;
                setTimeout(function() {
                    loading_new_batch = false;
                }, 1000);
            }
        });
    }

    function justifiedInfiniteLoading($gallery, $items) {
        $items.slice(20).hide();
        var batch_number = 1;
        $(window).on('scroll', function() {
            var scrollTop = $(this).scrollTop();
            var gallery_bottom = $gallery.offset().top + $gallery.outerHeight();
            var loading_new_batch = false;
            if(scrollTop + $(window).outerHeight() > gallery_bottom && !loading_new_batch) {
                loading_new_batch = true;
                $items.slice(batch_number*20, (batch_number+1)*20).fadeIn('300');
                batch_number++;
                setTimeout(function() {
                    loading_new_batch = false;
                }, 1000);
            }
        });
    }

    function tilesInfiniteLoading($gallery) {
        var $rows = $gallery.find('.mgl-row');
        $rows.slice(3).hide();
        var batch_number = 1;
        $(window).on('scroll', function() {
            var scrollTop = $(this).scrollTop();
            var gallery_bottom = $gallery.offset().top + $gallery.outerHeight();
            var loading_new_batch = false;
            if(scrollTop + $(window).outerHeight() > gallery_bottom && !loading_new_batch) {
                loading_new_batch = true;
                $rows.slice(batch_number*3, (batch_number+1)*3).fadeIn('300');
                batch_number++;
                setTimeout(function() {
                    loading_new_batch = false;
                }, 1000);
            }
        });
    }

    $('.mgl-gallery').each(function() {
        var $gallery = $(this);
        var $gallery_items = $gallery.find('.mgl-item');

        if($gallery.hasClass('mgl-square')) {
            squareInfiniteLoading($gallery, $gallery_items);
        }

        if($gallery.hasClass('mgl-justified')) {
            justifiedInfiniteLoading($gallery, $gallery_items);
        }

        if($gallery.hasClass('mgl-tiles')) {
            tilesInfiniteLoading($gallery);
        }
    });
});