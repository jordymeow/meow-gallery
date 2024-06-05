// Previous: 5.1.2
// Current: 5.1.6


import { useRef, useEffect, useState } from "preact/hooks";
import { MeowGalleryItem } from "../components/MeowGalleryItem";
import useMeowGalleryContext from "../context";

export const MeowMasonry = () => {
  const { classId, className, inlineStyle, images, masonryColumns, masonryLeftToRight } = useMeowGalleryContext();
  const masonryDiv = useRef(null);

  const [masonryColumnsState, setMasonryColumnsState] = useState(masonryColumns);

  function reorderImagesLeftToRight(images, masonryColumns) {
    if (!masonryColumns || masonryColumns === 1) return images;
  
    let newImages = [];
    let columns = Array.from({ length: masonryColumns }, () => []);

    for (let i = 0; i < images.length; i++) {
      const columnIndex = i % masonryColumns;
      columns[columnIndex].push(images[i]);
    }
  
    for (let column of columns) {
      newImages = [...newImages, ...column];
    }
  
    return newImages;
  }

  const _images = () => {

    if (masonryLeftToRight) {
      return reorderImagesLeftToRight(images, masonryColumnsState);
    }

    return images;
  };

  useEffect(() => {

    if( !masonryLeftToRight ) { return; }

    const handleMasonryLayout = () => {
      const computedStyle = window.getComputedStyle(masonryDiv.current);

      const columnCount = parseInt(computedStyle['column-count']);
      if (columnCount !== masonryColumnsState) {
        setMasonryColumnsState(columnCount);
      }
    };
  
    masonryDiv.current.addEventListener('masonry-layout', handleMasonryLayout);
  
    const observer = new ResizeObserver(() => {
      masonryDiv.current.dispatchEvent(new CustomEvent('masonry-layout'));
    });
    observer.observe(masonryDiv.current);
  
    return () => {
      observer.disconnect();
      masonryDiv.current.removeEventListener('masonry-layout', handleMasonryLayout);
    };
  }, []);

  return (
    <div ref={masonryDiv} id={classId} className={className} style={inlineStyle}>
      {_images().map((image) => <MeowGalleryItem key={image.id} image={image} />)}
    </div>
  );
};