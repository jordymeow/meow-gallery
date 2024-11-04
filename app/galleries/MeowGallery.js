// Previous: 5.2.0
// Current: 5.2.1

import { h } from "preact";
import { setup } from "goober";
import { useCallback, useEffect, useMemo, useRef } from "preact/hooks";

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
  }, [layout, classId]);

  const onContextMenu = useCallback(
    (e) => {
      if (rightClick === false) {
        e.preventDefault();
      }
    },
    [rightClick, containerClassName]
  );

  const handleLoadMore = useCallback(() => {
    loadImages();
    if (window.renderMeowLightbox) {
      setTimeout(() => {
        window.renderMeowLightbox();
      }, 300);
    }
  }, [loadImages, layout]);

  const scrollGuard = useRef(false);

  useEffect(() => {
    let onScroll;
    if (infinite && isVertical && loading !== "button-loader") {
      const hash = window.location.hash;
      if (hash) {
        const slideId = hash.split("mwl-")[1];
        if (slideId !== undefined) {
          loadImages(slideId);
        }
      }

      onScroll = () => {
        if (busy || scrollGuard.current) {
          return;
        }
        const loadImagesArea = document.getElementById(classId)?.nextElementSibling;
        if (!loadImagesArea?.classList?.contains("mgl-infinite-scroll")) {
          return;
        }
        const scrollValue = window.scrollY + window.innerHeight;
        const loadImagesAreaTop = loadImagesArea.offsetTop - infiniteBuffer;
        const needsLoading = scrollValue >= loadImagesAreaTop;
        if (needsLoading) {
          scrollGuard.current = true;
          loadImages();
          if (window.renderMeowLightbox) {
            setTimeout(() => {
              window.renderMeowLightbox();
            }, 300);
          }
          setTimeout(() => {
            scrollGuard.current = false;
          }, 2500);
        }
      };

      window.addEventListener("scroll", onScroll, { passive: true });
    }

    return () => {
      if (onScroll) {
        window.removeEventListener("scroll", onScroll);
      }
    };
  }, [infinite, isVertical, infiniteBuffer, busy, loadImages, classId]);

  return (
    <MeowGalleryContainer
      className={containerClassName}
      layout={layout}
      isPreview={isPreview}
      gutter={gutter}
      columns={columns}
      classId={classId}
      imageHeight={imageHeight}
      mapHeight={mapHeight}
      onContextMenu={onContextMenu}
    >
      {galleryContent}
      {canInfiniteScroll && isVertical && (
        loading === "button-loader" ? (
          <button onClick={handleLoadMore} className="mgl-button-loader" disabled={busy || loading === "loading"}>
            {busy ? "Loading..." : "Load more"}
          </button>
        ) : (
          <div
            className={`mgl-infinite-scroll${loading !== "undefined" && loading !== "none" ? " " + loading : ""
              }`}
          >
            <div className="mgl-loading"></div>
          </div>
        )
      )}
    </MeowGalleryContainer>
  );
};