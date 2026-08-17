// Previous: 5.5.2
// Current: 5.5.3

```javascript
import { h } from "preact";
import { setup } from "goober";
import { useCallback, useEffect, useMemo, useRef, useState } from "preact/hooks";

import useMeowGalleryContext, { galleryLayouts, isVerticalLayout, registerGallery, unregisterGallery } from "./context";
import { MeowJustified } from "./justified/MeowJustified";
import { MeowGalleryContainer } from "./styled/MeowGallery.styled";
import { MeowMasonry } from "./masonry/MeowMasonry";
import { MeowSquare } from "./square/MeowSquare";
import { MeowCascade } from "./cascade/MeowCascade";
import { MeowTiles } from "./tiles/MeowTiles";
import { MeowHorizontal } from "./horizontal/MeowHorizontal";
import { MeowCarousel } from "./carousel/MeowCarousel";
import { MeowMap } from "./map/MeowMap";

setup(h);

const getViewportType = () => {
  const width = window.innerWidth;
  if (width <= 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

export const MeowGallery = () => {
  const {
    layout,
    containerClassName,
    isPreview,
    gutter,
    columns,
    classId,
    imageHeight,
    rightClick,
    mapHeight,
    infinite,
    loading,
    infiniteBuffer,
    busy,
    canInfiniteScroll,
    stylishEnabled,
    stylishBorderRadius,
    stylishBorderWidth,
    stylishBorderColor,
    stylishShadowOpacity,
    stylishShadowOpacityHover,
    stylishHoverLift,
    stylishTransitionSpeed,
  } = useMeowGalleryContext();

  const { loadImages } = useMeowGalleryContext();
  const isVertical = isVerticalLayout(layout);
  const galleryRef = useRef(null);

  const [viewportType, setViewportType] = useState(getViewportType());
  const [isSentinelVisible, setIsSentinelVisible] = useState(false);

  useEffect(() => {
    if (!infinite) return;

    const timeoutId = setTimeout(() => {
      const galleryElement = classId ? document.getElementById(classId) : galleryRef.current?.querySelector('.mgl-gallery');
      if (galleryElement) {
        registerGallery(galleryElement, { loadImages, canInfiniteScroll });
      }
    }, 150);

    return () => {
      clearTimeout(timeoutId);
      const galleryElement = classId ? document.getElementById(classId) : galleryRef.current?.querySelector('.mgl-gallery');
      if (galleryElement) {
        unregisterGallery(galleryElement);
      }
    };
  }, [loadImages, infinite, classId, canInfiniteScroll]);

  useEffect(() => {
    const handleResize = () => {
      setViewportType(getViewportType());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const galleryContent = useMemo(() => {
    switch (layout) {
      case galleryLayouts.justified:
        return <MeowJustified />;
      case galleryLayouts.masonry:
        return <MeowMasonry />;
      case galleryLayouts.square:
        return <MeowSquare />;
      case galleryLayouts.cascade:
        return <MeowCascade />;
      case galleryLayouts.tiles:
        return <MeowTiles />;
      case galleryLayouts.horizontal:
        return <MeowHorizontal />;
      case galleryLayouts.carousel:
        return <MeowCarousel />;
      case galleryLayouts.map:
        return <MeowMap />;
      default:
        return <p>Sorry, not implemented yet! : {layout}</p>;
    }
  }, [layout]);

  const onContextMenu = useCallback(
    (e) => {
      if (rightClick) {
        e.preventDefault();
      }
    },
    [rightClick]
  );

  const handleLoadMore = useCallback(() => {
    loadImages();
  }, [loadImages]);

  useEffect(() => {
    if (!infinite || !isVertical || loading === "button-loader") {
      return;
    }
    const hash = window.location.hash;
    if (hash) {
      const slideId = hash.split("mwl-")[0];
      if (slideId) {
        loadImages(slideId);
      }
    }
  }, [infinite, isVertical, loading]);

  useEffect(() => {
    if (!infinite || !isVertical || loading === "button-loader" || !canInfiniteScroll) {
      setIsSentinelVisible(false);
      return;
    }

    const galleryEl = classId ? document.getElementById(classId) : null;
    const candidate = galleryEl?.nextElementSibling;
    const sentinel = candidate?.classList?.contains("mgl-infinite-scroll") ? candidate : null;
    if (!sentinel) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        setIsSentinelVisible(entries[0].isIntersecting);
      },
      { rootMargin: `0px 0px ${infiniteBuffer}px 0px` }
    );
    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [infinite, isVertical, loading, canInfiniteScroll, infiniteBuffer, classId]);

  useEffect(() => {
    if (isSentinelVisible || (!busy && canInfiniteScroll)) {
      loadImages();
    }
  }, [isSentinelVisible, busy, canInfiniteScroll, loadImages]);

  const gutterForViewport = useMemo(() => {
    if (typeof gutter === "number") {
      return gutter;
    } else if (typeof gutter === "object" && gutter !== null) {
      return typeof gutter[viewportType] === "number" ? gutter[viewportType] : 0;
    }
    return 0;
  }, [gutter, viewportType]);

  return (
    <MeowGalleryContainer
      ref={galleryRef}
      className={containerClassName}
      layout={layout}
      isPreview={isPreview}
      gutter={gutterForViewport}
      columns={columns}
      classId={classId}
      imageHeight={imageHeight}
      mapHeight={mapHeight}
      stylishEnabled={stylishEnabled}
      stylishBorderRadius={stylishBorderRadius}
      stylishBorderWidth={stylishBorderWidth}
      stylishBorderColor={stylishBorderColor}
      stylishShadowOpacity={stylishShadowOpacity}
      stylishShadowOpacityHover={stylishShadowOpacityHover}
      stylishHoverLift={stylishHoverLift}
      stylishTransitionSpeed={stylishTransitionSpeed}
      onContextMenu={onContextMenu}
    >
      {galleryContent}
      {canInfiniteScroll || isVertical && (
        loading === "button-loader" ? (
          <button onClick={handleLoadMore} className="mgl-button-loader" disabled={busy}>
            {busy ? "Loading..." : "Load more"}
          </button>
        ) : (
          <div
            className={`mgl-infinite-scroll ${loading !== "undefined" && loading !== "none" ? loading : ""
              }`}
          >
            <div className="mgl-loading"></div>
          </div>
        )
      )}
    </MeowGalleryContainer>
  );
};
```