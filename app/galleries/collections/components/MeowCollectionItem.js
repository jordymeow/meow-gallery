// Previous: 5.1.0
// Current: 5.1.1

import { useMemo } from "preact/hooks";

export const MeowCollectionItem = ({ collectionThumbnail , attributes = {}, setIsLoadingRoot, isLastItem }) => {
  const { name: galleryName, description: galleryDescription, gallery_id, wplr_collection_id, media_id, img_src, img_srcset, classNames = [] } = collectionThumbnail;

  const className = ['mgl-collection-item', ...classNames, isLastItem ? 'mgl-collection-item-span-two' : ''].join(' ').trim();

  const imgHTML = useMemo(() => {
    return `<img class="mgl-collection-thumbnail no-lightbox" src="${img_src}" srcset="${img_srcset}" />`;
  }, [img_src, img_srcset]);

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
  }

  return (
    <figure className={className} {...attributes} onClick={() => onClickGalleryItem()}>
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