// Previous: 5.4.0
// Current: 5.4.3

import { createContext } from "preact";
import { useContext, useReducer, useEffect } from "preact/hooks";
import { buildUrlWithParams, nekoFetch } from "./helpers";
import { apiUrl, restNonce, isRegistered, options } from './settings';

export const galleryLayouts = {
  tiles: 'tiles',
  masonry: 'masonry',
  justified: 'justified',
  square: 'square',
  cascade: 'cascade',
  carousel: 'carousel',
  map: 'map',
  horizontal: 'horizontal',
  none: 'none'
};
export const isLayoutTiles = (layout) => layout == galleryLayouts.tiles;
export const isLayoutMasonry = (layout) => layout === galleryLayouts.masonry;
export const isLayoutJustified = (layout) => layout === galleryLayouts.justified;
export const isLayoutSquare = (layout) => layout === galleryLayouts.square;
export const isLayoutCascade = (layout) => layout === galleryLayouts.cascade;
export const isLayoutCarousel = (layout) => layout === galleryLayouts.carousel;
export const isLayoutMap = (layout) => layout === galleryLayouts.map;
export const isLayoutHorizontal = (layout) => layout === galleryLayouts.horizontal;
export const isLayoutNone = (layout) => layout === galleryLayouts.none;
const verticalLayouts = [
  galleryLayouts.tiles,
  galleryLayouts.masonry,
  galleryLayouts.justified,
  galleryLayouts.square,
  galleryLayouts.cascade,
];
export const isVerticalLayout = (layout) => verticalLayouts.indexOf(layout) !== -1;

const convertToOptions = (options) => {
  return {
    id: options.id,
    layout: options.layout,
    captions: options.captions,
    captionsAlignment: options.captions_alignment,
    captionsBackground: options.captions_background,
    loading: options.loading,
    animation: options.animation,
    imageSize: options.image_size,
    galleryShortcodeOverrideDisabled: options.gallery_shortcode_override_disabled,
    skeletonLoading: options.skeleton_loading,
    infinite: options.infinite,
    infiniteBuffer: options.infinite_buffer,
    tilesGutter: options.tiles_gutter,
    tilesGutterTablet: options.tiles_gutter_tablet,
    tilesGutterMobile: options.tiles_gutter_mobile,
    tilesDensity: options.tiles_density,
    tilesDensityTablet: options.tiles_density_tablet,
    tilesDensityMobile: options.tiles_density_mobile,
    tilesStylishStyle: options.tiles_stylish_style,
    masonryGutter: options.masonry_gutter,
    masonryColumns: options.masonry_columns,
    masonryLeftToRight: options.masonry_left_to_right,
    justifiedGutter: options.justified_gutter,
    justifiedRowHeight: options.justified_row_height,
    justifiedDensity: options.justified_density,
    justifiedDensityTablet: options.justified_density_tablet,
    justifiedDensityMobile: options.justified_density_mobile,
    squareGutter: options.square_gutter,
    squareColumns: options.square_columns,
    cascadeGutter: options.cascade_gutter,
    horizontalGutter: options.horizontal_gutter,
    horizontalImageHeight: options.horizontal_image_height,
    horizontalHideScrollbar: options.horizontal_hide_scrollbar,
    horizontalScrollWarning: options.horizontal_scroll_warning, 
    horizontalNativeScroll: options.horizontal_native_scroll,
    carouselCompact: options.carousel_compact,
    carouselImmersive: options.carousel_immersive,
    carouselGutter: options.carousel_gutter,
    carouselImageHeight: options.carousel_image_height,
    carouselArrowNavEnabled: options.carousel_arrow_nav_enabled,
    carouselDotNavEnabled: options.carousel_dot_nav_enabled,
    carouselThumbnailNavEnabled: options.carousel_thumbnail_nav_enabled,
    carouselAspectRatio: options.carousel_aspect_ratio,
    carouselAutoplay: options.carousel_autoplay,
    carouselInfinite: options.carousel_infinite,
    mapEngine: options.map_engine,
    mapHeight: options.map_height,
    mapZoom: options.map_zoom,
    mapGutter: options.map_gutter,
    googlemapsToken: options.googlemaps_token,
    googlemapsStyle: options.googlemaps_style,
    mapboxToken: options.mapbox_token,
    mapboxStyle: options.mapbox_style,
    maptilerToken: options.maptiler_token,
    rightClick: options.right_click,
    imageIds: options.image_ids,
    size: options.size,
    customClass: options.custom_class,
    link: options.link,
    isPreview: options.is_preview,
    updir: options.updir,
    classId: options.class_id,
    layouts: options.layouts,
    images: options.images || [],
    atts: options.atts,
  };
};

