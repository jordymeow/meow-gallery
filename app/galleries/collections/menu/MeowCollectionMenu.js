// Previous: none
// Current: 5.4.5

import { useEffect } from "preact/hooks";

export const MeowCollectionMenu = ({ classId, className = '', inlineStyle, collectionThumbnails, setIsLoadingRoot }) => {
    // Filter out any galleries with errors
    const validThumbnails = collectionThumbnails.filter((collectionThumbnail) => {
        if (collectionThumbnail.error) {
            console.error('Meow Gallery: Error loading collection thumbnail', collectionThumbnail);
            return false;
        }
        return true;
    });

    // Load the first gallery by default on mount
    useEffect(() => {
        if (validThumbnails.length > 0) {
            const firstGallery = validThumbnails[0];
            const id = firstGallery.wplr_collection_id !== undefined ? firstGallery.wplr_collection_id : firstGallery.gallery_id;
            const search_slug = firstGallery.wplr_collection_id !== undefined ? 'wplr_collection_id' : 'gallery_id';
            setIsLoadingRoot(id, search_slug);
        }
    }, []);

    // This component is only shown briefly before the first gallery loads
    // Once a gallery is loaded, the parent component shows the header with select dropdown and the gallery
    return (
        <div id={classId} className={`mgl-collection-menu ${className}`} style={inlineStyle}>
            <div className="mgl-collection-menu-loading">
                Loading gallery...
            </div>
        </div>
    );
};