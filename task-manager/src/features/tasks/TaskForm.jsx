import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { createTask, fetchTasks, updateTask } from './tasksSlice';

export default function TaskForm({ editing, onDone }) {
  const dispatch = useDispatch();
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: editing || { title: '', description: '', is_completed: false },
  });

  useEffect(() => {
    reset(editing || { title: '', description: '', is_completed: false });
  }, [editing, reset]);

  const onSubmit = async (data) => {
    const payload = {
      title: data.title,
      description: data.description || '',
      is_completed: data.is_completed === true || data.is_completed === 'on',
    };

    let result;
    if (editing) {
      result = await dispatch(updateTask({ id: editing.id, data: payload }));
    } else {
      result = await dispatch(createTask(payload));
    }

    if (result.meta.requestStatus === 'fulfilled') {
      await dispatch(fetchTasks());
      reset();
      onDone?.();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
      <input style={styles.input} placeholder="Task title *"
        {...register('title', { required: 'Title is required', maxLength: { value: 100, message: 'Max 100 characters' } })}/>
      {errors.title && <span style={styles.err}>{errors.title.message}</span>}

      <textarea style={{ ...styles.input, height:72, resize:'vertical' }} placeholder="Description (optional)"
        {...register('description')}/>

      <label style={styles.checkboxRow}>
        <input
  type="checkbox"
  {...register('is_completed')}
  defaultChecked={!!(editing?.is_completed)}
/>
        Mark as completed
      </label>

      <div style={{ display:'flex', gap:8 }}>
        <button type="submit" style={styles.btn}>{editing ? 'Update' : 'Add Task'}</button>
        {editing && <button type="button" style={styles.cancel} onClick={onDone}>Cancel</button>}
      </div>
    </form>
  );
}

const styles = {
  form:   { display:'flex', flexDirection:'column', gap:16, background:'var(--bg-surface)', padding:24, borderRadius:12, marginBottom:24, boxShadow:'var(--shadow-md)', border: '1px solid var(--border)' },
  input:  { padding:'12px 14px', border:'1px solid var(--border)', background: 'var(--bg-base)', color: 'var(--text-primary)', borderRadius:8, fontSize:14, width:'100%', boxSizing:'border-box', transition: 'border-color 0.2s', fontFamily: 'inherit' },
  checkboxRow: { display:'flex', alignItems:'center', gap:10, fontSize:14, color:'var(--text-primary)', marginTop:8, cursor: 'pointer' },
  btn:    { padding:'12px 24px', background:'var(--accent)', color:'#fff', border:'none', borderRadius:8, cursor:'pointer', fontSize:14, fontWeight: 600, boxShadow: 'var(--shadow-sm)' },
  cancel: { padding:'12px 24px', background:'transparent', color:'var(--text-primary)', border:'1px solid var(--border)', borderRadius:8, cursor:'pointer', fontSize:14, fontWeight: 500 },
  err:    { color:'var(--danger)', fontSize:12, marginTop: -8 },
};