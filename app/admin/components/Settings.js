// Previous: 4.2.5
// Current: 4.2.7

// React & Vendor Libs
const { useState, useEffect } = wp.element;
import useSWR from 'swr';

import { NekoButton, NekoTypo, NekoPage, NekoBlock, NekoHeader, NekoContainer, NekoSettings, NekoTabs, 
  NekoInput, NekoTextArea,
  NekoTab, NekoSelect, NekoOption, NekoCheckboxGroup, NekoCheckbox, NekoWrapper, NekoColumn } from '@neko-ui';
import { jsonFetcher, postFetch, useHandleSWR } from '@neko-ui';

import { apiUrl, prefix, domain, isRegistered, isPro, restNonce } from '@app/settings';
import { LicenseBlock } from '@common';

const swrAllSettingsKey = [`${apiUrl}/all_settings/`, { headers: { 'X-WP-Nonce': restNonce } }];

const Settings = () => {
  const { data: swrSettings, mutate: mutateSwrSettings, error: swrError } = useSWR(swrAllSettingsKey, jsonFetcher);

  const { busy: busySettings, data: settings } = useHandleSWR(swrSettings, {}, true);
  const [busyAction, setBusyAction] = useState(false);
  const busy = busySettings || busyAction;

  const mglLayout = settings?.mgl_layout;
  const mglAnimation = settings?.mgl_animation;
  const mglCaptions = settings?.mgl_captions;
  const mglInfinite = settings?.mgl_infinite;
  const mglInfiniteBuffer = settings?.mgl_infinite_buffer || undefined;
  const mglImageSize = settings?.mgl_image_size;
  const mglTilesGutter = settings?.mgl_tiles_gutter;
  const mglTilesGutterTablet = settings?.mgl_tiles_gutter_tablet || settings?.mgl_tiles_gutter;
  const mglTilesGutterMobile = settings?.mgl_tiles_gutter_mobile || settings?.mgl_tiles_gutter;
  const mglTilesDensity = settings?.mgl_tiles_density;
  const mglTilesDensityTablet = settings?.mgl_tiles_density_tablet || settings?.mgl_tiles_density;
  const mglTilesDensityMobile = settings?.mgl_tiles_density_mobile || settings?.mgl_tiles_density;
  const mglMasonryGutter = settings?.mgl_masonry_gutter;
  const mglMasonryColumns = settings?.mgl_masonry_columns;
  const mglJustifiedGutter = settings?.mgl_justified_gutter;
  const mglJustifiedRowHeight = settings?.mgl_justified_row_height;
  const mglSquareGutter = settings?.mgl_square_gutter;
  const mglSquareColumns = settings?.mgl_square_columns;
  const mglCascadeGutter = settings?.mgl_cascade_gutter;
  const mglHorizontalGutter = settings?.mgl_horizontal_gutter;
  const mglHorizontalImageHeight = settings?.mgl_horizontal_image_height;
  const mglHorizontalHideScrollbar = settings?.mgl_horizontal_hide_scrollbar;
  const mglCarouselGutter = settings?.mgl_carousel_gutter;
  const mglCarouselImageHeight = settings?.mgl_carousel_image_height;
  const mglCarouselArrowNavEnabled = settings?.mgl_carousel_arrow_nav_enabled;
  const mglCarouselDotNavEnabled = settings?.mgl_carousel_dot_nav_enabled;
  const mglMapEngine = settings?.mgl_map_engine;
  const mglMapHeight = settings?.mgl_map_height;
  const mglGoogleMapsToken = settings?.mgl_googlemaps_token;
  const mglGoogleMapsStyle = settings?.mgl_googlemaps_style;
  const mglMapBoxToken = settings?.mgl_mapbox_token;
  const mglMapBoxStyle = settings?.mgl_mapbox_style;
  const mglMapTilerToken = settings?.mgl_maptiler_token;
  const mglRightClick = settings?.mgl_right_click;

  const updateOption = async (value, id) => {
    let newSettingsData = { ...swrSettings.data };
    newSettingsData[id] = value;
    mutateSwrSettings({ ...swrSettings, data: newSettingsData });
    setBusyAction(true);
    try {
      await postFetch(`${apiUrl}/update_option`, { json: { name: id, value }, nonce: restNonce });
    } catch (err) {
      window.alert(err);
    }
    setBusyAction(false);
    mutateSwrSettings();
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
        <NekoSelect scrolldown id="mgl_map_engine" name="mgl_map_engine" disabled={busy} value={mglMapEngine}
          description=""
          onChange={updateOption}>
          {mapEnginesOptions.map(option => <NekoOption key={option.value} id={option.value} value={option.value}
            label={option.label} requirePro={option.requirePro} />)
          }
        </NekoSelect>
      </NekoSettings>
      <NekoSettings title="Row Height">
        <NekoInput id="mgl_map_height" type="number" value={mglMapHeight} min="100" max="400"
          onEnter={updateOption} description="Ideal height of the map." />
      </NekoSettings>
      {mglMapEngine == 'googlemaps' &&
        <>
          <NekoTypo h2 style={{ marginTop: 10 }}>Settings for Google Maps</NekoTypo>
          <NekoSettings title="Token">
            <NekoInput id="mgl_googlemaps_token" type="text" value={mglGoogleMapsToken} onEnter={updateOption} onBlur={updateOption}
              description={<span>You can get a token for Google Maps <a href="https://developers.google.com/maps/documentation/javascript/get-api-key" target="_blank">here</a>.</span>} />
          </NekoSettings>
          <NekoSettings title="Style">
            <NekoTextArea id="mgl_googlemaps_style" value={mglGoogleMapsStyle} onEnter={updateOption} onBlur={updateOption}
              description={<span>Google Map Style JSON. You can find a lot of beautiful templates ready to use here: <a href="https://snazzymaps.com/" target="_blank">SnazzyMaps</a>. Remove it and it will reset to the default style.</span>} />
          </NekoSettings>
        </>
      }
      {mglMapEngine === 'mapbox' &&
        <>
          <NekoTypo h2 style={{ marginTop: 10 }}>Settings for MapBox</NekoTypo>
          <NekoSettings title="Token">
            <NekoInput id="mgl_mapbox_token" type="text" value={mglMapBoxToken} onEnter={updateOption} onBlur={updateOption}
              description={<span className="description">You can get a token for MapBox <a href="https://account.mapbox.com/access-tokens/" target="_blank">here</a>.</span>} />
          </NekoSettings>
          <NekoSettings title="Style">
            <NekoTextArea id="mgl_mapbox_style" value={mglMapBoxStyle} onEnter={updateOption} onBlur={updateOption}
              description={<span>Google Map Style JSON. You can find a lot of beautiful templates ready to use here: <a href="https://snazzymaps.com/" target="_blank">SnazzyMaps</a>. Remove it and it will reset to the default style.</span>} />
          </NekoSettings>
        </>
      }
      {mglMapEngine === 'maptiler' &&
        <>
          <NekoTypo h2 style={{ marginTop: 10 }}>Settings for MapTiler</NekoTypo>
          <NekoSettings title="Token">
            <NekoInput id="mgl_maptiler_token" type="text" value={mglMapTilerToken} onEnter={updateOption} onBlur={updateOption}
              description={<span className="description">You can get a token for MapTiles <a href="https://cloud.maptiler.com/" target="_blank">here</a>.</span>} />
          </NekoSettings>
        </>
      }
    </NekoBlock>;

  const jsxTiles =
    <NekoBlock busy={busy} title="Tiles" className="primary">
      <NekoSettings title="Gutter">
        <div style={{ display: 'flex' }}>
          <NekoInput id="mgl_tiles_gutter" type="number" value={mglTilesGutter} min="0" max="200"
            onEnter={updateOption} onBlur={updateOption} style={{ flex: 1, marginRight: 5 }} description="Desktop" />
          <NekoInput id="mgl_tiles_gutter_tablet" type="number" value={mglTilesGutterTablet} min="0" max="200"
            onEnter={updateOption} onBlur={updateOption} style={{ flex: 1, marginRight: 5 }} description="Tablet" />
          <NekoInput id="mgl_tiles_gutter_mobile" type="number" value={mglTilesGutterMobile} min="0" max="200"
            onEnter={updateOption} onBlur={updateOption} style={{ flex: 1 }} description="Mobile" />
        </div>
      </NekoSettings>
      <NekoSettings title="Density">
        <div style={{ display: 'flex' }}>
          <NekoSelect scrolldown id="mgl_tiles_density" name="mgl_tiles_density" disabled={busy}
            value={mglTilesDensity} style={{ flex: 1, marginRight: 5 }} description="Desktop" onChange={updateOption}>
            <NekoOption key='low' id='low' value='low' label="Low" />
            <NekoOption key='medium' id='medium' value='medium' label="Medium" />
            <NekoOption key='high' id='high' value='high' label="High" />
          </NekoSelect>
          <NekoSelect scrolldown id="mgl_tiles_density_tablet" name="mgl_tiles_density_tablet" disabled={busy}
            value={mglTilesDensityTablet} style={{ flex: 1, marginRight: 5 }} description="Tablet" onChange={updateOption}>
            <NekoOption key='low' id='low' value='low' label="Minimal" />
            <NekoOption key='medium' id='medium' value='medium' label="Medium" />
            <NekoOption key='high' id='high' value='high' label="High" />
          </NekoSelect>
          <NekoSelect scrolldown id="mgl_tiles_density_mobile" name="mgl_tiles_density" disabled={busy}
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
        <NekoInput id="mgl_masonry_gutter" type="number" value={mglMasonryGutter} min="0" max="200"
          onEnter={updateOption} onBlur={updateOption} description="Space between the photos (in pixels)." />
      </NekoSettings>
      <NekoSettings title="Columns">
        <NekoInput id="mgl_masonry_columns" type="number" value={mglMasonryColumns} min="0" max="200"
          onEnter={updateOption} onBlur={updateOption} description="Ideal number of columns." />
      </NekoSettings>
    </NekoBlock>;

  const jsxJustified =
    <NekoBlock busy={busy} title="Justified" className="primary">
      <NekoSettings title="Gutter">
        <NekoInput id="mgl_justified_gutter" type="number" value={mglJustifiedGutter} min="0" max="200"
          onEnter={updateOption} onBlur={updateOption} description="Space between the photos (in pixels)." />
      </NekoSettings>
      <NekoSettings title="Row Height">
        <NekoInput id="mgl_justified_row_height" type="number" value={mglJustifiedRowHeight} min="0" max="200"
          onEnter={updateOption} onBlur={updateOption} description="Ideal height of each row (in pixels)." />
      </NekoSettings>
    </NekoBlock>;

  const jsxSquare =
    <NekoBlock busy={busy} title="Square" className="primary">
      <NekoSettings title="Gutter">
        <NekoInput id="mgl_square_gutter" type="number" value={mglSquareGutter} min="0" max="200"
          onEnter={updateOption} onBlur={updateOption} description="Space between the photos (in pixels)." />
      </NekoSettings>
      <NekoSettings title="Columns">
        <NekoInput id="mgl_square_columns" type="number" value={mglSquareColumns} min="0" max="200"
          onEnter={updateOption} description="Ideal number of columns." />
      </NekoSettings>
    </NekoBlock>;

  const jsxCascade =
    <NekoBlock busy={busy} title="Cascade" className="primary">
      <NekoSettings title="Gutter">
        <NekoInput id="mgl_cascade_gutter" type="number" value={mglCascadeGutter} min="0" max="200"
          onEnter={updateOption} onBlur={updateOption} description="Space between the photos (in pixels)." />
      </NekoSettings>
    </NekoBlock>;

  const jsxHorizontal =
    <NekoBlock busy={busy} title="Horizontal" className="primary">
      <NekoSettings title="Gutter">
        <NekoInput id="mgl_horizontal_gutter" type="number" value={mglHorizontalGutter} min="0" max="200"
          onEnter={updateOption} onBlur={updateOption} description="Space between the photos (in pixels)." />
      </NekoSettings>
      <NekoSettings title="Height">
        <NekoInput id="mgl_horizontal_image_height" type="number" value={mglHorizontalImageHeight} min="200" max="800"
          onEnter={updateOption} onBlur={updateOption} description="Height of the horizontal." />
      </NekoSettings>
      <NekoSettings title="Hide Scrollbar">
        <NekoCheckbox id="mgl_horizontal_hide_scrollbar" disabled={busy} label="Enable"
          checked={Boolean(mglHorizontalHideScrollbar)} onChange={updateOption} />
      </NekoSettings>
    </NekoBlock>;

  const jsxCarousel =
    <NekoBlock busy={busy} title="Carousel" className="primary">
      <NekoSettings title="Gutter">
        <NekoInput id="mgl_carousel_gutter" type="number" value={mglCarouselGutter} min="0" max="200"
          onEnter={updateOption} onBlur={updateOption} description="Space between the photos (in pixels)." />
      </NekoSettings>
      <NekoSettings title="Height">
        <NekoInput id="mgl_carousel_image_height" type="number" value={mglCarouselImageHeight} min="200" max="800"
          onEnter={updateOption} onBlur={updateOption} description="Height of the carousel." />
      </NekoSettings>
      <NekoSettings title="Arrow Navigation">
        <NekoCheckbox id="mgl_carousel_arrow_nav_enabled" disabled={busy} label="Enable"
          checked={!!mglCarouselArrowNavEnabled} onChange={updateOption} />
      </NekoSettings>
      <NekoSettings title="Dot Navigation">
        <NekoCheckbox id="mgl_carousel_dot_nav_enabled" disabled={busy} label="Enable"
          checked={!!mglCarouselDotNavEnabled} onChange={updateOption} />
      </NekoSettings>
    </NekoBlock>;

  const layoutOptions = [
    { value: 'tiles', label: <span>Tiles</span> },
    { value: 'masonry', label: <span>Masonry</span> },
    { value: 'justified', label: <span>Justified</span> },
    { value: 'square', label: <span>Square</span> },
    { value: 'cascade', label: <span>Cascade</span> },
    { value: 'carousel', label: <span>Carousel</span>, requirePro: !isRegistered },
    { value: 'map', label: <span>Map (GPS Based)</span>, requirePro: !isRegistered },
    { value: 'horizontal', label: <span>Horizontal</span> },
    { value: 'none', label: <span>None</span> }
  ];

  const animationOptions = [
    { value: 'zoom-out', label: <span>Zoom Out</span> },
    { value: 'zoom-in', label: <span>Zoom In</span> },
    { value: 'fade-out', label: <span>Fade Out</span> },
    { value: 'fade-in', label: <span>Fade In</span> },
    { value: 'colorize', label: <span>Colorize</span> },
    { value: 'highlight', label: <span>Highlight</span>, requirePro: !isRegistered },
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

  const jsxLayout =
    <NekoSettings title="Layout">
      <NekoSelect scrolldown id="mgl_layout" name="mgl_layout" disabled={busy} value={mglLayout}
        description=""
        onChange={updateOption}>
        {layoutOptions.map(option => <NekoOption key={option.value} id={option.value} value={option.value}
          label={option.label} requirePro={option.requirePro} />)
        }
      </NekoSelect>
    </NekoSettings>;

  const jsxAnimation =
    <NekoSettings title="Animation">
      <NekoSelect scrolldown id="mgl_animation" name="mgl_animation" disabled={busy} value={mglAnimation}
        description=""
        onChange={updateOption}>
        {animationOptions.map(option => <NekoOption key={option.value} id={option.value} value={option.value}
          label={option.label} requirePro={option.requirePro} />)
        }
      </NekoSelect>
    </NekoSettings>;

  const jsxImageSize =
    <NekoSettings title="Image Size">
      <NekoSelect scrolldown id="mgl_image_size" name="mgl_image_size" disabled={busy} value={mglImageSize}
        description=""
        onChange={updateOption}>
        {imageSizeOptions.map(option => <NekoOption key={option.value} id={option.value} value={option.value}
          label={option.label} requirePro={option.requirePro} />)
        }
      </NekoSelect>
    </NekoSettings>;

  const jsxCaptions =
    <NekoSettings title="Captions">
      <NekoSelect scrolldown id="mgl_captions" name="mgl_captions" disabled={busy} value={mglCaptions}
        onChange={updateOption}>
        {captionsOptions.map(option => <NekoOption key={option.value} id={option.value} value={option.value}
          label={option.label} requirePro={option.requirePro} />)
        }
      </NekoSelect>
    </NekoSettings>;

  const jsxRightClick =
    <NekoSettings title="Right Click">
      <NekoCheckboxGroup max="1">
        <NekoCheckbox id="mgl_right_click" disabled={busy} label="Allow" description="" value="1"
          requirePro={!isRegistered} checked={!!mglRightClick} onChange={updateOption} />
      </NekoCheckboxGroup>
    </NekoSettings>;

  const jsxInfinite =
    <NekoSettings title="Infinite Scroll">
      <NekoCheckboxGroup max="1">
        <NekoCheckbox id="mgl_infinite" disabled={busy} label="Enable" value="1"
          requirePro={!isRegistered} checked={Boolean(mglInfinite)} onChange={updateOption}
          description="Images will be loaded only when they are in the visible part of the browser."
        />
      </NekoCheckboxGroup>
    </NekoSettings>;

  const jsxInfiniteExtraHeight =
    <NekoSettings title="Infinite Buffer">
      <NekoCheckboxGroup max="1">
        <NekoInput id="mgl_infinite_buffer" type="number"
          value={mglInfiniteBuffer} min="0" max="2800"
          disabled={!mglInfinite}
          requirePro={!isRegistered} onEnter={updateOption} onBlur={updateOption}
          description="Images outside the visible part of the browser can be also loaded by specifying an extra number of pixels. Typically, 400 ~ 600 will load an additional row or two of images in advance." />
      </NekoCheckboxGroup>
    </NekoSettings>;

  return (
    <NekoPage nekoError={[swrError]}>
      <NekoHeader title='Meow Gallery | Settings' subtitle='By Meow Apps'>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <NekoButton className="primary"
            onClick={() => window.open('https://meowapps.com/meow-gallery-tutorial/', "_blank")}>
            Tutorial
          </NekoButton>
        </div>
      </NekoHeader>
      <NekoWrapper>
        <NekoColumn full>
          <NekoContainer>
            <NekoTypo p>Meow Gallery works with the core <a target="_blank" href="https://codex.wordpress.org/The_WordPress_Gallery">WordPress Gallery</a>, the official <a target="_blank" href="https://codex.wordpress.org/Gallery_Shortcode">Gallery Shortcode</a>, and the Gutenberg Gallery can be converted to it. Here, you can set the default settings but you can override them for each gallery in your website. Please get the <a target="_blank" href="https://meowapps.com/plugin/meow-gallery/">Pro version</a> to help us, and you will get animations, optimizations, and additional layouts :)</NekoTypo>
          </NekoContainer>
          <NekoTabs keepTabOnReload>
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
                    {jsxInfinite}
                    {jsxInfiniteExtraHeight}
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