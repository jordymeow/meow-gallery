<style>

	.mgl-tiles {
		display: none;
	}

	<?= $class_id ?> .mgl-row {
		height: <?= $row_height ?>px;
	}

	<?= $class_id ?> .mgl-box {
		padding: <?= $gutter / 2 ?>px;
	}

	@media screen and (max-width: 600px) {
		<?= $class_id ?> .mgl-row {
			height: 150px;
		}

		figcaption {
			display: none;
		}
	}

</style>
