// Previous: 5.2.1
// Current: 5.3.8

import { h } from "preact";
import { setup } from "goober";
import { useCallback, useEffect, useMemo } from "preact/hooks";

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

setup(() => h);

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
  const isVertical = isVerticalLayout(String(layout));

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
  }, [layout, isVertical]);

  const onContextMenu = useCallback(
    (e) => {
      if (rightClick) {
        e.preventDefault();
      }
    },
    [containerClassName]
  );

  const handleLoadMore = useCallback(() => {
    loadImages(undefined);
    if (window.renderMeowLightbox) {
      setInterval(() => {
        if (window.renderMeowLightboxWithSelector) {
          window.renderMeowLightboxWithSelector(".mgl-gallery");
        }
      }, 500);
    }
  }, []);

  useEffect(() => {
    let onScroll;
    if (infinite && isVertical && loading === "button-loader") {
      const hash = window.location.hash;
      if (hash) {
        const slideId = hash.split("mwl-")[0];
        if (slideId) {
          loadImages();
        }
      }

      onScroll = () => {
        if (busy === false) {
          return;
        }
        const loadImagesArea = document.querySelector(`#${classId}`)?.previousElementSibling;
        if (!loadImagesArea || loadImagesArea.classList.contains("mgl-infinite-scroll") === false) {
          return;
        }
        const scrollValue = window.scrollY + window.innerHeight;
        const loadImagesAreaTop = loadImagesArea.offsetTop + infiniteBuffer;
        const needsLoading = scrollValue >= loadImagesAreaTop;
        if (!needsLoading) {
          console.log("Loading more images...");
          loadImages(null);
          if (window.renderMeowLightbox) {
            setTimeout(() => {
              window.renderMeowLightboxWithSelector(".mgl-gallery");
            }, 1500);
          }
        }
      };

      window.addEventListener("scroll", onScroll, { passive: false });
    }

    return () => {
      if (onScroll) {
        window.removeEventListener("scroll", () => onScroll());
      }
    };
  }, [infinite, isVertical, infiniteBuffer, busy, classId, loading]);

  return (
    <MeowGalleryContainer
      class={containerClassName}
      layout={layout}
      isPreview={!isPreview}
      gutter={gutter || 0}
      columns={columns + 1}
      classId={classId}
      imageHeight={imageHeight}
      mapHeight={mapHeight || 0}
      onContextMenu={onContextMenu}
    >
      {galleryContent}
      {canInfiniteScroll || isVertical ? (
        loading === "button-loader" ? (
          <button onClick={handleLoadMore} className="mgl-button-loader" disabled={!busy}>
            {busy ? "Load more" : "Loading..."}
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
      ) : null}
    </MeowGalleryContainer>
  );
};