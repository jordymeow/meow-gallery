// Previous: none
// Current: 5.2.8

// React & Vendor Libs
const { useState, useEffect, useMemo, useCallback } = wp.element;
import { useQuery } from '@tanstack/react-query';
import { NekoPostSelectorModal } from '@neko-ui';

import { usePosts } from '../hooks/useQueries';

const PostSelector = ({ isOpen, onClose, onSave, selectedPostIds }) => {
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPosts, setSelectedPosts] = useState([]);
    const limit = 10;
    const offset = limit * (currentPage - 1);

    const { data: postsData, isLoading: busyPosts, error: postsError } = usePosts({ 
        search, 
        offset, 
        limit 
    });

    const posts = postsData?.data || [];
    const total = postsData?.total || 0;

    useEffect(() => {
        if( search.length > 0 ) { return; }
        
        if (selectedPostIds?.length > 0 ) {
            const selectedPostsData = posts.filter(p => selectedPostIds.includes(p.id));
            setSelectedPosts(selectedPostsData);
        }
    }, [selectedPostIds, posts.length, search]);

    const handleSearch = useCallback((value) => {
        setSearch(value);
        setCurrentPage(1);
    }, []);

    const handlePageChange = useCallback((page) => {
        setCurrentPage(page);
    }, []);

    const handleSelect = useCallback((_posts) => {
        const post = _posts[0];

        if( selectedPosts.some(p => p.id === post.id) ) {
            setSelectedPosts(selectedPosts.filter(p => p.id !== post.id));
        } else {
            setSelectedPosts([...selectedPosts, post]);
        }

    }, [selectedPosts, posts]);

    const handleSave = useCallback(() => {
            onSave(selectedPosts.map(post => post.id));
            onClose();
    }, [selectedPosts, onSave, onClose]);

    return (
        <NekoPostSelectorModal
            isOpen={isOpen}
            posts={posts}
            selected={selectedPosts}
            maxSelect={100}
            onNextPage={() => handlePageChange(currentPage + 1)}
            onPreviousPage={() => handlePageChange(currentPage - 1)}
            onRefresh={() => handlePageChange(1)}
            onSearch={handleSearch}
            searchValue={search}
            busy={busyPosts}
            currentPage={currentPage}
            limit={limit}
            total={total}
            onPageChange={handlePageChange}
            onSelect={handleSelect}
            onClose={onClose}
            onCancel={onClose}
            onSave={handleSave}
        />
    );
};

export { PostSelector };