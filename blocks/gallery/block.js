(function() {

	const { __ } = wp.i18n;
	const { registerBlockType, BlockControls, Editable, InspectorControls } = wp.blocks;
	const { createElement, createHigherOrderComponent } = wp.element;
	const { Button, SelectControl, ToggleControl, PanelBody } = wp.components;

	function hookRegisterBlockType(props) {
		if ('core/gallery' === props.name) {
			props.attributes.mglLayout = { type: 'string', default: 'default' };
		}
		return props;
	}

	// function blockListBlock( BlockListBlock ) {
	// 	const el = createElement;
	// 	console.log(BlockListBlock);
	// 	return function( props, setAttributes ) {
	// 		return el(
	// 			BlockListBlock,
	// 			props
	// 		);
	// 	}
	// }

	const blockEdit = createHigherOrderComponent(function blockEdit(BlockEdit) {

		return function( props, setAttributes ) {
			const attributes = props.attributes;
			const el = createElement;
			return el(
				wp.element.Fragment,
				{},
				el(
					BlockEdit,
					props
				),
				el(
					wp.editor.InspectorControls,
					{},
					el(
						PanelBody,
						{},
						el(
							'div',
							{ role: 'presentation', style: { marginTop: '-35px' } },
							el(
								'div',
								{ className: 'components-panel__body is-opened' },
								el(
									'h2',
									{ className: 'components-panel__body-title' },
									el(
										'button',
										{ type: 'button', 'aria-expanded': 'false', className: 'components-button components-panel__body-toggle' },
										'Meow Gallery Settings'
									)
								),
								el(
									SelectControl,
									{
										label: __( 'Layouts (Meow Gallery)', 'meow-gallery' ),
										value: attributes.mglLayout ? attributes.mglLayout : 'native',
										onChange: function (value) {
											props.setAttributes({ mglLayout: value });
										},
										options: [
											{ value: 'default', label: 'Default' },
											{ value: 'tiles', label: 'Tiles' },
											{ value: 'masonry', label: 'Masonry' },
											{ value: 'justified', label: 'Justified' },
											{ value: 'square', label: 'Square' },
											{ value: 'slider', label: 'Slider' },
											{ value: 'native', label: 'Native (Gutenberg)' }
										],
									}
								)
							)
						)
					)
				)
			);
		}
	}, 'blockEdit');

	function hookGetSaveElement(props, block, attributes) {
		if ('core/gallery' === block.name) {
			const mglLayout = attributes.mglLayout;
			if (mglLayout && mglLayout != 'native') {
				const ids = props.props.children.map(x => x.key);
				return createElement(
					'div', {}, '[gallery mgl-layout="' + mglLayout + '" ids="' + ids + '"]',
					props,
					"[/gallery]"
				);
			}
		}
		return props;
	}

	wp.hooks.addFilter(
		'editor.BlockEdit',
		'meow-gallery/layouts',
		blockEdit
	);

	// wp.hooks.addFilter(
	// 	'editor.BlockListBlock',
	// 	'meow-gallery/layouts',
	// 	blockListBlock
	// );

	wp.hooks.addFilter(
		'blocks.registerBlockType',
		'meow-gallery/layouts',
		hookRegisterBlockType
	);

	wp.hooks.addFilter(
		'blocks.getSaveElement',
		'meow-gallery/layouts',
		hookGetSaveElement
	);

})();
