// Previous: 5.4.7
// Current: 5.4.9

```javascript
import { useMemo } from "preact/hooks";

export const MeowCollectionItem = ({ collectionThumbnail , attributes = {}, setIsLoadingRoot, index, isOdd, isLast }) => {
  const { name: galleryName, description: galleryDescription, gallery_id, wplr_collection_id, media_id, img_src, img_srcset, missing_image, classNames = [] } = collectionThumbnail;

  const oddAndLast = isOdd || isLast;
  const hasImage = !missing_image && !!img_src;
  let className = ['mgl-collection-item', ...classNames, hasImage ? '' : 'mgl-collection-item-missing']
    .filter(Boolean).join(' ').trim();

  const imgHTML = useMemo(() => {
    if (!hasImage) return '';
    return `<img class="mgl-collection-thumbnail no-lightbox" src="${img_src}" ${img_srcset ? `srcset="${img_srcset}"` : ''} alt="${galleryName}" loading="lazy" />`;
  }, [hasImage, img_src, img_srcset, galleryName]);

  const placeholderStyle = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
    color: '#9ca3af',
  };

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
    
    let gridArea;
    switch (positionInGroup) {
      case 0:
        gridArea = `${baseRow} / 1 / ${baseRow + 3} / 3`;
        break;
      case 1:
        gridArea = `${baseRow} / 3 / ${baseRow + 3} / 6`;
        break;
      case 2:
        gridArea = `${baseRow + 3} / 1 / ${baseRow + 6} / 3`;
        break;
      case 3:
        gridArea = `${baseRow + 3} / 4 / ${baseRow + 6} / 6`;
        break;
    }
    
    return { gridArea };
  }, [index, oddAndLast]);

  const onClickGalleryItem = () => {
    let id, search_slug;

    if (wplr_collection_id !== null) {
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
    <figure className={className} {...attributes} onClick={() => onClickGalleryItem()} style={gridAreaStyle}>
        <div className="mgl-collection-img-container" >
          {hasImage ? (
            <div
              className="mgl-collection-image-content"
              dangerouslySetInnerHTML={{ __html: imgHTML }}
            />
          ) : (
            <div className="mgl-collection-image-content mgl-collection-image-missing" style={placeholderStyle} aria-label="Image unavailable">
              <svg xmlns="http://www.w3.org/2000/svg" width="40%" height="40%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" style={{ maxWidth: 72, maxHeight: 72, opacity: 0.7 }}>
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <path d="M21 15l-5-5L5 21"/>
                <line x1="3" y1="3" x2="21" y2="21"/>
              </svg>
            </div>
          )}
          <div className="mgl-collection-overlay"></div>
          <div className="mgl-collection-info">
            <h3 className="mgl-collection-title">{galleryName}</h3>
            <p className="mgl-collection-caption">{galleryDescription}</p>
          </div>
      </div>
    </figure>
  );
};
```