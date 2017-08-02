jQuery(document).ready(function($) {

    window.MglJustified = function (parameters) {
        var gutter = parameters.gutter;
        var rowHeight = parameters.rowHeight;
        var infinite_loading = parameters.infinite_loading;
        var galleries_number = parameters.context.galleries_number;

        this.run = function() {
            $('.gallery').addClass('justified');

            $('figcaption').hide();

            if(!mgl.settings.infinite_loading.enabled || galleries_number > 1) {
                $('.gallery').justifiedGallery({
                    selector: 'figure, .gallery-item',
                    rowHeight: rowHeight,
                    margins: gutter,
                    waitThumbnailsLoad: false
                });
            }
            else {
                if(typeof Meowapps_justified_infinite_loading === "function") {
                    Meowapps_justified_infinite_loading(mgl.settings.infinite_loading);
                }
            }
        }

        this.pro_callback = function() {
            if(typeof Meowapps_justified_infinite_loading === "function") {
                Meowapps_justified_infinite_loading(mgl.settings.infinite_loading);
            }
        };
    }

});
