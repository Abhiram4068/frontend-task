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
  nav:  { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 24px', height:56, background:'#4f46e5', color:'#fff' },
  logo: { fontSize:18, fontWeight:500 },
  right: { display:'flex', alignItems:'center', gap:12 },
  userText: { fontSize:14, opacity:0.95 },
  btn:  { background:'rgba(255,255,255,.2)', color:'#fff', border:'none', borderRadius:8, padding:'6px 16px', cursor:'pointer', fontSize:14 },
};