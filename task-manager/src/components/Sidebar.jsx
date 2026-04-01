import { useNavigate } from 'react-router-dom';

const links = [
  { path: '/dashboard/overview', label: 'Dashboard' },
  { path: '/dashboard/tasks/all', label: 'My Tasks' },
  { path: '/dashboard/tasks/add', label: 'Add Task' },
  { path: '/dashboard/tasks/pending', label: 'Pending' },
  { path: '/dashboard/tasks/completed', label: 'Completed' },
];
const files = [
  { path: '/dashboard/files/files', label: 'My Files' },
  { path: '/dashboard/files/upload', label: 'Upload Files' }
];

export default function Sidebar({ currentPath }) {
  const navigate = useNavigate();

  return (
    <aside style={styles.aside}>
      <p style={styles.section}>Tasks</p>
      {links.map((l) => {
        const isActive = currentPath?.includes(l.path) || (currentPath === '/dashboard' && l.path === '/dashboard/overview');
        return (
          <button
            key={l.path}
            type="button"
            onClick={() => navigate(l.path)}
            style={{ ...styles.link, ...(isActive ? styles.active : {}) }}
          >
            {l.label}
          </button>
        );
      })}
      <div style={styles.divider}></div>
      <p style={styles.section}>Files</p>
      {files.map((f) => {
        const isActive = currentPath?.includes(f.path);
        return (
          <button
            key={f.path}
            type="button"
            onClick={() => navigate(f.path)}
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