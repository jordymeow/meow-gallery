jQuery(document).ready(function($) {

    $('.mgl-gallery.mgl-slider').each(function(index) {
        var $gallery = $(this);
        $gallery.attr('gallery-index', index);
        $gallery.before('<div class="mgl-slider-preview" gallery-index="'+index+'"><div class="mgl-slider-preview-image"></div></div>');
        $slider_preview = $('.mgl-slider-preview[gallery-index="'+index+'"]');
        $slider_preview.prepend('<div class="nav-prev"><span class="chevron left"></span></div><div class="nav-next"><span class="chevron right"></span></div>')
        var $items = $gallery.find('.mgl-item');
        var current_index = 0;
        var number_of_images = $items.length;
        $items.each(function(image_index){
            var $item = $(this);
            $item.attr('gallery-index', index);
            $item.attr('image-index', image_index);
        });

        function changeCurrentImage(gallery_index, image_index) {
            var $item = $('.mgl-item[gallery-index='+gallery_index+'][image-index='+image_index+']');
            var image = $item.find('img').clone();
            $items.removeClass('active');
            $item.addClass('active');
            $('.mgl-slider-preview[gallery-index='+gallery_index+'] .mgl-slider-preview-image').html(image);
            current_index = image_index;
            // Slide the navigation
            console.log($item.scrollLeft())
            var scrollLeft = $item.position().left + $gallery.scrollLeft();
            $gallery.animate({scrollLeft: scrollLeft}, 200);
        }

        // Initialisation
        var $first_item = $('.mgl-item[gallery-index='+index+'][image-index='+current_index+']');
        var image = $first_item.find('img').clone();
        $items.removeClass('active');
        $first_item.addClass('active');
        $('.mgl-slider-preview[gallery-index='+index+'] .mgl-slider-preview-image').html(image);

        $items.on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            var $item = $(this);
            current_index = parseInt( $item.attr('image-index') );
            $items.removeClass('active');
            $item.addClass('active');
            var image = $(this).find('img').clone();
            var gallery_index = image.attr('gallery-index');
            $('.mgl-slider-preview[gallery-index='+index+'] .mgl-slider-preview-image').html(image)
        });

        $(".mgl-slider-preview .nav-prev").on("click", function() {
            if(current_index == 0) {
                var prev_index = number_of_images - 1;
            } else {
                var prev_index = current_index - 1;
            }
            changeCurrentImage(index, prev_index);
            /*
            var $item = $('.mgl-item[gallery-index='+index+'][image-index='+prev_index+']');
            var image = $item.find('img').clone();
            $items.removeClass('active');
            $item.addClass('active');
            $('.mgl-slider-preview[gallery-index='+index+'] .mgl-slider-preview-image').html(image);
            current_index = prev_index;
            */
        });

        $(".mgl-slider-preview .nav-next").on("click", function() {
            if(current_index == number_of_images - 1) {
                var next_index = 0;
            } else {
                var next_index = current_index + 1;
            }
            changeCurrentImage(index, next_index);
            /*
            var $item = $('.mgl-item[gallery-index='+index+'][image-index='+next_index+']');
            var image = $item.find('img').clone();
            $items.removeClass('active');
            $item.addClass('active');
            $('.mgl-slider-preview[gallery-index='+index+'] .mgl-slider-preview-image').html(image);
            current_index = next_index;
            */
        });

        $(document).keydown(function(e) {
            switch(e.which) {
                case 37: // left
                    if(current_index == 0) {
                        var prev_index = number_of_images - 1;
                    } else {
                        var prev_index = current_index - 1;
                    }
                    changeCurrentImage(index, prev_index);
                break;
        
                case 39: // right
                    if(current_index == number_of_images - 1) {
                        var next_index = 0;
                    } else {
                        var next_index = current_index + 1;
                    }
                    changeCurrentImage(index, next_index);
                break;
        
                default: return; // exit this handler for other keys
            }
            e.preventDefault(); // prevent the default action (scroll / move caret)
        });
    });

});