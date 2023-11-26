// Previous: 5.0.8
// Current: 5.0.9

const { useState, useMemo, useEffect } = wp.element;

import { MediaSelector } from './MediaSelector';

import { NekoPaging, NekoIcon, NekoButton, NekoTypo, NekoBlock, NekoInput, NekoTable, NekoModal, nekoFetch, NekoSelect, NekoOption, NekoSpacer } from '@neko-ui';
import { apiUrl, restNonce } from '@app/settings';

const columns = [
    { accessor: 'thumbnail', title: '' },
    { accessor: 'updated', title: 'Updated on', sortable: true},
    { accessor: 'id', title: 'ID' },
    { accessor: 'name', title: 'Name' },
    { accessor: 'shortcode', title: 'Shortcodes', style: { maxWidth: 400, minWidth: 400 } },
    { accessor: 'actions', title: 'Actions'},
  ];

const ShortcodeMaker = ({ layoutOptions, busy, setBusyAction }) => {

    const [modals, setModals] = useState({ selectMedia: false, createShortcode: false, shortcodeInformation: false });
    const [galleryName, setGalleryName] = useState('');
    const [galleryId, setGalleryId] = useState('');
    const [galleryLayout, setGalleryLayout] = useState('');
    const [selectedMedias, setselectedMedias] = useState({ thumbnail_ids: [], thumbnail_urls: [], thumbnails: [] });
    const [savedGalleries, setSavedGalleries] = useState([]);
    const [ shortcodesTotal, setShortcodesTotal ] = useState(0);

    const [ filters, setFilters ] = useState(() => {
        return columns.filter(v => v.filters).map(v => {
          return { accessor: v.accessor, value: null}
        });
      });
    const [ shortcodesQueryParams, setShortcodesQueryParams ] = useState({
        filters: filters, sort: { accessor: 'updated', by: 'desc' }, page: 1, limit: 10
      });


    const [copyMessage, setCopyMessage] = useState({});
    const [buttonOkText, setButtonOkText] = useState('Create');

    useEffect(() => {
        fetchSavedGalleries();
    }, []);

    useEffect(() => {
        fetchSavedGalleries();
    }, [shortcodesQueryParams]);

    const galleryPreviewStyle = { display: 'flex', alignItems: 'center', border: '1px solid #e1e1e1', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', borderRadius: '8px', padding: '15px', marginTop: '10px', justifyContent: 'space-between' };
    const shortcodeStyle = {display: 'flex',alignItems: 'center',background: '#f8fcff',height: 26,color: '#779bb8',margin: 0,padding: '0px 10px',fontSize: 13,textAlign: 'center',border: '2px solid rgb(210 228 243)',borderRadius: 8,fontFamily: 'system-ui',cursor: 'pointer',whiteSpace: 'nowrap',overflow: 'hidden',textOverflow: 'ellipsis',flex: '1 1 auto'};
    const cleanCancel = () => { setModals({ ...modals, createShortcode: false }); setselectedMedias({ thumbnail_ids: [], thumbnail_urls: [], thumbnails: [] }), setGalleryName(''), setGalleryLayout(''), setGalleryId('') };

    function tableDateTimeFormatter(value) {
        const time = new Date(value * 1000);
        const formattedDate = time.toLocaleDateString('ja-JP', {
          year: 'numeric', month: '2-digit', day: '2-digit'
        });
        const formattedTime = time.toLocaleTimeString('ja-JP', {
          hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
        return <div style={{ textAlign: 'right' }}>{formattedDate}<br /><small>{formattedTime}</small></div>;
    }

    const onCreateShortcode = async () => {
        setBusyAction(true);
        try {
            const response = await nekoFetch(`${apiUrl}/save_shortcode`, {
                json: {
                    medias: selectedMedias,
                    name: galleryName,
                    layout: galleryLayout,
                    id: galleryId
                },
                nonce: restNonce,
                method: 'POST'
            });
            if (response.success) {
                cleanCancel();
                fetchSavedGalleries();
            }
        }
        catch (err) {
            alert(err.message);
        }
        setBusyAction(false);
    }

    const onRemoveShortcode = async ({id, name}) => {
        if (confirm(`Are you sure you want to remove the gallery "${name}" ?`)) {
            setBusyAction(true);
            try {
                const response = await nekoFetch(`${apiUrl}/remove_shortcode`, {
                    json: {
                        id: id
                    },
                    nonce: restNonce,
                    method: 'POST'
                });
                if (response.success) {
                    fetchSavedGalleries();
                }
            }
            catch (err) {
                alert(err.message);
            }
            setBusyAction(false);
        }
    };

    const onEditShortcode = async (id) => {
        const gallery = savedGalleries[id];

        setGalleryId(id);
        setGalleryName(gallery.name);
        setselectedMedias(gallery.medias);
        setGalleryLayout(gallery.layout);

        setButtonOkText('Update');
        setModals({ ...modals, createShortcode: true });
    };

    const fetchSavedGalleries = async () => {
        setBusyAction(true);
        shortcodesQueryParams.offset = (shortcodesQueryParams.page - 1) * shortcodesQueryParams.limit;
        try {
            const response = await nekoFetch(`${apiUrl}/fetch_shortcodes`, {
                nonce: restNonce,
                method: 'POST',
                json: shortcodesQueryParams,
            });
            if (response.success) {
                setSavedGalleries(response.data);
                setShortcodesTotal(response.total);
            }
        }
        catch (err) {
            alert(err.message);
        }
        setBusyAction(false);
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

    const rows = useMemo(() => {
        return Object.entries(savedGalleries)?.map(([id, gallery]) => {
            const shortcodeMediaIds = `[gallery layout="${gallery.layout}" ids="${gallery.medias.thumbnail_ids.join(',')}"]`;
            const shortcodeUniqueId = `[gallery id="${id}"]`;

            const jsxShortcodeMediaIds = <pre onClick={() => { onClickShortcode({ id, name: gallery.name, shortcode: shortcodeMediaIds }) }} style={shortcodeStyle}>
                {!copyMessage[id] && shortcodeMediaIds}
                {copyMessage[id] && copyMessage[id]}
            </pre>;

            const jsxShortcodeUniqueId = <pre onClick={() => { onClickShortcode({ id: 'uid_'+id, name: gallery.name, shortcode: shortcodeUniqueId }) }} style={shortcodeStyle}>
                {!copyMessage['uid_'+id] && shortcodeUniqueId}
                {copyMessage['uid_'+id] && copyMessage['uid_'+id]}
            </pre>;

            const date = gallery?.updated ? tableDateTimeFormatter(gallery.updated) : null;

            return {
                id: id,
                updated: date,
                thumbnail: <>
                    <div style={{ width: 100, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3 }}>
                        {gallery.medias.thumbnail_urls.sort(() => 0.5 - Math.random()).slice(0, 4).map((thumbnail, index) => {
                            return <div style={{ width: 50, minWidth: 0 }}><img key={index} src={thumbnail} style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 3 }} /></div>
                        })}
                    </div>
                </>,
                name: gallery.name,
                shortcode: <>
                    {jsxShortcodeMediaIds}
                    <NekoSpacer />
                    {jsxShortcodeUniqueId}
                </>,
                actions: <>
                    <NekoButton className="primary" onClick={() => onEditShortcode(id)}>Edit</NekoButton>
                    <NekoButton className="danger" onClick={() => onRemoveShortcode({id, name: gallery.name})}>Remove</NekoButton>
                </>
            }
        });
    }, [savedGalleries, copyMessage]);

    const jsxShortcodePaging = useMemo(() => {
        return (<div>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
            <NekoPaging currentPage={shortcodesQueryParams.page} limit={shortcodesQueryParams.limit}
            total={shortcodesTotal} onClick={page => { 
                setShortcodesQueryParams({ ...shortcodesQueryParams, page });
            }}
            />
        </div>
        </div>);
    }, [ shortcodesQueryParams, shortcodesTotal ]);

    const jsxShortcodeMakerTable = <>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            {jsxShortcodePaging}
        </div>
        <NekoTable
            busy={false}

            sort={shortcodesQueryParams.sort}
            onSortChange={(accessor, by) => {
              setShortcodesQueryParams({ ...shortcodesQueryParams, sort: { accessor, by } });
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
                {busy ? 'Loading...' : 'It\'s empty here. You can create your first gallery shortcode by clicking on the button above.😸'}
            </>
            }
        />
        </>;

    const jsxShortcodeMaker =
        <NekoBlock busy={busy} title="Galleries" className="primary" style={{width: '100%'}}
            action={
            <div>
                <NekoButton className="secondary" onClick={() => setModals({ ...modals, shortcodeInformation: true })}><NekoIcon icon="info-outline" width={15} style={{paddingTop: 3, marginRight: 3}}  /> Learn more</NekoButton>
                <NekoButton className="secondary" onClick={() => {setModals({ ...modals, createShortcode: true }); setButtonOkText('Create')}}>Create a Gallery</NekoButton>
            </div>
            }>
            {jsxShortcodeMakerTable}
        </NekoBlock>;

    const jsxSelectImagesModal = <MediaSelector
        isOpen={modals.selectMedia}
        selectedMedias={selectedMedias}
        onClose={() => setModals({ ...modals, selectMedia: false })}
        onSave={(selectedMedias) => { setselectedMedias(selectedMedias); }}
    />;

    const jsxShortcodeInformationModal = <NekoModal
        isOpen={modals.shortcodeInformation}
        title="Gallery Manager"
        content={<>
        <NekoTypo p>Create beautiful galleries and easily use them in your posts, pages, or widgets by copying a shortcode.</NekoTypo>
        <NekoSpacer/>
        <NekoTypo h2>What sets apart the Meow Gallery Block from the Gallery Manager?</NekoTypo>
        <NekoTypo p>
        The Meow Gallery Block is a Gutenberg Block, offering a visual way to craft galleries. Meanwhile, the Gallery Manager lets you create galleries using shortcodes—ideal for users of third-party page builders like Elementor that don't support Gutenberg Blocks.
        With the Gallery Manager, you can effortlessly create galleries, use them in different places, and manage edits in one central location.
        </NekoTypo>
        <NekoSpacer/>
        <NekoTypo h2>How do the two shortcodes differ?</NekoTypo>
        <NekoTypo p>
        The first shortcode includes media IDs and updates along with the gallery—it's the default shortcode. If you make changes, you'll need to update it everywhere you've used it.
        On the other hand, the second shortcode features a unique ID. It's handy for using the same gallery in different places. The benefit is that when you update the gallery, the shortcode remains unchanged, saving you from updating it everywhere.
        </NekoTypo>
            </>
        }
        okButton={{ label: 'Close', onClick: () => setModals({ ...modals, shortcodeInformation: false }) }}
    />;

    const jsxCreateShortcodeModal =
        <NekoModal
            isOpen={modals.createShortcode}
            title={`${buttonOkText} a Gallery`}
            content={<>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <NekoInput name="gallery_name" type="text" value={galleryName} placeholder="Gallery Name..." onChange={(e) => setGalleryName(e)} style={{ flex: .9 }} />
                    <NekoSelect scrolldown name="gallery_layout" disabled={busy} value={galleryLayout}
                        style={{ minWidth: 100 }}
                        onChange={(value) => setGalleryLayout(value)}>
                        {layoutOptions?.map(option => <NekoOption key={option.id} id={option.id} value={option.value}
                            label={option.label} requirePro={option.requirePro} />)
                        }
                    </NekoSelect>
                    <NekoButton className="primary" onClick={() => setModals({ ...modals, selectMedia: true })}>Select Medias</NekoButton>
                </div>

                {selectedMedias.thumbnails.length > 0 &&
                    <div style={galleryPreviewStyle}>
                        <NekoTypo style={{ margin: 0 }}>{selectedMedias.thumbnails.length} Selected: </NekoTypo>
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                            {selectedMedias.thumbnails.map((thumbnail, index) => {
                                if (!thumbnail.url) return null;
                                if (index > 10) return null;
                                return <img key={index} src={thumbnail.url} style={{ width: 25, height: 25, margin: 2, borderRadius: 3 }} />
                            })}
                            {selectedMedias.thumbnails.length > 10 && <NekoTypo style={{ background: '#d3d3d3', padding: 5, borderRadius: 3 }}>+{selectedMedias.thumbnails.length - 10}</NekoTypo>}
                        </div>
                    </div>}
            </>}

            okButton={{ label: buttonOkText, onClick: onCreateShortcode, disabled: (galleryName.length === 0 || selectedMedias.thumbnails.length === 0 || busy) }}
            cancelButton={{ label: 'Cancel', onClick: cleanCancel, disabled: busy }}
        />;

    return { jsxShortcodeMaker, jsxCreateShortcodeModal, jsxSelectImagesModal, jsxShortcodeInformationModal };
};

export  { ShortcodeMaker };