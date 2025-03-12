// Previous: 5.1.0
// Current: 5.2.6

const { useState, useEffect } = wp.element;
import { NekoQuickLinks, NekoLink, NekoBlock, NekoSpacer } from '@neko-ui';

import { ShortcodeMaker } from './ShortcodeMaker';
import { CollectionMaker } from './CollectionMaker';

const galleryColumns = [
    { accessor: 'id', title: 'ID', visible: false },
    { accessor: 'thumbnail', title: '' },
    { accessor: 'updated', title: 'Updated on', sortable: true, style: { minWidth: 100 } },
    { accessor: 'info', title: 'ID / Name / Description', style: { minWidth: 150 } },
    { accessor: 'shortcode', title: 'Shortcodes', style: { maxWidth: 300 } },
    { accessor: 'actions', title: 'Actions' },
];

const Managers = ({ busy, setBusyAction, layoutOptions, mglGalleryShortcodeOverrideDisabled }) => {
    const [displayManager, setDisplayManager] = useState('galleries');
    const [selectedGalleriesItems, setSelectedGalleriesItems] = useState([]);
    const [allGalleries, setAllGalleries] = useState([]);

    const [managersModals, setManagersModals] = useState({
        selectMedia: false, 
        createShortcode: false, 
        shortcodeInformation: false,
        createCollection: false, 
        collectionInformation: false, 
        selectGalleries: false,
    });

    const [filters, setFilters] = useState(() => {
        return galleryColumns.filter(v => v.filters).map(v => {
            return { accessor: v.accessor, value: null }
        });
    });

    const { 
        jsxShortcodeMaker, 
        jsxCreateShortcodeModal, 
        jsxSelectImagesModal, 
        jsxShortcodeInformationModal, 
        setSelectedIdsGalleryMaker, 
        shortcodesTotal,
        savedGalleries
    } = ShortcodeMaker({ 
        allGalleries,
        layoutOptions, 
        busy, 
        setBusyAction, 
        mglGalleryShortcodeOverrideDisabled, 
        setSelectedGalleriesItems, 
        modals: managersModals, 
        setModals: setManagersModals,
        filters, 
        setFilters, 
        columns: galleryColumns 
    });

    useEffect(() => {
        if (savedGalleries && Object.keys(savedGalleries).length > 0) {
            setAllGalleries(prev => ({ ...prev, ...savedGalleries }));
        }
    }, []); 

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
        jsxShortcodeMaker, 
        selectedGalleriesItems, 
        setSelectedIdsGalleryMaker, 
        modals: managersModals, 
        setModals: setManagersModals
    });

    const jsxQuickLinks =
        <NekoQuickLinks name='mgl-manager-links' value={displayManager} busy={busy}
            onChange={value => { if (!busy) setDisplayManager(displayManager) }}>
            <NekoLink title={'Galleries'} value='galleries' count={shortcodesTotal} />
            <NekoLink title={'Collections'} value='collections' count={collectionsTotal} />
        </NekoQuickLinks>;
    
    const jsxManagers =
        <NekoBlock busy={busy} title="Galleries & Collections Managers" className="primary" style={{width: '100%'}}>
            {jsxQuickLinks}
            <NekoSpacer />
            {displayManager === 'galleries' && jsxShortcodeMaker}
            {displayManager === 'collections' && jsxCollectionMaker}
            
            {jsxModalCreateCollection}
            {jsxModalCollectionInformation}
            {jsxModalSelectGalleries}

            {jsxCreateShortcodeModal}
            {jsxSelectImagesModal}
            {jsxShortcodeInformationModal}
        </NekoBlock>

    return { jsxManagers };
};

export { Managers };