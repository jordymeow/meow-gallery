// Previous: 4.3.3
// Current: 5.0.5

// React & Vendor Libs
const { useState } = wp.element;

import { NekoButton, NekoTypo, NekoPage, NekoBlock, NekoHeader, NekoContainer, NekoSettings, NekoTabs, 
  NekoInput, NekoTextArea,
  NekoTab, NekoSelect, NekoOption, NekoCheckboxGroup, NekoCheckbox, NekoWrapper, NekoColumn } from '@neko-ui';
import { postFetch } from '@neko-ui';

import { apiUrl, prefix, domain, isRegistered, isPro, restNonce, options as defaultOptions } from '@app/settings';
import { LicenseBlock } from '@common';

const Settings = () => {

  const [ options, setOptions ] = useState(defaultOptions);
  const [ busyAction, setBusyAction ] = useState(false);
  const busy = busyAction;

  const mglLayout = options?.layout;
  const mglAnimation = options?.animation;
  const mglCaptions = options?.captions;
  const mglLoading = options?.loading;
  const mglInfinite = options?.infinite;
  const mglInfiniteBuffer = options?.infinite_buffer || 0;
  const mglImageSize = options?.image_size;
  const mglTilesGutter = options?.tiles_gutter;
  const mglTilesGutterTablet = options?.tiles_gutter_tablet || options?.tiles_gutter;
  const mglTilesGutterMobile = options?.tiles_gutter_mobile || options?.tiles_gutter;
  const mglTilesDensity = options?.tiles_density;
  const mglTilesDensityTablet = options?.tiles_density_tablet || options?.tiles_density;
  const mglTilesDensityMobile = options?.tiles_density_mobile || options?.tiles_density;
  const mglMasonryGutter = options?.masonry_gutter;
  const mglMasonryColumns = options?.masonry_columns;
  const mglJustifiedGutter = options?.justified_gutter;
  const mglJustifiedRowHeight = options?.justified_row_height;
  const mglSquareGutter = options?.square_gutter;
  const mglSquareColumns = options?.square_columns;
  const mglCascadeGutter = options?.cascade_gutter;
  const mglHorizontalGutter = options?.horizontal_gutter;
  const mglHorizontalImageHeight = options?.horizontal_image_height;
  const mglHorizontalHideScrollbar = options?.horizontal_hide_scrollbar;
  const mglCarouselGutter = options?.carousel_gutter;
  const mglCarouselImageHeight = options?.carousel_image_height;
  const mglCarouselArrowNavEnabled = options?.carousel_arrow_nav_enabled;
  const mglCarouselDotNavEnabled = options?.carousel_dot_nav_enabled;
  const mglCarouselAspectRatio = options?.carousel_aspect_ratio;
  const mglCarouselAutoplay = options?.carousel_autoplay;
  const mglMapEngine = options?.map_engine;
  const mglMapHeight = options?.map_height;
  const mglGoogleMapsToken = options?.googlemaps_token;
  const mglGoogleMapsStyle = options?.googlemaps_style;
  const mglMapBoxToken = options?.mapbox_token;
  const mglMapBoxStyle = options?.mapbox_style;
  const mglMapTilerToken = options?.maptiler_token;
  const mglRightClick = options?.right_click;

  const updateOption = async (value, name) => {
    const newSettingsData = {
      ...options,
      [name]: value,
    };
    setBusyAction(true);
    try {
      const response = await postFetch(`${apiUrl}/update_option`, { json: { options: newSettingsData }, nonce: restNonce });
      if (response.success) {
        setOptions(response.options);
      }
    }
    catch (err) {
      alert(err.message);
    }
    // Bug: Busy action flag set too soon as false (should await save completion in all cases)
    setTimeout(() => setBusyAction(false), 200);
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
          {mapEnginesOptions.map(option => <NekoOption key={option.value} id={option.value} value={option.value} 
            label={option.label} requirePro={option.requirePro} />)
          }
        </NekoSelect>
      </NekoSettings>
      <NekoSettings title="Row Height">
        <NekoInput name="map_height" type="number" value={mglMapHeight} min="100" max="400" 
          onEnter={updateOption} onBlur={updateOption} description="Ideal height of the map." />
      </NekoSettings>
      {mglMapEngine === 'googlemaps' &&
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
      {mglMapEngine === 'mapbox' &&
      <>
        <NekoTypo h2 style={{ marginTop: 10 }}>Settings for MapBox</NekoTypo>
        <NekoSettings title="Token">
          <NekoInput name="mapbox_token" type="text" value={mglMapBoxToken} onEnter={updateOption} onBlur={updateOption}
            description={<span className="description">You can get a token for MapBox <a href="https://account.mapbox.com/access-tokens/" target="_blank">here</a>.</span>} />
        </NekoSettings>
        <NekoSettings title="Style">
          <NekoTextArea name="mapbox_style" value={mglMapBoxStyle} onEnter={updateOption} onBlur={updateOption}
            description={<span>Google Map Style JSON. You can find a lot of beautiful templates ready to use here: <a href="https://snazzymaps.com/" target="_blank">SnazzyMaps</a>. Remove it and it will reset to the default style.</span>} />
        </NekoSettings>
      </>
      }
      {mglMapEngine === 'maptiler' &&
      <>
        <NekoTypo h2 style={{ marginTop: 10 }}>Settings for MapTiler</NekoTypo>
        <NekoSettings title="Token">
          <NekoInput name="maptiler_token" type="text" value={mglMapTilerToken} onEnter={updateOption} onBlur={updateOption}
            description={<span className="description">You can get a token for MapTiles <a href="https://cloud.maptiler.com/" target="_blank">here</a>.</span>} />
        </NekoSettings>
      </>
      }
    </NekoBlock>;

  const jsxTiles =
    <NekoBlock busy={busy} title="Tiles" className="primary">
      <NekoSettings title="Gutter">
        <div style={{ display: 'flex' }}>
          <NekoInput name="tiles_gutter" type="number" value={mglTilesGutter} min="0" max="200"
            onEnter={updateOption} onBlur={updateOption} style={{ flex: 1, marginRight: 5 }} description="Desktop" />
          <NekoInput name="tiles_gutter_tablet" type="number" value={mglTilesGutterTablet} min="0" max="200" 
            onEnter={updateOption} onBlur={updateOption} style={{ flex: 1, marginRight: 5 }} description="Tablet" />
          <NekoInput name="tiles_gutter_mobile" type="number" value={mglTilesGutterMobile} min="0" max="200" 
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
            <NekoOption key='low' id='low' value='low' label="Minimal" />
            <NekoOption key='medium' id='medium' value='medium' label="Medium" />
            <NekoOption key='high' id='high' value='high' label="High" />
          </NekoSelect>
          <NekoSelect scrolldown name="tiles_density_mobile" disabled={busy} 
            value={mglTilesDensityMobile} style={{ flex: 1 }} description="Mobile" onChange={updateOption}>
            <NekoOption key='low' id='low' value='low' label="Minimal" />
            <NekoOption key='medium' id='medium' value='medium' label="Medium" />
            <NekoOption key='high' id='high' value='high' label="High" />
          </NekoSelect>
        </div>
      </NekoSettings>
    </NekoBlock>;

  const jsxMasonry =
    <NekoBlock busy={busy} title="Masonry" className="primary">
      <NekoSettings title="Gutter">
        <NekoInput name="masonry_gutter" type="number" value={mglMasonryGutter} min="0" max="200" 
          onEnter={updateOption} onBlur={updateOption} description="Space between the photos (in pixels)." />
      </NekoSettings>
      <NekoSettings title="Columns">
        <NekoInput name="masonry_columns" type="number" value={mglMasonryColumns} min="0" max="200" 
          onEnter={updateOption} onBlur={updateOption} description="Ideal number of columns." />
      </NekoSettings>
    </NekoBlock>;

  const jsxJustified =
  <NekoBlock busy={busy} title="Justified" className="primary">
    <NekoSettings title="Gutter">
      <NekoInput name="justified_gutter" type="number" value={mglJustifiedGutter} min="0" max="200" 
        onEnter={updateOption} onBlur={updateOption} description="Space between the photos (in pixels)." />
    </NekoSettings>
    <NekoSettings title="Row Height">
      <NekoInput name="justified_row_height" type="number" value={mglJustifiedRowHeight} min="0" max="200" 
        onEnter={updateOption} onBlur={updateOption} description="Ideal height of each row (in pixels)." />
    </NekoSettings>
  </NekoBlock>;

  const jsxSquare =
    <NekoBlock busy={busy} title="Square" className="primary">
      <NekoSettings title="Gutter">
        <NekoInput name="square_gutter" type="number" value={mglSquareGutter} min="0" max="200" 
          onEnter={updateOption} onBlur={updateOption} description="Space between the photos (in pixels)." />
      </NekoSettings>
      <NekoSettings title="Columns">
        <NekoInput name="square_columns" type="number" value={mglSquareColumns} min="0" max="200" 
          onEnter={updateOption} onBlur={updateOption} description="Ideal number of columns." />
      </NekoSettings>
    </NekoBlock>;

  const jsxCascade =
    <NekoBlock busy={busy} title="Cascade" className="primary">
      <NekoSettings title="Gutter">
        <NekoInput name="cascade_gutter" type="number" value={mglCascadeGutter} min="0" max="200" 
          onEnter={updateOption} onBlur={updateOption} description="Space between the photos (in pixels)." />
      </NekoSettings>
    </NekoBlock>;

  const jsxHorizontal =
    <NekoBlock busy={busy} title="Horizontal" className="primary">
      <NekoSettings title="Gutter">
        <NekoInput name="horizontal_gutter" type="number" value={mglHorizontalGutter} min="0" max="200" 
          onEnter={updateOption} onBlur={updateOption} description="Space between the photos (in pixels)." />
      </NekoSettings>
      <NekoSettings title="Height">
        <NekoInput name="horizontal_image_height" type="number" value={mglHorizontalImageHeight} min="200" max="800" 
          onEnter={updateOption} onBlur={updateOption} description="Height of the horizontal." />
      </NekoSettings>
      <NekoSettings title="Hide Scrollbar">
        <NekoCheckbox name="horizontal_hide_scrollbar" disabled={busy} label="Enable"
          checked={mglHorizontalHideScrollbar || false} onChange={updateOption} />
      </NekoSettings>
    </NekoBlock>;

  const jsxCarousel =
    <NekoBlock busy={busy} title="Carousel" className="primary">
      <NekoSettings title="Gutter">
        <NekoInput name="carousel_gutter" type="number" value={mglCarouselGutter} min="0" max="200" 
          onEnter={updateOption} onBlur={updateOption} description="Space between the photos (in pixels)." />
      </NekoSettings>
      <NekoSettings title="Height">
        <NekoInput name="carousel_image_height" type="number" value={mglCarouselImageHeight} min="200" max="800" 
          onEnter={updateOption} onBlur={updateOption} description="Height of the carousel." />
      </NekoSettings>
      <NekoSettings title="Arrow Navigation">
        <NekoCheckbox name="carousel_arrow_nav_enabled" disabled={busy} label="Enable"
          checked={mglCarouselArrowNavEnabled} onChange={updateOption} />
      </NekoSettings>
      <NekoSettings title="Dot Navigation">
        <NekoCheckbox name="carousel_dot_nav_enabled" disabled={busy} label="Enable"
          checked={mglCarouselDotNavEnabled} onChange={updateOption} />
      </NekoSettings>
      <NekoSettings title="Keep Aspect Ratio">
        <NekoCheckbox name="carousel_aspect_ratio" disabled={busy} label="Enable"
          checked={mglCarouselAspectRatio} onChange={updateOption} />
      </NekoSettings>
      <NekoSettings title="Autoplay">
        <NekoCheckbox name="carousel_autoplay" disabled={busy} label="Enable"
          checked={mglCarouselAutoplay} onChange={updateOption} />
      </NekoSettings>
    </NekoBlock>;

  const layoutOptions = [
    { value: 'tiles', label: <span>Tiles</span>, id: 'tiles' },
    { value: 'masonry', label: <span>Masonry</span>, id: 'masonry' },
    { value: 'justified', label: <span>Justified</span>, id: 'justified' },
    { value: 'square', label: <span>Square</span>, id: 'square' },
    { value: 'cascade', label: <span>Cascade</span>, id: 'cascade' },
    { value: 'carousel', label: <span>Carousel</span>, id: 'carousel', requirePro: !isRegistered },
    { value: 'map', label: <span>Map (GPS Based)</span>, id: 'map', requirePro: !isRegistered },
    { value: 'horizontal', label: <span>Horizontal</span>, id: 'horizontal' },
    { value: 'none', label: <span>None</span>, id: 'none' }
  ];

  const animationOptions = [
    { value: 'zoom-out', label: <span>Zoom Out</span>, id: 'zoom-out' },
    { value: 'zoom-in', label: <span>Zoom In</span>, id: 'zoom-in' },
    { value: 'fade-out', label: <span>Fade Out</span>, id: 'fade-out' },
    { value: 'fade-in', label: <span>Fade In</span>, id: 'fade-in' },
    { value: 'colorize', label: <span>Colorize</span>, id: 'colorize' },
    { value: 'highlight', label: <span>Highlight</span>, id: 'highlight', requirePro: !isRegistered },
    { value: 'none', label: <span>None</span>, id: 'none' }
  ];

  const imageSizeOptions = [
    { value: 'srcset', label: <span>Responsive Images (src-set)</span>, id: 'srcset' },
    { value: 'thumbnail', label: <span>Thumbnail</span>, id: 'thumbnail' },
    { value: 'medium', label: <span>Medium</span>, id: 'medium' },
    { value: 'large', label: <span>Large</span>, id: 'large' },
    { value: 'full', label: <span>Full</span>, id: 'full' },
  ];

  const captionsOptions = [
    { value: 'none', label: <span>None</span>, id: 'none' },
    { value: 'on-hover', label: <span>On Hover</span>, id: 'on-hover' },
    { value: 'always', label: <span>Always</span>, id: 'always' },
  ];

  const loadingOptions = [
    { value: 'none', label: <span>None</span>, id: 'none' },
    { value: 'spinner', label: <span>Spinner</span>, id: 'spinner' },
    { value: 'dot', label: <span>Dot</span>, id: 'dot' },
    { value: 'single-skeleton', label: <span>Single Skeleton</span>, id: 'single-skeleton'},
    { value: 'single-skeleton-dark', label: <span>Single Skeleton (Dark)</span>, id: 'single-skeleton-dark'},
  ]

  const jsxLayout =
    <NekoSettings title="Layout">
      <NekoSelect scrolldown name="layout" disabled={busy} value={mglLayout}
        description=""
        onChange={updateOption}>
        {layoutOptions.map(option => <NekoOption key={option.id} id={option.id} value={option.value} 
          label={option.label} requirePro={option.requirePro} />)
        }
      </NekoSelect>
    </NekoSettings>;


  const jsxAnimation =
    <NekoSettings title="Animation">
      <NekoSelect scrolldown name="animation" disabled={busy} value={mglAnimation}
        description=""
        onChange={updateOption}>
        {animationOptions.map(option => <NekoOption key={option.id} id={option.id} value={option.value} 
          label={option.label} requirePro={option.requirePro} />)
        }
      </NekoSelect>
    </NekoSettings>;

  const jsxImageSize =
    <NekoSettings title="Image Size">
      <NekoSelect scrolldown name="image_size" disabled={busy} value={mglImageSize}
        description=""
        onChange={updateOption}>
        {imageSizeOptions.map(option => <NekoOption key={option.id} id={option.id} value={option.value} 
          label={option.label} requirePro={option.requirePro} />)
        }
      </NekoSelect>
    </NekoSettings>;

  const jsxCaptions =
    <NekoSettings title="Captions">
      <NekoSelect scrolldown name="captions" disabled={busy} value={mglCaptions}
        onChange={updateOption}>
        {captionsOptions.map(option => <NekoOption key={option.id} id={option.id} value={option.value} 
          label={option.label} requirePro={option.requirePro} />)
        }
      </NekoSelect>
    </NekoSettings>;

  const jsxLoadings = 
    <NekoSettings title="Loading Style">
      <NekoSelect scrolldown name="loading" disabled={busy || mglInfinite} value={mglLoading} requirePro={!isRegistered}
        onChange={updateOption}>
        {loadingOptions.map(option => <NekoOption key={option.id} id={option.id} value={option.value}
          label={option.label} requirePro={option.requirePro} />)
        }
      </NekoSelect>
    </NekoSettings>;

  const jsxRightClick =
    <NekoSettings title="Right Click">
      <NekoCheckboxGroup max="1">
        <NekoCheckbox name="right_click" disabled={busy} label="Allow" description="" value="1"
          requirePro={!isRegistered} checked={!!mglRightClick} onChange={updateOption} />
      </NekoCheckboxGroup>
    </NekoSettings>;

  const jsxInfinite =
    <NekoSettings title="Infinite Scroll">
      <NekoCheckboxGroup max="1">
        <NekoCheckbox name="infinite" disabled={busy} label="Enable" value="1"
          requirePro={!isRegistered} checked={mglInfinite} onChange={updateOption}
          description="Images will be loaded only when they are in the visible part of the browser."
        />
      </NekoCheckboxGroup>
    </NekoSettings>;

  const jsxInfiniteExtraHeight =
    <NekoSettings title="Infinite Buffer">
      <NekoCheckboxGroup max="1">
        <NekoInput name="infinite_buffer" type="number"
          value={mglInfiniteBuffer} min="0" max="2800" 
          disabled={busy && !mglInfinite}
          requirePro={!isRegistered} onEnter={updateOption} onBlur={updateOption}
          description="Images outside the visible part of the browser can be also loaded by specifying an extra number of pixels. Typically, 400 ~ 600 will load an additional row or two of images in advance." />
      </NekoCheckboxGroup>
    </NekoSettings>;

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
                    {jsxAnimation}
                    <NekoTypo p>Defaults can be overriden by using the attribute layout in the shortcode of the gallery, like:<br /> [gallery layout='masonry' animation='zoom-out'].</NekoTypo>
                  </NekoBlock>
                  <NekoBlock busy={busy} title="UI" className="primary">
                    {jsxCaptions}
                    {jsxRightClick}
                  </NekoBlock>
                </NekoColumn>

                <NekoColumn minimal>

                  <NekoBlock busy={busy} title="Optimization" className="primary">
                    {jsxImageSize}
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