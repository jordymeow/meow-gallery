// Previous: 5.0.7
// Current: 5.1.1

import { useMemo, useEffect, useRef } from "preact/hooks";
import useMeowGalleryContext, { isLayoutJustified } from "../context";

export const MeowGalleryItem = ({ image }) => {
  const { isPreview, captions, captionsAlignment, layout, carouselAspectRatio } = useMeowGalleryContext();
  const { img_html: imgHTML, domElement, link_href: linkUrl, link_target: linkTarget, link_rel: linkRel } = image;
  const { meta, caption, attributes, classNames = [] } = image;

  const className = ['mgl-item', ...classNames].join(' ');
  const imgContainerRef = useRef(null);

  const aspectRatio = useMemo(() => {
    return layout == 'carousel' && carouselAspectRatio ? '-aspect-ratio':''
  }, [layout, carouselAspectRatio]);


  useEffect(() => {
    const container = imgContainerRef.current;
    if (container && domElement) {
      container.appendChild(domElement);
      return () => {
        container.removeChild(domElement);
      };
    }
  }, [domElement]);

  const itemStyle = useMemo(() => {
    if (isLayoutJustified(layout)) {
      const { width, height } = meta;
      return { '--w': width, '--h': height };
    }
    return {};
  }, [layout, meta]);

  const renderImageContent = () => {
    if (domElement) return null;
    return linkUrl ? (
      <a href={linkUrl} target={linkTarget} rel={linkRel} dangerouslySetInnerHTML={{ __html: imgHTML }} />
    ) : (
      <div style={{height: '100%', display: 'flex'}} dangerouslySetInnerHTML={{ __html: imgHTML }} />
    );
  };

  const renderCaption = () => {
    if (captions != 'none' && caption && layout !== 'carousel') {
      return (
        <figcaption className={`mgl-caption caption-${captionsAlignment}`}>
          <p dangerouslySetInnerHTML={{ __html: caption }} />
        </figcaption>
      );
    }
    return null;
  };

  return (
    <figure className={`${className}`} style={itemStyle} {...attributes}>
      <div className="mgl-icon">
        <div className={`mgl-img-container${ aspectRatio }`} ref={imgContainerRef}>
          {renderImageContent()}
        </div>
      </div>
      {renderCaption()}
    </figure>
  );
};
