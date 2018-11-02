<style>

	.mgl-slider {
		display: <?= ($isPreview ? 'block' : 'none') ?>;
	}

	<?= $class_id ?> .mgl-slider-navigation {
		height: <?= $nav_height ?>px;
		display: <?= $nav_enabled ? 'block' : 'none' ?>;
	}

	<?= $class_id ?> .mgl-slider-preview {
		height: <?= $image_height; ?>px;
	}

	<?= $class_id ?> .mgl-item {
		margin-right: <?= $gutter; ?>px;
	}

</style>
