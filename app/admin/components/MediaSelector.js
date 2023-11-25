// Previous: none
// Current: 5.0.8

// React & Vendor Libs
const { useState, useEffect, useMemo, useCallback } = wp.element;
import useSWR from 'swr';
import {NekoMediaLibraryModal, jsonFetcher, useHandleSWR, buildUrlWithParams } from '@neko-ui';
import { apiUrl, restNonce } from "@app/settings";

const thumbnailLimit = 150;
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

    useEffect(() => {
        setOffset(limit * (currentPage - 1));
    }, [currentPage, limit]);

    const onCleanClose = useCallback(() => {
        setSearch( '' );
        setCurrentPage( 1 );
        setOffset( limit * ( currentPage - 1 ) );
        setSelectedPhotos({ thumbnail_ids: [], thumbnail_urls: [], thumbnails: [] });
        setUnusedImages( 0 );
        setIsBusy( false );
        if (typeof onClose === "function") {
            onClose();
        }
    }, [ onClose, currentPage ]);

    const onCleanSave = useCallback(() => {
        if (typeof onSave === "function") {
            onSave( selectedPhotos );
        }
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
            thumbnail_ids: prev.thumbnail_ids.filter( ( v ) => v != thumbnail_id ),
            thumbnail_urls: prev.thumbnail_urls.filter( ( v ) => v != thumbnail_url ),
            thumbnails: prev.thumbnails.filter( ( v ) => v.id != thumbnail_id )
        }));
    }, []);

    const onRefresh = useCallback(() => setSearch(""), []);

    const onClick = useCallback(({ id, src, zoom_src, needsMutate }) => {
        if ( needsMutate ) mutateLatestPhotos();

        if ( selectedPhotos.thumbnail_ids.includes(id) ) {
            onRemovePhoto(id, src);
            return;
        }

        if ( selectedPhotos.thumbnail_ids.length > thumbnailLimit ) {
            alert(`The maximum number of the photo is up to ${thumbnailLimit}. Please delete some photos beforehand.`);
            return;
        }

        onAddPhotos( [id], [src], [{ id: id, url: src, zoom_url: zoom_src }] );
    }, [ selectedPhotos, onRemovePhoto, onAddPhotos, thumbnailLimit ]);

    const swrLatestPhotosKey = useMemo ( () => {
        return [buildUrlWithParams(`${apiUrl}/latest_photos`, { search, offset, unusedImages } ), { headers: { 'X-WP-Nonce': restNonce } }];
      }, [ search, offset, unusedImages ]);

    const { data: swrLatestPhotos, mutate: mutateLatestPhotos } = useSWR( swrLatestPhotosKey, jsonFetcher );
    const { busy: busyLatestPhotos, data: latestPhotos, total: total, error: latestPhotosError } = useHandleSWR( swrLatestPhotos, [], true );

    const images = useMemo( () => {
        if (!Array.isArray(latestPhotos)) return [];
        return latestPhotos.map((photo) => {
            return { id: photo.id, src: photo.thumbnail_url, zoom_src: photo.zoom_url, title: photo.title, filename: photo.filename, size: photo.size, mime: photo.mime }
        });
    }, [ latestPhotos ] );

    return (
        <NekoMediaLibraryModal
            id="neko-modal-select-photo"
            isOpen={isOpen}
            accept="image/gif,image/jpeg,image/png,image/webp"
            images={images}
            showUploader={false}
            onClick={onClick}
            onRemoveClick={onRemovePhoto}
            onZoomClick={null}
            busy={isBusy || busyLatestPhotos}
            searchValue={search}
            onSearch={setSearch}
            onRefresh={onRefresh}
            currentPage={currentPage}
            limit={limit}
            onPageChange={setCurrentPage}
            multiSelect={true}
            selected={selectedPhotos.thumbnails.map( ( v ) => { return { id: v.id, src: v.url, zoom_src: v.zoom_url } } )}
            onCancel={onCleanClose}
            onSave={onCleanSave}
        />
    );
}

export { MediaSelector };