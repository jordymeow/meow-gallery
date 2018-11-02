<style>

	.mgl-tiles {
		display: <?= ($isPreview ? 'block' : 'none') ?>;
	}

	<?= $class_id ?> {
		margin: <?= -1 * ( $gutter / 2 ) ?>px;
	}

	<?= $class_id ?> .mgl-box {
		padding: <?= $gutter / 2 ?>px;
	}

	@media screen and (max-width: 600px) {
		<?= $class_id ?> .mgl-row {
			height: 100px;
		}

		figcaption {
			display: none;
		}
	}

</style>
