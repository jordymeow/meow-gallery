// Previous: none
// Current: 5.1.0


const { useState } = wp.element;
import { NekoQuickLinks, NekoLink, NekoBlock, NekoSpacer } from '@neko-ui';

import { ShortcodeMaker } from './ShortcodeMaker';
import { CollectionMaker } from './CollectionMaker';

const Managers = ({ busy, setBusyAction, layoutOptions, mglGalleryShortcodeOverrideDisabled }) => {

    const [displayManager, setDisplayManager] = useState('galleries');
    const [selectedGalleriesItems, setSelectedGalleriesItems] = useState([]);

    const [managersModals, setManagersModals] = useState({
        selectMedia: false, createShortcode: false, shortcodeInformation: false,
        createCollection: false, collectionInformation: false, selectGalleries: false,
    });

    const { shortcodesTotal, jsxShortcodeMaker, jsxCreateShortcodeModal, jsxSelectImagesModal, jsxShortcodeInformationModal, setSelectedIdsGalleryMaker } = ShortcodeMaker({ layoutOptions, busy, setBusyAction, mglGalleryShortcodeOverrideDisabled, setSelectedGalleriesItems, modals: managersModals, setModals: setManagersModals });
    const { collectionsTotal, jsxCollectionMaker, jsxModalCollectionInformation, jsxModalSelectGalleries, jsxModalCreateCollection } = CollectionMaker({ busy, setBusyAction, jsxShortcodeMaker, selectedGalleriesItems, setSelectedIdsGalleryMaker, modals: managersModals, setModals: setManagersModals });


    const jsxQuickLinks =
        <NekoQuickLinks name='mgl-manager-links' value={displayManager} busy={busy}
            onChange={value => { setDisplayManager(value) }}>
            <NekoLink title={'Galleries'} value='galleries' count={shortcodesTotal} />
            <NekoLink title={'Collections'} value='collections' count={collectionsTotal} />
        </NekoQuickLinks>;

    const jsxManagers =
        <>
        <NekoBlock busy={busy} title="Galleries & Collections Managers" className="primary" style={{width: '100%'}}>
            {jsxQuickLinks}
            <NekoSpacer />
            {displayManager === 'galleries' &&  jsxShortcodeMaker }
            {displayManager === 'collections' &&  jsxCollectionMaker }
        </NekoBlock>

            {jsxModalCreateCollection}
            {jsxModalCollectionInformation}
            {jsxModalSelectGalleries}

            {jsxCreateShortcodeModal}
            {jsxSelectImagesModal}
            {jsxShortcodeInformationModal}
        </>

    return { jsxManagers };

};

export { Managers };