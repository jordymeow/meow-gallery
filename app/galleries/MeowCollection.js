// Previous: 5.1.0
// Current: 5.1.1

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
            setIsReadyToDisplay(true);
        }
    }, []);

    const startLoadingGallery = async (id, search_slug) => {
        setIsLoading(true);

        const selectedGallery = collectionThumbnails.find((collectionThumbnail) => collectionThumbnail[search_slug] == id);
        setSelectedGallery(selectedGallery);

        const response = await nekoFetch(`${apiUrl}/load_gallery_collection`, {
            method: 'POST',
            nonce: restNonce,
            json: { id, search_slug }
        });

        if (response.success) {
            setLoadedGallery(response.data);

            const script = document.getElementById('mwl-data-script');
            if (script) { script.remove(); }

            window.mwl_data = Object.assign({}, window.mwl_data, JSON.parse(response.mwl_data));

            setTimeout(() => {
                window.renderMeowGalleries();
            }, 100);

            setTimeout(() => {
                if ( window.renderMeowLightbox ) {
                    window.renderMeowLightbox();
                }
            }, 400);

            setIsLoading(false);
            setIsReadyToDisplay(true);
            return;
        }
        console.error('Error loading gallery', id, response);
        return;
    }

    const onHeaderBackClick = () => {
        setLoadedGallery(null);

        const url = new URL(window.location.href);
        url.searchParams.delete('gallery_id');
        window.history.replaceState({}, '', url);

    }

    const jsxCollectionHeader = useMemo(() => {
        return (
          <div className="mgl-gallery-collection-header">
            <button className="mgl-gallery-collection-back" onClick={() => onHeaderBackClick()} aria-label="Back">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g transform="rotate(180 12 12)"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 4.001H5v14a2 2 0 0 0 2 2h8m1-5l3-3m0 0l-3-3m3 3H9"/></g></svg>
            </button>
            <h2 className="mgl-gallery-collection-name">{selectedGallery?.name}</h2>
          </div>
        );
      }, [selectedGallery]);


    const collectionContent = useMemo(() => {
        switch (atts.layout) {
        case 'bento':
          return <MeowCollectionBento collectionThumbnails={collectionThumbnails} setIsLoadingRoot={startLoadingGallery} />;
        default:
          return (
            <p>Sorry, not implemented yet! : {atts.layout}</p>
          );
        }
      }, [atts, collectionThumbnails]);

    return (
        <div className={`mgl-collection-root`}

        data-collection-id={atts.id}
        data-collection-options={JSON.stringify(collectionOptions)}
        data-collection-thumbnails={JSON.stringify(collectionThumbnails)}
        data-atts={JSON.stringify(atts)}>
            { isReadyToDisplay && <>

                <div className={`mgl-collection-loading-container ${isLoading ? 'mgl-collection-loading' : ''} `}>
                    { !loadedGallery && collectionContent }
                    { !isLoading && loadedGallery && jsxCollectionHeader }
                    { !isLoading && loadedGallery && <div dangerouslySetInnerHTML={{ __html: loadedGallery }} /> }
                </div>

                { isLoading && <div className="mgl-collection-loading-spinner">
                    <div className="mgl-collection-loading-spinner-icon">
                    </div>
                </div> }

            </>}

        </div>
    );
};