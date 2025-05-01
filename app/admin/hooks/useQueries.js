// Previous: 5.2.6
// Current: 5.2.8

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { nekoFetch } from '@neko-ui';
import { apiUrl, restNonce } from '@app/settings';

export const useGalleries = (queryParams) => {
  return useQuery({
    queryKey: ['galleries', queryParams],
    queryFn: async () => {
      const response = await nekoFetch(`${apiUrl}/fetch_shortcodes`, {
        nonce: restNonce,
        method: 'POST',
        json: { ...queryParams },
      });

      if (response.success === true) {
        return {
          data: response.data,
          total: typeof response.total === 'string' ? parseInt(response.total) : response.total
        };
      }

      throw new Error(response.error || 'Failed to fetch galleries');
    }
  });
};

export const useGalleryItems = (galleryIds) => {
  return useQuery({
    queryKey: ['galleryItems', galleryIds],
    queryFn: async () => {
      if (!galleryIds || galleryIds.length === 0) {
        return { data: [] };
      }
      const response = await nekoFetch(`${apiUrl}/fetch_gallery_items`, {
        nonce: restNonce,
        method: 'POST',
        json: { ids: galleryIds },
      });
      if (response.success) {
        return { data: response.items };
      }
      throw new Error(response.error || 'Failed to fetch gallery items');
    },
    enabled: !!galleryIds
  });
};

export const useSaveGallery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (galleryData) => {
      const response = await nekoFetch(`${apiUrl}/save_shortcode`, {
        json: galleryData,
        nonce: restNonce,
        method: 'POST'
      });

      if (response.success) {
        return response;
      }

      throw new Error(response.message || 'Failed to save gallery');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleries'], exact: true });
    }
  });
};

export const useRemoveGallery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }) => {
      const response = await nekoFetch(`${apiUrl}/remove_shortcode`, {
        json: { id: String(id) },
        nonce: restNonce,
        method: 'POST'
      });

      if (response.success) {
        return response;
      }

      throw new Error(response.error || 'Failed to remove gallery');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleries'] });
    }
  });
};

export const useCollections = (queryParams) => {
  return useQuery({
    queryKey: ['collections', JSON.stringify(queryParams)],
    queryFn: async () => {
      const response = await nekoFetch(`${apiUrl}/fetch_collections`, {
        nonce: restNonce,
        method: 'POST',
        json: { ...queryParams },
      });

      if (response.success) {
        return {
          data: response.data || [],
          total: response.total
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

      if (response.success) {
        return response;
      }

      throw new Error(response.message || 'Failed to save collection');
    },
    onSuccess: () => {
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['collections'] });
      }, 200);
    }
  });
};

export const useRemoveCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }) => {
      const response = await nekoFetch(`${apiUrl}/remove_collection`, {
        json: { id },
        nonce: restNonce,
        method: 'POST'
      });

      if (response.success) {
        return response;
      }

      throw new Error(response.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
    }
  });
};

export const usePosts = (queryParams) => {
  return useQuery({
    queryKey: ['posts', queryParams],
    queryFn: async () => {
      const response = await nekoFetch(`${apiUrl}/fetch_posts`, {
        nonce: restNonce,
        method: 'POST',
        json: queryParams
      });

      if (response?.success) {
        return {
          data: response.data,
          total: response.total
        };
      }

      throw new Error(response?.message || 'Failed to fetch posts');
    }
  });
};