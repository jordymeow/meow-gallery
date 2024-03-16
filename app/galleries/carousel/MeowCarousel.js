// Previous: 5.0.8
// Current: 5.1.2

import { useCallback, useEffect, useMemo, useRef, useState } from "preact/hooks";
import { MeowGalleryItem } from "../components/MeowGalleryItem";
import useMeowGalleryContext from "../context";
import { getCenterOffset, getTranslateValues } from "../helpers";

export const MeowCarousel = () => {
  const ref = useRef(null);
  const trackRef = useRef(null);
  const { classId, className, inlineStyle, images, carouselGutter, carouselArrowNavEnabled,
    carouselDotNavEnabled, carouselThumbnailNavEnabled, carouselCompact, carouselImmersive, carouselAutoplay, captions, atts } = useMeowGalleryContext();

  function getAttributeValue(attribute, defaultValue) {
    return attribute in atts ? atts[attribute] === "true" : defaultValue;
  }

  let _arrow_nav     = getAttributeValue('arrow', carouselArrowNavEnabled);
  let _dot_nav       = getAttributeValue('dot', carouselDotNavEnabled);
  let _thumbnail_nav = getAttributeValue('thumbnail', carouselThumbnailNavEnabled);
  let _compact       = getAttributeValue('compact', carouselCompact);
  let _immersive     = getAttributeValue('immersive', carouselImmersive);
  let _autoplay      = getAttributeValue('autoplay', carouselAutoplay);
  let _captions      = atts?.captions || captions;

  if (atts?.hero === "true") {
    _arrow_nav = false;
    _dot_nav = false;
    _thumbnail_nav = false;
    _compact = true;
    _immersive = true;
    _autoplay = true;
    _captions = 'none';
  }

  const [trackClassNames, setTrackClassNames] = useState([]);
  const [trackTransform, setTrackTransform] = useState('');
  const [trackWidth, setTrackWidth] = useState(0);
  const [mglItemElements, setMglItemElements] = useState([]);
  const [currentIndex, setCurrentIndex] = useState();
  const [isClicking, setIsClicking] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startMousePositionX, setStartMousePositionX] = useState(0);
  const [startTrackTranslation, setStartTrackTranslation] = useState(0);
  const [deltaMoveX, setDeltaMoveX] = useState(0);
  const [autoPlay, setAutoPlay] = useState(_autoplay ?? false);

  const [rendered, setRendered] = useState(false);

  const carouselItems = useMemo(() => {
    const numberOfImages = images.length;
    return numberOfImages === 0
      ? []
      : [
        { ...images.at(-2), classNames: ['clone', 'before-last-item', 'no-lightbox'] },
        { ...images.at(numberOfImages > 1 ? -1 : 0), classNames: ['clone', 'last-item', 'no-lightbox'] },
        ...images,
        { ...images.at(0), classNames: ['clone', 'first-item', 'no-lightbox'] },
        { ...images.at(numberOfImages > 1 ? 1 : 0), classNames: ['clone', 'after-last-item' , 'no-lightbox'] },
      ].map((image, index) => (
        {
          ...image,
          dataIndex: index,
          classNames: index === currentIndex ? [...(image.classNames ?? []), 'active'] : image.classNames,
          attributes: { ...image.attributes, 'data-mc-index': index }
        }
      ));
  }, [images, currentIndex]);
  const isCloneItem = useCallback((index) => carouselItems.find(v => v.dataIndex === index).classNames.includes('clone'), [carouselItems]);
  const currentItem = useMemo(() => carouselItems.find(v => v.dataIndex === currentIndex), [carouselItems, currentIndex]);
  const numberOfItems = carouselItems.length;
  const firstIndex = 2;
  const lastIndex = numberOfItems - 3;

  const slideCarouselTo = useCallback((destination, noTransition = false) => {
    if (!ref.current || !mglItemElements.length || destination == null) {
      return;
    }
    const newIndex = parseInt(destination);
    setTrackClassNames(noTransition ? ['no-transition'] : []);
    const nextElement = mglItemElements.find(v => v.dataIndex === newIndex).element;
    const tx = (-1 * (getCenterOffset(nextElement) - ref.current.offsetWidth / 2));
    setTrackTransform(`translate3d(${tx}px, 0, 0)`);

    if (noTransition) {
      setTimeout(() => {
        setTrackClassNames([]);
      }, 0);
    }
    setCurrentIndex(newIndex);
  }, [ref, mglItemElements]);

  const slideCarouselToPrev = useCallback(() => {
    let baseIndex = currentIndex;

    if(currentIndex === firstIndex) {
      slideCarouselTo(lastIndex+1, true);
      baseIndex = lastIndex+1;
    }

    setTimeout(() => {
      const prevIndex = baseIndex === 0 ? numberOfItems - 1 : baseIndex - 1;
      slideCarouselTo(prevIndex);
    }, 1);
  }, [isCloneItem, currentIndex, currentItem, numberOfItems, slideCarouselTo, autoPlay]);

  const slideCarouselToNext = useCallback(() => {
    let baseIndex = currentIndex;

    if(currentIndex === lastIndex) {
      slideCarouselTo(firstIndex-1, true);
      baseIndex = firstIndex-1;
    }

    setTimeout(() => {
      const nextIndex = baseIndex === numberOfItems - 1 ? 0 : baseIndex + 1;
      slideCarouselTo(nextIndex);
    }, 1);
  }, [isCloneItem, currentIndex, currentItem, carouselItems, numberOfItems, slideCarouselTo]);

  const checkForBorder = () => {
    if (!ref.current || !trackRef.current || !mglItemElements.length) {
      return false;
    }
    const carouselPosX = ref.current.getBoundingClientRect().left;
    const carouselCenterPosX = carouselPosX + ref.current.offsetWidth / 2;
    const leftLimit = mglItemElements[1].element.getBoundingClientRect().left + mglItemElements[1].element.offsetWidth / 2;
    const rightLimit = mglItemElements[mglItemElements.length - 2].element.getBoundingClientRect().left + mglItemElements[mglItemElements.length - 2].element.offsetWidth / 2;
    if (carouselCenterPosX - leftLimit <= 0) {
      slideCarouselTo(lastIndex, true);
      setStartTrackTranslation(parseFloat(getTranslateValues(trackRef.current)[0]));
      return true;
    }
    if (carouselCenterPosX - rightLimit >= 0) {
      slideCarouselTo(2, true);
      setStartTrackTranslation(parseFloat(getTranslateValues(trackRef.current)[0]));
      return true;
    }
    return false;
  };

  const getMagnetizedItem = () => {
    if (!ref.current) {
      return null;
    }
    const carouselPosX = ref.current.getBoundingClientRect().left;
    const carouselCenterPosX = carouselPosX + ref.current.offsetWidth / 2;
    let smallestMagnetization = false;
    let mostMagnetizedItem = 0;
    mglItemElements.forEach((data, index) => {
      const itemCenterOffset = data.element.getBoundingClientRect().left + data.element.offsetWidth / 2;
      const magnetization = Math.abs(carouselCenterPosX - itemCenterOffset);
      if (!smallestMagnetization || magnetization < smallestMagnetization) {
        smallestMagnetization = magnetization;
        mostMagnetizedItem = index;
      }
    });
    return mostMagnetizedItem;
  };

  const mouseDownHandler = useCallback((e) => {
    if (!trackRef.current) {
      return;
    }
    setIsClicking(true);
    if (e.type === 'touchstart') {
      setStartMousePositionX(e.touches[0].pageX);
    } else {
      setStartMousePositionX(e.clientX);
    }
    setStartTrackTranslation(parseFloat(getTranslateValues(trackRef.current)[0]));
  }, [trackRef]);

  const mouseMoveHandler = useCallback((e) => {
    if (!isClicking || !trackRef.current) {
      return;
    }
    trackRef.current.querySelectorAll('.mwl-img').forEach(mwlImage => {
      mwlImage.classList.remove('mwl-img');
      mwlImage.classList.add('mwl-img-disabled');
    });
    setIsDragging(true);
    trackRef.current.classList.add('no-transition');

    if (checkForBorder()) {
      setStartMousePositionX(e.clientX);
    } else {
      const newDeltaX = e.type === 'touchmove'
        ? startMousePositionX - e.touches[0].pageX
        : startMousePositionX - e.clientX;
      setDeltaMoveX(newDeltaX);
      trackRef.current.style.transform = 'translate3d(' + (startTrackTranslation - newDeltaX) + 'px, 0, 0)';
    }
  }, [isClicking, trackRef, checkForBorder, startMousePositionX, startTrackTranslation]);

  const mouseUpHandler = useCallback(() => {
    if (!trackRef.current) {
      return;
    }
    const wasDragging = isDragging;
    trackRef.current.classList.remove('no-transition');
    setIsDragging(false);
    setIsClicking(false);
    if (wasDragging) {
      setTimeout(() => {
        document.querySelectorAll('.mwl-img-disabled').forEach(disabledImages => {
          disabledImages.classList.remove('mwl-img-disabled');
          disabledImages.classList.add('mwl-img');
        });
      }, 0);
      const mostMagnetizedItem = getMagnetizedItem();
      if (mostMagnetizedItem === currentIndex && deltaMoveX >= 80) {
        slideCarouselToNext();
      }
      if (mostMagnetizedItem === currentIndex && deltaMoveX <= -80) {
        slideCarouselToPrev();
      }

      slideCarouselTo(mostMagnetizedItem);
      return false;
    }
  }, [trackRef, isDragging, currentIndex, deltaMoveX, slideCarouselToNext, slideCarouselToPrev, getMagnetizedItem]);

  const autoPlayHandler = useCallback(() => {
    setAutoPlay(!autoPlay);
  }, [autoPlay]);

  const autoPlayButtonJsx = useMemo(() => {
    return (
      <div className="meow-carousel-autoplay-btn" onClick={autoPlayHandler}>
        { autoPlay &&
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256 256-114.6 256-256S397.4 0 256 0zm0 480C132.5 480 32 379.5 32 256S132.5 32 256 32s224 100.5 224 224-100.5 224-224 224z" />
          <path d="M352.5 256L192 352V160z" />
        </svg> }
        { !autoPlay &&
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256 256-114.6 256-256S397.4 0 256 0zm0 480C132.5 480 32 379.5 32 256S132.5 32 256 32s224 100.5 224 224-100.5 224-224 224z" />
        </svg> }
      </div>
    );
  }, [autoPlayHandler, autoPlay]);

  const arrowNavigationJsx = useMemo(() => {
    return (
      <>
          <div className="meow-carousel-prev-btn" onClick={slideCarouselToPrev}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M217.9 256L345 129c9.4-9.4 9.4-24.6 0-33.9-9.4-9.4-24.6-9.3-34 0L167 239c-9.1 9.1-9.3 23.7-.7 33.1L310.9 417c4.7 4.7 10.9 7 17 7s12.3-2.3 17-7c9.4-9.4 9.4-24.6 0-33.9L217.9 256z" />
            </svg>
          </div>
          <div className="meow-carousel-next-btn" onClick={slideCarouselToNext}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M294.1 256L167 129c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.3 34 0L345 239c9.1 9.1 9.3 23.7.7 33.1L201.1 417c-4.7 4.7-10.9 7-17 7s-12.3-2.3-17-7c-9.4-9.4-9.4-24.6 0-33.9l127-127.1z" />
            </svg>
          </div>
        </>
    );
  }, [slideCarouselToPrev, slideCarouselToNext]);

  const thumbnailNavigationJsx = useMemo(() => {
    const compact = _compact ? 'meow-inside-top' : '';
    const hasTooManyThumbnails = (carouselItems.length-4) > 25 ? 'meow-nowrap' : '';
    const visibleOffset = currentIndex-firstIndex-5 < 0 ? 0 : currentIndex-firstIndex-5;
    const thumbnailWrapOffset = Math.floor((visibleOffset) * 60) + 5; 

    return (
      <div
      className={`meow-carousel-nav-thumbnails-container ${hasTooManyThumbnails} ${compact}`}
      style={{ transform: `translateX(-${hasTooManyThumbnails ? thumbnailWrapOffset : 0}px)` }}
      >
          {carouselItems.map((image) => {
            if (Object.hasOwn(image, 'classNames') && image.classNames?.includes('clone')) {
              return null;
            }
            const classNames = ['meow-carousel-nav-thumbnail'];
            if (image.dataIndex === currentIndex) {
              classNames.push('active');
            } else if (image.dataIndex === firstIndex && lastIndex < currentIndex
              || image.dataIndex === lastIndex && firstIndex > currentIndex
            ) {
              classNames.push('active');
            }

            return (
              <div key={image.dataIndex} className={`${classNames.join(' ')} no-lightbox`} onClick={() => slideCarouselTo(image.dataIndex)}
                dangerouslySetInnerHTML={{ __html: image.img_html }} />
            );
          }).filter((image) => image !== null)}
      </div>
    );
  }, [carouselItems, currentIndex, slideCarouselTo]);

  const dotNavigationJsx = useMemo(() => {
    const compact = _compact ? 'meow-inside-top' : '';
    const hasTooManyDots = (carouselItems.length-4) > 25 ? 'meow-nowrap' : '';
    const visibleOffset = currentIndex-firstIndex-10 < 0 ? 0 : currentIndex-firstIndex-10;
    const dotWrapOffset = Math.floor((visibleOffset) * 26) + 5;
    return (
      <div
      className={`meow-carousel-nav-dots-container ${hasTooManyDots} ${compact}`}
      style={{ transform: `translateX(-${hasTooManyDots ? dotWrapOffset : 0}px)` }}
      >
          {carouselItems.map((image) => {
            if (Object.hasOwn(image, 'classNames') && image.classNames?.includes('clone')) {
              return null;
            }
            const classNames = ['meow-carousel-nav-dot'];
            if (image.dataIndex === currentIndex) {
              classNames.push('active');
            } else if (image.dataIndex === firstIndex && lastIndex < currentIndex
              || image.dataIndex === lastIndex && firstIndex > currentIndex
            ) {
              classNames.push('active');
            }
            return (
              <div key={image.dataIndex} className={classNames.join(' ')} onClick={() => slideCarouselTo(image.dataIndex)}>
                <span></span>
              </div>
            );
          }).filter((image) => image !== null)}
        </div>
    );
  }, [carouselItems, currentIndex, slideCarouselTo]);

  const carouselCaptionsJsx = useMemo(() => {
    const compact = _compact ? 'meow-inside-bottom-text' : '';
    return (
      <div className={`meow-carousel-caption-container ${compact}`}>{
        carouselItems.map((image) => {
          if(image.caption === undefined || image.caption === '') { return null; }
          if (Object.hasOwn(image, 'classNames') && image.classNames?.includes('clone')) {
            return null;
          }
          const classNames = ['meow-carousel-caption'];
          if (image.dataIndex === currentIndex && image.caption) {
            classNames.push('active');
          } else if (image.caption && image.dataIndex === firstIndex && lastIndex < currentIndex
            || image.dataIndex === lastIndex && firstIndex > currentIndex
          ) {
            classNames.push('active');
          }

          return (
            <div key={image.dataIndex} className={`${classNames.join(' ')}`}>
            { _immersive && 
            <div className={"meow-immersive-caption"}
              style={`background: url('${image.img_html.match(/src="([^"]*)/)[1]}') no-repeat center center; background-size: cover;`} />
            }
              <p dangerouslySetInnerHTML={{ __html: image.caption }} />
            </div>
          );
        }).filter((image) => image !== null)
      }</div>
    );
  }, [carouselItems, currentIndex]);
    
  useEffect(() => {
    function resizeHandler() {
      slideCarouselTo(currentIndex, true);
    }
    window.addEventListener('resize', resizeHandler);
    return () => window.removeEventListener('resize', resizeHandler);
  }, [currentIndex, slideCarouselTo]);

  useEffect(() => {
    if (trackWidth === 0 && trackRef.current && carouselItems.length > 0) {
      const mglItemElements = Array.from(trackRef.current?.children);
      setTrackWidth(mglItemElements.reduce((a, b) => a + b.offsetWidth, 0));
      setMglItemElements(mglItemElements.map(element => ({ element, dataIndex: parseInt(element.getAttribute('data-mc-index')) })));
    }
  }, [trackRef.current?.children, carouselItems]);

  useEffect(() => {
    if (trackWidth > 0) {
      setTimeout(() => {
        slideCarouselTo(firstIndex, true);
      }, 300);
    }
  }, [trackWidth]);

  useEffect( () => {
      if(!autoPlay) {
        return;
      }
      let interval = setInterval(() => {
        setTimeout(() => {
          slideCarouselToNext();
        }, 10);
      }, 4000);

    return () => clearInterval(interval);
  }, [autoPlay, currentIndex] );

  useEffect(() => {
    setRendered(true);
  }, []);

  const freshInlineStyle = rendered ? { ...inlineStyle } : { ...inlineStyle, visibility: 'hidden', display: 'none' };

  return (
    <div ref={ref} id={classId} className={className} style={freshInlineStyle}
      data-mgl-gutter={carouselGutter}
      data-mgl-arrow_nav={_arrow_nav}
      data-mgl-dot_nav={_dot_nav}>
      <div ref={trackRef} className={['meow-carousel-track', ...trackClassNames].join(' ')} style={{ width: `${trackWidth}px`, transform: trackTransform, opacity: currentIndex != null ? 1 : 0 }}
        onMouseDown={mouseDownHandler}
        onTouchStart={mouseDownHandler}
        onMouseMove={mouseMoveHandler}
        onTouchMove={mouseMoveHandler}
        onMouseUp={mouseUpHandler}
        onTouchEnd={mouseUpHandler}>
        {carouselItems.map((image) => <MeowGalleryItem key={image.dataIndex} image={image} />)}
      </div>

      { _autoplay && autoPlayButtonJsx }

      { _arrow_nav && arrowNavigationJsx }

      { _captions != 'none' && carouselCaptionsJsx } 

      { _thumbnail_nav && thumbnailNavigationJsx }

      { _dot_nav && dotNavigationJsx } 
    </div>
  );
};