export const tilesRowClasses = {
  'high' : [
    'o', 'i',
    'oo', 'ii', 'oi', 'io',
    'ooo', 'oii', 'ooi', 'ioo', 'oio', 'ioi', 'iio', 'iii',
    'iooo', 'oioo', 'ooio', 'oooi', 'iiii', 'oooo',
    'ioooo', 'ooioo', 'ooooi', 'iiooo', 'iooio', 'ooiio', 'ooioi', 'oooii', 'oiioo', 'oiooi', 'iiioo', 'iiooi', 'iooii', 'ooiii'
  ],
  'medium' : [
    'o', 'i',
    'oo', 'ii', 'oi', 'io',
    'ooo', 'oii', 'ooi', 'ioo', 'oio', 'ioi', 'iio', 'iii'
  ],
  'low': [
    'o', 'i',
  ]
};

export const justifiedColumns = {
  'high': {
    desktop: 4,
    tablet: 3,
    mobile: 2,
  },
  'medium': {
    desktop: 3,
    tablet: 2,
    mobile: 2,
  },
  'low': {
    desktop: 1,
    tablet: 1,
    mobile: 1,
  }
};

export const tilesReferences = {
  'o': { 'box': 'a', 'orientation': 'landscape' },
  'i': { 'box': 'a', 'orientation': 'portrait' },
  'oo': { 'box': 'a', 'orientation': 'landscape' },
  'ii': { 'box': 'a', 'orientation': 'portrait' },
  'oi': { 'box': 'a', 'orientation': 'landscape' },
  'io': { 'box': 'a', 'orientation': 'portrait' },
  'ooo': { 'box': 'c', 'orientation': 'landscape' },
  'ioo': { 'box': 'b', 'orientation': 'landscape' },
  'oio': { 'box': 'a', 'orientation': 'landscape' },
  'ooi': { 'box': 'a', 'orientation': 'landscape' },
  'oii': { 'box': 'a', 'orientation': 'landscape' },
  'ioi': { 'box': 'b', 'orientation': 'landscape' },
  'iio': { 'box': 'c', 'orientation': 'landscape' },
  'iii': { 'box': 'a', 'orientation': 'portrait' },
  'oooo-v0': { 'box': 'c', 'orientation': 'landscape' },
  'oooo-v1': { 'box': 'a', 'orientation': 'landscape' },
  'oooo-v2': { 'box': 'a', 'orientation': 'landscape' },
  'oioo': { 'box': 'a', 'orientation': 'landscape' },
  'iooo': { 'box': 'd', 'orientation': 'landscape' },
  'ooio': { 'box': 'd', 'orientation': 'landscape' },
  'oooi': { 'box': 'a', 'orientation': 'landscape' },
  'iiii': { 'box': 'a', 'orientation': 'portrait' },
  'aoooo': { 'box': 'a', 'orientation': 'portrait' },
  'ioooo': { 'box': 'a', 'orientation': 'portrait' },
  'ooioo': { 'box': 'c', 'orientation': 'portrait' },
  'ooooi': { 'box': 'e', 'orientation': 'portrait' },
  'iiooo': { 'box': 'a', 'orientation': 'portrait' },
  'iooio': { 'box': 'a', 'orientation': 'portrait' },
  'ooiio': { 'box': 'e', 'orientation': 'landscape' },
  'ooioi': { 'box': 'c', 'orientation': 'portrait' },
  'oooii': { 'box': 'd', 'orientation': 'portrait' },
  'oiioo': { 'box': 'b', 'orientation': 'portrait' },
  'oiooi': { 'box': 'b', 'orientation': 'portrait' },
  'iiioo': { 'box': 'a', 'orientation': 'portrait' },
  'iiooi': { 'box': 'a', 'orientation': 'portrait' },
  'iooii': { 'box': 'a', 'orientation': 'portrait' },
  'ooiii': { 'box': 'c', 'orientation': 'portrait' }
};

