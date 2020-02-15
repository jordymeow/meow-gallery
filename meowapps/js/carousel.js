function mglInitCarousels($) {

		$ = jQuery;
		$('.mgl-carousel').each(function () {

		var $gallery = $(this);

		// retrieve settings
		var gutter = parseInt( $gallery.attr('data-mgl-gutter') );
		var show_dots = parseInt( $gallery.attr('data-mgl-dot_nav') );
		var show_arrows = parseInt( $gallery.attr('data-mgl-arrow_nav') );
		$gallery.imagesLoaded(function() {

			$gallery.addClass('loaded');
			if ($(window).outerWidth() > 860) {
				var owl = $gallery.owlCarousel({
					items: 1,
					margin: gutter,
					center: true,
					loop: true,
					autoWidth: true,
					dots: show_dots
				});
			} else {
				$gallery.css('height', 'auto');
				var owl = $gallery.owlCarousel({
					items: 1,
					loop: true,
					autoHeight: true,
					dots: show_dots
				});
			}


			if(!show_dots) {
				$gallery.addClass('no-dots-nav');
			}

			if(show_arrows) {
				$gallery.append('<div class="customPrevBtn"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M217.9 256L345 129c9.4-9.4 9.4-24.6 0-33.9-9.4-9.4-24.6-9.3-34 0L167 239c-9.1 9.1-9.3 23.7-.7 33.1L310.9 417c4.7 4.7 10.9 7 17 7s12.3-2.3 17-7c9.4-9.4 9.4-24.6 0-33.9L217.9 256z"/></svg></div>');
				$gallery.append('<div class="customNextBtn"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M294.1 256L167 129c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.3 34 0L345 239c9.1 9.1 9.3 23.7.7 33.1L201.1 417c-4.7 4.7-10.9 7-17 7s-12.3-2.3-17-7c-9.4-9.4-9.4-24.6 0-33.9l127-127.1z"/></svg></div>');

				$gallery.find('.customNextBtn').click(function () {
					owl.trigger('next.owl.carousel');
				})

				$gallery.find('.customPrevBtn').click(function () {
					owl.trigger('prev.owl.carousel', [300]);
				})
			}

		})
	});
}

jQuery(document).ready(function($) {
	mglInitCarousels();
});