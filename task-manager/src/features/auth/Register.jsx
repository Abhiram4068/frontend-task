// src/features/auth/Register.jsx
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from './authSlice';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((s) => s.auth);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    const result = await dispatch(registerUser(data));
    if (registerUser.fulfilled.match(result)) navigate('/login');
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create account</h2>
        <p style={styles.subtitle}>Register to get started</p>
        {error && (
          <div style={styles.errBox}>
            {typeof error === 'object'
              ? Object.entries(error).map(([field, msgs]) => (
                  <p key={field} style={{ margin: '2px 0' }}>
                    <strong>{field}:</strong> {Array.isArray(msgs) ? msgs[0] : msgs}
                  </p>
                ))
              : error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
          
          {/* Username - Full Width */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Username *</label>
            <input
              style={styles.input}
              placeholder="johndoe"
              {...register('username', { required: 'Required', minLength: 3 })}
            />
            {errors.username && <span style={styles.fieldErr}>{errors.username.message}</span>}
          </div>

          {/* First Name & Last Name - Side by Side */}
          <div style={styles.row}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>First name *</label>
              <input
                style={styles.input}
                placeholder="John"
                {...register('first_name', { required: 'Required' })}
              />
              {errors.first_name && <span style={styles.fieldErr}>{errors.first_name.message}</span>}
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Last name</label>
              <input
                style={styles.input}
                placeholder="Doe"
                {...register('last_name')}
              />
            </div>
          </div>

          {/* Password & Confirm Password - Side by Side */}
          <div style={styles.row}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Password *</label>
              <input
                type="password"
                style={styles.input}
                placeholder="Min 8 chars"
                {...register('password', { required: 'Required', minLength: 8 })}
              />
              {errors.password && <span style={styles.fieldErr}>{errors.password.message}</span>}
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Confirm *</label>
              <input
                type="password"
                style={styles.input}
                placeholder="Confirm password"
                {...register('confirm_password', {
                  required: 'Required',
                  validate: (v) => v === watch('password') || 'No match',
                })}
              />
              {errors.confirm_password && <span style={styles.fieldErr}>{errors.confirm_password.message}</span>}
            </div>
          </div>

          <button style={styles.btn} disabled={status === 'loading'}>
            {status === 'loading' ? 'Creating…' : 'Create account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14 }}>
          Already have an account? <Link to="/login" style={{ color: '#007bff', textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)', padding: '20px' },
  subtitle: { margin: '0 0 32px', fontSize: 16, color: '#94a3b8', textAlign: 'center' },
  card: { 
    background:'var(--bg-surface)',  borderRadius: 12, padding: '50px 40px', width: '100%', maxWidth: 600, // Widened to fit side-by-side fields
    border: '0.2px solid #928a8aff'
  },
  title: { margin: '0 0 8px', fontSize: 28, fontWeight: 600, color: '#ffffff', textAlign: 'center' },
  form: { display: 'flex', flexDirection: 'column', gap: 20 },
  
  // New Row and Group Styles
  row: { display: 'flex', gap: '15px', width: '100%' },
  fieldGroup: { display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 },
  
  label: { fontSize: 13, color: '#94a3b8', marginBottom: 6 },
  input: { 
    padding: '14px', border: '1px solid #2a2e39', background: '#0f1115', color: '#ffffff', 
    borderRadius: 8, fontSize: 15, outline: 'none', width: '100%', boxSizing: 'border-box'
  },
  btn: { marginTop: 10, padding: '14px', background: '#007bff', color: '#ffffff', border: 'none', borderRadius: 8, fontSize: 16, cursor: 'pointer', fontWeight: 600 },
  errBox: { background: 'rgba(248, 113, 113, 0.15)', color: '#f87171', padding: '12px', borderRadius: 8, marginBottom: 20, fontSize: 14 },
  fieldErr: { color: '#f87171', fontSize: 11, marginTop: 4 },
};