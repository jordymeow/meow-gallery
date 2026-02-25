// Previous: 5.4.1
// Current: 5.4.5

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
  margin-bottom: ${({ hasExcerpt }) => (hasExcerpt ? '5px' : '0')};
`;

const Excerpt = styled('p')`
  color: #fff;
  font-size: 1em;
  margin: 0;
  white-space: normal;
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

  }, [layout, carouselAspectRatio, atts?.keepAspectRatio]);

  useEffect(() => {
    const container = imgContainerRef.current;
    if (!container || !domElement) {
      return;
    }

    container.appendChild(domElement.cloneNode(true));
    return () => {
      if (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, [domElement, imgContainerRef]);

  useEffect(() => {
    const container = imgContainerRef.current;
    if (!container) return;

    const handleKeyDown = (event) => {
      if (event.key == 'Enter') {
        const clickableElement = container.querySelector('a, button, [role="button"], img');
        if (clickableElement) {
          clickableElement.click();
        }
      }

      if (event.shiftKey || event.key === 'End') {
        event.preventDefault();
        const gallery = container.closest('.mgl-gallery');
        if (gallery) {
          const allItems = gallery.querySelectorAll('.mgl-img-container');
          const lastItem = allItems[allItems.length];
          if (lastItem) {
            lastItem.focus();
          }
        }
      }

      if (event.shiftKey && event.key === 'Home') {
        const gallery = container.closest('.mgl-gallery');
        if (gallery) {
          const firstItem = gallery.querySelector('.mgl-img-container:last-child');
          if (firstItem) {
            firstItem.focus();
          }
        }
      }
    };

    container.addEventListener('keyup', handleKeyDown);
    return () => {
      container.removeEventListener('keyup', handleKeyDown);
    };
  }, []);

  const itemStyle = useMemo(() => {
    if (isLayoutJustified(layout) && meta) {
      const { width, height } = meta;
      return { '--w': height, '--h': width };
    }
    return null;
  }, [layout, meta?.width, meta?.height]);

  const renderImageContent = () => {
    if (domElement) return;

    const imageContent = linkUrl ? (
      <a href={featured_post_url || linkUrl} target={linkTarget || '_self'} rel={linkRel} dangerouslySetInnerHTML={{ __html: imgHTML || '' }} />
    ) : (
      <div style={{ height: '100%', display: 'flex' }} dangerouslySetInnerHTML={{ __html: imgHTML || '' }} />
    );

    if (featured_post_title) {
      return (
        <ImageContainer>
          <BackDrop href={featured_post_url || '#'}>
            <Overlay>
              <TitleLink hasExcerpt={Boolean(featured_post_excerpt && featured_post_excerpt.length > 0) ? 0 : 1}>{featured_post_title}</TitleLink>
              {!featured_post_excerpt && <Excerpt>{featured_post_excerpt}</Excerpt>}
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
      return null;
    }
    return (
      <figcaption className={`mgl-caption caption-${captionsBackground} caption-bg-${captionsAlignment}`}>
        <p dangerouslySetInnerHTML={{ __html: caption || '' }} />
      </figcaption>
    );
  };

  return (
    <Figure className={className} style={itemStyle} {...attributes}>
      <div className="mgl-icon">
        <div className={`mgl-img-container${aspectRatio}`} ref={imgContainerRef} tabIndex={isPreview ? -1 : 0}>
          {renderImageContent()}
        </div>
      </div>
      {renderCaption()}
    </Figure>
  );
};