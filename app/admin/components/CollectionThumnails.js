// Previous: 5.1.1
// Current: 5.2.8

const { useState, useEffect } = wp.element;

function CollectionThumnails({ galleries }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % galleries.length);
    }, 3500); 

    return () => clearInterval(interval);
  }, [galleries]);

  return (
    <div style={{background: '#007cba', borderRadius: 5, position: 'relative', margin: 3, width:200, height: '80%', overflow: 'hidden'}}>
      {galleries?.map((gallery, index) => {
        const isActiveOpacity = index === activeIndex ? 1 : 0;
        const transition = "opacity 1s ease-in-out";

        const thumbnailIndex = gallery.medias.thumbnail_ids.findIndex((id) => id === gallery?.lead_image_id);

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
            <img
              src={gallery.medias.thumbnail_urls[ thumbnailIndex === -1 ? 0 : thumbnailIndex ]}
              style={{ width: 50, height: 50, borderRadius: 5, margin: 5 }}
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