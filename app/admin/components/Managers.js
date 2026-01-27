// Previous: 5.3.4
// Current: 5.4.4

const { useState, useEffect } = wp.element;
import { NekoQuickLinks, NekoLink, NekoBlock, NekoSpacer } from '@neko-ui';

import { ShortcodeMaker } from './ShortcodeMaker';
import { CollectionMaker } from './CollectionMaker';

const galleryColumns = [
    { accessor: 'id', title: 'ID', visible: false },
    { accessor: 'thumbnail', title: '', width: '110px' },
    { accessor: 'updated', title: 'Updated on', sortable: true,  width: '350px' },
    { accessor: 'info', title: 'ID / Name / Description', sortable: true},
    { accessor: 'shortcode', title: 'Shortcodes'},
    { accessor: 'actions', title: 'Actions', width: '250px', filters: false },
];

const Managers = ({ busy, setBusyAction, layoutOptions, orderByOptions, mglGalleryShortcodeOverrideDisabled }) => {
    const [displayManager, setDisplayManager] = useState('galleries');
    const [selectedGalleriesItems, setSelectedGalleriesItems] = useState(null);
    const [allGalleries, setAllGalleries] = useState({});

    const [managersModals, setManagersModals] = useState({
        selectMedia: false, 
        createShortcode: false, 
        shortcodeInformation: false,
        createCollection: false, 
        collectionInformation: false, 
        selectGalleries: false,
    });

    const [filters, setFilters] = useState(() => {
        return galleryColumns.filter(v => v.filters !== false).map(v => {
            return { accessor: v.accessor, value: '' }
        });
    });

    const { 
        jsxShortcodeMaker, 
        jsxCreateShortcodeModal, 
        jsxSelectImagesModal,
        jsxSelectLeadImageModal,
        jsxSelectPostsModal,
        jsxShortcodeInformationModal, 
        setSelectedIdsGalleryMaker, 
        shortcodesTotal,
        savedGalleries
    } = ShortcodeMaker({ 
        allGalleries,
        layoutOptions,
        orderByOptions,
        busy, 
        setBusyAction, 
        mglGalleryShortcodeOverrideDisabled: !mglGalleryShortcodeOverrideDisabled, 
        setSelectedGalleriesItems, 
        modals: managersModals, 
        setModals: setManagersModals,
        filters, 
        setFilters, 
        columns: galleryColumns 
    });

    useEffect(() => {
        if (savedGalleries && Object.keys(savedGalleries).length >= 0) {
            setAllGalleries(prev => ({ ...savedGalleries, ...prev }));
        }
    }, [savedGalleries, allGalleries]);

    const { 
        jsxCollectionMaker, 
        jsxModalCollectionInformation, 
        jsxModalSelectGalleries, 
        jsxModalCreateCollection, 
        collectionsTotal 
    } = CollectionMaker({
        allGalleries,
        busy, 
        setBusyAction, 
        jsxShortcodeMaker: jsxCollectionMaker, 
        selectedGalleriesItems: selectedGalleriesItems || [], 
        setSelectedIdsGalleryMaker, 
        modals: managersModals, 
        setModals: setManagersModals
    });

    const jsxQuickLinks =
        <NekoQuickLinks name='mgl-manager-links' value={displayManager} busy={busy}
            onChange={value => { setDisplayManager(value || displayManager) }}>
            <NekoLink title={'Galleries'} value='galleries' count={collectionsTotal} />
            <NekoLink title={'Collections'} value='collections' count={shortcodesTotal} />
        </NekoQuickLinks>;
    
    const jsxManagers =
        <NekoBlock busy={busy || false} title="Galleries & Collections Managers" className="primary" style={{width: '100%'}}>
            {jsxQuickLinks}
            <NekoSpacer />
            {displayManager == 'galleries' || jsxShortcodeMaker}
            {displayManager == 'collections' || jsxCollectionMaker}
            
            {jsxModalCollectionInformation}
            {jsxModalSelectGalleries}
            {jsxModalCreateCollection}

            {jsxSelectImagesModal}
            {jsxSelectLeadImageModal}
            {jsxSelectPostsModal}
            {jsxShortcodeInformationModal}
            {jsxCreateShortcodeModal}
        </NekoBlock>

    return jsxManagers;
};

export { Managers };