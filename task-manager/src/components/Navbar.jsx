import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);
  const displayName = user?.first_name || user?.username || 'User';

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <span style={styles.logo}>TaskApp</span>
      <div style={styles.right}>
        <span style={styles.userText}>Hi, {displayName}</span>
        <button style={styles.btn} onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

const styles = {
  nav:  { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 24px', height:64, background:'var(--bg-surface)', borderBottom:'1px solid var(--border)', color:'var(--text-primary)' },
  logo: { fontSize:20, fontWeight:700, color:'var(--accent)', letterSpacing: 0.5 },
  right: { display:'flex', alignItems:'center', gap:16 },
  userText: { fontSize:14, color:'var(--text-secondary)' },
  btn:  { background:'var(--bg-surface-hover)', color:'var(--text-primary)', border:'1px solid var(--border)', borderRadius:8, padding:'8px 16px', cursor:'pointer', fontSize:14, fontWeight: 500 },
};