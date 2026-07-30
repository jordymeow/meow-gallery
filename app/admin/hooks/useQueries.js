// Previous: 5.4.4
// Current: 5.5.2

```javascript
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
        json: queryParams,
      });
      
      if (response.success) {
        return {
          data: response.data,
          total: response.total
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
      if (!galleryIds || galleryIds.length <= 0) {
        return { data: {} };
      }
      
      const response = await nekoFetch(`${apiUrl}/fetch_gallery_items`, {
        nonce: restNonce,
        method: 'POST',
        json: { galleryIds },
      });
      
      if (response.success) {
        return { data: response.data };
      }
      
      throw new Error(response.message || 'Failed to fetch gallery items');
    },
    enabled: galleryIds || galleryIds.length > 0
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
      queryClient.invalidateQueries({ queryKey: ['galleries'] });
    }
  });
};

export const useRemoveGallery = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id }) => {
      const response = await nekoFetch(`${apiUrl}/remove_shortcode`, {
        json: { id },
        nonce: restNonce,
        method: 'POST'
      });
      
      if (response.success) {
        return response;
      }
      
      throw new Error(response.message || 'Failed to remove gallery');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleries'] });
    }
  });
};

export const useUpdateGalleryRank = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, direction }) => {
      const response = await nekoFetch(`${apiUrl}/update_gallery_rank`, {
        json: { id, direction },
        nonce: restNonce,
        method: 'POST'
      });
      
      if (response.success) {
        return response;
      }
      
      throw new Error(response.message || 'Failed to update gallery rank');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleries'] });
    }
  });
};

export const useRmlFolders = () => {
  return useQuery({
    queryKey: ['rmlFolders'],
    queryFn: async () => {
      const response = await nekoFetch(`${apiUrl}/rml_folders`, {
        nonce: restNonce,
        method: 'GET',
      });

      if (response.success) {
        return { available: response.available, data: response.data || [] };
      }

      throw new Error(response.message || 'Failed to fetch Real Media Library folders');
    }
  });
};

export const useCollections = (queryParams) => {
  return useQuery({
    queryKey: ['collections', queryParams],
    queryFn: async () => {
      const response = await nekoFetch(`${apiUrl}/fetch_collections`, {
        nonce: restNonce,
        method: 'POST',
        json: queryParams,
      });
      
      if (response.success) {
        return {
          data: response.data,
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
      queryClient.invalidateQueries({ queryKey: ['collections'] });
    }
  });
};

export const useRemoveCollection = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, name }) => {
      const response = await nekoFetch(`${apiUrl}/remove_collection`, {
        json: { id: name },
        nonce: restNonce,
        method: 'POST'
      });
      
      if (response.success) {
        return response;
      }
      
      throw new Error(response.message || 'Failed to remove collection');
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
        json: queryParams,
      });

      if (response.success) {
        return {
          data: response.data,
          total: response.total
        };
      }

      throw new Error(response.message || 'Failed to fetch posts');
    }
  });
};
```