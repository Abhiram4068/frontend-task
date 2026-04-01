import { useDispatch, useSelector } from 'react-redux';
import { uploadFiles, fetchFiles } from './filesSlice';
import { useState } from 'react';

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "application/pdf",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",  
  "video/mp4"
];

export default function FileUploadForm({ onUploaded }) {
  const dispatch = useDispatch();
  const { uploadStatus, error } = useSelector((s) => s.files);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [localError, setLocalError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    if (!selectedFiles.length) return;

    // Immediate Client-Side Validation
    for (const file of selectedFiles) {
      if (file.size > MAX_SIZE) {
        setLocalError(`Error: "${file.name}" exceeds the 10MB limit.`);
        return;
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        setLocalError(`Error: "${file.name}" has an unsupported file type.`);
        return;
      }
    }

    const action = await dispatch(uploadFiles(selectedFiles));
    if (uploadFiles.fulfilled.match(action)) {
      dispatch(fetchFiles());
      setSelectedFiles([]);
      e.target.reset(); // Visually clear the file input
      onUploaded?.();
    }
  };

  // Helper to reliably extract error strings from backend DRF responses
  const renderBackendError = () => {
    if (uploadStatus !== 'failed' || !error) return null;
    
    // If it's just a raw string, return it directly
    if (typeof error === 'string') return error;
    
    // If it's a deeply nested DRF error object, recursively extract all strings
    if (typeof error === 'object' && error !== null) {
      const extractMessages = (obj) => {
        let msgs = [];
        for (const key in obj) {
          if (typeof obj[key] === 'string') {
            msgs.push(obj[key]);
          } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            msgs = msgs.concat(extractMessages(obj[key]));
          }
        }
        return msgs;
      };
      
      const messages = extractMessages(error);
      if (messages.length > 0) {
        return messages.join(' | ');
      }
    }
    return 'Failed to upload files due to server validation.';
  };

  const displayError = localError || renderBackendError();

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        style={styles.input}
        type="file"
        multiple
        onChange={(e) => {
          setLocalError(null);
          setSelectedFiles(Array.from(e.target.files || []));
        }}
      />
      <button type="submit" style={styles.btn} disabled={uploadStatus === 'loading'}>
        {uploadStatus === 'loading' ? 'Uploading…' : 'Upload Files'}
      </button>
      
      {displayError && (
        <div style={styles.errBox}>
          <p style={styles.errText}>{displayError}</p>
        </div>
      )}
    </form>
  );
}

const styles = {
  form: { display: 'flex', flexDirection: 'column', gap: 16, background: 'var(--bg-surface)', padding: 24, borderRadius: 12, marginBottom: 24, boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)' },
  input: { padding: '12px 14px', border: '1px solid var(--border)', background: 'var(--bg-base)', color: 'var(--text-primary)', borderRadius: 8, fontSize: 14, width: '100%', boxSizing: 'border-box', transition: 'border-color 0.2s', fontFamily: 'inherit' },
  btn: { padding: '12px 24px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, width: 'fit-content', fontWeight: 600, boxShadow: 'var(--shadow-sm)' },
  errBox: { background: 'rgba(248, 113, 113, 0.15)', padding: '12px 16px', borderRadius: 8, marginTop: 4, display: 'inline-block' },
  errText: { color: '#f87171', margin: 0, fontSize: 14, fontWeight: 500 },
};
