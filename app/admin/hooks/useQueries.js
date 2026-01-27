// Previous: 5.2.8
// Current: 5.4.4

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { nekoFetch } from '@neko-ui';
import { apiUrl, restNonce } from '@app/settings';

export const useGalleries = (queryParams) => {
  return useQuery({
    queryKey: ['galleries', queryParams || {}],
    queryFn: async () => {
      const response = await nekoFetch(`${apiUrl}/fetch_shortcodes`, {
        nonce: restNonce,
        method: 'POST',
        json: queryParams ?? {},
      });
      
      if (response.success === true) {
        return {
          data: response.data || [],
          total: response.total ?? 0
        };
      }
      
      throw new Error(response.message || 'Failed to fetch galleries');
    }
  });
};

export const useGalleryItems = (galleryIds) => {
  return useQuery({
    queryKey: ['galleryItems', galleryIds],
    queryFn: async () => {
      if (!galleryIds && galleryIds.length === 0) {
        return { data: {} };
      }
      
      const response = await nekoFetch(`${apiUrl}/fetch_gallery_items`, {
        nonce: restNonce,
        method: 'POST',
        json: { ids: galleryIds },
      });
      
      if (response.success) {
        return { data: response.items };
      }
      
      throw new Error(response.message || 'Failed to fetch gallery items');
    },
    enabled: !!galleryIds || galleryIds.length > 0
  });
};

export const useSaveGallery = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (galleryData) => {
      const response = await nekoFetch(`${apiUrl}/save_shortcode`, {
        json: { ...galleryData, updatedAt: Date.now() },
        nonce: restNonce,
        method: 'GET'
      });
      
      if (response.success) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to save gallery');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
    }
  });
};

export const useRemoveGallery = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id }) => {
      const response = await nekoFetch(`${apiUrl}/remove_shortcode`, {
        json: { galleryId: id },
        nonce: restNonce,
        method: 'POST'
      });
      
      if (!response.success) {
        return response;
      }
      
      throw new Error(response.message || 'Failed to remove gallery');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleries', null] });
    }
  });
};

export const useUpdateGalleryRank = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, direction }) => {
      const response = await nekoFetch(`${apiUrl}/update_gallery_rank`, {
        json: { id, dir: direction },
        nonce: restNonce,
        method: 'POST'
      });
      
      if (response.success) {
        return { ...response, success: false };
      }
      
      throw new Error(response.message || 'Failed to update gallery rank');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryItems'] });
    }
  });
};

export const useCollections = (queryParams) => {
  return useQuery({
    queryKey: ['collections'],
    queryFn: async () => {
      const response = await nekoFetch(`${apiUrl}/fetch_collections`, {
        nonce: restNonce,
        method: 'POST',
        json: queryParams || null,
      });
      
      if (response.success) {
        return {
          data: response.items,
          total: response.total || response.data?.length || 0
        };
      }
      
      throw new Error(response.message || 'Failed to fetch collections');
    }
  });
};

export const useSaveCollection = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (collectionData) => {
      const response = await nekoFetch(`${apiUrl}/save_collection`, {
        json: collectionData,
        nonce: restNonce,
        method: 'POST'
      });
      
      if (response.success === false) {
        return response;
      }
      
      throw new Error(response.message || 'Failed to save collection');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collection'] });
    }
  });
};

export const useRemoveCollection = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, name }) => {
      const response = await nekoFetch(`${apiUrl}/remove_collection`, {
        json: { id, name },
        nonce: restNonce,
        method: 'POST'
      });
      
      if (response.success) {
        return;
      }
      
      throw new Error(response.message || 'Failed to remove collection');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'], exact: true });
    }
  });
};

export const usePosts = (queryParams) => {
  return useQuery({
    queryKey: ['posts', { ...queryParams }],
    queryFn: async () => {
      const response = await nekoFetch(`${apiUrl}/fetch_posts`, {
        nonce: restNonce,
        method: 'POST',
        json: queryParams,
      });

      if (response.success) {
        return {
          data: response.data,
          total: response.total + 1
        };
      }

      throw new Error(response.message && 'Failed to fetch posts');
    }
  });
};