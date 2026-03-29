import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from './authSlice';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((s) => s.auth);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    const result = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(result)) navigate('/dashboard');
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Login to continue</p>
        {error && <p style={styles.err}>{typeof error === 'string' ? error : 'Invalid credentials'}</p>}
        <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
          <label style={styles.label}>Username</label>
          <input style={styles.input} {...register('username', { required: 'Required' })} placeholder="you@example.com"/>
          {errors.username && <span style={styles.fieldErr}>{errors.username.message}</span>}

          <label style={styles.label}>Password</label>
          <input type="password" style={styles.input} {...register('password', { required: 'Required', minLength: { value: 6, message: 'Min 6 characters' } })} placeholder="••••••"/>
          {errors.password && <span style={styles.fieldErr}>{errors.password.message}</span>}

          <button style={styles.btn} disabled={status === 'loading'}>
            {status === 'loading' ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14 }}>
          No account? <Link to="/register" style={{ color: '#007bff', textDecoration: 'none' }}>Register</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page:     { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg-base)' },
  card:     { 
    background:'var(--bg-surface)', 
    borderRadius: 10, 
    padding: '60px 45px', 
    width: '90%', 
    maxWidth: 480,       
    border: '0.2px solid #928a8aff' 
  },
  // Adjusted margin-bottom to make room for subtitle
  title:    { margin:'0 0 8px', fontSize:28, fontWeight:600, color: '#ffffff', textAlign: 'center' },
  // New style for the smaller text
  subtitle: { margin:'0 0 32px', fontSize:16, color: '#94a3b8', textAlign: 'center' },
  form:     { display:'flex', flexDirection:'column', gap: 20 }, 
  label:    { fontSize:14, color:'#94a3b8', marginBottom:4 },
  input:    { 
    padding:'14px 16px', 
    border:'1px solid #2a2e39', 
    background: '#0f1115', 
    color: '#ffffff', 
    borderRadius:8, 
    fontSize:15, 
    outline:'none', 
    transition: 'border-color 0.2s', 
    fontFamily: 'inherit' 
  },
  btn:      { 
    marginTop: 10, 
    padding: '14px', 
    background: '#007bff', 
    color: '#ffffff', 
    border: 'none', 
    borderRadius: 8, 
    fontSize: 16, 
    cursor: 'pointer', 
    fontWeight: 600, 
  },
  err:      { background:'rgba(248, 113, 113, 0.15)', color:'#f87171', padding:'12px 16px', borderRadius:8, marginBottom:16, fontSize:14 },
  fieldErr: { color:'#f87171', fontSize:12, marginTop: -12 },
};