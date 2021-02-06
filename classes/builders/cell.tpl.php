<figure class="mgl-item"<?= $attributes ?>>
	<div class="mgl-icon">
		<div class="mgl-img-container">
			<?php if ( !$isPreview && $linkUrl ): ?>
				<a href="<?= $linkUrl ?>">
						<?= $imgSrc ?>
				</a>
			<?php else: ?>
				<?= $imgSrc ?>
			<?php endif; ?>
		</div>
	</div>
	<?php if ( $caption ): ?>
	<figcaption class="mgl-caption">
			<p><?= $caption ?></p>
	</figcaption>
	<?php endif; ?>
</figure>
