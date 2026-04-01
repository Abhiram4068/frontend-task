import { useDispatch, useSelector } from 'react-redux';
import { generateDownloadUrl, deleteFile } from './filesSlice';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function FileList({ onDownloadCompleted }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list, status, error } = useSelector((s) => s.files);
  const [downloadingId, setDownloadingId] = useState(null);
  const [fileToDelete, setFileToDelete] = useState(null);

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
                      <button
              style={styles.deleteBtn}
              onClick={() => setFileToDelete(f)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {fileToDelete && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: 18, color: 'var(--text-primary)' }}>Delete File?</h4>
            <p style={{ margin: '0 0 20px 0', fontSize: 14, color: 'var(--text-secondary)' }}>
              Are you sure you want to remove "<strong>{fileToDelete.name?.split('/').pop() || fileToDelete.name}</strong>"? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button 
                style={styles.cancelBtn} 
                onClick={() => setFileToDelete(null)}
              >
                Cancel
              </button>
              <button 
                style={styles.confirmDelBtn} 
                onClick={() => {
                   dispatch(deleteFile(fileToDelete.id));
                   setFileToDelete(null);
                }}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  row: { display: 'flex', gap: 12, alignItems: 'center', background: 'var(--bg-surface)', padding: '16px 20px', borderRadius: 5, marginBottom: 12, boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' },
  name: { fontWeight: 500, fontSize: 15, marginBottom: 4, wordBreak: 'break-word', color: 'var(--text-primary)' },
  meta: { fontSize: 13, color: 'var(--text-secondary)' },
  viewBtn: { padding: '8px 14px', background: 'var(--success)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', fontSize: 13, whiteSpace: 'nowrap', transition: 'all 0.2s', fontWeight: 500 },
  downloadBtn: { padding: '8px 14px', background: 'var(--bg-surface-hover)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', fontSize: 13, whiteSpace: 'nowrap', transition: 'all 0.2s', fontWeight: 500 },
  deleteBtn: { padding: '8px 14px', background: 'var(--danger-bg)', color: 'var(--danger)', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, whiteSpace: 'nowrap', transition: 'all 0.2s', fontWeight: 500 },
  
  modalOverlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
  },
  modalContent: {
    background: 'var(--bg-surface)', border: '1px solid var(--border)', padding: 24, borderRadius: 12, width: '90%', maxWidth: 350, boxShadow: 'var(--shadow-lg)'
  },
  cancelBtn: { padding: '8px 16px', background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500 },
  confirmDelBtn: { padding: '8px 16px', background: 'var(--danger)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500 },
};
