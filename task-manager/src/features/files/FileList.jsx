import { useDispatch, useSelector } from 'react-redux';
import { generateDownloadUrl } from './filesSlice';
import { useState } from 'react';

export default function FileList({ onDownloadCompleted }) {
  const dispatch = useDispatch();
  const { list, status, error } = useSelector((s) => s.files);
  const [downloadingId, setDownloadingId] = useState(null);

  const handleDownload = async (fileId) => {
    try {
      setDownloadingId(fileId);
      const action = await dispatch(generateDownloadUrl(fileId));
      if (generateDownloadUrl.fulfilled.match(action) && action.payload) {
        const url = action.payload;
        window.open(url, '_blank', 'noopener,noreferrer');
        onDownloadCompleted?.();
      }
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div>
      {status === 'loading' && <p style={{ color: '#888' }}>Loading…</p>}
      {status === 'failed' && <p style={{ color: '#b91c1c' }}>{typeof error === 'string' ? error : 'Failed to load files'}</p>}
      {status === 'succeeded' && list.length === 0 && <p style={{ color: '#888' }}>No files uploaded yet.</p>}

      {list.map((f) => (
        <div key={f.id} style={styles.row}>
          <div style={{ flex: 1 }}>
            <div style={styles.name}>{f.name?.split('/').pop() || f.name}</div>
            <div style={styles.meta}>
              {f.content_type} • {(typeof f.size === 'number' ? f.size : 0)} bytes
            </div>
          </div>
          <button
            style={styles.downloadBtn}
            onClick={() => handleDownload(f.id)}
            disabled={downloadingId === f.id}
          >
            {downloadingId === f.id ? 'Preparing…' : 'Download'}
          </button>
        </div>
      ))}
    </div>
  );
}

const styles = {
  row: { display: 'flex', gap: 12, alignItems: 'center', background: '#fff', padding: '12px 14px', borderRadius: 10, marginBottom: 10, boxShadow: '0 1px 6px rgba(0,0,0,.07)' },
  name: { fontWeight: 500, fontSize: 14, marginBottom: 2, wordBreak: 'break-word' },
  meta: { fontSize: 12, color: '#666' },
  downloadBtn: { padding: '8px 14px', background: '#ede9fe', color: '#4f46e5', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, whiteSpace: 'nowrap' },
};

