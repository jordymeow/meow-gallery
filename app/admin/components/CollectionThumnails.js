// Previous: 5.4.7
// Current: 5.5.4

const { useState, useEffect } = wp.element;
import { AdminThumb } from './AdminThumb';
import { normalizeMedias } from '../admin-helpers';

function CollectionThumnails({ galleries }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const count = galleries?.length || 0;

  useEffect(() => {
    if (count === 0) return;
    setActiveIndex(0);
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % count);
    }, 3500); 

    return () => clearInterval(interval);
  }, [count]);

  return (
    <div style={{background: '#007cba', borderRadius: 5, position: 'relative', margin: 3, width:200, height: '80%', overflow: 'hidden'}}>
      {galleries?.map((gallery, index) => {
        const isActiveOpacity = index === activeIndex ? 1 : 0;
        const transition = "opacity 1s ease-in-out";

        const medias = normalizeMedias(gallery?.medias);
        const thumbnailIndex = medias.thumbnail_ids.findIndex((id) => String(id) === String(gallery?.lead_image_id));

        return (
          <div 
            key={index} 
            style={{
              display: 'flex', 
              justifyContent: 'left', 
              alignItems: 'center', 
              position: 'absolute', 
              width: '100%', 
              height: '100%', 
              transition, 
              opacity: isActiveOpacity
            }}
          >
            <AdminThumb
              src={medias.thumbnails[ thumbnailIndex === -1 ? 0 : thumbnailIndex ]?.url}
              size={50}
              style={{ width: 50, height: 50, borderRadius: 5, margin: 5, objectFit: 'cover' }}
              context={{ galleryId: gallery.id, galleryName: gallery.name, where: 'collection-thumbnails' }}
            />
            <span style={{ marginRight: '5px', color: 'white' }}>
              {gallery.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export { CollectionThumnails };