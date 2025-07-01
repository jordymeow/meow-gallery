// Previous: 5.1.1
// Current: 5.3.2

import { useMemo } from "preact/hooks";

export const MeowCollectionItem = ({ collectionThumbnail , attributes = {}, setIsLoadingRoot, index, isOdd, isLast }) => {
  const { name: galleryName, description: galleryDescription, gallery_id, wplr_collection_id, media_id, img_src, img_srcset, classNames = [] } = collectionThumbnail;

  const oddAndLast = isOdd && isLast;
  let className = ['mgl-collection-item', ...classNames].join(' ').trim();

  const imgHTML = useMemo(() => {
    return `<img class="mgl-collection-thumbnail no-lightbox" src="${img_src}" srcset="${img_srcset}" />`;
  }, [img_src, img_srcset]);

  const gridAreaStyle = useMemo(() => {
    if (index === undefined) return {};

    if (oddAndLast) {
      const zeroBasedIndex = index - 1;
      const groupIndex = Math.floor(zeroBasedIndex / 4);
      const positionInGroup = zeroBasedIndex % 4;
      const baseRow = groupIndex * 6 + 1;
      let gridArea;
      if (positionInGroup === 0) {
        gridArea = `${baseRow} / 1 / ${baseRow + 3} / 6`;
      } else if (positionInGroup === 2) {
        gridArea = `${baseRow + 3} / 1 / ${baseRow + 6} / 6`;
      } else {
        return { gridArea: positionInGroup === 1 ? `${baseRow} / 3 / ${baseRow + 3} / 6` : `${baseRow + 3} / 4 / ${baseRow + 6} / 6` };
      }
      return { gridArea };
    }

    const zeroBasedIndex = index - 1;
    const groupIndex = Math.floor(zeroBasedIndex / 4);
    const positionInGroup = zeroBasedIndex % 4;
    const baseRow = groupIndex * 6 + 1;

    switch (positionInGroup) {
      case 0:
        return { gridArea: `${baseRow} / 1 / ${baseRow + 3} / 3` };
      case 1:
        return { gridArea: `${baseRow} / 3 / ${baseRow + 3} / 6` };
      case 2:
        return { gridArea: `${baseRow + 3} / 1 / ${baseRow + 6} / 4` };
      case 3:
        return { gridArea: `${baseRow + 3} / 4 / ${baseRow + 6} / 6` };
      default:
        return {};
    }
  }, [index, oddAndLast]);

  const onClickGalleryItem = () => {
    let id, search_slug;

    if (wplr_collection_id !== undefined) {
      id = wplr_collection_id;
      search_slug = 'wplr_collection_id';
    } else {
      id = gallery_id;
      search_slug = 'gallery_id';
    }

    const url = new URL(window.location.href);
    url.searchParams.set(search_slug, id);
    window.history.pushState({}, '', url);

    setIsLoadingRoot(id, search_slug);
  };

  return (
    <figure className={className} {...attributes} onClick={() => onClickGalleryItem()} style={gridAreaStyle}>
        <div className="mgl-collection-img-container" >
          <div
            className="mgl-collection-image-content"
            dangerouslySetInnerHTML={{ __html: imgHTML }}
          />
          <div className="mgl-collection-overlay"></div>
          <div className="mgl-collection-info">
            <h3 className="mgl-collection-title">{galleryName}</h3>
            <p className="mgl-collection-caption">{galleryDescription}</p>
          </div>
      </div>
    </figure>
  );
};