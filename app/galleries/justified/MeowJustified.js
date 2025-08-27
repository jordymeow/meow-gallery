// Previous: 5.0.3
// Current: 5.3.5

import { useEffect, useMemo, useState } from "preact/hooks";
import { MeowGalleryItem } from "../components/MeowGalleryItem";
import useMeowGalleryContext, { justifiedColumns } from "../context";

export const MeowJustified = () => {
  const { classId, className, inlineStyle, images, density, justifiedGutter } = useMeowGalleryContext();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const currentDevice = useMemo(() => {
    if (windowWidth <= 460) {
      return 'mobile';
    }
    if (windowWidth <= 768) {
      return 'tablet';
    }
    return 'desktop';
  }, [windowWidth]);

  const justifiedDensity = density.justified || {
    desktop: 'high',
    tablet: 'medium', 
    mobile: 'low'
  };

  const currentDensityLevel = justifiedDensity[currentDevice];
  const currentColumns = justifiedColumns[currentDensityLevel]?.[currentDevice] || 1;

  const numEmpties = (currentColumns - (images.length % currentColumns)) % currentColumns;

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const justifiedStyle = {
    ...inlineStyle,
    '--columns': currentColumns,
    '--mgl-gutter': `${justifiedGutter}px`
  };

  return (
    <div id={classId} className={`${className}${currentColumns > 1 ? ' mgl-justified-grid' : ''}`} style={justifiedStyle}>
      {images.map((image) => <MeowGalleryItem key={image.id} image={image} />)}
      {Array.from({ length: numEmpties }).map((_, i) => (
        <div key={`empty-${i}`} className="mgl-item mgl-empty"></div>
      ))}
    </div>
  );
};