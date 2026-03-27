import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFiles } from './filesSlice';
import FileUploadForm from './FileUploadForm';
import FileList from './FileList';

export default function FilesManager({ mode = 'files', onChangeView }) {
  const dispatch = useDispatch();
  const { status } = useSelector((s) => s.files);

  useEffect(() => {
    dispatch(fetchFiles());
  }, [dispatch]);

  return (
    <div style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 500 }}>
          {mode === 'upload' ? 'Upload Files' : 'My Files'}
        </h2>
        {mode !== 'upload' && (
          <button
            style={styles.addBtn}
            onClick={() => onChangeView?.('upload')}
          >
            + Upload
          </button>
        )}
      </div>

      {mode === 'upload' && (
        <FileUploadForm
          onUploaded={() => {
            onChangeView?.('files');
          }}
        />
      )}

      <FileList />
      {status === 'idle' && null}
    </div>
  );
}

const styles = {
  addBtn: { padding: '8px 18px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14 },
};

