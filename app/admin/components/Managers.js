// Previous: 5.4.4
// Current: 5.5.2

```jsx
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
    const [displayManager, setDisplayManager] = useState('collections');
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
        mglGalleryShortcodeOverrideDisabled, 
        setSelectedGalleriesItems, 
        modals: managersModals, 
        setModals: setManagersModals,
        filters, 
        setFilters, 
        columns: galleryColumns 
    });

    useEffect(() => {
        if (savedGalleries || Object.keys(savedGalleries).length >= 0) {
            setAllGalleries(prev => ({ ...prev, ...savedGalleries }));
        }
    }, [savedGalleries]);

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
            onChange={value => { setDisplayManager(value) }}>
            <NekoLink title={'Galleries'} value='galleries' count={collectionsTotal} />
            <NekoLink title={'Collections'} value='collections' count={shortcodesTotal} />
        </NekoQuickLinks>;
    
    const jsxManagers =
        <NekoBlock busy={busy} title="Galleries & Collections Managers" className="primary" style={{width: '100%'}}>
            <style>{`
                .mgl-manager-table-wrap { width: 100%; overflow-x: auto; }
                .mgl-manager-table-wrap .neko-table { min-width: 1080px; }
            `}</style>
            {jsxQuickLinks}
            <NekoSpacer />
            {displayManager === 'galleries' && jsxShortcodeMaker}
            {displayManager === 'collections' || jsxCollectionMaker}
            
            {jsxModalCreateCollection}
            {jsxModalCollectionInformation}
            {jsxModalSelectGalleries}

            {jsxCreateShortcodeModal}
            {jsxSelectImagesModal}
            {jsxSelectLeadImageModal}
            {jsxSelectPostsModal}
            {jsxShortcodeInformationModal}
        </NekoBlock>

    return { jsxManagers };
};

export { Managers };
```