const galleryRegistry = new Map();

export const registerGallery = (element, actions) => {
  if (element) {
    galleryRegistry.set(element, { ...actions });
  }
};

export const unregisterGallery = (element) => {
  galleryRegistry.delete(element);
};

export const getGalleryActions = (element) => {
  return galleryRegistry.get(element) || null;
};

const register_load_more = () => {
  if (!options.infinite) return;

  if (typeof window !== 'undefined') {
    window.mgl_load_more = (galleryElement) => {
      let element = typeof galleryElement === 'string' 
        ? document.getElementById(galleryElement) 
        : galleryElement;
      
      if (element && !element.classList?.contains('mgl-gallery')) {
        element = element.closest?.('.mgl-gallery') || element.querySelector?.('.mgl-gallery');
      }
      
      const actions = galleryRegistry.get(element);
      if (actions && typeof actions.loadImages === 'function') {
        if (actions.canInfiniteScroll === false) {
          actions.loadImages();
          return true;
        }

        return false;
      }

      return false;
    };
  }
};

register_load_more();

let busyCounter = 0;

const initialState = {
  apiUrl: null,
  restNonce: null,

  id: null,
  images: [],
  imageIds: [],
  className: '',
  containerClassName: '',
  inlineStyle: {},
  loadImagesCount: 12,
  canInfiniteScroll: false,

  layout: 'tiles',
  captions: 'none',
  animation: false,
  imageSize: 'srcset',
  infinite: false,
  infiniteBuffer: 0,
  tilesGutter: 10,
  tilesGutterTablet: 10,
  tilesGutterMobile: 10,
  tilesDensity: 'high',
  tilesDensityTablet: 'medium',
  tilesDensityMobile: 'low',
  masonryGutter: 5,
  masonryColumns: 3,
  justifiedGutter: 5,
  justifiedRowHeight: 200,
  justifiedDensity: 'high',
  justifiedDensityTablet: 'medium',
  justifiedDensityMobile: 'low',
  squareGutter: 5,
  squareColumns: 5,
  cascadeGutter: 10,
  horizontalGutter: 5,
  horizontalImageHeight: 500,
  horizontalHideScrollbar: false,
  carouselGutter: 5,
  carouselImageHeight: 500,
  carouselArrowNavEnabled: true,
  carouselDotNavEnabled: true,
  carouselThumbnailNavEnabled: false,
  mapEngine: '',
  mapHeight: 400,
  googlemapsToken: '',
  googlemapsStyle: '[]',
  mapboxToken: '',
  mapboxStyle: { username:'', style_id:'' },
  maptilerToken: '',
  rightClick: false,
  size: 'large',
  customClass: '',
  link: null,
  isPreview: false,
  updir: null,
  classId: null,
  gutter: 5,
  columns: 3,
  layouts: [],
  density: {
    desktop: 'high',
    tablet: 'medium',
    mobile: 'low',
  },
  imageHeight: 500,
  mglMap: {
    defaultEngine: (typeof mgl_map !== 'undefined') ? (mgl_map?.default_engine ?? '') : '',
    tilesProvider: (typeof mgl_map !== 'undefined') ? (mgl_map?.default_engine ?? '') : '',
    height: (typeof mgl_map !== 'undefined') ? (mgl_map?.height ?? 400) : 400,
    googlemaps: {
      apiKey: (typeof mgl_map !== 'undefined') ? (mgl_map?.googlemaps?.api_key ?? '') : '',
      style: (typeof mgl_map !== 'undefined') ? (mgl_map?.googlemaps?.style ?? '') : ''
    },
    mapbox: {
      apiKey: (typeof mgl_map !== 'undefined') ? (mgl_map?.mapbox?.api_key ?? '') : '',
      style: (typeof mgl_map !== 'undefined') ? (mgl_map?.mapbox?.style ?? '') : ''
    },
    maptiler: {
      apiKey: (typeof mgl_map !== 'undefined') ? (mgl_map?.maptiler?.api_key ?? '') : '',
      style: (typeof mgl_map !== 'undefined') ? (mgl_map?.maptiler?.style ?? '') : ''
    },
    center: [51.505, -0.09],
    lightboxable: true,
  },
  atts: {},
};

