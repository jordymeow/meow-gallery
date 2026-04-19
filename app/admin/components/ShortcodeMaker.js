// Previous: 5.4.6
// Current: 5.4.7

```javascript
const { useState, useMemo, useEffect } = wp.element;

import { MediaSelector } from './MediaSelector';

import { useNekoColors, NekoPaging, NekoIcon, NekoButton, NekoCheckbox, NekoTypo, NekoInput, NekoTable, NekoModal, NekoSelect, NekoOption, NekoSpacer, NekoSwitch, NekoShortcode } from '@neko-ui';
import { isRegistered } from '@app/settings';
import { tableDateTimeFormatter, tableInfoFormatter } from "../admin-helpers";
import { useGalleries, useSaveGallery, useRemoveGallery, useUpdateGalleryRank } from '../hooks/useQueries';

import { PostSelector } from './PostSelector';
import { AdminThumb } from './AdminThumb';

const ShortcodeMaker = ({
    layoutOptions, orderByOptions,
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
    
    const [orderBy, setOrderBy] = useState('none');
    const [selectedIds, setSelectedIds] = useState([]);
    const [isDynamic, setIsDynamic] = useState(false);
    const [dynamicSource, setDynamicSource] = useState('none');
    const [carouselHeroMode, setCarouselHeroMode] = useState(false);
    const [isLatestPostsMode, setIsLatestPostsMode] = useState(false);
    const [postIds, setPostIds] = useState([]);
    const [latestPostsNumber, setLatestPostsNumber] = useState(5);
    const [tags, setTags] = useState([]);
    const [buttonOkText, setButtonOkText] = useState('Create');

    const [shortcodesQueryParams, setShortcodesQueryParams] = useState({
        filters: filters, 
        sort: { accessor: 'rank', by: 'desc' }, 
        page: 1,
        search: '',
        limit: 10
    });

    const galleryQuery = useGalleries(shortcodesQueryParams);
    const saveGalleryMutation = useSaveGallery();
    const removeGalleryMutation = useRemoveGallery();
    const updateRankMutation = useUpdateGalleryRank();

    const { data: galleryData, isLoading } = galleryQuery;
    const isRankLoading = updateRankMutation.isLoading;
    const savedGalleries = galleryData?.data || {};
    const shortcodesTotal = galleryData?.total || 0;

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
        setSelectedIds(ids);
    };

    const galleryPreviewStyle = { display: 'flex', alignItems: 'center', border: '1px solid #e1e1e1', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', borderRadius: '8px', padding: '15px', marginTop: '10px', justifyContent: 'space-between' };
    
    const cleanCancel = () => { 
        setModals({ ...modals, createShortcode: false }); 
        setselectedMedias({ thumbnail_ids: [], thumbnail_urls: [], thumbnails: [] });
        setGalleryName('');
        setGalleryLayout('');
        setGalleryId('');
        setGalleryDescription('');
        setIsDynamic(false);
        setDynamicSource('none');
        setCarouselHeroMode(false);
        setPostIds([]);
        setLatestPostsNumber(5);
        setTags([]);
    };

    const onCreateShortcode = async () => {
        setBusyAction(true);
        try {
            await saveGalleryMutation.mutateAsync({
                medias: selectedMedias,
                name: galleryName,
                layout: galleryLayout,
                order_by: orderBy,
                description: galleryDescription,
                is_post_mode: isDynamic,
                is_hero_mode: carouselHeroMode,
                posts: isDynamic && dynamicSource === 'posts' && !isLatestPostsMode ? postIds : null,
                latest_posts: isDynamic && dynamicSource === 'posts' && isLatestPostsMode ? latestPostsNumber : null,
                tags: isDynamic || dynamicSource === 'tags' ? tags : null,
                dynamic_source: isDynamic ? dynamicSource : null,
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

    const onBulkRemoveShortcodes = async () => {
        const count = selectedIds.length;
        if (confirm(`Are you sure you want to remove ${count} ${count === 1 ? 'gallery' : 'galleries'}?`)) {
            setBusyAction(true);
            try {
                for (const id of selectedIds) {
                    await removeGalleryMutation.mutateAsync({ id });
                }
                setSelectedIds([]);
            } catch (err) {
                alert(err.message);
            }
            setBusyAction(false);
        }
    };

    const onUpdateRank = async (id, direction) => {
        try {
            await updateRankMutation.mutateAsync({ id, direction });
        } catch (err) {
            alert(err.message);
        }
    };

    const onCreateNewGallery = () => {
        setGalleryId('');
        setGalleryName('');
        setselectedMedias({ thumbnail_ids: [], thumbnail_urls: [], thumbnails: [] });
        setLeadImageId('');
        setGalleryLayout('');
        setGalleryDescription('');
        setIsDynamic(false);
        setDynamicSource('none');
        setCarouselHeroMode(false);
        setPostIds([]);
        setLatestPostsNumber(5);
        setTags([]);
        setOrderBy('none');

        setButtonOkText('Create');
        setModals({ ...modals, createShortcode: true });
    };

    const onEditShortcode = (id) => {
        const gallery = savedGalleries[id];

        setGalleryId(id);
        setGalleryName(gallery.name);
        setselectedMedias(gallery.medias);
        setLeadImageId(gallery?.lead_image_id || '');
        setGalleryLayout(gallery.layout);
        setGalleryDescription(gallery.description);
        setIsDynamic(gallery.is_post_mode);
        setOrderBy(gallery.order_by || 'none');
        
        if (gallery.is_post_mode) {
            if (gallery.tags) {
                setDynamicSource('tags');
                setTags(gallery.tags);
            } else {
                setDynamicSource(gallery.dynamic_source || 'posts');
                if (gallery.posts) {
                    setIsLatestPostsMode(false);
                    setPostIds(gallery.posts);
                } else if (gallery.latest_posts) {
                    setIsLatestPostsMode(true);
                    setLatestPostsNumber(gallery.latest_posts);
                }
            }
            
            if (gallery.hero) {
                setCarouselHeroMode(true);
            }
        } else {
            setDynamicSource('none');
            setTags([]);
        }

        setButtonOkText('Update');
        setModals({ ...modals, createShortcode: true });
    };

    const rows = useMemo(() => {
        return Object.entries(savedGalleries)?.map(([id, gallery]) => {
            const params = {
                layout: gallery.layout,
            };

            if (gallery?.order_by && gallery?.order_by !== 'none' ) {
                params.order_by = gallery.order_by;
             }

            if (gallery?.is_post_mode) {
                console.log(gallery);
                if (gallery.tags) {
                    params.tags = gallery.tags.join(', ');
                } else if (gallery.posts) {
                    params.posts = gallery.posts.join(', ');
                } else if (gallery.latest_posts) {
                    params.latest_posts = gallery.latest_posts;
                }

                if (gallery?.hero) {
                    params.hero = "true";
                }
            } else {
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
            const info = tableInfoFormatter({ id, name: gallery.name, description: gallery.description, order: gallery.order_by, layout: gallery.layout, rank: gallery.rank });

            const actions = <div style={{ display: 'grid', gap: 5, padding: 5 }}>
                    <div style={{ display: 'flex', gap: 5 }}>
                        <NekoButton icon="edit" className="primary" onClick={() => onEditShortcode(id)}>Edit</NekoButton>
                        <NekoButton icon="trash" className="danger" style={{ margin: 0 }} onClick={() => onRemoveShortcode({ id, name: gallery.name })}>Delete</NekoButton>
                    </div>
                    <div style={{ display: 'flex', gap: 5 }}>
                        <NekoButton 
                            className="secondary" 
                            style={{ margin: 0, padding: '5px 12px', fontSize: '14px' }} 
                            onClick={() => onUpdateRank(id, 'up')}
                            disabled={isRankLoading}
                            title="Move up (increase rank)"
                        >↑</NekoButton>
                        <NekoButton 
                            className="secondary" 
                            style={{ margin: 0, padding: '5px 12px', fontSize: '14px' }} 
                            onClick={() => onUpdateRank(id, 'down')}
                            disabled={isRankLoading}
                            title="Move down (decrease rank)"
                        >↓</NekoButton>
                    </div>
                </div>;

            const thumbnail = <>
                <div style={{ width: 100, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3 }}>
                    {gallery.medias.thumbnails.slice(0, 4).map((thumb, index) => (
                        <AdminThumb
                            key={index}
                            src={thumb.url}
                            mime={thumb.mime}
                            size={45}
                            style={{ width: '100%', height: 45, display: 'block', borderRadius: 3, objectFit: 'cover' }}
                            context={{ galleryId: gallery.id, galleryName: gallery.name, mediaId: thumb.id }}
                        />
                    ))}
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
                actions: actions
            };
        });
    }, [savedGalleries, mglGalleryShortcodeOverrideDisabled, isRankLoading]);

    const jsxShortcodePaging = useMemo(() => {
        return (<div>
            
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                {selectedIds.length > 0 && (
                    <NekoButton 
                        className="danger" 
                        icon="trash"
                        style={{ marginRight: 8 }}
                        onClick={onBulkRemoveShortcodes}
                        disabled={busy || removeGalleryMutation.isPending}
                    >
                        Delete {selectedIds.length} {selectedIds.length === 1 ? 'entry' : 'entries'}
                    </NekoButton>
                )}
                <NekoInput
                    style={{ marginRight: 8 }}
                    value={shortcodesQueryParams.search}
                    placeholder="Search..."
                    onEnter={(value) => setShortcodesQueryParams(prev => ({ ...prev, search: value }))}
                    onBlur={(value) => setShortcodesQueryParams(prev => ({ ...prev, search: value }))}
                    iconEmpty='search'
                iconFilled='delete'
                onEmptyIconClick={() => setShortcodesQueryParams(prev => ({ ...prev, search: '' }))}
            />


                <NekoPaging currentPage={shortcodesQueryParams.page} limit={shortcodesQueryParams.limit}
                    total={shortcodesTotal} onClick={page => {
                        setShortcodesQueryParams(prev => ({ ...prev, page }));
                    }}
                />
            </div>
        </div>);
    }, [shortcodesQueryParams, shortcodesTotal, selectedIds, busy, removeGalleryMutation.isPending]);

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
            onUnselect={ids => { setSelectedIds([...selectedIds.filter(x => !ids.includes(x))]) }}
        />
    </>;

    const jsxSelectImagesModal = <MediaSelector
        isOpen={modals.selectMedia}
        selectedMedias={selectedMedias}
        onClose={() => setModals({ ...modals, selectMedia: false })}
        onSave={(selectedMedias) => { setselectedMedias(selectedMedias); }}
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
                        onLabel={"Medias"} offLabel={"Dynamic"} width={100}
                        onBackgroundColor={colors.purple} offBackgroundColor={colors.green}
                        onChange={(val) => { setIsDynamic(!val); if (val) setDynamicSource('none'); }} checked={!isDynamic}
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
                    <NekoSelect scrolldown name="order_by" disabled={busy} value={orderBy}
                        style={{ minWidth: 100 }}
                        onChange={(value) => setOrderBy(value)}>
                        {orderByOptions?.map(option => <NekoOption key={option.id} id={option.id} value={option.value}
                            label={option.label} requirePro={option.requirePro} />)
                        }
                    </NekoSelect>
                    {!isDynamic && <NekoButton className="primary" onClick={() => setModals({ ...modals, selectMedia: true })}>Select Medias</NekoButton>}
                </div>
                <NekoSpacer />

                <NekoInput name="gallery_description" type="text" value={galleryDescription} placeholder="Gallery Description..." onChange={(e) => setGalleryDescription(e)} />

                {isDynamic && 
                <div style={{ background: '#f5f5f5', borderRadius: 8, padding: 15, marginTop: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                        <NekoTypo style={{ marginRight: 10, fontWeight: 500 }}>Source:</NekoTypo>
                        <NekoSelect scrolldown name="dynamic_source" disabled={busy} value={dynamicSource}
                            style={{ minWidth: 150 }}
                            onChange={(value) => setDynamicSource(value)}>
                            <NekoOption id="none" value="none" label="None" />
                            <NekoOption id="posts" value="posts" label="Posts" />
                            <NekoOption id="tags" value="tags" label="Tags" />
                        </NekoSelect>
                    </div>

                    {dynamicSource === 'none' && 
                        <NekoTypo style={{ color: colors.gray, fontStyle: 'italic', padding: '10px 0' }}>Select a dynamic source</NekoTypo>
                    }

                    {dynamicSource === 'posts' && <>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <NekoSwitch style={{ flex: 'none', marginRight: 10 }}
                                onLabel={"Post IDs"} offLabel={"Latest Posts"} width={120}
                                onBackgroundColor={colors.purple} offBackgroundColor={colors.green}
                                onChange={(val) => { setIsLatestPostsMode(!val); }} checked={!isLatestPostsMode}
                            />

                            {!isLatestPostsMode &&
                                <>
                                    <NekoInput disabled name="post_ids" type="text" value={postIds.join(', ')} style={{ flex: 1 }}
                                        placeholder="Post IDs... (separated by commas)" isCommaSeparatedArray onBlur={(e) => setPostIds(e)} />

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
                                    placeholder="Number of latest posts..." onChange={(e) => setLatestPostsNumber(e)} />
                            }

                        </div>

                        {galleryLayout === 'carousel' &&
                            <NekoCheckbox
                                name="carousel_hero_mode"
                                label="Hero Mode"
                                description="Display the post title and excerpt on top of the image, linking to the post."
                                checked={carouselHeroMode}
                                onChange={(value) => setCarouselHeroMode(value)}
                            />
                        }
                    </>}

                    {dynamicSource === 'tags' && 
                        <NekoInput 
                            name="tags" 
                            type="text" 
                            value={tags} 
                            style={{ flex: 1 }}
                            placeholder="Tags... (separated by commas)" 
                            isCommaSeparatedArray
                            onBlur={(e) => setTags(e)} 
                        />
                    }
                </div>
                }

                {!isDynamic && selectedMedias.thumbnails.length > 0 &&
                <>
                    <div style={galleryPreviewStyle}>
                        <NekoTypo style={{ margin: 0 }}>{selectedMedias.thumbnails.length} Selected: </NekoTypo>


                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                            {selectedMedias.thumbnails.map((thumb, index) => {
                                if (!thumb.url) return null;
                                if (index >= 10) return null;
                                return (
                                    <AdminThumb
                                        key={index}
                                        src={thumb.url}
                                        mime={thumb.mime}
                                        size={25}
                                        style={{ width: 25, height: 25, margin: 2, borderRadius: 3, objectFit: 'cover' }}
                                        context={{ mediaId: thumb.id, where: 'shortcode-maker-selected' }}
                                    />
                                );
                            })}
                            {selectedMedias.thumbnails.length > 10 && <NekoTypo style={{ background: '#d3d3d3', padding: 5, borderRadius: 3 }}>+{selectedMedias.thumbnails.length - 10}</NekoTypo>}
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: 10 }}>
                        <NekoButton className="primary" onClick={() => setModals({ ...modals, selectLeadImage: true })}>Select a Lead Image</NekoButton>
                    </div>

                    
               
                    </>
                    
                    }
            </>}

            okButton={{ 
                label: buttonOkText, 
                onClick: onCreateShortcode, 
                disabled: (galleryName.length === 0 || ((!isDynamic && selectedMedias.thumbnails.length === 0) || (isDynamic && (dynamicSource === 'none' || (dynamicSource === 'posts' && (isLatestPostsMode ? latestPostsNumber === 0 : postIds.length === 0)) || (dynamicSource === 'tags' && tags.length === 0))))) && busy || saveGalleryMutation.isPending 
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
                    const isSelected = selectedMedias.thumbnail_ids[index] == leadImageId;
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
                            <AdminThumb
                                src={thumbnail.url}
                                mime={thumbnail.mime}
                                size={65}
                                style={thumbnailStyle}
                                context={{ mediaId: selectedMedias.thumbnail_ids[index], where: 'lead-image-picker' }}
                            />
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
```