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
      is_completed: Boolean(data.is_completed),
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
        <input type="checkbox" {...register('is_completed')} />
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
  form:   { display:'flex', flexDirection:'column', gap:8, background:'#fff', padding:16, borderRadius:10, marginBottom:16, boxShadow:'0 1px 6px rgba(0,0,0,.07)' },
  input:  { padding:'9px 12px', border:'1px solid #ddd', borderRadius:8, fontSize:14, width:'100%', boxSizing:'border-box' },
  checkboxRow: { display:'flex', alignItems:'center', gap:8, fontSize:14, color:'#333', marginTop:2 },
  btn:    { padding:'9px 20px', background:'#4f46e5', color:'#fff', border:'none', borderRadius:8, cursor:'pointer', fontSize:14 },
  cancel: { padding:'9px 16px', background:'#f3f4f6', color:'#333', border:'none', borderRadius:8, cursor:'pointer', fontSize:14 },
  err:    { color:'#b91c1c', fontSize:12 },
};