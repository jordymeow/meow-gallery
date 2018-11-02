jQuery(document).ready(function($) {

    function Slider($gallery, index) { 
        this.current_item = 0;
        this.$items = false;
        this.number_of_images = false;
        this.$slider_preview = false;

        this.updateVariables = function() {
            this.$items = $gallery.find('.mgl-item');
            this.number_of_images = this.$items.length;
            this.$slider_preview = $gallery.find('.mgl-slider-preview');
        }

        this.addItemsAttributes = function() {
            this.$items.each(function (image_index) {
                var $item = $(this);
                $item.attr('gallery-index', index);
                $item.attr('image-index', image_index);
            }); 
        }

        this.init = function() {
            var $first_item = this.$items.eq(0);
            var image = $first_item.find('img').clone();
            this.$items.removeClass('active');
            $first_item.addClass('active');
            this.$slider_preview.find('.mgl-slider-preview-image').html(image);   
        }

        this.changeCurrentImage = function(index) {
            var $item = this.$items.eq(index);
            var image = $item.find('img').clone();
            this.$items.removeClass('active');
            $item.addClass('active');
            this.$slider_preview.find('.mgl-slider-preview-image').html(image);   
            this.current_item = index;
            // Slide the navigation
            var scrollLeft = $item.position().left + $('.mgl-slider-navigation').scrollLeft();
            $('.mgl-slider-navigation').animate({ scrollLeft: scrollLeft }, 200);
        }

        this.addListeners = function() {
            var Slider = this;

            // Click
            this.$items.on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var $item = $(this);
                clicked_index = Slider.$items.index($item);
                Slider.changeCurrentImage(clicked_index);
            });

            // Arrows - Previous
            this.$slider_preview.find(".nav-prev").on("click", function () {
                if (Slider.current_item == 0) {
                    var prev_index = Slider.number_of_images - 1;
                } else {
                    var prev_index = Slider.current_item - 1;
                }
                Slider.changeCurrentImage(prev_index);
            });

            this.$slider_preview.find(".nav-next").on("click", function () {
                if (Slider.current_item == Slider.number_of_images - 1) {
                    var next_index = 0;
                } else {
                    var next_index = Slider.current_item + 1;
                }
                Slider.changeCurrentImage(next_index);
            });
        }
    }

    window.mglInitSliders = function () {
        $('.mgl-gallery.mgl-slider').each(function (index) {
            var slider = new Slider($(this), index);
            slider.updateVariables();
            slider.addItemsAttributes();
            slider.init();
            slider.addListeners();
        });
    }

    window.mglInitSliders();

});