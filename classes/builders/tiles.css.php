<style>

	.mgl-tiles {
		display: <?= ($isPreview ? 'block' : 'none') ?>;
	}

	<?= $class_id ?> {
		margin: <?= -1 * ( $gutter['desktop'] / 2 ) ?>px;
		width: calc(100% + <?= $gutter['desktop'] ?>px);
	}

	<?= $class_id ?> .mgl-box {
		padding: <?= $gutter['desktop'] / 2 ?>px;
	}

	@media screen and (max-width: 768px) {
		<?= $class_id ?> {
			margin: <?= -1 * ( $gutter['tablet'] / 2 ) ?>px;
			width: calc(100% + <?= $gutter['tablet'] ?>px);
		}

		<?= $class_id ?> .mgl-box {
			padding: <?= $gutter['tablet'] / 2 ?>px;
		}	
	}

	@media screen and (max-width: 460px) {
		<?= $class_id ?> {
			margin: <?= -1 * ( $gutter['mobile'] / 2 ) ?>px;
			width: calc(100% + <?= $gutter['mobile'] ?>px);
		}

		<?= $class_id ?> .mgl-box {
			padding: <?= $gutter['mobile'] / 2 ?>px;
		}	
	}

</style>
