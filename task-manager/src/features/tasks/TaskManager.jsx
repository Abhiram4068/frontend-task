import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchTasks } from './tasksSlice';
import TaskForm from './TaskForm';
import TaskItem from './TaskItem';

export default function TaskManager() {
  const { view: activeView = 'all' } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { list, status, error } = useSelector((s) => s.tasks);
  const [editingTask, setEditingTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
 
  useEffect(() => { dispatch(fetchTasks()); }, [dispatch]);
  useEffect(() => {
    if (activeView === 'add') {
      setEditingTask(null);
      setShowForm(true);
    } else {
      setEditingTask(null);
      setShowForm(false);
    }
  }, [activeView]);

  const handleEdit = (task) => { setEditingTask(task); setShowForm(true); };
  const handleDone = () => {
    setEditingTask(null);
    setShowForm(false);
    if (activeView === 'add') navigate('/dashboard/tasks/all');
  };

  const filteredTasks = list.filter((task) => {
    if (activeView === 'pending' && Boolean(task.is_completed)) return false;
    if (activeView === 'completed' && !task.is_completed) return false;
    
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title?.toLowerCase().includes(q);
      const matchDesc = task.description?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc) return false;
    }
    return true;
  });

  const titleByView = {
    all: 'My Tasks',
    add: 'Add Task',
    pending: 'Pending Tasks',
    completed: 'Completed Tasks',
  };

  return (
    <div style={{ flex:1, padding:32, overflowY:'auto' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <h2 style={{ margin:0, fontSize:24, fontWeight:600 }}>{titleByView[activeView] || 'My Tasks'}</h2>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <input 
            type="text" 
            placeholder="Search tasks..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            style={styles.searchInput} 
          />
          <button
            style={styles.addBtn}
            onClick={() => {
              setEditingTask(null);
              setShowForm(true);
              navigate('/dashboard/tasks/add');
            }}
          >
            + New Task
          </button>
        </div>
      </div>

      {showForm && <TaskForm editing={editingTask} onDone={handleDone}/>}

      {status === 'loading' && <div className="empty-state"><p>Loading tasks…</p></div>}
      {status === 'failed' && <div className="empty-state" style={{borderColor: 'var(--danger)', color: 'var(--danger)'}}><p>{typeof error === 'string' ? error : 'Failed to load tasks'}</p></div>}
      {status === 'succeeded' && filteredTasks.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <p>No tasks found in this view.</p>
        </div>
      )}
      {filteredTasks.map((task) => <TaskItem key={task.id} task={task} onEdit={handleEdit}/>)}
    </div>
  );
}

const styles = {
  addBtn: { padding:'10px 20px', background:'var(--accent)', color:'var(--text-primary)', border:'none', borderRadius:8, cursor:'pointer', fontSize:14, fontWeight: 500, boxShadow: 'var(--shadow-sm)', whiteSpace: 'nowrap' },
  searchInput: { padding: '10px 14px', border: '1px solid var(--border)', background: 'var(--bg-base)', color: 'var(--text-primary)', borderRadius: 8, fontSize: 14, outline: 'none', transition: 'border-color 0.2s', width: 250, boxSizing: 'border-box', fontFamily: 'inherit' },
};