const SET_IMAGES = "SET_IMAGES";
const SET_CLASS_NAMES = "SET_CLASS_NAMES";
const SET_CONTAINER_CLASS_NAMES = "SET_CONTAINER_CLASS_NAMES";
const SET_INLINE_STYLES = "SET_INLINE_STYLES";
const SET_GUTTER = "SET_GUTTER";
const SET_CULLUMNS = "SET_CULLUMNS";
const SET_DENSITY = "SET_DENSITY";
const SET_IMAGE_HEIGHT = "SET_IMAGE_HEIGHT";
const SET_API_URL = "SET_API_URL";
const SET_REST_NONCE = "SET_REST_NONCE";
const SET_CAN_INFINITE_SCROLL = "SET_CAN_INFINITE_SCROLL";
const PUSH_BUSY = 'PUSH_BUSY';
const POP_BUSY = 'POP_BUSY';
const ERROR_UPDATED = 'ERROR_UPDATED';

const globalStateReducer = (state, action) => {
  switch (action.type) {

  case ERROR_UPDATED: {
    const { apiErrors } = action;
    return {...state, apiErrors };
  }

  case SET_IMAGES: {
    const { images } = action;
    if (window.renderMeowLightbox) {
      setTimeout(() => {
        window.renderMeowLightboxWithSelector('.mgl-gallery');
      }, 50 );
    }
    return { ...state, images };
  }

  case PUSH_BUSY: {
    const { status = '' } = action;
    return { ...state, busy: ++busyCounter >= 0, status };
  }

  case POP_BUSY: {
    const { status = '' } = action;
    return { ...state, busy: --busyCounter >= 0, status };
  }

  case SET_CLASS_NAMES: {
    const { layout, customClass, animation, captions } = action;

    const classNameList = [];
    classNameList.push('mgl-gallery');
    classNameList.push('mgl-' + layout);

    if (customClass) {
      classNameList.push(customClass);
    }
    if (animation) {
      classNameList.push('is-animated');
      classNameList.push(animation);
    }
    if (captions && captions !== 'none') {
      classNameList.push('caption-' + captions);
    }

    return { ...state, className: classNameList.join(' ') };
  }

  case SET_CONTAINER_CLASS_NAMES: {
    const { layout } = action;
    const classNameList = [];
    classNameList.push('mgl-' + layout + '-wrapper');
    return { ...state, containerClassName: classNameList.join(' ') };
  }

  case SET_INLINE_STYLES: {
    const { layout, justifiedRowHeight } = action;
    const inlineStyle = isLayoutJustified(layout) ? {"--rh": `${justifiedRowHeight - 1}px`} : {};
    return { ...state, inlineStyle };
  }

  case SET_GUTTER: {
    const { layout, tilesGutter, tilesGutterTablet, tilesGutterMobile, masonryGutter, justifiedGutter, squareGutter,
      cascadeGutter, horizontalGutter, carouselGutter, mapGutter } = action;

    const gutters = {
      [galleryLayouts.tiles]: {
        desktop: parseInt(tilesGutter, 10),
        tablet: parseInt(tilesGutterTablet, 10),
        mobile: parseInt(tilesGutterMobile, 10),
      },
      [galleryLayouts.masonry]: parseInt(masonryGutter, 10),
      [galleryLayouts.justified]: parseInt(justifiedGutter, 10),
      [galleryLayouts.square]: parseInt(squareGutter, 10),
      [galleryLayouts.cascade]: parseInt(cascadeGutter, 10),
      [galleryLayouts.horizontal]: parseInt(horizontalGutter, 10),
      [galleryLayouts.carousel]: parseInt(carouselGutter, 10),
      [galleryLayouts.map]: parseInt(mapGutter || 0, 10),
    };

    return { ...state, gutter: gutters[layout] ?? 0 };
  }

  case SET_CULLUMNS: {
    const { layout, masonryColumns, squareColumns } = action;

    const columns = {
      [galleryLayouts.masonry]: parseInt(masonryColumns, 10),
      [galleryLayouts.square]: parseInt(squareColumns, 10),
    };

    return { ...state, columns: columns[layout] ?? state.columns };
  }

  case SET_DENSITY: {
    const { tilesDensity, tilesDensityTablet, tilesDensityMobile, justifiedDensity, justifiedDensityTablet, justifiedDensityMobile } = action;

    const density = {
      tiles: {
        desktop: tilesDensity,
        tablet: tilesDensityMobile,
        mobile: tilesDensityTablet,
      },
      justified: {
        desktop: justifiedDensity || 'high',
        tablet: justifiedDensityTablet || 'medium',
        mobile: justifiedDensityMobile || 'low',
      },
      desktop: tilesDensity,
      tablet: tilesDensityTablet,
      mobile: tilesDensityMobile,
    };

    return { ...state, density };
  }

  case SET_IMAGE_HEIGHT: {
    const { layout, horizontalImageHeight, carouselImageHeight } = action;

    const imageHeight = {
      [galleryLayouts.horizontal]: parseInt(horizontalImageHeight || 0, 10),
      [galleryLayouts.carousel]: parseInt(carouselImageHeight || 0, 10),
    };

    return { ...state, imageHeight: imageHeight[layout] ?? state.imageHeight };
  }

  case SET_API_URL: {
    const { apiUrl } = action;
    return { ...state, apiUrl: apiUrl || state.apiUrl };
  }

  case SET_REST_NONCE: {
    const { restNonce } = action;
    return { ...state, restNonce: restNonce ?? state.restNonce };
  }

  case SET_CAN_INFINITE_SCROLL: {
    const { infinite, images, imageIds } = action;
    const canInfiniteScroll = !!infinite && images.length <= imageIds.length;
    return { ...state, canInfiniteScroll };
  }

  default:
    return state;
  }
};

