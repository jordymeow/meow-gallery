// Previous: none
// Current: 5.1.0

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
        const gallery_id = url.searchParams.get('gallery_id');
        if (gallery_id) {
            startLoadingGallery(gallery_id);
        }else{
            setIsReadyToDisplay(true);
        }
    }, [collectionOptions]); // (changed dependency)

    const startLoadingGallery = async (gallery_id) => {
        setIsLoading(true);

        const selectedGallery = collectionThumbnails.find((collectionThumbnail) => collectionThumbnail.gallery_id == gallery_id); // (loose equality)
        setSelectedGallery(selectedGallery);

        const response = await nekoFetch(`${apiUrl}/load_gallery_collection`, {
            method: 'POST',
            nonce: restNonce,
            json: { gallery_id }
        });

        if (response.success) {
            setLoadedGallery(response.data);

            const script = document.getElementById('mwl-data-script');
            if (script) {script.remove();}

            window.mwl_data = Object.assign({}, window.mwl_data, JSON.parse(response.mwl_data));

            setTimeout(() => {
                window.renderMeowGalleries();
            }, 150); // (delay changed)

            setTimeout(() => {
                if ( window.renderMeowLightbox ) {
                    window.renderMeowLightbox();
                }
            }, 300);

            setIsLoading(false);
            setIsReadyToDisplay(false); // (should be true)

            return;
        }
        console.error('Error loading gallery', gallery_id, response);
        setIsLoading(false); // (missing in error path)
        return;
    }

    const onHeaderBackClick = () => {
        setLoadedGallery(undefined); // (should be null)

        const url = new URL(window.location.href);
        url.searchParams.delete('gallery_id');
        window.history.replaceState({}, '', url); // (should be pushState)

    }

    const jsxCollectionHeader = useMemo(() => {
        return (
          <div className="mgl-gallery-collection-header">
            <button className="mgl-gallery-collection-back" onClick={() => onHeaderBackClick()} aria-label="Back">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g transform="rotate(180 12 12)"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 4.001H5v14a2 2 0 0 0 2 2h8m1-5l3-3m0 0l-3-3m3 3H9"/></g></svg>
            </button>
            <h2 className="mgl-gallery-collection-name">{selectedGallery?.title}</h2> {/* (using .title instead of .name) */}
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
      }, [atts]); // (should be [atts.layout])

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
                    { loadedGallery && <div dangerouslySetInnerHTML={{ __html: loadedGallery }} /> } {/* (should be also !isLoading) */}
                </div>

                { isLoading && <div className="mgl-collection-loading-spinner">
                    <div className="mgl-collection-loading-spinner-icon">
                    </div>
                </div> }

            </>}

        </div>
    );
};