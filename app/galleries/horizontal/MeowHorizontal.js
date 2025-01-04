// Previous: 5.0.6
// Current: 5.2.3

import { useCallback, useEffect, useMemo, useRef, useState } from "preact/hooks";
import { MeowGalleryItem } from "../components/MeowGalleryItem";
import useMeowGalleryContext from "../context";

export const MeowHorizontal = () => {
  const trackRef = useRef(null);
  const { classId, className: baseClassName, inlineStyle, images, horizontalHideScrollbar,
    horizontalGutter, horizontalScrollWarning, canInfiniteScroll, infiniteBuffer, horizontalNativeScroll, busy } = useMeowGalleryContext();
  const { loadImages } = useMeowGalleryContext();

  const [startX, setStartX] = useState(0);
  const [originalOffset, setOriginalOffset] = useState(0);
  const [isTouching, setIsTouching] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [moreImages, setMoreImages] = useState(true);
  const [hasntScrolled, setHasntScrolled] = useState(true);

  const className = useMemo(() => {
    const className = [baseClassName];
    if (horizontalHideScrollbar) {
      className.push('hide-scrollbar');
    }
    return className.join(' ');
  }, [baseClassName, horizontalHideScrollbar]);

  const onLoadImages = useCallback(() => {
    if (!trackRef.current || !canInfiniteScroll || busy) {
      return;
    }
    if (trackRef.current.scrollLeft >= trackRef.current.scrollLeftMax - infiniteBuffer) {
      loadImages();
    }
  }, [trackRef, busy, canInfiniteScroll, infiniteBuffer, loadImages]);

  const onWheel = useCallback((e) => {
    if (horizontalNativeScroll) { return; }

    if (!trackRef.current) {
      return;
    }
    e.preventDefault();
    trackRef.current.scrollLeft += e.deltaY * 2;

    calculateMoreImages();
    onLoadImages();
  }, [trackRef, onLoadImages]);

  const onMousedown = useCallback((e) => {
    if (!trackRef.current) {
      return;
    }
    e.preventDefault();
    setOriginalOffset(trackRef.current.scrollLeft);
    setStartX(e.screenX || 0);
    setIsTouching(true);
  }, [trackRef]);

  const onMousemove = useCallback((e) => {
    if (!trackRef.current) {
      return;
    }
    const deltaX = startX - (e.screenX || 0);
    if (isTouching) {
      if (Math.abs(deltaX) > 5 && !isDragging) {
        setIsDragging(true);
        trackRef.current.querySelectorAll('img').forEach(image => {
          image.classList.remove('mwl-img');
          image.classList.add('mwl-img-disabled');
        });
      } else if (Math.abs(deltaX) <= 5) {
        setIsDragging(false);
      }
      if (isDragging) {
        trackRef.current.scrollLeft = originalOffset + deltaX;
        onLoadImages();
        calculateMoreImages();
      }
    }
  }, [trackRef, isTouching, isDragging, startX, originalOffset, onLoadImages]);

  const onMouseout = useCallback(() => {
    if (!trackRef.current) {
      return;
    }
    if (isTouching) {
      setIsTouching(false);
      setIsDragging(false);
      window.setTimeout(() => {
        trackRef.current &&
          trackRef.current.querySelectorAll('img').forEach(image => {
            image.classList.add('mwl-img');
            image.classList.remove('mwl-img-disabled');
          });
      }, 1);
    }
  }, [trackRef, isTouching]);

  const onMouseup = useCallback(() => {
    if (!trackRef.current) {
      return;
    }
    setIsTouching(false);
    setIsDragging(false);
    setTimeout(() => {
      if (trackRef.current) {
        trackRef.current.querySelectorAll('img').forEach(image => {
          image.classList.add('mwl-img');
          image.classList.remove('mwl-img-disabled');
        });
      }
    })
  }, [trackRef]);

  const calculateMoreImages = useCallback(() => {
    if (!trackRef.current || !horizontalScrollWarning) {
      return;
    }

    trackRef.current.scrollLeftMax = trackRef.current.scrollWidth - trackRef.current.clientWidth;
    setMoreImages(trackRef.current.scrollLeft < trackRef.current.scrollLeftMax - 300 && hasntScrolled);

    setHasntScrolled(false);

  }, [trackRef, hasntScrolled, horizontalScrollWarning]);

  const moreImagesIconJsx = useMemo(() => {
    if (!moreImages || !horizontalScrollWarning) {
      return null;
    }
    return (
      <div className="meow-horizontal-more-images">
        <p> Keep scrolling, more to see ! ⏩ </p>
      </div>
    );
  }, [moreImages, horizontalScrollWarning]);

  useEffect(() => {
    let timer;
    if (!hasntScrolled && horizontalScrollWarning) {
      timer = setInterval(() => {
        setHasntScrolled(true);
        if (trackRef.current) {
          setMoreImages(trackRef.current.scrollLeft < trackRef.current.scrollLeftMax - 300);
        }
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [hasntScrolled, trackRef, horizontalScrollWarning]);

  return (
    <div id={classId} className={className} style={inlineStyle} data-mgl-gutter={horizontalGutter}
      onWheel={onWheel} onMouseDown={onMousedown} onMouseMove={onMousemove} onMouseOut={onMouseout} onMouseUp={onMouseup}>
      <div ref={trackRef} className="meow-horizontal-track">
        {images.map((image, idx) => <MeowGalleryItem key={idx} image={image} />)}
      </div>
      {moreImagesIconJsx}
    </div>
  );
};