<style>

	.mgl-masonry {
		display: <?= ($isPreview ? 'block' : 'none') ?>;
	}

	<?= $class_id ?> {
		column-count: <?= $columns ?>;
		margin: <?= -1 * ( $gutter / 2 ) ?>px;
	}

	<?= $class_id ?> .mgl-item {
		padding: <?= $gutter / 2 ?>px;
	}

	<?= $class_id ?> figcaption {
		padding: <?= $gutter / 2 ?>px;
	}

	@media screen and (max-width: 800px) {
		<?= $class_id ?> {
			column-count: 2;
		}
	}

	@media screen and (max-width: 600px) {
		<?= $class_id ?> {
			column-count: 1;
		}
	}

</style>
