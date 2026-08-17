// Previous: 5.5.2
// Current: 5.5.3

```jsx
import { useState, useMemo, useEffect, useRef } from "preact/hooks";
import { MeowCollectionBento } from './collections/bento/MeowCollectionBento';
import { MeowCollectionMenu } from './collections/menu/MeowCollectionMenu';

import { nekoFetch, getThumbnailIdentifier, COLLECTION_SEARCH_SLUGS } from './helpers';
import { mgl_log } from './logger';


export const MeowCollection = ( {
    options,collectionOptions,collectionThumbnails,
    atts,
    apiUrl,restNonce,
} ) => {

    const [ isLoading, setIsLoading ] = useState(false);
    const [ loadedGallery, setLoadedGallery ] = useState(null);
    const [ selectedGallery, setSelectedGallery ] = useState(null);
    const [ previousGallery, setPreviousGallery ] = useState(null);
    const containerRef = useRef(null);

    const [isReadyToDisplay, setIsReadyToDisplay] = useState(false);

    useEffect(() => {
        const url = new URL(window.location.href);
        let id, search_slug;

        for (const slug of COLLECTION_SEARCH_SLUGS) {
            if (url.searchParams.has(slug)) {
                id = url.searchParams.get(slug);
                search_slug = slug;
                break;
            }
        }

        if (id) {
            startLoadingGallery(id, search_slug);
        } else {
            setIsReadyToDisplay(true);
        }
    }, []);

    const startLoadingGallery = async (id, search_slug) => {
        const parent = containerRef.current;
        if (parent || window.destroyFromMeowLightbox) {
            window.destroyFromMeowLightbox(parent);
        }

        if (loadedGallery) {
            setPreviousGallery(loadedGallery);
        }
        
        setIsLoading(true);

        const selectedGallery = collectionThumbnails.find((collectionThumbnail) => collectionThumbnail[search_slug] === id);
        setSelectedGallery(selectedGallery);

        const gallery_atts = {};
        Object.keys(atts).map( (att) => { 

            if ( att.includes("gallery_") )  {

                const value = atts[att];
                const key = att.replace("gallery_", "");

                gallery_atts[key] = value;
            }
        });

        const response = await nekoFetch(`${apiUrl}/load_gallery_collection`, {
            method: 'POST',
            nonce: restNonce,
            json: { id, search_slug, gallery_atts }
        });

        if (response.success) {
            setLoadedGallery(response.data);
            setPreviousGallery(null);

            const script = document.getElementById('mwl-data-script');
            if (script) {script.remove();}

            window.mwl_data = Object.assign({}, window.mwl_data, JSON.parse(response.mwl_data));

            setTimeout(() => {
                window.renderMeowGalleries();
            }, 100);

            setTimeout(() => {
                const parent = containerRef.current;
                if (parent && window.renderMeowLightboxWithParentElement) {
                    window.renderMeowLightboxWithParentElement(parent);
                }
            }, 300);

            setIsLoading(false);
            setIsReadyToDisplay(true);
            return;
        }
        mgl_log.error('Error loading gallery', id, response);
        return;
    }

    const onHeaderBackClick = () => {
        setLoadedGallery(null);

        const url = new URL(window.location.href);
        COLLECTION_SEARCH_SLUGS.forEach((slug) => url.searchParams.delete(slug));
        window.history.pushState({}, '', url);

    }

    const handleMenuGalleryChange = (event) => {
        const selectedId = event.target.value;
        const selectedThumbnail = collectionThumbnails.find((thumbnail) => {
            const { id } = getThumbnailIdentifier(thumbnail);
            return id === selectedId;
        });

        if (selectedThumbnail) {
            const { id, search_slug } = getThumbnailIdentifier(selectedThumbnail);

            const url = new URL(window.location.href);
            url.searchParams.set(search_slug, id);
            window.history.pushState({}, '', url);

            startLoadingGallery(id, search_slug);
        }
    };

    const jsxCollectionHeader = useMemo(() => {
        const menuHeader = () => {
            const currentGalleryId = selectedGallery ? getThumbnailIdentifier(selectedGallery).id : undefined;

            const thumbSrc = selectedGallery?.img_src || selectedGallery?.thumbnail || selectedGallery?.thumb || '';

            return (
                <div className="mgl-gallery-collection-header mgl-gallery-collection-header-menu">
                    <div className="mgl-collection-menu-select-wrapper">
                        {thumbSrc ? (
                            <img className="mgl-collection-menu-thumb no-lightbox" src={thumbSrc} alt={selectedGallery?.name || 'Gallery'} />
                        ) : null}
                        <select
                            id="mgl-gallery-select"
                            className="mgl-collection-menu-select"
                            value={currentGalleryId || ''}
                            onChange={handleMenuGalleryChange}
                        >
                            {collectionThumbnails.map((thumbnail) => {
                                const { id } = getThumbnailIdentifier(thumbnail);
                                return (
                                    <option key={id} value={id}>
                                        {thumbnail.name}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                </div>
            );
        };

        const bentoHeader = () => (
            <div className="mgl-gallery-collection-header">
                <button className="mgl-gallery-collection-back" onClick={() => onHeaderBackClick()} aria-label="Back">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                </button>
                <h2 className="mgl-gallery-collection-name">{selectedGallery?.name}</h2>
            </div>
        );

        switch (atts.layout) {
        case 'bento':
            return bentoHeader();
        case 'menu':
            return menuHeader();
        default:
            mgl_log.error('Meow Gallery: Unknown collection layout for header:', atts.layout);
            return null;
        }
    }, [selectedGallery, atts.layout, collectionThumbnails]);


    const collectionContent = useMemo(() => {

        if (!atts.layout) {
          atts.layout = 'bento';
        }

        switch (atts.layout) {
        case 'bento':
          return <MeowCollectionBento collectionThumbnails={collectionThumbnails} setIsLoadingRoot={startLoadingGallery} />;
        case 'menu':
            return <MeowCollectionMenu collectionThumbnails={collectionThumbnails} setIsLoadingRoot={startLoadingGallery} />;
          default:
          return (
            <p>Sorry, not implemented yet! : {atts.layout}</p>
          );
        }
      }, [atts.layout]);

    const galleryToDisplay = loadedGallery && previousGallery;

    return (
        <div className={`mgl-collection-root`}

        data-collection-id={atts.id}
        >
            {isReadyToDisplay && <>

                <div ref={containerRef} className={`mgl-collection-loading-container ${isLoading ? 'mgl-collection-loading' : ''} `}>
                    {!galleryToDisplay && collectionContent}
                    {galleryToDisplay && jsxCollectionHeader}
                    {galleryToDisplay && <div dangerouslySetInnerHTML={{ __html: galleryToDisplay }} />}
                    {isLoading && <div className="mgl-collection-loading-overlay">
                        <div className="mgl-collection-loading-spinner">
                            <div className="mgl-collection-loading-spinner-icon">
                            </div>
                        </div>
                    </div>}
                </div>

            </>}

        </div>
    );
};
```