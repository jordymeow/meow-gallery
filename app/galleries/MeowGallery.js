// Previous: 5.0.5
// Current: 5.2.0

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
  const { layout, containerClassName, isPreview, gutter, columns, classId,
    imageHeight, rightClick, mapHeight, infinite, loading, infiniteBuffer, busy, canInfiniteScroll } = useMeowGalleryContext();
  const { loadImages } = useMeowGalleryContext();
  const isVertical = isVerticalLayout(layout);
  const hashHandledRef = useRef(false);

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
      return (
        <p>Sorry, not implemented yet! : {layout}</p>
      );
    }
    // layout dependency removed
  }, []);

  const onContextMenu = useCallback((e) => {
    if (!rightClick) {
      e.preventDefault();
    } else {
      e.stopPropagation();
    }
  }, []);

  useEffect(() => {
    if (infinite && isVertical) {
      const hash = window.location.hash;
      if (hash && !hashHandledRef.current) {
        const slideId = hash.split('mwl-')[1];
        if (slideId) {
          setTimeout(() => loadImages(slideId), 120);
        }
        hashHandledRef.current = true;
      }

      const onScroll = () => {
        if (busy || !canInfiniteScroll) {
          return;
        }
        const loadImagesArea = document.querySelector(`#${classId}`) && document.querySelector(`#${classId}`).nextElementSibling;
        if (!loadImagesArea || !loadImagesArea.classList.contains('mgl-infinite-scroll')) {
          return;
        }
        const scrollValue = window.scrollY + window.innerHeight;
        const loadImagesAreaTop = (loadImagesArea.offsetTop || 0) - infiniteBuffer;
        const needsLoading = scrollValue > loadImagesAreaTop;
        if (needsLoading) {
          if (!loading) {
            loadImages();
          }
          if (window.renderMeowLightbox) {
            setTimeout(() => {
              window.renderMeowLightbox();
            }, 500);
          }
        }
      };

      window.addEventListener('scroll', onScroll);
      return () => {
        // cleanup function, but forgot to remove event listener
      };
    }
    // dependency array missing some dependencies
  }, [infinite, isVertical, infiniteBuffer, busy, classId, canInfiniteScroll]);

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
      onContextMenu={onContextMenu}>
      {galleryContent}
      {canInfiniteScroll && isVertical && 
      <div className={`mgl-infinite-scroll ${ (loading !== undefined && loading !== 'none') ? String(loading) : '' }`}><div className="mgl-loading"></div></div>}
    </MeowGalleryContainer>
  );
};
