import { useDispatch, useSelector } from 'react-redux';
import { uploadFiles } from './filesSlice';
import { useState } from 'react';

export default function FileUploadForm({ onUploaded }) {
  const dispatch = useDispatch();
  const { uploadStatus, error } = useSelector((s) => s.files);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFiles.length) return;

    const action = await dispatch(uploadFiles(selectedFiles));
    if (uploadFiles.fulfilled.match(action)) {
      setSelectedFiles([]);
      onUploaded?.();
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        style={styles.input}
        type="file"
        multiple
        onChange={(e) => setSelectedFiles(Array.from(e.target.files || []))}
      />
      <button type="submit" style={styles.btn} disabled={uploadStatus === 'loading'}>
        {uploadStatus === 'loading' ? 'Uploading…' : 'Upload'}
      </button>
      {typeof error === 'string' && uploadStatus === 'failed' && <p style={styles.err}>{error}</p>}
    </form>
  );
}

const styles = {
  form: { display: 'flex', flexDirection: 'column', gap: 10, background: '#fff', padding: 16, borderRadius: 10, marginBottom: 16, boxShadow: '0 1px 6px rgba(0,0,0,.07)' },
  input: { padding: '9px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, width: '100%', boxSizing: 'border-box' },
  btn: { padding: '9px 20px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, width: 'fit-content' },
  err: { color: '#b91c1c', margin: 0, fontSize: 13 },
};

