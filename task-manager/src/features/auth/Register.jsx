// src/features/auth/Register.jsx
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from './authSlice';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((s) => s.auth);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const result = await dispatch(registerUser(data)); // sends all fields as-is
    if (registerUser.fulfilled.match(result)) navigate('/login');
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create account</h2>

        {/* Server-side errors from Django */}
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

          {/* Username */}
          <label style={styles.label}>Username *</label>
          <input
            style={styles.input}
            placeholder="johndoe"
            {...register('username', {
              required: 'Username is required',
              minLength: { value: 3, message: 'Min 3 characters' },
            })}
          />
          {errors.username && <span style={styles.fieldErr}>{errors.username.message}</span>}

          {/* First name */}
          <label style={styles.label}>First name *</label>
          <input
            style={styles.input}
            placeholder="John"
            {...register('first_name', {
              required: 'First name is required',
            })}
          />
          {errors.first_name && <span style={styles.fieldErr}>{errors.first_name.message}</span>}

          {/* Last name (optional — matches required:False in serializer) */}
          <label style={styles.label}>Last name <span style={styles.optional}>(optional)</span></label>
          <input
            style={styles.input}
            placeholder="Doe"
            {...register('last_name')}
          />

          {/* Password */}
          <label style={styles.label}>Password *</label>
          <input
            type="password"
            style={styles.input}
            placeholder="Min 8 characters"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'Min 8 characters' }, // matches serializer min_length
            })}
          />
          {errors.password && <span style={styles.fieldErr}>{errors.password.message}</span>}

          {/* Confirm password */}
          <label style={styles.label}>Confirm password *</label>
          <input
            type="password"
            style={styles.input}
            placeholder="Repeat password"
            {...register('confirm_password', {
              required: 'Please confirm your password',
              minLength: { value: 8, message: 'Min 8 characters' },
              validate: (v) => v === watch('password') || 'Passwords do not match',
            })}
          />
          {errors.confirm_password && (
            <span style={styles.fieldErr}>{errors.confirm_password.message}</span>
          )}

          <button style={styles.btn} disabled={status === 'loading'}>
            {status === 'loading' ? 'Creating…' : 'Create account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 12, fontSize: 14 }}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page:     { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' },
  card:     { background: '#fff', borderRadius: 12, padding: '2rem', width: '100%', maxWidth: 420, boxShadow: '0 2px 16px rgba(0,0,0,.1)' },
  title:    { margin: '0 0 1rem', fontSize: 22, fontWeight: 500 },
  form:     { display: 'flex', flexDirection: 'column', gap: 6 },
  label:    { fontSize: 13, color: '#555', marginBottom: 2 },
  optional: { color: '#aaa', fontWeight: 400 },
  input:    { padding: '10px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 15, outline: 'none', boxSizing: 'border-box', width: '100%' },
  btn:      { marginTop: 12, padding: 11, background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, cursor: 'pointer' },
  errBox:   { background: '#fee2e2', color: '#b91c1c', padding: '10px 12px', borderRadius: 8, marginBottom: 10, fontSize: 13 },
  fieldErr: { color: '#b91c1c', fontSize: 12, marginTop: 2 },
};