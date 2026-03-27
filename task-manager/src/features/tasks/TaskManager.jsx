import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from './tasksSlice';
import TaskForm from './TaskForm';
import TaskItem from './TaskItem';

export default function TaskManager({ activeView = 'all', onChangeView }) {
  const dispatch = useDispatch();
  const { list, status, error } = useSelector((s) => s.tasks);
  const [editingTask, setEditingTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
 
  useEffect(() => { dispatch(fetchTasks()); }, [dispatch]);
  useEffect(() => {
    if (activeView === 'add') {
      setEditingTask(null);
      setShowForm(true);
    } else if (!editingTask) {
      setShowForm(false);
    }
  }, [activeView, editingTask]);

  const handleEdit = (task) => { setEditingTask(task); setShowForm(true); };
  const handleDone = () => {
    setEditingTask(null);
    setShowForm(false);
    if (activeView === 'add') onChangeView?.('all');
  };

  const filteredTasks = list.filter((task) => {
    if (activeView === 'pending') return !task.is_completed;
    if (activeView === 'completed') return Boolean(task.is_completed);
    return true;
  });

  const titleByView = {
    all: 'My Tasks',
    add: 'Add Task',
    pending: 'Pending Tasks',
    completed: 'Completed Tasks',
  };

  return (
    <div style={{ flex:1, padding:24, overflowY:'auto' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
        <h2 style={{ margin:0, fontSize:20, fontWeight:500 }}>{titleByView[activeView] || 'My Tasks'}</h2>
        <button
          style={styles.addBtn}
          onClick={() => {
            setEditingTask(null);
            setShowForm(true);
            onChangeView?.('add');
          }}
        >
          + New Task
        </button>
      </div>

      {showForm && <TaskForm editing={editingTask} onDone={handleDone}/>}

      {status === 'loading' && <p style={{ color:'#888' }}>Loading…</p>}
      {status === 'failed' && <p style={{ color:'#b91c1c' }}>{typeof error === 'string' ? error : 'Failed to load tasks'}</p>}
      {status === 'succeeded' && filteredTasks.length === 0 && <p style={{ color:'#888' }}>No tasks in this view.</p>}
      {filteredTasks.map((task) => <TaskItem key={task.id} task={task} onEdit={handleEdit}/>)}
    </div>
  );
}

const styles = {
  addBtn: { padding:'8px 18px', background:'#4f46e5', color:'#fff', border:'none', borderRadius:8, cursor:'pointer', fontSize:14 },
};