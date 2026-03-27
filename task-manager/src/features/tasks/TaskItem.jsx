import React, { useState } from 'react'; // Added useState
import { useDispatch } from 'react-redux';
import { deleteTask } from './tasksSlice';

export default function TaskItem({ task, onEdit }) {
  const dispatch = useDispatch();
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
          <span style={{ ...styles.title, textDecoration: isCompleted ? 'line-through' : 'none', opacity: isCompleted ? 0.8 : 1 }}>
            {task.title}
          </span>
          <span style={{ ...styles.badge, background: isCompleted ? '#dcfce7' : '#fef9c3', color: isCompleted ? '#166534' : '#854d0e' }}>
            {isCompleted ? 'completed' : 'pending'}
          </span>
        </div>
        {task.description && <p style={styles.desc}>{task.description}</p>}
        {task.created_at && <p style={styles.desc}>{task.created_at }</p>}
      </div>
      <div style={styles.actions}>
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
            <h4 style={{ margin: '0 0 10px 0', fontSize: 16 }}>Delete Task?</h4>
            <p style={{ margin: '0 0 20px 0', fontSize: 14, color: '#666' }}>
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
  card:    { background:'#fff', borderRadius:10, padding:'14px 16px', marginBottom:10, boxShadow:'0 1px 6px rgba(0,0,0,.07)', display:'flex', alignItems:'flex-start', gap:12, position: 'relative' },
  row:     { display:'flex', alignItems:'center', gap:10, marginBottom:4 },
  title:   { fontWeight:500, fontSize:15 },
  desc:    { fontSize:13, color:'#555', margin:0 },
  badge:   { padding:'2px 10px', borderRadius:20, fontSize:12, fontWeight:500 },
  actions: { display:'flex', gap:6, flexShrink:0 },
  editBtn: { padding:'5px 12px', background:'#ede9fe', color:'#4f46e5', border:'none', borderRadius:8, cursor:'pointer', fontSize:13 },
  delBtn:  { padding:'5px 12px', background:'#fee2e2', color:'#b91c1c', border:'none', borderRadius:8, cursor:'pointer', fontSize:13 },
  
  // New Modal Styles
  modalOverlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
  },
  modalContent: {
    background: '#fff', padding: 20, borderRadius: 12, width: '90%', maxWidth: 350, boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
  },
  cancelBtn: { padding: '8px 16px', background: '#f3f4f6', color: '#4b5563', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500 },
  confirmDelBtn: { padding: '8px 16px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500 },
};