// Previous: 5.5.2
// Current: 5.5.3

import { useEffect } from "preact/hooks";
import { getThumbnailIdentifier } from "../../helpers";
import { mgl_log } from "../../logger";

export const MeowCollectionMenu = ({ classId, className = '', inlineStyle, collectionThumbnails, setIsLoadingRoot }) => {
    // Filter out any galleries with errors
    const validThumbnails = collectionThumbnails.filter((collectionThumbnail) => {
        if (collectionThumbnail.error) {
            mgl_log.error('Meow Gallery: Error loading collection thumbnail', collectionThumbnail);
            return false;
        }
        return true;
    });

    // Load the first gallery by default on mount
    useEffect(() => {
        if (validThumbnails.length > 0) {
            const { id, search_slug } = getThumbnailIdentifier(validThumbnails[0]);
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