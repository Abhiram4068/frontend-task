import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFiles, generateDownloadUrl } from './filesSlice';

export default function FileDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { list, status } = useSelector((s) => s.files);
  const [downloading, setDownloading] = useState(false);

  const file = list.find((f) => f.id === Number(id) || f.id === id);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchFiles());
    }
  }, [status, dispatch]);

  const handleDownload = async () => {
    if (!file) return;
    try {
      setDownloading(true);
      const action = await dispatch(generateDownloadUrl(file.id));
      if (generateDownloadUrl.fulfilled.match(action) && action.payload) {
        const url = action.payload;
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    } finally {
      setDownloading(false);
    }
  };

  if (status === 'loading') {
    return <div className="empty-state" style={{ flex: 1, margin: 32 }}><p>Loading file details...</p></div>;
  }

  if (!file && status === 'succeeded') {
    return (
      <div style={{ flex: 1, padding: 32 }}>
        <button style={styles.backBtn} onClick={() => navigate('/dashboard/files/files')}>← Back to Files</button>
        <div className="empty-state">
          <p>File not found.</p>
        </div>
      </div>
    );
  }

  if (!file) return null;

  return (
    <div style={{ flex: 1, padding: 32, overflowY: 'auto' }}>
      <button style={styles.backBtn} onClick={() => navigate('/dashboard/files/files')}>← Back to Files</button>
      
      <div style={styles.card}>
        <div style={styles.headerRow}>
          <h2 style={styles.title}>{file.name?.split('/').pop() || file.name}</h2>
          <button
            style={styles.downloadPrimaryBtn}
            onClick={handleDownload}
            disabled={downloading}
          >
            {downloading ? 'Preparing…' : '↓ Download File'}
          </button>
        </div>
        
        <div style={styles.metaBox}>
          <p style={styles.metaText}>
            <strong style={styles.metaLabel}>File Type:</strong> 
            {file.content_type || 'Unknown'}
          </p>
          <p style={styles.metaText}>
            <strong style={styles.metaLabel}>Size:</strong> 
            {typeof file.size === 'number' ? `${(file.size / 1024).toFixed(2)} KB` : 'Unknown'}
          </p>
          {file.uploaded_at && (
            <p style={styles.metaText}>
              <strong style={styles.metaLabel}>Uploaded at:</strong> 
              {new Date(file.uploaded_at).toLocaleString() !== 'Invalid Date' ? new Date(file.uploaded_at).toLocaleString() : file.uploaded_at}
            </p>
          )}
          {file.uploaded_by && (
            <p style={styles.metaText}>
              <strong style={styles.metaLabel}>Uploaded by:</strong> 
              {file.uploaded_by}
            </p>
          )}
          {file.uploaded_by && (
            <p style={styles.metaText}>
              <strong style={styles.metaLabel}>Uploaded at:</strong> 
              {file.created_at}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  backBtn: { background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-secondary)', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', marginBottom: '24px', fontSize: '14px', transition: 'background-color 0.2s', fontWeight: 500 },
  card: { background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '36px', boxShadow: 'var(--shadow-md)' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', borderBottom: '1px solid var(--border)', paddingBottom: '24px', gap: 16 },
  title: { margin: 0, fontSize: '28px', color: 'var(--text-primary)', fontWeight: 600, wordBreak: 'break-word', lineHeight: 1.3 },
  downloadPrimaryBtn: { padding: '12px 24px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: 600, boxShadow: 'var(--shadow-sm)', whiteSpace: 'nowrap', transition: 'opacity 0.2s' },
  metaBox: { display: 'flex', flexDirection: 'column', gap: '14px', background: 'var(--bg-base)', padding: '24px', borderRadius: '10px', border: '1px solid var(--border)' },
  metaText: { margin: 0, fontSize: '15px', color: 'var(--text-secondary)', display: 'flex', gap: 8 },
  metaLabel: { color: 'var(--text-primary)', minWidth: '94px', display: 'inline-block' }
};
