// Previous: 5.2.6
// Current: 5.2.8

const { useState, useMemo, useEffect } = wp.element;

import { MediaSelector } from './MediaSelector';

import { useNekoColors, NekoPaging, NekoIcon, NekoButton, NekoCheckbox, NekoTypo, NekoInput, NekoTable, NekoModal, NekoSelect, NekoOption, NekoSpacer, NekoSwitch, NekoShortcode } from '@neko-ui';
import { isRegistered } from '@app/settings';
import { tableDateTimeFormatter, tableInfoFormatter } from "../admin-helpers";
import { useGalleries, useSaveGallery, useRemoveGallery } from '../hooks/useQueries';

import { PostSelector } from './PostSelector';

const ShortcodeMaker = ({
    layoutOptions,
    busy, setBusyAction,
    mglGalleryShortcodeOverrideDisabled,
    setSelectedGalleriesItems,
    modals, setModals, 
    allGalleries,
    filters, setFilters, columns
}) => {
    const { colors } = useNekoColors();

    const [galleryName, setGalleryName] = useState('');
    const [galleryDescription, setGalleryDescription] = useState('');
    const [galleryId, setGalleryId] = useState('');
    const [galleryLayout, setGalleryLayout] = useState('');
    const [selectedMedias, setselectedMedias] = useState({ thumbnail_ids: [], thumbnail_urls: [], thumbnails: [] });
    const [leadImageId, setLeadImageId] = useState('');
    
    const [selectedIds, setSelectedIds] = useState([]);
    const [isPostMode, setIsPostMode] = useState(false);
    const [carouselHeroMode, setCarouselHeroMode] = useState(false);
    const [isLatestPostsMode, setIsLatestPostsMode] = useState(true);
    const [postIds, setPostIds] = useState([]);
    const [latestPostsNumber, setLatestPostsNumber] = useState(5);
    const [buttonOkText, setButtonOkText] = useState('Create');

    const [shortcodesQueryParams, setShortcodesQueryParams] = useState({
        filters: filters, 
        sort: { accessor: 'updated', by: 'desc' }, 
        page: 1, 
        limit: 10
    });

    const galleryQuery = useGalleries(shortcodesQueryParams);
    const saveGalleryMutation = useSaveGallery();
    const removeGalleryMutation = useRemoveGallery();

    const { data: galleryData, isLoading } = galleryQuery;
    const savedGalleries = galleryData?.data || {};
    const shortcodesTotal = galleryData?.total || 0;

    const setPostIdsStringToArray = (ids) => {
        setPostIds(ids.split(',').map(id => id.trim()).filter(Boolean));
    };

    useEffect(() => {
        if (selectedIds.length === 0) {
            return;
        }
        const selectedGalleriesItems = selectedIds.map((id) => {
            let gallery = allGalleries[id] || savedGalleries[id];
            gallery = { ...gallery, id: id };
            return gallery;
        });
        setSelectedGalleriesItems(selectedGalleriesItems);
    }, [selectedIds, savedGalleries, allGalleries]);

    const setSelectedIdsGalleryMaker = (ids) => {
        setSelectedIds(ids || []);
    };

    const galleryPreviewStyle = { display: 'flex', alignItems: 'center', border: '1px solid #e1e1e1', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', borderRadius: '8px', padding: '15px', marginTop: '10px', justifyContent: 'space-between' };
    
    const cleanCancel = () => { 
        setModals({ ...modals, createShortcode: false }); 
        setselectedMedias({ thumbnail_ids: [], thumbnail_urls: [], thumbnails: [] });
        setGalleryName('');
        setGalleryLayout('');
        setGalleryId('');
        setGalleryDescription('');
        setIsPostMode(false);
        setCarouselHeroMode(false);
        setPostIds([]);
        setLatestPostsNumber(5);
    };

    const onCreateShortcode = async () => {
        setBusyAction(true);
        try {
            await saveGalleryMutation.mutateAsync({
                medias: selectedMedias,
                name: galleryName,
                layout: galleryLayout,
                description: galleryDescription,
                is_post_mode: isPostMode,
                is_hero_mode: carouselHeroMode,
                posts: isPostMode && !isLatestPostsMode ? postIds : null,
                latest_posts: isPostMode && isLatestPostsMode ? latestPostsNumber : null,
                lead_image_id: leadImageId,
                id: galleryId
            });

            cleanCancel();
        } catch (err) {
            alert(err.message);
        }
        setBusyAction(false);
    };

    const onRemoveShortcode = async ({ id, name }) => {
        if (confirm(`Are you sure you want to remove the gallery "${name}" ?`)) {
            setBusyAction(true);
            try {
                await removeGalleryMutation.mutateAsync({ id });
            } catch (err) {
                alert(err.message);
            }
            setBusyAction(false);
        }
    };

    const onCreateNewGallery = () => {
        setGalleryId('');
        setGalleryName('');
        setselectedMedias({ thumbnail_ids: [], thumbnail_urls: [], thumbnails: [] });
        setLeadImageId('');
        setGalleryLayout('');
        setGalleryDescription('');
        setIsPostMode(false);
        setCarouselHeroMode(false);
        setPostIds([]);
        setLatestPostsNumber(5);

        setButtonOkText('Create');
        setModals({ ...modals, createShortcode: true });
    };

    const onEditShortcode = (id) => {
        const gallery = savedGalleries[id];

        setGalleryId(id || '');
        setGalleryName(gallery?.name || '');
        setselectedMedias(gallery?.medias || { thumbnail_ids: [], thumbnail_urls: [], thumbnails: [] });
        setLeadImageId(gallery?.lead_image_id || '');
        setGalleryLayout(gallery?.layout || '');
        setGalleryDescription(gallery?.description || '');
        setIsPostMode(gallery?.is_post_mode || false);
        
        if (gallery?.is_post_mode) {
            if (gallery.posts && Array.isArray(gallery.posts)) {
                setIsLatestPostsMode(false);
                setPostIds([...gallery.posts]);
            } else if (gallery.latest_posts) {
                setIsLatestPostsMode(true);
                setLatestPostsNumber(gallery.latest_posts);
            }
            if (gallery.hero) {
                setCarouselHeroMode(true);
            }
        }
        setButtonOkText('Update');
        setModals({ ...modals, createShortcode: true });
    };

    const rows = useMemo(() => {
        return Object.entries(savedGalleries)?.map(([id, gallery]) => {
            const params = {
                layout: gallery.layout
            };

            if (gallery?.is_post_mode) {
                if (Array.isArray(gallery.posts) && gallery.posts.length > 0) {
                    params.posts = gallery.posts.join(', ');
                }
                else if (gallery.latest_posts) {
                    params.latest_posts = gallery.latest_posts;
                }

                if (gallery?.hero) {
                    params.hero = "true";
                }
            } else if (gallery?.medias && gallery.medias.thumbnail_ids) {
                params.ids = gallery.medias.thumbnail_ids.join(', ');
            }

            const shortcodeMediaIds = <NekoShortcode
                prefix={mglGalleryShortcodeOverrideDisabled ? 'meow-gallery' : 'gallery'}
                params={params}
            />;

            const shortcodeUniqueId = <NekoShortcode
                prefix={mglGalleryShortcodeOverrideDisabled ? 'meow-gallery' : 'gallery'}
                params={{ id: id }}
            />;

            const date = gallery?.updated ? tableDateTimeFormatter(gallery.updated) : null;
            const info = tableInfoFormatter({ id, name: gallery.name, description: gallery.description });

            const thumbnail = <>
                <div style={{ width: 100, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3 }}>
                    {gallery.medias && gallery.medias.thumbnails && gallery.medias.thumbnails.slice(0, 4).map((thumbnail, index) => {
                        const el = thumbnail.mime?.includes('video') ?
                            <video muted={true} loop={true} playsInline={true} key={index} src={thumbnail.url} style={{ width: '100%', height: '100%', display: 'block', borderRadius: 3, objectFit: 'cover' }} /> :
                            <img key={index} src={thumbnail.url} style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 3 }} />;
                        return el;
                    })}
                </div>
            </>;

            return {
                id: id,
                updated: date,
                thumbnail: gallery?.is_post_mode ? 'No preview' : thumbnail,
                info: info,
                shortcode: <>
                    {shortcodeMediaIds}
                    {shortcodeUniqueId}
                </>,
                actions: <>
                    <NekoButton className="primary" onClick={() => onEditShortcode(id)}>Edit</NekoButton>
                    <NekoButton className="danger" onClick={() => onRemoveShortcode({ id, name: gallery.name })}>Remove</NekoButton>
                </>
            };
        });
    }, [savedGalleries, mglGalleryShortcodeOverrideDisabled]);

    const jsxShortcodePaging = useMemo(() => {
        return (<div>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <NekoPaging currentPage={shortcodesQueryParams.page} limit={shortcodesQueryParams.limit}
                    total={shortcodesTotal} onClick={page => {
                        setShortcodesQueryParams(prev => ({ ...prev, page }));
                    }}
                />
            </div>
        </div>);
    }, [shortcodesQueryParams, shortcodesTotal]);

    const jsxShortcodeMaker = <>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <div>
                <NekoButton className="primary" onClick={onCreateNewGallery}>Create a Gallery</NekoButton>
                <NekoButton className="secondary" onClick={() => setModals({ ...modals, shortcodeInformation: true })}><NekoIcon icon="info-outline" width={15} style={{ paddingTop: 3, marginRight: 3 }} /> Learn more</NekoButton>
                {selectedIds.length > 0 && !modals.createCollection && <NekoButton style={{ marginLeft: 15 }} className="secondary" onClick={() => { setModals({ ...modals, createCollection: true }); }} requirePro={!isRegistered} >Create a Collection</NekoButton>}
            </div>
            {jsxShortcodePaging}
        </div>
        <NekoTable
            busy={isLoading}
            selectOnRowClick={false}
            sort={shortcodesQueryParams.sort}
            onSortChange={(accessor, by) => {
                setShortcodesQueryParams(prev => ({ ...prev, sort: { accessor, by } }));
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
                {isLoading ? 'Loading...' : 'It\'s empty here. You can create your first gallery shortcode by clicking on the button above.😸'}
            </>
            }

            selectedItems={selectedIds}
            onSelectRow={id => { setSelectedIds([id]) }}
            onSelect={ids => { setSelectedIds([...selectedIds, ...ids]) }}
            onUnselect={ids => { setSelectedIds(selectedIds.filter(x => !ids.includes(x))) }}
        />
    </>;

    const jsxSelectImagesModal = <MediaSelector
        isOpen={modals.selectMedia}
        selectedMedias={selectedMedias}
        onClose={() => setModals({ ...modals, selectMedia: false })}
        onSave={(selectedMediasArg) => { setselectedMedias(selectedMediasArg); }}
    />;

    const jsxSelectPostsModal = <PostSelector
        isOpen={modals.selectPosts}
        selectedPosts={postIds}
        onClose={() => setModals({ ...modals, selectPosts: false })}
        onSave={setPostIds}
    />;

    const jsxShortcodeInformationModal = <NekoModal
        isOpen={modals.shortcodeInformation}
        title="Gallery Manager"
        content={<>
            <NekoTypo p>Create beautiful galleries and easily use them in your posts, pages, or widgets by copying a shortcode.</NekoTypo>
            <NekoSpacer />
            <NekoTypo h2>What sets apart the Meow Gallery Block from the Gallery Manager?</NekoTypo>
            <NekoTypo p>
                The Meow Gallery Block is a Gutenberg Block, offering a visual way to craft galleries. Meanwhile, the Gallery Manager lets you create galleries using shortcodes—ideal for users of third-party page builders like Elementor that don't support Gutenberg Blocks.
                With the Gallery Manager, you can effortlessly create galleries, use them in different places, and manage edits in one central location.
            </NekoTypo>
            <NekoSpacer />
            <NekoTypo h2>How do the two shortcodes differ?</NekoTypo>
            <NekoTypo p>
                The first shortcode includes media IDs and updates along with the gallery—it's the default shortcode. If you make changes, you'll need to update it everywhere you've used it.
                On the other hand, the second shortcode features a unique ID. It's handy for using the same gallery in different places. The benefit is that when you update the gallery, the shortcode remains unchanged, saving you from updating it everywhere.
            </NekoTypo>
        </>
        }
        okButton={{ label: 'Close', onClick: () => setModals({ ...modals, shortcodeInformation: false }) }}
        onRequestClose={() => setModals({ ...modals, shortcodeInformation: false })}
    />;

    const jsxCreateShortcodeModal =
        <NekoModal
            isOpen={modals.createShortcode}
            title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {buttonOkText} a Gallery
                    <NekoSwitch style={{fontWeight: 400}}
                        onLabel={"Medias"} offLabel={"Posts"} width={100}
                        onBackgroundColor={colors.purple} offBackgroundColor={colors.green}
                        onChange={(val) => { setIsPostMode(!val); }} checked={!isPostMode}
                    />
                </div>
            }
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
                    {!isPostMode && <NekoButton className="primary" onClick={() => setModals({ ...modals, selectMedia: true })}>Select Medias</NekoButton>}
                </div>
                <NekoSpacer />

                {isPostMode && <>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <NekoSwitch style={{ flex: 'none', marginRight: 10 }}
                            onLabel={"Post IDs"} offLabel={"Latest Posts"} width={100}
                            onBackgroundColor={colors.purple} offBackgroundColor={colors.green}
                            onChange={(val) => { setIsLatestPostsMode(!val); }} checked={!isLatestPostsMode}
                        />

                        {!isLatestPostsMode &&
                            <>
                                <NekoInput disabled name="post_ids" type="text" value={postIds.join(', ')} style={{ flex: 1 }}
                                    placeholder="Post IDs... (separated by commas)" onChange={(e) => setPostIdsStringToArray(e)} />

                                <NekoButton
                                    className="primary"
                                    style={{ marginLeft: 10 }}
                                    onClick={() => setModals({ ...modals, selectPosts: true })}
                                >
                                    Select Posts
                                </NekoButton>
                            </>
                        }

                        {isLatestPostsMode &&
                            <NekoInput name="latest_posts_number" type="number" value={latestPostsNumber} style={{ flex: 1 }}
                                placeholder="Number of latest posts..." onChange={(e) => setLatestPostsNumber(Number(e))} />
                        }

                    </div>

                    {galleryLayout == 'carousel' &&
                        <NekoCheckbox
                            name="carousel_hero_mode"
                            label="Hero Mode"
                            description="Display the post title and excerpt on top of the image, linking to the post."
                            checked={carouselHeroMode}
                            onChange={setCarouselHeroMode}
                        />
                    }
                    <NekoSpacer />
                </>
                }

                <NekoInput name="gallery_description" type="text" value={galleryDescription} placeholder="Gallery Description..." onChange={(e) => setGalleryDescription(e)} />

                {selectedMedias.thumbnails.length > 0 &&
                <>
                    <div style={galleryPreviewStyle}>
                        <NekoTypo style={{ margin: 0 }}>{selectedMedias.thumbnails.length} Selected: </NekoTypo>


                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                            {selectedMedias.thumbnails.map((thumbnail, index) => {
                                if (!thumbnail.url) return null;
                                if (index > 10) return null;

                                const el = thumbnail.mime?.includes('video') ?
                                    <video muted={true} loop={true} playsInline={true} key={index} src={thumbnail.url} style={{ width: 25, height: 25, margin: 2, borderRadius: 3, objectFit: 'cover' }} /> :
                                    <img key={index} src={thumbnail.url} style={{ width: 25, height: 25, margin: 2, borderRadius: 3 }} />;

                                return el;
                            })}
                            {selectedMedias.thumbnails.length > 10 && <NekoTypo style={{ background: '#d3d3d3', padding: 5, borderRadius: 3 }}>+{selectedMedias.thumbnails.length - 10}</NekoTypo>}
                        </div>
                    </div>

                    <NekoButton className="primary" onClick={() => setModals({ ...modals, selectLeadImage: true })} style={{ marginTop: 10 }}>Select a Lead Image</NekoButton>

                    </>
                    
                    }
            </>}

            okButton={{ 
                label: buttonOkText, 
                onClick: onCreateShortcode, 
                disabled: (galleryName.length === 0 || ((!isPostMode && selectedMedias.thumbnails.length === 0) || (isPostMode && (isLatestPostsMode ? latestPostsNumber === 0 : postIds.length === 0)))) || busy || saveGalleryMutation.isPending 
            }}
            cancelButton={{ label: 'Cancel', onClick: cleanCancel, disabled: busy || saveGalleryMutation.isPending }}
            onRequestClose={() => cleanCancel()}
        />;


    const jsxSelectLeadImageModal =
    <NekoModal
        isOpen={modals.selectLeadImage}
        title="Select a Lead Image"
        content={<>
            <NekoTypo p>Choose a lead image for your gallery. The lead image will be used as the main thumbnail for this gallery. This will be used as the displayed image in a Collection.</NekoTypo>
            <NekoSpacer />

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', maxHeight: '400px', overflowY: 'auto' }}>
                {selectedMedias.thumbnails.map((thumbnail, index) => {
                    const isSelected = selectedMedias.thumbnail_ids[index] === leadImageId;
                    const thumbnailStyle = {
                        width: 65,
                        height: 65,
                        margin: 2,
                        borderRadius: 5,
                        objectFit: 'cover',
                        cursor: 'pointer',
                        border: isSelected ? '3px solid rgb(106, 145, 228)' : '1px solid #ddd',
                        position: 'relative'
                    };

                    const handleClick = () => {
                        setLeadImageId(selectedMedias.thumbnail_ids[index]);
                    };

                    return (
                        <div key={index} onClick={handleClick} style={{ position: 'relative' }}>
                            {thumbnail.mime?.includes('video') ? (
                                <video muted={true} loop={true} playsInline={true} src={thumbnail.url} style={thumbnailStyle} />
                            ) : (
                                <img src={thumbnail.url} style={thumbnailStyle} />
                            )}
                            {isSelected && (
                                <div style={{ 
                                    position: 'absolute', 
                                    top: '5px', 
                                    right: '5px', 
                                    borderRadius: '50%', 
                                    padding: '2px',
                                    color: 'white',
                                    fontSize: '16px'
                                }}>
                                    ⭐
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </>}
        okButton={{ 
            label: 'Save Lead Image', 
            onClick: () => setModals({ ...modals, selectLeadImage: false }) 
        }}
        cancelButton={{ 
            label: 'Cancel', 
            onClick: () => {
                setLeadImageId(savedGalleries[galleryId]?.lead_image_id || '');
                setModals({ ...modals, selectLeadImage: false });
            } 
        }}
        onRequestClose={() => {
            setLeadImageId(savedGalleries[galleryId]?.lead_image_id || '');
            setModals({ ...modals, selectLeadImage: false });
        }}
    />;

    return { 
        jsxShortcodeMaker, 
        jsxCreateShortcodeModal, 
        jsxSelectImagesModal,
        jsxSelectLeadImageModal,
        jsxSelectPostsModal,
        jsxShortcodeInformationModal, 
        setSelectedIdsGalleryMaker, 
        shortcodesTotal,
        shortcodesQueryParams,
        setShortcodesQueryParams,
        savedGalleries 
    };
};

export { ShortcodeMaker };