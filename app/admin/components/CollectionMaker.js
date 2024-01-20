// Previous: 5.1.0
// Current: 5.1.1

```jsx
const { useState, useMemo, useEffect } = wp.element;

import { ProOnly, NekoPaging, NekoIcon, NekoButton, NekoTypo, NekoInput, NekoTable, NekoModal, nekoFetch, NekoSelect, NekoOption, NekoSpacer } from '@neko-ui';
import { apiUrl, restNonce, isRegistered } from '@app/settings';

import { tableDateTimeFormatter, tableInfoFormatter } from  "../admin-helpers";
import { CollectionThumnails } from './CollectionThumnails';

const columns = [
    { accessor: 'thumbnail', title: '' },
    { accessor: 'updated', title: 'Updated on', sortable: true, style: { minWidth: 150 }},
    { accessor: 'info', title: 'ID / Name / Description', style: { minWidth: 150 }},
    { accessor: 'shortcode', title: 'Shortcodes', style: { maxWidth: 300 } },
    { accessor: 'actions', title: 'Actions'},
  ];

const layoutOptions = [
{ value: 'bento', label: <span>Bento</span> },
];

const shortcodeStyle = {display: 'flex',alignItems: 'center',background: '#f8fcff',height: 26,color: '#779bb8',margin: 0,padding: '0px 10px',fontSize: 13,textAlign: 'center',border: '2px solid rgb(210 228 243)',borderRadius: 8,fontFamily: 'system-ui',cursor: 'pointer',whiteSpace: 'nowrap',overflow: 'hidden',textOverflow: 'ellipsis',flex: '1 1 auto'};
const collectionPreviewStyle = { display: 'flex', alignItems: 'center', border: '1px solid #e1e1e1', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', borderRadius: '8px', padding: '15px', marginTop: '10px', justifyContent: 'space-between' };

const CollectionMaker = ({
    busy, setBusyAction,
    jsxShortcodeMaker,
    selectedGalleriesItems,
    setSelectedIdsGalleryMaker,
    modals, setModals
}) => {
    const [buttonOkText, setButtonOkText] = useState('Create');
    const [copyMessage, setCopyMessage] = useState({});

    const [currentCollection, setCurrentCollection] = useState({ id: 0, name: '', layout: 'bento', galleries: [] });
    const [collections, setCollections] = useState([]);
    const [collectionsTotal, setCollectionsTotal] = useState(0);

    const [ filters, setFilters ] = useState(() => {
        return columns.filter(v => v.filters).map(v => {
          return { accessor: v.accessor, value: null}
        });
      });
    const [ collectionsQueryParams, setCollectionsQueryParams ] = useState({
        filters: filters, sort: { accessor: 'updated', by: 'desc' }, page: 1, limit: 10
      });

    useEffect(() => {
        fetchCollections();
    }, []);

    useEffect(() => {
        fetchCollections();
    }, [collectionsQueryParams]);

    useEffect(() => {
        setCurrentCollection({ ...currentCollection, galleries: selectedGalleriesItems });
    }, [selectedGalleriesItems]);

    const fetchCollections = async () => {
        setBusyAction(true);
        collectionsQueryParams.offset = (collectionsQueryParams.page - 1) * collectionsQueryParams.limit;
        try {
            const response = await nekoFetch(`${apiUrl}/fetch_collections`, {
                nonce: restNonce,
                method: 'POST',
                json: collectionsQueryParams,
            });
            if (response.success) {
                setCollections(response.data);
                setCollectionsTotal(response.total);
            }
        }
        catch (err) {
            alert(err.message);
        }
        setBusyAction(false);
    };

    const onCreateCollection = async () => {
        setBusyAction(true);

        try {
            const response = await nekoFetch(`${apiUrl}/save_collection`, {
                json: {
                    id: currentCollection.id,
                    name: currentCollection.name,
                    layout: currentCollection.layout,
                    description: currentCollection.description,
                    galleries_ids: selectedGalleriesItems.filter(x => x.medias).map(x => x.id),
                },
                nonce: restNonce,
                method: 'POST'
            });
            if (response.success) {
                cleanCancel();
                fetchCollections();
            }
        }
        catch (err) {
            alert(err.message);
        }
        setBusyAction(false);
    }

    const onRemoveCollection = async ({id, name}) => {
        if (confirm(`Are you sure you want to remove the "${name}" collection?`)) {
            setBusyAction(true);
            try {
                const response = await nekoFetch(`${apiUrl}/remove_collection`, {
                    json: {
                        id: id
                    },
                    nonce: restNonce,
                    method: 'POST'
                });
                if (response.success) {
                    fetchCollections();
                }
            }
            catch (err) {
                alert(err.message);
            }
            setBusyAction(false);
        }
    };

    const onClickShortcode = async ({ id, name, shortcode }) => {
        if (!navigator.clipboard) {
            alert("Clipboard is not enabled (only works with https).");
            return;
        }
        await navigator.clipboard.writeText(shortcode);
        setCopyMessage({ ...copyMessage, [id]: `Copied ${name} to clipboard !` });
        setTimeout(() => {
            setCopyMessage({});
        }, 1000);
    };

    const onEditCollection = (id) => {
        const collection = collections[id];

        setCurrentCollection({ ...collection, id: id });
        setSelectedIdsGalleryMaker(collection.galleries_ids);

        setButtonOkText('Update');
        setModals({ ...modals, createCollection: true });
    };

    const cleanCancel = () => {
        setCurrentCollection({ id: 0, name: '', layout: 'bento', galleries: [] });
        setSelectedIdsGalleryMaker([]);
        setModals({ ...modals, createCollection: false, selectGalleries: false });
    };

    const rows = useMemo(() => {
        return Object.entries(collections)?.map(([id, collection]) => {

            const shortcodeGalleriesIds = `[meow-collection layout="${collection.layout}" ids="${(collection.galleries_ids || []).join(', ')}"]`;
            const shortcodeUniqueId = `[meow-collection id="${id}"]`;

            const jsxShortcodeGalleriesIds = <pre onClick={() => { onClickShortcode({ id, name: collection.name, shortcode: shortcodeGalleriesIds }) }} style={shortcodeStyle}>
                {!copyMessage[id] && shortcodeGalleriesIds}
                {copyMessage[id] && copyMessage[id]}
            </pre>;

            const jsxShortcodeUniqueId = <pre onClick={() => { onClickShortcode({ id: 'uid_'+id, name: collection.name, shortcode: shortcodeUniqueId }) }} style={shortcodeStyle}>
                {!copyMessage['uid_'+id] && shortcodeUniqueId}
                {copyMessage['uid_'+id] && copyMessage['uid_'+id]}
            </pre>;

            const date = collection?.updated ? tableDateTimeFormatter(collection.updated) : null;
            const info = tableInfoFormatter({ id, name: collection.name, description: collection.description });

            return {
                updated: date,
                thumbnail: <CollectionThumnails galleries={collection.galleries ? collection.galleries.filter(x => x.medias) : []} />,
                info: info,
                shortcode: <>
                    {jsxShortcodeGalleriesIds}
                    <NekoSpacer />
                    {jsxShortcodeUniqueId}
                </>,
                actions: <>
                    <NekoButton className="primary" onClick={() => onEditCollection(id)}>Edit</NekoButton>
                    <NekoButton className="danger" onClick={() => onRemoveCollection({id, name: collection.name})}>Remove</NekoButton>
                </>
            }
        });
    }, [collections, copyMessage]);

    const jsxCollectionPaging = useMemo(() => {
        return (<div>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
            <NekoPaging currentPage={collectionsQueryParams.page} limit={collectionsQueryParams.limit}
            total={collectionsTotal} onClick={page => { 
                setCollectionsQueryParams({ ...collectionsQueryParams, page });
            }}
            />
        </div>
        </div>);
    }, [ collectionsQueryParams, collectionsTotal ]);

    const jsxCollectionMakerTable = 
    <>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <div>
            <NekoButton className="primary" onClick={() => {setModals({ ...modals, createCollection: true }); setButtonOkText('Create')}} requirePro={!isRegistered} >Create a Collection</NekoButton>
            <NekoButton className="secondary" onClick={() => setModals({ ...modals, collectionInformation: true })}><NekoIcon icon="info-outline" width={15} style={{paddingTop: 3, marginRight: 3}}  /> Learn more</NekoButton>
        </div>
        {jsxCollectionPaging}
    </div>
    <NekoTable
        busy={false}

        sort={collectionsQueryParams.sort}
        onSortChange={(accessor, by) => {
            setCollectionsQueryParams({ ...collectionsQueryParams, sort: { accessor, by } });
        }}
        filters={filters}
        onFilterChange={(accessor, value) => {
            const freshFilters = [
            ...filters.filter(x => x.accessor !== accessor),
            { accessor, value }
            ];
            setFilters(freshFilters);
        }}

        data={rows}
        columns={columns}
        emptyMessage={<>
            {busy ? 'Loading...' : isRegistered ? 'It\'s empty here. You can create your first Collection by clicking on the button above.😸' : <ProOnly/>}
        </>
        }
    />

    </>;

    const jsxCollectionMaker = jsxCollectionMakerTable;


    const jsxModalCreateCollection =
        <NekoModal
            isOpen={modals.createCollection}
            title={`${buttonOkText} a Collection`}
            content={<>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <NekoInput name="collection_name" type="text" value={currentCollection.name} placeholder="Collection Name..." onChange={(e) => setCurrentCollection({...currentCollection, name: e})} style={{ flex: .9 }} />
                    <NekoSelect scrolldown name="collection_layout" disabled={busy} value={currentCollection.layout}
                        style={{ minWidth: 100 }}
                        onChange={(value) => setCurrentCollection({ ...currentCollection, layout: value })}>
                        {layoutOptions?.map(option => <NekoOption key={option.id} id={option.id} value={option.value}
                            label={option.label} requirePro={option.requirePro} />)
                        }
                    </NekoSelect>
                    <NekoButton className="primary" onClick={() => setModals({ ...modals, selectGalleries: true })}>Select Galleries</NekoButton>
                </div>

                <NekoSpacer />
                <NekoInput name="collection_description" type="text" value={currentCollection.description} placeholder="Collection Description..." onChange={(e) => setCurrentCollection({...currentCollection, description: e})} />

                {currentCollection.galleries && currentCollection.galleries.length > 0 &&
                    <div style={collectionPreviewStyle}>
                        <NekoTypo style={{ margin: 0 }}>{currentCollection.galleries.length} Selected: </NekoTypo>

                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                            {currentCollection.galleries.map((gallery, index) => {
                                if ( !gallery.id ) { return null;}
                                if ( !gallery.medias ){
                                    return <div style={{background: '#ba4300', borderRadius: 5, display: 'flex', alignItems: 'center', margin: 3, height: 60}}>
                                    <span  style={{ borderRadius: 5, margin: 5, fontSize: '1.5rem' }}>☠️</span>
                                    <span style={{ marginRight: '5px', color: 'white' }}>{gallery.id}</span>
                                </div>
                                }
                                if (index > 10) return null;
                                return <div style={{background: '#007cba', borderRadius: 5, display: 'flex', alignItems: 'center', margin: 3}}>
                                    <img src={gallery.medias.thumbnail_urls[0]} style={{ width: 50, height: 50, borderRadius: 5, margin: 5 }} />
                                    <span style={{ marginRight: '5px', color: 'white' }}>{gallery.name}</span>
                                </div>
                            })}
                            {currentCollection.galleries.length > 10 && <NekoTypo style={{ background: '#007cba', padding: 5, borderRadius: 3, color: 'white' }}>+{currentCollection.galleries.length - 10}</NekoTypo>}
                        </div>
                    </div>}
            </>}

            okButton={{ label: buttonOkText, onClick: onCreateCollection, disabled: (currentCollection.name.length === 0 || currentCollection.galleries.length === 0 || busy) }}
            cancelButton={{ label: 'Cancel', onClick: cleanCancel, disabled: busy }}
            onRequestClose={() => cleanCancel()}
        />;

    const jsxModalSelectGalleries =
        <NekoModal
            contentWidth="auto"
            isOpen={modals.selectGalleries}
            content={<>
                <div style={{ maxHeight: 600, overflowY: 'auto', overflowX: 'hidden' }}>
                {jsxShortcodeMaker}
                </div>
            </>}
            okButton={{ label: 'Select', onClick: () => {setModals({ ...modals, selectGalleries: false }); }, disabled: busy }}
            cancelButton={{ label: 'Cancel', onClick: () => {setModals({ ...modals, selectGalleries: false }); }, disabled: busy }}
            onRequestClose={() => {setModals({ ...modals, selectGalleries: false }); }}
        />;
    
    const jsxModalCollectionInformation =
    <NekoModal
        isOpen={modals.collectionInformation}
        title="Collection Manager"
        content={<>
        <NekoTypo h2>What is the Collection Manager?</NekoTypo>
        <NekoTypo p>
            The Collection Manager is a tool that allows you to create and manage collections of galleries. 
            You can create as many collections as you want and each collection can contain as many galleries as you want.
        </NekoTypo>
        <NekoSpacer />
        <NekoTypo h2>How will the Collection show up on the front-end?</NekoTypo>
        <NekoTypo p>
            The Collection will can be used as a shortcode that you can copy and paste anywhere on your website. 
            The shortcode will display a grid of galleries that you have added to the collection.
            Each gallery will have a thumbnail, a title, and a description based on what's registered in the gallery manager.
            When a user clicks on a gallery, it will open up on the same page, just like a normal gallery but is an option to open close it and go back to the collection.
        </NekoTypo>
        </>}
        okButton={{ label: 'Close', onClick: () => setModals({ ...modals, collectionInformation: false }) }}
        onRequestClose={() => setModals({ ...modals, collectionInformation: false })}
    />;

    return { jsxCollectionMaker, jsxModalCollectionInformation, jsxModalSelectGalleries, jsxModalCreateCollection, collectionsTotal };
};

export { CollectionMaker };
```