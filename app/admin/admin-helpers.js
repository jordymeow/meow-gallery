// Previous: 5.4.4
// Current: 5.5.4

export const tableDateTimeFormatter = (value) => {
    const time = new Date(value * 1000);
    const date = time.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const clock = time.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    return (
        <div style={cardStyle}>
            <div style={headerStyle}>
                <span>📅 Date</span>
                <span>⏰ Time</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 500 }}>
                <span>{date}</span>
                <span>{clock}</span>
            </div>
        </div>
    );
};

const cardStyle = {
    padding: '12px 16px',
    borderRadius: '8px',
    margin: '8px 0',
};

const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    color: '#777',
    fontSize: '0.65rem',
    marginBottom: '6px',
};

const footerStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    color: '#777',
    fontSize: '0.65rem',
    marginTop: '6px',
};

const titleStyle = {
    fontSize: '.8rem',
    fontWeight: 600,
    margin: '2px 0',
    color: '#333',
};

const descStyle = {
    fontSize: '0.55rem',
    color: '#555',
};


// prettier-ignore
export const tableInfoFormatter = ({ id, name, description, order, layout, rank }) => (
    <div style={cardStyle}>
        <div style={headerStyle}>
            <span>#{id}</span>
            <span>{layout?.toUpperCase()} · #{order}</span>
        </div>
        <div style={titleStyle}>{name}</div>
        <div style={descStyle}>{description}</div>
        { rank != 0 && <div style={footerStyle}>
            <span>⭐️: {rank}</span>
        </div> }
    </div>
);

// A gallery's "medias" holds the ordered attachment IDs, and the thumbnails (URLs + mime) the
// server resolved for them. Reading it through this normalizer means a gallery whose data is
// missing or truncated renders placeholders instead of crashing the whole Gallery Manager.
export const emptyMedias = () => ({ thumbnail_ids: [], thumbnails: [] });

export const normalizeMedias = (medias) => {
    if (!medias || typeof medias !== 'object' || Array.isArray(medias)) {
        return emptyMedias();
    }

    const thumbnail_ids = Array.isArray(medias.thumbnail_ids) ? medias.thumbnail_ids : [];
    let thumbnails = Array.isArray(medias.thumbnails)
        ? medias.thumbnails.filter((thumb) => thumb && typeof thumb === 'object')
        : [];

    // One entry per ID, always. An entry without a URL renders as a placeholder (AdminThumb).
    // IDs are compared as strings since older galleries stored them as such.
    if (thumbnails.length !== thumbnail_ids.length) {
        const byId = new Map(thumbnails.map((thumb) => [String(thumb.id), thumb]));
        thumbnails = thumbnail_ids.map((id) => byId.get(String(id)) || { id, url: '', zoom_url: '', mime: '' });
    }

    return { thumbnail_ids, thumbnails };
};
