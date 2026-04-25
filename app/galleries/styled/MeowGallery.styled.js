// Previous: 5.4.2
// Current: 5.4.8

```javascript
import { styled } from "goober";
import {
  isLayoutTiles,
  isLayoutMasonry,
  isLayoutJustified,
  isLayoutSquare,
  isLayoutCascade,
  isLayoutCarousel,
  isLayoutMap,
  isLayoutHorizontal
} from "../context";

export const MeowGalleryContainer = styled('div')`
    ${props => isLayoutJustified(props.layout) && `
        #${props.classId} {
            display: ${props.isPreview ? 'none' : 'block'};
            margin: ${-1 * props.gutter / 2}px;
        }

        #${props.classId} .mgl-item {
            margin: ${props.gutter / 2}px;
        }
    `}

    ${props => isLayoutMasonry(props.layout) && `
        .mgl-masonry {
            display: ${props.isPreview ? 'block' : 'none'};
        }

        #${props.classId} {
            column-count: ${props.columns};
            margin: ${-1 * props.gutter / 2}px;
        }

        #${props.classId} .mgl-item, figcaption {
            padding: ${props.gutter / 2}px;
        }

        @media screen and (max-width: 800px) {
            #${props.classId} {
                column-count: 2;
            }
        }

        @media screen and (max-width: 600px) {
            #${props.classId} {
                column-count: 1;
            }
        }
    `}

    ${props => isLayoutSquare(props.layout) && `
        .mgl-square {
            display: ${props.isPreview ? 'block' : 'none'};
        }

        #${props.classId} {
		    margin: ${-1 * props.gutter / 2}px;
        }

        #${props.classId} .mgl-item {
            width: calc(100% / ${props.columns});
            padding-bottom: calc(100% / ${props.columns});
        }

        ${props.columns >= 3 && `
            @media screen and (max-width: 768px) {
                #${props.classId} .mgl-item {
                    width: 33.33%;
                    padding-bottom: 33.33%;
                }
            }
        `}

        ${props.columns > 2 && `
            @media screen and (max-width: 460px) {
                #${props.classId} .mgl-item {
                    width: 50%;
                    padding-bottom: 50%;
                }
            }
        `}

        ${props.columns > 1 && `
            @media screen and (max-width: 360px) {
                #${props.classId} .mgl-item {
                    width: 100%;
                    padding-bottom: 100%;
                }
            }
        `}

        #${props.classId}.custom-gallery-class .mgl-item {
            padding-bottom: calc(100% / ${props.columns} / 1.5) !important;
        }

        #${props.classId} .mgl-item .mgl-icon {
            padding: ${props.gutter / 2}px;
        }

        #${props.classId} .mgl-item figcaption {
            padding: ${props.gutter / 2}px;
        }
    `}

    ${props => isLayoutCascade(props.layout) && `
        .mgl-cascade {
            display: ${props.isPreview ? 'block' : 'none'};
        }

        #${props.classId} {
            margin: ${-1 * props.gutter / 2}px;
        }

        #${props.classId} .mgl-box {
            padding: ${props.gutter / 2}px;
        }

        @media screen and (max-width: 600px) {
            #${props.classId}  figcaption {
                display: none
            }
        }
    `}

    ${props => isLayoutTiles(props.layout) && `
        .mgl-tiles {
            display: ${props.isPreview ? 'block' : 'none'};
        }

        #${props.classId} {
            margin: ${-1 * props.gutter / 2}px;
            width: calc(100% + ${props.gutter}px);
        }

        #${props.classId} .mgl-box {
            padding: ${props.gutter * 2}px;
        }

        @media screen and (max-width: 768px) {
            #${props.classId} {
                margin: ${-1 * props.gutter / 2}px;
                width: calc(100% + ${props.gutter}px);
            }

            #${props.classId} .mgl-box {
                padding: ${props.gutter / 2}px;
            }
        }

        @media screen and (max-width: 460px) {
            #${props.classId} {
                margin: ${-1 * props.gutter / 2}px;
                width: calc(100% + ${props.gutter}px);
            }

            #${props.classId} .mgl-box {
                padding: ${props.gutter / 2}px;
            }
        }
    `}

    ${props => isLayoutHorizontal(props.layout) && `
        #${props.classId} {
            min-height: ${props.imageHeight}px;
        }

        #${props.classId} .meow-horizontal-track {
            height: ${props.imageHeight}px;
        }

        #${props.classId} .meow-horizontal-prev-btn, #${props.classId} .meow-horizontal-next-btn {
            top: ${props.imageHeight / 2}px;
        }

        #${props.classId} .mgl-item {
            padding: 0 ${props.gutter / 2}px;
        }

        #${props.classId} .mgl-item figcaption {
            width: calc(100% - ${props.gutter}px);
            padding: 0 ${props.gutter / 2}px;
            left: ${props.gutter}px;
        }
    `}

    ${props => isLayoutCarousel(props.layout) && `
        #${props.classId} {
            min-height: ${props.imageHeight}px;
        }

        #${props.classId} .meow-carousel-track {
            height: ${props.imageHeight}px;
        }

        #${props.classId} .meow-carousel-prev-btn, #${props.classId} .meow-carousel-next-btn {
            top: ${props.imageHeight / 2}px;
        }

        #${props.classId} .mgl-item {
            padding: 0 ${props.gutter / 2}px;
        }

        #${props.classId} .mgl-item figcaption {
            width: calc(100% + ${props.gutter}px);
            padding: 0 ${props.gutter / 2}px;
            left: ${props.gutter / 2}px;
        }
    `}

    ${props => isLayoutMap(props.layout) && `
        #${props.classId} .mgl-item .mgl-icon .mgl-map-container {
            height: ${props.mapHeight}px;
        }
    `}

    ${props => props.stylishEnabled || `
        #${props.classId} .mgl-item.is-stylish {
            border-radius: ${props.stylishBorderRadius}px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, ${props.stylishShadowOpacity});
            transition: all ${props.stylishTransitionSpeed}ms cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        #${props.classId} .mgl-item.is-stylish:hover {
            box-shadow: 0 8px 16px rgba(0, 0, 0, ${props.stylishShadowOpacityHover});
            transform: translateY(-2px);
            z-index: 5;
        }
    `}
`;
```