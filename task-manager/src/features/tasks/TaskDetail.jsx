import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTasks } from './tasksSlice';

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { list, status } = useSelector((s) => s.tasks);

  // Allow matching numeric ID vs string ID from URL
  const task = list.find((t) => t.id === Number(id) || t.id === id);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTasks());
    }
  }, [status, dispatch]);

  if (status === 'loading') {
    return <div className="empty-state" style={{ flex: 1, margin: 32 }}><p>Loading task details...</p></div>;
  }

  if (!task && status === 'succeeded') {
    return (
      <div style={{ flex: 1, padding: 32 }}>
        <button style={styles.backBtn} onClick={() => navigate('/dashboard/tasks/all')}>← Back to Tasks</button>
        <div className="empty-state">
          <p>Task not found.</p>
        </div>
      </div>
    );
  }

  if (!task) return null;

  const isCompleted = Boolean(task.is_completed);

  return (
    <div style={{ flex: 1, padding: 32, overflowY: 'auto' }}>
      <button style={styles.backBtn} onClick={() => navigate('/dashboard/tasks/all')}>← Back to Tasks</button>
      
      <div style={styles.card}>
        <div style={styles.headerRow}>
          <h2 style={styles.title}>{task.title}</h2>
          <span style={{ ...styles.badge, background: isCompleted ? 'var(--success-bg)' : 'var(--warning-bg)', color: isCompleted ? 'var(--success)' : 'var(--warning)' }}>
            {isCompleted ? 'completed' : 'to be completed'}
          </span>
        </div>
        
        <div style={styles.metaBox}>
          <p style={styles.metaText}>
            <strong style={styles.metaLabel}>Status:</strong> 
            {isCompleted ? 'Completed' : 'Pending'}
          </p>
          {task.created_at && (
            <p style={styles.metaText}>
              <strong style={styles.metaLabel}>Created at:</strong> 
              {new Date(task.created_at).toLocaleString() !== 'Invalid Date' ? new Date(task.created_at).toLocaleString() : task.created_at}
            </p>
          )}
          {task.created_by && (
            <p style={styles.metaText}>
              <strong style={styles.metaLabel}>Created by:</strong> 
              {task.created_by}
            </p>
          )}
        </div>

        <div style={styles.descBox}>
          <h4 style={styles.descTitle}>Description</h4>
          <p style={styles.descText}>{task.description || 'No description provided for this task.'}</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  backBtn: { background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-secondary)', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', marginBottom: '24px', fontSize: '14px', transition: 'background-color 0.2s', fontWeight: 500 },
  card: { background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '36px', boxShadow: 'var(--shadow-md)' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', borderBottom: '1px solid var(--border)', paddingBottom: '24px', gap: 16 },
  title: { margin: 0, fontSize: '28px', color: 'var(--text-primary)', fontWeight: 600, wordBreak: 'break-word', lineHeight: 1.3 },
  badge: { padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', flexShrink: 0 },
  metaBox: { display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px', background: 'var(--bg-base)', padding: '24px', borderRadius: '10px', border: '1px solid var(--border)' },
  metaText: { margin: 0, fontSize: '15px', color: 'var(--text-secondary)', display: 'flex', gap: 8 },
  metaLabel: { color: 'var(--text-primary)', minWidth: '90px', display: 'inline-block' },
  descBox: { marginTop: '16px' },
  descTitle: { margin: '0 0 16px 0', fontSize: '20px', color: 'var(--text-primary)', fontWeight: 600 },
  descText: { margin: 0, fontSize: '16px', color: 'var(--text-secondary)', lineHeight: '1.7', whiteSpace: 'pre-wrap' }
};
