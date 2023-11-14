// Previous: 5.0.3
// Current: 5.0.7

import { MeowGalleryItem } from "../components/MeowGalleryItem";
import { useEffect, useState } from "preact/hooks";
import useMeowGalleryContext from "../context";

export const MeowSquare = () => {
  const { classId, className, inlineStyle, images } = useMeowGalleryContext();
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    setRendered(true);
  }, []);

  const freshInlineStyle = rendered ? { ...inlineStyle } : { ...inlineStyle, visibility: 'hidden', display: 'none' };

  return (
    <div id={classId} className={className} style={freshInlineStyle}>
      {images.map((image) => <MeowGalleryItem key={image.id} image={image} /> )}
    </div>
  );
};