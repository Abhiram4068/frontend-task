import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchFiles } from './filesSlice';
import FileUploadForm from './FileUploadForm';
import FileList from './FileList';

export default function FilesManager() {
  const { mode = 'files' } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status } = useSelector((s) => s.files);

  useEffect(() => {
    dispatch(fetchFiles());
  }, [dispatch]);

  return (
    <div style={{ flex: 1, padding: 32, overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>
          {mode === 'upload' ? 'Upload Files' : 'My Files'}
        </h2>
        {mode !== 'upload' && (
          <button
            style={styles.addBtn}
            onClick={() => navigate('/dashboard/files/upload')}
          >
            + Upload
          </button>
        )}
      </div>

      {mode === 'upload' && (
        <FileUploadForm
          onUploaded={() => {
            navigate('/dashboard/files/files');
          }}
        />
      )}

      <FileList />
      {status === 'idle' && null}
    </div>
  );
}

const styles = {
  addBtn: { padding: '10px 20px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 500, boxShadow: 'var(--shadow-sm)' },
};

