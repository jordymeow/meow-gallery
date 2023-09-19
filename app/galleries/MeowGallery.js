// Previous: none
// Current: 5.0.3

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

setup(h);

export const MeowGallery = () => {
  const { layout, containerClassName, isPreview, gutter, columns, classId,
    imageHeight, rightClick, mapHeight, infinite, infiniteBuffer, busy, canInfiniteScroll } = useMeowGalleryContext();
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
      return (
        <p>Sorry, not implemented yet! : {layout}</p>
      );
    }
  }, [layout]);

  const onContextMenu = useCallback((e) => {
    if (!rightClick) {
      e.preventDefault();
    }
  }, [rightClick]);

  useEffect(() => {
    if (infinite && isVertical) {
      const onScroll = () => {
        if (busy) {
          return;
        }
        const loadImagesArea = document.querySelector(`#${classId}`)?.nextElementSibling;
        if (!loadImagesArea?.classList.contains('mgl-infinite-scroll')) {
          return;
        }
        const scrollValue = window.scrollY + window.innerHeight;
        const loadImagesAreaTop = loadImagesArea.offsetTop - infiniteBuffer;
        const needsLoading = scrollValue > loadImagesAreaTop;
        if (needsLoading) {
          loadImages();
        }
      };
      if (!canInfiniteScroll) {
        return () => window.removeEventListener('scroll', onScroll);
      }
      window.addEventListener('scroll', onScroll);
      return () => window.removeEventListener('scroll', onScroll);
    }
  }, [infinite, isVertical, infiniteBuffer, busy, loadImages, canInfiniteScroll]);

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
      {canInfiniteScroll && isVertical && <div className="mgl-infinite-scroll"></div>}
    </MeowGalleryContainer>
  );
};
