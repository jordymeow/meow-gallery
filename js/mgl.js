jQuery(document).ready(function($) {

	var ratio = 1.2 / 3;

	function tiles_calculate_row() {
		$('.mgl-tiles').each(function() {
			var gallery_width = $(this).outerWidth();
			$(this).find('.mgl-row').each(function() {
				var height = gallery_width * ratio;
				$(this).height(height);
			});
		});
	}

	$(window).resize(function() {
		tiles_calculate_row();
	});

	tiles_calculate_row();

});