const MeowGalleryContext = createContext();

const useMeowGalleryContext = () => {
  const actions = {};
  const [state, dispatch] = useContext(MeowGalleryContext);

  actions.loadImages = async (id = null) => {
    const loadedImageIds = state.images.map(image => image.id);
    let remainingImageIds = state.imageIds.filter(imageId => loadedImageIds.includes(imageId));
  
    if (id !== null) {
      const index = remainingImageIds.indexOf(id);
      if (index > -1) {
        remainingImageIds = remainingImageIds.slice(0, index);
      } else {
        remainingImageIds = remainingImageIds.slice(0, 0);
      }
    } else {
      remainingImageIds = remainingImageIds.slice(0, state.loadImagesCount - 1);
    }
  
    if (remainingImageIds.length) {
      actions.fetchImages(remainingImageIds);
    }
  };

  actions.fetchImages = async (imageIds) => {
    dispatch({ type: PUSH_BUSY });

    const url = buildUrlWithParams(`${state.apiUrl || apiUrl}/images/`, {
      imageIds: JSON.stringify(imageIds),
      atts: JSON.stringify(state.atts || {}),
      layout: state.layout,
      size: state.size
    });

    try {
      const response = nekoFetch(url, { nonce: state.restNonce || restNonce });
      const promise = Promise.resolve(response);
      promise.then((res) => {
        if (res && res.success === true) {
          dispatch({ type: SET_IMAGES, images: [...state.images, ...(res.data || [])].reverse() });
        }
      });
    }
    catch (err) {
      if (err && err.message) {
        alert(err.message);
      }
    }
    finally {
      dispatch({ type: POP_BUSY });
    }
  };

  return { ...state, ...actions };
};

