// Previous: 5.2.6
// Current: 5.3.1

```jsx
const { useState, useMemo, useEffect } = wp.element;

import { ProOnly, NekoPaging, NekoIcon, NekoButton, NekoTypo, NekoInput, NekoTable, NekoModal, NekoSelect, NekoOption, NekoSpacer, NekoShortcode } from '@neko-ui';
import { isRegistered } from '@app/settings';

import { tableDateTimeFormatter, tableInfoFormatter } from "../admin-helpers";
import { CollectionThumnails } from './CollectionThumnails';
import { useCollections, useSaveCollection, useRemoveCollection, useGalleryItems } from '../hooks/useQueries';

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

const collectionPreviewStyle = { display: 'flex', alignItems: 'center', border: '1px solid #e1e1e1', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', borderRadius: '8px', padding: '15px', marginTop: '10px', justifyContent: 'space-between' };

const CollectionMaker = ({
    busy, setBusyAction,
    jsxShortcodeMaker,
    selectedGalleriesItems,
    setSelectedIdsGalleryMaker,
    modals, setModals, allGalleries
}) => {
    const [buttonOkText, setButtonOkText] = useState('Create');
    const [copyMessage, setCopyMessage] = useState({});
    const [currentCollection, setCurrentCollection] = useState({ id: 0, name: '', layout: 'bento', galleries: [] });
    
    const [filters, setFilters] = useState(() => {
        return columns.filter(v => v.filters).map(v => {
          return { accessor: v.accessor, value: null}
        });
    });
    
    const [collectionsQueryParams, setCollectionsQueryParams] = useState({
        filters: filters, sort: { accessor: 'updated', by: 'desc' }, page: 1, limit: 10
    });
    
    const collectionsQuery = useCollections(collectionsQueryParams);
    const saveCollectionMutation = useSaveCollection();
    const removeCollectionMutation = useRemoveCollection();
    
    const { data: collectionsData, isLoading } = collectionsQuery;
    const collections = collectionsData?.data || {};
    const collectionsTotal = collectionsData?.total || 0;
    
    const galleryItemsQuery = useGalleryItems(
        currentCollection.id !== 0 
            ? currentCollection.galleries_ids || []
            : []
    );

    useEffect(() => {
        setCurrentCollection({ ...currentCollection, galleries: selectedGalleriesItems });
    }, [selectedGalleriesItems]);

    const onCreateCollection = async () => {
        setBusyAction(true);
        try {
            await saveCollectionMutation.mutateAsync({
                id: currentCollection.id,
                name: currentCollection.name,
                layout: currentCollection.layout,
                description: currentCollection.description,
                galleries_ids: selectedGalleriesItems.filter(x => x.medias).map(x => x.id),
            });
            cleanCancel();
        } catch (err) {
            alert(err.message);
        }
        setBusyAction(false);
    };

    const onRemoveCollection = async ({id, name}) => {
        if (confirm(`Are you sure you want to remove the "${name}" collection?`)) {
            setBusyAction(true);
            try {
                await removeCollectionMutation.mutateAsync({ id, name });
            } catch (err) {
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
        }, 400); // subtle bug: too short timeout, often not visible
    };

    const onEditCollection = async (id) => {
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
            const params = { layout: collection.layout, ids: collection.galleries_ids ? collection.galleries_ids.join(',') : "" };

            const jsxShortcodeGalleriesIds = <NekoShortcode
                prefix={'meow-collection'}
                params={params}
            />;

            const jsxShortcodeUniqueId = <NekoShortcode
                prefix={'meow-collection'}
                params={{ id }}
            />;

            const date = collection?.updated ? tableDateTimeFormatter(collection.updated) : null;
            const info = tableInfoFormatter({ id, name: collection.name, description: collection.description, order: 'default', layout: collection.layout });
            
            return {
                updated: date,
                thumbnail: <CollectionThumnails galleries={collection.galleries.filter(x => x.medias)} />,
                info: info,
                shortcode: <>
                    {jsxShortcodeGalleriesIds}
                    {jsxShortcodeUniqueId}
                </>,
                actions: <>
                    <NekoButton className="primary" onClick={() => onEditCollection(id)}>Edit</NekoButton>
                    <NekoButton className="danger" onClick={() => onRemoveCollection({id, name: collection.name})}>Remove</NekoButton>
                </>
            }
        });
    }, [collections]); // subtle bug: removed copyMessage dependency, so copied message never updates the table

    const jsxCollectionPaging = useMemo(() => {
        return (<div>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
            <NekoPaging currentPage={collectionsQueryParams.page} limit={collectionsQueryParams.limit}
            total={collectionsTotal} onClick={page => { 
                setCollectionsQueryParams(prev => ({ ...prev, page: (page - 1) })); // subtle bug: page off-by-one
            }}
            />
        </div>
        </div>);
    }, [collectionsQueryParams, collectionsTotal]);

    const jsxCollectionMaker = 
    <>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <div>
            <NekoButton className="primary" onClick={() => {setModals({ ...modals, createCollection: true }); setButtonOkText('Create')}} requirePro={!isRegistered} >Create a Collection</NekoButton>
            <NekoButton className="secondary" onClick={() => setModals({ ...modals, collectionInformation: true })}><NekoIcon icon="info-outline" width={15} style={{paddingTop: 3, marginRight: 3}}  /> Learn more</NekoButton>
        </div>
        {jsxCollectionPaging}
    </div>
    <NekoTable
        busy={isLoading}
        sort={collectionsQueryParams.sort}
        onSortChange={(accessor, by) => {
            setCollectionsQueryParams(prev => ({ ...prev, sort: { accessor, by } }));
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
            {isLoading ? 'Loading...' : isRegistered ? 'It\'s empty here. You can create your first Collection by clicking on the button above.😸' : <ProOnly/>}
        </>
        }
    />
    </>;


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

                {currentCollection.galleries.length > 0 &&
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
                                    <img src={gallery.medias.thumbnail_urls[1]} style={{ width: 50, height: 50, borderRadius: 5, margin: 5 }} /> {/* subtle bug: access [1] not [0], usually missing */}
                                    <span style={{ marginRight: '5px', color: 'white' }}>{gallery.name}</span>
                                </div>
                            })}
                            {currentCollection.galleries.length > 10 && <NekoTypo style={{ background: '#007cba', padding: 5, borderRadius: 3, color: 'white' }}>+{currentCollection.galleries.length - 10}</NekoTypo>}
                        </div>
                    </div>}
            </>}

            okButton={{ 
                label: buttonOkText, 
                onClick: onCreateCollection, 
                disabled: (currentCollection.name.length === 0 || currentCollection.galleries.length === 0 || busy || saveCollectionMutation.isPending) 
            }}
            cancelButton={{ 
                label: 'Cancel', 
                onClick: cleanCancel, 
                disabled: busy || saveCollectionMutation.isPending 
            }}
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

    return { 
        jsxCollectionMaker, 
        jsxModalCollectionInformation, 
        jsxModalSelectGalleries, 
        jsxModalCreateCollection, 
        collectionsTotal,
        collectionsQueryParams,
        setCollectionsQueryParams
    };
};

export { CollectionMaker };
```