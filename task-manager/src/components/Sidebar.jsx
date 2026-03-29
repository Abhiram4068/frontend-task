import { useNavigate } from 'react-router-dom';

const links = [
  { key: 'all', label: 'My Tasks' },
  { key: 'add', label: 'Add Task' },
  { key: 'pending', label: 'Pending' },
  { key: 'completed', label: 'Completed' },
];
const files = [
  { key: 'files', label: 'My Files' },
  { key: 'upload', label: 'Upload Files' }
];

export default function Sidebar({ currentPath }) {
  const navigate = useNavigate();

  return (
    <aside style={styles.aside}>
      <p style={styles.section}>Tasks</p>
      {links.map((l) => {
        const path = `/dashboard/tasks/${l.key}`;
        const isActive = currentPath?.includes(path);
        return (
          <button
            key={l.key}
            type="button"
            onClick={() => navigate(path)}
            style={{ ...styles.link, ...(isActive ? styles.active : {}) }}
          >
            {l.label}
          </button>
        );
      })}
      <div style={styles.divider}></div>
      <p style={styles.section}>Files</p>
      {files.map((f) => {
        const path = `/dashboard/files/${f.key}`;
        const isActive = currentPath?.includes(path);
        return (
          <button
            key={f.key}
            type="button"
            onClick={() => navigate(path)}
            style={{ ...styles.link, ...(isActive ? styles.active : {}) }}
          >
            {f.label}
          </button>
        );
      })}
    </aside>
  );
}

const styles = {
  aside:   { width:240, minHeight:'100%', background:'var(--bg-surface)', borderRight:'1px solid var(--border)', padding:'24px 0' },
  section: { fontSize:12, fontWeight:600, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:1, padding:'0 20px', margin:'0 0 12px' },
  divider: { 
    height: '1px', 
    background: 'var(--border)', 
    width: '80%', 
    margin: '20px auto' 
  },
  link:    { display:'block', width:'100%', textAlign:'left', padding:'10px 20px', color:'var(--text-primary)', border:'none', background:'transparent', borderRadius:0, fontSize:15, cursor:'pointer', transition: 'background-color 0.2s, color 0.2s', borderLeft: '3px solid transparent' },
  active:  { background:'var(--accent-bg)', color:'var(--accent)', borderLeft:'3px solid var(--accent)', fontWeight:600 },
};