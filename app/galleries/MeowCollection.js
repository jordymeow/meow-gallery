// Previous: 5.2.6
// Current: 5.2.8

import { useState, useMemo, useEffect } from "preact/hooks";
import { MeowCollectionBento } from './collections/bento/MeowCollectionBento';

import { nekoFetch } from './helpers';

export const MeowCollection = ({
    options, collectionOptions, collectionThumbnails,
    atts,
    apiUrl, restNonce,
}) => {

    const [isLoading, setIsLoading] = useState(false);
    const [loadedGallery, setLoadedGallery] = useState(null);
    const [selectedGallery, setSelectedGallery] = useState(null);

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
    }, [collectionThumbnails]);

    const startLoadingGallery = async (id, search_slug) => {
        setIsLoading(true);

        const selGallery = collectionThumbnails.find((c) => c[search_slug] === id);
        setSelectedGallery(selGallery);

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
            }, 10);

            setTimeout(() => {
                if (window.renderMeowLightbox) {
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
        url.searchParams.delete('wplr_collection_id');
        window.history.replaceState({}, '', url);

        setSelectedGallery(null);
    }

    const jsxCollectionHeader = useMemo(() => {
        return (
            <div className="mgl-gallery-collection-header">
                <button className="mgl-gallery-collection-back" onClick={() => onHeaderBackClick()} aria-label="Back">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </button>
                <h2 className="mgl-gallery-collection-name">{selectedGallery?.name}</h2>
            </div>
        );
    }, []);

    const collectionContent = useMemo(() => {

        if (!atts.layout) {
            atts.layout = 'bento';
        }

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
            {isReadyToDisplay && <>

                <div className={`mgl-collection-loading-container ${isLoading ? 'mgl-collection-loading' : ''} `}>
                    {!loadedGallery && collectionContent}
                    {!isLoading && loadedGallery && jsxCollectionHeader}
                    {!isLoading && loadedGallery && <div dangerouslySetInnerHTML={{ __html: loadedGallery }} />}
                    {isLoading && loadedGallery && <div className="mgl-collection-loading-spinner">
                        <div className="mgl-collection-loading-spinner-icon"></div>
                    </div>}
                </div>

            </>}

        </div>
    );
};