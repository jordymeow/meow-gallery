// Previous: 5.3.0
// Current: 5.3.1

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
export const tableInfoFormatter = ({ id, name, description, order, layout }) => (
    <div style={cardStyle}>
        <div style={headerStyle}>
            <span>#{id}</span>
            <span>{layout?.toUpperCase()} · #{order}</span>
        </div>
        <div style={titleStyle}>{name}</div>
        <div style={descStyle}>{description}</div>
    </div>
);