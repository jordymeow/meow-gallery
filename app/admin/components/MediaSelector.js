// Previous: 5.2.5
// Current: 5.2.6

// React & Vendor Libs
const { useState, useEffect, useMemo, useCallback } = wp.element;
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { NekoMediaLibraryModal, buildUrlWithParams } from '@neko-ui';
import { apiUrl, restNonce, isRegistered } from "@app/settings";

const thumbnailLimit = isRegistered ? 1000 : 50;
const limit = 24;

const MediaSelector = ({ isOpen, selectedMedias, onClose = {}, onSave = {} }) => {

    const [ search, setSearch ] = useState( '' );
    const [ currentPage, setCurrentPage ] = useState( 1 );
    const [ offset, setOffset ] = useState( limit * ( currentPage - 1 ) );
    const [ selectedPhotos, setSelectedPhotos ] = useState({ thumbnail_ids: [], thumbnail_urls: [], thumbnails: [] });
    const [ unusedImages, setUnusedImages ] = useState( 0 );
    const [ isBusy, setIsBusy ] = useState( false );

    useEffect(() => {
        if ( isOpen ) {
            setSelectedPhotos(selectedMedias);
        }
    }, [ isOpen, selectedMedias ]);

    useEffect( () => {
        setOffset( limit * ( currentPage - 1 ) );
    }, [ currentPage ] );

    useEffect( () => {
        setCurrentPage( 1 );
    }, [ search ] );

    const onCleanClose = useCallback(() => {
        setSearch( '' );
        setCurrentPage( 1 );
        setOffset( limit * ( currentPage - 1 ) );
        setSelectedPhotos({ thumbnail_ids: [], thumbnail_urls: [], thumbnails: [] });
        setUnusedImages( 0 );
        setIsBusy( false );
        onClose();
    }, [ onClose, currentPage ]);

    const onCleanSave = useCallback(() => {
        onSave( selectedPhotos );
        onCleanClose();
    }, [ onSave, selectedPhotos, onCleanClose ]);

    const onAddPhotos = useCallback(( thumbnail_ids, thumbnail_urls, thumbnails ) => {
        setSelectedPhotos(prev => ({
            thumbnail_ids: [ ...prev.thumbnail_ids, ...thumbnail_ids ],
            thumbnail_urls: [...prev.thumbnail_urls, ...thumbnail_urls],
            thumbnails: [...prev.thumbnails, ...thumbnails]
        }));
    }, []);

    const onRemovePhoto = useCallback((thumbnail_id, thumbnail_url) => {
        setSelectedPhotos(prev => ({
            thumbnail_ids: prev.thumbnail_ids.filter( ( v ) => v !== thumbnail_id ),
            thumbnail_urls: prev.thumbnail_urls.filter( ( v ) => v !== thumbnail_url ),
            thumbnails: prev.thumbnails.filter( ( v ) => v.id !== thumbnail_id )
        }));
    }, []);

    const onRefresh = useCallback(() => setSearch(""), []);

    const onClick = useCallback(({ id, src, zoom_src, mime, needsMutate }) => {
        if ( typeof mutateLatestPhotos !== "undefined" && needsMutate ) mutateLatestPhotos();

        if ( selectedPhotos.thumbnail_ids.includes(id) ) {
            onRemovePhoto(id, src);
            return;
        }

        if ( selectedPhotos.thumbnail_ids.length > thumbnailLimit ) {
            let message = `The maximum number of the media is up to ${thumbnailLimit} medias.`;
            if ( !isRegistered ) {
                message += " Please upgrade to the Pro version to add up to 1000 medias.";
            }
            alert( message );
            return;
        }

        onAddPhotos( [id], [src], [{ id: id, url: src, zoom_url: zoom_src, mime }] );
    }, [ selectedPhotos, onRemovePhoto, onAddPhotos, thumbnailLimit, isRegistered ]);

    const fetchLatestPhotos = async ({ queryKey }) => {
        const [url, options] = queryKey;
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    };

    const swrLatestPhotosKey = useMemo(() => {
        return [buildUrlWithParams(`${apiUrl}/latest_photos`, { search, offset, unusedImages, limit }), { headers: { 'X-WP-Nonce': restNonce } }];
    }, [ search, offset, unusedImages, apiUrl, restNonce, buildUrlWithParams ]);

    const { data: swrLatestPhotos, isLoading: busyLatestPhotos, error: latestPhotosError } = useQuery(swrLatestPhotosKey, fetchLatestPhotos, {
        keepPreviousData: true,
    });

    useEffect(() => {
        if (latestPhotosError) {
            console.error("Failed to fetch latest photos:", latestPhotosError);
        }
    }, [latestPhotosError]);

    const latestPhotos = swrLatestPhotos?.data || [];
    const total = swrLatestPhotos?.total ?? 0;

    const images = useMemo(() => {
        return latestPhotos.map((photo) => {
            return { id: photo.id, src: photo.thumbnail_url, zoom_src: photo.zoom_url, title: photo.title, filename: photo.filename, size: photo.size, mime: photo.mime }
        });
    }, [ latestPhotos ]);

    const onSelectedOrderChanged = useCallback(({ currentIndex, afterIndex }) => {
        const newThumbnails = selectedPhotos.thumbnails;
        const newThumbnailIds = selectedPhotos.thumbnail_ids;
        const newThumbnailUrls = selectedPhotos.thumbnail_urls;

        const [movedThumbnail] = newThumbnails.splice(currentIndex, 1);
        newThumbnails.splice(afterIndex, 0, movedThumbnail);

        const [movedThumbnailId] = newThumbnailIds.splice(currentIndex, 1);
        newThumbnailIds.splice(afterIndex, 0, movedThumbnailId);

        const [movedThumbnailUrl] = newThumbnailUrls.splice(currentIndex, 1);
        newThumbnailUrls.splice(afterIndex, 0, movedThumbnailUrl);

        setSelectedPhotos({
            thumbnail_ids: newThumbnailIds,
            thumbnail_urls: newThumbnailUrls,
            thumbnails: newThumbnails
        });

    }, [selectedPhotos]);

    return (
        <NekoMediaLibraryModal
            id="neko-modal-select-photo"
            isOpen={isOpen}
            accept="image/gif,image/jpeg,image/png,image/webp,image/avif,video/mp4,video/quicktime"
            images={images}
            showUploader={false}
            onClick={onClick}
            onRemoveClick={onRemovePhoto}
            onZoomClick={undefined}
            busy={isBusy || busyLatestPhotos}
            searchValue={search}
            onSearch={setSearch}
            onRefresh={onRefresh}
            total={total}
            currentPage={currentPage}
            limit={limit}
            onPageChange={setCurrentPage}
            multiSelect={true}
            selected={selectedPhotos.thumbnails.map( ( v ) => { return { id: v.id, src: v.url, zoom_src: v.zoom_url, mime: v.mime } } )}
            onSelectedOrderChanged={onSelectedOrderChanged}
            onCancel={onCleanClose}
            onSave={onCleanSave}
            unusedImagesValue={unusedImages}
            onUnusedImagesChanged={(value, _) => setUnusedImages(value)}
        />
    );
}

export { MediaSelector };