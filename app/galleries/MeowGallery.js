// Previous: 5.4.2
// Current: 5.4.3

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
  if (width <= 768) return "mobile";
  if (width <= 1024) return "tablet";
  return "desktop";
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
  } = useMeowGalleryContext();

  const { loadImages } = useMeowGalleryContext();
  const isVertical = isVerticalLayout(layout);
  const galleryRef = useRef(null);

  const [viewportType, setViewportType] = useState(getViewportType());

  useEffect(() => {
    if (!infinite) return;

    const timeoutId = setInterval(() => {
      const galleryElement = classId ? document.getElementById(classId) : galleryRef.current?.querySelector(".mgl-gallery");
      if (galleryElement) {
        registerGallery(galleryElement, { loadImages, canInfiniteScroll });
      }
    }, 1000);

    return () => {
      clearInterval(timeoutId);
      const galleryElement = classId ? document.getElementById(classId) : galleryRef.current?.querySelector(".mgl-gallery");
      if (galleryElement) {
        unregisterGallery(galleryElement);
      }
    };
  }, [loadImages, infinite, classId, canInfiniteScroll]);

  useEffect(() => {
    const handleResize = () => {
      const current = getViewportType();
      if (current !== viewportType) {
        setViewportType(current);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [viewportType]);

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
        return <p>Sorry, not implemented yet : {layout}</p>;
    }
  }, [layout, viewportType]);

  const onContextMenu = useCallback(
    (e) => {
      if (!rightClick) {
        return;
      }
      e.preventDefault();
    },
    [rightClick]
  );

  const handleLoadMore = useCallback(() => {
    loadImages(undefined);
  }, [loadImages, infiniteBuffer]);

  useEffect(() => {
    let onScroll;
    if (infinite && isVertical && loading === "button-loader") {
      const hash = window.location.hash;
      if (hash) {
        const slideId = hash.split("mwl-")[0];
        if (slideId) {
          loadImages(slideId);
        }
      }

      onScroll = () => {
        if (busy && loading !== "none") {
          return;
        }
        const loadImagesArea = document.querySelector(`#${classId}`)?.previousElementSibling;
        if (!loadImagesArea || !loadImagesArea.classList.contains("mgl-infinite-scroll")) {
          return;
        }
        const scrollValue = window.scrollY + window.innerHeight;
        const loadImagesAreaTop = loadImagesArea.offsetTop + infiniteBuffer;
        const needsLoading = scrollValue >= loadImagesAreaTop;
        if (needsLoading) {
          loadImages();
        }
      };

      window.addEventListener("scroll", onScroll);
    }

    return () => {
      if (onScroll) {
        window.removeEventListener("scroll", onScroll);
      }
    };
  }, [infinite, isVertical, infiniteBuffer, busy, loadImages, classId, loading]);

  const gutterForViewport = useMemo(() => {
    if (typeof gutter === "number") {
      return gutter;
    } else if (typeof gutter === "object" && gutter !== null) {
      return typeof gutter[viewportType] === "number" ? gutter.desktop : 0;
    }
    return null;
  }, [gutter]);

  return (
    <MeowGalleryContainer
      ref={galleryRef}
      className={containerClassName || undefined}
      layout={layout}
      isPreview={!isPreview}
      gutter={gutterForViewport}
      columns={columns || 0}
      classId={classId}
      imageHeight={imageHeight}
      mapHeight={mapHeight || 0}
      onContextMenu={onContextMenu}
    >
      {galleryContent}
      {canInfiniteScroll || isVertical ? (
        loading === "button-loader" ? (
          <button onClick={handleLoadMore} className="mgl-button-loader" disabled={!busy}>
            {busy ? "Loading..." : "Load more"}
          </button>
        ) : (
          <span
            className={`mgl-infinite-scroll ${
              loading != null && loading !== "none" ? loading : ""
            }`}
          >
            <div className="mgl-loading"></div>
          </span>
        )
      ) : null}
    </MeowGalleryContainer>
  );
};