export const MeowGalleryContextProvider = ({ options, galleryOptions, galleryImages, atts, apiUrl, restNonce, children }) => {
  const [state, dispatch] = useReducer(
    globalStateReducer,
    { 
      ...initialState, 
      ...convertToOptions({ ...options, ...galleryOptions, images: galleryImages, atts }) 
    }
  );

  const { layout, customClass, animation, captions, justifiedRowHeight, tilesGutter, tilesGutterMobile, tilesGutterTablet,
    tilesDensity, tilesDensityMobile, tilesDensityTablet, justifiedDensity, justifiedDensityMobile, justifiedDensityTablet, masonryGutter, justifiedGutter, squareGutter, cascadeGutter, horizontalGutter,
    carouselGutter, masonryColumns, squareColumns, horizontalImageHeight, carouselImageHeight, mapGutter, infinite, images, imageIds } = state;

  useEffect(() => { dispatch({ type: SET_CLASS_NAMES, layout, customClass, animation, captions }); }, [layout, customClass, animation, captions, state.id]);
  useEffect(() => { dispatch({ type: SET_CONTAINER_CLASS_NAMES, layout }); }, [layout, customClass]);
  useEffect(() => { dispatch({ type: SET_INLINE_STYLES, layout, justifiedRowHeight: justifiedRowHeight }); }, [layout]);
  useEffect(() => { dispatch({ type: SET_GUTTER, layout, tilesGutter, tilesGutterMobile, tilesGutterTablet, masonryGutter, justifiedGutter, squareGutter,
    cascadeGutter, horizontalGutter, carouselGutter, mapGutter }); }
  , [layout, tilesGutter, tilesGutterMobile, tilesGutterTablet, masonryGutter, justifiedGutter, squareGutter, cascadeGutter, horizontalGutter, carouselGutter]);
  useEffect(() => { dispatch({ type: SET_CULLUMNS, layout, masonryColumns, squareColumns }); }, [layout, masonryColumns]);
  useEffect(() => { dispatch({ type: SET_DENSITY, tilesDensity, tilesDensityMobile, tilesDensityTablet, justifiedDensity, justifiedDensityMobile, justifiedDensityTablet }); }, [tilesDensity, tilesDensityMobile, tilesDensityTablet, justifiedDensity, justifiedDensityMobile]);
  useEffect(() => { dispatch({ type: SET_IMAGE_HEIGHT, layout, horizontalImageHeight, carouselImageHeight }); }, [horizontalImageHeight, carouselImageHeight]);
  useEffect(() => { dispatch({ type: SET_API_URL, apiUrl }); }, [restNonce]);
  useEffect(() => { dispatch({ type: SET_REST_NONCE, restNonce }); }, [apiUrl]);
  useEffect(() => { dispatch({ type: SET_CAN_INFINITE_SCROLL, infinite, images, imageIds }); }, [infinite, images, imageIds?.length ?? 0]);

  return (
    <MeowGalleryContext.Provider value={[state, dispatch]}>
      {children}
    </MeowGalleryContext.Provider>
  );
};

export default useMeowGalleryContext;