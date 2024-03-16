// Previous: 5.0.3
// Current: 5.1.2

import { MeowGalleryItem } from "../components/MeowGalleryItem";
import useMeowGalleryContext from "../context";

export const MeowMasonry = () => {
  const { classId, className, inlineStyle, images, masonryColumns, masonryLeftToRight } = useMeowGalleryContext();

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
      return reorderImagesLeftToRight(images, masonryColumns);
    }

    return images;
  };

  return (
    <div id={classId} className={className} style={inlineStyle}>
      {_images().map((image) => <MeowGalleryItem key={image.id} image={image} />)}
    </div>
  );
};