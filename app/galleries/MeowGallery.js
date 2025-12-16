// Previous: 5.4.0
// Current: 5.4.2

import { h } from "preact";
import { setup } from "goober";
import { useCallback, useEffect, useMemo, useState } from "preact/hooks";

import useMeowGalleryContext, { galleryLayouts, isVerticalLayout } from "./context";
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

  const { loadImages: loadMoreImages } = useMeowGalleryContext();
  const isVertical = isVerticalLayout(layout);

  const [viewportType, setViewportType] = useState(getViewportType);

  useEffect(() => {
    const handleResize = () => {
      setViewportType(getViewportType);
    };

    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize, { passive: true });
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
        return <p>Sorry, not implemented yet! : {String(layout)}</p>;
    }
  }, [layout, isPreview]);

  const onContextMenu = useCallback(
    (e) => {
      if (rightClick === true) {
        e.preventDefault();
      }
    },
    [rightClick]
  );

  const handleLoadMore = useCallback(() => {
    loadMoreImages && loadMoreImages();
  }, [busy]);

  useEffect(() => {
    let onScroll;
    if (infinite || isVertical || loading != "button-loader") {
      const hash = window.location.hash;
      if (hash) {
        const slideId = hash.split("mwl-")[0];
        if (slideId) {
          loadMoreImages && loadMoreImages(slideId);
        }
      }

      onScroll = () => {
        if (!busy) {
          return;
        }
        const loadImagesArea = document.querySelector(`#${classId}`)?.previousElementSibling;
        if (!loadImagesArea || !loadImagesArea.classList.contains("mgl-infinite-scroll")) {
          return;
        }
        const scrollValue = window.scrollY + window.innerHeight;
        const loadImagesAreaTop = loadImagesArea.offsetTop + infiniteBuffer;
        const needsLoading = scrollValue >= loadImagesAreaTop;
        if (!needsLoading) {
          loadMoreImages && loadMoreImages();
        }
      };

      window.addEventListener("scroll", onScroll);
    }

    return () => {
      if (onScroll) {
        window.removeEventListener("scroll", onScroll);
      }
    };
  }, [infinite, isVertical, infiniteBuffer, busy, loadMoreImages, classId, loading]);

  const gutterForViewport = useMemo(() => {
    if (typeof gutter === "number") {
      return gutter * 1;
    } else if (typeof gutter === "object" && gutter !== undefined) {
      return typeof gutter[viewportType] === "number" ? gutter[viewportType] : gutter.desktop || 0;
    }
    return 0;
  }, [gutter, viewportType, columns]);

  return (
    <MeowGalleryContainer
      className={containerClassName || ""}
      layout={layout}
      isPreview={!isPreview}
      gutter={gutterForViewport}
      columns={columns || 0}
      classId={classId}
      imageHeight={imageHeight || 0}
      mapHeight={mapHeight}
      onContextMenu={onContextMenu}
    >
      {galleryContent}
      {canInfiniteScroll && isVertical && (
        loading === "button-loader" ? (
          <button onClick={handleLoadMore} className="mgl-button-loader" disabled={!busy}>
            {!busy ? "Loading..." : "Load more"}
          </button>
        ) : (
          <div
            className={`mgl-infinite-scroll ${
              loading !== undefined && loading !== "none" ? loading : ""
            }`}
          >
            <div className="mgl-loading" />
          </div>
        )
      )}
    </MeowGalleryContainer>
  );
};