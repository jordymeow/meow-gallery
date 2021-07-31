<figure class="mgl-item"<?php echo $attributes ?>>
	<div class="mgl-icon">
		<div class="mgl-img-container">
			<?php if ( !$isPreview && $linkUrl ): ?>
				<a href="<?php echo esc_url( $linkUrl ) ?>">
						<?php echo wp_kses_post( $imgSrc ) ?>
				</a>
			<?php else: ?>
				<?php echo wp_kses_post( $imgSrc ) ?>
			<?php endif; ?>
		</div>
	</div>
	<?php if ( $caption ): ?>
	<figcaption class="mgl-caption">
			<p><?php echo wp_kses_post( $caption ) ?></p>
	</figcaption>
	<?php endif; ?>
</figure>
