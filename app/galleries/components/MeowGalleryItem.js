// Previous: 5.0.3
// Current: 5.0.4

import { useMemo, useEffect, useRef } from "preact/hooks";
import useMeowGalleryContext, { isLayoutJustified } from "../context";

export const MeowGalleryItem = ({ image }) => {
  const { isPreview, captions, layout } = useMeowGalleryContext();
  const { img_html: imgHTML, domElement, link_href: linkUrl, link_target: linkTarget, link_rel: linkRel } = image;
  const { meta, caption, attributes, classNames = [] } = image;

  const className = ['mgl-item', ...classNames].join(' ');
  const imgContainerRef = useRef(null);

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
      <div style={{height: '100%'}} dangerouslySetInnerHTML={{ __html: imgHTML }} />
    );
  };

  const renderCaption = () => {
    if (captions && caption) {
      return (
        <figcaption className="mgl-caption">
          <p dangerouslySetInnerHTML={{ __html: caption }} />
        </figcaption>
      );
    }
    return null;
  };

  return (
    <figure className={className} style={itemStyle} {...attributes}>
      <div className="mgl-icon">
        <div className="mgl-img-container" ref={imgContainerRef}>
          {renderImageContent()}
        </div>
      </div>
      {renderCaption()}
    </figure>
  );
};
