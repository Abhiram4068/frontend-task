import React, { useState } from 'react'; // Added useState
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteTask } from './tasksSlice';

export default function TaskItem({ task, onEdit }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false); // State for the modal
  const isCompleted = Boolean(task.is_completed);

  const handleDelete = () => {
    dispatch(deleteTask(task.id));
    setShowConfirm(false);
  };

  return (
    <div style={styles.card}>
      <div style={{ flex: 1 }}>
        <div style={styles.row}>
        <span style={{ ...styles.title, opacity: isCompleted ? 0.8 : 1 }}>{task.title}</span>
          <span style={{ ...styles.badge, background: isCompleted ? 'var(--success-bg)' : 'var(--warning-bg)', color: isCompleted ? 'var(--success)' : 'var(--warning)' }}>
            {isCompleted ? 'completed' : 'to be completed'}
          </span>
        </div>
        {task.description && <p style={styles.desc}>{task.description}</p>}
        {task.created_at && <p style={styles.desc}>{task.created_at }</p>}
      </div>
      <div style={styles.actions}>
        <button style={styles.viewBtn} onClick={() => navigate(`/dashboard/task/${task.id}`)}>View</button>
        <button style={styles.editBtn} onClick={() => onEdit(task)}>Edit</button>
        <button
          style={styles.delBtn}
          onClick={() => setShowConfirm(true)} // Opens the modal
        >
          Delete
        </button>
      </div>

      {/* --- Delete Confirmation Modal --- */}
      {showConfirm && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: 18, color: 'var(--text-primary)' }}>Delete Task?</h4>
            <p style={{ margin: '0 0 20px 0', fontSize: 14, color: 'var(--text-secondary)' }}>
              Are you sure you want to remove "<strong>{task.title}</strong>"? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button 
                style={styles.cancelBtn} 
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button 
                style={styles.confirmDelBtn} 
                onClick={handleDelete}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  card:    { background:'var(--bg-surface)', borderRadius:10, padding:'16px 20px', marginBottom:12, boxShadow:'var(--shadow-sm)', display:'flex', alignItems:'flex-start', gap:12, position: 'relative', border: '1px solid var(--border)' },
  row:     { display:'flex', alignItems:'center', gap:10, marginBottom:8 },
  title:   { fontWeight:500, fontSize:15, color: 'var(--text-primary)' },
  desc:    { fontSize:13, color:'var(--text-secondary)', margin:0 },
  badge:   { padding:'4px 12px', borderRadius:20, fontSize:11, fontWeight:600, textTransform: 'uppercase', letterSpacing: 0.5 },
  actions: { display:'flex', gap:8, flexShrink:0 },
  viewBtn: { padding:'6px 14px', background:'var(--success)', color:'var(--text-primary)', border:'1px solid var(--border)', borderRadius:8, cursor:'pointer', fontSize:13, transition: 'all 0.2s', fontWeight: 500 },
  editBtn: { padding:'6px 14px', background:'var(--bg-surface-hover)', color:'var(--text-primary)', border:'1px solid var(--border)', borderRadius:8, cursor:'pointer', fontSize:13, transition: 'all 0.2s', fontWeight: 500 },
  delBtn:  { padding:'6px 14px', background:'var(--danger-bg)', color:'var(--danger)', border:'none', borderRadius:8, cursor:'pointer', fontSize:13, transition: 'all 0.2s', fontWeight: 500 },
  
  // New Modal Styles
  modalOverlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
  },
  modalContent: {
    background: 'var(--bg-surface)', border: '1px solid var(--border)', padding: 24, borderRadius: 12, width: '90%', maxWidth: 350, boxShadow: 'var(--shadow-lg)'
  },
  cancelBtn: { padding: '8px 16px', background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500 },
  confirmDelBtn: { padding: '8px 16px', background: 'var(--danger)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500 },
};