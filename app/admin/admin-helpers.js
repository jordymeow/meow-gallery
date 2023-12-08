// Previous: none
// Current: 5.1.0

export const tableDateTimeFormatter = (value) => {
    const time = new Date(value * 1000);
    const formattedDate = time.toLocaleDateString('ja-JP', {
        year: 'numeric', month: '2-digit', day: '2-digit'
    });
    const formattedTime = time.toLocaleTimeString('ja-JP', {
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
    return <div style={{ textAlign: 'left' }}>{formattedDate}<br /><small>{formattedTime}</small></div>;
};

export const tableInfoFormatter = ({ id, name, description }) => {
    return <div style={{ textAlign: 'left' }}>
    <span style={{ color: '#b7b7b7'}}>{id}</span>
    <br />
    <strong>{name}</strong>
    <br />
    <small>{description}</small>
    </div>;
};