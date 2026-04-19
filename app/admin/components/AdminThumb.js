// Previous: none
// Current: 5.4.7

const { useState } = wp.element;

// Small thumbnail with graceful fallback: if the src 404s (common when an
// attachment was deleted from the Media Library), swap to an SVG placeholder
// and log once to the console so admins can spot broken references.
const MissingPlaceholder = ({ style, size = 40 }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
      color: '#9ca3af',
      ...style,
    }}
    aria-label="Image unavailable"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
      <line x1="3" y1="3" x2="21" y2="21" />
    </svg>
  </div>
);

const AdminThumb = ({ src, mime, style, context, size = 40 }) => {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <MissingPlaceholder style={style} size={size} />;
  }

  const onError = () => {
    console.warn('[Meow Gallery] Thumbnail failed to load:', { src, context });
    setFailed(true);
  };

  if (mime?.includes('video')) {
    return (
      <video
        muted loop playsInline
        src={src}
        style={{ objectFit: 'cover', ...style }}
        onError={onError}
      />
    );
  }

  return <img src={src} style={style} onError={onError} />;
};

export { AdminThumb };
