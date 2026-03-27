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
        <h2 style={styles.title}>Sign in</h2>
        {error && <p style={styles.err}>{typeof error === 'string' ? error : 'Invalid credentials'}</p>}
        <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
          <label style={styles.label}>Email or Username</label>
          <input style={styles.input} {...register('username', { required: 'Required' })} placeholder="you@example.com"/>
          {errors.username && <span style={styles.fieldErr}>{errors.username.message}</span>}

          <label style={styles.label}>Password</label>
          <input type="password" style={styles.input} {...register('password', { required: 'Required', minLength: { value: 6, message: 'Min 6 characters' } })} placeholder="••••••"/>
          {errors.password && <span style={styles.fieldErr}>{errors.password.message}</span>}

          <button style={styles.btn} disabled={status === 'loading'}>
            {status === 'loading' ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 12, fontSize: 14 }}>
          No account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
 
const styles = {
  page:     { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f5f5f5' },
  card:     { background:'#fff', borderRadius:12, padding:'2rem', width:'100%', maxWidth:400, boxShadow:'0 2px 16px rgba(0,0,0,.1)' },
  title:    { margin:'0 0 1rem', fontSize:22, fontWeight:500 },
  form:     { display:'flex', flexDirection:'column', gap:6 },
  label:    { fontSize:13, color:'#555', marginBottom:2 },
  input:    { padding:'10px 12px', border:'1px solid #ddd', borderRadius:8, fontSize:15, outline:'none' },
  btn:      { marginTop:12, padding:'11px', background:'#4f46e5', color:'#fff', border:'none', borderRadius:8, fontSize:15, cursor:'pointer' },
  err:      { background:'#fee2e2', color:'#b91c1c', padding:'8px 12px', borderRadius:8, marginBottom:8, fontSize:13 },
  fieldErr: { color:'#b91c1c', fontSize:12 },
};