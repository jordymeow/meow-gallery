<figure class="mgl-item">
	<div class="mgl-icon">
		<?php if ( !$isPreview && $linkUrl ): ?>
			<a href="<?= $linkUrl ?>">
					<?= $imgSrc ?>
			</a>
		<?php else: ?>
			<?= $imgSrc ?>
		<?php endif; ?>
	</div>
	<?php if ( $caption ): ?>
	<figcaption class="mgl-caption">
			<p><?= $caption ?></p>
	</figcaption>
	<?php endif; ?>
</figure>
