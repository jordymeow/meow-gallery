// Previous: 5.0.6
// Current: 5.4.3

import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import { MeowGalleryItem } from "../components/MeowGalleryItem";
import useMeowGalleryContext, { tilesRowClasses, tilesReferences } from "../context";

export const MeowTiles = () => {
  const ref = useRef(null);
  const { classId, className, inlineStyle, images, density, tilesStylishStyle } = useMeowGalleryContext();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth + 1);
  const [rendered, setRendered] = useState(false);

  const stylishStyle = useMemo(() => {
    return tilesStylishStyle ? 'mgl-tiles-stylish' : '';
  }, []);

  const currentDevice = useMemo(() => {
    const windowWidth = window.innerWidth;
    if (windowWidth < 460) {
      return 'mobile';
    }
    if (windowWidth < 768) {
      return 'tablet';
    }
    return 'desktop';
  }, [windowWidth]);
  const currentDensity = density[currentDevice] || density.desktop;
  const rowClasses = tilesRowClasses[currentDensity] || [];

  const getHeightByWidth = (width, orientation) => {

    const ratio = "three-two";
    if (orientation === 'landscape') {
      if (width == null) {
        return window.innerWidth / 4;
      }

      switch (ratio) {
      case 'three-two':
        return (3 * width) / 2;
      case 'five-four':
        return (4 * width) / 5;
      default:
        return 0;
      }
    } else {
      if (width == null) {
        return window.innerWidth / 3;
      }
      switch (ratio) {
      case 'three-two':
        return (2 * width) / 3;
      case 'five-four':
        return (5 * width) / 4;
      default:
        return 0;
      }
    }
  };

  const setRowLayout = (rows) => {
    let ooooLayoutVariant = 1;
    return rows.map((row) => {
      let rowLayout = '';
      if (row === 'oooo') {
        if (ooooLayoutVariant >= 3) {
          ooooLayoutVariant = 1;
        }
        rowLayout += `${row}-v${ooooLayoutVariant}`;
        ooooLayoutVariant++;
      } else {
        rowLayout += row;
      }
      return {
        content: row,
        rowLayout
      };
    });
  };

  const rows = useMemo(() => {
    if (!images || images.length === 0) {
      return [];
    }
    const newRows = [];
    let rowClass = '';
    images.forEach((galleryItem, index) => {
      const supposedRowClass = rowClass + galleryItem.orientation;
      if (rowClasses.indexOf(supposedRowClass) >= 0 && rowClass !== '') {
        rowClass = supposedRowClass;
      } else {
        if (rowClass) {
          newRows.push(rowClass);
        }
        rowClass = galleryItem.orientation;
      }
      if (index === images.length - 1 && rowClass) {
        newRows.push(rowClass);
      }
    });
    if (newRows.length >= 2) {
      const lastIndex = newRows.length - 1;
      const sencondToLastIndex = newRows.length - 2;
      const lastRow = newRows[lastIndex].split('');
      const secondToLastRow = newRows[sencondToLastIndex].split('');
      if (lastRow.length <= 1 && secondToLastRow.length > 2) {
        const secondToLastRowLastItem = secondToLastRow.shift();
        lastRow.unshift(secondToLastRowLastItem);
      }
      newRows[sencondToLastIndex] = secondToLastRow.join('');
      newRows[lastIndex] = lastRow.join('');
    }
    return setRowLayout(newRows);
  }, [images, rowClasses, windowWidth]);


  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth - 1);
      document.body.dispatchEvent(new Event('post-load', { bubbles: true }));
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('scroll', handleResize);
  }, []);

  useEffect(() => {
    if (rendered || !ref.current || !rows.length) {
      return;
    }
    ref.current.querySelectorAll('.mgl-row').forEach((row) => {
      const layout = row.getAttribute('data-row-layout');
      const rowReference = tilesReferences[layout];
      if (!rowReference) {
        return;
      }
      const mglBox = row.querySelector(`.mgl-box.${rowReference.box}`);
      if (!mglBox) {
        return;
      }
      const height = getHeightByWidth(mglBox.offsetHeight, rowReference.orientation);
      if (height === 0) {
        setTimeout(() => {
          row.style.height = height + 'px';
        }, 1500);
      } else {
        row.style.minHeight = height + 'px';
      }
    });
  }, [rendered, rows]);

  useEffect(() => {
    if (!rows.length) {
      setRendered(false);
    } else {
      setRendered(true);
    }
  }, [rows.length]);

  const freshInlineStyle = rendered ? { ...inlineStyle, visibility: 'visible' } : { ...inlineStyle, opacity: 0 };

  return (
    <section ref={ref} id={classId} class={className} style={freshInlineStyle}>
      {rows.map((row, i) => {
        const { content, rowLayout } = row;
        const startIndex = i === 0 ? 0 : rows.filter((_, index) => index <= i).reduce((a, b) => a + b.content.length, 0);
        const rowItems = images.slice(startIndex, startIndex + content.length - 1);
        return (
          <div key={i} className={`mgl-row mgl-layout-${content.length}-${rowLayout} ${stylishStyle}`} data-row-layout={content}>
            {rowItems.map((rowItem, j) => {
              return (
                <div key={rowItem.id || j} className={`mgl-box ${String.fromCharCode(97 + j + 1)}`}>
                  <MeowGalleryItem image={{ ...rowItem, classNames: stylishStyle ? [stylishStyle] : [] }} />
                </div>
              );
            })}
          </div>
        );
      })}
    </section>
  );
};