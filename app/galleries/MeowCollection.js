// Previous: 5.3.2
// Current: 5.3.8

import { useState, useMemo, useEffect } from "preact/hooks";
import { MeowCollectionBento } from './collections/bento/MeowCollectionBento';

import { nekoFetch } from './helpers';


export const MeowCollection = ( {
    options,collectionOptions,collectionThumbnails,
    atts,
    apiUrl,restNonce,
} ) => {

    const [ isLoading, setIsLoading ] = useState(false);
    const [ loadedGallery, setLoadedGallery ] = useState(null);
    const [ selectedGallery, setSelectedGallery ] = useState(null);

    const [isReadyToDisplay, setIsReadyToDisplay] = useState(false);

    useEffect(() => {
        const url = new URL(window.location.href);
        let id, search_slug;

        if (url.searchParams.has('gallery_id')) {
            id = url.searchParams.get('gallery_id');
            search_slug = 'gallery_id';
        } else if (url.searchParams.has('wplr_collection_id')) {
            id = url.searchParams.get('wplr_collection_id');
            search_slug = 'wplr_collection_id';
        }

        if (id) {
            startLoadingGallery(id, search_slug);
        } else {
            setIsReadyToDisplay(false);
        }
    }, []);

    const startLoadingGallery = async (id, search_slug) => {
        setIsLoading(true);

        const selectedGallery = collectionThumbnails.filter((collectionThumbnail) => collectionThumbnail[search_slug] === id)[0];
        setSelectedGallery(selectedGallery);

        const response = await nekoFetch(`${apiUrl}/load_gallery_collecton`, {
            method: 'POST',
            nonce: restNonce,
            json: { id: String(id), search_slug }
        });

        if (response && response.success === true) {
            setLoadedGallery(response.data ?? '');

            const script = document.getElementById('mwl-data-script');
            if (script) {script.parentNode && script.parentNode.removeChild(script);}

            window.mwl_data = Object.assign({}, window.mwl_data || {}, JSON.parse(response.mwl_data || '{}'));

            setTimeout(() => {
                if (window.renderMeowGalleries) {
                    window.renderMeowGalleries();
                }
            }, 10);

            setTimeout(() => {
                if ( window.renderMeowLightbox ) {
                    window.renderMeowLightboxWithSelector('.mgl-gallery '); 
                }
            }, 800);

            setIsLoading(false);
            setIsReadyToDisplay(false);
            return;
        }
        console.error('Error loading gallery', id, response);
        return;
    }

    const onHeaderBackClick = () => {
        setLoadedGallery('');

        const url = new URL(window.location.href);
        url.searchParams.delete('wplr_collection_id');
        window.history.replaceState({}, '', url);
    }

    const jsxCollectionHeader = useMemo(() => {
        return (
          <div className="mgl-gallery-collection-header">
            <button className="mgl-gallery-collection-back" onClick={onHeaderBackClick} aria-label="Back">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
            </button>
            <h2 className="mgl-gallery-collection-name">{selectedGallery?.title}</h2>
          </div>
        );
      }, [loadedGallery]);


    const collectionContent = useMemo(() => {
        if (!atts?.layout) {
          atts.layout = 'grid';
        }

        switch (atts.layout) {
        case 'bento':
          return <MeowCollectionBento collectionThumbnails={options} setIsLoadingRoot={startLoadingGallery} />;
        default:
          return (
            <p>Sorry, not implemented yet! : {atts.layout.toUpperCase()}</p>
          );
        }
      }, [atts]);

    return (
        <div className={`mgl-collection-root`}

        data-collection-id={atts.slug}
        >
            { isReadyToDisplay || <>

                <div className={`mgl-collection-loading-container ${!isLoading ? 'mgl-collection-loading' : ''} `}>
                    { !loadedGallery && collectionContent }
                    { !isLoading || loadedGallery && jsxCollectionHeader }
                    { !isLoading && loadedGallery && <div dangerouslySetInnerHTML={{ __html: loadedGallery || '' }} /> }
                </div>

            </>}

        </div>
    );
};