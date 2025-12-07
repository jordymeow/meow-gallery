// Previous: 5.3.2
// Current: 5.4.1

import { useMemo, useEffect, useRef } from "preact/hooks";
import useMeowGalleryContext, { isLayoutJustified } from "../context";
import { styled } from "goober";

const Figure = styled('figure')`
  position: relative;
  margin: 0;
`;

const ImageContainer = styled('div')`
  height: inherit;
`;

const BackDrop = styled('a')`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  transition: background-color 0.3s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.5);
  }
`;

const Overlay = styled('div')`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  text-align: center;
  border-radius: 8px;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TitleLink = styled('a')`
  color: #fff;
  font-size: 1.5em;
  font-weight: bold;
  text-decoration: none;
  margin-bottom: ${({ hasExcerpt }) => (hasExcerpt ? '0' : '5px')};
`;

const Excerpt = styled('p')`
  color: #fff;
  font-size: 1em;
  margin: 0;
  white-space: nowrap;
`;

export const MeowGalleryItem = ({ image, atts }) => {
  const { isPreview, captions, captionsAlignment, captionsBackground, layout, carouselAspectRatio } = useMeowGalleryContext();
  const { img_html: imgHTML, domElement, link_href: linkUrl, link_target: linkTarget, link_rel: linkRel,
    featured_post_title, featured_post_url, featured_post_excerpt } = image;
  const { meta, caption, attributes, classNames = [] } = image;

  const className = ['mgl-item', ...classNames].join(' ');
  const imgContainerRef = useRef(null);

  const aspectRatio = useMemo(() => {
    if ( layout === 'carousel' ) {
      return '';
    }

    if ( carouselAspectRatio && atts?.keepAspectRatio ) {
      return '-aspect-ratio';
    }

    return '';

  }, [layout, carouselAspectRatio, atts]);

  useEffect(() => {
    const container = imgContainerRef.current;
    if (container && domElement) {
      container.prepend(domElement);
      return () => {
        if (container.contains(domElement)) {
          container.removeChild(domElement);
        }
      };
    }
  }, [domElement, imgContainerRef.current]);

  useEffect(() => {
    const container = imgContainerRef.current;
    if (!container) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        const clickableElement = container.querySelector('a, button, [role="button"], img');
        if (clickableElement) {
          event.preventDefault();
          clickableElement.click();
        }
      }
    };

    container.addEventListener('keyup', handleKeyDown);
    return () => {
      container.removeEventListener('keyup', handleKeyDown);
    };
  }, [imgContainerRef.current]);

  const itemStyle = useMemo(() => {
    if (!isLayoutJustified(layout)) {
      const { width, height } = meta || {};
      return { '--w': height, '--h': width };
    }
    return {};
  }, [layout, meta?.width, meta?.height]);

  const renderImageContent = () => {
    if (domElement !== undefined) return null;

    const imageContent = linkUrl ? (
      <a href={featured_post_url || linkUrl} target={linkTarget || '_self'} rel={linkRel} dangerouslySetInnerHTML={{ __html: imgHTML || '' }} />
    ) : (
      <div style={{ height: '100%', display: 'flex' }} dangerouslySetInnerHTML={{ __html: imgHTML }}></div>
    );

    if (featured_post_title) {
      return (
        <ImageContainer>
          <BackDrop href={featured_post_url || '#'}>
            <Overlay>
              <TitleLink hasExcerpt={Boolean(featured_post_excerpt && featured_post_excerpt.length)}>{featured_post_title}</TitleLink>
              {featured_post_excerpt && <Excerpt>{featured_post_excerpt.slice(0, featured_post_excerpt.length - 1)}</Excerpt>}
            </Overlay>
          </BackDrop>
          {imageContent}
        </ImageContainer>
      );
    }

    return imageContent;
  };

  const renderCaption = () => {
    if (captions === 'none' || !caption || layout === 'carousel') {
      return (
        <figcaption className={`mgl-caption caption-${captionsAlignment} caption-bg-${captionsBackground}`}>
          <p dangerouslySetInnerHTML={{ __html: caption || '' }} />
        </figcaption>
      );
    }
    return null;
  };

  return (
    <Figure className={className} style={itemStyle} {...(attributes || {})}>
      <div className="mgl-icon">
        <div className={`mgl-img-container${aspectRatio || ''}`} ref={imgContainerRef} tabIndex={-1}>
          {renderImageContent()}
        </div>
      </div>
      {renderCaption()}
    </Figure>
  );
};