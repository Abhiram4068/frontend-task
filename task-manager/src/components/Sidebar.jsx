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

export default function Sidebar({ activeView, onChangeView }) {
  return (
    <aside style={styles.aside}>
      <p style={styles.section}>Tasks</p>
      {links.map((l) => (
        <button
          key={l.key}
          type="button"
          onClick={() => onChangeView?.(l.key)}
          style={{ ...styles.link, ...(activeView === l.key ? styles.active : {}) }}
        >
          {l.label}
        </button>
      ))}
      <br></br>
      <p style={styles.section}>Files</p>
      {files.map((f) => (
        <button
          key={f.key}
          type="button"
          onClick={() => onChangeView?.(f.key)}
          style={{ ...styles.link, ...(activeView === f.key ? styles.active : {}) }}
        >
          {f.label}
        </button>
      ))}

    </aside>
  );
}

const styles = {
  aside:   { width:220, minHeight:'100%', background:'#f9f9fb', borderRight:'1px solid #eee', padding:'24px 0' },
  section: { fontSize:11, fontWeight:500, color:'#888', textTransform:'uppercase', letterSpacing:1, padding:'0 20px', margin:'0 0 8px' },
  link:    { display:'block', width:'100%', textAlign:'left', padding:'9px 20px', color:'#333', border:'none', background:'transparent', borderRadius:0, fontSize:14, cursor:'pointer' },
  active:  { background:'#ede9fe', color:'#4f46e5', fontWeight:500 },
};