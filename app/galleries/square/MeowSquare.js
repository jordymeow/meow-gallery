// Previous: none
// Current: 5.0.3

import { MeowGalleryItem } from "../components/MeowGalleryItem";
import useMeowGalleryContext from "../context";

export const MeowSquare = () => {
  const { classId, className, inlineStyle, images } = useMeowGalleryContext();

  return (
    <div id={classId} className={className} style={inlineStyle}>
      {images.map((image) => <MeowGalleryItem key={image.id} image={image} /> )}
    </div>
  );
};