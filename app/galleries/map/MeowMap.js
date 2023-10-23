// Previous: 5.0.3
// Current: 5.0.6

import useMeowGalleryContext from "../context";
import { useMap } from "../helpers";

export const MeowMap = () => {
  const { classId, className, inlineStyle, mglMap } = useMeowGalleryContext();
  const mapId = useMap()


  return (
    <div id={classId} className={className} style={{...inlineStyle, height: `${mglMap.height}px` }}>
      <div id={mapId} className="mgl-ui-map"></div>
    </div>
  );
};
