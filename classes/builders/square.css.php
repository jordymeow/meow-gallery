<style>

	.mgl-square {
		display: <?= ($isPreview ? 'block' : 'none') ?>;
	}

	<?php
	$columns_in_percentage = "20%";

	switch($columns) {
		case 5:
			$columns_in_percentage = "20%";
			break;
		case 4:
			$columns_in_percentage = "25%";
			break;
		case 3:
			$columns_in_percentage = "33.33%";
			break;
		case 2:
			$columns_in_percentage = "50%";
			break;
		case 1:
			$columns_in_percentage = "100%";
			break;
	}
	?>

	<?= $class_id ?> {
		margin: <?= -1 * ( $gutter / 2 ) ?>px;
	}

	<?= $class_id ?> .mgl-item {
		width: <?= $columns_in_percentage ?>;
		padding-bottom: <?= $columns_in_percentage ?>;
	}

	<?php
	if($columns > 2) {
	?>

	@media screen and (max-width: 460px) {
		<?= $class_id ?> .mgl-item {
			width: 50%;
			padding-bottom: 50%;
		}
	}

	<?php 
	} 
	?>

	<?php
	if($columns > 1) {
	?>

	@media screen and (max-width: 360px) {
		<?= $class_id ?> .mgl-item {
			width: 100%;
			padding-bottom: 100%;
		}
	}

	<?php 
	} 
	?>

	<?= $class_id ?>.custom-gallery-class .mgl-item {
		padding-bottom: <?= ( str_replace('%','', $columns_in_percentage) / 1.5 ) ?>% !important;
	}

	<?= $class_id ?> .mgl-item .mgl-icon {
		padding: <?= $gutter/2 ?>px;
	}

	<?= $class_id ?> .mgl-item figcaption {
		padding: <?= $gutter/2 ?>px;
	}

</style>
