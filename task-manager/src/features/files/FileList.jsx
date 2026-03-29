import { useDispatch, useSelector } from 'react-redux';
import { generateDownloadUrl } from './filesSlice';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function FileList({ onDownloadCompleted }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
      {status === 'loading' && <div className="empty-state"><p>Loading files…</p></div>}
      {status === 'failed' && <div className="empty-state" style={{borderColor: 'var(--danger)', color: 'var(--danger)'}}><p>{typeof error === 'string' ? error : 'Failed to load files'}</p></div>}
      {status === 'succeeded' && list.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📁</div>
          <p>No files uploaded yet.</p>
        </div>
      )}

      {list.map((f) => (
        <div key={f.id} style={styles.row}>
          <div style={{ flex: 1 }}>
            <div style={styles.name}>{f.name?.split('/').pop() || f.name}</div>
            <div style={styles.meta}>
              {f.content_type} • {(typeof f.size === 'number' ? f.size : 0)} bytes
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              style={styles.viewBtn}
              onClick={() => navigate(`/dashboard/file/${f.id}`)}
            >
              View
            </button>
            <button
              style={styles.downloadBtn}
              onClick={() => handleDownload(f.id)}
              disabled={downloadingId === f.id}
            >
              {downloadingId === f.id ? 'Preparing…' : 'Download'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  row: { display: 'flex', gap: 12, alignItems: 'center', background: 'var(--bg-surface)', padding: '16px 20px', borderRadius: 10, marginBottom: 12, boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' },
  name: { fontWeight: 500, fontSize: 15, marginBottom: 4, wordBreak: 'break-word', color: 'var(--text-primary)' },
  meta: { fontSize: 13, color: 'var(--text-secondary)' },
  viewBtn: { padding: '8px 14px', background: 'var(--success)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', fontSize: 13, whiteSpace: 'nowrap', transition: 'all 0.2s', fontWeight: 500 },
  downloadBtn: { padding: '8px 14px', background: 'var(--bg-surface-hover)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', fontSize: 13, whiteSpace: 'nowrap', transition: 'all 0.2s', fontWeight: 500 },
};

