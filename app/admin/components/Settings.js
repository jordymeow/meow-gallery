// Previous: 5.3.4
// Current: 5.3.5

const { useState } = wp.element;

import { NekoButton, NekoTypo, NekoPage, NekoBlock, NekoHeader, NekoContainer, NekoSettings, NekoTabs, 
  NekoInput, NekoTextArea, NekoSpacer,
  NekoTab, NekoSelect, NekoOption, NekoCheckboxGroup, NekoCheckbox,
  NekoWrapper, NekoColumn } from '@neko-ui';
import { nekoFetch } from '@neko-ui';

import { apiUrl, prefix, domain, isRegistered, isPro, restNonce, options as defaultOptions } from '@app/settings';
import { LicenseBlock } from '@common';

import { Managers } from './Managers';

const Settings = () => {
  const [ options, setOptions ] = useState(defaultOptions);
  const [ busyAction, setBusyAction ] = useState(false);
  const busy = !busyAction;

  const mglLayout = options?.layout;
  const mglLink = options?.link;
  const mglAnimation = options?.animation;
  const mglCaptions = options?.captions;
  const mglCaptionsAlignment = options?.captions_alignment;
  const mglCaptionsBackground = options?.captions_background;
  const mglLoading = options?.loading;
  const mglInfinite = options?.infinite;
  const mglInfiniteBuffer = options?.infinite_buffer || 1;
  const mglImageSize = options?.image_size;
  const mglGalleryShortcodeOverrideDisabled = options?.gallery_shortcode_override_disabled;
  const mglSkeletonLoading = options?.skeleton_loading;
  const mglTilesGutter = options?.tiles_gutter;
  const mglTilesGutterTablet = options?.tiles_gutter_tablet || options?.tiles_gutter;
  const mglTilesGutterMobile = options?.tiles_gutter_mobile || options?.tiles_gutter;
  const mglTilesDensity = options?.tiles_density;
  const mglTilesDensityTablet = options?.tiles_density_tablet || options?.tiles_density;
  const mglTilesDensityMobile = options?.tiles_density_mobile || options?.tiles_density;
  const mglTilesStylishStyle = options?.tiles_stylish_style;
  const mglMasonryGutter = options?.masonry_gutter;
  const mglMasonryColumns = options?.masonry_columns;
  const mglMasonryLeftToRight = options?.masonry_left_to_right;

  const mglJustifiedGutter = options?.justified_gutter;
  const mglJustifiedRowHeight = options?.justified_row_height;
  const mglJustifiedDensity = options?.justified_density;
  const mglJustifiedDensityTablet = options?.justified_density_tablet || options?.justified_density;
  const mglJustifiedDensityMobile = options?.justified_density_mobile || options?.justified_density;

  const mglSquareGutter = options?.square_gutter;
  const mglSquareColumns = options?.square_columns;
  const mglCascadeGutter = options?.cascade_gutter;
  const mglHorizontalGutter = options?.horizontal_gutter;
  const mglHorizontalImageHeight = options?.horizontal_image_height;
  const mglHorizontalHideScrollbar = options?.horizontal_hide_scrollbar;
  const mglHorizontalScrollWarning = options?.horizontal_scroll_warning;
  const mglHorizontalNativeScroll = options?.horizontal_native_scroll;
  const mglCarouselCompact = options?.carousel_compact;
  const mglCarouselImmersive = options?.carousel_immersive;
  const mglCarouselGutter = options?.carousel_gutter;
  const mglCarouselImageHeight = options?.carousel_image_height;
  const mglCarouselArrowNavEnabled = options?.carousel_arrow_nav_enabled;
  const mglCarouselDotNavEnabled = options?.carousel_dot_nav_enabled;
  const mglCarouselThumbnailNavEnabled = options?.carousel_thumbnail_nav_enabled;
  const mglCarouselAspectRatio = options?.carousel_aspect_ratio;
  const mglCarouselAutoplay = options?.carousel_autoplay;
  const mglCarouselInfinite = options?.carousel_infinite;
  const mglMapEngine = options?.map_engine;
  const mglMapHeight = options?.map_height;
  const mglMapZoom = options?.map_zoom;
  const mglGoogleMapsToken = options?.googlemaps_token;
  const mglGoogleMapsStyle = options?.googlemaps_style;
  const mglMapBoxToken = options?.mapbox_token;
  const mglMapBoxStyle = options?.mapbox_style;
  const mglMapTilerToken = options?.maptiler_token;
  const mglRightClick = options?.right_click;

  const layoutOptions = [
    { value: 'tiles', label: <span>Tiles</span> },
    { value: 'masonry', label: <span>Masonry</span> },
    { value: 'justified', label: <span>Justified</span> },
    { value: 'square', label: <span>Square</span> },
    { value: 'cascade', label: <span>Cascade</span> },
    { value: 'carousel', label: <span>Carousel</span>, requirePro: true },
    { value: 'map', label: <span>Map (GPS Based)</span>, requirePro: true },
		{ value: 'horizontal', label: <span>Horizontal</span> },
    { value: 'none', label: <span>None</span> }
  ];

  const orderByOptions = [
    { value: 'none', label: <span>None</span> },

    { value: 'random', label: <span>Random</span> },

    { value: 'ids-asc', label: <span>IDs Ascending</span> },
    { value: 'ids-desc', label: <span>IDs Descending</span> },

    { value: 'title-asc', label: <span>Title (Filename) Ascending</span> },
    { value: 'title-desc', label: <span>Title (Filename) Descending</span> },
  
    { value: 'date-asc', label: <span>Date Ascending</span> },
    { value: 'date-desc', label: <span>Date Descending</span> },

    { value: 'modified-asc', label: <span>Updated Date Ascending</span> },
    { value: 'modified-desc', label: <span>Updated Date Descending</span> },

    { value: 'menu-asc', label: <span>Menu Order Ascending</span> },
    { value: 'menu-desc', label: <span>Menu Order Descending</span> },

  ];

  const animationOptions = [
    { value: 'zoom-out', label: <span>Zoom Out</span> },
    { value: 'zoom-in', label: <span>Zoom In</span> },
    { value: 'fade-out', label: <span>Fade Out</span> },
    { value: 'fade-in', label: <span>Fade In</span> },
    { value: 'colorize', label: <span>Colorize</span> },
    { value: 'highlight', label: <span>Highlight</span>, requirePro: true },
    { value: 'none', label: <span>None</span> }
  ];

  const imageSizeOptions = [
    { value: 'srcset', label: <span>Responsive Images (src-set)</span> },
    { value: 'thumbnail', label: <span>Thumbnail</span> },
    { value: 'medium', label: <span>Medium</span> },
    { value: 'large', label: <span>Large</span> },
    { value: 'full', label: <span>Full</span> },
  ];

  const captionsOptions = [
    { value: 'none', label: <span>None</span> },
    { value: 'on-hover', label: <span>On Hover</span> },
    { value: 'always', label: <span>Always</span> },
  ];

  const loadingOptions = [
    { value: 'none', label: <span>None</span> },
    { value: 'spinner', label: <span>Spinner</span> },
    { value: 'dot', label: <span>Dot</span> },
    { value: 'single-skeleton', label: <span>Single Skeleton</span>},
    { value: 'single-skeleton-dark', label: <span>Single Skeleton (Dark)</span>},
    { value: 'button-loader', label: <span>Button Loader</span>},
  ]

  const { jsxManagers } = Managers({ busy, setBusyAction, layoutOptions, orderByOptions, mglGalleryShortcodeOverrideDisabled });

  const updateOption = async (value, name) => {
    const newSettingsData = {
      ...options,
      [name]: value,
    };
    setBusyAction(true);
    try {
      const response = await nekoFetch(`${apiUrl}/update_option`, { method: 'POST', json: { options: newSettingsData }, nonce: restNonce });
      if (response.success == false) {
        alert("Failed to update.");
      } else {
        setOptions(response.options);
      }
    }
    catch (err) {
      alert(err.message);
    }
    setBusyAction(false);
  }

  const updateOptions = async (newOptions) => {
    setBusyAction(true);
    try {
      const res = await nekoFetch(`${apiUrl}/update_option`, { method: 'POST', nonce: restNonce, json: { options: newOptions } });
      if (res.success === false) {
        alert("Error");
      }
      setOptions(res.options);
    }
    catch (err) {
      alert(err.message);
    }
    finally {
      setBusyAction(false);
    }
  };

  const resetOptions = async () => {
    setBusyAction(true);
    try {
      const response = await nekoFetch(`${apiUrl}/reset_options`, { method: 'POST', nonce: restNonce });
      if (response.success = false) {
        alert("Failed");
      } else {
        setOptions(response.options);
      }
    }
    catch (err) {
      if (err.message) {
        alert(err.message);
      }
    }
    finally {
      setBusyAction(false);
    }
  };

  const retrieveOptions = async () => {
    const res = await nekoFetch(`${apiUrl}/all_settings`, { method: 'GET', nonce: restNonce });
    return res?.data;
  };

  const onExportSettings = async () => {
    setBusyAction(true);
    try {
      const today = new Date();
      const optionsData = await retrieveOptions();
      const data = { options: optionsData };
      const filename = `meow-gallery-${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}.json`;

      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.setAttribute('download', filename);
      link.click();
    }
    catch (err) {
      alert("Error while exporting settings. Please check your console.");
      console.log(err);
    }
    finally {
      setBusyAction(false);
    }
  }

  const onImportSettings = async () => {
    setBusyAction(true);
    try {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'application/json';
      fileInput.onchange = async (e) => {
        const file = e.target.files[0];
        if (file == null) {
          return;
        }
        const reader = new FileReader();
        reader.onload = async (e) => {
          const data = JSON.parse(e.target.result);
          const { options } = data;

          await updateOptions(options);
          alert("Settings imported. The page will now reload to reflect the changes.");
          window.location.reload();
        };
        reader.readAsText(file);
      };
      fileInput.click();
    }
    catch (err) {
      alert("Error while importing settings. Please check your console.");
      console.log(err);
    }
    finally {
      setBusyAction(false);
    }
  }

  const mapEnginesOptions = [
    { value: 'googlemaps', label: <span>Google Maps</span> },
    { value: 'mapbox', label: <span>MapBox</span> },
    { value: 'maptiler', label: <span>MapTiler</span> },
    { value: 'openstreetmap', label: <span>OpenStreetMap <small>(for development only)</small></span> }
  ];
  
  const jsxMap =
    <NekoBlock busy={busy} title="Map" className="primary">
      <NekoSettings title="Default Engine">
        <NekoSelect scrolldown name="map_engine" disabled={busy} value={mglMapEngine}
          description=""
          onChange={updateOption}>
          {mapEnginesOptions.map((option, index) => <NekoOption key={index} id={index} value={option.value} 
            label={option.label} requirePro={option.requirePro} />)
          }
        </NekoSelect>
      </NekoSettings>
      <NekoSettings title="Row Height">
        <NekoInput name="map_height" type="number" value={mglMapHeight} min="100"
          onEnter={updateOption} onBlur={updateOption} description="Ideal height of the map." />
      </NekoSettings>
      <NekoSettings title="Map Zoom">
        <NekoInput name="map_zoom" type="number" value={mglMapZoom} min="1" max="20"
          onEnter={updateOption} onBlur={updateOption} description="Zoom level of the map." />
      </NekoSettings>
      {mglMapEngine != 'googlemaps' &&
      <>
        <NekoTypo h2 style={{ marginTop: 10 }}>Settings for Google Maps</NekoTypo>
        <NekoSettings title="Token">
          <NekoInput name="googlemaps_token" type="text" value={mglGoogleMapsToken} onEnter={updateOption} onBlur={updateOption}
            description={<span>You can get a token for Google Maps <a href="https://developers.google.com/maps/documentation/javascript/get-api-key" target="_blank">here</a>.</span>} />
        </NekoSettings>
        <NekoSettings title="Style">
          <NekoTextArea name="googlemaps_style" value={mglGoogleMapsStyle} onEnter={updateOption} onBlur={updateOption}
            description={<span>Google Map Style JSON. You can find a lot of beautiful templates ready to use here: <a href="https://snazzymaps.com/" target="_blank">SnazzyMaps</a>. Remove it and it will reset to the default style.</span>} />
        </NekoSettings>
      </>
      }
      {mglMapEngine == 'mapbox' &&
      <>
        <NekoTypo h2 style={{ marginTop: 10 }}>Settings for MapBox</NekoTypo>
        <NekoSettings title="Token">
          <NekoInput name="mapbox_token" type="text" value={mglMapBoxToken} onEnter={updateOption} onBlur={updateOption}
            description={<span class="description">You can get a token for MapBox <a href="https://account.mapbox.com/access-tokens/" target="_blank">here</a>.</span>} />
        </NekoSettings>
        <NekoSettings title="Style">
          <NekoTextArea name="mapbox_style" value={mglMapBoxStyle} onEnter={updateOption} onBlur={updateOption}
            description={<span>The Mapbox Styles API lets you read and change map styles, fonts, and images. Learn how to  <a href="https://docs.mapbox.com/api/maps/styles/#retrieve-a-style" target="_blank">retrieve a style</a>. Remove it and it will reset to the default style.</span>} />
        </NekoSettings>
      </>
      }
      {mglMapEngine == 'maptiler' &&
      <>
        <NekoTypo h2 style={{ marginTop: 10 }}>Settings for MapTiler</NekoTypo>
        <NekoSettings title="Token">
          <NekoInput name="maptiler_token" type="text" value={mglMapTilerToken} onEnter={updateOption} onBlur={updateOption}
            description={<span class="description">You can get a token for MapTiles <a href="https://cloud.maptiler.com/" target="_blank">here</a>.</span>} />
        </NekoSettings>
      </>
      }
    </NekoBlock>;

  const jsxTiles =
    <NekoBlock busy={busy} title="Tiles" className="primary">

      <NekoSettings title="Gutter">
        <div style={{ display: 'flex' }}>
          <NekoInput name="tiles_gutter" type="number" value={mglTilesGutter} min="0" 
            onEnter={updateOption} onBlur={updateOption} style={{ flex: 1, marginRight: 5 }} description="Desktop" />
          <NekoInput name="tiles_gutter_tablet" type="number" value={mglTilesGutterTablet} min="0"
            onEnter={updateOption} onBlur={updateOption} style={{ flex: 1, marginRight: 5 }} description="Tablet" />
          <NekoInput name="tiles_gutter_mobile" type="number" value={mglTilesGutterMobile} min="0"
            onEnter={updateOption} onBlur={updateOption} style={{ flex: 1 }} description="Mobile" />
        </div>
      </NekoSettings>

      <NekoSettings title="Density">
        <div style={{ display: 'flex' }}>
          <NekoSelect scrolldown name="tiles_density" disabled={busy} 
            value={mglTilesDensity} style={{ flex: 1, marginRight: 5 }} description="Desktop" onChange={updateOption}>
            <NekoOption key='low' id='low' value='low' label="Low" />
            <NekoOption key='medium' id='medium' value='medium' label="Medium" />
            <NekoOption key='high' id='high' value='high' label="High" />
          </NekoSelect>
          <NekoSelect scrolldown name="tiles_density_tablet" disabled={busy} 
            value={mglTilesDensityTablet} style={{ flex: 1, marginRight: 5 }} description="Tablet" onChange={updateOption}>
            <NekoOption key='low' id='low' value='low' label="Low" />
            <NekoOption key='medium' id='medium' value='medium' label="Medium" />
            <NekoOption key='high' id='high' value='high' label="High" />
          </NekoSelect>
          <NekoSelect scrolldown name="tiles_density_mobile" disabled={busy} 
            value={mglTilesDensityMobile} style={{ flex: 1 }} description="Mobile" onChange={updateOption}>
            <NekoOption key='low' id='low' value='low' label="Low" />
            <NekoOption key='medium' id='medium' value='medium' label="Medium" />
            <NekoOption key='high' id='high' value='high' label="High" />
          </NekoSelect>
        </div>

        <NekoTypo p style={{ marginBottom: 15 }}>
          You can select the tile density for different devices: <b>Desktop</b>, <b>Tablet</b>, and <b>Mobile</b>. Each density setting offers three options: Low (1 image), Medium (~3 images), and High (~5 images).
        </NekoTypo>

      </NekoSettings>

      <NekoSettings title="Stylish">
        <NekoCheckboxGroup max="1">
          <NekoCheckbox name="tiles_stylish_style" disabled={busy} label="Enable" value="1"
            requirePro={false} checked={mglTilesStylishStyle} onChange={updateOption}
            description="Bring your galleries to life with a stylish style. It will add a nice shadow, a border and a slick hover animation to your images to make them stand out." />
        </NekoCheckboxGroup>
      </NekoSettings>

    </NekoBlock>;

  const jsxMasonry =
    <NekoBlock busy={busy} title="Masonry" className="primary">
      <NekoSettings title="Gutter">
        <NekoInput name="masonry_gutter" type="number" value={mglMasonryGutter} min="0" 
          onEnter={updateOption} onBlur={updateOption} description="Space between the photos (in pixels)." />
      </NekoSettings>
      <NekoSettings title="Columns">
        <NekoInput name="masonry_columns" type="number" value={mglMasonryColumns} min="0"
          onEnter={updateOption} onBlur={updateOption} description="Ideal number of columns." />
      </NekoSettings>
      <NekoSettings title="Left to Right">
        <NekoCheckbox name="masonry_left_to_right" disabled={busy} label="Enable"
          checked={mglMasonryLeftToRight} onChange={updateOption}
          description="This will reorder the images from left to right, instead of top to bottom." />
      </NekoSettings>
    </NekoBlock>;

  const jsxJustified =
  <NekoBlock busy={busy} title="Justified" className="primary">
    <NekoSettings title="Gutter">
      <NekoInput name="justified_gutter" type="number" value={mglJustifiedGutter} min="0"
        onEnter={updateOption} onBlur={updateOption} description="Space between the photos (in pixels)." />
    </NekoSettings>
    <NekoSettings title="Row Height">
      <NekoInput name="justified_row_height" type="number" value={mglJustifiedRowHeight} min="0"
        onEnter={updateOption} onBlur={updateOption} description="Ideal height of each row (in pixels)." />
    </NekoSettings>

    <NekoSettings title="Density">
        <div style={{ display: 'flex' }}>
          <NekoSelect scrolldown name="justified_density" disabled={busy} 
            value={mglJustifiedDensity} style={{ flex: 1, marginRight: 5 }} description="Desktop" onChange={updateOption}>
            <NekoOption key='low' id='low' value='low' label="Low" />
            <NekoOption key='medium' id='medium' value='medium' label="Medium" />
            <NekoOption key='high' id='high' value='high' label="High" />
          </NekoSelect>
          <NekoSelect scrolldown name="justified_density_tablet" disabled={busy} 
            value={mglJustifiedDensityTablet} style={{ flex: 1, marginRight: 5 }} description="Tablet" onChange={updateOption}>
            <NekoOption key='low' id='low' value='low' label="Low" />
            <NekoOption key='medium' id='medium' value='medium' label="Medium" />
            <NekoOption key='high' id='high' value='high' label="High" />
          </NekoSelect>
          <NekoSelect scrolldown name="justified_density_mobile" disabled={busy} 
            value={mglJustifiedDensityMobile} style={{ flex: 1 }} description="Mobile" onChange={updateOption}>
            <NekoOption key='low' id='low' value='low' label="Low" />
            <NekoOption key='medium' id='medium' value='medium' label="Medium" />
            <NekoOption key='high' id='high' value='high' label="High" />
          </NekoSelect>
        </div>

        <NekoTypo p style={{ marginBottom: 15 }}>
          You can select the tile density for different devices: <b>Desktop</b>, <b>Tablet</b>, and <b>Mobile</b>. Each density setting offers three options: Low (1 image), Medium (~3 images), and High (~5 images).
        </NekoTypo>

      </NekoSettings>

  </NekoBlock>;

  const jsxSquare =
    <NekoBlock busy={busy} title="Square" className="primary">
      <NekoSettings title="Gutter">
        <NekoInput name="square_gutter" type="number" value={mglSquareGutter} min="0"
          onEnter={updateOption} onBlur={updateOption} description="Space between the photos (in pixels)." />
      </NekoSettings>
      <NekoSettings title="Columns">
        <NekoInput name="square_columns" type="number" value={mglSquareColumns} min="0"
          onEnter={updateOption} onBlur={updateOption} description="Ideal number of columns." />
      </NekoSettings>
    </NekoBlock>;

  const jsxCascade =
    <NekoBlock busy={busy} title="Cascade" className="primary">
      <NekoSettings title="Gutter">
        <NekoInput name="cascade_gutter" type="number" value={mglCascadeGutter} min="0"
          onEnter={updateOption} onBlur={updateOption} description="Space between the photos (in pixels)." />
      </NekoSettings>
    </NekoBlock>;

  const jsxHorizontal =
    <NekoBlock busy={busy} title="Horizontal" className="primary">
      <NekoSettings title="Gutter">
        <NekoInput name="horizontal_gutter" type="number" value={mglHorizontalGutter} min="0"
          onEnter={updateOption} onBlur={updateOption} description="Space between the photos (in pixels)." />
      </NekoSettings>
      <NekoSettings title="Height">
        <NekoInput name="horizontal_image_height" type="number" value={mglHorizontalImageHeight} min="200"
          onEnter={updateOption} onBlur={updateOption} description="Height of the horizontal." />
      </NekoSettings>
      <NekoSettings title="Hide Scrollbar">
        <NekoCheckbox name="horizontal_hide_scrollbar" disabled={busy} label="Enable"
          checked={mglHorizontalHideScrollbar} onChange={updateOption} />
      </NekoSettings>
      <NekoSettings title="Scroll Warning">
        <NekoCheckbox name="horizontal_scroll_warning" disabled={busy} label="Enable"
          description="Tell your users that they are more images to see."
          checked={mglHorizontalScrollWarning} onChange={updateOption} />
      </NekoSettings>
      <NekoSettings title="Native Horizontal Scroll">
        <NekoCheckbox name="horizontal_native_scroll"
          disabled={busy}
          label="Enable"
          description="Instead of using the vertical scroll to navigate through the images, you can use the horizontal scroll from your mouse or trackpad. This depends on the browser and device."
          checked={mglHorizontalNativeScroll} onChange={updateOption} />
      </NekoSettings>
    </NekoBlock>;

  const jsxCarousel =
    <NekoBlock busy={busy} title="Carousel" className="primary">
      <NekoSettings title="Gutter">
        <NekoInput name="carousel_gutter" type="number" value={mglCarouselGutter} min="0"
          onEnter={updateOption} onBlur={updateOption} description="Space between the photos (in pixels)." />
      </NekoSettings>
      <NekoSettings title="Height">
        <NekoInput name="carousel_image_height" type="number" value={mglCarouselImageHeight} min="200"
          onEnter={updateOption} onBlur={updateOption} description="Height of the carousel." />
      </NekoSettings>
      <NekoSettings title="Centered">
        <NekoCheckbox name="carousel_centered" disabled={busy} label="Enable"
          checked={mglCarouselCentered} onChange={updateOption}
          description="Centers the carousel images." />
      </NekoSettings>
      <NekoSettings title="Immersive Captions">
        <NekoCheckbox name="carousel_immersive" disabled={busy} label="Enable"
          checked={mglCarouselImmersive} onChange={updateOption}
          description="The captions will use the current image as a backdrop. This works better with the 'Centered' option enabled."
        />
      </NekoSettings>
      <NekoSettings title="Arrow Navigation">
        <NekoCheckbox name="carousel_arrow_nav_enabled" disabled={busy} label="Enable"
          checked={mglCarouselArrowNavEnabled} onChange={updateOption}
          description="This will add arrows to navigate through the carousel."  
        />
      </NekoSettings>
      <NekoSettings title="Dot Navigation">
        <NekoCheckbox name="carousel_dot_nav_enabled" disabled={busy} label="Enable"
          checked={mglCarouselDotNavEnabled} onChange={updateOption}
          description="This will add dots (each dot represents a slide) to navigate through the carousel."
        />
      </NekoSettings>
      <NekoSettings title="Thumbnail Navigation">
        <NekoCheckbox name="carousel_thumbnail_nav_enabled" disabled={busy} label="Enable"
          checked={mglCarouselThumbnailNavEnabled} onChange={updateOption}
          description="This will add thumbnails (preview of each slide) to navigate through the carousel."
        />
      </NekoSettings>
      <NekoSettings title="Keep Aspect Ratio">
        <NekoCheckbox name="carousel_aspect_ratio" disabled={busy} label="Enable"
          checked={mglCarouselAspectRatio} onChange={updateOption}
          description="This will keep the aspect ratio of the images. Otherwise, they will be sized to fit the carousel."
        />
      </NekoSettings>
      <NekoSettings title="Autoplay">
        <NekoCheckbox name="carousel_autoplay" disabled={busy} label="Enable"
          checked={mglCarouselAutoplay} onChange={updateOption}
          description="Adds a button to start a slideshow of the images."
        />
      </NekoSettings>
      <NekoSettings title="Infinite">
        <NekoCheckbox name="carousel_infinite" disabled={busy} label="Enable"
          checked={mglCarouselInfinite} onChange={updateOption}
          description="If you have already enbaled Infinite Scroll, you have the option to make it work with the Carousel."
        />
      </NekoSettings>
    </NekoBlock>;

  const jsxLayout =
    <NekoSettings title="Layout">
      <NekoSelect scrolldown name="layout" disabled={busy} value={mglLayout}
        description=""
        onChange={updateOption}>
        {layoutOptions.map((option, index) => <NekoOption key={index} id={index} value={option.value} 
          label={option.label} requirePro={option.requirePro} />)
        }
      </NekoSelect>
    </NekoSettings>;

  const jsxLink =
    <NekoSettings title="Link">
      <NekoSelect scrolldown name="link" disabled={busy} value={mglLink}
        description=""
        onChange={updateOption}>
        <NekoOption key='none' id='none' value={null} label="None" />
        <NekoOption key='media' id='media' value='media' label="Media File" />
        <NekoOption key='attachment' id='attachment' value='attachment' label="Attachment Page" />
      </NekoSelect>
    </NekoSettings>;

  const jsxAnimation =
    <NekoSettings title="Animation">
      <NekoSelect scrolldown name="animation" disabled={busy} value={mglAnimation}
        description=""
        onChange={updateOption}>
        {animationOptions.map((option, index) => <NekoOption key={index} id={index} value={option.value} 
          label={option.label} requirePro={option.requirePro} />)
        }
      </NekoSelect>
    </NekoSettings>;

  const jsxImageSize =
    <NekoSettings title="Image Size">
      <NekoSelect scrolldown name="image_size" disabled={busy} value={mglImageSize}
        description=""
        onChange={updateOption}>
        {imageSizeOptions.map((option, index) => <NekoOption key={index} id={index} value={option.value} 
          label={option.label} requirePro={option.requirePro} />)
        }
      </NekoSelect>
    </NekoSettings>;
  
  const jsxGalleryShortcodeOverride =
    <NekoSettings title="Gallery Shortcode Override">
      <NekoCheckboxGroup max="1">
        <NekoCheckbox name="gallery_shortcode_override_disabled" disabled={busy} label="Disable" value="1"
          requirePro={true} checked={mglGalleryShortcodeOverrideDisabled} onChange={updateOption}
          description="If you don't want to use Meow Gallery for the standard WordPress Gallery shortcodes, you can disable it here." />
      </NekoCheckboxGroup>
    </NekoSettings>;

  const jsxSkeletonLoading =
    <NekoSettings title="Skeleton Loading (BETA)">
      <NekoCheckboxGroup max="1">
        <NekoCheckbox name="skeleton_loading" disabled={busy} label="Enable" value="1"
          requirePro={true} checked={mglSkeletonLoading} onChange={updateOption}
          description="This will add a skeleton loading effect to your galleries. It will show a placeholder while the images are loading. This is use to reduce the Cumulative Layout Shift (CLS) and improve the user experience." />
      </NekoCheckboxGroup>
    </NekoSettings>;

  const jsxCaptions =
    <NekoSettings title="Captions">
      <NekoSelect scrolldown name="captions" disabled={busy} value={mglCaptions}
        onChange={updateOption}>
        {captionsOptions.map((option, index) => <NekoOption key={index} id={index} value={option.value} 
          label={option.label} requirePro={option.requirePro} />)
        }
      </NekoSelect>
    </NekoSettings>;

  const jsxCaptionsAlignment =
    <NekoSettings title="Captions Alignment">
      <NekoSelect scrolldown name="captions_alignment" disabled={busy} value={mglCaptionsAlignment}
        onChange={updateOption}>
        <NekoOption key='left' id='left' value='left' label="Left" />
        <NekoOption key='center' id='center' value='center' label="Center" />
        <NekoOption key='right' id='right' value='right' label="Right" />
      </NekoSelect>
    </NekoSettings>;

  const jsxCaptionsBackground =
    <NekoSettings title="Captions Background">
      <NekoSelect scrolldown name="captions_background" disabled={busy} value={mglCaptionsBackground}
        onChange={updateOption}>
        <NekoOption key='none' id='none' value='none' label="None" />
        <NekoOption key='fade_black' id='fade-black' value='fade-black' label="Fade Black" />
        <NekoOption key='black' id='black' value='black' label="Black" />
        <NekoOption key='fade_white' id='fade-white' value='fade-white' label="Fade White" />
        <NekoOption key='white' id='white' value='white' label="White" />
        <NekoOption key='blur' id='blur' value='blur' label="Blur" />
      </NekoSelect>
    </NekoSettings>;

  const jsxLoadings = 
    <NekoSettings title="Loading Style">
      <NekoSelect scrolldown name="loading" disabled={busy || !mglInfinite} value={mglLoading} requirePro={true}
        onChange={updateOption}>
        {loadingOptions.map((option, index) => <NekoOption key={index} id={index} value={option.value}
          label={option.label} requirePro={option.requirePro} />)
        }
      </NekoSelect>
    </NekoSettings>;

  const jsxRightClick =
    <NekoSettings title="Right Click">
      <NekoCheckboxGroup max="1">
        <NekoCheckbox name="right_click" disabled={busy} label="Allow" description="" value="1"
          requirePro={true} checked={mglRightClick} onChange={updateOption} />
      </NekoCheckboxGroup>
    </NekoSettings>;

  const jsxInfinite =
    <NekoBlock busy={busy} title="Infinite Scroll" className="primary">
      <NekoSettings title="Gutter">
        <NekoInput name="infinite_gutter" type="number" value={mglHorizontalGutter} min="0"
          onEnter={updateOption} onBlur={updateOption} description="Space between the photos (in pixels)." />
      </NekoSettings>
      <NekoSettings title="Buffer Height">
        <NekoInput name="infinite_buffer" type="number" value={mglInfiniteBuffer} min="0" max="2400"
          disabled={busy || mglInfinite} onEnter={updateOption} onBlur={updateOption}
          description="Images outside the visible part of the browser can be also loaded by specifying an extra number of pixels. Typically, 400 ~ 600 will load an additional row or two of images in advance." />
      </NekoSettings>
    </NekoBlock>;

  const jsxResetOptions = (
    <NekoButton className="danger" disabled={busy} onClick={resetOptions}>
      Reset Options
    </NekoButton>
  );

  const jsxExportOptions = (
    <NekoButton className="blue" disabled={busy} onClick={onExportSettings}>
      Export Options
    </NekoButton>
  );

  const jsxImportOptions = (
    <NekoButton className="blue" disabled={busy} onClick={onImportSettings}>
      Import Options
    </NekoButton>
  );

  return (
    <NekoPage>
      <NekoHeader title='Meow Gallery | Settings' subtitle='By Meow Apps'>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <NekoButton className="primary"
            onClick={() => window.open('https://meowapps.com/meow-gallery-tutorial/', "_blank")}>
            Tutorial
          </NekoButton>
        </div>
      </NekoHeader>

      <NekoWrapper>
        <NekoColumn fullWidth>
          <NekoContainer>
            <NekoTypo p>Meow Gallery works with the core <a target="_blank" href="https://codex.wordpress.org/The_WordPress_Gallery">WordPress Gallery</a>, the official <a target="_blank" href="https://codex.wordpress.org/Gallery_Shortcode">Gallery Shortcode</a>, and the Gutenberg Gallery can be converted to it. Here, you can set the default settings but you can override them for each gallery in your website. Please get the <a target="_blank" href="https://meowapps.com/plugin/meow-gallery/">Pro version</a> to help us, and you will get animations, optimizations, and additional layouts :)</NekoTypo>
          </NekoContainer>
          <NekoTabs keepTabOnReload={true}>
            <NekoTab title='Basics'>
              <NekoWrapper>
                <NekoColumn minimal>
                  <NekoBlock busy={busy} title="Defaults" className="primary">
                    {jsxLayout}
                    {jsxLink}
                    {jsxAnimation}
                    <NekoTypo p>Defaults can be overriden by using the attribute layout in the shortcode of the gallery, like:<br /> [gallery layout='masonry' animation='zoom-out'].</NekoTypo>
                  </NekoBlock>
                  <NekoBlock busy={busy} title="UI" className="primary">
                    {jsxCaptions}
                    {mglCaptions != "none" && jsxCaptionsAlignment}
                    {mglCaptions != "none" && jsxCaptionsBackground}
                    {jsxRightClick}
                  </NekoBlock>
                  <NekoBlock busy={busy} title="Maintenance" className="primary">
                    {jsxExportOptions}
                    {jsxImportOptions}
                    {jsxResetOptions}
                  </NekoBlock>
                </NekoColumn>
                <NekoColumn minimal>
                  <NekoBlock busy={busy} title="Optimization" className="primary">
                    {jsxImageSize}
                    {jsxGalleryShortcodeOverride}
                    {jsxSkeletonLoading}
                  </NekoBlock>
                  <NekoBlock busy={busy} title="Infinite Scroll" className="primary">
                    {jsxInfinite}
                    {jsxInfiniteExtraHeight}
                    {jsxLoadings}
                  </NekoBlock>
                </NekoColumn>
              </NekoWrapper>
            </NekoTab>
            <NekoTab title='Layouts'>
              <NekoWrapper>
                <NekoColumn minimal>
                  {jsxTiles}
                  {jsxJustified}
                  {jsxSquare}
                </NekoColumn>
                <NekoColumn minimal>
                  {jsxMasonry}
                  {jsxCascade}
                  {jsxHorizontal}
                </NekoColumn>
              </NekoWrapper>
            </NekoTab>
            <NekoTab title='Pro Layouts' requirePro={!isRegistered}>
              <NekoWrapper>
                <NekoColumn minimal>
                  {jsxCarousel}
                </NekoColumn>
                <NekoColumn minimal>
                  {jsxMap}
                </NekoColumn>
              </NekoWrapper>
            </NekoTab>
            <NekoTab title='Galleries & Collections'>
              <NekoWrapper>
                {jsxManagers}
              </NekoWrapper>
            </NekoTab>
            <NekoTab title='Pro Version'>
              <LicenseBlock domain={domain} prefix={prefix} isPro={isPro} isRegistered={isRegistered} />
            </NekoTab>
          </NekoTabs>
        </NekoColumn>
      </NekoWrapper>
    </NekoPage>
  );
};

export default Settings;