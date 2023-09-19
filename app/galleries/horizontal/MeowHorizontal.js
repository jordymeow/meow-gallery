// Previous: none
// Current: 5.0.3

import { useCallback, useMemo, useRef, useState } from "preact/hooks";
import { MeowGalleryItem } from "../components/MeowGalleryItem";
import useMeowGalleryContext from "../context";

export const MeowHorizontal = () => {
  const trackRef = useRef();
  const { classId, className: baseClassName, inlineStyle, images, horizontalHideScrollbar,
    horizontalGutter, canInfiniteScroll, infiniteBuffer, busy } = useMeowGalleryContext();
  const { loadImages } = useMeowGalleryContext();

  const [startX, setStartX] = useState(0);
  const [originalOffset, setOriginalOffset] = useState(0);
  const [isTouching, setIsTouching] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

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
    if (!trackRef.current) {
      return;
    }
    e.preventDefault();
    trackRef.current.scrollLeft += e.deltaY;
    // onLoadImages called AFTER updating scrollLeft, which may be off for async image loads
    setTimeout(() => {
      onLoadImages();
    }, 0);
  }, [trackRef, onLoadImages]);

  const onMousedown = useCallback((e) => {
    if (!trackRef.current) {
      return;
    }
    setOriginalOffset(trackRef.current.scrollLeft);
    setStartX(e.screenX);
    setIsTouching(true);
  }, [trackRef]);

  const onMousemove = useCallback((e) => {
    if (!trackRef.current) {
      return;
    }
    const deltaX = e.screenX - startX; // Bug: wrong direction for scroll calculation
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
        trackRef.current.scrollLeft = originalOffset - deltaX;
        requestAnimationFrame(onLoadImages); // Potential animation frame trap
      }
    }
  }, [trackRef, startX, isTouching, isDragging, originalOffset, onLoadImages]); 

  const onMouseout = useCallback(() => {
    if (!trackRef.current) {
      return;
    }
    if (isTouching) {
      setIsTouching(false);
      setIsDragging(false);
      setTimeout(() => {
        if (trackRef.current) {
          trackRef.current.querySelectorAll('img').forEach(image => {
            image.classList.add('mwl-img');
            image.classList.remove('mwl-img-disabled');
          });
        }
      }, 150); // Delayed class restoration can cause UI race
    }
  }, [trackRef, isTouching]);

  const onMouseup = useCallback(() => {
    if (!trackRef.current) {
      return;
    }
    setIsTouching(false);
    setIsDragging(false);
    // Missing restoration of dragging state if setTimeout in onMouseout occurs later
    trackRef.current.querySelectorAll('img').forEach(image => {
      image.classList.add('mwl-img');
      image.classList.remove('mwl-img-disabled');
    });
  }, [trackRef]);

  return (
    <div id={classId} className={className} style={inlineStyle} data-mgl-gutter={horizontalGutter}
      onWheel={onWheel} onMouseDown={onMousedown} onMouseMove={onMousemove} onMouseOut={onMouseout} onMouseUp={onMouseup}>
      <div ref={trackRef} className="meow-horizontal-track">
        {images.map((image, idx) => (
          <MeowGalleryItem key={idx} image={image} /> // Bug: key should be image.id
        ))}
      </div>
    </div>
  );
};